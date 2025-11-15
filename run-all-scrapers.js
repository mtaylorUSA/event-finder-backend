require('dotenv').config();
const { execSync } = require('child_process');

console.log('========================================');
console.log('🚀 National Security Events Scraper');
console.log('========================================\n');

const scrapers = [
  { name: 'CISA', file: 'scrape-cisa-events.js' },
  { name: 'INSA', file: 'scrape-insa-events.js' },
  { name: 'OpenAI', file: 'scrape-openai-events.js' }
];

async function runAllScrapers() {
  console.log('Starting scraping process...\n');
  
  for (const scraper of scrapers) {
    try {
      console.log(`\n📥 Running ${scraper.name} scraper...`);
      console.log('─'.repeat(40));
      
      execSync(`node ${scraper.file}`, { 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      
      console.log('─'.repeat(40));
    } catch (error) {
      console.error(`\n❌ Error running ${scraper.name} scraper:`, error.message);
    }
  }
  
  console.log('\n========================================');
  console.log('✅ All scrapers completed!');
  console.log('========================================\n');
}

runAllScrapers();
