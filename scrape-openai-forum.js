require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const pb = new PocketBase(POCKETBASE_URL);

async function scrapeOpenAIForum() {
  console.log('\n📥 Scraping OpenAI Forum Events...');
  console.log('────────────────────────────────────────');

  try {
    // Authenticate
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // Get organization
    const orgs = await pb.collection('organizations').getList(1, 50, {
      filter: 'name~"OpenAI Forum"'
    });

    if (orgs.items.length === 0) {
      console.log('⚠️  OpenAI Forum Events organization not found');
      return;
    }

    const organization = orgs.items[0];
    const url = 'https://forum.openai.com/public/events?state=upcoming';

    console.log(`📡 Fetching: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Look for "Live in X days" badges and associated event info
    $('[class*="event"], article, .card, [class*="card"]').each((i, element) => {
      const $el = $(element);
      const text = $el.text();

      // Look for "Live in X days" pattern
      const liveInMatch = text.match(/Live in (\d+) days?/i);

      if (liveInMatch) {
        const daysUntil = parseInt(liveInMatch[1]);
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + daysUntil);

        // Find title - look for "Virtual Event:" or similar
        let title = '';
        const titleMatch = text.match(/Virtual Event:\s*(.+?)(?:Livestream|$)/i);
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          // Try finding in headings
          title = $el.find('h1, h2, h3, h4, [class*="title"]').first().text().trim();
        }

        if (!title) {
          title = 'OpenAI Forum Event'; // Fallback
        }

        // Clean up title
        title = title
          .replace(/Virtual Event:\s*/i, '')
          .replace(/Livestream/i, '')
          .trim();

        // Find description
        const description = $el.find('p, [class*="description"]').first().text().trim();

        events.push({
          title: title.substring(0, 200),
          start_date: eventDate.toISOString(),
          end_date: null,
          start_time: '', // Time not always available on forum
          end_time: '',
          timezone: 'EST',
          url: url,
          description: description.substring(0, 500) || ''
        });
      }
    });

    // Remove duplicates
    const uniqueEvents = [];
    const seen = new Set();
    for (const event of events) {
      const key = `${event.title}-${event.start_date.split('T')[0]}`; // Use date part only
      if (!seen.has(key) && event.title.length > 5) { // Filter out empty/short titles
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
          filter: `organization="${organization.id}" && title="${event.title.replace(/"/g, '\\"')}"`
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
  scrapeOpenAIForum()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = scrapeOpenAIForum;
