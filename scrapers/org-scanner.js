/**
 * scanners/org-scanner.js
 * 
 * UNIFIED ORGANIZATION SCANNER
 * 
 * Central module for all organization scanning operations.
 * Consolidates logic from tou-scanner.js, discover-orgs-by-events.js, and base-scraper.js
 * 
 * Features:
 * - TOU page discovery and restriction scanning
 * - Technical block detection (403/401)
 * - Events URL discovery (NEW)
 * - POC info gathering
 * - AI-powered org analysis
 * 
 * Usage:
 *   const scanner = require('./org-scanner');
 *   await scanner.init();
 *   const result = await scanner.scanOrganization(org);
 * 
 * Last Updated: 2026-01-14
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// User agent for requests
const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: matthew_e_taylor@hotmail.com)';

// Request timeout
const TIMEOUT = 30000;

// Rate limiting
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 4000;

// ═══════════════════════════════════════════════════════════════════════════════
// TOU RESTRICTION KEYWORDS
// ═══════════════════════════════════════════════════════════════════════════════

const TOU_RESTRICTION_KEYWORDS = [
    // Direct scraping mentions
    'scraping',
    'scrape',
    'web scraping',
    'screen scraping',
    'data scraping',
    
    // Bot/crawler mentions
    'automated access',
    'automated system',
    'automated means',
    'automated queries',
    'automated data collection',
    'bot',
    'bots',
    'robot',
    'robots',
    'crawler',
    'crawlers',
    'spider',
    'spiders',
    
    // Data mining
    'data mining',
    'data harvesting',
    'harvest',
    'harvesting',
    'data extraction',
    
    // Machine/programmatic access
    'machine readable',
    'machine-readable',
    'programmatic access',
    'programmatically',
    'systematic',
    'systematically',
    'bulk download',
    'bulk access',
    'mass download'
];

const TOU_RESTRICTION_PHRASES = [
    'may not use',
    'shall not use',
    'do not use',
    'must not use',
    'prohibited from',
    'not authorized',
    'without authorization',
    'consent required',
    'permission required',
    'prior approval',
    'written consent',
    'written permission',
    'agree not to',
    'you agree not',
    'refrain from'
];

// Common TOU page paths
const TOU_PATHS = [
    '/terms',
    '/terms-of-use',
    '/terms-of-service',
    '/tos',
    '/legal',
    '/legal/terms',
    '/privacy-policy',
    '/privacy',
    '/acceptable-use',
    '/user-agreement',
    '/site-terms',
    '/website-terms',
    '/conditions',
    '/terms-and-conditions'
];

// Common events page paths
const EVENTS_PATHS = [
    '/events',
    '/calendar',
    '/upcoming-events',
    '/programs',
    '/conferences',
    '/seminars',
    '/what-we-do/events',
    '/about/events',
    '/news-events',
    '/news-and-events',
    '/happenings',
    '/schedule'
];

// Keywords indicating an events listing page
const EVENTS_PAGE_INDICATORS = [
    'upcoming events',
    'past events',
    'event calendar',
    'calendar of events',
    'register now',
    'registration',
    'event details',
    'event date',
    'event location',
    'join us',
    'rsvp'
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

let authToken = null;
let fetchModule = null;
let cheerioModule = null;
let initialized = false;

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the scanner (load modules)
 */
async function init() {
    if (initialized) return;
    
    fetchModule = (await import('node-fetch')).default;
    cheerioModule = await import('cheerio');
    initialized = true;
    
    console.log('✅ Org Scanner initialized');
}

/**
 * Authenticate with PocketBase
 */
