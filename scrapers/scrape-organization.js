/**
 * scrapers/scrape-organization.js
 * 
 * UNIFIED SCAN + SCRAPE SYSTEM
 * 
 * Smart CLI that handles the complete workflow:
 * - New org discovery (full scan)
 * - Pre-scrape verification (light scan)
 * - Event extraction (universal scraper)
 * - Deduplication checks
 * 
 * Usage:
 *   node scrapers/scrape-organization.js --org "CNAS"           # Existing org by name
 *   node scrapers/scrape-organization.js --domain "rand.org"    # New org discovery
 *   node scrapers/scrape-organization.js --org "CNAS" --scan-only  # Just scan, don't scrape
 * 
 * Last Updated: 2026-01-14
 */

require('dotenv').config();
const scanner = require('./org-scanner');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Scraping settings
const SCRAPE_DELAY_MS = 5000;  // Respectful delay between requests
const MAX_EVENTS_PER_PAGE = 50;  // Safety limit

// Module-level auth token (set during authenticate)
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Authenticate with PocketBase
 */
async function authenticate() {
    if (authToken) return authToken;
    
    console.log('   🔐 Authenticating with PocketBase...');
    
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/admins/auth-with-password`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identity: POCKETBASE_ADMIN_EMAIL,
                    password: POCKETBASE_ADMIN_PASSWORD
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Auth failed: ${response.status}`);
        }
        
        const data = await response.json();
        authToken = data.token;
        console.log('   ✅ Authenticated');
        return authToken;
        
    } catch (error) {
        console.log(`   ❌ Authentication failed: ${error.message}`);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        org: null,
        domain: null,
        scanOnly: false,
        skipScan: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--org':
                options.org = args[++i];
                break;
            case '--domain':
                options.domain = args[++i];
                break;
            case '--scan-only':
                options.scanOnly = true;
                break;
            case '--skip-scan':
                options.skipScan = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
════════════════════════════════════════════════════════════════
📋 UNIFIED SCAN + SCRAPE SYSTEM
════════════════════════════════════════════════════════════════

USAGE:
  node scrapers/scrape-organization.js [options]

OPTIONS:
  --org "Name"      Scan/scrape existing organization by name
  --domain "x.org"  Discover new organization by domain
  --scan-only       Run scan only, don't scrape events
  --skip-scan       Skip pre-scrape scan (use with caution)
  --help, -h        Show this help

EXAMPLES:
  # Scan and scrape existing org
  node scrapers/scrape-organization.js --org "CNAS"
  
  # Discover new org by domain
  node scrapers/scrape-organization.js --domain "csis.org"
  
  # Just run scan, don't scrape
  node scrapers/scrape-organization.js --org "RAND" --scan-only

WORKFLOW:
  1. Org exists? → Pre-scrape check → Scrape if Live
  2. New domain? → Full discovery scan → Create record

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract root domain from URL or domain string
 */
function extractRootDomain(domain) {
    if (!domain) return '';
    
    // Remove protocol and path
    let cleaned = domain.replace(/^https?:\/\//, '').split('/')[0];
    
    const parts = cleaned.toLowerCase().split('.');
    
    if (parts.length <= 2) {
        return cleaned.toLowerCase();
    }
    
    // Handle common TLDs
    const tld = parts[parts.length - 1];
    if (['edu', 'gov', 'org', 'com', 'net', 'io', 'ai'].includes(tld)) {
        return parts.slice(-2).join('.');
    }
    
    return parts.slice(-2).join('.');
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract text from HTML
 */
function extractText(html) {
    if (!html) return '';
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Extract links from HTML (preserves href URLs with their link text)
 */
function extractLinks(html, baseUrl) {
    if (!html) return [];
    
    const links = [];
    // Match <a> tags and capture href and inner text
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1];
        let text = match[2].replace(/<[^>]+>/g, '').trim(); // Strip inner HTML tags
        
        // Skip empty links, anchors, javascript, mailto
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
            continue;
        }
        
        // Make relative URLs absolute
        if (!href.startsWith('http')) {
            try {
                href = new URL(href, baseUrl).href;
            } catch (e) {
                continue;
            }
        }
        
        // Only include links that look like event detail pages
        if (href.includes('event') || href.includes('detail') || href.includes('calendar') || 
            href.includes('program') || href.includes('conference') || href.includes('seminar')) {
            links.push({ url: href, text: text.substring(0, 100) });
        }
    }
    
    return links;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get organization by ID
 */
async function getOrganization(orgId) {
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.log(`   ⚠️ Error fetching org: ${e.message}`);
    }
    return null;
}

/**
 * Get organization by name (fuzzy match)
 */
async function getOrganizationByName(name) {
    try {
        // Try exact match first
        let filter = encodeURIComponent(`name = "${name}"`);
        let response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
        
        // Try contains match
        filter = encodeURIComponent(`name ~ "${name}"`);
        response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
        
    } catch (e) {
        console.log(`   ⚠️ Error searching org: ${e.message}`);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if an organization already exists (by domain or similar name)
 */
async function checkForDuplicateOrg(domain) {
    const rootDomain = extractRootDomain(domain);
    console.log(`   🔍 Checking for duplicates of: ${rootDomain}`);
    
    // Check by source_id (domain)
    try {
        const filter = encodeURIComponent(`source_id ~ "${rootDomain}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return {
                    isDuplicate: true,
                    existingOrg: data.items[0],
                    matchType: 'domain'
                };
            }
        }
    } catch (e) {
        console.log(`      ⚠️ Dedup check error: ${e.message}`);
    }
    
    return { isDuplicate: false, existingOrg: null, matchType: null };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT EXTRACTION (AI-Powered Universal Scraper)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch URL with proper headers
 */
async function fetchUrl(url) {
    const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: matthew_e_taylor@hotmail.com)';
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}`, status: response.status };
        }
        
        const body = await response.text();
        return { success: true, body, status: response.status };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Extract events from a page using AI
 */
async function extractEventsWithAI(html, eventsUrl, orgName) {
    if (!OPENAI_API_KEY) {
        console.log('      ⚠️ No OpenAI API key - cannot extract events');
        return [];
    }
    
    console.log('   🤖 Extracting events with AI...');
    
    // Extract links BEFORE stripping HTML (this is the key fix!)
    const extractedLinks = extractLinks(html, eventsUrl);
    console.log(`      📎 Found ${extractedLinks.length} potential event links`);
    
    // Clean and truncate HTML for AI
    const textContent = extractText(html).substring(0, 10000);
    
    // Format links for the prompt
    const linksText = extractedLinks.length > 0 
        ? extractedLinks.map(l => `- "${l.text}" → ${l.url}`).join('\n')
        : '(No event links found in HTML)';
    
    const prompt = `Extract all events from this organization's events page.

ORGANIZATION: ${orgName}
EVENTS PAGE URL: ${eventsUrl}

AVAILABLE EVENT LINKS FOUND IN HTML:
${linksText}

PAGE TEXT CONTENT:
${textContent}

TASK: Extract each event with these fields:
- title: Event name (required)
- description: Brief description (1-2 sentences)
- start_date: Format as YYYY-MM-DD if found
- end_date: Format as YYYY-MM-DD if multi-day
- start_time: Format as HH:MM (24hr) if found
- end_time: Format as HH:MM (24hr) if found
- timezone: e.g., "ET", "PT", "UTC"
- location: City, State/Country or "Virtual"
- event_type: "Virtual", "In-person", or "Hybrid"
- url: The matching URL from AVAILABLE EVENT LINKS above (see CRITICAL RULE)

CRITICAL URL RULE:
- Match each event to its ACTUAL URL from the "AVAILABLE EVENT LINKS" list above
- The link text should match or be similar to the event title
- Use the EXACT URL from that list - do NOT modify or guess URLs
- If no matching link is found, set url to null

OTHER RULES:
- Only include FUTURE events (today or later)
- Skip past events
- Skip training/certification courses
- Skip job fairs or recruitment events

Return ONLY valid JSON array:
[
  {
    "title": "Event Title",
    "description": "Brief description",
    "start_date": "2026-02-15",
    "end_date": null,
    "start_time": "09:00",
    "end_time": "17:00",
    "timezone": "ET",
    "location": "Washington, DC",
    "event_type": "In-person",
    "url": "https://example.org/detail-pages/event/2026/02/15/actual-link"
  }
]

If no events found, return empty array: []`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You extract event data from web pages. Return only valid JSON arrays.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        
        // Clean up response
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const events = JSON.parse(content);
        
        if (!Array.isArray(events)) {
            console.log('      ⚠️ AI did not return an array');
            return [];
        }
        
        console.log(`      ✅ AI extracted ${events.length} event(s)`);
        return events;
        
    } catch (error) {
        console.log(`      ❌ AI extraction failed: ${error.message}`);
        return [];
    }
}

/**
 * Deep scrape individual event pages for more details
 */
async function deepScrapeEvent(event, orgName) {
    if (!event.url) return event;
    
    console.log(`      📄 Deep scraping: ${event.title.substring(0, 40)}...`);
    
    const result = await fetchUrl(event.url);
    
    if (!result.success) {
        console.log(`         ⚠️ Could not fetch event page: ${result.error || 'Unknown error'} (Status: ${result.status || 'N/A'})`);
        console.log(`         🔗 URL attempted: ${event.url}`);
        return event;
    }
    
    // Use AI to extract additional details
    const textContent = extractText(result.body).substring(0, 6000);
    
    const prompt = `Extract additional details from this event page.

EVENT: ${event.title}
ORGANIZATION: ${orgName}

PAGE CONTENT:
${textContent}

CURRENT DATA:
${JSON.stringify(event, null, 2)}

TASK: Fill in any missing fields and improve existing data:
- description: Expand if too brief (2-3 sentences max)
- start_date/end_date: Confirm or correct (YYYY-MM-DD)
- start_time/end_time: Add if found (HH:MM 24hr)
- timezone: Add if found
- location: Be specific (venue name, city, state)
- event_type: Confirm Virtual/In-person/Hybrid
- registration_url: If different from event page

Return ONLY valid JSON with the updated event object.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You extract event details. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            return event;
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const enrichedEvent = JSON.parse(content);
        console.log(`         ✅ Enhanced with additional details`);
        return { ...event, ...enrichedEvent };
        
    } catch (error) {
        return event;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT SAVING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate source_id for deduplication
 */
function generateSourceId(event, orgDomain) {
    // Use URL if available, otherwise generate from title + date
    if (event.url) {
        return event.url;
    }
    const titleSlug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    return `${orgDomain}/${titleSlug}-${event.start_date || 'nodate'}`;
}

/**
 * Check if event already exists
 */
async function eventExists(sourceId) {
    try {
        const filter = encodeURIComponent(`source_id = "${sourceId}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.items && data.items.length > 0;
        }
    } catch (e) {
        // Assume doesn't exist on error
    }
    return false;
}

/**
 * Save event to database
 */
async function saveEvent(event, orgId, orgDomain) {
    const sourceId = generateSourceId(event, orgDomain);
    
    // Check for duplicate
    if (await eventExists(sourceId)) {
        console.log(`      ⏭️ Skipping duplicate: ${event.title.substring(0, 40)}...`);
        return { saved: false, reason: 'duplicate' };
    }
    
    // Prepare event record
    const eventRecord = {
        title: event.title,
        description: event.description || '',
        url: event.url || '',
        organization: orgId,
        source_id: sourceId,
        event_type: event.event_type || 'In-person',
        location: event.location || '',
        start_date: event.start_date ? new Date(event.start_date).toISOString() : null,
        end_date: event.end_date ? new Date(event.end_date).toISOString() : null,
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        timezone: event.timezone || ''
    };
    
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(eventRecord)
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            console.log(`      ❌ Failed to save: ${event.title.substring(0, 30)}... - ${JSON.stringify(error)}`);
            return { saved: false, reason: 'api_error' };
        }
        
        console.log(`      💾 Saved: ${event.title.substring(0, 50)}...`);
        return { saved: true };
        
    } catch (error) {
        console.log(`      ❌ Save error: ${error.message}`);
        return { saved: false, reason: error.message };
    }
}

