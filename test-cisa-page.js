const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testPage() {
  const response = await fetch('https://www.cisa.gov/news-events/events');
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log('Found', $('article').length, 'article elements\n');
  
  $('article').first().each((i, element) => {
    console.log('=== FIRST ARTICLE STRUCTURE ===');
    console.log('Full HTML:', $(element).html().substring(0, 1000));
    console.log('\n=== TESTING SELECTORS ===');
    console.log('Title with h3 a:', $(element).find('h3 a').text().trim());
    console.log('Title with .title a:', $(element).find('.title a').text().trim());
    console.log('Link href:', $(element).find('a').first().attr('href'));
    console.log('All text:', $(element).text().trim().substring(0, 300));
  });
}

testPage();