async function authenticate() {
    if (authToken) return authToken;
    
    await init();
    
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
 * Sleep for rate limiting
 */
function sleep(ms = null) {
    const delay = ms || Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Extract text content from HTML
 */
function extractText(html) {
    if (typeof html !== 'string') return '';
    
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

/**
 * Fetch URL with error handling
 */
async function fetchUrl(url, options = {}) {
    await init();
    
    try {
        const response = await fetchModule(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                ...options.headers
            },
            timeout: options.timeout || TIMEOUT
        });
        
        if (response.status === 403 || response.status === 401) {
            return {
                success: false,
                status: response.status,
                body: '',
                error: `HTTP ${response.status} - Access denied`,
                isBlocked: true
            };
        }
        
        if (response.status === 404) {
            return {
                success: false,
                status: 404,
                body: '',
                error: 'Page not found',
                isBlocked: false
            };
        }
        
        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                body: '',
                error: `HTTP ${response.status}`,
                isBlocked: false
            };
        }
        
        const body = await response.text();
        return {
            success: true,
            status: 200,
            body,
            error: null,
            isBlocked: false
        };
        
    } catch (error) {
        const isBlocked = error.message.toLowerCase().includes('403') ||
                          error.message.toLowerCase().includes('forbidden') ||
                          error.message.toLowerCase().includes('blocked');
        
        return {
            success: false,
            status: 0,
            body: '',
            error: error.message,
            isBlocked
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOU SCANNING (MULTI-PAGE - Updated 2026-01-15)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find ALL legal page URLs from homepage HTML and common paths
 * Returns array of URLs to scan (not just the first one!)
 */
async function findAllLegalUrls(html, baseUrl) {
    const foundUrls = new Set(); // Use Set to avoid duplicates
    const urlDetails = []; // Track details for logging
    
    // STEP 1: Look for ALL legal links in the homepage HTML
    if (html) {
        const patterns = [
            /href=["']([^"']*(?:terms|tos|legal|privacy|acceptable|conditions|agreement|copyright|policy)[^"']*)["']/gi
        ];
        
        for (const pattern of patterns) {
            const matches = html.matchAll(pattern);
            for (const match of matches) {
                let url = match[1];
                
                // Skip anchors, javascript, mailto
                if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:')) {
                    continue;
                }
                
                // Make relative URLs absolute
                if (!url.startsWith('http')) {
                    try {
                        url = new URL(url, baseUrl).href;
                    } catch (e) {
                        continue;
                    }
                }
                
                // Check if it looks like a legal page
                const lowerUrl = url.toLowerCase();
                if (lowerUrl.includes('term') || lowerUrl.includes('legal') || 
                    lowerUrl.includes('privacy') || lowerUrl.includes('agreement') ||
                    lowerUrl.includes('acceptable') || lowerUrl.includes('conditions') ||
                    lowerUrl.includes('copyright') || lowerUrl.includes('policy') ||
                    lowerUrl.includes('tos')) {
                    
                    if (!foundUrls.has(url)) {
                        foundUrls.add(url);
                        urlDetails.push({ url, method: 'link' });
                    }
                }
            }
        }
    }
    
    // STEP 2: Try common TOU paths that weren't already found
    for (const path of TOU_PATHS) {
        const testUrl = baseUrl.replace(/\/$/, '') + path;
        
        // Skip if we already found this URL from links
        if (foundUrls.has(testUrl)) {
            continue;
        }
        
        // Check if the path exists
        const result = await fetchUrl(testUrl);
        
        if (result.isBlocked) {
            // Return immediately on tech block
            return { 
                urls: [], 
                urlDetails: [],
                isBlocked: true, 
                blockedUrl: testUrl,
                error: result.error 
            };
        }
        
        if (result.success) {
            foundUrls.add(testUrl);
            urlDetails.push({ url: testUrl, method: 'path' });
        }
        
        await sleep(800); // Respectful delay between path checks
    }
    
    return { 
        urls: Array.from(foundUrls), 
        urlDetails,
        isBlocked: false, 
        error: null 
    };
}

/**
 * Scan text for TOU restriction keywords
 */
function findRestrictions(text) {
    const lowerText = text.toLowerCase();
    const foundKeywords = [];
    const context = [];
    
    // Check keywords
    for (const keyword of TOU_RESTRICTION_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            
            const index = lowerText.indexOf(keyword.toLowerCase());
            const start = Math.max(0, index - 80);
            const end = Math.min(text.length, index + keyword.length + 80);
            const contextSnippet = '...' + text.substring(start, end).trim() + '...';
            context.push(`"${keyword}": ${contextSnippet}`);
        }
    }
    
    // Check phrases
    for (const phrase of TOU_RESTRICTION_PHRASES) {
        if (lowerText.includes(phrase.toLowerCase())) {
            foundKeywords.push(phrase);
            
            const index = lowerText.indexOf(phrase.toLowerCase());
            const start = Math.max(0, index - 80);
            const end = Math.min(text.length, index + phrase.length + 80);
            const contextSnippet = '...' + text.substring(start, end).trim() + '...';
            context.push(`"${phrase}": ${contextSnippet}`);
        }
    }
    
    const uniqueKeywords = [...new Set(foundKeywords)];
    
    return {
        hasRestrictions: uniqueKeywords.length > 0,
        foundKeywords: uniqueKeywords,
        context: context.slice(0, 10)
    };
}

