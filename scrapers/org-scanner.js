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
 * - Context-aware restriction detection (avoids false positives) - UPDATED 2026-01-16
 * - JavaScript rendering detection on BOTH homepage AND events page - NEW 2026-01-16
 * - Technical block detection (403/401)
 * - Events URL discovery
 * - POC info gathering
 * - AI-powered org analysis
 * 
 * Usage:
 *   const scanner = require('./org-scanner');
 *   await scanner.init();
 *   const result = await scanner.scanOrganization(org);
 * 
 * Last Updated: 2026-01-16
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

// Context window for checking proximity of terms (characters)
const CONTEXT_WINDOW = 150;

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT-AWARE RESTRICTION DETECTION (Updated 2026-01-16)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * HIGH CONFIDENCE RESTRICTION TERMS
 * These terms are specific enough to flag immediately without needing additional context.
 * If found, they indicate a clear prohibition on scraping/automation.
 */
const HIGH_CONFIDENCE_RESTRICTION_TERMS = [
    // Direct scraping phrases
    'web scraping',
    'screen scraping',
    'data scraping',
    'content scraping',
    'automated scraping',
    
    // Explicit bot restrictions
    'no bots',
    'no robots',
    'use of bots',
    'using bots',
    'employ bots',
    'deploy bots',
    
    // Data mining phrases
    'data mining',
    'data harvesting',
    'text mining',
    'content mining',
    
    // Bulk access phrases
    'bulk download',
    'bulk access',
    'mass download',
    'bulk collection',
    
    // AI/ML training restrictions
    'train ai',
    'ai training',
    'train artificial intelligence',
    'model training',
    'machine learning training',
    'language model',
    'train machine learning',
    'training data',
    
    // Explicit automation restrictions
    'automated data collection',
    'automated extraction',
    'automated access is prohibited',
    'automated queries',
    'programmatic access is prohibited',
    'systematic retrieval',
    'systematic collection',
    'systematic access'
];

/**
 * CONTEXT REQUIRED TERMS
 * These single words or short phrases can appear in innocent contexts.
 * Only flag if they appear near a PROHIBITION_PHRASE.
 */
const CONTEXT_REQUIRED_TERMS = [
    'bot',
    'bots',
    'robot',
    'robots',
    'scraping',
    'scrape',
    'crawler',
    'crawlers',
    'spider',
    'spiders',
    'harvest',
    'harvesting',
    'automated',
    'automation',
    'programmatic',
    'programmatically',
    'systematic',
    'systematically'
];

/**
 * PROHIBITION PHRASES
 * These phrases indicate something is being forbidden/restricted.
 * Used to validate CONTEXT_REQUIRED_TERMS.
 */
const PROHIBITION_PHRASES = [
    // Direct prohibitions
    'may not',
    'shall not',
    'must not',
    'do not',
    'cannot',
    'can not',
    'prohibited',
    'not permitted',
    'not allowed',
    'forbidden',
    'restricted',
    'unauthorized',
    
    // Agreement language
    'agree not to',
    'you agree not',
    'covenant not to',
    'refrain from',
    'abstain from',
    
    // Permission language
    'without permission',
    'without authorization',
    'without consent',
    'without prior',
    'without express',
    'without written',
    'requires permission',
    'requires authorization',
    'requires consent',
    
    // Legal language
    'strictly prohibited',
    'expressly prohibited',
    'is prohibited',
    'are prohibited',
    'will not be permitted'
];

/**
 * EXCLUDED CONTEXTS
 * If these phrases appear near a keyword, it's likely a false positive.
 * Skip flagging in these cases.
 */
const EXCLUDED_CONTEXTS = [
    // Staff/HR policy language (not about visitors)
    'staff should',
    'staff must',
    'staff may',
    'employees should',
    'employees must',
    'employees may',
    'personnel should',
    'personnel must',
    'personnel may',
    'team members',
    'our staff',
    'our employees',
    
    // Product/feature descriptions (describing their own bots)
    'our bot',
    'our bots',
    'our chatbot',
    'our chat bot',
    'the chatbot',
    'this chatbot',
    'virtual assistant',
    'ai assistant',
    'automated assistant',
    'our automated',
    'we use automated',
    
    // Content about topics (not restrictions)
    'policy on',
    'research on',
    'article about',
    'report on',
    'study on',
    'paper on',
    'analysis of',
    'discussion of',
    'coverage of',
    
    // Describing external entities
    'threat actors',
    'malicious bots',
    'bad bots',
    'bot attacks',
    'bot detection',
    'bot traffic',
    'combat bots',
    'fighting bots',
    'protect against',
    
    // Political/representation context (New America false positive)
    'representing candidates',
    'political candidates',
    'represent candidates',
    'endorse candidates'
];

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY CONSTANTS (kept for backward compatibility with exports)
// ═══════════════════════════════════════════════════════════════════════════════

