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
 * - Event content detection (catches AJAX-loaded events pages) - NEW 2026-01-16
 * - Technical block detection (403/401)
 * - Events URL discovery
 * - POC info gathering (5 categories: Legal, Events, Media/PR, Leadership, General)
 * - AI-powered org analysis
 * - Scan history logging to scan_logs collection - NEW 2026-01-25
 * - Per-page restriction quotes with 20 words context - NEW 2026-01-26
 * 
 * Usage:
 *   const scanner = require('./org-scanner');
 *   await scanner.init();
 *   const result = await scanner.scanOrganization(org);
 * 
 * Last Updated: 2026-01-31
 * - MAJOR: Consolidated contact gathering (deprecates contact-discovery.js)
 * - NEW: CONTACT_CATEGORIES - 5 categories for comprehensive POC discovery
 * - NEW: getExistingContactTypes() - Check what contacts org already has
 * - NEW: googleQueryCount tracking with reset/get functions
 * - UPDATED: gatherPOCViaGoogleSearch() - Now searches ALL 5 categories
 * - UPDATED: gatherPOC() - Smart skip logic for re-scans
 *   - First scan (0 contacts): Gather all 5 categories
 *   - Re-scan (has Legal or Events): Skip gathering
 *   - forceAggressive option: Always gather all categories
 * 
 * 2026-01-30
 * - NEW: savePocContact() saves contacts to contacts collection with new schema
 * - NEW: checkForDuplicateContact() prevents duplicate contacts
 * - NEW: detectEmailType(), calculateDataCompleteness() for new schema fields
 * - UPDATED: gatherPOC() expanded from 4 to 15 contact page paths
 * - UPDATED: extractPocFromHtml() better filtering, extracts all emails
 * - UPDATED: createScanLog() now populates poc_found and poc_email fields
 * - UPDATED: scanOrganization() saves contacts after POC gathering
 * 
 * 2026-01-26
 * - CHANGED: getContextSnippet() now captures 20 WORDS before/after (was 80 chars)
 * - NEW: pagesWithRestrictions includes quote text for each page
 * - NEW: allPagesScanned tracks all pages with their results (clear/restrictions/blocked)
 * - NEW: restriction_source_urls and restriction_context written to organizations collection
 * - NEW: legal_pages_results saved to scan_logs with full page data
 * - NEW: restriction_context format: "PageType | URL | Quote" for email generation
 * - FIX: Email generator now has access to page name, quote, and URL
 * 
 * 2026-01-25
 * - NEW: createScanLog() function writes to scan_logs collection
 * - NEW: Tracks before/after state for flag changes
 * - NEW: Auto-generates scan summary notes
 * - Scan logs appear in Admin Interface v24 Status & History tab
 * 
 * 2026-01-21
 * - EXPANDED: EXCLUDED_CONTEXTS with policy subject matter exclusions
 *   Added: Robotics policy terms (robotics policy, robot regulation, robot ethics, etc.)
 *   Added: Autonomous systems terms (autonomous weapons, drone policy, unmanned systems, etc.)
 *   Added: AI policy terms (ai governance, ai regulation, artificial intelligence policy, etc.)
 *   Added: Organizational research context (our research on, we study, our experts, etc.)
 *   Added: Publication context (this paper, this article, the author, etc.)
 * - This prevents false positives when think tanks discuss policy topics like robotics or AI
 * 
 * 2026-01-18
 * - NEW: Microsite detection (Step 1.7) - detects event microsites and finds parent org
 * - NEW: detectMicrosite() function with platform footers, hosted-by patterns
 * - NEW: findParentOrgWebsite() with known org mappings
 * - NEW: MICROSITE_INDICATORS and KNOWN_ORG_WEBSITES constants
 * - Scanner now finds parent org website when microsite detected (fixes AFCEA/intelsummit.org case)
 * - EXPANDED: TOU_PATHS now includes 40 paths (was 19)
 *   Added: /terms-use (CFR variant), /gdpr, /ccpa, /intellectual-property,
 *   /copyright, /copyright-notice, /aup, /code-of-conduct, /api-terms,
 *   /api-policy, /developer-terms, /developers/terms, /data-use-policy,
 *   /usage-policy, /website-policies, /conditions-of-use, /data-privacy,
 *   /cookie-policy, /cookies, /legal/privacy, /acceptable-use-policy
 * - SYNCED: isLegalPageUrl() patterns now match TOU_PATHS exactly
 * 
 * 2026-01-17
 * - BUGFIX: tech_block_flag and tou_flag are now independent
 *   403 errors only set tech_block_flag, NOT tou_flag
 *   tou_flag only set when actual restriction language is found
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// User agent for requests
const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: matthew_e_taylor@hotmail.com)';

// Request timeout
const TIMEOUT = 30000;

// Rate limiting
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 4000;

// Context window for checking proximity of terms (characters)
const CONTEXT_WINDOW = 150;

// Google Search quota tracking (NEW 2026-01-31)
let googleQueryCount = 0;

/**
 * CONTACT CATEGORIES (NEW 2026-01-31)
 * Each category gets ONE search. Stop after first email found per category.
 * This gives up to 5 contacts per org on first scan.
 */
const CONTACT_CATEGORIES = [
    {
        type: 'Legal/Permissions',
        contactType: 'Legal/Permissions',
        searchTerms: ['legal department email', 'legal contact', 'permissions contact', 'licensing contact'],
        emailPrefixes: ['legal', 'permissions', 'licensing', 'counsel', 'compliance']
    },
    {
        type: 'Events',
        contactType: 'Events',
        searchTerms: ['events contact email', 'events coordinator', 'events team', 'programs contact'],
        emailPrefixes: ['events', 'programs', 'conferences', 'meetings', 'registration', 'rsvp']
    },
    {
        type: 'Media/PR',
        contactType: 'Media/PR',
        searchTerms: ['media contact email', 'press contact', 'media relations', 'public relations contact'],
        emailPrefixes: ['media', 'press', 'pr', 'communications', 'comms', 'publicaffairs', 'news']
    },
    {
        type: 'Leadership',
        contactType: 'Leadership',
        searchTerms: ['executive director email', 'CEO contact', 'president contact', 'director contact'],
        emailPrefixes: ['ceo', 'director', 'president', 'executive', 'chief']
    },
    {
        type: 'General',
        contactType: 'Main Contact',
        searchTerms: ['contact email', 'info email', 'general inquiries'],
        emailPrefixes: ['info', 'contact', 'general', 'hello', 'inquiries', 'admin']
    }
];

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
    'endorse candidates',
    
    // ─────────────────────────────────────────────────────────────────────────
    // POLICY SUBJECT MATTER EXCLUSIONS (added 2026-01-21)
    // These prevent false positives when orgs discuss policy topics
    // ─────────────────────────────────────────────────────────────────────────
    
    // Robotics policy discussions
    'robotics policy',
    'robot regulation',
    'robotics regulation',
    'robot ethics',
    'robotics research',
    'robotics industry',
    'robot workforce',
    'robotics law',
    
    // Autonomous systems policy discussions
    'autonomous systems',
    'autonomous weapons',
    'autonomous vehicles',
    'drone policy',
    'drone regulation',
    'unmanned systems',
    'unmanned vehicles',
    'self-driving',
    'lethal autonomous',
    
    // AI/ML policy discussions
    'ai governance',
    'ai regulation',
    'ai policy',
    'artificial intelligence policy',
    'artificial intelligence regulation',
    'artificial intelligence governance',
    'machine learning research',
    'machine learning policy',
    'ai ethics',
    'algorithmic accountability',
    'algorithmic governance',
    
    // Organizational research context
    'our research on',
    'our work on',
    'our analysis of',
    'we study',
    'we examine',
    'we analyze',
    'our experts',
    'our scholars',
    'our fellows',
    'our researchers',
    
    // Publication/content context
    'this paper',
    'this article',
    'this report',
    'this study',
    'this brief',
    'the author',
    'the authors',
    'the researchers',
    'the study finds',
    'the report examines'
];

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY CONSTANTS (kept for backward compatibility with exports)
// ═══════════════════════════════════════════════════════════════════════════════

const TOU_RESTRICTION_KEYWORDS = HIGH_CONFIDENCE_RESTRICTION_TERMS;
const TOU_RESTRICTION_PHRASES = PROHIBITION_PHRASES;

