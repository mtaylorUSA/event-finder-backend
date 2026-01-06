/**
 * scrapers/custom/insa.js
 * 
 * INSA (Intelligence and National Security Alliance) Custom Scraper
 * 
 * This file contains ONLY the INSA-specific HTML parsing logic.
 * All safety checks, rate limiting, and database operations are handled
 * by the shared base-scraper.js.
 * 
 * Permission Status: ✅ GRANTED (Deep scraping approved)
 * Permission Date: January 1, 2026
 * 
 * Last Updated: 2026-01-05
 */

const base = require('../base-scraper');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CALENDAR_URL = 'https://www.insaonline.org/calendar-of-events';
const MAX_DEEP_SCRAPE_PER_RUN = 10;

// Bad/generic titles to skip
const BAD_TITLES = [
    'upcoming events', 'events', 'calendar', 'event', 'register',
    'registration', 'sign up', 'learn more', 'read more', 'click here',
    'view all', 'see all', 'more events', 'all events'
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARSING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP SCRAPING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch event detail page for description and speakers
 */
async function fetchEventDetails(eventUrl, orgId) {
    const cheerio = base.getCheerio();

    console.log(`   🔄 Deep scraping: ${eventUrl.substring(0, 60)}...`);

    const result = await base.fetchWithBlockDetection(eventUrl, orgId);

    if (result.blocked) {
        return { description: '', speakers: '', blocked: true };
    }

    if (!result.success) {
        console.log(`   ⚠️ Could not fetch detail page (HTTP ${result.status})`);
        return { description: '', speakers: '', blocked: false };
    }

    const $ = cheerio.load(result.data);

    // Extract description
    let description = '';
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
            description = text.substring(0, 2000);
            break;
        }
    }

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

    // Extract speakers
    const speakerMatches = [];
    $('p, li, div').each((i, el) => {
        const text = $(el).text().trim();
        if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+.*,.*,/) && text.length < 200) {
            speakerMatches.push(text);
        }
        if (text.match(/^The Hon\./i) && text.length < 200) {
            speakerMatches.push(text);
        }
        if (text.match(/^(Gen|Lt\s*Gen|Maj\s*Gen|Col|VADM|ADM|RADM)\s+/i) && text.length < 200) {
            speakerMatches.push(text);
        }
    });

    const speakers = [...new Set(speakerMatches)].slice(0, 10).join('\n');

    return { description, speakers, blocked: false };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCRAPER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scrape INSA events
 * @param {Object} org - Organization record from PocketBase
 * @param {Object} options - { deep: boolean }
 * @returns {Array} Array of event objects
 */
async function scrape(org, options = {}) {
    const { deep = false } = options;
    const cheerio = base.getCheerio();

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🏛️ INSA Custom Scraper');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📋 Mode: ${deep ? 'Deep Scrape (with detail pages)' : 'Basic Scrape'}`);
    console.log(`⏱️ Delay: ${base.getDelayRange()} (randomized)`);
    console.log('');

    // Fetch calendar page
    console.log('📡 Fetching INSA calendar page...');
    const calendarResult = await base.fetchWithBlockDetection(CALENDAR_URL, org.id);

    if (calendarResult.blocked) {
        console.log('❌ Scraping halted due to technical block.');
        return [];
    }

    if (!calendarResult.success) {
        console.log(`❌ Could not fetch calendar page (HTTP ${calendarResult.status})`);
        return [];
    }

    const $ = cheerio.load(calendarResult.data);
    console.log('✅ Calendar page fetched successfully\n');

    // Parse events
    const events = [];
    let skippedBadTitle = 0;

    $('a[href*="/detail-pages/event/"]').each((index, element) => {
        const $el = $(element);
        const url = $el.attr('href');
        const $parent = $el.closest('li') || $el.parent();

        let title = $parent.find('strong').first().text().trim() ||
                    $parent.find('h3, h4, .item-list__title').first().text().trim() ||
                    $el.text().trim();

        title = title.replace(/\s+/g, ' ').trim();

        if (isBadTitle(title) || title.toLowerCase() === 'learn more') {
            skippedBadTitle++;
            return;
        }

        const fullText = $parent.text();

        // Extract date
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

        // Extract location
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
        const eventType = location.toLowerCase().includes('virtual') ? 'Virtual' : 'In-person';
        const source_id = generateSourceId(url, title);

        if (title && source_id) {
            events.push({
                title,
                url: url.startsWith('http') ? url : `https://www.insaonline.org${url}`,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                location,
                timezone: 'America/New_York',
                description: '',
                organization: org.id,
                source_id,
                event_type: eventType,
                registration_required: true,
                cost: 'Varies by event',
                target_audience: 'Intelligence and national security professionals'
            });
        }
    });

    // Deduplicate
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

    // Deep scrape if enabled
    if (deep) {
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🔄 DEEP SCRAPING - Fetching event detail pages...');
        console.log('═══════════════════════════════════════════════════════════════\n');

        const eventsToDeepScrape = uniqueEvents.slice(0, MAX_DEEP_SCRAPE_PER_RUN);

        if (uniqueEvents.length > MAX_DEEP_SCRAPE_PER_RUN) {
            console.log(`⚠️ Limiting to ${MAX_DEEP_SCRAPE_PER_RUN} events this run (${uniqueEvents.length} total found)`);
            console.log(`   Run again later to scrape remaining events.\n`);
        }

        for (let i = 0; i < eventsToDeepScrape.length; i++) {
            const event = eventsToDeepScrape[i];
            console.log(`[${i + 1}/${eventsToDeepScrape.length}] ${event.title.substring(0, 50)}...`);

            const details = await fetchEventDetails(event.url, org.id);

            if (details.blocked) {
                console.log('\n❌ Deep scraping halted due to technical block.');
                break;
            }

            event.description = details.description;
            if (details.speakers) {
                event.description = event.description
                    ? `${event.description}\n\nSPEAKERS:\n${details.speakers}`
                    : `SPEAKERS:\n${details.speakers}`;
            }

            if (i < eventsToDeepScrape.length - 1) {
                console.log(`   ⏳ Waiting ${base.getDelayRange()} (randomized)...`);
                await base.sleep();
            }
        }

        console.log('\n✅ Deep scraping complete\n');
    }

    return uniqueEvents;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    scrape,
    name: 'INSA',
    key: 'insa'  // Must match scraper_key in PocketBase
};
