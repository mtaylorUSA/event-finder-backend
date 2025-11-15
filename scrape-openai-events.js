require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const OPENAI_ORG_ID = 'k2o2cehyo72rhab';

function convertGMTtoEST(timeString) {
  // Convert "7:00 PM GMT" to EST (GMT-5)
  if (!timeString) return '';
  
  try {
    const match = timeString.match(/(\d+):(\d+)\s+([AP]M)/);
    if (!match) return timeString;
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3];
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    // Subtract 5 hours for EST
    hours -= 5;
    
    // Handle day rollover
    if (hours < 0) hours += 24;
    if (hours >= 24) hours -= 24;
    
    // Convert back to 12-hour format
    const estAmPm = hours >= 12 ? 'PM' : 'AM';
    const estHours = hours % 12 || 12;
    
    return `${estHours}:${minutes} ${estAmPm} EST`;
  } catch (e) {
    return timeString;
  }
}

function parseDateAndTime(dateString) {
  if (!dateString) return { startDate: '', endDate: '', startTime: '', endTime: '' };
  
  try {
    // Parse "7:00 PM - 8:00 PM, Nov 14 GMT" format
    const dateMatch = dateString.match(/([A-Za-z]+)\s+(\d+)/);
    if (!dateMatch) return { startDate: '', endDate: '', startTime: '', endTime: '' };
    
    const month = dateMatch[1];
    const day = dateMatch[2];
    
    // Determine year
    const now = new Date();
    const currentYear = now.getFullYear();
    const testDate = new Date(`${month} ${day}, ${currentYear}`);
    
    let year = currentYear;
    if (testDate < now) {
      year = currentYear + 1;
    }
    
    const date = new Date(`${month} ${day}, ${year}`);
    if (isNaN(date.getTime())) return { startDate: '', endDate: '', startTime: '', endTime: '' };
    
    const isoDate = date.toISOString();
    
    // Extract time parts: "7:00 PM - 8:00 PM"
    const timeMatch = dateString.match(/(\d+:\d+\s+[AP]M)\s+-\s+(\d+:\d+\s+[AP]M)/);
    
    if (timeMatch) {
      return {
        startDate: isoDate,
        endDate: isoDate,
        startTime: convertGMTtoEST(timeMatch[1]),
        endTime: convertGMTtoEST(timeMatch[2])
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

async function scrapeOpenAIEvents() {
  try {
    console.log('Fetching OpenAI Academy events page...');
    const response = await fetch('https://academy.openai.com/public/events');
    const html = await response.text();
    const $ = cheerio.load(html);

    const events = [];

    $('div.tenant-event-card').each((index, element) => {
      const fullText = $(element).text();
      
      // Extract title
      let title = '';
      $(element).find('div').each((i, div) => {
        const text = $(div).text().trim();
        if (text.includes('ChatGPT') || text.includes('OpenAI')) {
          const lines = text.split(/\d+:\d+/).filter(line => line.trim().length > 0);
          if (lines[0] && lines[0].length < 100) {
            title = lines[0]
              .replace(/Livestream/g, '')
              .replace(/·\s*K-12 Education/g, '')
              .replace(/·\s*Nonprofits/g, '')
              .replace(/·\s*Government/g, '')
              .trim();
            return false;
          }
        }
      });

      // Extract date/time
      const dateMatch = fullText.match(/(\d+:\d+\s+[AP]M\s+-\s+\d+:\d+\s+[AP]M,\s+[A-Za-z]+\s+\d+\s+GMT)/);
      const dateText = dateMatch ? dateMatch[1] : '';
      
      const { startDate, endDate, startTime, endTime } = parseDateAndTime(dateText);
      
      // Determine target audience
      let targetAudience = 'General public';
      if (title.toLowerCase().includes('government')) {
        targetAudience = 'Government employees';
      } else if (title.toLowerCase().includes('education')) {
        targetAudience = 'K-12 educators';
      } else if (title.toLowerCase().includes('nonprofit')) {
        targetAudience = 'Nonprofit professionals';
      } else if (title.toLowerCase().includes('veteran')) {
        targetAudience = 'Transitioning veterans';
      }
      
      const link = $(element).find('a').attr('href');
      
      if (title && link) {
        // Filter past events
        let isPastEvent = false;
        if (dateText && dateText.includes('Oct') && !dateText.includes('2026')) {
          isPastEvent = true;
        }

        if (!isPastEvent) {
          events.push({
            title,
            url: link.startsWith('http') ? link : `https://academy.openai.com${link}`,
            start_date: startDate,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            location: 'Online',
            timezone: 'EST',
            description: 'OpenAI Academy training session on ChatGPT and AI tools',
            organization: OPENAI_ORG_ID,
            source_id: link,
            event_type: 'Virtual',
            registration_required: true,
            cost: 'Free',
            target_audience: targetAudience
          });
        }
      }
    });

    console.log(`Found ${events.length} upcoming events`);

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

scrapeOpenAIEvents();