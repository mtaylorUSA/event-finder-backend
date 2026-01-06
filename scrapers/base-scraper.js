/**
 * scrapers/base-scraper.js
 * 
 * Shared scraping logic with safety gates and respectful scraping patterns.
 * All scrapers (custom and generic) use these functions.
 * 
 * Features:
 * - Safety gate checks (status, flags)
 * - TOU check before every scrape
 * - 403 detection and auto-blocking
 * - Rate limiting (5-8 seconds randomized)
 * - Custom User-Agent with contact info
 * - Backoff on server errors
 * 
 * Last Updated: 2026-01-06
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Rate limiting settings
const MIN_DELAY_MS = 5000;  // Minimum 5 seconds between requests
const MAX_DELAY_MS = 8000;  // Maximum 8 seconds (randomized)

// Identify ourselves so sites can contact us if needed
const USER_AGENT = 'EventFinderBot/1.0 (Personal research tool; Contact: matthew_e_taylor@hotmail.com)';

// Backoff settings
const BACKOFF_MULTIPLIER = 2;
const MAX_BACKOFF_MS = 60000;

// TOU restriction keywords (lowercase for matching)
const TOU_RESTRICTION_KEYWORDS = [
    'scraping is prohibited',
    'scraping is not permitted',
    'automated access is prohibited',
    'automated access is not permitted',
    'crawling is prohibited',
    'crawling is not permitted',
    'bots are prohibited',
    'bots are not permitted',
    'no scraping',
    'no crawling',
    'no automated',
    'do not scrape',
    'do not crawl',
    'prohibits scraping',
    'prohibits crawling',
    'prohibits automated',
    'scraping prohibited',
    'crawling prohibited',
    'automated access prohibited',
    'web scraping is strictly prohibited',
    'data mining is prohibited',
    'data mining is not permitted'
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

let authToken = null;
let fetchModule = null;
let cheerioModule = null;

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize dynamic imports (call once at startup)
 */
async function init() {
    if (!fetchModule) {
        fetchModule = (await import('node-fetch')).default;
    }
    if (!cheerioModule) {
        cheerioModule = await import('cheerio');
    }
}

/**
 * Authenticate with PocketBase
 */