/**
 * Update organization's last_scraped timestamp
 */
async function updateLastScraped(orgId) {
    try {
        await fetch(
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
    } catch (e) {
        console.log(`      ⚠️ Could not update last_scraped`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCRAPE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scrape events from an organization
 */
async function scrapeOrganization(org, scanResult) {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📥 SCRAPING EVENTS: ${org.name}`);
    console.log('════════════════════════════════════════════════════════════════');
    
    const eventsUrl = org.events_url || scanResult?.eventsUrl;
    
    if (!eventsUrl) {
        console.log('   ❌ No events_url configured - cannot scrape');
        return { success: false, reason: 'no_events_url', eventsFound: 0, eventsSaved: 0 };
    }
    
    console.log(`   📍 Events URL: ${eventsUrl}`);
    
    // Respectful delay
    console.log(`   ⏳ Respectful delay (${SCRAPE_DELAY_MS/1000}s)...`);
    await sleep(SCRAPE_DELAY_MS);
    
    // Fetch events page
    console.log('   📡 Fetching events page...');
    const result = await fetchUrl(eventsUrl);
    
    if (!result.success) {
        console.log(`   ❌ Could not fetch events page: ${result.error}`);
        return { success: false, reason: result.error, eventsFound: 0, eventsSaved: 0 };
    }
    
    console.log(`   ✅ Events page fetched (${result.body.length} bytes)`);
    
    // Extract events using AI
    const events = await extractEventsWithAI(result.body, eventsUrl, org.name);
    
    if (events.length === 0) {
        console.log('   ℹ️ No events found on page');
        return { success: true, reason: 'no_events', eventsFound: 0, eventsSaved: 0 };
    }
    
    console.log(`   📋 Found ${events.length} event(s)`);
    
    // Deep scrape each event (with rate limiting)
    console.log('');
    console.log('   📄 Deep scraping event details...');
    const enrichedEvents = [];
    
    for (let i = 0; i < Math.min(events.length, MAX_EVENTS_PER_PAGE); i++) {
        const event = events[i];
        
        if (event.url && event.url !== eventsUrl) {
            await sleep(2000); // Rate limiting
            const enriched = await deepScrapeEvent(event, org.name);
            enrichedEvents.push(enriched);
        } else {
            enrichedEvents.push(event);
        }
    }
    
    // Save events
    console.log('');
    console.log('   💾 Saving events to database...');
    
    let savedCount = 0;
    let skippedCount = 0;
    const orgDomain = extractRootDomain(org.website || org.source_id);
    
    for (const event of enrichedEvents) {
        const result = await saveEvent(event, org.id, orgDomain);
        if (result.saved) {
            savedCount++;
        } else {
            skippedCount++;
        }
    }
    
    // Update last_scraped
    await updateLastScraped(org.id);
    
    // Summary
    console.log('');
    console.log('   ════════════════════════════════════════════════════');
    console.log('   📊 SCRAPE SUMMARY');
    console.log('   ════════════════════════════════════════════════════');
    console.log(`      Events found: ${events.length}`);
    console.log(`      Events saved: ${savedCount}`);
    console.log(`      Skipped (duplicates): ${skippedCount}`);
    
    return {
        success: true,
        eventsFound: events.length,
        eventsSaved: savedCount,
        eventsSkipped: skippedCount
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY GATE CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if organization is safe to scrape
 * 
 * Safety Gates:
 *   1. Status must be "Live (Scraping Active)"
 *   2. tou_flag must be false (no TOU restrictions)
 *   3. tech_block_flag must be false (site accessible)
 */
function checkSafetyGates(org) {
    const issues = [];
    
    // Status check - this is the official gate
    if (org.status !== 'Live (Scraping Active)') {
        issues.push(`Status is "${org.status}" (must be "Live (Scraping Active)")`);
    }
    
    // TOU flag check
    if (org.tou_flag === true) {
        issues.push('tou_flag is true (TOU restrictions detected)');
    }
    
    // Tech block check
    if (org.tech_block_flag === true) {
        issues.push('tech_block_flag is true (site blocks access)');
    }
    
    return {
        safe: issues.length === 0,
        issues
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    if (!options.org && !options.domain) {
        showHelp();
        console.log('❌ Error: Must specify --org or --domain\n');
        return;
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔄 UNIFIED SCAN + SCRAPE SYSTEM');
    console.log('════════════════════════════════════════════════════════════════');
    
    // Initialize
    console.log('');
    console.log('⏳ Initializing...');
    await scanner.init();
    await authenticate();
    console.log('   ✅ Ready');
    
    let org = null;
    let isNewOrg = false;
    
    // ───────────────────────────────────────────────────────────────────────
    // STEP 1: Find or Create Organization
    // ───────────────────────────────────────────────────────────────────────
    
    if (options.org) {
        // Find existing org by name
        console.log('');
        console.log(`📡 Searching for organization: "${options.org}"...`);
        org = await getOrganizationByName(options.org);
        
        if (!org) {
            console.log(`   ❌ Organization not found: "${options.org}"`);
            console.log('   💡 Use --domain to discover a new organization');
            return;
        }
        
        console.log(`   ✅ Found: ${org.name} (ID: ${org.id})`);
        console.log(`   📍 Website: ${org.website}`);
        console.log(`   📍 Status: ${org.status}`);
        
    } else if (options.domain) {
        // New org discovery
        console.log('');
        console.log(`🔍 Discovering new organization: ${options.domain}`);
        
        // Check for duplicates first
        const dupCheck = await checkForDuplicateOrg(options.domain);
        
        if (dupCheck.isDuplicate) {
            console.log(`   ⚠️ Organization already exists!`);
            console.log(`   📍 Name: ${dupCheck.existingOrg.name}`);
            console.log(`   📍 Match type: ${dupCheck.matchType}`);
            console.log('');
            console.log('   💡 Use --org to scan/scrape the existing organization');
            return;
        }
        
        // Create temporary org object for scanning
        org = {
            id: null,
            name: options.domain,
            website: `https://${options.domain}`,
            source_id: options.domain,
            status: 'Nominated (Pending Mission Review)'
        };
        isNewOrg = true;
        
        console.log('   ✅ No duplicate found - proceeding with discovery');
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // STEP 2: Run Scanner
    // ───────────────────────────────────────────────────────────────────────
    
    let scanResult = null;
    
    if (!options.skipScan) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🔍 RUNNING SCANNER');
        console.log('────────────────────────────────────────────────────────────────');
        
        scanResult = await scanner.scanOrganization(org, {
            updateDb: !isNewOrg, // Only update DB for existing orgs
            skipTOU: false,
            skipEventsUrl: false,
            skipAI: false
        });
        
        // For new orgs, display discovery info
        if (isNewOrg && scanResult.success) {
            console.log('');
            console.log('   📝 New organization discovered!');
            console.log(`      Name: ${scanResult.aiOrgName || options.domain}`);
            console.log(`      Type: ${scanResult.aiOrgType || 'Unknown'}`);
            console.log(`      Events URL: ${scanResult.eventsUrl || 'Not found'}`);
            console.log(`      TOU Flag: ${scanResult.touFlag ? '⚠️ Yes' : '✅ No'}`);
            console.log('');
            console.log('   💡 To add this org, create record in PocketBase admin');
            console.log('   💡 Then run: node scrapers/scrape-organization.js --org "NAME"');
            return;
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // STEP 3: Safety Gate Check
    // ───────────────────────────────────────────────────────────────────────
    
    if (!isNewOrg) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🚦 SAFETY GATE CHECK');
        console.log('────────────────────────────────────────────────────────────────');
        
        // Re-fetch org to get latest data (scanner may have updated flags)
        org = await getOrganization(org.id);
        
        const safetyCheck = checkSafetyGates(org);
        
        if (!safetyCheck.safe) {
            console.log('   ❌ SAFETY GATES FAILED:');
            for (const issue of safetyCheck.issues) {
                console.log(`      • ${issue}`);
            }
            console.log('');
            console.log('   🛑 Scraping blocked - resolve issues above');
            return;
        }
        
        console.log('   ✅ All safety gates passed');
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // STEP 4: Scrape Events (unless scan-only)
    // ───────────────────────────────────────────────────────────────────────
    
    if (options.scanOnly) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('ℹ️ SCAN ONLY MODE - Skipping event scraping');
        console.log('────────────────────────────────────────────────────────────────');
        return;
    }
    
    if (isNewOrg) {
        console.log('');
        console.log('ℹ️ New organization - create record first before scraping');
        return;
    }
    
    // Scrape!
    const scrapeResult = await scrapeOrganization(org, scanResult);
    
    // ───────────────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ───────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Organization: ${org.name}`);
    if (scanResult) {
        console.log(`   TOU Status: ${scanResult.touFlag ? '⚠️ Restrictions' : '✅ Clear'}`);
    }
    console.log(`   Events Found: ${scrapeResult.eventsFound}`);
    console.log(`   Events Saved: ${scrapeResult.eventsSaved}`);
    console.log(`   Events Skipped: ${scrapeResult.eventsSkipped || 0}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

// Run
main().catch(console.error);