const TOU_RESTRICTION_KEYWORDS = HIGH_CONFIDENCE_RESTRICTION_TERMS;
const TOU_RESTRICTION_PHRASES = PROHIBITION_PHRASES;

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
    '/terms-and-conditions',
    '/policies-and-procedures',
    '/policies',
    '/site-policies',
    '/disclaimer',
    '/legal-notice'
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
// JAVASCRIPT RENDERING DETECTION (NEW - 2026-01-16)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Indicators that a page uses JavaScript to render content
 * These patterns suggest the page content is loaded dynamically via JS
 * and cannot be scraped with standard HTTP requests
 */
const JS_RENDER_INDICATORS = {
    // SPA Framework Root Elements (high confidence)
    FRAMEWORK_ROOTS: [
        '<div id="root"></div>',
        '<div id="root">',
        "<div id='root'>",
        '<div id="app"></div>',
        '<div id="app">',
        "<div id='app'>",
        '<div id="__next">',
        '<div id="__nuxt">',
        '<div id="gatsby-focus-wrapper">',
        '<main id="main"></main>',
        '<div id="main"></div>'
    ],
    
    // Framework-specific attributes (high confidence)
    FRAMEWORK_ATTRIBUTES: [
        'data-reactroot',
        'data-react-helmet',
        'ng-app',
        'ng-controller',
        'v-app',
        'data-v-',
        '_ngcontent-',
        'data-server-rendered',
        '__NEXT_DATA__',
        '__NUXT__',
        'window.__INITIAL_STATE__',
        'window.__PRELOADED_STATE__'
    ],
    
    // Noscript warnings (high confidence)
    NOSCRIPT_WARNINGS: [
        'you need to enable javascript',
        'please enable javascript',
        'javascript is required',
        'javascript must be enabled',
        'this site requires javascript',
        'this app requires javascript',
        'enable javascript to run this app',
        'javascript is disabled',
        'browser does not support javascript'
    ],
    
    // Loading placeholders (medium confidence - need multiple)
    LOADING_INDICATORS: [
        'loading...</div>',
        'loading...',
        '<div class="loading">',
        '<div class="spinner">',
        '<div class="loader">',
        'please wait while',
        'content is loading'
    ]
};

/**
 * Minimum text content length (characters) expected for a real homepage
 * Pages with less text content after removing scripts/styles are likely JS-rendered
 */
const MIN_CONTENT_LENGTH = 500;

/**
 * Maximum ratio of script tags to content length
 * High ratio suggests JS-heavy page with little static content
 */
const MAX_SCRIPT_RATIO = 0.8;

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
 * Detect if a page uses JavaScript to render its content
 * 
 * This detects Single Page Applications (SPAs) and other JS-heavy sites
 * that serve minimal HTML and load content dynamically via JavaScript.
 * Such sites cannot be scraped with standard HTTP requests.
 * 
 * @param {string} html - Raw HTML content from the page
 * @returns {Object} { isJsRendered: boolean, confidence: string, reasons: string[], notes: string }
 * 
 * Added: 2026-01-16
 */
