/**
 * scrapers/scan-legal-pages-diagnostic.js
 * 
 * DIAGNOSTIC SCRIPT - Legal Page Discovery Audit
 * 
 * Scans ALL organizations to see what legal/policy pages are being discovered.
 * This validates Requirement 1: "We look at all the places on a website where 
 * we might find restrictions"
 * 
 * Output shows:
 * - Which legal pages were found for each org
 * - How they were found (link in HTML vs. path probing)
 * - Summary stats across all orgs
 * 
 * Usage:
 *   node scrapers/scan-legal-pages-diagnostic.js                    # All orgs, links only (fast)
 *   node scrapers/scan-legal-pages-diagnostic.js --probe-paths      # Also try all 40 TOU_PATHS (slow)
 *   node scrapers/scan-legal-pages-diagnostic.js --status "Live"    # Filter by status
 *   node scrapers/scan-legal-pages-diagnostic.js --limit 10         # Process only N orgs
 *   node scrapers/scan-legal-pages-diagnostic.js --org "CNAS"       # Single org
 * 
 * Created: 2026-01-18
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: matthew_e_taylor@hotmail.com)';
const TIMEOUT = 30000;
const DELAY_BETWEEN_ORGS = 2000;
const DELAY_BETWEEN_PATHS = 500;

// ═══════════════════════════════════════════════════════════════════════════════
// TOU_PATHS - Same as org-scanner.js (40 paths)
// ═══════════════════════════════════════════════════════════════════════════════

const TOU_PATHS = [
    // PRIMARY LEGAL / TERMS (10 paths)
    '/terms',
    '/terms-of-use',
    '/terms-use',
    '/terms-of-service',
    '/tos',
    '/terms-and-conditions',
    '/conditions',
    '/conditions-of-use',
    '/site-terms',
    '/website-terms',
    
    // PRIVACY (7 paths)
    '/privacy',
    '/privacy-policy',
    '/data-privacy',
    '/cookie-policy',
    '/cookies',
    '/gdpr',
    '/ccpa',
    
    // LEGAL PAGES (8 paths)
    '/legal',
    '/legal/terms',
    '/legal/privacy',
    '/legal-notice',
    '/disclaimer',
    '/copyright',
    '/copyright-notice',
    '/intellectual-property',
    
    // POLICIES (5 paths)
    '/policies',
    '/policies-and-procedures',
    '/site-policies',
    '/website-policies',
    '/usage-policy',
    
    // USER AGREEMENT (5 paths)
    '/user-agreement',
    '/acceptable-use',
    '/acceptable-use-policy',
    '/aup',
    '/code-of-conduct',
    
    // API / DEVELOPER TERMS (5 paths)
    '/api-terms',
    '/api-policy',
    '/developer-terms',
    '/developers/terms',
    '/data-use-policy'
];

// Content path prefixes to EXCLUDE (these are NOT legal pages)
const CONTENT_PATH_PREFIXES = [
    '/topics/', '/topic/', '/programs/', '/program/',
    '/events/', '/event/', '/news/', '/blog/',
    '/articles/', '/article/', '/research/', '/publications/',
    '/publication/', '/reports/', '/report/', '/experts/',
    '/expert/', '/people/', '/person/', '/authors/',
    '/author/', '/issues/', '/issue/', '/regions/',
    '/region/', '/podcasts/', '/videos/', '/projects/',
    '/initiatives/', '/centers/', '/commentary/',
    '/analysis/', '/briefs/', '/papers/'
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

let authToken = null;
let fetchModule = null;

// ═══════════════════════════════════════════════════════════════════════════════
// CLI PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        probePaths: false,
        status: null,
        limit: null,
        org: null,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--probe-paths':
                options.probePaths = true;
                break;
            case '--status':
                options.status = args[++i];
                break;
            case '--limit':
                options.limit = parseInt(args[++i], 10);
                break;
            case '--org':
                options.org = args[++i];
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
📋 LEGAL PAGE DISCOVERY DIAGNOSTIC
════════════════════════════════════════════════════════════════

PURPOSE:
  Scan organizations to see what legal/policy pages are being discovered.
  Validates Requirement 1: "We look at all the places where restrictions might be"

USAGE:
  node scrapers/scan-legal-pages-diagnostic.js [options]

OPTIONS:
  --probe-paths     Also try all 40 TOU_PATHS on each site (slow but thorough)
  --status "X"      Filter orgs by status (e.g., "Live", "Nominated")
  --limit N         Only process first N organizations
  --org "Name"      Scan single organization by name
  --help, -h        Show this help

EXAMPLES:
  # Quick scan - just look for links in homepage HTML
  node scrapers/scan-legal-pages-diagnostic.js --limit 20
  
  # Thorough scan - also probe all 40 paths
  node scrapers/scan-legal-pages-diagnostic.js --probe-paths --limit 10
  
  # Scan only Live orgs
  node scrapers/scan-legal-pages-diagnostic.js --status "Live (Scraping Active)"
  
  # Scan single org thoroughly
  node scrapers/scan-legal-pages-diagnostic.js --org "CNAS" --probe-paths

OUTPUT:
  For each org shows:
  ✅ Legal pages found (with discovery method)
  ⚠️ No legal pages found
  ⛔ Technical block (403/401)

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function init() {
    if (fetchModule) return;
    fetchModule = (await import('node-fetch')).default;
}

async function authenticate() {
    if (authToken) return authToken;
    
    await init();
    
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
    return authToken;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function getAllOrganizations(statusFilter = null) {
    await authenticate();
    
    const allOrgs = [];
    let page = 1;
    const perPage = 200;
    
    while (true) {
        let url = `${POCKETBASE_URL}/api/collections/organizations/records?page=${page}&perPage=${perPage}&sort=name`;
        
        if (statusFilter) {
            const filter = encodeURIComponent(`status ~ "${statusFilter}"`);
            url += `&filter=${filter}`;
        }
        
        const response = await fetchModule(url, {
            headers: { 'Authorization': authToken }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch organizations: ${response.status}`);
        }
        
        const data = await response.json();
        allOrgs.push(...data.items);
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    return allOrgs;
}

async function getOrganizationByName(name) {
    await authenticate();
    
    const filter = encodeURIComponent(`name ~ "${name}"`);
    const response = await fetchModule(
        `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.items[0] || null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// URL FETCHING
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchUrl(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
        
        const response = await fetchModule(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml'
            },
            redirect: 'follow',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 403 || response.status === 401) {
            return { success: false, isBlocked: true, status: response.status };
        }
        
        if (!response.ok) {
            return { success: false, isBlocked: false, status: response.status };
        }
        
        const body = await response.text();
        return { success: true, body, status: response.status, finalUrl: response.url };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGAL PAGE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if URL is a content page (NOT a legal page)
 */
