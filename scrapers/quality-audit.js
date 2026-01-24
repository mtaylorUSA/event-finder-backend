/**
 * scrapers/quality-audit.js
 * 
 * QUALITY AUDIT SCRIPT
 * 
 * Scans ALL organizations for quality issues:
 * - Duplicate organizations (by domain and name similarity)
 * - TOU restrictions
 * - Technical blocks
 * - JavaScript rendering requirements
 * 
 * For duplicates:
 * - Identifies which org has more data (events, filled fields)
 * - Flags the less complete org with duplicate_flag = true
 * - Sets duplicate_of relation to the better org
 * 
 * Usage:
 *   node scrapers/quality-audit.js                  # Full audit
 *   node scrapers/quality-audit.js --duplicates     # Duplicates only
 *   node scrapers/quality-audit.js --flags          # Flag issues only
 *   node scrapers/quality-audit.js --dry-run        # Report only, no DB updates
 * 
 * Last Updated: 2026-01-18
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Similarity thresholds
const NAME_SIMILARITY_THRESHOLD = 0.75;  // 75% similar names considered duplicates

// Module state
let authToken = null;
let fetchModule = null;

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        duplicatesOnly: false,
        flagsOnly: false,
        dryRun: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--duplicates':
                options.duplicatesOnly = true;
                break;
            case '--flags':
                options.flagsOnly = true;
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
════════════════════════════════════════════════════════════════
📋 QUALITY AUDIT SCRIPT
════════════════════════════════════════════════════════════════

USAGE:
  node scrapers/quality-audit.js [options]

OPTIONS:
  --duplicates    Check for duplicate organizations only
  --flags         Check for flag issues only (TOU, tech block, JS render)
  --dry-run       Report findings without updating database
  --help, -h      Show this help

EXAMPLES:
  # Full audit with database updates
  node scrapers/quality-audit.js
  
  # Check for duplicates only
  node scrapers/quality-audit.js --duplicates
  
  # Preview what would be updated (no changes)
  node scrapers/quality-audit.js --dry-run

DUPLICATE DETECTION:
  Checks for:
  • Same root domain (e.g., cnas.org = www.cnas.org)
  • Similar names (≥75% similarity)
  
  For each duplicate pair:
  • Compares event count, filled fields
  • Flags the less complete org
  • Sets duplicate_of relation

DATABASE FIELDS UPDATED:
  • duplicate_flag (Bool) - True if org is a duplicate
  • duplicate_of (Relation) - ID of the preferred org to keep

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION & AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

async function init() {
    if (fetchModule) return;
    fetchModule = (await import('node-fetch')).default;
    console.log('✅ Quality Audit initialized');
}

async function authenticate() {
    if (authToken) return authToken;
    
    await init();
    
    console.log('   🔐 Authenticating with PocketBase...');
    
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/admins/auth-with-password`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identity: POCKETBASE_ADMIN_EMAIL,
                    password: POCKETBASE_ADMIN_PASSWORD
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Auth failed: ${response.status}`);
        }
        
        const data = await response.json();
        authToken = data.token;
        console.log('   ✅ Authenticated');
        return authToken;
        
    } catch (error) {
        console.error(`   ❌ Authentication failed: ${error.message}`);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch ALL organizations from PocketBase
 */
