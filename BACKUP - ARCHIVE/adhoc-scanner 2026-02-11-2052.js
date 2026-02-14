/**
 * scrapers/adhoc-scanner.js
 * 
 * AD-HOC ORGANIZATION SCANNER
 * 
 * Lightweight CLI for on-demand organization scanning with aggressive contact gathering.
 * Unlike scan-and-scrape-all-live-orgs.js, this script is focused on:
 * - Deep contact discovery (forceAggressive mode)
 * - Single org scans without scraping
 * - Quick status checks
 * 
 * Features:
 * - Full org-scanner.js scan (TOU, tech blocks, JS rendering)
 * - Force aggressive contact gathering (searches all 5 categories)
 * - Google query tracking and display
 * - Clear, formatted output
 * 
 * Usage:
 *   node scrapers/adhoc-scanner.js --org "CNAS"                    # Standard scan
 *   node scrapers/adhoc-scanner.js --org "CNAS" --force-contacts   # Force contact gathering
 *   node scrapers/adhoc-scanner.js --org "CNAS" --contacts-only    # Skip TOU/tech, just contacts
 *   node scrapers/adhoc-scanner.js --help                          # Show help
 * 
 * Created: 2026-01-31
 */

require('dotenv').config();
const scanner = require('./org-scanner');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Module-level auth token
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
    if (authToken) return authToken;
    
    console.log('   🔐 Authenticating with PocketBase...');
    
    try {
        const response = await fetch(
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
        console.log(`   ❌ Authentication failed: ${error.message}`);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        org: null,
        forceContacts: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--org':
                options.org = args[++i];
                break;
            case '--force-contacts':
            case '--aggressive':
            case '-f':
                options.forceContacts = true;
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
📋 AD-HOC ORGANIZATION SCANNER
════════════════════════════════════════════════════════════════

PURPOSE:
  On-demand scanning with contact discovery via Google Search.

🔒 SAFETY GUARANTEE:
  • Contact gathering ALWAYS uses Google Search only
  • We NEVER scrape org websites for contact info
  • TOU/tech scans only check policy pages (to detect restrictions)

USAGE:
  node scrapers/adhoc-scanner.js [options]

OPTIONS:
  --org "Name"        Organization name to scan (required)
  --force-contacts    Force search all 5 contact categories even if org has contacts
  -f, --aggressive    Alias for --force-contacts
  --help, -h          Show this help

EXAMPLES:
  # Standard scan
  node scrapers/adhoc-scanner.js --org "CNAS"

  # Force deep contact gathering (all 5 categories)
  node scrapers/adhoc-scanner.js --org "CNAS" --force-contacts

WHAT THE SCANNER DOES:
  1. Fetches homepage (to detect tech blocks, JS rendering)
  2. Scans TOU/Privacy pages (to detect scraping restrictions)
  3. Discovers events page URL
  4. Gathers contacts via GOOGLE SEARCH ONLY (respects all policies)
  5. Analyzes org with AI

CONTACT CATEGORIES SEARCHED (via Google):
  1. Legal/Permissions  - legal@, permissions@, licensing@
  2. Events             - events@, programs@, conferences@
  3. Media/PR           - media@, press@, communications@
  4. Leadership         - ceo@, director@, executive@
  5. General            - info@, contact@, hello@

GOOGLE QUOTA:
  - Each category = 1 Google query
  - First scan: Up to 5 queries per org
  - Re-scan: 0 queries (skips if org has Legal or Events contact)
  - Daily limit: 100 free queries

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get organization by name (exact or partial match)
 */
async function getOrganizationByName(name) {
    try {
        // Try exact match first
        const filter = encodeURIComponent(`name = "${name}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
        
        // Try partial match
        const partialFilter = encodeURIComponent(`name ~ "${name}"`);
        const partialResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${partialFilter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (partialResponse.ok) {
            const partialData = await partialResponse.json();
            if (partialData.items && partialData.items.length > 0) {
                // If multiple matches, show them and use first
                if (partialData.items.length > 1) {
                    console.log(`   📋 Multiple matches found:`);
                    partialData.items.forEach((org, i) => {
                        console.log(`      ${i + 1}. ${org.name}`);
                    });
                    console.log(`   ℹ️ Using first match: "${partialData.items[0].name}"`);
                }
                return partialData.items[0];
            }
        }
        
        return null;
    } catch (e) {
        console.log(`   ⚠️ Search error: ${e.message}`);
        return null;
    }
}

/**
 * Get existing contacts for an organization
 */
async function getExistingContacts(orgId) {
    try {
        const filter = encodeURIComponent(`organization = "${orgId}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}&perPage=100`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.items || [];
        }
        return [];
    } catch (e) {
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function displayOrgInfo(org) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📊 ORGANIZATION INFO');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`   Name:       ${org.name}`);
    console.log(`   Website:    ${org.website || 'N/A'}`);
    console.log(`   Status:     ${org.status}`);
    console.log(`   Events URL: ${org.events_url || 'Not set'}`);
    console.log('');
    console.log('   Current Flags:');
    console.log(`      TOU Flag:          ${org.tou_flag ? '⚠️ Yes' : '✅ No'}`);
    console.log(`      Tech Block Flag:   ${org.tech_block_flag ? '⛔ Yes' : '✅ No'}`);
    console.log(`      Tech Render Flag:  ${org.tech_rendering_flag ? '⚙️ Yes' : '✅ No'}`);
}

function displayExistingContacts(contacts) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`📇 EXISTING CONTACTS (${contacts.length} found)`);
    console.log('────────────────────────────────────────────────────────────────');
    
    if (contacts.length === 0) {
        console.log('   (none)');
        return;
    }
    
    // Group by contact type
    const byType = {};
    for (const c of contacts) {
        const type = c.contact_type || 'Other';
        if (!byType[type]) byType[type] = [];
        byType[type].push(c);
    }
    
    for (const [type, list] of Object.entries(byType)) {
        console.log(`   📁 ${type}:`);
        for (const c of list) {
            const email = c.email || c.email_normalized || '(no email)';
            const name = c.name ? `${c.name} - ` : '';
            console.log(`      • ${name}${email}`);
        }
    }
}

function displayScanResults(result) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔍 SCAN RESULTS');
    console.log('────────────────────────────────────────────────────────────────');
    
    console.log('   Flags After Scan:');
    console.log(`      TOU Flag:          ${result.touFlag ? '⚠️ Yes' : '✅ No'}`);
    console.log(`      Tech Block Flag:   ${result.techBlockFlag ? '⛔ Yes' : '✅ No'}`);
    console.log(`      Tech Render Flag:  ${result.techRenderingFlag ? '⚙️ Yes' : '✅ No'}`);
    
    if (result.touFlag && result.foundKeywords && result.foundKeywords.length > 0) {
        console.log('');
        console.log('   ⚠️ Restriction Keywords Found:');
        for (const kw of result.foundKeywords.slice(0, 5)) {
            console.log(`      • "${kw}"`);
        }
    }
    
    if (result.eventsUrl) {
        console.log('');
        console.log(`   📅 Events URL: ${result.eventsUrl}`);
    }
}

