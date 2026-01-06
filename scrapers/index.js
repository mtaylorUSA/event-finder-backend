/**
 * scrapers/index.js
 * 
 * Scraper Registry (Database-Driven)
 * 
 * Maps scraper_key field from PocketBase to custom scrapers.
 * The database is the single source of truth for organization names.
 * 
 * Scrape Flow:
 * 1. Safety gate check (status, flags)
 * 2. TOU check (if tou_url exists)
 * 3. Wait 5-8 seconds (respectful delay)
 * 4. Scrape events
 * 5. Save events + update last_scraped
 * 
 * To add a new custom scraper:
 * 1. Create file in scrapers/custom/[key].js
 * 2. Export { scrape, name, key } 
 * 3. Add to CUSTOM_SCRAPERS object below
 * 4. In PocketBase, set organization's scraper_key to match
 * 
 * Last Updated: 2026-01-06
 */

const base = require('./base-scraper');

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM SCRAPER REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

// Import custom scrapers
const insaScraper = require('./custom/insa');

/**
 * Registry of custom scrapers
 * Key = scraper_key value in PocketBase
 * Value = scraper module
 */
const CUSTOM_SCRAPERS = {
    'insa': insaScraper,
    // Add more custom scrapers as needed:
    // 'cfr': require('./custom/cfr'),
    // 'csis': require('./custom/csis'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get scraper for an organization using its scraper_key
 * @param {Object} org - Organization record from PocketBase
 * @returns {Object|null} Scraper module or null for generic
 */
function getScraperForOrg(org) {
    if (!org.scraper_key) {
        return null;
    }
    return CUSTOM_SCRAPERS[org.scraper_key.toLowerCase()] || null;
}

/**
 * Check if organization has a custom scraper
 * @param {Object} org - Organization record from PocketBase
 * @returns {boolean}
 */
function hasCustomScraper(org) {
    if (!org.scraper_key) {
        return false;
    }
    return org.scraper_key.toLowerCase() in CUSTOM_SCRAPERS;
}

/**
 * List all registered custom scrapers
 * @returns {Array} Array of { key, name }
 */
function listCustomScrapers() {
    return Object.entries(CUSTOM_SCRAPERS).map(([key, scraper]) => ({
        key,
        name: scraper.name
    }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCRAPE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scrape an organization (uses custom scraper if available, otherwise generic)
 * 
 * Flow:
 * 1. Safety gate check
 * 2. TOU check (if tou_url exists)
 * 3. Wait 5-8 seconds
 * 4. Scrape events
 * 5. Save events + update last_scraped
 * 
 * @param {Object} org - Organization record from PocketBase
 * @param {Object} options - { deep: boolean }
 * @returns {Object} { events: Array, created: number, skipped: number, errors: number }
 */
async function scrapeOrganization(org, options = {}) {
    // Initialize base scraper
    await base.init();
    await base.authenticate();

    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`🏢 SCRAPING: ${org.name}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Website: ${org.website || 'N/A'}`);
    console.log(`   Events URL: ${org.events_url || 'N/A'}`);
    console.log(`   TOU URL: ${org.tou_url || 'N/A'}`);
    console.log(`   Scraper Key: ${org.scraper_key || '(none - using generic)'}`);
    console.log(`   Last Scraped: ${org.last_scraped || 'Never'}`);
    console.log('');

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 1: Safety Gate Check
    // ═══════════════════════════════════════════════════════════════════════════

    const safetyCheck = base.checkSafetyGates(org);
    if (!safetyCheck.canScrape) {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('⛔ SCRAPING SKIPPED');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`   Reason: ${safetyCheck.reason}`);
        console.log('════════════════════════════════════════════════════════════════\n');
        return { events: [], created: 0, skipped: 0, errors: 0, blocked: true };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 2: TOU Check
    // ═══════════════════════════════════════════════════════════════════════════

    const touResult = await base.checkTOU(org);

    if (!touResult.passed) {
        if (touResult.blocked) {
            console.log('⛔ Scraping halted - site blocked access to TOU page');
        } else {
            console.log('⛔ Scraping halted - TOU restrictions detected');
        }
        return { events: [], created: 0, skipped: 0, errors: 0, blocked: true };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 3: Respectful Delay Before Scraping
    // ═══════════════════════════════════════════════════════════════════════════

    if (org.tou_url) {
        console.log(`⏳ Waiting ${base.getDelayRange()} before scraping (respectful delay)...`);
        await base.sleep();
        console.log('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 4: Scrape Events
    // ═══════════════════════════════════════════════════════════════════════════

    const customScraper = getScraperForOrg(org);
    let events = [];

    if (customScraper) {
        console.log(`🔧 Using custom scraper: ${customScraper.name}`);
        console.log('');
        events = await customScraper.scrape(org, options);
    } else {
        console.log('📦 Using generic scraper');
        console.log('');
        events = await base.genericScrape(org);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 5: Save Events
    // ═══════════════════════════════════════════════════════════════════════════

    let result = { created: 0, skipped: 0, errors: 0 };
    if (events.length > 0) {
        result = await base.saveEvents(events);
    } else {
        console.log('📭 No events to save');
    }

    // Update last_scraped
    await base.updateLastScraped(org.id);

    // Summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📊 ${org.name} - SUMMARY`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   ✅ Created: ${result.created}`);
    console.log(`   ⏭️ Skipped: ${result.skipped}`);
    console.log(`   ❌ Errors: ${result.errors}`);
    console.log('════════════════════════════════════════════════════════════════\n');

    return {
        events,
        created: result.created,
        skipped: result.skipped,
        errors: result.errors,
        blocked: false
    };
}

/**
 * Scrape all eligible organizations
 * 
 * @param {Object} options - { deep: boolean, delayBetweenOrgs: number }
 * @returns {Object} Summary of all scraping
 */
async function scrapeAllOrganizations(options = {}) {
    const { deep = false, delayBetweenOrgs = 2000 } = options;

    console.log('════════════════════════════════════════════════════════════════');
    console.log('🚀 SCRAPE ALL ORGANIZATIONS');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${deep ? 'Deep Scrape' : 'Basic Scrape'}`);
    console.log(`   Delay between orgs: ${delayBetweenOrgs / 1000}s`);
    console.log(`   TOU Check: ✅ Enabled (before each scrape)`);
    console.log('');

    // Initialize
    await base.init();
    await base.authenticate();

    // Get all scrapable organizations
    console.log('📥 Fetching eligible organizations...\n');
    const organizations = await base.getScrapableOrganizations();

    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔒 ORGANIZATIONS PASSING SAFETY GATES');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Found ${organizations.length} organizations eligible for scraping`);
    console.log('');
    console.log('   Criteria applied:');
    console.log('   • status = "Live (Scraping Active)"');
    console.log('   • scraping_enabled = TRUE');
    console.log('   • tou_flag ≠ TRUE');
    console.log('   • tech_block_flag ≠ TRUE');
    console.log('════════════════════════════════════════════════════════════════\n');

    if (organizations.length === 0) {
        console.log('⚠️ No organizations eligible for scraping.');
        console.log('');
        console.log('To enable scraping for an organization:');
        console.log('1. Open Admin Interface');
        console.log('2. Set status = "Live (Scraping Active)"');
        console.log('3. Check "Scraping Enabled"');
        console.log('4. Ensure TOU Flag and Technical Block are unchecked');
        console.log('');
        return { total: 0, results: [] };
    }

    // List organizations
    console.log('📋 Organizations to scrape:');
    organizations.forEach((org, i) => {
        const hasCustom = hasCustomScraper(org) ? '🔧' : '📦';
        const scraperInfo = org.scraper_key ? `[${org.scraper_key}]` : '';
        const touInfo = org.tou_url ? '📜' : '';
        console.log(`   ${i + 1}. ${hasCustom} ${touInfo} ${org.name} ${scraperInfo}`);
    });
    console.log('');
    console.log('   🔧 = Custom scraper | 📦 = Generic scraper | 📜 = TOU check enabled');
    console.log('');

    // Scrape each organization
    const results = [];
    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];

        const result = await scrapeOrganization(org, { deep });
        results.push({
            name: org.name,
            created: result.created,
            skipped: result.skipped,
            errors: result.errors,
            blocked: result.blocked
        });

        totalCreated += result.created;
        totalSkipped += result.skipped;
        totalErrors += result.errors;

        // Delay between organizations
        if (i < organizations.length - 1) {
            console.log(`⏳ Waiting ${delayBetweenOrgs / 1000}s before next organization...\n`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenOrgs));
        }
    }

    // Final summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 FINAL SCRAPING SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('Results by Organization:');
    console.log('────────────────────────────────────────────────────────────────');

    results.forEach(r => {
        const status = r.blocked ? '⛔' : (r.errors > 0 ? '⚠️' : '✅');
        console.log(`   ${status} ${r.name}: ${r.created} created, ${r.skipped} skipped, ${r.errors} errors`);
    });

    console.log('────────────────────────────────────────────────────────────────');
    console.log('');
    console.log(`   📈 Total Created: ${totalCreated}`);
    console.log(`   ⏭️ Total Skipped: ${totalSkipped}`);
    console.log(`   ❌ Total Errors: ${totalErrors}`);
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ Scraping complete!');
    console.log('════════════════════════════════════════════════════════════════\n');

    return {
        total: organizations.length,
        totalCreated,
        totalSkipped,
        totalErrors,
        results
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    // Registry functions
    getScraperForOrg,
    hasCustomScraper,
    listCustomScrapers,

    // Main scraping functions
    scrapeOrganization,
    scrapeAllOrganizations,

    // Re-export base functions for convenience
    base
};