async function authenticate() {
    if (authToken) return authToken;

    await init();
    console.log('🔐 Authenticating with PocketBase...');

    try {
        const response = await fetchModule(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
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
        return authToken;
    } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sleep function for rate limiting (randomized for natural traffic pattern)
 */
function sleep(minMs = MIN_DELAY_MS, maxMs = MAX_DELAY_MS) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Get delay range string for logging
 */
function getDelayRange() {
    return `${MIN_DELAY_MS / 1000}-${MAX_DELAY_MS / 1000}s`;
}

/**
 * Get cheerio module (after init)
 */
function getCheerio() {
    return cheerioModule;
}

/**
 * Get user agent string
 */
function getUserAgent() {
    return USER_AGENT;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORGANIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch organization record from PocketBase
 */
async function getOrganization(orgId) {
    await authenticate();

    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
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
 * Get all organizations eligible for scraping
 */
async function getScrapableOrganizations() {
    await authenticate();

    try {
        const filter = encodeURIComponent(
            'scraping_enabled = true && status = "Live (Scraping Active)" && tou_flag != true && tech_block_flag != true'
        );

        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}&perPage=500`,
            { headers: { 'Authorization': authToken } }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('❌ Could not fetch organizations:', error.message);
        return [];
    }
}

/**
 * Update organization's last_scraped timestamp
 */
async function updateLastScraped(orgId) {
    await authenticate();

    try {
        await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify({
                    last_scraped: new Date().toISOString()
                })
            }
        );
        console.log('✅ Updated organization last_scraped timestamp');
    } catch (error) {
        console.log('   ⚠️ Could not update last_scraped timestamp');
    }
}

/**
 * Update organization's tou_scanned_date
 */
async function updateTOUScannedDate(orgId) {
    await authenticate();
    const today = new Date().toISOString().split('T')[0];

    try {
        await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify({
                    tou_scanned_date: today
                })
            }
        );
    } catch (error) {
        console.log('   ⚠️ Could not update tou_scanned_date');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY GATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if organization passes all safety gates
 * @param {Object} org - Organization record from PocketBase
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
async function markAsTechBlocked(orgId, errorMessage) {
    await authenticate();
    const today = new Date().toISOString().split('T')[0];

    try {
        await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
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
                    scraping_enabled: false,
                    alert_type: 'tech_block',
                    alert_date: new Date().toISOString()
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
        console.log('   • alert_type → tech_block');
        console.log('════════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error marking org as blocked:', error.message);
    }
}

/**
 * Mark organization as having TOU restrictions
 */
async function markAsTOURestricted(orgId, foundKeywords) {
    await authenticate();
    const today = new Date().toISOString().split('T')[0];

    try {
        await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify({
                    status: 'Rejected (By Mission or Org)',
                    tou_flag: true,
                    tou_scanned_date: today,
                    tou_notes: `⚠️ TOU RESTRICTION DETECTED:\n\nKeywords found:\n${foundKeywords.map(k => `• "${k}"`).join('\n')}`,
                    scraping_enabled: false,
                    alert_type: 'tou_restriction',
                    alert_date: new Date().toISOString()
                })
            }
        );

        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('⚠️ ORGANIZATION MARKED AS TOU RESTRICTED');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('   • status → Rejected (By Mission or Org)');
        console.log('   • tou_flag → TRUE');
        console.log('   • scraping_enabled → FALSE');
        console.log(`   • tou_scanned_date → ${today}`);
        console.log('   • alert_type → tou_restriction');
        console.log('   Keywords found:');
        foundKeywords.forEach(k => console.log(`     • "${k}"`));
        console.log('════════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error marking org as TOU restricted:', error.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOU CHECK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check a single URL for scraping restrictions
 * @param {string} url - URL to check
 * @param {string} urlType - 'TOU' or 'Privacy' for logging
 * @param {string} orgId - Organization ID
 * @returns {Object} { passed: boolean, blocked: boolean, keywords: string[], checked: boolean }
 */
async function checkSingleURL(url, urlType, orgId) {
    if (!url) {
        return { passed: true, blocked: false, keywords: [], checked: false };
    }

    console.log(`   📡 Fetching ${urlType}: ${url}`);

    try {
        const response = await fetchModule(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        // Check for blocking responses
        if (response.status === 403 || response.status === 401) {
            console.log(`   ⛔ BLOCKED: HTTP ${response.status}`);
            await markAsTechBlocked(orgId, `HTTP ${response.status} when fetching ${urlType} page: ${url}`);
            return { passed: false, blocked: true, keywords: [], checked: true };
        }

        if (!response.ok) {
            console.log(`   ⚠️ Could not fetch ${urlType} page (HTTP ${response.status})`);
            return { passed: true, blocked: false, keywords: [], checked: false };
        }

        const html = await response.text();
        const textContent = html.toLowerCase();

        // Check for restriction keywords
        const foundKeywords = [];
        for (const keyword of TOU_RESTRICTION_KEYWORDS) {
            if (textContent.includes(keyword)) {
                foundKeywords.push(keyword);
            }
        }

        if (foundKeywords.length > 0) {
            console.log(`   ⚠️ RESTRICTIONS FOUND in ${urlType}:`);
            foundKeywords.forEach(k => console.log(`      • "${k}"`));
            return { passed: false, blocked: false, keywords: foundKeywords, checked: true };
        }

        console.log(`   ✅ No restrictions found in ${urlType}`);
        return { passed: true, blocked: false, keywords: [], checked: true };

    } catch (error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('403') || errorMsg.includes('forbidden') || errorMsg.includes('blocked')) {
            console.log(`   ⛔ BLOCKED: ${error.message}`);
            await markAsTechBlocked(orgId, error.message);
            return { passed: false, blocked: true, keywords: [], checked: true };
        }

        console.log(`   ⚠️ Error fetching ${urlType}: ${error.message}`);
        return { passed: true, blocked: false, keywords: [], checked: false };
    }
}

/**
 * Check TOU and Privacy pages for scraping restrictions
 * @param {Object} org - Organization record from PocketBase
 * @returns {Object} { passed: boolean, blocked: boolean, keywords: string[] }
 */
async function checkTOU(org) {
    await init();

    console.log('════════════════════════════════════════════════════════════════');
    console.log('📜 TOU & PRIVACY CHECK');
    console.log('════════════════════════════════════════════════════════════════\n');

    // Check if either URL exists
    if (!org.tou_url && !org.privacy_url) {
        console.log('   ⚠️ No TOU or Privacy URL configured - skipping check');
        console.log('   💡 Set tou_url and/or privacy_url in PocketBase to enable scanning\n');
        return { passed: true, blocked: false, keywords: [] };
    }

    let allKeywords = [];
    let wasBlocked = false;
    let anyChecked = false;

    // Check TOU page
    if (org.tou_url) {
        const touResult = await checkSingleURL(org.tou_url, 'TOU', org.id);
        if (touResult.checked) anyChecked = true;
        if (touResult.blocked) {
            wasBlocked = true;
        }
        if (touResult.keywords.length > 0) {
            allKeywords = allKeywords.concat(touResult.keywords.map(k => `[TOU] ${k}`));
        }
        if (!touResult.passed && !touResult.blocked) {
            // TOU had restrictions, don't continue
        }
    }

    // Check Privacy page (only if not already blocked)
    if (org.privacy_url && !wasBlocked) {
        // Small delay between requests
        if (org.tou_url) {
            console.log('   ⏳ Brief delay before checking Privacy page...');
            await sleep(2000, 3000);
        }
        
        const privacyResult = await checkSingleURL(org.privacy_url, 'Privacy', org.id);
        if (privacyResult.checked) anyChecked = true;
        if (privacyResult.blocked) {
            wasBlocked = true;
        }
        if (privacyResult.keywords.length > 0) {
            allKeywords = allKeywords.concat(privacyResult.keywords.map(k => `[Privacy] ${k}`));
        }
    }

    // Update TOU scanned date if we checked anything
    if (anyChecked) {
        await updateTOUScannedDate(org.id);
        console.log('   ✅ TOU scanned date updated');
    }

    // If blocked, return immediately
    if (wasBlocked) {
        return { passed: false, blocked: true, keywords: [] };
    }

    // If restrictions found, mark as restricted
    if (allKeywords.length > 0) {
        console.log('');
        await markAsTOURestricted(org.id, allKeywords);
        return { passed: false, blocked: false, keywords: allKeywords };
    }

    console.log('');
    return { passed: true, blocked: false, keywords: [] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP FETCHING WITH BLOCK DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch URL with 403 detection - auto-updates DB if blocked
 * @param {string} url - URL to fetch
 * @param {string} orgId - Organization ID for auto-blocking
 * @returns {Object} { success, data, status, blocked }
 */
async function fetchWithBlockDetection(url, orgId) {
    await init();

    try {
        console.log(`📡 Fetching: ${url}`);
        const response = await fetchModule(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        // Check for blocking responses
        if (response.status === 403 || response.status === 401) {
            console.log(`\n⛔ BLOCKED: HTTP ${response.status} from ${url}`);
            if (orgId) {
                await markAsTechBlocked(orgId, `HTTP ${response.status} - Access denied when fetching ${url}`);
            }
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
            if (orgId) {
                await markAsTechBlocked(orgId, error.message);
            }
            return { success: false, data: null, status: 403, blocked: true };
        }

        console.error(`❌ Fetch error: ${error.message}`);
        return { success: false, data: null, status: 0, blocked: false };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT SAVING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if event already exists by source_id
 */
async function eventExists(sourceId) {
    await authenticate();

    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/events/records?filter=(source_id='${encodeURIComponent(sourceId)}')`,
            { headers: { 'Authorization': authToken } }
        );

        if (!response.ok) return false;

        const data = await response.json();
        return data.items && data.items.length > 0 ? data.items[0] : null;
    } catch (error) {
        return null;
    }
}

/**
 * Create a new event in PocketBase
 */
async function createEvent(event) {
    await authenticate();

    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/events/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(event)
            }
        );

        if (response.ok) {
            return { success: true, data: await response.json() };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing event in PocketBase
 */
async function updateEvent(eventId, updates) {
    await authenticate();

    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/events/records/${eventId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(updates)
            }
        );

        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Save events to PocketBase (create or skip duplicates)
 * @param {Array} events - Array of event objects
 * @returns {Object} { created, skipped, errors }
 */
async function saveEvents(events) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('💾 SAVING TO DATABASE');
    console.log('════════════════════════════════════════════════════════════════\n');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const event of events) {
        try {
            // Check if event already exists
            const existing = await eventExists(event.source_id);

            if (existing) {
                console.log(`   ⏭️ Exists: "${event.title.substring(0, 50)}..."`);
                skipped++;
                continue;
            }

            // Create new event
            const result = await createEvent(event);

            if (result.success) {
                console.log(`   ✅ Created: "${event.title.substring(0, 50)}..."`);
                created++;
            } else {
                console.error(`   ❌ Failed: "${event.title}" - ${result.error}`);
                errors++;
            }
        } catch (err) {
            console.error(`   ❌ Error: "${event.title}" - ${err.message}`);
            errors++;
        }
    }

    return { created, skipped, errors };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC SCRAPER (Fallback for sites without custom scrapers)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generic scraper - tries common event selectors
 * Used when no custom scraper exists for an organization
 */
async function genericScrape(org) {
    await init();

    const urlToScrape = org.events_url || org.website;
    if (!urlToScrape) {
        console.log('⚠️ No URL available to scrape');
        return [];
    }

    const result = await fetchWithBlockDetection(urlToScrape, org.id);

    if (result.blocked || !result.success) {
        return [];
    }

    const $ = cheerioModule.load(result.data);
    const events = [];

    // Try common event selectors
    const eventSelectors = [
        '.event, .event-item, .event-card, .calendar-event',
        'article[class*="event"]',
        'div[class*="event"]',
        '[itemtype*="Event"]',
        'li[class*="event"]',
        '.upcoming-event, .future-event'
    ];

    let foundEvents = false;

    for (const selector of eventSelectors) {
        const items = $(selector);

        if (items.length > 0) {
            console.log(`✅ Found ${items.length} potential events using selector: ${selector}`);
            foundEvents = true;

            items.each((i, element) => {
                try {
                    const $el = $(element);

                    // Extract title
                    let title =
                        $el.find('h1, h2, h3, h4, .title, .event-title, [class*="title"]').first().text().trim() ||
                        $el.find('a').first().text().trim() ||
                        $el.text().split('\n')[0].trim();

                    if (!title || title.length < 5) return;

                    // Extract URL
                    let url = $el.find('a').first().attr('href') || '';
                    if (url && !url.startsWith('http')) {
                        const baseUrl = new URL(org.website);
                        url = new URL(url, baseUrl.origin).href;
                    }

                    // Generate source_id
                    const source_id = url || `${org.id}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100)}`;

                    // Extract date
                    let dateText =
                        $el.find('.date, .event-date, [class*="date"], time').first().text().trim() ||
                        $el.find('[datetime]').first().attr('datetime') || '';

                    // Extract description
                    let description = $el.find('.description, .event-description, p').first().text().trim() || '';
                    if (description.length > 500) {
                        description = description.substring(0, 497) + '...';
                    }

                    // Extract location
                    let location = $el.find('.location, .event-location, [class*="location"]').first().text().trim() || '';

                    events.push({
                        title: title.substring(0, 200),
                        description,
                        start_date: dateText ? new Date(dateText).toISOString() : '',
                        end_date: '',
                        start_time: '',
                        end_time: '',
                        timezone: 'America/New_York',
                        location: location.substring(0, 200),
                        url: url.substring(0, 500),
                        organization: org.id,
                        source_id,
                        event_type: '',
                        registration_required: false,
                        cost: '',
                        target_audience: ''
                    });
                } catch (error) {
                    // Skip individual parsing errors
                }
            });

            break;
        }
    }

    if (!foundEvents) {
        console.log('⚠️ No events found with common selectors');
        console.log('💡 This organization may need a custom scraper');
    }

    // Deduplicate
    const seen = new Set();
    const unique = events.filter(e => {
        if (seen.has(e.source_id)) return false;
        seen.add(e.source_id);
        return true;
    });

    console.log(`📊 Found ${unique.length} unique events`);
    return unique;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    // Initialization
    init,
    authenticate,

    // Utilities
    sleep,
    getDelayRange,
    getCheerio,
    getUserAgent,

    // Organization functions
    getOrganization,
    getScrapableOrganizations,
    updateLastScraped,
    updateTOUScannedDate,

    // Safety gates
    checkSafetyGates,
    markAsTechBlocked,
    markAsTOURestricted,

    // TOU checking
    checkTOU,
    checkSingleURL,
    TOU_RESTRICTION_KEYWORDS,

    // HTTP fetching
    fetchWithBlockDetection,

    // Event functions
    eventExists,
    createEvent,
    updateEvent,
    saveEvents,

    // Generic scraper
    genericScrape,

    // Constants
    MIN_DELAY_MS,
    MAX_DELAY_MS,
    USER_AGENT
};
