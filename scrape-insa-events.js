/**
 * scrape-insa-events.js
 *
 * Enhanced INSA (Intelligence and National Security Alliance) Events Scraper
 *
 * Features:
 * - Level 1: Basic scrape from calendar page (title, date, time, location, URL)
 * - Level 2: Deep scrape of detail pages (description, speakers)
 * - Rate limiting: 5-8 seconds randomized between requests
 * - Max 10 events deep-scraped per run to minimize server load
 * - Custom User-Agent with contact info for transparency
 * - Backoff on server errors
 *
 * SAFETY FEATURES (Added 2026-01-05):
 * - Checks status, scraping_enabled, tou_flag, tech_block_flag before running
 * - Auto-updates database if 403 detected
 * - Integrated with safety gate system
 *
 * Permission Status: ✅ GRANTED (Deep scraping approved)
 * Permission Date: January 1, 2026
 *
 * BEST PRACTICE: Run during off-peak hours (early morning or late evening ET)
 *                to minimize impact on INSA's servers.
 *
 * Usage:
 *   node scrape-insa-events.js              # Scrape future events only
 *   node scrape-insa-events.js --deep       # Include deep scraping of detail pages
 *   node scrape-insa-events.js --past       # Include past events (requires sitemap)
 *
 * Last Updated: 2026-01-05
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// INSA organization ID in PocketBase (update if different in your DB)
const INSA_ORG_ID = '3l9igkua694zq4g';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER-FRIENDLY SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

// Rate limiting: Be gentle on INSA's servers
const MIN_DELAY_MS = 5000;  // Minimum 5 seconds between requests
const MAX_DELAY_MS = 8000;  // Maximum 8 seconds (randomized)

// Identify ourselves so INSA can contact us if needed
const USER_AGENT = 'EventFinderBot/1.0 (Personal research tool; Contact: matthew_e_taylor@hotmail.com)';

// Maximum events to deep-scrape per run (prevents overwhelming server)
const MAX_DEEP_SCRAPE_PER_RUN = 10;

// Backoff settings if we encounter errors
const BACKOFF_MULTIPLIER = 2;
const MAX_BACKOFF_MS = 60000; // Max 1 minute backoff

// Bad/generic titles to skip
const BAD_TITLES = [
    'upcoming events', 'events', 'calendar', 'event', 'register',
    'registration', 'sign up', 'learn more', 'read more', 'click here',
    'view all', 'see all', 'more events', 'all events'
];

// Command line arguments
const DEEP_SCRAPE = process.argv.includes('--deep');
const INCLUDE_PAST = process.argv.includes('--past');

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function scrapeINSAEvents() {
    // Dynamic imports for Node.js compatibility
    const fetch = (await import('node-fetch')).default;
    const cheerio = await import('cheerio');

    let authToken = null;

    // ──────────────────────────────────────────────────────────────────────────
    // HELPER FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Sleep function for rate limiting (randomized for natural traffic pattern)
     */
    function sleep(minMs = MIN_DELAY_MS, maxMs = MAX_DELAY_MS) {
        const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Get randomized delay value for logging
     */
    function getDelayRange() {
        return `${MIN_DELAY_MS/1000}-${MAX_DELAY_MS/1000}s`;
    }

    /**
     * Authenticate with PocketBase
     */
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

    // ──────────────────────────────────────────────────────────────────────────
    // SAFETY GATE FUNCTIONS (Added 2026-01-05)
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Fetch organization record from PocketBase
     */
    async function getOrganization() {
        try {
            const response = await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records/${INSA_ORG_ID}`,
                { headers: { 'Authorization': authToken } }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Could not fetch organization:', error.message);
            return null;
        }
    }

    /**
     * Check if organization passes all safety gates
     * @returns {Object} { canScrape: boolean, reason: string }
     */
    function checkSafetyGates(org) {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('🔒 SAFETY GATE CHECK');
        console.log('════════════════════════════════════════════════════════════════\n');

        // Check 1: Status
        if (org.status !== 'Live (Scraping Active)') {
            console.log(`   ❌ Status: "${org.status}" (must be "Live (Scraping Active)")`);
            return { canScrape: false, reason: `Status is "${org.status}"` };
        }
        console.log(`   ✅ Status: "${org.status}"`);

        // Check 2: Scraping enabled
        if (!org.scraping_enabled) {
            console.log('   ❌ scraping_enabled: FALSE');
            return { canScrape: false, reason: 'Scraping is disabled' };
        }
        console.log('   ✅ scraping_enabled: TRUE');

        // Check 3: TOU flag
        if (org.tou_flag === true) {
            console.log('   ❌ tou_flag: TRUE (TOU prohibits scraping)');
            return { canScrape: false, reason: 'TOU flag is set' };
        }
        console.log('   ✅ tou_flag: FALSE');

        // Check 4: Tech block flag
        if (org.tech_block_flag === true) {
            console.log('   ❌ tech_block_flag: TRUE (Site blocks access)');
            return { canScrape: false, reason: 'Technical block flag is set' };
        }
        console.log('   ✅ tech_block_flag: FALSE');

        console.log('\n   ✅ ALL SAFETY GATES PASSED\n');
        return { canScrape: true, reason: 'All checks passed' };
    }

    /**
     * Mark organization as technically blocked (403 detected)
     */
    async function markAsTechBlocked(errorMessage) {
        const today = new Date().toISOString().split('T')[0];

        try {
            await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records/${INSA_ORG_ID}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({
                        status: 'Rejected (By Mission or Org)',
                        tech_block_flag: true,
                        tou_scanned_date: today,
                        tou_notes: `⛔ TECHNICAL BLOCK DETECTED:\n\n${errorMessage}`,
                        scraping_enabled: false
                    })
                }
            );

            console.log('');
            console.log('════════════════════════════════════════════════════════════════');
            console.log('⛔ ORGANIZATION MARKED AS TECHNICALLY BLOCKED');
            console.log('════════════════════════════════════════════════════════════════');
            console.log('   • status → Rejected (By Mission or Org)');
            console.log('   • tech_block_flag → TRUE');
            console.log('   • scraping_enabled → FALSE');
            console.log(`   • tou_scanned_date → ${today}`);
            console.log('════════════════════════════════════════════════════════════════\n');

        } catch (error) {
            console.error('❌ Error marking org as blocked:', error.message);
        }
    }

    /**
     * Fetch with 403 detection - auto-updates DB if blocked
     * @returns {Object} { success, data, status, blocked }
     */
    async function fetchWithBlockDetection(url) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': USER_AGENT }
            });

            // Check for blocking responses
            if (response.status === 403 || response.status === 401) {
                console.log(`\n⛔ BLOCKED: HTTP ${response.status} from ${url}`);
                await markAsTechBlocked(`HTTP ${response.status} - Access denied when fetching ${url}`);
                return { success: false, data: null, status: response.status, blocked: true };
            }

            if (!response.ok) {
                // Server error - back off but don't mark as blocked
                if (response.status >= 500) {
                    console.log(`   ⚠️ Server error ${response.status} - backing off...`);
                    await sleep(MIN_DELAY_MS * BACKOFF_MULTIPLIER, MAX_DELAY_MS * BACKOFF_MULTIPLIER);
                }
                return { success: false, data: null, status: response.status, blocked: false };
            }

            const data = await response.text();
            return { success: true, data, status: response.status, blocked: false };

        } catch (error) {
            // Check if error indicates blocking
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes('403') || errorMsg.includes('forbidden') || errorMsg.includes('blocked')) {
                console.log(`\n⛔ BLOCKED: ${error.message}`);
                await markAsTechBlocked(error.message);
                return { success: false, data: null, status: 403, blocked: true };
            }

            return { success: false, data: null, status: 0, blocked: false };
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PARSING HELPER FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Check if title is generic/bad
     */
    function isBadTitle(title) {
        if (!title) return true;
        const normalized = title.toLowerCase().trim();
        if (normalized.length < 5) return true;
        return BAD_TITLES.includes(normalized);
    }

    /**
     * Parse date string from INSA format
     * Examples:
     *   "January 15, 2026 8:00 AM to 10:00 AM"
     *   "April 14, 2026 8:00 AM to 5:30 PM"
     */
    function parseDateAndTime(dateString) {
        if (!dateString) return { startDate: '', endDate: '', startTime: '', endTime: '' };

        try {
            // Handle multi-day events: "August 27 to 28, 2024"
            const multiDayMatch = dateString.match(/([A-Za-z]+)\s+(\d+)\s+to\s+(\d+),\s+(\d{4})/);
            if (multiDayMatch) {
                const [, month, startDay, endDay, year] = multiDayMatch;
                const startDate = new Date(`${month} ${startDay}, ${year}`);
                const endDate = new Date(`${month} ${endDay}, ${year}`);

                return {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    startTime: '',
                    endTime: ''
                };
            }

            // Single day: "January 15, 2026 8:00 AM to 10:00 AM"
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
                    startTime: `${timeMatch[1]} ET`,
                    endTime: `${timeMatch[2]} ET`
                };
            }

            return {
                startDate: isoDate,
                endDate: isoDate,
                startTime: '',
                endTime: ''
            };
        } catch (e) {
            console.log(`   ⚠️ Could not parse date: ${dateString}`);
            return { startDate: '', endDate: '', startTime: '', endTime: '' };
        }
    }

    /**
     * Generate source_id for deduplication (using URL)
     */
    function generateSourceId(url, title) {
        if (url) {
            const fullUrl = url.startsWith('http') ? url : `https://www.insaonline.org${url}`;
            return fullUrl;
        }
        return `insa-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100)}`;
    }

    /**
     * Update organization's last_scraped timestamp
     */
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
            console.log('✅ Updated organization last_scraped timestamp');
        } catch (error) {
            console.log('   ⚠️ Could not update last_scraped timestamp');
        }
    }

    /**
     * DEEP SCRAPE: Fetch detail page for description and speakers
     */
    async function fetchEventDetails(eventUrl) {
        try {
            console.log(`   🔄 Deep scraping: ${eventUrl.substring(0, 60)}...`);

            const result = await fetchWithBlockDetection(eventUrl);

            if (result.blocked) {
                // 403 detected - scraping will stop
                return { description: '', speakers: '', blocked: true };
            }

            if (!result.success) {
                console.log(`   ⚠️ Could not fetch detail page (HTTP ${result.status})`);
                return { description: '', speakers: '', blocked: false };
            }

            const $ = cheerio.load(result.data);

            // Extract description from main content area
            // INSA uses various content containers
            let description = '';

            // Try different selectors for description
            const descriptionSelectors = [
                '.sf-content-block',
                '.event-description',
                '.content-block',
                'article p',
                '.main-content p'
            ];

            for (const selector of descriptionSelectors) {
                const text = $(selector).first().text().trim();
                if (text && text.length > 50) {
                    description = text.substring(0, 2000); // Limit length
                    break;
                }
            }

            // If no description found, get first few paragraphs
            if (!description) {
                const paragraphs = [];
                $('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 30 && paragraphs.length < 3) {
                        paragraphs.push(text);
                    }
                });
                description = paragraphs.join('\n\n').substring(0, 2000);
            }

            // Extract speakers - INSA often lists them in various formats
            let speakers = '';
            const speakerMatches = [];

            // Common patterns: "Name, Title, Organization"
            $('p, li, div').each((i, el) => {
                const text = $(el).text().trim();
                // Match patterns like "John Smith, Director, CIA"
                if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+.*,.*,/)) {
                    if (text.length < 200) {
                        speakerMatches.push(text);
                    }
                }
                // Match "The Hon. Name" patterns
                if (text.match(/^The Hon\./i)) {
                    if (text.length < 200) {
                        speakerMatches.push(text);
                    }
                }
                // Match military ranks
                if (text.match(/^(Gen|Lt\s*Gen|Maj\s*Gen|Col|VADM|ADM|RADM)\s+/i)) {
                    if (text.length < 200) {
                        speakerMatches.push(text);
                    }
                }
            });

            if (speakerMatches.length > 0) {
                // Deduplicate and join
                const uniqueSpeakers = [...new Set(speakerMatches)];
                speakers = uniqueSpeakers.slice(0, 10).join('\n'); // Max 10 speakers
            }

            return {
                description: description || '',
                speakers: speakers || '',
                blocked: false
            };

        } catch (error) {
            console.log(`   ⚠️ Error fetching details: ${error.message}`);
            return { description: '', speakers: '', blocked: false };
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // MAIN SCRAPING LOGIC
    // ──────────────────────────────────────────────────────────────────────────

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🏛️ INSA Events Scraper (Enhanced)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📋 Mode: ${DEEP_SCRAPE ? 'Deep Scrape (with detail pages)' : 'Basic Scrape'}`);
    console.log(`📅 Scope: ${INCLUDE_PAST ? 'Future + Past Events' : 'Future Events Only'}`);
    console.log('');
    console.log('🛡️ SERVER-FRIENDLY SETTINGS:');
    console.log(`   ⏱️ Delay: ${MIN_DELAY_MS/1000}-${MAX_DELAY_MS/1000} seconds (randomized)`);
    console.log(`   🔧 User-Agent: ${USER_AGENT}`);
    if (DEEP_SCRAPE) {
        console.log(`   🔢 Max deep scrapes per run: ${MAX_DEEP_SCRAPE_PER_RUN}`);
    }
    console.log('');

    await authenticate();

    // ══════════════════════════════════════════════════════════════════════════
    // SAFETY GATE CHECK (Added 2026-01-05)
    // ══════════════════════════════════════════════════════════════════════════

    const org = await getOrganization();
    if (!org) {
        console.error('❌ Could not fetch organization record. Aborting.');
        process.exit(1);
    }

    const safetyCheck = checkSafetyGates(org);
    if (!safetyCheck.canScrape) {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('⛔ SCRAPING ABORTED');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`   Reason: ${safetyCheck.reason}`);
        console.log('');
        console.log('   To enable scraping:');
        console.log('   1. Open Admin Interface');
        console.log('   2. Find INSA organization');
        console.log('   3. Ensure status = "Live (Scraping Active)"');
        console.log('   4. Check "Scraping Enabled" box');
        console.log('   5. Uncheck TOU Flag and Technical Block if set');
        console.log('════════════════════════════════════════════════════════════════\n');
        process.exit(0);
    }

    try {
        // ═══════════════════════════════════════════════════════════════════════
        // STEP 1: Fetch calendar page
        // ═══════════════════════════════════════════════════════════════════════

        console.log('📡 Fetching INSA calendar page...');
        const calendarResult = await fetchWithBlockDetection('https://www.insaonline.org/calendar-of-events');

        if (calendarResult.blocked) {
            console.log('❌ Scraping halted due to technical block.');
            process.exit(1);
        }

        if (!calendarResult.success) {
            throw new Error(`Could not fetch calendar page (HTTP ${calendarResult.status})`);
        }

        const $ = cheerio.load(calendarResult.data);
        console.log('✅ Calendar page fetched successfully\n');

        // ═══════════════════════════════════════════════════════════════════════
        // STEP 2: Parse events from calendar
        // ═══════════════════════════════════════════════════════════════════════

        const events = [];
        let skippedBadTitle = 0;

        // INSA calendar uses list items with specific structure
        // Look for event cards/items
        $('a[href*="/detail-pages/event/"]').each((index, element) => {
            const $el = $(element);
            const url = $el.attr('href');

            // Find the parent container for this event
            const $parent = $el.closest('li') || $el.parent();

            // Try to extract title - it's usually in a strong or heading element
            let title = $parent.find('strong').first().text().trim() ||
                        $parent.find('h3, h4, .item-list__title').first().text().trim() ||
                        $el.text().trim();

            // Clean up title
            title = title.replace(/\s+/g, ' ').trim();

            // Skip if bad title or "Learn More" links
            if (isBadTitle(title) || title.toLowerCase() === 'learn more') {
                skippedBadTitle++;
                return;
            }

            // Get full text to extract date and location
            const fullText = $parent.text();

            // Try to extract date - various patterns
            let dateText = '';
            const datePatterns = [
                /([A-Z][a-z]+\s+\d+(?:\s+to\s+\d+)?,\s+\d{4}\s+\d+:\d+\s+[AP]M\s+to\s+\d+:\d+\s+[AP]M)/,
                /([A-Z][a-z]+\s+\d+(?:\s+to\s+\d+)?,\s+\d{4})/
            ];

            for (const pattern of datePatterns) {
                const match = fullText.match(pattern);
                if (match) {
                    dateText = match[1];
                    break;
                }
            }

            // Try to extract location
            let location = '';
            const locationPatterns = [
                /(Arlington|McLean|Herndon|Washington|Bethesda|Chantilly|Reston|Huntsville)[,\s]+[A-Z]{2}/i,
                /Virtual/i
            ];

            for (const pattern of locationPatterns) {
                const match = fullText.match(pattern);
                if (match) {
                    location = match[0].trim();
                    break;
                }
            }

            const { startDate, endDate, startTime, endTime } = parseDateAndTime(dateText);

            // Determine event type
            let eventType = 'In-person';
            if (location.toLowerCase().includes('virtual') || !location) {
                eventType = location.toLowerCase().includes('virtual') ? 'Virtual' : 'In-person';
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
                    timezone: 'America/New_York',
                    description: '', // Will be filled by deep scrape
                    speakers: '',    // Will be filled by deep scrape
                    organization: INSA_ORG_ID,
                    source_id: source_id,
                    event_type: eventType,
                    registration_required: true,
                    cost: 'Varies by event',
                    target_audience: 'Intelligence and national security professionals'
                });
            }
        });

        // Deduplicate by source_id
        const uniqueEvents = [];
        const seenUrls = new Set();
        for (const event of events) {
            if (!seenUrls.has(event.source_id)) {
                seenUrls.add(event.source_id);
                uniqueEvents.push(event);
            }
        }

        console.log(`📊 Found ${uniqueEvents.length} unique events on calendar`);
        if (skippedBadTitle > 0) {
            console.log(`   ⏭️ Skipped ${skippedBadTitle} bad/generic titles`);
        }
        console.log('');

        // ═══════════════════════════════════════════════════════════════════════
        // STEP 3: Deep scrape detail pages (if enabled)
        // ═══════════════════════════════════════════════════════════════════════

        if (DEEP_SCRAPE) {
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('🔄 DEEP SCRAPING - Fetching event detail pages...');
            console.log('═══════════════════════════════════════════════════════════════\n');

            // Limit deep scraping to prevent overwhelming server
            const eventsToDeepScrape = uniqueEvents.slice(0, MAX_DEEP_SCRAPE_PER_RUN);

            if (uniqueEvents.length > MAX_DEEP_SCRAPE_PER_RUN) {
                console.log(`⚠️ Limiting to ${MAX_DEEP_SCRAPE_PER_RUN} events this run (${uniqueEvents.length} total found)`);
                console.log(`   Run again later to scrape remaining events.\n`);
            }

            for (let i = 0; i < eventsToDeepScrape.length; i++) {
                const event = eventsToDeepScrape[i];
                console.log(`[${i + 1}/${eventsToDeepScrape.length}] ${event.title.substring(0, 50)}...`);

                const details = await fetchEventDetails(event.url);

                // Check if we got blocked during deep scrape
                if (details.blocked) {
                    console.log('\n❌ Deep scraping halted due to technical block.');
                    console.log('   Events collected so far will still be saved.\n');
                    break;
                }

                event.description = details.description;

                // Append speakers to description if found
                if (details.speakers) {
                    event.description = event.description
                        ? `${event.description}\n\nSPEAKERS:\n${details.speakers}`
                        : `SPEAKERS:\n${details.speakers}`;
                }

                // Rate limiting - wait before next request (randomized delay)
                if (i < eventsToDeepScrape.length - 1) {
                    console.log(`   ⏳ Waiting ${getDelayRange()} (randomized)...`);
                    await sleep();
                }
            }

            console.log('\n✅ Deep scraping complete\n');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // STEP 4: Save events to PocketBase
        // ═══════════════════════════════════════════════════════════════════════

        console.log('═══════════════════════════════════════════════════════════════');
        console.log('💾 SAVING TO DATABASE');
        console.log('═══════════════════════════════════════════════════════════════\n');

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const event of uniqueEvents) {
            try {
                // Check if event already exists by source_id
                const existingResponse = await fetch(
                    `${POCKETBASE_URL}/api/collections/events/records?filter=(source_id='${encodeURIComponent(event.source_id)}')`,
                    { headers: { 'Authorization': authToken } }
                );
                const existingData = await existingResponse.json();

                if (existingData.items && existingData.items.length > 0) {
                    // Event exists - update if deep scraping added new info
                    if (DEEP_SCRAPE && event.description) {
                        const existingEvent = existingData.items[0];

                        // Only update if we have new description
                        if (!existingEvent.description || existingEvent.description.length < event.description.length) {
                            const updateResponse = await fetch(
                                `${POCKETBASE_URL}/api/collections/events/records/${existingEvent.id}`,
                                {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': authToken
                                    },
                                    body: JSON.stringify({
                                        description: event.description
                                    })
                                }
                            );

                            if (updateResponse.ok) {
                                console.log(`   🔄 Updated: "${event.title.substring(0, 50)}..."`);
                                updated++;
                            } else {
                                console.log(`   ⏭️ Exists: "${event.title.substring(0, 50)}..."`);
                                skipped++;
                            }
                        } else {
                            console.log(`   ⏭️ Exists: "${event.title.substring(0, 50)}..."`);
                            skipped++;
                        }
                    } else {
                        console.log(`   ⏭️ Exists: "${event.title.substring(0, 50)}..."`);
                        skipped++;
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

        // ═══════════════════════════════════════════════════════════════════════
        // SUMMARY
        // ═══════════════════════════════════════════════════════════════════════

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('📊 INSA SCRAPING SUMMARY');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`   ✅ Created: ${created}`);
        console.log(`   🔄 Updated: ${updated}`);
        console.log(`   ⏭️ Skipped (duplicates): ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ INSA scraping complete!\n');

    } catch (error) {
        console.error('\n❌ Scraping failed:', error.message);
        process.exit(1);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN SCRAPER
// ═══════════════════════════════════════════════════════════════════════════════

scrapeINSAEvents();
