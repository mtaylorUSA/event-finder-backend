require('dotenv').config();
const BaseScraper = require('./base-scraper');
const scrapeOpenAIAcademy = require('./scrape-openai-academy');
const scrapeOpenAIForum = require('./scrape-openai-forum');

/**
 * Main scraper that processes all organizations from PocketBase
 */
async function scrapeAllOrganizations() {
  console.log('========================================');
  console.log('🚀 National Security Events Scraper');
  console.log('    (Dynamic Multi-Organization)');
  console.log('========================================\n');

  const scraper = new BaseScraper();
  
  try {
    // Run custom OpenAI scrapers first
    console.log('\n🔧 Running Custom Scrapers...\n');
    try {
      await scrapeOpenAIAcademy();
    } catch (error) {
      console.error('Error in OpenAI Academy scraper:', error.message);
    }
    
    try {
      await scrapeOpenAIForum();
    } catch (error) {
      console.error('Error in OpenAI Forum scraper:', error.message);
    }

    console.log('\n========================================');
    console.log('📥 Running Generic Scraper for All Organizations...\n');
    
    // Fetch all organizations from PocketBase
    const organizations = await scraper.getAllOrganizations();
    
    console.log(`✅ Found ${organizations.length} organizations\n`);

    if (organizations.length === 0) {
      console.log('⚠️  No organizations found in database');
      return;
    }

    let totalEvents = 0;
    const results = [];

    // Scrape each organization
    for (let i = 0; i < organizations.length; i++) {
      const org = organizations[i];
      
      console.log(`\n[${i + 1}/${organizations.length}] Processing: ${org.name}`);
      console.log(`Website: ${org.website}`);
      if (org.events_url) {
        console.log(`Events URL: ${org.events_url}`);
      }

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
          await sleep(2000); // 2 second delay
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
    console.log('\n========================================');
    console.log('📊 SCRAPING SUMMARY');
    console.log('========================================\n');

    console.log('Results by Organization:');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const events = result.events > 0 ? `${result.events} events` : 'no events';
      console.log(`${status} ${result.name}: ${events}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log(`\n📈 Total: ${totalEvents} events found across ${organizations.length} organizations`);
    console.log('\n========================================');
    console.log('✅ Scraping completed!');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Sleep helper function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
