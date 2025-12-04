/**
 * scrape-cfr-events.js
 * 
 * Deep scraper for CFR (Council on Foreign Relations) events
 * 
 * Features:
 * - Level 1: Gets event URLs from main events page
 * - Level 2: Visits each event page for full details
 * - Extracts: title, description, date/time, location, speakers
 * - Uses source_id (URL) for deduplication
 * - Node.js v24 compatible (dynamic import)
 * 
 * Usage: node scrape-cfr-events.js
 * 
 * Last Updated: 2025-12-01
 */

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// CFR organization ID in PocketBase
const CFR_ORG_ID = 'nnk3jwck6s0rjsn';

// CFR events page URL
const CFR_EVENTS_URL = 'https://www.cfr.org/events';

// Bad/generic titles to skip
const BAD_TITLES = [
  'upcoming events', 'events', 'calendar', 'event', 'register',
  'registration', 'sign up', 'learn more', 'read more', 'click here',
  'view all', 'see all', 'more events', 'all events'
];

// Delay between requests (be polite to the server)
const REQUEST_DELAY_MS = 1500;

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function scrapeCFREvents() {
  // Dynamic import for node-fetch (Node.js v18+ compatible)
  const fetch = (await import('node-fetch')).default;
  const cheerio = (await import('cheerio')).default;

  let authToken = null;

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  function parseDate(dateString) {
    if (!dateString) return null;
    
    try {
      // Handle various date formats
      // "December 15, 2025" or "January 8, 2026"
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      console.log(`   ⚠️  Could not parse date: ${dateString}`);
    }
    return null;
  }

  function parseTime(timeString) {
    if (!timeString) return '';
    // Clean up time string
    return timeString.trim().replace(/\s+/g, ' ');
  }

  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }

  async function fetchPage(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    
    return await response.text();
  }

  async function updateLastScraped() {
    try {
      await fetch(`${POCKETBASE_URL}/api/collections/organizations/records/${CFR_ORG_ID}`, {
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

  // =========================================================================
  // LEVEL 1: GET EVENT URLS FROM LIST PAGE
  // =========================================================================

  async function getEventUrls($) {
    const eventUrls = [];
    
    // CFR event list selectors - adjust based on actual page structure
    $('a[href*="/event/"]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://www.cfr.org${href}`;
        // Avoid duplicates
        if (!eventUrls.includes(fullUrl)) {
          eventUrls.push(fullUrl);
        }
      }
    });

    return eventUrls;
  }

  // =========================================================================
  // LEVEL 2: SCRAPE INDIVIDUAL EVENT PAGE
  // =========================================================================

  async function scrapeEventPage(url, cheerio) {
    try {
      console.log(`   📄 Fetching: ${url}`);
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // Extract event details - selectors based on CFR page structure
      // These may need adjustment based on actual HTML
      
      // Title
      const title = $('h1').first().text().trim() ||
                    $('[class*="title"]').first().text().trim() ||
                    $('title').text().split('|')[0].trim();

      if (isBadTitle(title)) {
        console.log(`   ⏭️  Skipping bad title: "${title}"`);
        return null;
      }

      // Description - look for main content area
      let description = '';
      
      // Try various selectors for description
      const descSelectors = [
        '[class*="body"] p',
        '[class*="description"]',
        '[class*="content"] p',
        '[class*="summary"]',
        'article p',
        '.event-description',
        '.event-body'
      ];
      
      for (const selector of descSelectors) {
        const text = $(selector).first().text().trim();
        if (text && text.length > 50) {
          description = cleanText(text);
          break;
        }
      }

      // If still no description, try getting first few paragraphs
      if (!description) {
        const paragraphs = [];
        $('p').each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 30 && paragraphs.length < 3) {
            paragraphs.push(text);
          }
        });
        description = cleanText(paragraphs.join(' '));
      }

      // Limit description length
      if (description.length > 1000) {
        description = description.substring(0, 997) + '...';
      }

      // Date and Time
      let dateText = '';
      let timeText = '';
      
      const dateSelectors = [
        '[class*="date"]',
        '[class*="time"]',
        'time',
        '[datetime]'
      ];
      
      for (const selector of dateSelectors) {
        const el = $(selector).first();
        const text = el.text().trim();
        const datetime = el.attr('datetime');
        
        if (datetime) {
          dateText = datetime;
          break;
        } else if (text && text.match(/\d{4}|january|february|march|april|may|june|july|august|september|october|november|december/i)) {
          dateText = text;
          break;
        }
      }

      // Look for time separately
      const timeMatch = $('body').text().match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)(?:\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))?(?:\s*[A-Z]{2,4})?)/);
      if (timeMatch) {
        timeText = timeMatch[1];
      }

      // Location
      let location = '';
      const locationSelectors = [
        '[class*="location"]',
        '[class*="venue"]',
        '[class*="address"]',
        '[class*="place"]'
      ];
      
      for (const selector of locationSelectors) {
        const text = $(selector).first().text().trim();
        if (text && text.length > 3) {
          location = cleanText(text);
          break;
        }
      }

      // Event type detection
      let eventType = '';
      const pageText = $('body').text().toLowerCase();
      
      if (pageText.includes('virtual') || pageText.includes('online') || pageText.includes('webinar') || pageText.includes('zoom')) {
        eventType = 'Virtual';
      } else if (pageText.includes('in-person') || pageText.includes('in person')) {
        eventType = 'In-person';
      } else if (pageText.includes('hybrid')) {
        eventType = 'Hybrid';
      } else if (location && !location.toLowerCase().includes('virtual')) {
        eventType = 'In-person';
      } else {
        eventType = 'Virtual'; // Default for CFR since many are virtual
      }

      // Parse date
      const startDate = parseDate(dateText);

      return {
        title,
        url,
        description,
        start_date: startDate || '',
        end_date: startDate || '',
        start_time: parseTime(timeText),
        end_time: '',
        location: location || (eventType === 'Virtual' ? 'Virtual Event' : ''),
        timezone: 'EST',
        organization: CFR_ORG_ID,
        source_id: url,
        event_type: eventType,
        registration_required: true,
        cost: 'Free',
        target_audience: 'Foreign policy professionals and enthusiasts'
      };

    } catch (error) {
      console.error(`   ❌ Error scraping ${url}:`, error.message);
      return null;
    }
  }

  // =========================================================================
  // MAIN SCRAPING LOGIC
  // =========================================================================

  console.log('════════════════════════════════════════');
  console.log('🏛️  CFR Events Deep Scraper');
  console.log('════════════════════════════════════════\n');

  await authenticate();

  try {
    // LEVEL 1: Get event URLs from main page
    console.log('📡 Level 1: Fetching CFR events list page...');
    const listHtml = await fetchPage(CFR_EVENTS_URL);
    const $ = cheerio.load(listHtml);
    
    const eventUrls = await getEventUrls($);
    console.log(`✅ Found ${eventUrls.length} event URLs\n`);

    if (eventUrls.length === 0) {
      console.log('⚠️  No event URLs found. The page structure may have changed.');
      console.log('   Please check: https://www.cfr.org/events');
      return;
    }

    // LEVEL 2: Visit each event page
    console.log('📡 Level 2: Scraping individual event pages...\n');
    
    const events = [];
    let skipped = 0;

    for (let i = 0; i < eventUrls.length; i++) {
      const url = eventUrls[i];
      console.log(`[${i + 1}/${eventUrls.length}] Processing...`);
      
      const event = await scrapeEventPage(url, cheerio);
      
      if (event) {
        events.push(event);
        console.log(`   ✅ "${event.title.substring(0, 50)}..."`);
      } else {
        skipped++;
      }

      // Polite delay between requests
      if (i < eventUrls.length - 1) {
        await sleep(REQUEST_DELAY_MS);
      }
    }

    console.log(`\n📊 Scraped ${events.length} events (${skipped} skipped)\n`);

    // Save events to PocketBase
    console.log('💾 Saving events to PocketBase...\n');
    
    let created = 0;
    let updated = 0;
    let duplicates = 0;
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
          // Update existing event with new data
          const existingId = existingData.items[0].id;
          const updateResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records/${existingId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
              },
              body: JSON.stringify(event)
            }
          );
          
          if (updateResponse.ok) {
            console.log(`   🔄 Updated: "${event.title.substring(0, 50)}..."`);
            updated++;
          } else {
            duplicates++;
          }
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
    console.log('📊 CFR SCRAPING SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Duplicates: ${duplicates}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n✅ CFR deep scraping complete!\n');

  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

// Run the scraper
scrapeCFREvents();