// Common TOU page paths (40 paths - Updated 2026-01-18)
// These paths are proactively tried on every website to find restriction pages
const TOU_PATHS = [
    // ─────────────────────────────────────────────────────────────────────────
    // PRIMARY LEGAL / TERMS (10 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/terms',
    '/terms-of-use',
    '/terms-use',              // CFR variant (no "of")
    '/terms-of-service',
    '/tos',
    '/terms-and-conditions',
    '/conditions',
    '/conditions-of-use',
    '/site-terms',
    '/website-terms',
    
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVACY (7 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/privacy',
    '/privacy-policy',
    '/data-privacy',
    '/cookie-policy',
    '/cookies',
    '/gdpr',
    '/ccpa',
    
    // ─────────────────────────────────────────────────────────────────────────
    // LEGAL PAGES (8 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/legal',
    '/legal/terms',
    '/legal/privacy',
    '/legal-notice',
    '/disclaimer',
    '/copyright',
    '/copyright-notice',
    '/intellectual-property',
    
    // ─────────────────────────────────────────────────────────────────────────
    // POLICIES (5 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/policies',
    '/policies-and-procedures',
    '/site-policies',
    '/website-policies',
    '/usage-policy',
    
    // ─────────────────────────────────────────────────────────────────────────
    // USER AGREEMENT (5 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/user-agreement',
    '/acceptable-use',
    '/acceptable-use-policy',
    '/aup',
    '/code-of-conduct',
    
    // ─────────────────────────────────────────────────────────────────────────
    // API / DEVELOPER TERMS (5 paths)
    // ─────────────────────────────────────────────────────────────────────────
    '/api-terms',
    '/api-policy',
    '/developer-terms',
    '/developers/terms',
    '/data-use-policy'
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
const TECH_RENDERING_INDICATORS = {
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
 * @param {Object} options - { isEventsPage: boolean } - additional context
 * @returns {Object} { isJsRendered: boolean, confidence: string, reasons: string[], notes: string }
 * 
 * Added: 2026-01-16
 * Updated: 2026-01-16 - Added events page content detection
 */
function detectJavaScriptRendering(html, options = {}) {
    const { isEventsPage = false } = options;
    
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
    for (const pattern of TECH_RENDERING_INDICATORS.FRAMEWORK_ROOTS) {
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
    for (const attr of TECH_RENDERING_INDICATORS.FRAMEWORK_ATTRIBUTES) {
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
        for (const warning of TECH_RENDERING_INDICATORS.NOSCRIPT_WARNINGS) {
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
    for (const indicator of TECH_RENDERING_INDICATORS.LOADING_INDICATORS) {
        if (lowerHtml.includes(indicator)) {
            loadingHits++;
        }
    }
    if (loadingHits >= 2) {
        reasons.push(`Multiple loading indicators found (${loadingHits})`);
        mediumConfidenceHits++;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check 6: Events Page Content Detection (NEW - 2026-01-16)
    // If this is supposed to be an events page, check for actual event content
    // ─────────────────────────────────────────────────────────────────────────
    if (isEventsPage) {
        const eventContentIndicators = [
            // Date patterns (various formats)
            /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
            /\b\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i,
            /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
            /\b\d{4}-\d{2}-\d{2}\b/,
            // Time patterns
            /\b\d{1,2}:\d{2}\s*(am|pm|AM|PM)\b/,
            /\b\d{1,2}\s*(am|pm|AM|PM)\b/,
            // Registration/RSVP
            /register\s+(now|here|today)/i,
            /rsvp/i,
            // Event-specific phrases
            /join\s+us\s+(for|on|at)/i,
            /upcoming\s+event/i,
            /event\s+details/i,
            /save\s+the\s+date/i,
            /add\s+to\s+calendar/i
        ];
        
        let eventContentFound = 0;
        for (const pattern of eventContentIndicators) {
            if (pattern.test(textContent) || pattern.test(html)) {
                eventContentFound++;
            }
        }
        
        // If this is an events page but has very few event indicators, likely JS-loaded
        if (eventContentFound < 2) {
            reasons.push(`Events page has no actual event content (only ${eventContentFound} indicators found)`);
            highConfidenceHits++;
        }
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

// ═══════════════════════════════════════════════════════════════════════════════
// MICROSITE DETECTION (NEW - 2026-01-18)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Patterns that indicate a page is a microsite/event site, not a main org website
 * Used by detectMicrosite() to identify when we need to find the parent org's real website
 */
const MICROSITE_INDICATORS = {
    // Footer patterns indicating hosted/powered by another platform
    PLATFORM_FOOTERS: [
        'powered by eventpower',
        'powered by cvent',
        'powered by eventbrite',
        'powered by splash',
        'powered by bizzabo',
        'powered by whova',
        'powered by hopin',
        'powered by swoogo',
        'powered by regfox',
        'powered by aventri',
        'powered by certain',
        'powered by webex events',
        'powered by zoom events',
        'website powered by'
    ],
    
    // Patterns indicating the event is hosted/sponsored by another org
    // These regex patterns extract the org name(s)
    HOSTED_BY_PATTERNS: [
        /co-?hosted by\s+([A-Z][A-Za-z\s&]+(?:and|&)\s+[A-Z][A-Za-z\s&]+)/i,
        /hosted by\s+([A-Z][A-Za-z\s&,]+)/i,
        /presented by\s+([A-Z][A-Za-z\s&,]+)/i,
        /sponsored by\s+([A-Z][A-Za-z\s&,]+)/i,
        /produced by\s+([A-Z][A-Za-z\s&,]+)/i,
        /organized by\s+([A-Z][A-Za-z\s&,]+)/i,
        /brought to you by\s+([A-Z][A-Za-z\s&,]+)/i,
        /an?\s+([A-Z][A-Za-z\s&]+)\s+event/i,
        /an?\s+([A-Z][A-Za-z\s&]+)\s+conference/i,
        /an?\s+([A-Z][A-Za-z\s&]+)\s+summit/i
    ],
    
    // URL patterns that suggest microsite/event site (not main org site)
    URL_PATTERNS: [
        /^https?:\/\/(conference|summit|event|forum|symposium|congress)\./i,
        /^https?:\/\/[^/]+\.(events|conference|summit)\./i,
        /^https?:\/\/(www\.)?(20\d{2}|annual|spring|fall|winter)/i,
        /^https?:\/\/founders\./i,
        /^https?:\/\/register\./i
    ],
    
    // Page content patterns suggesting single-event focus (not full org site)
    SINGLE_EVENT_INDICATORS: [
        'save the date',
        'registration opening',
        'call for papers',
        'call for speakers',
        'call for proposals',
        'submit abstract',
        'early bird pricing',
        'early bird registration',
        'agenda coming soon',
        'speakers coming soon'
    ]
};

/**
 * Known organization name to website mappings
 * Used as primary lookup when we extract an org name from a microsite
 * Add new orgs here as we discover them
 */
const KNOWN_ORG_WEBSITES = {
    // AFCEA and related
    'afcea': 'https://www.afcea.org',
    'afcea international': 'https://www.afcea.org',
    'armed forces communications and electronics association': 'https://www.afcea.org',
    'insa': 'https://www.insaonline.org',
    'intelligence and national security alliance': 'https://www.insaonline.org',
    
    // Think tanks
    'cnas': 'https://www.cnas.org',
    'center for a new american security': 'https://www.cnas.org',
    'csis': 'https://www.csis.org',
    'center for strategic and international studies': 'https://www.csis.org',
    'brookings': 'https://www.brookings.edu',
    'brookings institution': 'https://www.brookings.edu',
    'rand': 'https://www.rand.org',
    'rand corporation': 'https://www.rand.org',
    'heritage': 'https://www.heritage.org',
    'heritage foundation': 'https://www.heritage.org',
    'cato': 'https://www.cato.org',
    'cato institute': 'https://www.cato.org',
    'aei': 'https://www.aei.org',
    'american enterprise institute': 'https://www.aei.org',
    'cfr': 'https://www.cfr.org',
    'council on foreign relations': 'https://www.cfr.org',
    'atlantic council': 'https://www.atlanticcouncil.org',
    'new america': 'https://www.newamerica.org',
    'new america foundation': 'https://www.newamerica.org',
    'aspen institute': 'https://www.aspeninstitute.org',
    'aspen': 'https://www.aspeninstitute.org',
    'wilson center': 'https://www.wilsoncenter.org',
    'woodrow wilson center': 'https://www.wilsoncenter.org',
    'carnegie endowment': 'https://carnegieendowment.org',
    'carnegie': 'https://carnegieendowment.org',
    'stimson': 'https://www.stimson.org',
    'stimson center': 'https://www.stimson.org',
    
    // International
    'iiss': 'https://www.iiss.org',
    'international institute for strategic studies': 'https://www.iiss.org',
    'rusi': 'https://www.rusi.org',
    'royal united services institute': 'https://www.rusi.org',
    
    // Defense associations
    'ndia': 'https://www.ndia.org',
    'national defense industrial association': 'https://www.ndia.org',
    'spie': 'https://www.spie.org',
    'surface navy association': 'https://www.navysna.org',
    'sna': 'https://www.navysna.org',
    'ausa': 'https://www.ausa.org',
    'association of the united states army': 'https://www.ausa.org',
    
    // Cyber/Tech
    'cyber threat alliance': 'https://www.cyberthreatalliance.org',
    'cta': 'https://www.cyberthreatalliance.org',
    'esri': 'https://www.esri.com',
    
    // Academic
    'uc berkeley': 'https://www.berkeley.edu',
    'berkeley': 'https://www.berkeley.edu',
    'mit': 'https://www.mit.edu',
    'stanford': 'https://www.stanford.edu',
    'harvard': 'https://www.harvard.edu',
    'georgetown': 'https://www.georgetown.edu'
};

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
    // Updated 2026-01-18: Synced with TOU_PATHS (40 patterns)
    const legalPatterns = [
        // ─────────────────────────────────────────────────────────────────────────
        // PRIMARY LEGAL / TERMS
        // ─────────────────────────────────────────────────────────────────────────
        /\/terms[-_]?of[-_]?use\/?$/i,
        /\/terms[-_]?use\/?$/i,            // CFR variant (no "of")
        /\/terms[-_]?of[-_]?service\/?$/i,
        /\/terms[-_]?and[-_]?conditions\/?$/i,
        /\/terms[-_]?conditions\/?$/i,
        /\/terms\/?$/i,
        /\/tos\/?$/i,
        /\/conditions[-_]?of[-_]?use\/?$/i,
        /\/conditions\/?$/i,
        /\/site[-_]?terms\/?$/i,
        /\/website[-_]?terms\/?$/i,
        
        // ─────────────────────────────────────────────────────────────────────────
        // PRIVACY
        // ─────────────────────────────────────────────────────────────────────────
        /\/privacy[-_]?policy\/?$/i,
        /\/privacy\/?$/i,
        /\/data[-_]?privacy\/?$/i,
        /\/cookie[-_]?policy\/?$/i,
        /\/cookies\/?$/i,
        /\/gdpr\/?$/i,
        /\/ccpa\/?$/i,
        
        // ─────────────────────────────────────────────────────────────────────────
        // LEGAL PAGES
        // ─────────────────────────────────────────────────────────────────────────
        /\/legal\/?$/i,
        /\/legal\/terms\/?$/i,
        /\/legal\/privacy\/?$/i,
        /\/legal[-_]?notices?\/?$/i,
        /\/disclaimer\/?$/i,
        /\/disclaimers\/?$/i,
        /\/copyright\/?$/i,
        /\/copyright[-_]?notice\/?$/i,
        /\/intellectual[-_]?property\/?$/i,
        
        // ─────────────────────────────────────────────────────────────────────────
        // POLICIES
        // ─────────────────────────────────────────────────────────────────────────
        /\/policies[-_]?and[-_]?procedures\/?$/i,
        /\/policies\/?$/i,
        /\/site[-_]?policies\/?$/i,
        /\/website[-_]?policies\/?$/i,
        /\/usage[-_]?policy\/?$/i,
        
        // ─────────────────────────────────────────────────────────────────────────
        // USER AGREEMENT
        // ─────────────────────────────────────────────────────────────────────────
        /\/user[-_]?agreement\/?$/i,
        /\/acceptable[-_]?use\/?$/i,
        /\/acceptable[-_]?use[-_]?policy\/?$/i,
        /\/aup\/?$/i,
        /\/code[-_]?of[-_]?conduct\/?$/i,
        
        // ─────────────────────────────────────────────────────────────────────────
        // API / DEVELOPER TERMS
        // ─────────────────────────────────────────────────────────────────────────
        /\/api[-_]?terms\/?$/i,
        /\/api[-_]?policy\/?$/i,
        /\/developer[-_]?terms\/?$/i,
        /\/developers\/terms\/?$/i,
        /\/data[-_]?use[-_]?policy\/?$/i
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
        // Updated 2026-01-18: Synced with TOU_PATHS (40 terms)
        const legalLastSegments = [
            // Primary Legal / Terms
            'terms', 'terms-of-use', 'terms-use', 'terms-of-service', 'tos',
            'terms-and-conditions', 'conditions', 'conditions-of-use',
            'site-terms', 'website-terms',
            // Privacy
            'privacy', 'privacy-policy', 'data-privacy',
            'cookie-policy', 'cookies', 'gdpr', 'ccpa',
            // Legal Pages
            'legal', 'legal-notice', 'disclaimer', 'disclaimers',
            'copyright', 'copyright-notice', 'intellectual-property',
            // Policies
            'policies', 'policies-and-procedures', 'site-policies',
            'website-policies', 'usage-policy',
            // User Agreement
            'user-agreement', 'acceptable-use', 'acceptable-use-policy',
            'aup', 'code-of-conduct',
            // API / Developer
            'api-terms', 'api-policy', 'developer-terms', 'data-use-policy'
        ];
        
        if (legalLastSegments.includes(lastSegment.toLowerCase())) {
            return true;
        }
        
        // Check for patterns like "brookings-institution-privacy-policy"
        // Updated 2026-01-18: Added more suffix patterns
        const lowerSegment = lastSegment.toLowerCase();
        if (lowerSegment.endsWith('-privacy-policy') ||
            lowerSegment.endsWith('-terms-of-use') ||
            lowerSegment.endsWith('-terms-of-service') ||
            lowerSegment.endsWith('-terms-and-conditions') ||
            lowerSegment.endsWith('-cookie-policy') ||
            lowerSegment.endsWith('-user-agreement') ||
            lowerSegment.endsWith('-acceptable-use') ||
            lowerSegment.endsWith('-code-of-conduct') ||
            lowerSegment.endsWith('-legal-notice') ||
            lowerSegment.endsWith('-copyright-notice')) {
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
 * Extract context snippet around a keyword - 10 words before and after
 * Updated 2026-01-26: Changed from character-based (80 chars) to word-based (10 words)
 */
function getContextSnippet(text, keywordIndex, keywordLength) {
    // Get the text before and after the keyword
    const textBefore = text.substring(0, keywordIndex);
    const textAfter = text.substring(keywordIndex + keywordLength);
    
    // Split into words
    const wordsBefore = textBefore.trim().split(/\s+/).filter(w => w.length > 0);
    const wordsAfter = textAfter.trim().split(/\s+/).filter(w => w.length > 0);
    
    // Get last 10 words before and first 10 words after
    const before10 = wordsBefore.slice(-10).join(' ');
    const after10 = wordsAfter.slice(0, 10).join(' ');
    
    // Get the keyword itself
    const keyword = text.substring(keywordIndex, keywordIndex + keywordLength);
    
    // Build the snippet
    const prefix = wordsBefore.length > 10 ? '...' : '';
    const suffix = wordsAfter.length > 10 ? '...' : '';
    
    return `${prefix}${before10} **${keyword}** ${after10}${suffix}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MICROSITE DETECTION FUNCTIONS (NEW - 2026-01-18)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect if a page is a microsite/event site rather than a main org website
 * 
 * Checks for:
 * - Platform footers ("powered by eventPower", etc.)
 * - "Hosted by" / "Co-hosted by" patterns
 * - URL patterns (conference.*, summit.*, etc.)
 * - Single-event page indicators
 * - Missing typical org website elements
 * 
 * @param {string} html - Page HTML content
 * @param {string} url - Page URL
 * @returns {Object} { isMicrosite: boolean, confidence: string, reasons: string[], parentOrgs: string[], parentOrgLinks: Object[] }
 * 
 * Added: 2026-01-18
 */
function detectMicrosite(html, url) {
    const result = {
        isMicrosite: false,
        confidence: 'none',
        reasons: [],
        parentOrgs: [],
        parentOrgLinks: [],
        parentDomainUrl: null  // NEW: Extracted from subdomain URLs
    };
    
    if (!html || !url) return result;
    
    // ─────────────────────────────────────────────────────────────────────────
    // EXEMPT: University domains (.edu) - subdomains are legitimate org units
    // e.g., cltc.berkeley.edu is a center, not a microsite
    // ─────────────────────────────────────────────────────────────────────────
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.endsWith('.edu')) {
            result.reasons.push('University domain (.edu) - exempt from microsite detection');
            return result;  // Return early, not a microsite
        }
    } catch (e) {
        // URL parsing failed, continue with detection
    }
    
    const lowerHtml = html.toLowerCase();
    let score = 0;
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check URL patterns (high confidence)
    // ─────────────────────────────────────────────────────────────────────────
    for (const pattern of MICROSITE_INDICATORS.URL_PATTERNS) {
        if (pattern.test(url)) {
            score += 3;
            result.reasons.push(`URL pattern: subdomain suggests event site`);
            break; // Only count once
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Extract parent domain from subdomain URLs (NEW - 2026-01-18)
    // e.g., conference.cnas.org → cnas.org
    // ─────────────────────────────────────────────────────────────────────────
    try {
        const urlObj = new URL(url);
        const hostParts = urlObj.hostname.split('.');
        
        // Check if it's a subdomain (more than 2 parts, or more than 3 with www)
        // e.g., conference.cnas.org = ['conference', 'cnas', 'org']
        // e.g., www.conference.cnas.org = ['www', 'conference', 'cnas', 'org']
        if (hostParts.length >= 3) {
            const subdomain = hostParts[0].toLowerCase();
            
            // Common event-related subdomains
            const eventSubdomains = ['conference', 'summit', 'event', 'events', 'forum', 
                                     'symposium', 'congress', 'register', 'registration',
                                     'annual', 'expo', 'founders', 'www'];
            
            if (eventSubdomains.includes(subdomain) || /^20\d{2}$/.test(subdomain)) {
                // Extract parent domain: conference.cnas.org → cnas.org
                const parentDomain = hostParts.slice(-2).join('.');
                result.parentDomainUrl = `https://www.${parentDomain}`;
                result.reasons.push(`Subdomain extracted: parent likely ${parentDomain}`);
            }
        }
    } catch (e) {
        // URL parsing failed, continue without subdomain extraction
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check for platform footers (high confidence)
    // ─────────────────────────────────────────────────────────────────────────
    for (const footer of MICROSITE_INDICATORS.PLATFORM_FOOTERS) {
        if (lowerHtml.includes(footer)) {
            score += 4;
            result.reasons.push(`Platform footer: "${footer}"`);
            break; // Only count once
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check for "hosted by" patterns and extract org names
    // ─────────────────────────────────────────────────────────────────────────
    for (const pattern of MICROSITE_INDICATORS.HOSTED_BY_PATTERNS) {
        const match = html.match(pattern);
        if (match) {
            score += 2;
            const matchText = match[0].length > 60 ? match[0].substring(0, 60) + '...' : match[0];
            result.reasons.push(`Hosted by pattern: "${matchText}"`);
            
            // Extract org name(s) from the capture group
            const orgText = match[1];
            if (orgText) {
                // Split on "and", "&", or "," to get individual org names
                const orgs = orgText.split(/\s+(?:and|&)\s+|,\s*/i)
                    .map(o => o.trim())
                    .filter(o => o.length > 2 && o.length < 100);
                result.parentOrgs.push(...orgs);
            }
            break; // Only count the first match
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check for single-event indicators (medium confidence)
    // ─────────────────────────────────────────────────────────────────────────
    let eventIndicatorCount = 0;
    for (const indicator of MICROSITE_INDICATORS.SINGLE_EVENT_INDICATORS) {
        if (lowerHtml.includes(indicator.toLowerCase())) {
            eventIndicatorCount++;
        }
    }
    if (eventIndicatorCount >= 3) {
        score += 2;
        result.reasons.push(`Single-event focus (${eventIndicatorCount} indicators)`);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check for absence of typical org website elements (supporting evidence)
    // ─────────────────────────────────────────────────────────────────────────
    const hasAboutPage = /href=["'][^"']*\/about/i.test(html);
    const hasCareersPage = /href=["'][^"']*\/careers/i.test(html);
    const hasNewsSection = /href=["'][^"']*\/(news|press|media)/i.test(html);
    const hasOrgHistory = /our (history|story|mission)|about us|who we are/i.test(lowerHtml);
    
    const missingElements = [];
    if (!hasAboutPage) missingElements.push('about');
    if (!hasCareersPage) missingElements.push('careers');
    if (!hasNewsSection) missingElements.push('news/press');
    if (!hasOrgHistory) missingElements.push('mission/history');
    
    if (missingElements.length >= 3) {
        score += 1;
        result.reasons.push(`Missing typical org sections: ${missingElements.join(', ')}`);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Look for links to parent org websites
    // ─────────────────────────────────────────────────────────────────────────
    try {
        const currentHost = new URL(url).hostname.toLowerCase();
        
        // Look for links with org names in the link text
        const linkPattern = /href=["']([^"']+)["'][^>]*>([^<]{3,50})</gi;
        let linkMatch;
        while ((linkMatch = linkPattern.exec(html)) !== null) {
            const linkUrl = linkMatch[1];
            const linkText = linkMatch[2].trim();
            
            // Skip if same domain or not http
            if (!linkUrl.startsWith('http')) continue;
            
            try {
                const linkHost = new URL(linkUrl).hostname.toLowerCase();
                if (linkHost === currentHost) continue;
                
                // Check if link text contains known org names
                const lowerLinkText = linkText.toLowerCase();
                for (const orgKey of Object.keys(KNOWN_ORG_WEBSITES)) {
                    if (lowerLinkText.includes(orgKey) && orgKey.length > 3) {
                        result.parentOrgLinks.push({ 
                            url: linkUrl, 
                            text: linkText,
                            matchedOrg: orgKey
                        });
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }
    } catch (e) {
        // URL parsing failed, skip link extraction
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Determine confidence level based on score
    // ─────────────────────────────────────────────────────────────────────────
    if (score >= 5) {
        result.isMicrosite = true;
        result.confidence = 'high';
    } else if (score >= 3) {
        result.isMicrosite = true;
        result.confidence = 'medium';
    } else if (score >= 1) {
        // Low score - note the indicators but don't flag as microsite
        result.isMicrosite = false;
        result.confidence = 'low';
    }
    
    // Deduplicate parent orgs
    result.parentOrgs = [...new Set(result.parentOrgs)];
    
    return result;
}

/**
 * Find the main website for a parent organization
 * 
 * Lookup methods (in order of preference):
 * 1. Known org mappings (KNOWN_ORG_WEBSITES)
 * 2. Links found on the microsite page
 * 3. Construct URL from org name and test common TLDs
 * 
 * @param {string} orgName - Organization name extracted from page
 * @param {Object[]} linksFound - Links found on the page that might lead to parent org
 * @returns {Promise<Object>} { found: boolean, url: string, method: string }
 * 
 * Added: 2026-01-18
 */
async function findParentOrgWebsite(orgName, linksFound = []) {
    // ─────────────────────────────────────────────────────────────────────────
    // Method 1: Check known org mappings (fastest, most reliable)
    // ─────────────────────────────────────────────────────────────────────────
    const normalizedName = orgName.toLowerCase().trim();
    
    // Direct lookup
    if (KNOWN_ORG_WEBSITES[normalizedName]) {
        return { 
            found: true, 
            url: KNOWN_ORG_WEBSITES[normalizedName], 
            method: 'known_mapping' 
        };
    }
    
    // Partial match lookup
    for (const [key, url] of Object.entries(KNOWN_ORG_WEBSITES)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return { found: true, url, method: 'known_mapping_partial' };
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Method 2: Check links found on the microsite page
    // ─────────────────────────────────────────────────────────────────────────
    for (const link of linksFound) {
        // Prefer links that matched a known org
        if (link.matchedOrg) {
            const knownUrl = KNOWN_ORG_WEBSITES[link.matchedOrg];
            if (knownUrl) {
                return { found: true, url: knownUrl, method: 'page_link_known' };
            }
        }
        
        // Otherwise, check if link looks like an org homepage
        try {
            const linkUrl = new URL(link.url);
            // Homepage detection: path is empty, /, or just has trailing slash
            if (linkUrl.pathname === '/' || linkUrl.pathname === '' || linkUrl.pathname === '/home') {
                return { found: true, url: link.url, method: 'page_link_homepage' };
            }
        } catch (e) {
            continue;
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Method 3: Construct URL from org name and test
    // ─────────────────────────────────────────────────────────────────────────
    // Extract likely domain from org name
    const words = orgName.split(/\s+/).filter(w => w.length > 0);
    
    // Try acronym if multi-word
    let testNames = [];
    if (words.length >= 2) {
        // Create acronym (e.g., "Armed Forces Communications" -> "afc")
        const acronym = words.map(w => w[0]).join('').toLowerCase();
        if (acronym.length >= 2 && acronym.length <= 6) {
            testNames.push(acronym);
        }
    }
    // Also try first word if it looks like an acronym or short name
    if (words[0] && words[0].length <= 10) {
        testNames.push(words[0].toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
    
    // Dedupe test names
    testNames = [...new Set(testNames)];
    
    // Try common TLDs for each test name
    const tldsToTry = ['.org', '.com'];
    
    for (const name of testNames) {
        if (name.length < 2) continue;
        
        for (const tld of tldsToTry) {
            const testUrl = `https://www.${name}${tld}`;
            
            try {
                const testResult = await fetchUrl(testUrl);
                if (testResult.success && !testResult.isBlocked) {
                    return { found: true, url: testUrl, method: 'constructed_url' };
                }
            } catch (e) {
                continue;
            }
            
            await sleep(500); // Respectful delay between tests
        }
    }
    
    return { found: false, url: null, method: null };
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
        allPagesScanned: [],    // NEW 2026-01-26: All pages with their results for UI display
        falsePositivesSkipped: 0
    };
    
    const baseUrl = website.replace(/\/$/, '');
    
    // Find ALL legal page URLs
    console.log('      🔍 Discovering legal pages...');
    const legalSearch = await findAllLegalUrls(html, baseUrl);
    
    if (legalSearch.isBlocked) {
        console.log(`      ⛔ Technical block detected at: ${legalSearch.blockedUrl}`);
        result.techBlockFlag = true;
        // Note: touFlag NOT set here - tech blocks are separate from TOU restrictions
        result.touNotes = `Technical block (403): ${legalSearch.error} at ${legalSearch.blockedUrl}. Unable to scan legal pages.`;
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
            console.log(`         ⛔ Blocked (403)`);
            result.techBlockFlag = true;
            // Note: touFlag NOT set here - tech blocks are separate from TOU restrictions
            scannedPages.push(`⛔ ${pageType}: BLOCKED (403)`);
            result.allPagesScanned.push({ url, type: pageType, result: 'blocked' });
            continue;
        }
        
        if (!pageResult.success) {
            console.log(`         ⚠️ Could not fetch`);
            scannedPages.push(`⚠️ ${pageType}: Could not fetch`);
            result.allPagesScanned.push({ url, type: pageType, result: 'error' });
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
            
            // Extract the first/best quote for this page (cleaned up)
            // Format from findRestrictions: '[HIGH_CONFIDENCE] "term": ...quote...' or '[CONTEXT_CONFIRMED] "term" + "phrase": ...quote...'
            let bestQuote = '';
            if (restrictions.context && restrictions.context.length > 0) {
                // Get the first context and extract just the quote part
                const firstContext = restrictions.context[0];
                const colonIndex = firstContext.indexOf(':');
                if (colonIndex > -1) {
                    bestQuote = firstContext.substring(colonIndex + 1).trim();
                } else {
                    bestQuote = firstContext;
                }
            }
            
            const pageData = { 
                url, 
                type: pageType, 
                result: 'restrictions',
                keywords: restrictions.foundKeywords,
                quote: bestQuote,  // The actual restriction text (20 words before/after)
                allQuotes: restrictions.context.slice(0, 3),  // Up to 3 quotes from this page
                stats: restrictions.stats
            };
            
            result.pagesWithRestrictions.push(pageData);
            result.allPagesScanned.push(pageData);
            
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
            result.allPagesScanned.push({ url, type: pageType, result: 'clear' });
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
    const result = { name: '', email: '', phone: '', allEmails: [], source: 'website' };
    
    // Find all email addresses
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatch) {
        // Filter out common false positives
        const validEmails = emailMatch.filter(e => {
            const lower = e.toLowerCase();
            return !lower.includes('example.com') &&
                   !lower.includes('email.com') &&
                   !lower.includes('domain.com') &&
                   !lower.includes('yourcompany') &&
                   !lower.includes('sentry.io') &&
                   !lower.includes('github.com') &&
                   !lower.includes('wixpress.com') &&
                   !lower.includes('schema.org') &&
                   !lower.includes('.png') &&
                   !lower.includes('.jpg') &&
                   !lower.includes('.gif') &&
                   !lower.endsWith('.js');
        });
        
        // Store all valid emails
        result.allEmails = [...new Set(validEmails)];  // Deduplicate
        
        // Prefer contact/info/events emails for primary
        const preferred = validEmails.find(e => {
            const lower = e.toLowerCase();
            return lower.includes('contact') || 
                   lower.includes('info') ||
                   lower.includes('events') || 
                   lower.includes('media') ||
                   lower.includes('press') || 
                   lower.includes('communications') ||
                   lower.includes('general');
        });
        result.email = preferred || validEmails[0];
    }
    
    // Find phone numbers
    const phoneMatch = html.match(/(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
        result.phone = phoneMatch[0];
    }
    
    return result.email || result.phone ? result : null;
}

/**
 * Search for POC info via Google Search snippets
 * NEW - 2026-01-31: Respects TOU/tech flags by not scraping sites
 * 
 * @param {string} orgName - Organization name for search
 * @param {string} domain - Organization domain for search
 * @returns {Object|null} POC info with email, name, phone, source or null
 */
/**
 * Gather POC contacts via Google Search - searches ALL 5 categories
 * UPDATED 2026-01-31: Now searches all categories, returns array of contacts
 * 
 * @param {string} orgName - Organization name
 * @param {string} domain - Organization domain (e.g., "cnas.org")
 * @param {Object} options - Options
 * @param {string[]} options.skipCategories - Category types to skip (already have)
 * @returns {Object[]} Array of POC objects found
 */
async function gatherPOCViaGoogleSearch(orgName, domain, options = {}) {
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
        console.log('      ⚠️ Google Search API not configured - skipping');
        return [];
    }
    
    const skipCategories = options.skipCategories || [];
    const foundContacts = [];
    const seenEmails = new Set();
    
    console.log('      🔍 Searching Google for contacts (up to 5 categories)...');
    
    for (const category of CONTACT_CATEGORIES) {
        // Skip if we already have this category
        if (skipCategories.includes(category.type)) {
            console.log(`      ⏭️ Skipping ${category.type} (already have one)`);
            continue;
        }
        
        // Try first search term for this category
        const searchTerm = category.searchTerms[0];
        const query = `"${orgName}" ${searchTerm}`;
        
        try {
            const url = new URL('https://www.googleapis.com/customsearch/v1');
            url.searchParams.set('key', GOOGLE_SEARCH_API_KEY);
            url.searchParams.set('cx', GOOGLE_SEARCH_ENGINE_ID);
            url.searchParams.set('q', query);
            url.searchParams.set('num', '5');
            
            googleQueryCount++;
            console.log(`      📡 Query #${googleQueryCount} [${category.type}]: "${query.substring(0, 50)}..."`);
            
            const response = await fetchModule(url.toString());
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429 || (errorData.error && errorData.error.code === 429)) {
                    console.log('      ⚠️ Google API quota exceeded - stopping search');
                    return foundContacts;
                }
                continue;
            }
            
            const data = await response.json();
            const items = data.items || [];
            
            // Extract contact info from snippets
            let foundForCategory = false;
            
            for (const item of items) {
                if (foundForCategory) break;
                
                const snippet = (item.snippet || '') + ' ' + (item.title || '');
                
                // Find all emails in snippet
                const emailMatches = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
                
                for (const email of emailMatches) {
                    const emailLower = email.toLowerCase();
                    
                    // Skip obvious false positives
                    if (emailLower.includes('example.com') || 
                        emailLower.includes('domain.com') ||
                        emailLower.includes('email.com') ||
                        emailLower.includes('yourcompany') ||
                        seenEmails.has(emailLower)) {
                        continue;
                    }
                    
                    // Prefer emails matching category prefixes
                    const matchesPrefix = category.emailPrefixes.some(prefix => 
                        emailLower.startsWith(prefix)
                    );
                    
                    // Accept if matches prefix OR if we haven't found anything for this category
                    if (matchesPrefix || !foundForCategory) {
                        seenEmails.add(emailLower);
                        
                        // Try to find name near email
                        let name = '';
                        const namePatterns = [
                            /(?:contact|email|reach)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                            /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+at\s+|\s*[,\-]\s*)/,
                            /([A-Z][a-z]+\s+[A-Z][a-z]+),?\s+(?:Director|Manager|Coordinator|Chief|VP|President)/i
                        ];
                        for (const pattern of namePatterns) {
                            const nameMatch = snippet.match(pattern);
                            if (nameMatch) {
                                name = nameMatch[1].trim();
                                break;
                            }
                        }
                        
                        // Try to find phone
                        let phone = '';
                        const phoneMatch = snippet.match(/(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
                        if (phoneMatch) {
                            phone = phoneMatch[0];
                        }
                        
                        const contact = {
                            email: email,
                            name: name,
                            phone: phone,
                            source: 'google_search',
                            contactType: category.contactType,
                            categoryType: category.type
                        };
                        
                        foundContacts.push(contact);
                        foundForCategory = true;
                        
                        console.log(`      ✅ Found ${category.type}: ${email}`);
                        break;
                    }
                }
            }
            
            if (!foundForCategory) {
                console.log(`      ℹ️ No ${category.type} contact found`);
            }
            
            await sleep(1000);  // Rate limit between queries
            
        } catch (error) {
            console.log(`      ⚠️ Search error: ${error.message}`);
        }
    }
    
    console.log(`      📊 Found ${foundContacts.length} contacts via Google Search`);
    return foundContacts;
}

/**
 * Find contact page and extract POC info via direct fetch
 * UPDATED 2026-01-31: Renamed from gatherPOC, only used when no flags
 */
async function gatherPOCDirectFetch(html, baseUrl) {
    // First try to extract from provided HTML (homepage)
    let poc = extractPocFromHtml(html || '');
    
    if (poc && poc.email) {
        console.log(`      ✅ Found POC on homepage: ${poc.email}`);
        poc.source = 'homepage';
        return poc;
    }
    
    // Expanded contact page paths (was 4, now 15)
    const contactPatterns = [
        '/contact',
        '/contact-us',
        '/contactus',
        '/about/contact',
        '/about-us/contact',
        '/about',
        '/about-us',
        '/connect',
        '/reach-us',
        '/get-in-touch',
        '/staff',
        '/team',
        '/people',
        '/leadership',
        '/our-team'
    ];
    
    for (const path of contactPatterns) {
        const contactUrl = baseUrl.replace(/\/$/, '') + path;
        const result = await fetchUrl(contactUrl);
        
        if (result.success) {
            poc = extractPocFromHtml(result.body);
            if (poc && poc.email) {
                console.log(`      ✅ Found POC on ${path}: ${poc.email}`);
                poc.source = `website:${path}`;
                return poc;
            }
        }
        
        await sleep(500);  // Reduced from 1000ms to speed up scanning
    }
    
    return null;
}

/**
 * Smart POC gathering with skip logic for re-scans
 * UPDATED 2026-01-31: 
 * - First scan (0 contacts): Gather all 5 categories
 * - Re-scan (has Legal or Events): Skip gathering
 * - forceAggressive: Always gather all categories
 * 
 * @param {string} html - Homepage HTML (for direct fetch)
 * @param {string} baseUrl - Organization website URL
 * @param {Object} options - Options
 * @param {boolean} options.touFlag - TOU restrictions detected
 * @param {boolean} options.techBlockFlag - Technical block (403/401)
 * @param {boolean} options.techRenderingFlag - JS rendering detected
 * @param {string} options.orgName - Organization name for Google search
 * @param {string} options.orgId - Organization ID (for checking existing contacts)
 * @param {boolean} options.forceAggressive - Force full search regardless of existing contacts
 * @returns {Object} { contacts: [], skipped: boolean, reason: string }
 */
async function gatherPOC(html, baseUrl, options = {}) {
    console.log('   👤 Gathering POC info...');
    
    const { 
        touFlag, 
        techBlockFlag, 
        techRenderingFlag, 
        orgName, 
        orgId,
        forceAggressive = false 
    } = options;
    
    const hasRestrictions = touFlag || techBlockFlag || techRenderingFlag;
    
    // Extract domain from URL
    let domain = '';
    try {
        domain = new URL(baseUrl).hostname.replace(/^www\./, '');
    } catch (e) {
        domain = baseUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Check existing contacts (skip logic for re-scans)
    // ─────────────────────────────────────────────────────────────────────────
    
    let existingContacts = { totalCount: 0, hasLegal: false, hasEvents: false };
    let skipCategories = [];
    
    if (orgId && !forceAggressive) {
        existingContacts = await getExistingContactTypes(orgId);
        
        console.log(`      📋 Existing contacts: ${existingContacts.totalCount}`);
        
        // Skip gathering if we already have the key contact types
        if (existingContacts.hasLegal || existingContacts.hasEvents) {
            console.log(`      ⏭️ Skipping contact gathering - already have ${existingContacts.hasLegal ? 'Legal' : ''}${existingContacts.hasLegal && existingContacts.hasEvents ? ' and ' : ''}${existingContacts.hasEvents ? 'Events' : ''} contact`);
            return {
                contacts: [],
                skipped: true,
                reason: `Already has ${existingContacts.hasLegal ? 'Legal' : ''}${existingContacts.hasLegal && existingContacts.hasEvents ? '/' : ''}${existingContacts.hasEvents ? 'Events' : ''} contact`,
                existingCount: existingContacts.totalCount
            };
        }
        
        // Build list of categories to skip (already have)
        if (existingContacts.hasLegal) skipCategories.push('Legal/Permissions');
        if (existingContacts.hasEvents) skipCategories.push('Events');
        if (existingContacts.hasMediaPR) skipCategories.push('Media/PR');
        if (existingContacts.hasLeadership) skipCategories.push('Leadership');
        if (existingContacts.hasGeneral) skipCategories.push('General');
        
        if (skipCategories.length > 0) {
            console.log(`      ℹ️ Will skip categories: ${skipCategories.join(', ')}`);
        }
    } else if (forceAggressive) {
        console.log('      🔥 Force aggressive mode - searching all categories');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Gather contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    let allContacts = [];
    
    if (hasRestrictions) {
        // Use Google Search - respect their restrictions
        const reason = techBlockFlag ? 'tech block' : touFlag ? 'TOU restrictions' : 'JS rendering';
        console.log(`      ℹ️ Site has ${reason} - using Google Search instead of scraping`);
        
        allContacts = await gatherPOCViaGoogleSearch(orgName || domain, domain, { skipCategories });
        
    } else {
        // No restrictions - try direct fetch first, then Google fallback
        console.log('      ℹ️ No restrictions - trying direct fetch first');
        
        const directPoc = await gatherPOCDirectFetch(html, baseUrl);
        
        if (directPoc && directPoc.email) {
            // Got one via direct fetch, add it
            allContacts.push({
                email: directPoc.email,
                name: directPoc.name || '',
                phone: directPoc.phone || '',
                source: directPoc.source || 'website',
                contactType: mapEmailTypeToContactType(detectEmailType(directPoc.email)),
                categoryType: detectEmailType(directPoc.email)
            });
            console.log(`      ✅ Found via direct fetch: ${directPoc.email}`);
            
            // Update skipCategories based on what we found
            const foundType = detectEmailType(directPoc.email);
            if (foundType === 'Legal') skipCategories.push('Legal/Permissions');
            if (foundType === 'Events') skipCategories.push('Events');
            if (foundType === 'Media/PR') skipCategories.push('Media/PR');
            if (foundType === 'General') skipCategories.push('General');
        }
        
        // If we don't have all key types yet, try Google Search
        const needsMoreContacts = !skipCategories.includes('Legal/Permissions') || 
                                   !skipCategories.includes('Events');
        
        if (needsMoreContacts && GOOGLE_SEARCH_API_KEY) {
            console.log('      ℹ️ Searching Google for additional contact types...');
            const googleContacts = await gatherPOCViaGoogleSearch(orgName || domain, domain, { skipCategories });
            allContacts.push(...googleContacts);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Return results
    // ─────────────────────────────────────────────────────────────────────────
    
    if (allContacts.length === 0) {
        console.log('      ℹ️ No POC contacts found');
    } else {
        console.log(`      📊 Total contacts found: ${allContacts.length}`);
    }
    
    return {
        contacts: allContacts,
        skipped: false,
        reason: null,
        existingCount: existingContacts.totalCount
    };
}

/**
 * Get existing contact types for an organization
 * NEW - 2026-01-31: Used to determine if we should skip contact gathering on re-scans
 * 
 * @param {string} orgId - Organization ID
 * @returns {Object} { hasLegal, hasEvents, hasMediaPR, hasLeadership, hasGeneral, totalCount, types[] }
 */
async function getExistingContactTypes(orgId) {
    await authenticate();
    
    const result = {
        hasLegal: false,
        hasEvents: false,
        hasMediaPR: false,
        hasLeadership: false,
        hasGeneral: false,
        totalCount: 0,
        types: []
    };
    
    try {
        const filter = encodeURIComponent(`organization = "${orgId}"`);
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}&perPage=100`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (!response.ok) {
            return result;
        }
        
        const data = await response.json();
        const contacts = data.items || [];
        
        result.totalCount = contacts.length;
        
        for (const contact of contacts) {
            const type = contact.contact_type || '';
            result.types.push(type);
            
            if (type === 'Legal/Permissions') result.hasLegal = true;
            if (type === 'Events') result.hasEvents = true;
            if (type === 'Media/PR') result.hasMediaPR = true;
            if (type === 'Leadership') result.hasLeadership = true;
            if (type === 'Main Contact' || type === 'Other') result.hasGeneral = true;
        }
        
    } catch (error) {
        console.log(`      ⚠️ Error checking existing contacts: ${error.message}`);
    }
    
    return result;
}

/**
 * Reset Google query count (call at start of scan batch)
 * NEW - 2026-01-31
 */
function resetGoogleQueryCount() {
    googleQueryCount = 0;
}

/**
 * Get current Google query count
 * NEW - 2026-01-31
 */
function getGoogleQueryCount() {
    return googleQueryCount;
}

/**
 * Save POC contact to the contacts collection
 * NEW - 2026-01-30: Saves contacts with new schema fields
 * 
 * @param {string} orgId - Organization ID
 * @param {Object} pocInfo - POC info object with email, name, phone, source
 * @param {string} scanSource - Source of the scan (e.g., 'org-scanner.js')
 * @returns {Object|null} Created or updated contact record, or null on error/duplicate
 */
async function savePocContact(orgId, pocInfo, scanSource = 'org-scanner.js') {
    if (!pocInfo || !pocInfo.email) {
        return null;
    }
    
    await authenticate();
    
    const emailNormalized = pocInfo.email.toLowerCase().trim();
    
    // Check for duplicate
    const existingContact = await checkForDuplicateContact(orgId, emailNormalized);
    
    if (existingContact) {
        console.log(`      ℹ️ Contact already exists: ${pocInfo.email}`);
        
        // Update last_verified and any missing fields
        const updates = {
            last_verified: new Date().toISOString()
        };
        
        // Add name if we have it and existing doesn't
        if (pocInfo.name && (!existingContact.name || existingContact.name === 'General Contact' || existingContact.name === '')) {
            updates.name = pocInfo.name;
        }
        
        // Add phone if we have it and existing doesn't
        if (pocInfo.phone && !existingContact.phone) {
            updates.phone = pocInfo.phone;
            // Also add to phones array
            const existingPhones = existingContact.phones || [];
            updates.phones = [...existingPhones, {
                number: pocInfo.phone,
                type: 'Main',
                primary: existingPhones.length === 0
            }];
        }
        
        // Recalculate completeness
        const mergedContact = { ...existingContact, ...updates };
        updates.data_completeness = calculateDataCompleteness(mergedContact);
        
        try {
            const response = await fetchModule(
                `${POCKETBASE_URL}/api/collections/contacts/records/${existingContact.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify(updates)
                }
            );
            
            if (response.ok) {
                console.log(`      🔄 Contact updated: ${pocInfo.email}`);
                return await response.json();
            }
        } catch (error) {
            console.log(`      ⚠️ Failed to update contact: ${error.message}`);
        }
        
        return existingContact;
    }
    
    // Create new contact
    const emailType = detectEmailType(pocInfo.email);
    const contactType = mapEmailTypeToContactType(emailType);
    
    const contactRecord = {
        // Original fields
        name: pocInfo.name || '',
        email: pocInfo.email,
        phone: pocInfo.phone || '',
        organization: orgId,
        contact_type: contactType,
        source: pocInfo.source || 'website',
        notes: `Auto-discovered by ${scanSource}`,
        last_verified: new Date().toISOString(),
        
        // New schema fields
        emails: [{
            address: pocInfo.email,
            type: emailType,
            primary: true
        }],
        phones: pocInfo.phone ? [{
            number: pocInfo.phone,
            type: 'Main',
            primary: true
        }] : [],
        email_normalized: emailNormalized,
        data_completeness: calculateDataCompleteness({
            name: pocInfo.name,
            email: pocInfo.email,
            phone: pocInfo.phone
        }),
        is_active: true
    };
    
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(contactRecord)
            }
        );
        
        if (response.ok) {
            const created = await response.json();
            console.log(`      💾 Contact saved: ${pocInfo.email}`);
            return created;
        } else {
            const errorData = await response.json();
            console.log(`      ⚠️ Failed to save contact: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.log(`      ⚠️ Failed to save contact: ${error.message}`);
    }
    
    return null;
}

/**
 * Check if a contact already exists for this org with this email
 * NEW - 2026-01-30
 * 
 * @param {string} orgId - Organization ID
 * @param {string} emailNormalized - Lowercase email address
 * @returns {Object|null} Existing contact record or null
 */
async function checkForDuplicateContact(orgId, emailNormalized) {
    try {
        // Search by email_normalized first (new field)
        let filter = encodeURIComponent(`organization = "${orgId}" && email_normalized = "${emailNormalized}"`);
        let response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
        
        // Fall back to case-insensitive email search (for records not yet migrated)
        filter = encodeURIComponent(`organization = "${orgId}" && email ~ "${emailNormalized}"`);
        response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0];
            }
        }
    } catch (error) {
        console.log(`      ⚠️ Duplicate check failed: ${error.message}`);
    }
    
    return null;
}

/**
 * Detect email type based on email address prefix
 * NEW - 2026-01-30
 * 
 * @param {string} email - Email address
 * @returns {string} Email type (Legal, Events, Media/PR, General, Personal)
 */
function detectEmailType(email) {
    const lower = email.toLowerCase();
    
    if (lower.startsWith('legal') || lower.startsWith('permissions') || 
        lower.startsWith('licensing') || lower.startsWith('counsel') ||
        lower.startsWith('compliance')) {
        return 'Legal';
    }
    
    if (lower.startsWith('events') || lower.startsWith('programs') || 
        lower.startsWith('conference') || lower.startsWith('meetings') ||
        lower.startsWith('registration') || lower.startsWith('rsvp')) {
        return 'Events';
    }
    
    if (lower.startsWith('media') || lower.startsWith('press') || 
        lower.startsWith('pr@') || lower.startsWith('communications') ||
        lower.startsWith('comms') || lower.startsWith('publicaffairs') ||
        lower.startsWith('news')) {
        return 'Media/PR';
    }
    
    if (lower.startsWith('info') || lower.startsWith('contact') || 
        lower.startsWith('general') || lower.startsWith('hello') ||
        lower.startsWith('inquiries') || lower.startsWith('admin')) {
        return 'General';
    }
    
    // If it looks like a person's email (firstname, firstname.lastname, etc.)
    if (/^[a-z]+(\.[a-z]+)?@/.test(lower)) {
        return 'Personal';
    }
    
    return 'General';
}

/**
 * Map email type to contact_type field values
 * NEW - 2026-01-30
 * 
 * @param {string} emailType - Email type from detectEmailType()
 * @returns {string} Contact type for contact_type field
 */
function mapEmailTypeToContactType(emailType) {
    const mapping = {
        'Legal': 'Legal/Permissions',
        'Events': 'Events',
        'Media/PR': 'Media/PR',
        'General': 'Main Contact',
        'Personal': 'Other'
    };
    return mapping[emailType] || 'Other';
}

/**
 * Calculate data completeness level for a contact
 * NEW - 2026-01-30
 * 
 * @param {Object} contact - Contact object with name, email, phone
 * @returns {string} Completeness level: complete, partial, email_only, name_only
 */
function calculateDataCompleteness(contact) {
    const hasName = contact.name && 
                    contact.name.trim() !== '' && 
                    contact.name !== 'General Contact';
    const hasEmail = contact.email && contact.email.trim() !== '';
    const hasPhone = contact.phone && contact.phone.trim() !== '';
    
    if (hasName && hasEmail && hasPhone) {
        return 'complete';
    }
    if (hasName && hasEmail) {
        return 'partial';  // Name + email but no phone
    }
    if (hasEmail && !hasName) {
        return 'email_only';
    }
    if (hasName && !hasEmail) {
        return 'name_only';
    }
    return 'partial';
}

/**
 * Extract domain from email address
 * NEW - 2026-01-30
 * "jsmith@brookings.edu" → "brookings.edu"
 * 
 * @param {string} email - Email address
 * @returns {string|null} Domain or null if invalid
 */
function extractDomainFromEmail(email) {
    if (!email || !email.includes('@')) return null;
    return email.split('@')[1]?.toLowerCase().trim() || null;
}

/**
 * Extract domain from website URL
 * NEW - 2026-01-30
 * "https://www.brookings.edu/events" → "brookings.edu"
 * 
 * @param {string} website - Website URL
 * @returns {string|null} Domain or null if invalid
 */
function extractDomainFromWebsite(website) {
    if (!website) return null;
    try {
        return website.toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('/')[0]
            .split('?')[0] || null;
    } catch (e) {
        return null;
    }
}

/**
 * Extract core domain for matching
 * NEW - 2026-01-30
 * "brookings.edu" → "brookings"
 * 
 * @param {string} domain - Full domain
 * @returns {string|null} Core domain name
 */
function extractCoreDomain(domain) {
    if (!domain) return null;
    const parts = domain.split('.');
    if (parts.length >= 2) {
        if (parts[parts.length - 2] === 'co' || parts[parts.length - 2] === 'org') {
            return parts.slice(0, -2).join('.') || parts[0];
        }
        return parts.slice(0, -1).join('.') || parts[0];
    }
    return domain;
}

/**
 * Match email domain to an organization
 * NEW - 2026-01-30
 * 
 * @param {string} emailDomain - Domain from email
 * @param {Array} organizations - Array of org records with website field
 * @returns {Object|null} { org, matchType, confidence } or null
 */
function matchDomainToOrg(emailDomain, organizations) {
    if (!emailDomain) return null;
    const emailCore = extractCoreDomain(emailDomain);
    if (!emailCore) return null;
    
    for (const org of organizations) {
        const orgDomain = extractDomainFromWebsite(org.website);
        if (orgDomain === emailDomain) {
            return { org, matchType: 'exact', confidence: 'high' };
        }
    }
    
    for (const org of organizations) {
        const orgDomain = extractDomainFromWebsite(org.website);
        const orgCore = extractCoreDomain(orgDomain);
        if (orgCore && emailCore === orgCore) {
            return { org, matchType: 'core', confidence: 'high' };
        }
    }
    
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

/**
 * Create a scan log entry in the scan_logs collection
 * NEW - 2026-01-25: Tracks scan history for audit trail and change detection
 * 
 * @param {Object} org - Original organization record (before updates)
 * @param {Object} result - Scan result object
 * @param {Object} options - Scan options (scanType, etc.)
 * @returns {Object|null} Created scan log record or null on error
 */
async function createScanLog(org, result, options = {}) {
    await authenticate();
    
    const scanType = options.scanType || 'manual';
    
    // Determine if any flags changed
    const flagsChanged = [];
    if (result.touFlag !== org.tou_flag) {
        flagsChanged.push(result.touFlag ? 'tou_flag: OFF→ON' : 'tou_flag: ON→OFF');
    }
    if (result.techBlockFlag !== org.tech_block_flag) {
        flagsChanged.push(result.techBlockFlag ? 'tech_block_flag: OFF→ON' : 'tech_block_flag: ON→OFF');
    }
    if (result.techRenderingFlag !== org.tech_rendering_flag) {
        flagsChanged.push(result.techRenderingFlag ? 'tech_rendering_flag: OFF→ON' : 'tech_rendering_flag: ON→OFF');
    }
    
    // Build scan log entry
    const logEntry = {
        organization: org.id,
        scan_date: new Date().toISOString(),
        scan_type: scanType,
        
        // Results
        tou_flag: result.touFlag || false,
        tech_block_flag: result.techBlockFlag || false,
        tech_rendering_flag: result.techRenderingFlag || false,
        
        // Details
        tou_url: result.touUrl || '',
        restriction_source_urls: result.restrictionSourceUrls || '',
        restriction_context: result.restrictionContext || '',
        events_url_found: result.eventsUrl || '',
        pages_checked: result.pagesChecked || 0,
        false_positives_skipped: result.falsePositivesSkipped || 0,
        
        // NEW 2026-01-26: Structured per-page scan results for UI display
        // Each item: {url, type, result, quote?, keywords?}
        legal_pages_results: result.allPagesScanned || [],
        
        // Status tracking
        status_before: org.status || '',
        status_after: result.newStatus || org.status || '',
        flags_changed: flagsChanged.join(', '),
        
        // Scan metadata
        scan_duration_ms: result.scanDurationMs || 0,
        scan_success: result.success !== false,
        scan_error: result.error || '',
        
        // Notes (auto-generated summary)
        notes: generateScanSummary(result, flagsChanged),
        
        // POC fields - NEW 2026-01-30
        poc_found: !!(result.pocInfo && result.pocInfo.email),
        poc_email: result.pocInfo?.email || ''
    };
    
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/scan_logs/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(logEntry)
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('⚠️ Could not create scan log:', errorData);
            return null;
        }
        
        const created = await response.json();
        console.log(`   📋 Scan log created: ${created.id}`);
        return created;
        
    } catch (error) {
        console.error('⚠️ Could not create scan log:', error.message);
        return null;
    }
}

/**
 * Generate a human-readable summary for the scan log
 */
function generateScanSummary(result, flagsChanged) {
    const parts = [];
    
    if (result.touFlag) {
        parts.push('⚠️ TOU restriction found');
    }
    if (result.techBlockFlag) {
        parts.push('⛔ Technical block (403)');
    }
    if (result.techRenderingFlag) {
        parts.push('⚙️ JS rendering required');
    }
    if (!result.touFlag && !result.techBlockFlag && !result.techRenderingFlag) {
        parts.push('✅ Clean scan - no restrictions');
    }
    
    if (flagsChanged.length > 0) {
        parts.push(`Changes: ${flagsChanged.join(', ')}`);
    }
    
    if (result.eventsUrl && !result.previousEventsUrl) {
        parts.push(`Events URL discovered: ${result.eventsUrl}`);
    }
    
    return parts.join('. ');
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
        techRenderingFlag: false,
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
        
        result.techRenderingFlag = jsResult.isJsRendered;
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
    // Step 1.7: Microsite Detection (NEW - 2026-01-18)
    // ───────────────────────────────────────────────────────────────────────
    // Detect if the website is a microsite/event site and find the parent org's
    // main website for TOU scanning. Fixes cases like intelsummit.org -> afcea.org
    
    let touScanUrl = baseUrl;  // Default to the URL in database
    let touScanHtml = result.homepageHtml;  // Default to fetched homepage
    let micrositeDetected = false;
    let parentOrgUrl = null;
    
    if (result.homepageFetched && result.homepageHtml) {
        console.log('   🔍 Checking if site is a microsite...');
        const micrositeResult = detectMicrosite(result.homepageHtml, baseUrl);
        
        if (micrositeResult.isMicrosite) {
            micrositeDetected = true;
            result.micrositeDetected = true;
            result.micrositeUrl = baseUrl;
            result.micrositeConfidence = micrositeResult.confidence;
            
            console.log(`      ⚠️ Microsite detected (${micrositeResult.confidence} confidence)`);
            if (micrositeResult.reasons.length > 0) {
                console.log(`      📋 Reasons: ${micrositeResult.reasons.slice(0, 2).join('; ')}`);
            }
            
            if (micrositeResult.parentOrgs.length > 0) {
                console.log(`      🏢 Parent org(s) identified: ${micrositeResult.parentOrgs.join(', ')}`);
                
                // Try to find the parent org's main website
                for (const parentOrg of micrositeResult.parentOrgs) {
                    console.log(`      🔍 Looking up ${parentOrg}'s website...`);
                    const parentResult = await findParentOrgWebsite(
                        parentOrg, 
                        micrositeResult.parentOrgLinks
                    );
                    
                    if (parentResult.found) {
                        parentOrgUrl = parentResult.url;
                        touScanUrl = parentResult.url;
                        
                        console.log(`      ✅ Found: ${parentResult.url} (via ${parentResult.method})`);
                        
                        // Store in result for database update
                        result.parentOrgWebsite = parentResult.url;
                        result.parentOrgMethod = parentResult.method;
                        
                        // Fetch parent org homepage for TOU scanning
                        console.log(`      📡 Fetching parent org homepage for TOU scan...`);
                        const parentHomepage = await fetchUrl(parentResult.url);
                        if (parentHomepage.success) {
                            touScanHtml = parentHomepage.body;
                            console.log(`      ✅ Parent org homepage fetched (${parentHomepage.body.length} bytes)`);
                        } else {
                            console.log(`      ⚠️ Could not fetch parent org homepage, will scan microsite`);
                            touScanUrl = baseUrl;
                            touScanHtml = result.homepageHtml;
                        }
                        
                        await sleep(1000);
                        break;  // Use first parent org found
                    } else {
                        console.log(`      ⚠️ Could not find website for ${parentOrg}`);
                    }
                }
                
                if (!parentOrgUrl) {
                    console.log(`      ⚠️ No parent org website found - will scan microsite`);
                    result.micrositeNotes = `Microsite detected (${micrositeResult.confidence}) but parent org website not found. ` +
                        `Parent orgs identified: ${micrositeResult.parentOrgs.join(', ')}. ` +
                        `Scanning microsite for TOU.`;
                }
            } else {
                // ─────────────────────────────────────────────────────────────────
                // FALLBACK: No parent org name found - try subdomain extraction
                // and org name lookup (NEW - 2026-01-18)
                // ─────────────────────────────────────────────────────────────────
                console.log(`      ⚠️ No parent org name in page content`);
                
                // Fallback 1: Try parentDomainUrl extracted from subdomain
                if (micrositeResult.parentDomainUrl) {
                    console.log(`      🔍 Trying parent domain from URL: ${micrositeResult.parentDomainUrl}`);
                    const parentHomepage = await fetchUrl(micrositeResult.parentDomainUrl);
                    
                    if (parentHomepage.success && !parentHomepage.isBlocked) {
                        parentOrgUrl = micrositeResult.parentDomainUrl;
                        touScanUrl = micrositeResult.parentDomainUrl;
                        touScanHtml = parentHomepage.body;
                        
                        console.log(`      ✅ Parent domain accessible (${parentHomepage.body.length} bytes)`);
                        
                        result.parentOrgWebsite = micrositeResult.parentDomainUrl;
                        result.parentOrgMethod = 'subdomain_extraction';
                        
                        await sleep(1000);
                    } else {
                        console.log(`      ⚠️ Parent domain not accessible`);
                    }
                }
                
                // Fallback 2: Try looking up org name from database in KNOWN_ORG_WEBSITES
                if (!parentOrgUrl && org.name) {
                    console.log(`      🔍 Trying org name lookup: "${org.name}"`);
                    const orgNameResult = await findParentOrgWebsite(org.name, []);
                    
                    if (orgNameResult.found) {
                        console.log(`      🔍 Found mapping, fetching: ${orgNameResult.url}`);
                        const parentHomepage = await fetchUrl(orgNameResult.url);
                        
                        if (parentHomepage.success && !parentHomepage.isBlocked) {
                            parentOrgUrl = orgNameResult.url;
                            touScanUrl = orgNameResult.url;
                            touScanHtml = parentHomepage.body;
                            
                            console.log(`      ✅ Parent org homepage fetched (${parentHomepage.body.length} bytes)`);
                            
                            result.parentOrgWebsite = orgNameResult.url;
                            result.parentOrgMethod = orgNameResult.method + '_from_db_name';
                            
                            await sleep(1000);
                        }
                    }
                }
                
                if (!parentOrgUrl) {
                    result.micrositeNotes = `Microsite detected (${micrositeResult.confidence}) but no parent org found. ` +
                        `Reasons: ${micrositeResult.reasons.join('; ')}. Scanning microsite for TOU.`;
                }
            }
            
            // Build complete microsite notes
            if (parentOrgUrl) {
                result.micrositeNotes = `Microsite detected (${micrositeResult.confidence}). ` +
                    `Parent org: ${micrositeResult.parentOrgs.join(', ')}. ` +
                    `Parent website: ${parentOrgUrl} (found via ${result.parentOrgMethod}). ` +
                    `TOU scanned on parent org site.`;
            }
        } else {
            console.log('      ✅ Main organization website (not a microsite)');
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 2: TOU Scan
    // ───────────────────────────────────────────────────────────────────────
    // If microsite was detected and parent org found, scans parent org's site
    // Otherwise scans the original URL
    
    if (!skipTOU && !result.techBlockFlag) {
        if (micrositeDetected && parentOrgUrl) {
            console.log(`   📜 Scanning PARENT ORG for TOU: ${touScanUrl}`);
        }
        
        const touResult = await scanTOU(touScanUrl, touScanHtml);
        result.touUrl = touResult.touUrl;
        result.touFlag = touResult.touFlag;
        result.techBlockFlag = result.techBlockFlag || touResult.techBlockFlag;
        result.foundKeywords = touResult.foundKeywords;
        result.falsePositivesSkipped = touResult.falsePositivesSkipped || 0;
        
        // NEW 2026-01-26: Populate restriction data for organizations collection and scan_logs
        // pagesWithRestrictions contains: {url, type, keywords, quote, allQuotes, stats}
        result.pagesWithRestrictions = touResult.pagesWithRestrictions || [];
        result.allPagesScanned = touResult.allPagesScanned || [];
        
        // Build restriction_source_urls (newline-separated URLs where restrictions found)
        result.restrictionSourceUrls = result.pagesWithRestrictions
            .map(p => p.url)
            .join('\n');
        
        // Build restriction_context (structured format: TYPE | URL | QUOTE)
        // This format keeps all three pieces together for email generation
        result.restrictionContext = result.pagesWithRestrictions
            .map(p => `${p.type} | ${p.url} | ${p.quote}`)
            .join('\n');
        
        // Append microsite notes to TOU notes
        if (result.micrositeNotes) {
            result.touNotes = (touResult.touNotes || '') + ' | MICROSITE INFO: ' + result.micrositeNotes;
        } else {
            result.touNotes = touResult.touNotes;
        }
        
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
    // Step 3.5: Events Page Tech Renderinging Check (NEW - 2026-01-16)
    // ───────────────────────────────────────────────────────────────────────
    // Some sites have SSR homepages but JS-rendered events pages (e.g., New America)
    // Check the events page separately if homepage didn't trigger JS detection
    
    if (!result.techRenderingFlag && result.eventsUrl && !result.techBlockFlag) {
        console.log('   🔍 Checking events page for JavaScript rendering...');
        
        const eventsPageResult = await fetchUrl(result.eventsUrl);
        
        if (eventsPageResult.success && eventsPageResult.body) {
            // Pass isEventsPage: true to enable event content detection
            const eventsJsResult = detectJavaScriptRendering(eventsPageResult.body, { isEventsPage: true });
            
            if (eventsJsResult.isJsRendered) {
                result.techRenderingFlag = true;
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
            console.log(`      ⚠️ Could not fetch events page to check Tech rendering`);
        }
        
        await sleep(1500);
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 4: POC Gathering and Contact Saving
    // UPDATED 2026-01-31: Now gathers up to 5 contact categories
    // ───────────────────────────────────────────────────────────────────────
    
    // Gather POC even if flags are present - gatherPOC will use Google Search
    if (result.homepageFetched || result.techBlockFlag || result.touFlag || result.techRenderingFlag) {
        const pocResult = await gatherPOC(result.homepageHtml, baseUrl, {
            touFlag: result.touFlag,
            techBlockFlag: result.techBlockFlag,
            techRenderingFlag: result.techRenderingFlag,
            orgName: org.name || org.source_id,
            orgId: org.id,
            forceAggressive: options.forceAggressive || false
        });
        
        // Store results
        result.pocInfo = pocResult;
        result.pocSkipped = pocResult.skipped;
        result.pocContacts = pocResult.contacts || [];
        
        // Save all found contacts to database
        if (pocResult.contacts && pocResult.contacts.length > 0 && org.id) {
            console.log(`   💾 Saving ${pocResult.contacts.length} contacts...`);
            result.contactsSaved = [];
            
            for (const contact of pocResult.contacts) {
                const saved = await savePocContact(org.id, {
                    email: contact.email,
                    name: contact.name,
                    phone: contact.phone,
                    source: contact.source
                }, 'org-scanner.js');
                
                if (saved) {
                    result.contactsSaved.push(saved);
                }
            }
            
            // For backward compatibility, set pocEmail to first contact
            if (pocResult.contacts.length > 0) {
                result.pocEmail = pocResult.contacts[0].email;
            }
        }
        
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
        
        // ═══════════════════════════════════════════════════════════════════
        // NEW FLAG DETECTION (v24 workflow - 2026-01-25)
        // If a flag goes from FALSE → TRUE and no waiver exists, reset status
        // ═══════════════════════════════════════════════════════════════════
        
        const newFlags = [];
        const clearedFlags = [];
        const hasWaiver = org.permission_type === 'Waiver';
        
        // Check for NEW tou_flag
        if (!org.tou_flag && result.touFlag) {
            newFlags.push('tou_flag');
        } else if (org.tou_flag && !result.touFlag) {
            clearedFlags.push('tou_flag');
        }
        
        // Check for NEW tech_block_flag
        if (!org.tech_block_flag && result.techBlockFlag) {
            newFlags.push('tech_block_flag');
        } else if (org.tech_block_flag && !result.techBlockFlag) {
            clearedFlags.push('tech_block_flag');
        }
        
        // Check for NEW tech_rendering_flag
        if (!org.tech_rendering_flag && result.techRenderingFlag) {
            newFlags.push('tech_rendering_flag');
        } else if (org.tech_rendering_flag && !result.techRenderingFlag) {
            clearedFlags.push('tech_rendering_flag');
        }
        
        // Log cleared flags (good news!)
        if (clearedFlags.length > 0) {
            console.log(`      ✅ Flag(s) CLEARED: ${clearedFlags.join(', ')}`);
            result.flagsCleared = clearedFlags;
        }
        
        // Handle NEW flags
        if (newFlags.length > 0) {
            result.newFlagsDetected = newFlags;
            
            if (hasWaiver) {
                // Has waiver - log but don't reset status
                console.log(`      ⚠️ NEW flag(s) detected: ${newFlags.join(', ')}`);
                console.log(`      ℹ️ Waiver exists - status unchanged, but please verify waiver still applies`);
            } else {
                // No waiver - reset to Nominated for review
                console.log(`      🚨 NEW RESTRICTION DETECTED: ${newFlags.join(', ')}`);
                console.log(`      🔄 Resetting status to "Nominated (Pending Mission Review)"`);
                
                updates.status = 'Nominated (Pending Mission Review)';
                result.fieldsUpdated.push('status');
                result.statusChanged = true;
                result.previousStatus = org.status;
                result.newStatus = 'Nominated (Pending Mission Review)';
                result.resetReason = `New restriction: ${newFlags.join(', ')}`;
            }
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // Standard field updates
        // ═══════════════════════════════════════════════════════════════════
        
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
        
        // NEW 2026-01-26: Save restriction evidence to organizations collection
        // This enables email generator to include page name, quote, and URL
        if (result.restrictionSourceUrls) {
            updates.restriction_source_urls = result.restrictionSourceUrls;
            result.fieldsUpdated.push('restriction_source_urls');
        }
        if (result.restrictionContext) {
            updates.restriction_context = result.restrictionContext;
            result.fieldsUpdated.push('restriction_context');
        }
        
        updates.tou_scanned_date = new Date().toISOString().split('T')[0];
        result.fieldsUpdated.push('tou_scanned_date');
        
        // Tech Rendering flag
        if (result.techRenderingFlag !== org.tech_rendering_flag) {
            updates.tech_rendering_flag = result.techRenderingFlag;
            result.fieldsUpdated.push('tech_rendering_flag');
        }
        
        // Microsite detection fields (NEW - 2026-01-18)
        if (result.micrositeDetected !== undefined) {
            updates.microsite_detected = result.micrositeDetected;
            result.fieldsUpdated.push('microsite_detected');
        }
        if (result.parentOrgWebsite) {
            updates.parent_org_website = result.parentOrgWebsite;
            result.fieldsUpdated.push('parent_org_website');
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
    // Step 7: Create Scan Log Entry (NEW - 2026-01-25)
    // ───────────────────────────────────────────────────────────────────────
    
    if (org.id) {
        // Store restriction details in result for logging
        result.restrictionSourceUrls = result.restrictionSourceUrls || '';
        result.restrictionContext = result.restrictionContext || '';
        
        await createScanLog(org, result, { scanType: options.scanType || 'manual' });
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
    console.log(`   Tech Rendering Flag: ${result.techRenderingFlag ? `⚙️ YES (${result.jsRenderConfidence} confidence)` : '✅ No'}`);
    console.log(`   TOU URL: ${result.touUrl || 'Not found'}`);
    console.log(`   False Positives Filtered: ${result.falsePositivesSkipped}`);
    console.log(`   Events URL: ${result.eventsUrl || 'Not found'} ${result.eventsUrlValidated ? '✅' : '⚠️'}`);
    
    // Updated POC display for multi-contact support
    if (result.pocSkipped) {
        console.log(`   POC Contacts: ⏭️ Skipped (${result.pocInfo?.reason || 'already have contacts'})`);
    } else if (result.pocContacts && result.pocContacts.length > 0) {
        console.log(`   POC Contacts: ${result.pocContacts.length} found`);
        for (const c of result.pocContacts) {
            console.log(`      • ${c.categoryType || c.contactType}: ${c.email}`);
        }
    } else {
        console.log(`   POC Contacts: None found`);
    }
    console.log(`   Google Queries Used: ${googleQueryCount}`);
    
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
    gatherPOCViaGoogleSearch,  // UPDATED 2026-01-31: Now searches all 5 categories
    gatherPOCDirectFetch,
    analyzeWithAI,
    findRestrictions,
    
    // Contact gathering helpers - NEW 2026-01-31
    getExistingContactTypes,
    resetGoogleQueryCount,
    getGoogleQueryCount,
    CONTACT_CATEGORIES,
    
    // Contact saving functions - NEW 2026-01-30
    savePocContact,
    checkForDuplicateContact,
    detectEmailType,
    mapEmailTypeToContactType,
    calculateDataCompleteness,
    
    // Domain matching functions - NEW 2026-01-30
    extractDomainFromEmail,
    extractDomainFromWebsite,
    extractCoreDomain,
    matchDomainToOrg,
    
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
    createScanLog,  // NEW - 2026-01-25: Scan history logging
    
    // Utilities
    fetchUrl,
    extractText,
    sleep,
    getPageType,
    
    // Microsite Detection (NEW - 2026-01-18)
    detectMicrosite,
    findParentOrgWebsite,
    MICROSITE_INDICATORS,
    KNOWN_ORG_WEBSITES,
    
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
    TECH_RENDERING_INDICATORS,      // NEW - 2026-01-16
    MIN_CONTENT_LENGTH,        // NEW - 2026-01-16
    USER_AGENT,
    CONTEXT_WINDOW
};
