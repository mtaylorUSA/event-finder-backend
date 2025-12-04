/**
 * scrape-all-organizations.js
 *
 * Master script that processes all organizations from PocketBase
 * - Only scrapes orgs where scraping_enabled = true
 * - Uses base-scraper.js for actual scraping
 * - Updates last_scraped timestamp after each org
 * - 2-second delay between orgs (polite scraping)
 *
 * Usage: node scrape-all-organizations.js
 *
 * Last Updated: 2025-12-04
 */

require('dotenv').config();
const BaseScraper = require('./base-scraper');

/**
 * Sleep helper function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main scraper function
 */
async function scrapeAllOrganizations() {
  console.log('════════════════════════════════════════');
  console.log('🚀 National Security Events Scraper');
  console.log('    (Dynamic Multi-Organization)');
  console.log('════════════════════════════════════════\n');

  const scraper = new BaseScraper();

  try {
    // Fetch all organizations with scraping_enabled = true
    console.log('📥 Fetching organizations from PocketBase...');
    console.log('   (Only orgs with scraping_enabled = true)\n');

    const organizations = await scraper.getAllOrganizations();

    console.log(`✅ Found ${organizations.length} organizations ready to scrape\n`);

    if (organizations.length === 0) {
      console.log('⚠️  No organizations have scraping enabled.');
      console.log('');
      console.log('To enable scraping for an organization:');
      console.log('1. Open PocketBase Admin');
      console.log('2. Go to organizations collection');
      console.log('3. Edit the org and set scraping_enabled = true');
      console.log('4. Make sure status = "Permission Granted" or "Scraping Active"');
      console.log('');
      return;
    }

    let totalEvents = 0;
    const results = [];

    // Scrape each organization
    for (let i = 0; i < organizations.length; i++) {
      const org = organizations[i];

      console.log(`\n[${i + 1}/${organizations.length}] Processing: ${org.name}`);
      console.log(`   Website: ${org.website || 'N/A'}`);
      console.log(`   Events URL: ${org.events_url || 'N/A'}`);
      console.log(`   Last Scraped: ${org.last_scraped || 'Never'}`);

      try {
        const events = await scraper.scrapeEvents(org);
        totalEvents += events.length;

        results.push({
          name: org.name,
          events: events.length,
          success: true
        });

        // Small delay between organizations to be polite
        if (i < organizations.length - 1) {
          console.log('\n⏳ Waiting 2 seconds before next org...');
          await sleep(2000);
        }
      } catch (error) {
        console.error(`❌ Error scraping ${org.name}:`, error.message);
        results.push({
          name: org.name,
          events: 0,
          success: false,
          error: error.message
        });
      }
    }

    // Print summary
    console.log('\n════════════════════════════════════════');
    console.log('📊 SCRAPING SUMMARY');
    console.log('════════════════════════════════════════\n');

    console.log('Results by Organization:');
    console.log('────────────────────────────────────────');

    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const events = result.events > 0 ? `${result.events} events` : 'no events';
      console.log(`${status} ${result.name}: ${events}`);
      if (result.error) {
        console.log(`   └─ Error: ${result.error}`);
      }
    });

    console.log('────────────────────────────────────────');
    console.log(`\n📈 Total: ${totalEvents} events found across ${organizations.length} organizations`);

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);

    console.log('\n════════════════════════════════════════');
    console.log('✅ Scraping completed!');
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the scraper
if (require.main === module) {
  scrapeAllOrganizations()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = scrapeAllOrganizations;