async function getAllOrganizations() {
    await authenticate();
    
    const allOrgs = [];
    let page = 1;
    const perPage = 200;
    
    console.log('   📡 Fetching all organizations...');
    
    while (true) {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records?page=${page}&perPage=${perPage}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch organizations: ${response.status}`);
        }
        
        const data = await response.json();
        allOrgs.push(...data.items);
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    console.log(`   ✅ Fetched ${allOrgs.length} organizations`);
    return allOrgs;
}

/**
 * Get event count for an organization
 */
async function getEventCount(orgId) {
    await authenticate();
    
    try {
        const filter = encodeURIComponent(`organization = "${orgId}"`);
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter}&perPage=1`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.totalItems || 0;
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Update organization record
 */
async function updateOrganization(orgId, updates) {
    await authenticate();
    
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(updates)
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        
        return await response.json();
    } catch (error) {
        console.error(`   ❌ Update failed for ${orgId}: ${error.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract root domain from URL or domain string
 * Examples:
 *   "https://www.cnas.org/events" → "cnas.org"
 *   "csis.org" → "csis.org"
 *   "events.rand.org" → "rand.org"
 */
function extractRootDomain(url) {
    if (!url) return '';
    
    // Remove protocol
    let domain = url.replace(/^https?:\/\//, '').split('/')[0];
    
    // Remove port
    domain = domain.split(':')[0];
    
    // Split into parts
    const parts = domain.toLowerCase().split('.');
    
    // Handle simple cases
    if (parts.length <= 2) {
        return domain.toLowerCase();
    }
    
    // Handle common second-level TLDs
    const secondLevelTLDs = ['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'edu.au', 'com.au'];
    const lastTwo = parts.slice(-2).join('.');
    
    if (secondLevelTLDs.includes(lastTwo)) {
        return parts.slice(-3).join('.');
    }
    
    // Standard: return last two parts
    return parts.slice(-2).join('.');
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // deletion
                    dp[i][j - 1],     // insertion
                    dp[i - 1][j - 1]  // substitution
                );
            }
        }
    }
    
    return dp[m][n];
}

/**
 * Calculate name similarity (0-1, where 1 = identical)
 */
function calculateNameSimilarity(name1, name2) {
    if (!name1 || !name2) return 0;
    
    // Normalize: lowercase, remove common words, trim
    const normalize = (str) => {
        return str.toLowerCase()
            .replace(/\b(the|of|for|and|in|on|at|to|a|an)\b/g, '')
            .replace(/[^a-z0-9]/g, '')
            .trim();
    };
    
    const n1 = normalize(name1);
    const n2 = normalize(name2);
    
    if (n1 === n2) return 1;
    if (!n1 || !n2) return 0;
    
    const distance = levenshteinDistance(n1, n2);
    const maxLen = Math.max(n1.length, n2.length);
    
    return 1 - (distance / maxLen);
}

/**
 * Calculate "completeness score" for an organization
 * Higher = more data, prefer to keep
 */
function calculateCompletenessScore(org, eventCount) {
    let score = 0;
    
    // Events are most important
    score += eventCount * 10;
    
    // Status priority (Live orgs preferred)
    if (org.status === 'Live (Scraping Active)') score += 50;
    else if (org.status === 'Permission Granted (Not Live)') score += 40;
    else if (org.status === 'Permission Requested (Pending Org Response)') score += 30;
    else if (org.status === 'Mission Approved (Request Not Sent)') score += 20;
    else if (org.status === 'Nominated (Pending Mission Review)') score += 10;
    
    // Filled fields (1 point each)
    const fieldsToCheck = [
        'name', 'description', 'website', 'events_url', 'tou_url',
        'contact_email', 'ai_reasoning', 'org_type', 'last_scraped',
        'permission_type', 'permission_requested_date', 'mission_notes'
    ];
    
    for (const field of fieldsToCheck) {
        if (org[field]) score += 1;
    }
    
    // Recently scraped is good
    if (org.last_scraped) {
        const daysSinceScraped = (Date.now() - new Date(org.last_scraped)) / (1000 * 60 * 60 * 24);
        if (daysSinceScraped < 7) score += 5;
        else if (daysSinceScraped < 30) score += 2;
    }
    
    return score;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DUPLICATE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find all duplicate organization pairs
 */
async function findDuplicates(orgs) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔍 SCANNING FOR DUPLICATE ORGANIZATIONS');
    console.log('────────────────────────────────────────────────────────────────');
    
    const duplicatePairs = [];
    const processed = new Set();
    
    // Build domain map for quick lookup
    const domainMap = new Map();
    for (const org of orgs) {
        const domain = extractRootDomain(org.website);
        if (domain) {
            if (!domainMap.has(domain)) {
                domainMap.set(domain, []);
            }
            domainMap.get(domain).push(org);
        }
    }
    
    // Step 1: Find domain-based duplicates
    console.log('');
    console.log('   📡 Checking for same-domain duplicates...');
    
    for (const [domain, domainOrgs] of domainMap) {
        if (domainOrgs.length > 1) {
            // Multiple orgs with same domain
            for (let i = 0; i < domainOrgs.length; i++) {
                for (let j = i + 1; j < domainOrgs.length; j++) {
                    const pairKey = [domainOrgs[i].id, domainOrgs[j].id].sort().join('-');
                    if (!processed.has(pairKey)) {
                        processed.add(pairKey);
                        duplicatePairs.push({
                            org1: domainOrgs[i],
                            org2: domainOrgs[j],
                            matchType: 'domain',
                            matchDetail: domain,
                            similarity: 1.0
                        });
                        console.log(`      🔁 Domain match: "${domainOrgs[i].name}" ↔ "${domainOrgs[j].name}" (${domain})`);
                    }
                }
            }
        }
    }
    
    // Step 2: Find name-based duplicates
    console.log('');
    console.log('   📡 Checking for similar-name duplicates...');
    
    for (let i = 0; i < orgs.length; i++) {
        for (let j = i + 1; j < orgs.length; j++) {
            const pairKey = [orgs[i].id, orgs[j].id].sort().join('-');
            
            // Skip if already found via domain
            if (processed.has(pairKey)) continue;
            
            const similarity = calculateNameSimilarity(orgs[i].name, orgs[j].name);
            
            if (similarity >= NAME_SIMILARITY_THRESHOLD) {
                processed.add(pairKey);
                duplicatePairs.push({
                    org1: orgs[i],
                    org2: orgs[j],
                    matchType: 'name',
                    matchDetail: `${Math.round(similarity * 100)}% similar`,
                    similarity
                });
                console.log(`      🔁 Name match: "${orgs[i].name}" ↔ "${orgs[j].name}" (${Math.round(similarity * 100)}%)`);
            }
        }
    }
    
    console.log('');
    console.log(`   📊 Found ${duplicatePairs.length} potential duplicate pairs`);
    
    return duplicatePairs;
}

/**
 * Analyze duplicate pairs and determine which to keep
 */
async function analyzeDuplicates(duplicatePairs) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📊 ANALYZING DUPLICATE PAIRS');
    console.log('────────────────────────────────────────────────────────────────');
    
    const results = [];
    
    for (const pair of duplicatePairs) {
        // Get event counts for both
        const eventCount1 = await getEventCount(pair.org1.id);
        const eventCount2 = await getEventCount(pair.org2.id);
        
        // Calculate completeness scores
        const score1 = calculateCompletenessScore(pair.org1, eventCount1);
        const score2 = calculateCompletenessScore(pair.org2, eventCount2);
        
        // Determine which to keep (higher score wins)
        let keepOrg, flagOrg;
        if (score1 >= score2) {
            keepOrg = pair.org1;
            flagOrg = pair.org2;
        } else {
            keepOrg = pair.org2;
            flagOrg = pair.org1;
        }
        
        const result = {
            keepOrg,
            flagOrg,
            matchType: pair.matchType,
            matchDetail: pair.matchDetail,
            keepScore: Math.max(score1, score2),
            flagScore: Math.min(score1, score2),
            keepEventCount: keepOrg === pair.org1 ? eventCount1 : eventCount2,
            flagEventCount: flagOrg === pair.org1 ? eventCount1 : eventCount2
        };
        
        results.push(result);
        
        console.log('');
        console.log(`   ──────────────────────────────────────`);
        console.log(`   Match: ${pair.matchType} (${pair.matchDetail})`);
        console.log(`   ✅ KEEP: "${keepOrg.name}" (score: ${result.keepScore}, events: ${result.keepEventCount})`);
        console.log(`   ❌ FLAG: "${flagOrg.name}" (score: ${result.flagScore}, events: ${result.flagEventCount})`);
    }
    
    return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLAG ISSUES SCANNING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Summarize flag issues across all organizations
 */
function summarizeFlagIssues(orgs) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🚩 FLAG ISSUES SUMMARY');
    console.log('────────────────────────────────────────────────────────────────');
    
    const issues = {
        touFlag: [],
        techBlockFlag: [],
        techRenderingFlag: [],
        permissionDeniedFlag: [],
        duplicateFlag: []
    };
    
    for (const org of orgs) {
        if (org.tou_flag) issues.touFlag.push(org);
        if (org.tech_block_flag) issues.techBlockFlag.push(org);
        if (org.tech_rendering_flag) issues.techRenderingFlag.push(org);
        if (org.permission_denied_flag) issues.permissionDeniedFlag.push(org);
        if (org.duplicate_flag) issues.duplicateFlag.push(org);
    }
    
    console.log('');
    console.log(`   ⚠️  TOU Restrictions:      ${issues.touFlag.length} orgs`);
    if (issues.touFlag.length > 0) {
        issues.touFlag.forEach(o => console.log(`         • ${o.name}`));
    }
    
    console.log('');
    console.log(`   ⛔ Tech Blocked:          ${issues.techBlockFlag.length} orgs`);
    if (issues.techBlockFlag.length > 0) {
        issues.techBlockFlag.forEach(o => console.log(`         • ${o.name}`));
    }
    
    console.log('');
    console.log(`   ⚙️  JS Rendering:          ${issues.techRenderingFlag.length} orgs`);
    if (issues.techRenderingFlag.length > 0) {
        issues.techRenderingFlag.forEach(o => console.log(`         • ${o.name}`));
    }
    
    console.log('');
    console.log(`   🚫 Permission Denied:     ${issues.permissionDeniedFlag.length} orgs`);
    if (issues.permissionDeniedFlag.length > 0) {
        issues.permissionDeniedFlag.forEach(o => console.log(`         • ${o.name}`));
    }
    
    console.log('');
    console.log(`   🔁 Duplicates:            ${issues.duplicateFlag.length} orgs`);
    if (issues.duplicateFlag.length > 0) {
        issues.duplicateFlag.forEach(o => console.log(`         • ${o.name} → ${o.duplicate_of || 'unknown'}`));
    }
    
    return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 QUALITY AUDIT');
    console.log('════════════════════════════════════════════════════════════════');
    
    if (options.dryRun) {
        console.log('   ⚠️  DRY RUN MODE - No database changes will be made');
    }
    
    // Initialize
    console.log('');
    console.log('⏳ Initializing...');
    await init();
    await authenticate();
    
    // Fetch all organizations
    const orgs = await getAllOrganizations();
    
    // Results tracking
    const results = {
        totalOrgs: orgs.length,
        duplicatesFound: 0,
        duplicatesFlagged: 0,
        flagIssues: {}
    };
    
    // ─────────────────────────────────────────────────────────────────────────
    // DUPLICATE DETECTION
    // ─────────────────────────────────────────────────────────────────────────
    if (!options.flagsOnly) {
        const duplicatePairs = await findDuplicates(orgs);
        results.duplicatesFound = duplicatePairs.length;
        
        if (duplicatePairs.length > 0) {
            const analyzed = await analyzeDuplicates(duplicatePairs);
            
            // Update database (unless dry run)
            if (!options.dryRun) {
                console.log('');
                console.log('────────────────────────────────────────────────────────────────');
                console.log('💾 UPDATING DATABASE');
                console.log('────────────────────────────────────────────────────────────────');
                
                for (const result of analyzed) {
                    console.log(`   🔄 Flagging "${result.flagOrg.name}" as duplicate of "${result.keepOrg.name}"...`);
                    
                    const updateResult = await updateOrganization(result.flagOrg.id, {
                        duplicate_flag: true,
                        duplicate_of: result.keepOrg.id
                    });
                    
                    if (updateResult) {
                        console.log(`      ✅ Updated`);
                        results.duplicatesFlagged++;
                    } else {
                        console.log(`      ❌ Failed`);
                    }
                }
            } else {
                results.duplicatesFlagged = analyzed.length;
                console.log('');
                console.log('   ℹ️  Dry run: Would have flagged', analyzed.length, 'organizations');
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // FLAG ISSUES SUMMARY
    // ─────────────────────────────────────────────────────────────────────────
    if (!options.duplicatesOnly) {
        results.flagIssues = summarizeFlagIssues(orgs);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // FINAL REPORT
    // ─────────────────────────────────────────────────────────────────────────
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 AUDIT COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Total Organizations:     ${results.totalOrgs}`);
    console.log(`   Duplicate Pairs Found:   ${results.duplicatesFound}`);
    console.log(`   Duplicates Flagged:      ${results.duplicatesFlagged}${options.dryRun ? ' (dry run)' : ''}`);
    console.log('');
    
    if (!options.duplicatesOnly && results.flagIssues) {
        console.log('   Flag Issues:');
        console.log(`      ⚠️  TOU Restrictions:    ${results.flagIssues.touFlag?.length || 0}`);
        console.log(`      ⛔ Tech Blocked:        ${results.flagIssues.techBlockFlag?.length || 0}`);
        console.log(`      ⚙️  JS Rendering:        ${results.flagIssues.techRenderingFlag?.length || 0}`);
        console.log(`      🚫 Permission Denied:   ${results.flagIssues.permissionDeniedFlag?.length || 0}`);
        console.log(`      🔁 Already Duplicates:  ${results.flagIssues.duplicateFlag?.length || 0}`);
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    return results;
}

// Run
main().catch(console.error);
