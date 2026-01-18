/**
 * scrapers/scan-and-scrape-all-live-orgs.js
 * 
 * UNIFIED SCAN + SCRAPE SYSTEM
 * 
 * Smart CLI that handles the complete workflow:
 * - New org discovery (full scan)
 * - Pre-scrape verification (light scan)
 * - Event extraction (universal scraper)
 * - Deduplication checks
 * - JS-rendered site detection
 * - Batch processing of ALL orgs
 * 
 * Usage:
 *   node scrapers/scan-and-scrape-all-live-orgs.js --org "CNAS"           # Existing org by name
 *   node scrapers/scan-and-scrape-all-live-orgs.js --domain "rand.org"    # New org discovery
 *   node scrapers/scan-and-scrape-all-live-orgs.js --org "CNAS" --scan-only  # Just scan, don't scrape
 *   node scrapers/scan-and-scrape-all-live-orgs.js --all                  # Scan + scrape ALL Live orgs
 *   node scrapers/scan-and-scrape-all-live-orgs.js --all --scan-only      # Scan ALL Live orgs (no scraping)
 * 
 * Last Updated: 2026-01-17
 * - Consolidated unified scanner/scraper
 * - Uses org-scanner.js for comprehensive scanning before each scrape
 * - Duplicate events get UPDATED with new information instead of skipped
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
const DELAY_BETWEEN_ORGS_MS = 3000;  // Delay between organizations in batch mode

// User agent
const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: matthew_e_taylor@hotmail.com)';

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
        all: false,
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
            case '--all':
                options.all = true;
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
  node scrapers/scan-and-scrape-all-live-orgs.js [options]

OPTIONS:
  --org "Name"      Scan/scrape existing organization by name
  --domain "x.org"  Discover new organization by domain
  --all             Scan/scrape ALL Live organizations (batch mode)
  --scan-only       Run scan only, don't scrape events
  --skip-scan       Skip pre-scrape scan (use with caution)
  --help, -h        Show this help

EXAMPLES:
  # Scan and scrape existing org
  node scrapers/scan-and-scrape-all-live-orgs.js --org "CNAS"
  
  # Discover new org by domain
  node scrapers/scan-and-scrape-all-live-orgs.js --domain "csis.org"
  
  # Just run scan, don't scrape
  node scrapers/scan-and-scrape-all-live-orgs.js --org "RAND" --scan-only

  # Scan and scrape ALL Live organizations
  node scrapers/scan-and-scrape-all-live-orgs.js --all

  # Scan ALL Live organizations (no scraping)
  node scrapers/scan-and-scrape-all-live-orgs.js --all --scan-only

BATCH MODE (--all):
  Processes all organizations with status "Live (Scraping Active)"
  For each org:
    1. Full scan via org-scanner.js (TOU, tech block, JS rendering)
    2. Updates database flags and status if issues found
    3. Checks 5 safety gates
    4. If gates pass → scrapes with universal AI scraper
    5. Saves/updates events based on event_policy

SAFETY GATES (must ALL pass):
  ✅ status = "Live (Scraping Active)"
  ✅ tou_flag = false
  ✅ tech_block_flag = false
  ✅ tech_rendering_flag = false
  ✅ permission_denied_flag = false

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
        
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

/**
 * Get organization by name
 */
