/**
 * scrape-insa-events.js
 * 
 * Scrapes events from INSA (Intelligence and National Security Alliance)
 * 
 * Features:
 * - Uses source_id (URL) for deduplication
 * - Filters out generic/bad titles
 * - Node.js v24 compatible (dynamic import)
 * - Updates organization's last_scraped timestamp
 * 
 * Usage: node scrape-insa-events.js
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

// INSA organization ID in PocketBase
const INSA_ORG_ID = '3l9igkua694zq4g';

// Bad/generic titles to skip
const BAD_TITLES = [
  'upcoming events', 'events', 'calendar', 'event', 'register',
  'registration', 'sign up', 'learn more', 'read more', 'click here',
  'view all', 'see all', 'more events', 'all events'
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function scrapeINSAEvents() {
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
    if (!dateString) return { startDate: '', endDate: '', startTime: '', endTime: '' };
    
    try {
      // Parse "December 16, 2025 8:00 AM to 11:30 AM" format
      const dateMatch = dateString.match(/([A-Za-z]+\s+\d+,\s+\d{4})/);
      if (!dateMatch) return { startDate: '', endDate: '', startTime: '', endTime: '' };
      
      const datePart = dateMatch[1];
      const date = new Date(datePart);
      if (isNaN(date.getTime())) return { startDate: '', endDate: '', startTime: '', endTime: '' };
      
      const isoDate = date.toISOString();
      
      // Extract time parts: "8:00 AM to 11:30 AM"
      const timeMatch = dateString.match(/(\d+:\d+\s+[AP]M)\s+to\s+(\d+:\d+\s+[AP]M)/i);
      
      if (timeMatch) {
        return {
          startDate: isoDate,
          endDate: isoDate,
          startTime: `${timeMatch[1]} EST`,
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
      console.log(`   ⚠️  Could not parse date: ${dateString}`);
      return { startDate: '', endDate: '', startTime: '', endTime: '' };
    }
  }

  function generateSourceId(url, title) {
    // Use full URL as source_id for reliable deduplication
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://www.insaonline.org${url}`;
      return fullUrl;
    }
    // Fallback: generate from title
    return `insa-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100)}`;
  }

  async function updateLastScraped() {
    try {
      await fetch(`${POCKETBASE_URL}/api/collections/organizations/records/${INSA_ORG_ID}`, {
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
  console.log('🏛️  INSA Events Scraper');
  console.log('════════════════════════════════════════\n');

  await authenticate();

  try {
    console.log('📡 Fetching INSA events page...');
    const response = await fetch('https://www.insaonline.org/calendar-of-events', {
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

    $('li.item-list__item').each((index, element) => {
      const title = $(element).find('.item-list__title').text().trim();
      const fullText = $(element).find('.item-list__content').text().trim();
      const url = $(element).find('.item-list__link').attr('href');
      
      // Skip bad titles
      if (isBadTitle(title)) {
        skippedBadTitle++;
        return;
      }

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

      // Generate source_id for deduplication
      const source_id = generateSourceId(url, title);

      if (title && source_id) {
        events.push({
          title,
          url: url.startsWith('http') ? url : `https://www.insaonline.org${url}`,
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          location: location,
          timezone: 'EST',
          description: '',
          organization: INSA_ORG_ID,
          source_id: source_id,
          event_type: eventType,
          registration_required: true,
          cost: 'Varies by event',
          target_audience: 'Intelligence and national security professionals'
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
    console.log('📊 INSA SCRAPING SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n✅ INSA scraping complete!\n');

  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

// Run the scraper
scrapeINSAEvents();
