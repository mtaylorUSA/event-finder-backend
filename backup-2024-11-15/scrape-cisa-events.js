require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const CISA_ORG_ID = '7ogxcgvlck4ljvw';

function parseDateAndTime(dateString) {
  if (!dateString) return { date: '', time: '' };
  
  try {
    // Parse "Nov 18, 2025" format - no time provided by CISA
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { date: '', time: '' };
    
    return {
      date: date.toISOString(),
      time: '' // CISA doesn't provide times
    };
  } catch (e) {
    console.log(`Could not parse date: ${dateString}`);
    return { date: '', time: '' };
  }
}

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
      const locationAndType = $(element).find('.c-teaser__meta').text().trim();
      
      const { date, time } = parseDateAndTime(dateText);
      
      // Parse location and event type
      const parts = locationAndType.split('|').map(p => p.trim());
      const location = parts.length > 1 ? parts[1] : locationAndType;
      
      // Determine event type
      let eventType = '';
      if (location.toLowerCase().includes('virtual') || location.toLowerCase().includes('online')) {
        eventType = 'Virtual';
      } else if (location.toLowerCase().includes('in-person')) {
        eventType = 'In-person';
      }

      if (title && url) {
        events.push({
          title,
          url: url.startsWith('http') ? url : `https://www.cisa.gov${url}`,
          start_date: date,
          end_date: date, // Single-day events
          start_time: time,
          end_time: '',
          location: location,
          timezone: 'EST',
          description: 'CISA federal security training and education event',
          organization: CISA_ORG_ID,
          source_id: url,
          event_type: eventType,
          registration_required: true,
          cost: 'Free',
          target_audience: 'Federal security professionals'
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