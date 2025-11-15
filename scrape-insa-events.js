require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const INSA_ORG_ID = '3l9igkua694zq4g';

function parseDateAndTime(dateString) {
  if (!dateString) return { startDate: '', endDate: '', startTime: '', endTime: '' };
  
  try {
    // Parse "December 16, 2025 8:00 AM to 11:30 AM" format
    // Extract date part
    const dateMatch = dateString.match(/([A-Za-z]+\s+\d+,\s+\d{4})/);
    if (!dateMatch) return { startDate: '', endDate: '', startTime: '', endTime: '' };
    
    const datePart = dateMatch[1];
    const date = new Date(datePart);
    if (isNaN(date.getTime())) return { startDate: '', endDate: '', startTime: '', endTime: '' };
    
    const isoDate = date.toISOString();
    
    // Extract time parts: "8:00 AM to 11:30 AM"
    const timeMatch = dateString.match(/(\d+:\d+\s+[AP]M)\s+to\s+(\d+:\d+\s+[AP]M)/);
    
    if (timeMatch) {
      return {
        startDate: isoDate,
        endDate: isoDate, // Same day event
        startTime: `${timeMatch[1]} EST`, // INSA events are US-based, assume EST
        endTime: `${timeMatch[2]} EST`
      };
    }
    
    return {
      startDate: isoDate,
      endDate: isoDate,
      startTime: '',
      endTime: ''
    };
  } catch (e) {
    console.log(`Could not parse date: ${dateString}`);
    return { startDate: '', endDate: '', startTime: '', endTime: '' };
  }
}

async function scrapeINSAEvents() {
  try {
    console.log('Fetching INSA events page...');
    const response = await fetch('https://www.insaonline.org/calendar-of-events');
    const html = await response.text();
    const $ = cheerio.load(html);

    const events = [];

    $('li.item-list__item').each((index, element) => {
      const title = $(element).find('.item-list__title').text().trim();
      const fullText = $(element).find('.item-list__content').text().trim();
      const url = $(element).find('.item-list__link').attr('href');
      
      // Extract date and location from full text
      const lines = fullText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const dateText = lines[1] || '';
      const location = lines[2] || '';
      
      const { startDate, endDate, startTime, endTime } = parseDateAndTime(dateText);
      
      // Determine event type
      let eventType = 'In-person';
      if (location.toLowerCase().includes('virtual') || location.toLowerCase().includes('online')) {
        eventType = 'Virtual';
      }

      if (title && url) {
        events.push({
          title,
          url: url.startsWith('http') ? url : `https://www.insaonline.org${url}`,
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          location: location,
          timezone: 'EST',
          description: 'Intelligence and National Security Alliance networking and professional development event',
          organization: INSA_ORG_ID,
          source_id: url,
          event_type: eventType,
          registration_required: true,
          cost: 'Varies by event',
          target_audience: 'Intelligence and national security professionals'
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

scrapeINSAEvents();