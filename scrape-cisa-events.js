/**
 * scrape-cisa-events.js
 * 
 * Scrapes events from CISA (Cybersecurity and Infrastructure Security Agency)
 * 
 * Features:
 * - Uses source_id (URL) for deduplication
 * - Filters out generic/bad titles
 * - Node.js v24 compatible (dynamic import)
 * - Updates organization's last_scraped timestamp
 * 
 * Usage: node scrape-cisa-events.js
 * 
 * Last Updated: 2025-11-28
 */

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// CISA organization ID in PocketBase
const CISA_ORG_ID = '7ogxcgvlck4ljvw';

// Bad/generic titles to skip
const BAD_TITLES = [
  'upcoming events', 'events', 'calendar', 'event', 'register',
  'registration', 'sign up', 'learn more', 'read more', 'click here',
  'view all', 'see all', 'more events', 'all events'
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function scrapeCISAEvents() {
  // Dynamic import for node-fetch (Node.js v18+ compatible)
  const fetch = (await import('node-fetch')).default;
  const cheerio = (await import('cheerio')).default;

  let authToken = null;

  // ══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  async function authenticate() {
    console.log('🔐 Authenticating with PocketBase...');
    
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: POCKETBASE_ADMIN_EMAIL,
          password: POCKETBASE_ADMIN_PASSWORD
        })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      authToken = data.token;
      console.log('✅ Authenticated successfully\n');
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      process.exit(1);
    }
  }

  function isBadTitle(title) {
    if (!title) return true;
    const normalized = title.toLowerCase().trim();
    if (normalized.length < 5) return true;
    return BAD_TITLES.includes(normalized);
  }

  function parseDateAndTime(dateString) {
    if (!dateString) return { date: '', time: '' };
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { date: '', time: '' };
      
      return {
        date: date.toISOString(),
        time: ''
      };
    } catch (e) {
      console.log(`   ⚠️  Could not parse date: ${dateString}`);
      return { date: '', time: '' };
    }
  }

  function generateSourceId(url, title) {
    // Use full URL as source_id for reliable deduplication
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://www.cisa.gov${url}`;
      return fullUrl;
    }
    // Fallback: generate from title
    return `cisa-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100)}`;
  }

  async function updateLastScraped() {
    try {
      await fetch(`${POCKETBASE_URL}/api/collections/organizations/records/${CISA_ORG_ID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify({
          last_scraped: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('   ⚠️  Could not update last_scraped timestamp');
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN SCRAPING LOGIC
  // ══════════════════════════════════════════════════════════════════════════

  console.log('════════════════════════════════════════');
  console.log('🏛️  CISA Events Scraper');
  console.log('════════════════════════════════════════\n');

  await authenticate();

  try {
    console.log('📡 Fetching CISA events page...');
    const response = await fetch('https://www.cisa.gov/news-events/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('✅ Page fetched successfully\n');

    const events = [];
    let skippedBadTitle = 0;

    $('article').each((index, element) => {
      const title = $(element).find('h3 a').text().trim();
      const url = $(element).find('h3 a').attr('href');
      const dateText = $(element).find('.c-teaser__date time').first().text().trim();
      const locationAndType = $(element).find('.c-teaser__meta').text().trim();
      
      // Skip bad titles
      if (isBadTitle(title)) {
        skippedBadTitle++;
        return;
      }

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

      // Generate source_id for deduplication
      const source_id = generateSourceId(url, title);

      if (title && source_id) {
        events.push({
          title,
          url: url.startsWith('http') ? url : `https://www.cisa.gov${url}`,
          start_date: date,
          end_date: date,
          start_time: time,
          end_time: '',
          location: location,
          timezone: 'EST',
          description: '',
          organization: CISA_ORG_ID,
          source_id: source_id,
          event_type: eventType,
          registration_required: true,
          cost: 'Free',
          target_audience: 'Federal security professionals'
        });
      }
    });

    console.log(`📊 Found ${events.length} valid events`);
    if (skippedBadTitle > 0) {
      console.log(`   ⏭️  Skipped ${skippedBadTitle} bad/generic titles`);
    }
    console.log('');

    // Save events to PocketBase
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const event of events) {
      try {
        // Check if event already exists by source_id
        const existingResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/events/records?filter=(source_id='${encodeURIComponent(event.source_id)}')`,
          { headers: { 'Authorization': authToken } }
        );
        const existingData = await existingResponse.json();

        if (existingData.items && existingData.items.length > 0) {
          console.log(`   ⏭️  Exists: "${event.title.substring(0, 50)}..."`);
          skipped++;
          continue;
        }

        // Create new event
        const createResponse = await fetch(`${POCKETBASE_URL}/api/collections/events/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
          },
          body: JSON.stringify(event)
        });

        if (createResponse.ok) {
          console.log(`   ✅ Created: "${event.title.substring(0, 50)}..."`);
          created++;
        } else {
          const errorData = await createResponse.json();
          console.error(`   ❌ Failed: "${event.title}" -`, errorData.message || 'Unknown error');
          errors++;
        }
      } catch (err) {
        console.error(`   ❌ Error: "${event.title}" -`, err.message);
        errors++;
      }
    }

    // Update last_scraped timestamp
    await updateLastScraped();

    // Summary
    console.log('\n════════════════════════════════════════');
    console.log('📊 CISA SCRAPING SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n✅ CISA scraping complete!\n');

  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

// Run the scraper
scrapeCISAEvents();