/**
 * Full TOU scan for an organization - SCANS ALL LEGAL PAGES
 * 
 * Checks: Terms of Use, Terms of Service, Privacy Policy, User Agreement,
 *         Acceptable Use Policy, Website Terms, Copyright Notice, etc.
 * 
 * Sets tou_flag = TRUE if ANY page contains restrictions
 */
async function scanTOU(website, html = null) {
    console.log('   📜 Scanning ALL legal pages for restrictions...');
    
    const result = {
        touUrl: null,           // Primary TOU URL (first one with restrictions, or first scanned)
        touUrls: [],            // ALL legal URLs scanned
        touFlag: false,
        techBlockFlag: false,
        touNotes: '',
        foundKeywords: [],
        context: [],
        pagesScanned: 0,
        pagesWithRestrictions: []
    };
    
    const baseUrl = website.replace(/\/$/, '');
    
    // Find ALL legal page URLs
    console.log('      🔍 Discovering legal pages...');
    const legalSearch = await findAllLegalUrls(html, baseUrl);
    
    if (legalSearch.isBlocked) {
        console.log(`      ⛔ Technical block detected at: ${legalSearch.blockedUrl}`);
        result.techBlockFlag = true;
        result.touFlag = true;
        result.touNotes = `Technical block: ${legalSearch.error} at ${legalSearch.blockedUrl}`;
        return result;
    }
    
    if (legalSearch.urls.length === 0) {
        console.log('      ℹ️ No legal pages found (no prohibition assumed)');
        result.touNotes = 'No legal pages found - no explicit prohibition';
        return result;
    }
    
    console.log(`      📄 Found ${legalSearch.urls.length} legal page(s) to scan`);
    result.touUrls = legalSearch.urls;
    
    // Scan EACH legal page
    const scannedPages = [];
    const allFoundKeywords = [];
    const allContext = [];
    
    for (const urlInfo of legalSearch.urlDetails) {
        const url = urlInfo.url;
        const pageType = getPageType(url);
        
        console.log(`      📜 Scanning ${pageType}: ${url.substring(0, 60)}...`);
        
        const pageResult = await fetchUrl(url);
        
        if (pageResult.isBlocked) {
            console.log(`         ⛔ Blocked`);
            result.techBlockFlag = true;
            result.touFlag = true;
            result.pagesWithRestrictions.push({ url, type: pageType, reason: 'Technical block' });
            scannedPages.push(`❌ ${pageType}: BLOCKED`);
            continue;
        }
        
        if (!pageResult.success) {
            console.log(`         ⚠️ Could not fetch`);
            scannedPages.push(`⚠️ ${pageType}: Could not fetch`);
            continue;
        }
        
        result.pagesScanned++;
        
        // Scan for restrictions
        const text = extractText(pageResult.body);
        const restrictions = findRestrictions(text);
        
        if (restrictions.hasRestrictions) {
            console.log(`         ⚠️ RESTRICTIONS FOUND: ${restrictions.foundKeywords.slice(0, 3).join(', ')}`);
            result.touFlag = true;
            result.pagesWithRestrictions.push({ 
                url, 
                type: pageType, 
                keywords: restrictions.foundKeywords 
            });
            
            // Set primary TOU URL to first page with restrictions
            if (!result.touUrl) {
                result.touUrl = url;
            }
            
            allFoundKeywords.push(...restrictions.foundKeywords);
            allContext.push(...restrictions.context.map(c => `[${pageType}] ${c}`));
            scannedPages.push(`⚠️ ${pageType}: RESTRICTIONS (${restrictions.foundKeywords.length} keywords)`);
        } else {
            console.log(`         ✅ No restrictions`);
            scannedPages.push(`✅ ${pageType}: Clear`);
        }
        
        await sleep(1000); // Respectful delay between pages
    }
    
    // Set primary TOU URL if none had restrictions
    if (!result.touUrl && result.touUrls.length > 0) {
        result.touUrl = result.touUrls[0];
    }
    
    // Compile results
    result.foundKeywords = [...new Set(allFoundKeywords)];
    result.context = allContext.slice(0, 15);
    
    // Build detailed notes
    if (result.touFlag) {
        const restrictedPages = result.pagesWithRestrictions.map(p => p.type).join(', ');
        result.touNotes = `⚠️ TOU RESTRICTIONS DETECTED

Pages with restrictions: ${restrictedPages}

Pages scanned (${result.pagesScanned} total):
${scannedPages.join('\n')}

Keywords found: ${result.foundKeywords.slice(0, 10).join(', ')}

Context:
${result.context.slice(0, 5).join('\n')}`;
    } else {
        result.touNotes = `✅ ALL LEGAL PAGES SCANNED - No restrictions found

Pages scanned (${result.pagesScanned} total):
${scannedPages.join('\n')}`;
    }
    
    // Summary log
    console.log(`      📊 Scanned ${result.pagesScanned} page(s), ${result.pagesWithRestrictions.length} with restrictions`);
    
    return result;
}

