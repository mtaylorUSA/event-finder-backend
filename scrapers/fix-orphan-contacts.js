/**
 * fix-orphan-contacts.js
 * 
 * ONE-TIME SCRIPT - Links orphan contacts to organizations by matching email domain
 * 
 * How it works:
 *   1. Fetches all contacts without an organization (or with invalid org)
 *   2. Extracts domain from email (e.g., "jsmith@brookings.edu" → "brookings.edu")
 *   3. Matches domain to organization website (e.g., "https://www.brookings.edu")
 *   4. Links contact to the matching organization in PocketBase
 * 
 * Usage:
 *   node fix-orphan-contacts.js           # Run and fix orphan contacts
 *   node fix-orphan-contacts.js --dry-run # Preview without saving
 * 
 * Prerequisites:
 *   - POCKETBASE_URL in .env
 *   - POCKETBASE_ADMIN_EMAIL in .env
 *   - POCKETBASE_ADMIN_PASSWORD in .env
 * 
 * Created: 2026-01-30
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

let fetchModule;
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN MATCHING UTILITIES (Shared logic - can be exported for other scripts)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract domain from email address
 * @param {string} email - Email address (e.g., "jsmith@brookings.edu")
 * @returns {string|null} Domain (e.g., "brookings.edu") or null if invalid
 */
function extractDomainFromEmail(email) {
    if (!email || typeof email !== 'string') return null;
    
    const match = email.toLowerCase().trim().match(/@([a-z0-9.-]+\.[a-z]{2,})$/i);
    return match ? match[1] : null;
}

/**
 * Extract domain from website URL
 * @param {string} url - Website URL (e.g., "https://www.brookings.edu/about")
 * @returns {string|null} Domain (e.g., "brookings.edu") or null if invalid
 */
