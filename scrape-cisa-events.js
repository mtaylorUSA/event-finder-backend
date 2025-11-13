require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const CISA_ORG_ID = '7ogxcgvlck4ljvw';

async function scrapeCISAEvents() {
  try {
    console.log('Fetching CISA events page...');
    const response = await fetch('https://www.cisa.gov/news-events/events');
    const html = await response.text();
    const $ = cheerio.load(html);

    const events = [];

    $('article').each((index, element) => {
      const title = $(element).find('h3 a').text().trim();
      const url = $(element).find('h3 a').attr('href');
      const dateText = $(element).find('.c-teaser__date time').first().text().trim();
      const location = $(element).find('.c-teaser__meta').text().trim();

      if (title && url) {
        events.push({
          title,
          url: url.startsWith('http') ? url : `https://www.cisa.gov${url}`,
          start_date: dateText || '',
          location: location || '',
          description: '',
          organization: CISA_ORG_ID,
          source_id: url
        });
      }
    });

    console.log(`Found ${events.length} events`);

    for (const event of events) {
      try {
        const existingResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/events/records?filter=(source_id='${event.source_id}')`
        );
        const existingData = await existingResponse.json();

        if (existingData.items && existingData.items.length > 0) {
          console.log(`Skipping duplicate: ${event.title}`);
          continue;
        }

        const createResponse = await fetch(`${POCKETBASE_URL}/api/collections/events/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });

        if (createResponse.ok) {
          console.log(`Created: ${event.title}`);
        } else {
          const errorData = await createResponse.json();
          console.error(`Failed to create: ${event.title}`, errorData);
        }
      } catch (err) {
        console.error(`Error processing event: ${event.title}`, err.message);
      }
    }

    console.log('Scraping complete!');
  } catch (error) {
    console.error('Scraping failed:', error.message);
  }
}

scrapeCISAEvents();