/**
 * Helper: Determine page type from URL for logging
 */
function getPageType(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('privacy')) return 'Privacy Policy';
    if (lowerUrl.includes('terms-of-service') || lowerUrl.includes('tos')) return 'Terms of Service';
    if (lowerUrl.includes('terms-of-use')) return 'Terms of Use';
    if (lowerUrl.includes('terms') || lowerUrl.includes('conditions')) return 'Terms & Conditions';
    if (lowerUrl.includes('acceptable-use')) return 'Acceptable Use Policy';
    if (lowerUrl.includes('user-agreement') || lowerUrl.includes('agreement')) return 'User Agreement';
    if (lowerUrl.includes('legal')) return 'Legal';
    if (lowerUrl.includes('copyright')) return 'Copyright Notice';
    return 'Legal Page';
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS URL DISCOVERY (NEW)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract potential events_url from a triggering event URL
 * 
 * Example:
 *   Input:  https://cnas.org/events/2026-defense-summit
 *   Output: https://cnas.org/events
 * 
 *   Input:  https://brookings.edu/events/2026/01/cyber-panel
 *   Output: https://brookings.edu/events
 */
function extractEventsUrlFromTriggeringUrl(triggeringUrl) {
    if (!triggeringUrl) return null;
    
    try {
        const url = new URL(triggeringUrl);
        const pathParts = url.pathname.split('/').filter(p => p);
        
        // Common events path patterns to look for
        const eventsKeywords = ['events', 'calendar', 'programs', 'conferences', 'seminars', 'happenings', 'schedule'];
        
        // Find the index of an events-related path segment
        let eventsIndex = -1;
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i].toLowerCase();
            if (eventsKeywords.some(kw => part.includes(kw))) {
                eventsIndex = i;
                break;
            }
        }
        
        if (eventsIndex >= 0) {
            // Build URL up to and including the events segment
            const eventsPath = '/' + pathParts.slice(0, eventsIndex + 1).join('/');
            return `${url.origin}${eventsPath}`;
        }
        
        // If no events keyword found, try to extract parent directory
        // (useful for patterns like /detail-pages/event/123)
        if (pathParts.length > 1) {
            // Look for "event" (singular) or "detail" patterns
            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i].toLowerCase();
                if (part === 'event' || part.includes('detail')) {
                    // Return everything before this segment
                    if (i > 0) {
                        const parentPath = '/' + pathParts.slice(0, i).join('/');
                        return `${url.origin}${parentPath}`;
                    }
                }
            }
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Find events URL by searching homepage for events links
 */
async function findEventsUrlFromHomepage(html, baseUrl) {
    if (!html) return { found: false, url: null, candidates: [] };
    
    const $ = cheerioModule.load(html);
    const candidates = [];
    
    // Look for links with events-related text or URLs
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().toLowerCase().trim();
        
        if (!href) return;
        
        // Skip external links, anchors, javascript
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        
        // Check if link text or URL suggests events
        const eventsKeywords = ['events', 'calendar', 'upcoming', 'programs', 'conferences', 'seminars', 'what\'s on'];
        const isEventsLink = eventsKeywords.some(kw => 
            text.includes(kw) || href.toLowerCase().includes(kw)
        );
        
        if (isEventsLink) {
            let fullUrl = href;
            if (!href.startsWith('http')) {
                try {
                    fullUrl = new URL(href, baseUrl).href;
                } catch (e) {
                    return;
                }
            }
            
            // Avoid duplicate candidates
            if (!candidates.some(c => c.url === fullUrl)) {
                candidates.push({
                    url: fullUrl,
                    text: $(el).text().trim().substring(0, 50),
                    score: text.includes('events') ? 10 : (text.includes('calendar') ? 8 : 5)
                });
            }
        }
    });
    
    // Sort by score (most likely events pages first)
    candidates.sort((a, b) => b.score - a.score);
    
    if (candidates.length > 0) {
        return { found: true, url: candidates[0].url, candidates };
    }
    
    return { found: false, url: null, candidates: [] };
}