function extractDomainFromUrl(url) {
    if (!url || typeof url !== 'string') return null;
    
    try {
        let domain = url.toLowerCase()
            .replace(/^https?:\/\//, '')  // Remove protocol
            .replace(/^www\./, '')         // Remove www.
            .split('/')[0]                 // Remove path
            .split('?')[0];                // Remove query string
        
        return domain || null;
    } catch (e) {
        return null;
    }
}

/**
 * Get the "core" domain for matching (handles subdomains)
 * e.g., "events.brookings.edu" → "brookings.edu"
 * e.g., "csis.org" → "csis.org"
 * 
 * @param {string} domain - Full domain
 * @returns {string} Core domain for matching
 */
function getCoreDomain(domain) {
    if (!domain) return null;
    
    const parts = domain.split('.');
    
    // Handle common TLDs
    if (parts.length >= 2) {
        // Check for two-part TLDs like .co.uk, .org.uk, .edu.au
        const lastTwo = parts.slice(-2).join('.');
        const twoPartTLDs = ['co.uk', 'org.uk', 'edu.au', 'com.au', 'ac.uk', 'gov.uk'];
        
        if (twoPartTLDs.includes(lastTwo) && parts.length >= 3) {
            return parts.slice(-3).join('.');
        }
        
        // Standard: return last two parts (e.g., "brookings.edu")
        return parts.slice(-2).join('.');
    }
    
    return domain;
}

/**
 * Build a lookup map of domain → organization
 * @param {Array} organizations - Array of organization records
 * @returns {Map} Map of domain → org record
 */
function buildDomainToOrgMap(organizations) {
    const map = new Map();
    
    for (const org of organizations) {
        if (!org.website) continue;
        
        const domain = extractDomainFromUrl(org.website);
        if (!domain) continue;
        
        const coreDomain = getCoreDomain(domain);
        if (coreDomain) {
            // Store both full domain and core domain for flexible matching
            map.set(domain, org);
            if (domain !== coreDomain) {
                map.set(coreDomain, org);
            }
        }
    }
    
    return map;
}

/**
 * Find matching organization for an email address
 * Returns the actual org record from PocketBase (with id, name, etc.)
 * 
 * @param {string} email - Email address
 * @param {Map} domainToOrgMap - Map from buildDomainToOrgMap()
 * @returns {Object|null} Matching organization record or null
 */
function findOrgByEmail(email, domainToOrgMap) {
    const emailDomain = extractDomainFromEmail(email);
    if (!emailDomain) return null;
    
    // Try exact match first
    if (domainToOrgMap.has(emailDomain)) {
        return domainToOrgMap.get(emailDomain);
    }
    
    // Try core domain match
    const coreEmailDomain = getCoreDomain(emailDomain);
    if (coreEmailDomain && domainToOrgMap.has(coreEmailDomain)) {
        return domainToOrgMap.get(coreEmailDomain);
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    fetchModule = (await import('node-fetch')).default;
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔗 Fix Orphan Contacts Script');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be saved');
        console.log('');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Validate environment
    // ─────────────────────────────────────────────────────────────────────────
    
    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.log('❌ Missing PocketBase credentials in .env');
        console.log('   Required: POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🔐 Authenticating with PocketBase...');
    authToken = await authenticate();
    console.log('   ✅ Authenticated');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Fetch all organizations and contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('📡 Fetching data from PocketBase...');
    
    const organizations = await fetchAllOrganizations();
    console.log(`   ✅ Found ${organizations.length} organizations`);
    
    const contacts = await fetchAllContacts();
    console.log(`   ✅ Found ${contacts.length} contacts`);
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Build domain lookup map
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🗺️ Building domain → organization map...');
    const domainToOrgMap = buildDomainToOrgMap(organizations);
    console.log(`   ✅ Mapped ${domainToOrgMap.size} domains to orgs`);
    
    // Show sample mappings
    console.log('   📋 Sample mappings:');
    let count = 0;
    for (const [domain, org] of domainToOrgMap) {
        if (count >= 5) break;
        console.log(`      ${domain} → ${org.name}`);
        count++;
    }
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Find orphan contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    // Build set of valid org IDs
    const validOrgIds = new Set(organizations.map(o => o.id));
    
    // Find contacts without a valid organization
    const orphanContacts = contacts.filter(c => !c.organization || !validOrgIds.has(c.organization));
    
    console.log(`🔍 Found ${orphanContacts.length} orphan contacts (no org or invalid org)`);
    console.log('');
    
    if (orphanContacts.length === 0) {
        console.log('✅ No orphan contacts to fix!');
        return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Process orphan contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔄 Processing Orphan Contacts');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('');
    
    const stats = {
        processed: 0,
        matched: 0,
        noEmail: 0,
        noMatch: 0,
        errors: 0
    };
    
    const noMatchList = [];
    
    for (const contact of orphanContacts) {
        stats.processed++;
        
        const displayName = contact.name || contact.email || contact.id;
        console.log(`${stats.processed}/${orphanContacts.length} - ${displayName}`);
        
        if (!contact.email) {
            console.log('   ⚠️ No email address - cannot match');
            stats.noEmail++;
            continue;
        }
        
        const emailDomain = extractDomainFromEmail(contact.email);
        console.log(`   📧 Email: ${contact.email}`);
        console.log(`   🌐 Domain: ${emailDomain || 'N/A'}`);
        
        // Find matching org using PocketBase organization records
        const matchedOrg = findOrgByEmail(contact.email, domainToOrgMap);
        
        if (matchedOrg) {
            console.log(`   ✅ Matched to: ${matchedOrg.name} (ID: ${matchedOrg.id})`);
            
            if (!dryRun) {
                const success = await updateContact(contact.id, { organization: matchedOrg.id });
                if (success) {
                    console.log('   💾 Linked to organization in PocketBase');
                    stats.matched++;
                } else {
                    console.log('   ❌ Failed to save');
                    stats.errors++;
                }
            } else {
                console.log('   🔍 [Dry run - not saved]');
                stats.matched++;
            }
        } else {
            console.log('   ❌ No matching organization found in PocketBase');
            stats.noMatch++;
            noMatchList.push({
                name: contact.name,
                email: contact.email,
                domain: emailDomain
            });
        }
        
        console.log('');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   📋 Total orphan contacts: ${stats.processed}`);
    console.log(`   ✅ Matched & linked to org: ${stats.matched}`);
    console.log(`   ⚠️ No email: ${stats.noEmail}`);
    console.log(`   ❌ No match found: ${stats.noMatch}`);
    console.log(`   💥 Errors: ${stats.errors}`);
    console.log('');
    
    if (noMatchList.length > 0) {
        console.log('────────────────────────────────────────────────────────────────');
        console.log('📝 Unmatched Contacts (may need to add org or manual review):');
        console.log('────────────────────────────────────────────────────────────────');
        noMatchList.forEach(c => {
            console.log(`   • ${c.email} (domain: ${c.domain || 'N/A'})`);
        });
        console.log('');
        console.log('💡 Tip: These contacts have email domains that don\'t match any');
        console.log('   organization website in PocketBase. You may need to:');
        console.log('   1. Add the organization to PocketBase, OR');
        console.log('   2. Manually assign these contacts to an org');
        console.log('');
    }
    
    if (dryRun) {
        console.log('💡 This was a dry run. Run without --dry-run to apply changes.');
        console.log('');
    }
    
    console.log('════════════════════════════════════════════════════════════════');
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
    const response = await fetchModule(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) {
        throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    return data.token;
}

async function fetchAllOrganizations() {
    const allOrgs = [];
    let page = 1;
    const perPage = 200;
    
    while (true) {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records?page=${page}&perPage=${perPage}`,
            { headers: { 'Authorization': `Bearer ${authToken}` } }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch organizations');
        }
        
        const data = await response.json();
        allOrgs.push(...(data.items || []));
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    return allOrgs;
}

async function fetchAllContacts() {
    const allContacts = [];
    let page = 1;
    const perPage = 200;
    
    while (true) {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records?page=${page}&perPage=${perPage}`,
            { headers: { 'Authorization': `Bearer ${authToken}` } }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        
        const data = await response.json();
        allContacts.push(...(data.items || []));
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    return allContacts;
}

async function updateContact(contactId, updates) {
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records/${contactId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updates)
            }
        );
        
        return response.ok;
    } catch (error) {
        console.log(`      ⚠️ Error: ${error.message}`);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS (for use by other scripts like org-scanner.js)
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    extractDomainFromEmail,
    extractDomainFromUrl,
    getCoreDomain,
    buildDomainToOrgMap,
    findOrgByEmail
};

// ═══════════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════════

// Only run if called directly (not imported)
if (require.main === module) {
    main().catch(error => {
        console.error('');
        console.error('❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    });
}
