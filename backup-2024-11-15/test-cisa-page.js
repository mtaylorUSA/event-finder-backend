const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPage() {
  const response = await fetch('https://www.cisa.gov/news-events/events');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log('=== FIRST EVENT DETAILS ===\n');
  
  const firstEvent = $('article').first();
  const title = firstEvent.find('h3 a').text().trim();
  const dateText = firstEvent.find('.c-teaser__date time').first().text().trim();
  const locationAndType = firstEvent.find('.c-teaser__meta').text().trim();
  
  console.log('Title:', title);
  console.log('Date text:', dateText);
  console.log('Location/Type:', locationAndType);
  console.log('Date text length:', dateText.length);
}

testPage();