function isContentPage(url) {
    const lowerUrl = url.toLowerCase();
    for (const prefix of CONTENT_PATH_PREFIXES) {
        if (lowerUrl.includes(prefix)) {
            return true;
        }
    }
    return false;
}

/**
 * Check if URL appears to be a legal/policy page
 */
function isLegalPageUrl(url) {
    const lowerUrl = url.toLowerCase();
    
    // First exclude content pages
    if (isContentPage(url)) {
        return false;
    }
    
    // Check for legal keywords in URL
    const legalKeywords = [
        'terms', 'privacy', 'legal', 'policy', 'policies',
        'disclaimer', 'copyright', 'cookies', 'gdpr', 'ccpa',
        'conditions', 'agreement', 'acceptable-use', 'aup',
        'code-of-conduct', 'tos', 'intellectual-property'
    ];
    
    for (const keyword of legalKeywords) {
        if (lowerUrl.includes(keyword)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Find legal page links in HTML
 */
function findLegalLinksInHtml(html, baseUrl) {
    const foundUrls = [];
    
    if (!html) return foundUrls;
    
    const hrefPattern = /href=["']([^"']+)["']/gi;
    const matches = html.matchAll(hrefPattern);
    
    for (const match of matches) {
        let url = match[1];
        
        // Skip anchors, javascript, mailto
        if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:')) {
            continue;
        }
        
        // Make relative URLs absolute
        if (!url.startsWith('http')) {
            try {
                url = new URL(url, baseUrl).href;
            } catch (e) {
                continue;
            }
        }
        
        // Check if it's a legal page
        if (isLegalPageUrl(url)) {
            // Avoid duplicates
            if (!foundUrls.find(u => u.url === url)) {
                foundUrls.push({ url, method: 'link' });
            }
        }
    }
    
    return foundUrls;
}

/**
 * Probe common TOU paths to find legal pages
 */
async function probeTouPaths(baseUrl) {
    const foundUrls = [];
    const cleanBase = baseUrl.replace(/\/$/, '');
    
    for (const path of TOU_PATHS) {
        const testUrl = cleanBase + path;
        
        const result = await fetchUrl(testUrl);
        
        if (result.isBlocked) {
            return { foundUrls, isBlocked: true, blockedAt: testUrl };
        }
        
        if (result.success) {
            foundUrls.push({ url: testUrl, method: 'path-probe', status: result.status });
        }
        
        await sleep(DELAY_BETWEEN_PATHS);
    }
    
    return { foundUrls, isBlocked: false };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCAN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function scanOrganization(org, options) {
    const result = {
        name: org.name,
        website: org.website,
        status: org.status,
        existingTouUrl: org.tou_url,
        existingTouFlag: org.tou_flag,
        legalPagesFound: [],
        isBlocked: false,
        error: null
    };
    
    if (!org.website) {
        result.error = 'No website';
        return result;
    }
    
    const baseUrl = org.website.replace(/\/$/, '');
    
    // Step 1: Fetch homepage
    console.log(`   📡 Fetching homepage...`);
    const homepageResult = await fetchUrl(baseUrl);
    
    if (homepageResult.isBlocked) {
        result.isBlocked = true;
        result.error = `Blocked (${homepageResult.status})`;
        return result;
    }
    
    if (!homepageResult.success) {
        result.error = `Failed to fetch: ${homepageResult.error || homepageResult.status}`;
        return result;
    }
    
    // Step 2: Find legal links in HTML
    console.log(`   🔍 Scanning homepage for legal links...`);
    const linksFound = findLegalLinksInHtml(homepageResult.body, baseUrl);
    result.legalPagesFound.push(...linksFound);
    
    if (linksFound.length > 0) {
        console.log(`      ✅ Found ${linksFound.length} legal page link(s) in HTML`);
    } else {
        console.log(`      ⚠️ No legal page links found in homepage HTML`);
    }
    
    // Step 3: Optionally probe all TOU paths
    if (options.probePaths) {
        console.log(`   🔍 Probing ${TOU_PATHS.length} common paths...`);
        const probeResult = await probeTouPaths(baseUrl);
        
        if (probeResult.isBlocked) {
            result.isBlocked = true;
            result.error = `Blocked during path probe at ${probeResult.blockedAt}`;
            return result;
        }
        
        // Add any new URLs not already found via links
        for (const found of probeResult.foundUrls) {
            if (!result.legalPagesFound.find(u => u.url === found.url)) {
                result.legalPagesFound.push(found);
            }
        }
        
        console.log(`      ✅ Found ${probeResult.foundUrls.length} additional page(s) via path probing`);
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 LEGAL PAGE DISCOVERY DIAGNOSTIC');
    console.log('════════════════════════════════════════════════════════════════');
    
    if (options.probePaths) {
        console.log(`   ⚠️ Path probing enabled - this will be SLOW (40 paths × org count)`);
    }
    
    // Initialize
    console.log('');
    console.log('⏳ Initializing...');
    await init();
    await authenticate();
    console.log('   ✅ Ready');
    
    // Get organizations
    let orgs = [];
    
    if (options.org) {
        console.log('');
        console.log(`📡 Finding organization: "${options.org}"...`);
        const org = await getOrganizationByName(options.org);
        if (!org) {
            console.log(`   ❌ Organization not found: "${options.org}"`);
            return;
        }
        orgs = [org];
        console.log(`   ✅ Found: ${org.name}`);
    } else {
        console.log('');
        console.log(`📡 Fetching organizations${options.status ? ` (status: "${options.status}")` : ''}...`);
        orgs = await getAllOrganizations(options.status);
        console.log(`   ✅ Found ${orgs.length} organizations`);
        
        if (options.limit && orgs.length > options.limit) {
            orgs = orgs.slice(0, options.limit);
            console.log(`   ℹ️ Limited to first ${options.limit} organizations`);
        }
    }
    
    // Process each organization
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔍 SCANNING ORGANIZATIONS');
    console.log('────────────────────────────────────────────────────────────────');
    
    const results = [];
    const stats = {
        total: orgs.length,
        withLegalPages: 0,
        withoutLegalPages: 0,
        blocked: 0,
        errors: 0,
        pageTypeCount: {}
    };
    
    for (let i = 0; i < orgs.length; i++) {
        const org = orgs[i];
        
        console.log('');
        console.log(`[${i + 1}/${orgs.length}] ${org.name}`);
        console.log(`   📍 ${org.website}`);
        console.log(`   📊 Status: ${org.status}`);
        if (org.tou_flag) console.log(`   ⚠️ Existing TOU Flag: true`);
        if (org.tou_url) console.log(`   📜 Existing TOU URL: ${org.tou_url}`);
        
        const result = await scanOrganization(org, options);
        results.push(result);
        
        // Update stats
        if (result.isBlocked) {
            stats.blocked++;
            console.log(`   ⛔ BLOCKED: ${result.error}`);
        } else if (result.error) {
            stats.errors++;
            console.log(`   ❌ ERROR: ${result.error}`);
        } else if (result.legalPagesFound.length > 0) {
            stats.withLegalPages++;
            console.log(`   ✅ Found ${result.legalPagesFound.length} legal page(s):`);
            for (const page of result.legalPagesFound) {
                const method = page.method === 'link' ? '🔗 link' : '🔍 probe';
                console.log(`      ${method}: ${page.url}`);
                
                // Track page types
                const pageType = getPageType(page.url);
                stats.pageTypeCount[pageType] = (stats.pageTypeCount[pageType] || 0) + 1;
            }
        } else {
            stats.withoutLegalPages++;
            console.log(`   ⚠️ No legal pages found`);
        }
        
        // Delay between orgs
        if (i < orgs.length - 1) {
            await sleep(DELAY_BETWEEN_ORGS);
        }
    }
    
    // Final Summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Total Organizations:     ${stats.total}`);
    console.log(`   ✅ With Legal Pages:     ${stats.withLegalPages}`);
    console.log(`   ⚠️ Without Legal Pages:  ${stats.withoutLegalPages}`);
    console.log(`   ⛔ Blocked:              ${stats.blocked}`);
    console.log(`   ❌ Errors:               ${stats.errors}`);
    
    console.log('');
    console.log('   📄 Page Types Found:');
    const sortedTypes = Object.entries(stats.pageTypeCount)
        .sort((a, b) => b[1] - a[1]);
    for (const [type, count] of sortedTypes) {
        console.log(`      ${type}: ${count}`);
    }
    
    // List orgs without legal pages
    const orgsWithoutPages = results.filter(r => 
        !r.isBlocked && !r.error && r.legalPagesFound.length === 0
    );
    
    if (orgsWithoutPages.length > 0) {
        console.log('');
        console.log('   ⚠️ Orgs WITHOUT legal pages found:');
        for (const r of orgsWithoutPages) {
            console.log(`      • ${r.name} (${r.website})`);
        }
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    return results;
}

/**
 * Determine page type from URL
 */
function getPageType(url) {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('privacy')) return 'Privacy Policy';
    if (lowerUrl.includes('terms-of-service') || lowerUrl.includes('tos')) return 'Terms of Service';
    if (lowerUrl.includes('terms-of-use') || lowerUrl.includes('terms-use')) return 'Terms of Use';
    if (lowerUrl.includes('terms-and-conditions')) return 'Terms & Conditions';
    if (lowerUrl.includes('terms')) return 'Terms (general)';
    if (lowerUrl.includes('cookie')) return 'Cookie Policy';
    if (lowerUrl.includes('gdpr')) return 'GDPR';
    if (lowerUrl.includes('ccpa')) return 'CCPA';
    if (lowerUrl.includes('legal')) return 'Legal';
    if (lowerUrl.includes('disclaimer')) return 'Disclaimer';
    if (lowerUrl.includes('copyright')) return 'Copyright';
    if (lowerUrl.includes('acceptable-use') || lowerUrl.includes('aup')) return 'Acceptable Use';
    if (lowerUrl.includes('code-of-conduct')) return 'Code of Conduct';
    if (lowerUrl.includes('intellectual-property')) return 'Intellectual Property';
    if (lowerUrl.includes('policies')) return 'Policies';
    if (lowerUrl.includes('conditions')) return 'Conditions';
    
    return 'Other Legal';
}

// Run
main().catch(console.error);
