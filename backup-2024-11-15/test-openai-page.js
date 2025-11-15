const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPage() {
  const response = await fetch('https://academy.openai.com/public/events');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log('=== ALL OPENAI EVENTS ===\n');
  
  let eventCount = 0;
  
  $('div.tenant-event-card').each((i, element) => {
    eventCount++;
    const fullText = $(element).text().trim();
    const link = $(element).find('a').attr('href');
    
    console.log(`Event ${eventCount}:`);
    console.log('Full text:', fullText);
    console.log('Link:', link);
    console.log('---\n');
  });
  
  console.log(`\nTotal events found: ${eventCount}`);
}

testPage();