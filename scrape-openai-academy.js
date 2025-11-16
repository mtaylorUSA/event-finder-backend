require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const pb = new PocketBase(POCKETBASE_URL);

async function scrapeOpenAIAcademy() {
  console.log('\n📥 Scraping OpenAI Academy Events...');
  console.log('────────────────────────────────────────');

  try {
    // Authenticate
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // Get organization
    const orgs = await pb.collection('organizations').getList(1, 50, {
      filter: 'name~"OpenAI Academy"'
    });

    if (orgs.items.length === 0) {
      console.log('⚠️  OpenAI Academy organization not found');
      return;
    }

    const organization = orgs.items[0];
    const url = 'https://academy.openai.com/';

    console.log(`📡 Fetching: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Look for event cards - they have time/date info in format "2:00 PM - 3:00 PM, Nov 17 EST"
    $('div').each((i, element) => {
      const $el = $(element);
      const text = $el.text();

      // Look for the date/time pattern
      const dateTimeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)),\s*([A-Za-z]+\s+\d{1,2})\s*(EST|EDT|PST|PDT|CST|CDT)/i);

      if (dateTimeMatch) {
        const start_time = dateTimeMatch[1];
        const end_time = dateTimeMatch[2];
        const dateStr = dateTimeMatch[3]; // e.g., "Nov 17"
        const timezone = dateTimeMatch[4];

        // Find the title (usually in a nearby heading or div)
        let title = $el.find('h1, h2, h3, h4').first().text().trim();
        if (!title) {
          // Try looking in parent or sibling elements
          title = $el.parent().find('h1, h2, h3, h4').first().text().trim();
        }
        if (!title) {
          title = 'OpenAI Academy Event'; // Fallback
        }

        // Parse the date - add current year
        const currentYear = new Date().getFullYear();
        const fullDateStr = `${dateStr} ${currentYear}`;
        const start_date = new Date(fullDateStr);

        if (!isNaN(start_date.getTime())) {
          events.push({
            title: title.substring(0, 200),
            start_date: start_date.toISOString(),
            end_date: null, // Same day event
            start_time: start_time,
            end_time: end_time,
            timezone: timezone,
            url: url,
            description: $el.find('p').first().text().trim().substring(0, 500) || ''
          });
        }
      }
    });

    // Remove duplicates
    const uniqueEvents = [];
    const seen = new Set();
    for (const event of events) {
      const key = `${event.title}-${event.start_date}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(event);
      }
    }

    console.log(`📊 Found ${uniqueEvents.length} unique events`);

    // Save events
    let saved = 0;
    for (const event of uniqueEvents) {
      try {
        // Check if exists
        const existing = await pb.collection('events').getList(1, 1, {
          filter: `organization="${organization.id}" && title="${event.title.replace(/"/g, '\\"')}" && start_date="${event.start_date}"`
        });

        if (existing.items.length === 0) {
          await pb.collection('events').create({
            organization: organization.id,
            ...event
          });
          saved++;
        }
      } catch (error) {
        console.error(`❌ Error saving "${event.title}":`, error.message);
      }
    }

    console.log(`💾 Saved ${saved} new events`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  scrapeOpenAIAcademy()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = scrapeOpenAIAcademy;