function detectJavaScriptRendering(html) {
    if (!html || typeof html !== 'string') {
        return {
            isJsRendered: false,
            confidence: 'none',
            reasons: ['No HTML to analyze'],
            notes: 'Could not analyze - no HTML content'
        };
    }
    
    const lowerHtml = html.toLowerCase();
    const reasons = [];
    let highConfidenceHits = 0;
    let mediumConfidenceHits = 0;
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 1: Framework Root Elements (HIGH confidence)
    // ─────────────────────────────────────────────────────────────────────────
    for (const pattern of JS_RENDER_INDICATORS.FRAMEWORK_ROOTS) {
        if (lowerHtml.includes(pattern.toLowerCase())) {
            // Verify it's actually empty or near-empty (not just an ID that has content)
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('><', '>([^<]{0,50})<'), 'i');
            const match = html.match(regex);
            if (match && (!match[1] || match[1].trim().length < 50)) {
                reasons.push(`Framework root element found: ${pattern}`);
                highConfidenceHits++;
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 2: Framework-specific Attributes (HIGH confidence)
    // ─────────────────────────────────────────────────────────────────────────
    for (const attr of JS_RENDER_INDICATORS.FRAMEWORK_ATTRIBUTES) {
        if (lowerHtml.includes(attr.toLowerCase())) {
            reasons.push(`Framework attribute found: ${attr}`);
            highConfidenceHits++;
            break; // One is enough for high confidence
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 3: Noscript Warnings (HIGH confidence)
    // ─────────────────────────────────────────────────────────────────────────
    // Extract noscript content
    const noscriptMatch = html.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi);
    if (noscriptMatch) {
        const noscriptContent = noscriptMatch.join(' ').toLowerCase();
        for (const warning of JS_RENDER_INDICATORS.NOSCRIPT_WARNINGS) {
            if (noscriptContent.includes(warning)) {
                reasons.push(`Noscript warning: "${warning}"`);
                highConfidenceHits++;
                break;
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 4: Content Analysis (MEDIUM confidence)
    // ─────────────────────────────────────────────────────────────────────────
    const textContent = extractText(html);
    const textLength = textContent.length;
    const htmlLength = html.length;
    
    // Check for very little actual text content
    if (textLength < MIN_CONTENT_LENGTH && htmlLength > 1000) {
        reasons.push(`Very little text content (${textLength} chars) despite large HTML (${htmlLength} chars)`);
        mediumConfidenceHits++;
    }
    
    // Count script tags vs content
    const scriptMatches = html.match(/<script[^>]*>/gi) || [];
    const scriptCount = scriptMatches.length;
    
    if (scriptCount > 10 && textLength < 1000) {
        reasons.push(`High script count (${scriptCount}) with minimal text content`);
        mediumConfidenceHits++;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 5: Loading Indicators (MEDIUM confidence)
    // ─────────────────────────────────────────────────────────────────────────
    let loadingHits = 0;
    for (const indicator of JS_RENDER_INDICATORS.LOADING_INDICATORS) {
        if (lowerHtml.includes(indicator)) {
            loadingHits++;
        }
    }
    if (loadingHits >= 2) {
        reasons.push(`Multiple loading indicators found (${loadingHits})`);
        mediumConfidenceHits++;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Determine Result
    // ─────────────────────────────────────────────────────────────────────────
    let isJsRendered = false;
    let confidence = 'none';
    
    if (highConfidenceHits >= 1) {
        isJsRendered = true;
        confidence = 'high';
    } else if (mediumConfidenceHits >= 2) {
        isJsRendered = true;
        confidence = 'medium';
    }
    
    // Build notes string
    let notes = '';
    if (isJsRendered) {
        notes = `JavaScript-rendered site detected (${confidence} confidence). `;
        notes += `Indicators: ${reasons.join('; ')}. `;
        notes += `This site likely uses a JavaScript framework (React, Vue, Angular, Next.js, etc.) `;
        notes += `and may require a headless browser for scraping.`;
    } else {
        notes = 'No JavaScript rendering detected - site appears to use server-side rendering.';
    }
    
    return {
        isJsRendered,
        confidence,
        reasons,
        notes,
        stats: {
            textLength,
            htmlLength,
            scriptCount,
            highConfidenceHits,
            mediumConfidenceHits
        }
    };
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
 * Content path prefixes to EXCLUDE from legal page scanning
 * These are sections of websites that contain articles/content, not legal terms
 */
const CONTENT_PATH_PREFIXES = [
    '/topics/',
    '/topic/',
    '/programs/',
    '/program/',
    '/events/',
    '/event/',
    '/news/',
    '/blog/',
    '/articles/',
    '/article/',
    '/research/',
    '/publications/',
    '/publication/',
    '/reports/',
    '/report/',
    '/experts/',
    '/expert/',
    '/people/',
    '/person/',
    '/authors/',
    '/author/',
    '/issues/',
    '/issue/',
    '/regions/',
    '/region/',
    '/podcasts/',
    '/videos/',
    '/projects/',
    '/initiatives/',
    '/centers/',
    '/commentary/',
    '/analysis/',
    '/briefs/',
    '/papers/'
];

/**
 * Check if a URL is actually a legal/terms page vs a content page
 * Returns true if it's a genuine legal page
 */
function isLegalPageUrl(url) {
    const lowerUrl = url.toLowerCase();
    
    // FIRST: Exclude content paths (these are NOT legal pages even if they contain "policy")
    for (const prefix of CONTENT_PATH_PREFIXES) {
        if (lowerUrl.includes(prefix)) {
            return false;
        }
    }
    
    // SECOND: Check for specific legal page patterns
    // These patterns should match the END of the path or be standalone segments
    const legalPatterns = [
        // Terms pages
        /\/terms[-_]?of[-_]?use\/?$/i,
        /\/terms[-_]?of[-_]?service\/?$/i,
        /\/terms[-_]?and[-_]?conditions\/?$/i,
        /\/terms[-_]?conditions\/?$/i,
        /\/terms\/?$/i,
        /\/tos\/?$/i,
        
        // Privacy pages
        /\/privacy[-_]?policy\/?$/i,
        /\/privacy\/?$/i,
        /\/data[-_]?privacy\/?$/i,
        
        // Cookie pages
        /\/cookie[-_]?policy\/?$/i,
        /\/cookies\/?$/i,
        
        // Legal pages
        /\/legal\/?$/i,
        /\/legal\/terms\/?$/i,
        /\/legal\/privacy\/?$/i,
        /\/legal[-_]?notices?\/?$/i,
        
        // User agreement pages
        /\/user[-_]?agreement\/?$/i,
        /\/acceptable[-_]?use\/?$/i,
        /\/acceptable[-_]?use[-_]?policy\/?$/i,
        
        // Copyright pages
        /\/copyright\/?$/i,
        /\/copyright[-_]?notice\/?$/i,
        
        // Site terms
        /\/site[-_]?terms\/?$/i,
        /\/website[-_]?terms\/?$/i,
        
        // Conditions
        /\/conditions[-_]?of[-_]?use\/?$/i,
        
        // Policies pages (NEW - catches /policies-and-procedures/, /policies/, etc.)
        /\/policies[-_]?and[-_]?procedures\/?$/i,
        /\/policies\/?$/i,
        /\/site[-_]?policies\/?$/i,
        /\/website[-_]?policies\/?$/i,
        
        // Disclaimer
        /\/disclaimer\/?$/i,
        /\/disclaimers\/?$/i
    ];
    
    // Check if URL matches any legal pattern
    for (const pattern of legalPatterns) {
        if (pattern.test(lowerUrl)) {
            return true;
        }
    }
    
    // THIRD: Check for legal keywords in the LAST path segment only
    // This prevents matching /topics/foreign-policy/ but allows /privacy-policy/
    try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(s => s.length > 0);
        const lastSegment = pathSegments[pathSegments.length - 1] || '';
        
        // Only match if the last segment IS the legal term (not just contains it)
        const legalLastSegments = [
            'terms', 'tos', 'legal', 'privacy', 'copyright',
            'terms-of-use', 'terms-of-service', 'privacy-policy',
            'cookie-policy', 'user-agreement', 'acceptable-use',
            'terms-and-conditions', 'site-terms', 'website-terms'
        ];
        
        if (legalLastSegments.includes(lastSegment.toLowerCase())) {
            return true;
        }
        
        // Check for patterns like "brookings-institution-privacy-policy"
        if (lastSegment.toLowerCase().endsWith('-privacy-policy') ||
            lastSegment.toLowerCase().endsWith('-terms-of-use') ||
            lastSegment.toLowerCase().endsWith('-terms-of-service') ||
            lastSegment.toLowerCase().endsWith('-cookie-policy') ||
            lastSegment.toLowerCase().endsWith('-user-agreement')) {
            return true;
        }
    } catch (e) {
        // URL parsing failed, be conservative
        return false;
    }
    
    return false;
}

/**
 * Find ALL legal page URLs from homepage HTML and common paths
 * Returns array of URLs to scan (not just the first one!)
 * 
 * Updated 2026-01-15: Now excludes content pages (e.g., /topics/foreign-policy/)
 */
async function findAllLegalUrls(html, baseUrl) {
    const foundUrls = new Set(); // Use Set to avoid duplicates
    const urlDetails = []; // Track details for logging
    
    // STEP 1: Look for ALL legal links in the homepage HTML
    if (html) {
        // Match href attributes that might contain legal page URLs
        const hrefPattern = /href=["']([^"']+)["']/gi;
        const matches = html.matchAll(hrefPattern);
        
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
            
            // Check if it's a genuine legal page (not a content page)
            if (isLegalPageUrl(url)) {
                if (!foundUrls.has(url)) {
                    foundUrls.add(url);
                    urlDetails.push({ url, method: 'link' });
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

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT-AWARE RESTRICTION DETECTION (NEW - 2026-01-16)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a term appears near an excluded context (false positive filter)
 * 
 * @param {string} text - Full text to search
 * @param {number} keywordIndex - Index where keyword was found
 * @param {number} keywordLength - Length of the keyword
 * @returns {Object} { isExcluded: boolean, excludedContext: string|null }
 */
function checkForExcludedContext(text, keywordIndex, keywordLength) {
    const lowerText = text.toLowerCase();
    
    // Define the window to check around the keyword
    const windowStart = Math.max(0, keywordIndex - CONTEXT_WINDOW);
    const windowEnd = Math.min(lowerText.length, keywordIndex + keywordLength + CONTEXT_WINDOW);
    const contextWindow = lowerText.substring(windowStart, windowEnd);
    
    // Check each excluded context
    for (const excludedPhrase of EXCLUDED_CONTEXTS) {
        if (contextWindow.includes(excludedPhrase.toLowerCase())) {
            return { isExcluded: true, excludedContext: excludedPhrase };
        }
    }
    
    return { isExcluded: false, excludedContext: null };
}

/**
 * Check if a term appears near a prohibition phrase
 * 
 * @param {string} text - Full text to search
 * @param {number} keywordIndex - Index where keyword was found
 * @param {number} keywordLength - Length of the keyword
 * @returns {Object} { hasProhibition: boolean, prohibitionPhrase: string|null }
 */
function checkForProhibitionPhrase(text, keywordIndex, keywordLength) {
    const lowerText = text.toLowerCase();
    
    // Define the window to check around the keyword
    const windowStart = Math.max(0, keywordIndex - CONTEXT_WINDOW);
    const windowEnd = Math.min(lowerText.length, keywordIndex + keywordLength + CONTEXT_WINDOW);
    const contextWindow = lowerText.substring(windowStart, windowEnd);
    
    // Check each prohibition phrase
    for (const phrase of PROHIBITION_PHRASES) {
        if (contextWindow.includes(phrase.toLowerCase())) {
            return { hasProhibition: true, prohibitionPhrase: phrase };
        }
    }
    
    return { hasProhibition: false, prohibitionPhrase: null };
}

/**
 * Extract context snippet around a keyword for logging
 */
function getContextSnippet(text, keywordIndex, keywordLength, snippetRadius = 80) {
    const start = Math.max(0, keywordIndex - snippetRadius);
    const end = Math.min(text.length, keywordIndex + keywordLength + snippetRadius);
    return '...' + text.substring(start, end).trim().replace(/\s+/g, ' ') + '...';
}

/**
 * Scan text for TOU restriction keywords using CONTEXT-AWARE detection
 * 
 * Two-tier detection:
 * 1. HIGH_CONFIDENCE terms → Flag immediately
 * 2. CONTEXT_REQUIRED terms → Only flag if near a PROHIBITION_PHRASE and NOT near EXCLUDED_CONTEXT
 * 
 * Updated 2026-01-16
 */
function findRestrictions(text) {
    const lowerText = text.toLowerCase();
    const foundRestrictions = [];
    const contextDetails = [];
    const skippedFalsePositives = [];
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Check HIGH CONFIDENCE terms (flag immediately)
    // ─────────────────────────────────────────────────────────────────────────
    
    for (const term of HIGH_CONFIDENCE_RESTRICTION_TERMS) {
        const termLower = term.toLowerCase();
        let searchIndex = 0;
        
        while ((searchIndex = lowerText.indexOf(termLower, searchIndex)) !== -1) {
            // Even high-confidence terms should check for excluded contexts
            const exclusionCheck = checkForExcludedContext(text, searchIndex, term.length);
            
            if (exclusionCheck.isExcluded) {
                skippedFalsePositives.push({
                    term,
                    reason: `Near excluded context: "${exclusionCheck.excludedContext}"`,
                    snippet: getContextSnippet(text, searchIndex, term.length)
                });
                searchIndex += term.length;
                continue;
            }
            
            // Flag this as a restriction
            const snippet = getContextSnippet(text, searchIndex, term.length);
            foundRestrictions.push({
                term,
                type: 'HIGH_CONFIDENCE',
                snippet
            });
            contextDetails.push(`[HIGH_CONFIDENCE] "${term}": ${snippet}`);
            
            searchIndex += term.length;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Check CONTEXT REQUIRED terms (need prohibition phrase nearby)
    // ─────────────────────────────────────────────────────────────────────────
    
    for (const term of CONTEXT_REQUIRED_TERMS) {
        const termLower = term.toLowerCase();
        let searchIndex = 0;
        
        // Use word boundary matching for short terms to avoid partial matches
        // e.g., "bot" should not match "robot" or "botany"
        const wordBoundaryRegex = new RegExp(`\\b${termLower}\\b`, 'gi');
        let match;
        
        while ((match = wordBoundaryRegex.exec(lowerText)) !== null) {
            const matchIndex = match.index;
            
            // Check for excluded context first
            const exclusionCheck = checkForExcludedContext(text, matchIndex, term.length);
            
            if (exclusionCheck.isExcluded) {
                skippedFalsePositives.push({
                    term,
                    reason: `Near excluded context: "${exclusionCheck.excludedContext}"`,
                    snippet: getContextSnippet(text, matchIndex, term.length)
                });
                continue;
            }
            
            // Check for prohibition phrase nearby
            const prohibitionCheck = checkForProhibitionPhrase(text, matchIndex, term.length);
            
            if (prohibitionCheck.hasProhibition) {
                // Found a real restriction!
                const snippet = getContextSnippet(text, matchIndex, term.length);
                foundRestrictions.push({
                    term,
                    type: 'CONTEXT_CONFIRMED',
                    prohibitionPhrase: prohibitionCheck.prohibitionPhrase,
                    snippet
                });
                contextDetails.push(`[CONTEXT_CONFIRMED] "${term}" + "${prohibitionCheck.prohibitionPhrase}": ${snippet}`);
            } else {
                // Term found but no prohibition phrase nearby - skip
                skippedFalsePositives.push({
                    term,
                    reason: 'No prohibition phrase nearby',
                    snippet: getContextSnippet(text, matchIndex, term.length)
                });
            }
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Compile results
    // ─────────────────────────────────────────────────────────────────────────
    
    const uniqueTerms = [...new Set(foundRestrictions.map(r => r.term))];
    
    return {
        hasRestrictions: foundRestrictions.length > 0,
        foundKeywords: uniqueTerms,
        restrictions: foundRestrictions,
        context: contextDetails.slice(0, 15),
        skippedFalsePositives: skippedFalsePositives.slice(0, 10),
        stats: {
            highConfidenceCount: foundRestrictions.filter(r => r.type === 'HIGH_CONFIDENCE').length,
            contextConfirmedCount: foundRestrictions.filter(r => r.type === 'CONTEXT_CONFIRMED').length,
            falsePositivesSkipped: skippedFalsePositives.length
        }
    };
}

/**
 * Full TOU scan for an organization - SCANS ALL LEGAL PAGES
 * 
 * Checks: Terms of Use, Terms of Service, Privacy Policy, User Agreement,
 *         Acceptable Use Policy, Website Terms, Copyright Notice, etc.
 * 
 * Sets tou_flag = TRUE if ANY page contains restrictions
 * 
 * Updated 2026-01-16: Now uses context-aware detection
 */
async function scanTOU(website, html = null) {
    console.log('   📜 Scanning ALL legal pages for restrictions...');
    console.log('      ℹ️ Using context-aware detection (v2026-01-16)');
    
    const result = {
        touUrl: null,           // Primary TOU URL (first one with restrictions, or first scanned)
        touUrls: [],            // ALL legal URLs scanned
        touFlag: false,
        techBlockFlag: false,
        touNotes: '',
        foundKeywords: [],
        context: [],
        pagesScanned: 0,
        pagesWithRestrictions: [],
        falsePositivesSkipped: 0
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
    let totalFalsePositivesSkipped = 0;
    
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
        
        // Scan for restrictions using context-aware detection
        const text = extractText(pageResult.body);
        const restrictions = findRestrictions(text);
        
        totalFalsePositivesSkipped += restrictions.stats.falsePositivesSkipped;
        
        if (restrictions.hasRestrictions) {
            const highCount = restrictions.stats.highConfidenceCount;
            const contextCount = restrictions.stats.contextConfirmedCount;
            console.log(`         ⚠️ RESTRICTIONS FOUND: ${restrictions.foundKeywords.slice(0, 3).join(', ')}`);
            console.log(`            (${highCount} high-confidence, ${contextCount} context-confirmed)`);
            
            result.touFlag = true;
            result.pagesWithRestrictions.push({ 
                url, 
                type: pageType, 
                keywords: restrictions.foundKeywords,
                stats: restrictions.stats
            });
            
            // Set primary TOU URL to first page with restrictions
            if (!result.touUrl) {
                result.touUrl = url;
            }
            
            allFoundKeywords.push(...restrictions.foundKeywords);
            allContext.push(...restrictions.context.map(c => `[${pageType}] ${c}`));
            scannedPages.push(`⚠️ ${pageType}: RESTRICTIONS (${restrictions.foundKeywords.length} terms)`);
        } else {
            const skipped = restrictions.stats.falsePositivesSkipped;
            if (skipped > 0) {
                console.log(`         ✅ No restrictions (${skipped} false positives filtered)`);
            } else {
                console.log(`         ✅ No restrictions`);
            }
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
    result.falsePositivesSkipped = totalFalsePositivesSkipped;
    
    // Build detailed notes
    if (result.touFlag) {
        const restrictedPages = result.pagesWithRestrictions.map(p => p.type).join(', ');
        result.touNotes = `⚠️ TOU RESTRICTIONS DETECTED (Context-Aware Scan v2026-01-16)

Pages with restrictions: ${restrictedPages}

Pages scanned (${result.pagesScanned} total):
${scannedPages.join('\n')}

Keywords found: ${result.foundKeywords.slice(0, 10).join(', ')}

Context:
${result.context.slice(0, 5).join('\n')}

False positives filtered: ${totalFalsePositivesSkipped}`;
    } else {
        result.touNotes = `✅ ALL LEGAL PAGES SCANNED - No restrictions found (Context-Aware Scan v2026-01-16)

Pages scanned (${result.pagesScanned} total):
${scannedPages.join('\n')}

False positives filtered: ${totalFalsePositivesSkipped}`;
    }
    
    // Summary log
    console.log(`      📊 Scanned ${result.pagesScanned} page(s), ${result.pagesWithRestrictions.length} with restrictions, ${totalFalsePositivesSkipped} false positives filtered`);
    
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
        falsePositivesSkipped: 0,
        
        // JavaScript Rendering Detection (NEW - 2026-01-16)
        jsRenderFlag: false,
        jsRenderNotes: '',
        jsRenderConfidence: 'none',
        
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
        
        // Status change tracking
        statusChanged: false,
        newStatus: null,
        previousStatus: org.status || null,
        
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
    // Step 1.5: JavaScript Rendering Detection (NEW - 2026-01-16)
    // ───────────────────────────────────────────────────────────────────────
    
    if (result.homepageFetched && result.homepageHtml) {
        console.log('   🔍 Checking for JavaScript rendering...');
        const jsResult = detectJavaScriptRendering(result.homepageHtml);
        
        result.jsRenderFlag = jsResult.isJsRendered;
        result.jsRenderNotes = jsResult.notes;
        result.jsRenderConfidence = jsResult.confidence;
        
        if (jsResult.isJsRendered) {
            console.log(`      ⚠️ JavaScript-rendered site detected (${jsResult.confidence} confidence)`);
            if (jsResult.reasons.length > 0) {
                console.log(`      📋 Reasons: ${jsResult.reasons.slice(0, 3).join(', ')}${jsResult.reasons.length > 3 ? '...' : ''}`);
            }
        } else {
            console.log('      ✅ Server-side rendered (standard scraping should work)');
        }
    }
    
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
        result.falsePositivesSkipped = touResult.falsePositivesSkipped || 0;
        
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
    // Step 3.5: Events Page JS Rendering Check (NEW - 2026-01-16)
    // ───────────────────────────────────────────────────────────────────────
    // Some sites have SSR homepages but JS-rendered events pages (e.g., New America)
    // Check the events page separately if homepage didn't trigger JS detection
    
    if (!result.jsRenderFlag && result.eventsUrl && !result.techBlockFlag) {
        console.log('   🔍 Checking events page for JavaScript rendering...');
        
        const eventsPageResult = await fetchUrl(result.eventsUrl);
        
        if (eventsPageResult.success && eventsPageResult.body) {
            const eventsJsResult = detectJavaScriptRendering(eventsPageResult.body);
            
            if (eventsJsResult.isJsRendered) {
                result.jsRenderFlag = true;
                result.jsRenderConfidence = eventsJsResult.confidence;
                result.jsRenderNotes = `Events page is JavaScript-rendered (${eventsJsResult.confidence} confidence). `;
                result.jsRenderNotes += `Homepage uses SSR but events page loads content via JavaScript. `;
                result.jsRenderNotes += `Indicators: ${eventsJsResult.reasons.slice(0, 3).join('; ')}. `;
                result.jsRenderNotes += `Requires headless browser (Puppeteer) to scrape events.`;
                
                console.log(`      ⚠️ Events page is JavaScript-rendered (${eventsJsResult.confidence} confidence)`);
                if (eventsJsResult.reasons.length > 0) {
                    console.log(`      📋 Reasons: ${eventsJsResult.reasons.slice(0, 3).join(', ')}${eventsJsResult.reasons.length > 3 ? '...' : ''}`);
                }
                console.log('      ℹ️ Homepage uses SSR but events page requires JS');
            } else {
                console.log('      ✅ Events page is server-side rendered');
            }
        } else {
            console.log(`      ⚠️ Could not fetch events page to check JS rendering`);
        }
        
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
        
        // AUTO-UPDATE STATUS: If TOU or tech block detected, set status to "Rejected by Org"
        // Only change status if not already rejected
        if ((result.touFlag || result.techBlockFlag) && 
            org.status !== 'Rejected by Org' && 
            org.status !== 'Rejected by Mission') {
            updates.status = 'Rejected by Org';
            result.fieldsUpdated.push('status');
            result.statusChanged = true;
            result.newStatus = 'Rejected by Org';
            console.log(`      🔄 Auto-updating status to "Rejected by Org" (TOU/tech block detected)`);
        }
        
        // JS Rendering flag (NEW - 2026-01-16)
        if (result.jsRenderFlag !== org.js_render_flag) {
            updates.js_render_flag = result.jsRenderFlag;
            result.fieldsUpdated.push('js_render_flag');
        }
        
        // AUTO-UPDATE STATUS: If JS rendering detected, set status to "Nominated" for human review
        // Only if not already rejected and JS flag is newly set
        // This is informational - not a rejection, just needs human attention
        if (result.jsRenderFlag && 
            !result.touFlag && 
            !result.techBlockFlag &&
            org.status === 'Live (Scraping Active)' &&
            !org.js_render_flag) {
            updates.status = 'Nominated (Pending Mission Review)';
            result.fieldsUpdated.push('status');
            result.statusChanged = true;
            result.newStatus = 'Nominated (Pending Mission Review)';
            console.log(`      🔄 Auto-updating status to "Nominated" (JS rendering detected - needs review)`);
        }
        
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
    console.log(`   JS Render Flag: ${result.jsRenderFlag ? `⚙️ YES (${result.jsRenderConfidence} confidence)` : '✅ No'}`);
    console.log(`   TOU URL: ${result.touUrl || 'Not found'}`);
    console.log(`   False Positives Filtered: ${result.falsePositivesSkipped}`);
    console.log(`   Events URL: ${result.eventsUrl || 'Not found'} ${result.eventsUrlValidated ? '✅' : '⚠️'}`);
    console.log(`   POC Email: ${result.pocInfo?.email || 'Not found'}`);
    console.log(`   AI Org Name: ${result.aiOrgName || 'N/A'}`);
    if (result.statusChanged) {
        console.log(`   🔄 Status Changed: "${result.previousStatus}" → "${result.newStatus}"`);
    }
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
    isLegalPageUrl,
    findEventsUrl,
    extractEventsUrlFromTriggeringUrl,
    validateEventsUrl,
    gatherPOC,
    analyzeWithAI,
    findRestrictions,
    
    // JavaScript Rendering Detection (NEW - 2026-01-16)
    detectJavaScriptRendering,
    
    // Context-aware detection helpers (NEW)
    checkForExcludedContext,
    checkForProhibitionPhrase,
    getContextSnippet,
    
    // Database operations
    getOrganization,
    getOrganizationByName,
    updateOrganization,
    
    // Utilities
    fetchUrl,
    extractText,
    sleep,
    getPageType,
    
    // Constants (including new context-aware ones)
    HIGH_CONFIDENCE_RESTRICTION_TERMS,
    CONTEXT_REQUIRED_TERMS,
    PROHIBITION_PHRASES,
    EXCLUDED_CONTEXTS,
    TOU_RESTRICTION_KEYWORDS,  // Legacy alias
    TOU_RESTRICTION_PHRASES,   // Legacy alias
    TOU_PATHS,
    CONTENT_PATH_PREFIXES,
    EVENTS_PATHS,
    EVENTS_PAGE_INDICATORS,
    JS_RENDER_INDICATORS,      // NEW - 2026-01-16
    MIN_CONTENT_LENGTH,        // NEW - 2026-01-16
    USER_AGENT,
    CONTEXT_WINDOW
};