function displayContactResults(result, googleQueryCount) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📇 CONTACT DISCOVERY RESULTS');
    console.log('────────────────────────────────────────────────────────────────');
    
    // Check if gathering was skipped
    if (result.pocSkipped) {
        console.log(`   ⏭️ Contact gathering skipped`);
        console.log(`   Reason: ${result.pocInfo?.reason || 'Unknown'}`);
        console.log(`   Existing contacts: ${result.pocInfo?.existingCount || 0}`);
        return;
    }
    
    const contacts = result.pocContacts || [];
    console.log(`   📊 Google Queries Used: ${googleQueryCount}`);
    console.log(`   📊 Contacts Found: ${contacts.length}`);
    
    if (contacts.length === 0) {
        console.log('   ℹ️ No new contacts discovered');
        return;
    }
    
    console.log('');
    console.log('   New Contacts:');
    for (const c of contacts) {
        const type = c.contactType || c.categoryType || 'Unknown';
        const source = c.source || 'website';
        console.log(`      ✅ [${type}] ${c.email}`);
        if (c.name) console.log(`         Name: ${c.name}`);
        console.log(`         Source: ${source}`);
    }
    
    if (result.contactsSaved && result.contactsSaved.length > 0) {
        console.log('');
        console.log(`   💾 Saved ${result.contactsSaved.length} contacts to database`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    // Show help
    if (options.help) {
        showHelp();
        return;
    }
    
    // Validate required args
    if (!options.org) {
        console.log('');
        console.log('❌ ERROR: --org "Name" is required');
        console.log('');
        console.log('Usage: node scrapers/adhoc-scanner.js --org "CNAS" [--force-contacts]');
        console.log('       node scrapers/adhoc-scanner.js --help');
        return;
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 AD-HOC ORGANIZATION SCANNER');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Target: "${options.org}"`);
    console.log(`   Mode: ${options.forceContacts ? 'Force Contacts' : 'Standard Scan'}`);
    console.log('   🔒 Contact Method: Google Search Only (safe)');;
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    
    await authenticate();
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Find Organization
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('   🔎 Looking up organization...');
    
    const org = await getOrganizationByName(options.org);
    
    if (!org) {
        console.log(`   ❌ Organization not found: "${options.org}"`);
        console.log('');
        console.log('   💡 Tips:');
        console.log('      • Check spelling');
        console.log('      • Try partial name (e.g., "CNAS" instead of full name)');
        console.log('      • Use PocketBase admin to verify org exists');
        return;
    }
    
    console.log(`   ✅ Found: ${org.name}`);
    
    // Display current org info
    displayOrgInfo(org);
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Get Existing Contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    const existingContacts = await getExistingContacts(org.id);
    displayExistingContacts(existingContacts);
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4: Initialize Scanner and Reset Query Count
    // ─────────────────────────────────────────────────────────────────────────
    
    await scanner.init();
    
    // Reset Google query count for accurate tracking
    if (scanner.resetGoogleQueryCount) {
        scanner.resetGoogleQueryCount();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 5: Run Scan
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`🚀 RUNNING SCAN ${options.forceContacts ? '(Force Contacts Mode)' : ''}`);
    console.log('────────────────────────────────────────────────────────────────');
    
    const scanOptions = {
        updateDb: true,
        skipTOU: false,
        skipEventsUrl: false,
        skipAI: false,
        forceAggressive: options.forceContacts,
        googleOnlyContacts: true,  // ALWAYS use Google Search for contacts - never scrape
        scanType: 'manual'  // "manual" = ad-hoc scans in PocketBase
    };
    
    const result = await scanner.scanOrganization(org, scanOptions);
    
    // Get final query count
    const googleQueryCount = scanner.getGoogleQueryCount ? scanner.getGoogleQueryCount() : 0;
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 6: Display Results
    // ─────────────────────────────────────────────────────────────────────────
    
    displayScanResults(result);
    displayContactResults(result, googleQueryCount);
    
    // ─────────────────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ SCAN COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Organization: ${org.name}`);
    console.log(`   Mode: ${options.forceContacts ? 'Force Contacts' : 'Standard'}`);
    console.log('   Contact Method: 🔒 Google Search Only (safe)');
    
    const flagStatus = (result.touFlag || result.techBlockFlag || result.techRenderingFlag) 
        ? '⚠️ Has Restrictions' 
        : '✅ Clean';
    console.log(`   Flag Status: ${flagStatus}`);
    
    const newContacts = result.pocContacts?.length || 0;
    const savedContacts = result.contactsSaved?.length || 0;
    console.log(`   Contacts Found: ${newContacts}`);
    console.log(`   Contacts Saved: ${savedContacts}`);
    console.log(`   Google Queries: ${googleQueryCount}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

// Run
main().catch(error => {
    console.error('');
    console.error('❌ FATAL ERROR:', error.message);
    console.error('');
    process.exit(1);
});