/**
 * Validate that a URL is actually an events listing page
 */
async function validateEventsUrl(url) {
    console.log(`      🔍 Validating events URL: ${url}`);
    
    const result = await fetchUrl(url);
    
    if (!result.success) {
        console.log(`      ❌ Could not fetch URL (${result.error})`);
        return { valid: false, error: result.error, isBlocked: result.isBlocked };
    }
    
    const text = extractText(result.body).toLowerCase();
    
    // Check for events page indicators
    let indicatorCount = 0;
    const foundIndicators = [];
    
    for (const indicator of EVENTS_PAGE_INDICATORS) {
        if (text.includes(indicator.toLowerCase())) {
            indicatorCount++;
            foundIndicators.push(indicator);
        }
    }
    
    // Also check for date patterns (suggests event listings)
    const datePatterns = [
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
        /\b\d{4}-\d{2}-\d{2}\b/
    ];
    
    let hasDatePattern = false;
    for (const pattern of datePatterns) {
        if (pattern.test(text)) {
            hasDatePattern = true;
            break;
        }
    }
    
    const isValid = indicatorCount >= 2 || (indicatorCount >= 1 && hasDatePattern);
    
    if (isValid) {
        console.log(`      ✅ Valid events page (found: ${foundIndicators.slice(0, 3).join(', ')})`);
    } else {
        console.log(`      ⚠️ May not be an events listing page`);
    }
    
    return {
        valid: isValid,
        indicatorCount,
        foundIndicators,
        hasDatePattern,
        isBlocked: false
    };
}

/**
 * Discover events URL using multiple strategies
 */
