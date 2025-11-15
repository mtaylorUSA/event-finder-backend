const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPage() {
  const response = await fetch('https://www.insaonline.org/calendar-of-events');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log('=== ALL EVENTS ===\n');
  
  let eventCount = 0;
  
  $('li.item-list__item').each((i, element) => {
    eventCount++;
    const title = $(element).find('.item-list__title').text().trim();
    const fullText = $(element).find('.item-list__content').text().trim();
    const link = $(element).find('.item-list__link').attr('href');
    
    console.log(`Event ${eventCount}:`);
    console.log('Title:', title);
    console.log('Full text:', fullText);
    console.log('Link:', link);
    console.log('---\n');
  });
  
  console.log(`\nTotal events found: ${eventCount}`);
}

testPage();