async function getOrganizationByName(name) {
    try {
        // Exact match
        const filter = encodeURIComponent(`name = "${name}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
        
        // Partial match
        const partialFilter = encodeURIComponent(`name ~ "${name}"`);
        const partialResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${partialFilter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (partialResponse.ok) {
            const partialData = await partialResponse.json();
            return partialData.items && partialData.items.length > 0 ? partialData.items[0] : null;
        }
        
        return null;
    } catch (e) {
        console.log(`      ⚠️ Search error: ${e.message}`);
        return null;
    }
}

/**
 * Get ALL organizations with status "Live (Scraping Active)"
 * Returns all Live orgs - safety gate checks happen individually
 */
async function getAllLiveOrganizations() {
    try {
        const filter = encodeURIComponent('status = "Live (Scraping Active)"');
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}&perPage=500&sort=name`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (e) {
        console.log(`   ❌ Could not fetch organizations: ${e.message}`);
        return [];
    }
}

/**
 * Check for duplicate organization
 */
async function checkForDuplicateOrg(domain) {
    const rootDomain = extractRootDomain(domain);
    
    try {
        // Check by source_id (domain)
        const filter = encodeURIComponent(`source_id ~ "${rootDomain}"`);
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return { isDuplicate: true, existingOrg: data.items[0], matchType: 'domain' };
            }
        }
        
        // Check by website
        const websiteFilter = encodeURIComponent(`website ~ "${rootDomain}"`);
        const websiteResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${websiteFilter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (websiteResponse.ok) {
            const websiteData = await websiteResponse.json();
            if (websiteData.items && websiteData.items.length > 0) {
                return { isDuplicate: true, existingOrg: websiteData.items[0], matchType: 'website' };
            }
        }
    } catch (e) {
        console.log(`      ⚠️ Dedup check error: ${e.message}`);
    }
    
    return { isDuplicate: false, existingOrg: null, matchType: null };
}

// ═══════════════════════════════════════════════════════════════════════════════
// JS-RENDERED SITE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect if a page appears to be JavaScript-rendered
 */
function detectJSRenderedPage(html, extractedLinks, eventsFound) {
    const signals = [];
    let jsSignalCount = 0;
    
    // Extract text for analysis
    const textContent = extractText(html);
    
    // Signal 1: No dates found in text content
    const datePatterns = [
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/gi,
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
        /\b\d{4}-\d{2}-\d{2}\b/g,
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}/gi
    ];
    
    let datesFound = 0;
    for (const pattern of datePatterns) {
        const matches = textContent.match(pattern);
        if (matches) {
            datesFound += matches.length;
        }
    }
    
    if (datesFound === 0) {
        signals.push('No dates found in page text');
        jsSignalCount += 2;
    } else if (datesFound < 3) {
        signals.push(`Only ${datesFound} date(s) found (expected more for events page)`);
        jsSignalCount += 1;
    }
    
    // Signal 2: Links are mostly navigation, not event-specific
    const eventSpecificLinks = extractedLinks.filter(link => {
        const text = link.text.toLowerCase();
        const url = link.url.toLowerCase();
        return text.length > 20 || 
               url.includes('/event/') || 
               url.includes('/events/') && url.split('/').length > 4;
    });
    
    if (extractedLinks.length > 0 && eventSpecificLinks.length === 0) {
        signals.push(`Found ${extractedLinks.length} links but none appear to be event detail pages`);
        jsSignalCount += 2;
    }
    
    // Signal 3: Very little text content relative to HTML size
    const textToHtmlRatio = textContent.length / html.length;
    if (textToHtmlRatio < 0.05) {
        signals.push(`Very low text-to-HTML ratio (${(textToHtmlRatio * 100).toFixed(1)}%) - likely JS-rendered`);
        jsSignalCount += 1;
    }
    
    // Signal 4: Framework signatures in HTML
    const frameworkSignatures = [
        { pattern: /id=["']__next["']/i, name: 'Next.js' },
        { pattern: /id=["']root["'][^>]*><\/div>/i, name: 'React (empty root)' },
        { pattern: /ng-app|ng-controller/i, name: 'Angular' },
        { pattern: /data-v-[a-f0-9]+/i, name: 'Vue.js' },
        { pattern: /<script[^>]*>window\.__NUXT__/i, name: 'Nuxt.js' },
        { pattern: /data-reactroot/i, name: 'React' }
    ];
    
    for (const sig of frameworkSignatures) {
        if (sig.pattern.test(html)) {
            signals.push(`${sig.name} framework detected`);
            jsSignalCount += 1;
            break;
        }
    }
    
    // Signal 5: AI found 0 events despite page loading OK
    if (eventsFound === 0 && html.length > 10000) {
        signals.push('AI extracted 0 events from large page - content may load dynamically');
        jsSignalCount += 1;
    }
    
    // Determine confidence level
    let confidence = 'LOW';
    let isJSRendered = false;
    
    if (jsSignalCount >= 4) {
        confidence = 'HIGH';
        isJSRendered = true;
    } else if (jsSignalCount >= 2) {
        confidence = 'MEDIUM';
        isJSRendered = true;
    } else if (jsSignalCount >= 1) {
        confidence = 'LOW';
        isJSRendered = false;
    }
    
    return {
        isJSRendered,
        confidence,
        signals,
        jsSignalCount,
        stats: {
            datesFound,
            extractedLinksCount: extractedLinks.length,
            eventSpecificLinksCount: eventSpecificLinks.length,
            textLength: textContent.length,
            htmlLength: html.length,
            textToHtmlRatio: (textToHtmlRatio * 100).toFixed(1) + '%'
        }
    };
}

/**
 * Update organization's database with JS-rendered detection
 */
async function updateJSRenderedStatus(orgId, jsDetection, eventsUrl) {
    const timestamp = new Date().toISOString().split('T')[0];
    
    const noteText = `⚠️ JS-RENDERED SITE DETECTED (${timestamp})
Confidence: ${jsDetection.confidence}
Events URL: ${eventsUrl}

Signals detected:
${jsDetection.signals.map(s => '• ' + s).join('\n')}

Stats:
• Dates found: ${jsDetection.stats.datesFound}
• Event links found: ${jsDetection.stats.eventSpecificLinksCount} of ${jsDetection.stats.extractedLinksCount}
• Text/HTML ratio: ${jsDetection.stats.textToHtmlRatio}

This site requires a headless browser (Puppeteer) to scrape events.
The events page loads content dynamically via JavaScript.
`;
    
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify({
                    tech_rendering_flag: true,
                    scrape_notes: noteText,
                    status: 'Rejected by Org'
                })
            }
        );
        
        if (response.ok) {
            console.log('   💾 Database updated: tech_rendering_flag = true, status = "Rejected by Org"');
        }
    } catch (e) {
        console.log(`   ⚠️ Could not update JS-rendered status: ${e.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP FETCHING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch a URL with timeout and user agent
 */
async function fetchUrl(url) {
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

// ═══════════════════════════════════════════════════════════════════════════════
// AI EVENT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract events from a page using AI
 */
async function extractEventsWithAI(html, eventsUrl, orgName) {
    if (!OPENAI_API_KEY) {
        console.log('      ⚠️ No OpenAI API key - cannot extract events');
        return [];
    }
    
    console.log('   🤖 Extracting events with AI...');
    
    // Extract links BEFORE stripping HTML
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
        console.log(`         ⚠️ Could not fetch event page: ${result.error || 'Unknown error'}`);
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
    if (event.url) {
        return event.url;
    }
    const titleSlug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    return `${orgDomain}/${titleSlug}-${event.start_date || 'nodate'}`;
}

/**
 * Get existing event by source_id OR by title+org
 */
async function getExistingEvent(sourceId, title, orgId) {
    try {
        // First check by exact source_id
        const filter1 = encodeURIComponent(`source_id = "${sourceId}"`);
        const response1 = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter1}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response1.ok) {
            const data1 = await response1.json();
            if (data1.items && data1.items.length > 0) {
                return data1.items[0];
            }
        }
        
        // Also check by title + org
        const titleNormalized = title.toLowerCase().trim().substring(0, 60);
        const filter2 = encodeURIComponent(`organization = "${orgId}" && title ~ "${titleNormalized}"`);
        const response2 = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter2}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.items && data2.items.length > 0) {
                return data2.items[0];
            }
        }
    } catch (e) {
        // Assume doesn't exist on error
    }
    return null;
}

/**
 * Check if a value is meaningful
 */
function isMeaningfulValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
        const trimmed = value.trim().toLowerCase();
        if (trimmed === '' || trimmed === 'n/a' || trimmed === 'tbd' || trimmed === 'null') {
            return false;
        }
    }
    return true;
}

/**
 * Compare existing event with new data and return fields that need updating
 */
function getEventUpdates(existing, newEvent) {
    const updates = {};
    const changedFields = [];
    
    const fieldsToCheck = [
        'title', 'description', 'start_date', 'end_date', 
        'start_time', 'end_time', 'timezone', 'location',
        'event_type', 'url', 'registration_url'
    ];
    
    for (const field of fieldsToCheck) {
        const existingValue = existing[field];
        const newValue = newEvent[field];
        
        if (isMeaningfulValue(newValue)) {
            const existingNorm = existingValue ? String(existingValue).trim() : '';
            const newNorm = String(newValue).trim();
            
            if (!isMeaningfulValue(existingValue) || existingNorm !== newNorm) {
                updates[field] = newValue;
                changedFields.push(field);
            }
        }
    }
    
    if (Object.keys(updates).length > 0) {
        return { updates, changedFields };
    }
    return null;
}

/**
 * Update existing event in database
 */
async function updateEvent(eventId, updates) {
    try {
        const response = await fetch(
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
    } catch (e) {
        return false;
    }
}

/**
 * Save event to database (creates new or updates existing)
 */
async function saveEvent(event, orgId, orgDomain, eventPolicy) {
    const sourceId = generateSourceId(event, orgDomain);
    
    // Check if event already exists
    const existing = await getExistingEvent(sourceId, event.title, orgId);
    
    if (existing) {
        // Event exists - check if it needs updating
        const updateResult = getEventUpdates(existing, event);
        
        if (updateResult) {
            const success = await updateEvent(existing.id, updateResult.updates);
            
            if (success) {
                console.log(`      🔄 Updated: ${event.title.substring(0, 40)}...`);
                console.log(`         Changed: ${updateResult.changedFields.join(', ')}`);
                return { saved: false, updated: true, fields: updateResult.changedFields };
            } else {
                console.log(`      ❌ Update failed: ${event.title.substring(0, 40)}...`);
                return { saved: false, updated: false, reason: 'update_failed' };
            }
        } else {
            console.log(`      ✓ Unchanged: ${event.title.substring(0, 40)}...`);
            return { saved: false, updated: false, reason: 'no_changes' };
        }
    }
    
    // Set event status based on org's event_policy
    const eventStatus = eventPolicy === 'accept_all' ? 'approved' : 'nominated';
    
    const eventRecord = {
        title: event.title,
        description: event.description || '',
        start_date: event.start_date || '',
        end_date: event.end_date || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        timezone: event.timezone || 'ET',
        location: event.location || '',
        event_type: event.event_type || 'In-person',
        url: event.url || '',
        registration_url: event.registration_url || '',
        organization: orgId,
        source_id: sourceId,
        event_status: eventStatus
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
        
        if (response.ok) {
            console.log(`      💾 Saved: ${event.title.substring(0, 40)}... [${eventStatus}]`);
            return { saved: true, updated: false };
        } else {
            const error = await response.json();
            console.log(`      ❌ Save failed: ${event.title.substring(0, 40)}... - ${JSON.stringify(error)}`);
            return { saved: false, updated: false, reason: 'save_failed' };
        }
    } catch (e) {
        console.log(`      ❌ Save error: ${e.message}`);
        return { saved: false, updated: false, reason: e.message };
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
    
    // Extract links for JS detection
    const extractedLinks = extractLinks(result.body, eventsUrl);
    
    // Extract events using AI
    const events = await extractEventsWithAI(result.body, eventsUrl, org.name);
    
    // JS-RENDERED SITE DETECTION
    if (events.length === 0) {
        console.log('');
        console.log('   🔍 Checking for JS-rendered page...');
        
        const jsDetection = detectJSRenderedPage(result.body, extractedLinks, events.length);
        
        if (jsDetection.isJSRendered) {
            console.log(`   ⚠️ JS-RENDERED SITE DETECTED (${jsDetection.confidence} confidence)`);
            console.log('   📋 Signals:');
            for (const signal of jsDetection.signals) {
                console.log(`      • ${signal}`);
            }
            
            // Update database with this finding
            await updateJSRenderedStatus(org.id, jsDetection, eventsUrl);
            
            return { 
                success: true, 
                reason: 'js_rendered_site', 
                eventsFound: 0, 
                eventsSaved: 0,
                techRenderinged: true,
                jsDetection,
                statusReset: true,
                newStatus: 'Rejected by Org'
            };
        } else {
            console.log('   ℹ️ Page does not appear to be JS-rendered');
            console.log('   ℹ️ No events found on page (may be empty or past events only)');
        }
        
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
    
    const eventPolicy = org.event_policy || 'propose_events';
    console.log(`      📋 Event Policy: ${eventPolicy}`);
    
    let savedCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;
    const orgDomain = extractRootDomain(org.website || org.source_id);
    
    for (const event of enrichedEvents) {
        const result = await saveEvent(event, org.id, orgDomain, eventPolicy);
        if (result.saved) {
            savedCount++;
        } else if (result.updated) {
            updatedCount++;
        } else {
            unchangedCount++;
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
    console.log(`      Events saved (new): ${savedCount}`);
    console.log(`      Events updated: ${updatedCount}`);
    console.log(`      Unchanged: ${unchangedCount}`);
    console.log(`      Event status: ${eventPolicy === 'accept_all' ? '✅ Approved (in public UI)' : '📋 Nominated (needs review)'}`);
    
    return {
        success: true,
        eventsFound: events.length,
        eventsSaved: savedCount,
        eventsUpdated: updatedCount,
        eventsUnchanged: unchangedCount,
        eventStatus: eventPolicy === 'accept_all' ? 'approved' : 'nominated'
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
 *   4. tech_rendering_flag must be false (site uses static HTML)
 *   5. permission_denied_flag must be false (org hasn't declined)
 */
function checkSafetyGates(org) {
    const issues = [];
    
    if (org.status !== 'Live (Scraping Active)') {
        issues.push(`Status is "${org.status}" (must be "Live (Scraping Active)")`);
    }
    
    if (org.tou_flag === true) {
        issues.push('tou_flag is true (TOU restrictions detected)');
    }
    
    if (org.tech_block_flag === true) {
        issues.push('tech_block_flag is true (site blocks access)');
    }
    
    if (org.tech_rendering_flag === true) {
        issues.push('tech_rendering_flag is true (site requires Puppeteer)');
    }
    
    if (org.permission_denied_flag === true) {
        issues.push('permission_denied_flag is true (org explicitly declined)');
    }
    
    return {
        safe: issues.length === 0,
        issues
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH PROCESSING (--all mode)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Process ALL Live organizations
 */
async function processAllOrganizations(options) {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔄 BATCH MODE: Processing ALL Live Organizations');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${options.scanOnly ? 'Scan Only' : 'Scan + Scrape'}`);
    console.log('');
    
    // Get all Live organizations
    console.log('📡 Fetching all Live organizations...');
    const allOrgs = await getAllLiveOrganizations();
    
    if (allOrgs.length === 0) {
        console.log('   ⚠️ No organizations with status "Live (Scraping Active)" found');
        return;
    }
    
    console.log(`   ✅ Found ${allOrgs.length} Live organization(s)`);
    console.log('');
    
    // List them
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📋 Organizations to process:');
    console.log('────────────────────────────────────────────────────────────────');
    allOrgs.forEach((org, i) => {
        console.log(`   ${i + 1}. ${org.name}`);
    });
    console.log('────────────────────────────────────────────────────────────────');
    console.log('');
    
    // Track results
    const results = {
        total: allOrgs.length,
        scanned: 0,
        scraped: 0,
        blocked: 0,
        errors: 0,
        totalEventsFound: 0,
        totalEventsSaved: 0,
        totalEventsUpdated: 0,
        details: []
    };
    
    // Process each organization
    for (let i = 0; i < allOrgs.length; i++) {
        const org = allOrgs[i];
        
        console.log('');
        console.log(`════════════════════════════════════════════════════════════════`);
        console.log(`📌 [${i + 1}/${allOrgs.length}] ${org.name}`);
        console.log(`════════════════════════════════════════════════════════════════`);
        
        const orgResult = {
            name: org.name,
            scanned: false,
            scraped: false,
            blocked: false,
            error: null,
            eventsFound: 0,
            eventsSaved: 0,
            eventsUpdated: 0,
            flagsSet: []
        };
        
        try {
            // ─────────────────────────────────────────────────────────────────
            // STEP 1: Run full scan via org-scanner.js
            // ─────────────────────────────────────────────────────────────────
            console.log('');
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🔍 SCANNING');
            console.log('────────────────────────────────────────────────────────────────');
            
            const scanResult = await scanner.scanOrganization(org, {
                updateDb: true,
                skipTOU: false,
                skipEventsUrl: false,
                skipAI: true  // Skip AI for batch mode to save API calls
            });
            
            orgResult.scanned = true;
            results.scanned++;
            
            // Track which flags were set
            if (scanResult.touFlag) orgResult.flagsSet.push('tou_flag');
            if (scanResult.techBlockFlag) orgResult.flagsSet.push('tech_block_flag');
            if (scanResult.techRenderingFlag) orgResult.flagsSet.push('tech_rendering_flag');
            
            // ─────────────────────────────────────────────────────────────────
            // STEP 2: Re-fetch org to get updated flags
            // ─────────────────────────────────────────────────────────────────
            const updatedOrg = await getOrganization(org.id);
            
            if (!updatedOrg) {
                console.log('   ❌ Could not re-fetch organization');
                orgResult.error = 'Could not re-fetch organization';
                results.errors++;
                results.details.push(orgResult);
                continue;
            }
            
            // ─────────────────────────────────────────────────────────────────
            // STEP 3: Safety gate check
            // ─────────────────────────────────────────────────────────────────
            console.log('');
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🚦 SAFETY GATE CHECK');
            console.log('────────────────────────────────────────────────────────────────');
            
            const safetyCheck = checkSafetyGates(updatedOrg);
            
            if (!safetyCheck.safe) {
                console.log('   ❌ SAFETY GATES FAILED:');
                for (const issue of safetyCheck.issues) {
                    console.log(`      • ${issue}`);
                }
                orgResult.blocked = true;
                results.blocked++;
                results.details.push(orgResult);
                
                // Delay before next org
                if (i < allOrgs.length - 1) {
                    console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_ORGS_MS/1000}s before next org...`);
                    await sleep(DELAY_BETWEEN_ORGS_MS);
                }
                continue;
            }
            
            console.log('   ✅ All safety gates passed');
            
            // ─────────────────────────────────────────────────────────────────
            // STEP 4: Scrape (unless scan-only)
            // ─────────────────────────────────────────────────────────────────
            if (options.scanOnly) {
                console.log('');
                console.log('   ℹ️ SCAN ONLY MODE - Skipping scrape');
                results.details.push(orgResult);
            } else {
                const scrapeResult = await scrapeOrganization(updatedOrg, scanResult);
                
                orgResult.scraped = true;
                orgResult.eventsFound = scrapeResult.eventsFound || 0;
                orgResult.eventsSaved = scrapeResult.eventsSaved || 0;
                orgResult.eventsUpdated = scrapeResult.eventsUpdated || 0;
                
                results.scraped++;
                results.totalEventsFound += orgResult.eventsFound;
                results.totalEventsSaved += orgResult.eventsSaved;
                results.totalEventsUpdated += orgResult.eventsUpdated;
                
                results.details.push(orgResult);
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            orgResult.error = error.message;
            results.errors++;
            results.details.push(orgResult);
        }
        
        // Delay before next org
        if (i < allOrgs.length - 1) {
            console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_ORGS_MS/1000}s before next org...`);
            await sleep(DELAY_BETWEEN_ORGS_MS);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FINAL SUMMARY
    // ═══════════════════════════════════════════════════════════════════════════
    
    console.log('');
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 BATCH PROCESSING COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📈 OVERALL STATISTICS');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`   Total organizations: ${results.total}`);
    console.log(`   Scanned: ${results.scanned}`);
    console.log(`   Scraped: ${results.scraped}`);
    console.log(`   Blocked (safety gates): ${results.blocked}`);
    console.log(`   Errors: ${results.errors}`);
    console.log('');
    console.log(`   📋 Total events found: ${results.totalEventsFound}`);
    console.log(`   💾 Total events saved (new): ${results.totalEventsSaved}`);
    console.log(`   🔄 Total events updated: ${results.totalEventsUpdated}`);
    console.log('');
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📋 RESULTS BY ORGANIZATION');
    console.log('────────────────────────────────────────────────────────────────');
    
    for (const detail of results.details) {
        let status = '✅';
        if (detail.blocked) status = '⛔';
        else if (detail.error) status = '❌';
        else if (detail.flagsSet.length > 0) status = '⚠️';
        
        let summary = `${status} ${detail.name}`;
        
        if (detail.blocked) {
            summary += ' - BLOCKED';
        } else if (detail.error) {
            summary += ` - ERROR: ${detail.error}`;
        } else if (detail.scraped) {
            summary += ` - ${detail.eventsSaved} new, ${detail.eventsUpdated} updated`;
        } else {
            summary += ' - Scanned only';
        }
        
        if (detail.flagsSet.length > 0) {
            summary += ` [${detail.flagsSet.join(', ')}]`;
        }
        
        console.log(`   ${summary}`);
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    return results;
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
    
    // Validate arguments
    if (!options.org && !options.domain && !options.all) {
        showHelp();
        console.log('❌ Error: Must specify --org, --domain, or --all\n');
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
    
    // ─────────────────────────────────────────────────────────────────────────
    // BATCH MODE (--all)
    // ─────────────────────────────────────────────────────────────────────────
    if (options.all) {
        await processAllOrganizations(options);
        return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // SINGLE ORG MODE
    // ─────────────────────────────────────────────────────────────────────────
    
    let org = null;
    let isNewOrg = false;
    
    // STEP 1: Find or Create Organization
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
    
    // STEP 2: Run Scanner
    let scanResult = null;
    
    if (!options.skipScan) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🔍 RUNNING SCANNER');
        console.log('────────────────────────────────────────────────────────────────');
        
        scanResult = await scanner.scanOrganization(org, {
            updateDb: !isNewOrg,
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
    
    // STEP 3: Safety Gate Check
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
    
    // STEP 4: Scrape Events (unless scan-only)
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
    
    // FINAL SUMMARY
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Organization: ${org.name}`);
    if (scanResult) {
        console.log(`   TOU Status: ${scanResult.touFlag ? '⚠️ Restrictions' : '✅ Clear'}`);
    }
    if (scrapeResult.techRenderinged) {
        console.log(`   ⚠️ JS-Rendered Site: Yes (${scrapeResult.jsDetection.confidence} confidence)`);
        console.log(`   📝 Finding recorded in scrape_notes`);
        console.log(`   🔄 Status changed to: "${scrapeResult.newStatus}"`);
    }
    console.log(`   Events Found: ${scrapeResult.eventsFound}`);
    console.log(`   Events Saved (new): ${scrapeResult.eventsSaved}`);
    console.log(`   Events Updated: ${scrapeResult.eventsUpdated || 0}`);
    console.log(`   Unchanged: ${scrapeResult.eventsUnchanged || 0}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

// Run
main().catch(console.error);
