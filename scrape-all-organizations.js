/**
 * scrape-all-organizations.js
 *
 * Master scraper that processes all eligible organizations
 * 
 * Features:
 * - Uses scraper registry (custom scrapers when available, generic fallback)
 * - Safety gate checks before each organization
 * - Respectful scraping with rate limiting
 * - Auto-updates database on 403 detection
 *
 * Usage:
 *   node scrape-all-organizations.js              # Basic scrape all
 *   node scrape-all-organizations.js --deep       # Deep scrape (detail pages)
 *   node scrape-all-organizations.js --org "INSA" # Scrape single org
 *
 * Last Updated: 2026-01-05
 */

require('dotenv').config();
const registry = require('./scrapers');

// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND LINE ARGUMENTS
// ═══════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const DEEP_SCRAPE = args.includes('--deep');
const SINGLE_ORG_INDEX = args.indexOf('--org');
const SINGLE_ORG = SINGLE_ORG_INDEX !== -1 ? args[SINGLE_ORG_INDEX + 1] : null;
const SHOW_HELP = args.includes('--help');

// ═══════════════════════════════════════════════════════════════════════════════
// HELP TEXT
// ═══════════════════════════════════════════════════════════════════════════════

function showHelp() {
    console.log(`
════════════════════════════════════════════════════════════════
Event Finder - Organization Scraper
════════════════════════════════════════════════════════════════

Usage:
  node scrape-all-organizations.js [options]

Options:
  --help          Show this help message
  --deep          Enable deep scraping (fetches detail pages)
  --org "<name>"  Scrape a single organization by name

Examples:
  node scrape-all-organizations.js
  node scrape-all-organizations.js --deep
  node scrape-all-organizations.js --org "INSA"
  node scrape-all-organizations.js --org "INSA" --deep

Safety Gates:
  Organizations are only scraped if ALL conditions are met:
  • status = "Live (Scraping Active)"
  • scraping_enabled = TRUE
  • tou_flag ≠ TRUE
  • tech_block_flag ≠ TRUE

Custom Scrapers:
  The following organizations have custom scrapers:
`);

    const customScrapers = registry.listCustomScrapers();
    customScrapers.forEach(s => {
        console.log(`  🔧 ${s.name} (scraper_key: "${s.key}")`);
    });

    console.log(`
  All other organizations use the generic scraper.

  To add a custom scraper to an organization:
  1. Create scraper file in scrapers/custom/
  2. Add to CUSTOM_SCRAPERS in scrapers/index.js
  3. Set organization's scraper_key field in PocketBase

Environment Variables Required:
  POCKETBASE_URL              PocketBase server URL
  POCKETBASE_ADMIN_EMAIL      Admin email
  POCKETBASE_ADMIN_PASSWORD   Admin password

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLE ORGANIZATION SCRAPER
// ═══════════════════════════════════════════════════════════════════════════════

async function scrapeSingleOrganization(orgName) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🚀 SINGLE ORGANIZATION SCRAPER');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Organization: ${orgName}`);
    console.log(`   Mode: ${DEEP_SCRAPE ? 'Deep Scrape' : 'Basic Scrape'}`);
    console.log('');

    // Initialize
    await registry.base.init();
    await registry.base.authenticate();

    // Find organization by name
    console.log(`🔍 Searching for "${orgName}"...\n`);

    const allOrgs = await registry.base.getScrapableOrganizations();
    let org = allOrgs.find(o => o.name.toLowerCase() === orgName.toLowerCase());

    if (!org) {
        // Try partial match
        org = allOrgs.find(o => o.name.toLowerCase().includes(orgName.toLowerCase()));
    }

    if (!org) {
        // Search all organizations (not just scrapable)
        console.log('⚠️ Organization not found in scrapable list.');
        console.log('   Searching all organizations...\n');

        const orgRecord = await registry.base.getOrganization(orgName);
        if (!orgRecord) {
            console.log(`❌ Organization "${orgName}" not found in database.`);
            console.log('');
            console.log('   Make sure the organization exists in PocketBase.');
            console.log('');
            return;
        }

        // Check why it's not scrapable
        const safetyCheck = registry.base.checkSafetyGates(orgRecord);
        console.log('════════════════════════════════════════════════════════════════');
        console.log('⛔ ORGANIZATION NOT ELIGIBLE FOR SCRAPING');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`   Reason: ${safetyCheck.reason}`);
        console.log('');
        console.log('   To enable scraping:');
        console.log('   1. Open Admin Interface');
        console.log('   2. Set status = "Live (Scraping Active)"');
        console.log('   3. Check "Scraping Enabled"');
        console.log('   4. Ensure TOU Flag and Technical Block are unchecked');
        console.log('════════════════════════════════════════════════════════════════\n');
        return;
    }

    console.log(`✅ Found: ${org.name}\n`);

    // Scrape
    await registry.scrapeOrganization(org, { deep: DEEP_SCRAPE });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    if (SHOW_HELP) {
        showHelp();
        return;
    }

    console.log('════════════════════════════════════════════════════════════════');
    console.log('🚀 National Security Events Scraper');
    console.log('    (Registry-Based with Safety Gates)');
    console.log('════════════════════════════════════════════════════════════════\n');

    try {
        if (SINGLE_ORG) {
            await scrapeSingleOrganization(SINGLE_ORG);
        } else {
            await registry.scrapeAllOrganizations({
                deep: DEEP_SCRAPE,
                delayBetweenOrgs: 2000
            });
        }
    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('❌ Unhandled error:', error);
        process.exit(1);
    });