async function findEventsUrl(org, homepageHtml = null) {
    console.log('   📅 Discovering events URL...');
    
    const result = {
        eventsUrl: null,
        method: null,
        validated: false,
        candidates: []
    };
    
    const baseUrl = (org.website || `https://${org.source_id}`).replace(/\/$/, '');
    
    // Strategy 1: Extract from triggering_event_url
    if (org.triggering_event_url) {
        console.log('      🔍 Strategy 1: Extracting from triggering event URL...');
        const extracted = extractEventsUrlFromTriggeringUrl(org.triggering_event_url);
        
        if (extracted) {
            console.log(`      📍 Extracted: ${extracted}`);
            const validation = await validateEventsUrl(extracted);
            
            if (validation.valid) {
                result.eventsUrl = extracted;
                result.method = 'triggering_url';
                result.validated = true;
                console.log(`      ✅ Using events URL from triggering event`);
                return result;
            } else if (!validation.isBlocked) {
                result.candidates.push({ url: extracted, source: 'triggering_url', validated: false });
            }
        }
        
        await sleep(1500);
    }
    
    // Strategy 2: Search homepage for events links
    if (homepageHtml) {
        console.log('      🔍 Strategy 2: Searching homepage for events links...');
        const homepageSearch = await findEventsUrlFromHomepage(homepageHtml, baseUrl);
        
        if (homepageSearch.found) {
            console.log(`      📍 Found link: ${homepageSearch.url}`);
            const validation = await validateEventsUrl(homepageSearch.url);
            
            if (validation.valid) {
                result.eventsUrl = homepageSearch.url;
                result.method = 'homepage_link';
                result.validated = true;
                console.log(`      ✅ Using events URL from homepage link`);
                return result;
            } else if (!validation.isBlocked) {
                result.candidates.push({ url: homepageSearch.url, source: 'homepage_link', validated: false });
            }
            
            // Add other candidates
            for (const c of homepageSearch.candidates.slice(1, 4)) {
                result.candidates.push({ url: c.url, source: 'homepage_link', validated: false });
            }
        }
        
        await sleep(1500);
    }
    
    // Strategy 3: Try common events paths
    console.log('      🔍 Strategy 3: Trying common events paths...');
    for (const path of EVENTS_PATHS.slice(0, 5)) {
        const testUrl = baseUrl + path;
        console.log(`      📍 Trying: ${testUrl}`);
        
        const validation = await validateEventsUrl(testUrl);
        
        if (validation.valid) {
            result.eventsUrl = testUrl;
            result.method = 'common_path';
            result.validated = true;
            console.log(`      ✅ Using events URL from common path`);
            return result;
        } else if (!validation.isBlocked && validation.indicatorCount > 0) {
            result.candidates.push({ url: testUrl, source: 'common_path', validated: false });
        }
        
        await sleep(1000);
    }
    
    // If no validated URL found, use best candidate
    if (result.candidates.length > 0) {
        result.eventsUrl = result.candidates[0].url;
        result.method = result.candidates[0].source + '_unvalidated';
        result.validated = false;
        console.log(`      ⚠️ Using best candidate (unvalidated): ${result.eventsUrl}`);
    } else {
        console.log('      ❌ Could not discover events URL');
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// POC GATHERING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract POC info from HTML
 */
function extractPocFromHtml(html) {
    const result = { name: '', email: '', phone: '', source: 'website' };
    
    // Find email addresses
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatch) {
        // Prefer contact/info/events emails
        const preferred = emailMatch.find(e =>
            e.includes('contact') || e.includes('info') ||
            e.includes('events') || e.includes('media') ||
            e.includes('press') || e.includes('communications')
        );
        result.email = preferred || emailMatch[0];
    }
    
    // Find phone numbers
    const phoneMatch = html.match(/(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
        result.phone = phoneMatch[0];
    }
    
    return result.email || result.phone ? result : null;
}

/**
 * Find contact page and extract POC info
 */
async function gatherPOC(html, baseUrl) {
    console.log('   👤 Gathering POC info...');
    
    // First try to extract from provided HTML (homepage)
    let poc = extractPocFromHtml(html || '');
    
    if (poc && poc.email) {
        console.log(`      ✅ Found POC on homepage: ${poc.email}`);
        return poc;
    }
    
    // Try to find and fetch contact page
    const contactPatterns = ['/contact', '/about/contact', '/contact-us', '/about'];
    
    for (const path of contactPatterns) {
        const contactUrl = baseUrl.replace(/\/$/, '') + path;
        const result = await fetchUrl(contactUrl);
        
        if (result.success) {
            poc = extractPocFromHtml(result.body);
            if (poc && poc.email) {
                console.log(`      ✅ Found POC on ${path}: ${poc.email}`);
                return poc;
            }
        }
        
        await sleep(1000);
    }
    
    console.log('      ℹ️ No POC email found');
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Use AI to analyze organization and extract name + summary
 */
async function analyzeWithAI(html, domain, triggeringEventTitle = null) {
    if (!OPENAI_API_KEY) {
        console.log('      ⚠️ No OpenAI API key - skipping AI analysis');
        return { orgName: domain, orgType: '', summary: '' };
    }
    
    console.log('   🤖 Analyzing with AI...');
    
    const textContent = extractText(html).substring(0, 4000);
    const isEduDomain = domain.endsWith('.edu');
    
    let eduInstructions = '';
    if (isEduDomain) {
        eduInstructions = `
IMPORTANT - THIS IS A UNIVERSITY (.edu domain):
- Do NOT just return the university name
- Find the specific DEPARTMENT, CENTER, SCHOOL, or INSTITUTE
- Format: "Center/Department Name (University Name)"`;
    }
    
    const triggeringInfo = triggeringEventTitle 
        ? `\nTRIGGERING EVENT FOUND: ${triggeringEventTitle}` 
        : '';
    
    const prompt = `Analyze this organization's website content and extract information.

WEBSITE DOMAIN: ${domain}${triggeringInfo}
${eduInstructions}

WEBSITE CONTENT:
${textContent}

TASK: Extract:
1. ORGANIZATION NAME: Full name with acronym if exists. Never return just acronyms or generic titles.
2. ORGANIZATION TYPE: think tank, trade association, government agency, nonprofit, university center, professional association, research institute, foundation, conference organizer, other
3. SUMMARY: 2-3 sentences about what this organization does.

Return ONLY valid JSON:
{
  "org_name": "Full Organization Name (ACRONYM)",
  "org_type": "organization type",
  "summary": "2-3 sentence summary."
}`;

    try {
        const response = await fetchModule('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You extract organization information from website content. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const parsed = JSON.parse(content);
        
        // Validate org name isn't garbage
        let orgName = parsed.org_name || domain;
        const badPatterns = ['home', 'welcome', 'events', 'index', 'main', 'page'];
        if (badPatterns.some(p => orgName.toLowerCase() === p)) {
            orgName = domain;
        }
        
        console.log(`      ✅ AI extracted: "${orgName}"`);
        
        return {
            orgName,
            orgType: parsed.org_type || '',
            summary: parsed.summary || ''
        };
        
    } catch (error) {
        console.log(`      ⚠️ AI analysis failed: ${error.message}`);
        return {
            orgName: domain,
            orgType: '',
            summary: ''
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get organization by ID
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
 * Get organization by name
 */
async function getOrganizationByName(name) {
    await authenticate();
    
    try {
        // Exact match first
        const filter = encodeURIComponent(`name = "${name}"`);
        const response = await fetchModule(
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
        const partialResponse = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${partialFilter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (partialResponse.ok) {
            const partialData = await partialResponse.json();
            return partialData.items && partialData.items.length > 0 ? partialData.items[0] : null;
        }
        
        return null;
    } catch (error) {
        console.error('❌ Could not search organization:', error.message);
        return null;
    }
}

/**
 * Update organization record
 */
async function updateOrganization(orgId, updates) {
    await authenticate();
    
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(updates)
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Could not update organization:', error.message);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCAN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform full organization scan
 * 
 * @param {Object} org - Organization record (or object with website/source_id)
 * @param {Object} options - { updateDb: boolean, skipTOU: boolean, skipEventsUrl: boolean }
 * @returns {Object} Scan results
 */
async function scanOrganization(org, options = {}) {
    const { updateDb = false, skipTOU = false, skipEventsUrl = false, skipAI = false } = options;
    
    await init();
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`🔍 SCANNING: ${org.name || org.source_id || 'Unknown'}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Website: ${org.website || 'N/A'}`);
    console.log(`   Source ID: ${org.source_id || 'N/A'}`);
    console.log(`   Current events_url: ${org.events_url || 'N/A'}`);
    console.log(`   Triggering URL: ${org.triggering_event_url || 'N/A'}`);
    console.log('');
    
    const result = {
        success: true,
        orgId: org.id,
        orgName: org.name,
        
        // Homepage fetch
        homepageFetched: false,
        homepageHtml: null,
        
        // Tech block
        techBlockFlag: false,
        techBlockError: null,
        
        // TOU
        touFlag: false,
        touUrl: null,
        touNotes: '',
        foundKeywords: [],
        
        // Events URL (NEW)
        eventsUrl: null,
        eventsUrlMethod: null,
        eventsUrlValidated: false,
        eventsUrlCandidates: [],
        
        // POC
        pocInfo: null,
        
        // AI Analysis
        aiOrgName: null,
        aiOrgType: null,
        aiSummary: null,
        
        // What was updated
        fieldsUpdated: [],
        
        // Scan metadata
        scannedDate: new Date().toISOString()
    };
    
    const baseUrl = (org.website || `https://${org.source_id}`).replace(/\/$/, '');
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 1: Fetch homepage
    // ───────────────────────────────────────────────────────────────────────
    
    console.log('   📡 Fetching homepage...');
    const homepageResult = await fetchUrl(baseUrl);
    
    if (homepageResult.isBlocked) {
        console.log(`      ⛔ Technical block detected (${homepageResult.status})`);
        result.techBlockFlag = true;
        result.techBlockError = homepageResult.error;
        result.touFlag = true;
        result.touNotes = `Technical block: ${homepageResult.error}`;
        
        // Even if blocked, we can try to extract events_url from triggering URL
        if (!skipEventsUrl && org.triggering_event_url) {
            const extracted = extractEventsUrlFromTriggeringUrl(org.triggering_event_url);
            if (extracted) {
                result.eventsUrl = extracted;
                result.eventsUrlMethod = 'triggering_url_blocked';
                result.eventsUrlValidated = false;
            }
        }
    } else if (homepageResult.success) {
        console.log(`      ✅ Homepage fetched (${homepageResult.body.length} bytes)`);
        result.homepageFetched = true;
        result.homepageHtml = homepageResult.body;
    } else {
        console.log(`      ⚠️ Homepage fetch failed: ${homepageResult.error}`);
    }
    
    await sleep(1500);
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 2: TOU Scan
    // ───────────────────────────────────────────────────────────────────────
    
    if (!skipTOU && !result.techBlockFlag) {
        const touResult = await scanTOU(baseUrl, result.homepageHtml);
        result.touUrl = touResult.touUrl;
        result.touFlag = touResult.touFlag;
        result.techBlockFlag = result.techBlockFlag || touResult.techBlockFlag;
        result.touNotes = touResult.touNotes;
        result.foundKeywords = touResult.foundKeywords;
        
        await sleep(1500);
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 3: Events URL Discovery (NEW)
    // ───────────────────────────────────────────────────────────────────────
    
    if (!skipEventsUrl && !result.techBlockFlag) {
        const eventsResult = await findEventsUrl(org, result.homepageHtml);
        result.eventsUrl = eventsResult.eventsUrl;
        result.eventsUrlMethod = eventsResult.method;
        result.eventsUrlValidated = eventsResult.validated;
        result.eventsUrlCandidates = eventsResult.candidates;
        
        await sleep(1500);
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 4: POC Gathering
    // ───────────────────────────────────────────────────────────────────────
    
    if (result.homepageFetched && !result.techBlockFlag && !result.touFlag) {
        result.pocInfo = await gatherPOC(result.homepageHtml, baseUrl);
        await sleep(1500);
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 5: AI Analysis
    // ───────────────────────────────────────────────────────────────────────
    
    if (!skipAI && result.homepageFetched) {
        const aiResult = await analyzeWithAI(
            result.homepageHtml,
            org.source_id || new URL(baseUrl).hostname,
            org.triggering_event_title
        );
        result.aiOrgName = aiResult.orgName;
        result.aiOrgType = aiResult.orgType;
        result.aiSummary = aiResult.summary;
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 6: Update Database (if requested)
    // ───────────────────────────────────────────────────────────────────────
    
    if (updateDb && org.id) {
        console.log('');
        console.log('   💾 Updating database...');
        
        const updates = {};
        
        // TOU fields
        if (result.touUrl && !org.tou_url) {
            updates.tou_url = result.touUrl;
            result.fieldsUpdated.push('tou_url');
        }
        if (result.touFlag !== org.tou_flag) {
            updates.tou_flag = result.touFlag;
            result.fieldsUpdated.push('tou_flag');
        }
        if (result.techBlockFlag !== org.tech_block_flag) {
            updates.tech_block_flag = result.techBlockFlag;
            result.fieldsUpdated.push('tech_block_flag');
        }
        if (result.touNotes) {
            updates.tou_notes = result.touNotes;
            result.fieldsUpdated.push('tou_notes');
        }
        updates.tou_scanned_date = new Date().toISOString().split('T')[0];
        result.fieldsUpdated.push('tou_scanned_date');
        
        // Events URL (only update if we found one and current is empty)
        if (result.eventsUrl && !org.events_url) {
            updates.events_url = result.eventsUrl;
            result.fieldsUpdated.push('events_url');
        }
        
        // AI fields (only update if empty)
        if (result.aiSummary && !org.ai_reasoning) {
            updates.ai_reasoning = result.aiSummary;
            result.fieldsUpdated.push('ai_reasoning');
        }
        if (result.aiOrgType && !org.org_type) {
            updates.org_type = result.aiOrgType;
            result.fieldsUpdated.push('org_type');
        }
        
        if (Object.keys(updates).length > 0) {
            const updateResult = await updateOrganization(org.id, updates);
            if (updateResult) {
                console.log(`      ✅ Updated: ${result.fieldsUpdated.join(', ')}`);
            } else {
                console.log('      ❌ Update failed');
                result.success = false;
            }
        } else {
            console.log('      ℹ️ No updates needed');
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Summary
    // ───────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SCAN RESULTS');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Tech Block: ${result.techBlockFlag ? '⛔ YES' : '✅ No'}`);
    console.log(`   TOU Flag: ${result.touFlag ? '⚠️ YES' : '✅ No'}`);
    console.log(`   TOU URL: ${result.touUrl || 'Not found'}`);
    console.log(`   Events URL: ${result.eventsUrl || 'Not found'} ${result.eventsUrlValidated ? '✅' : '⚠️'}`);
    console.log(`   POC Email: ${result.pocInfo?.email || 'Not found'}`);
    console.log(`   AI Org Name: ${result.aiOrgName || 'N/A'}`);
    if (result.fieldsUpdated.length > 0) {
        console.log(`   Fields Updated: ${result.fieldsUpdated.join(', ')}`);
    }
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    // Initialization
    init,
    authenticate,
    
    // Main scan function
    scanOrganization,
    
    // Individual scan components (for use by other scripts)
    scanTOU,
    findAllLegalUrls,
    findEventsUrl,
    extractEventsUrlFromTriggeringUrl,
    validateEventsUrl,
    gatherPOC,
    analyzeWithAI,
    
    // Database operations
    getOrganization,
    getOrganizationByName,
    updateOrganization,
    
    // Utilities
    fetchUrl,
    extractText,
    sleep,
    getPageType,
    
    // Constants
    TOU_RESTRICTION_KEYWORDS,
    TOU_RESTRICTION_PHRASES,
    TOU_PATHS,
    EVENTS_PATHS,
    EVENTS_PAGE_INDICATORS,
    USER_AGENT
};
