/**
 * TOU/LEGAL DOCUMENT SCANNING CODE
 * 
 * Extracted from: scrapers/org-scanner.js
 * Purpose: Scan Terms of Use, Privacy Policy, User Agreement, etc. for scraping restrictions
 * 
 * Copy this into any scraper that needs legal document checking.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// RESTRICTION KEYWORDS - Trigger tou_flag if found
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

// ═══════════════════════════════════════════════════════════════════════════════
// LEGAL PAGE PATHS - All document types to check
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Sleep function
// ═══════════════════════════════════════════════════════════════════════════════

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Fetch URL with proper headers
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchUrl(url) {
    const USER_AGENT = 'EventFinderBot/1.0 (Research tool; Contact: your-email@example.com)';
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            signal: controller.signal,
            redirect: 'follow'
        });
        
        clearTimeout(timeout);
        
        // Check for blocks
        if (response.status === 403 || response.status === 401) {
            return {
                success: false,
                status: response.status,
                body: '',
                error: `HTTP ${response.status}`,
                isBlocked: true
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
// HELPER: Extract text from HTML
// ═══════════════════════════════════════════════════════════════════════════════

function extractText(html) {
    if (!html) return '';
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIND TOU URL - Two-step discovery
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find TOU/Privacy/Legal page URL from homepage HTML or by trying common paths
 * 
 * Step 1: Search homepage HTML for links containing legal keywords
 * Step 2: Try common paths like /terms, /privacy, /user-agreement, etc.
 */
async function findTouUrl(html, baseUrl) {
    // STEP 1: Look for TOU links in the homepage HTML
    if (html) {
        const patterns = [
            /href=["']([^"']*(?:terms|tos|legal|privacy|acceptable|conditions|agreement)[^"']*)["']/gi
        ];
        
        for (const pattern of patterns) {
            const matches = html.matchAll(pattern);
            for (const match of matches) {
                let url = match[1];
                if (url && !url.startsWith('http')) {
                    try {
                        url = new URL(url, baseUrl).href;
                    } catch (e) {
                        continue;
                    }
                }
                if (url && (url.includes('term') || url.includes('legal') || url.includes('privacy') || url.includes('agreement'))) {
                    return { found: true, url, method: 'link' };
                }
            }
        }
    }
    
    // STEP 2: Try common TOU paths directly
    for (const path of TOU_PATHS) {
        const testUrl = baseUrl.replace(/\/$/, '') + path;
        const result = await fetchUrl(testUrl);
        
        if (result.isBlocked) {
            return { found: false, url: testUrl, isBlocked: true, error: result.error };
        }
        
        if (result.success) {
            return { found: true, url: testUrl, method: 'path' };
        }
        
        await sleep(1000); // Respectful delay between checks
    }
    
    return { found: false, url: null, isBlocked: false, error: 'No TOU page found' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIND RESTRICTIONS - Scan text for keywords
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scan text for TOU restriction keywords and phrases
 * Returns: hasRestrictions, foundKeywords, context snippets
 */
function findRestrictions(text) {
    const lowerText = text.toLowerCase();
    const foundKeywords = [];
    const context = [];
    
    // Check keywords
    for (const keyword of TOU_RESTRICTION_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            
            // Extract context snippet
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
            
            // Extract context snippet
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
        context: context.slice(0, 10) // Limit to 10 context snippets
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN: scanTOU - Full TOU scan for an organization
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Full TOU/Privacy/Legal scan for an organization
 * 
 * @param {string} website - Organization's website URL (e.g., "https://example.org")
 * @param {string} html - Optional: Pre-fetched homepage HTML (for finding links)
 * @returns {object} - { touUrl, touFlag, techBlockFlag, touNotes, foundKeywords, context }
 */
async function scanTOU(website, html = null) {
    console.log('   📜 Scanning for TOU restrictions...');
    
    const result = {
        touUrl: null,
        touFlag: false,
        techBlockFlag: false,
        touNotes: '',
        foundKeywords: [],
        context: []
    };
    
    const baseUrl = website.replace(/\/$/, '');
    
    // Find TOU page (checks all legal document types)
    const touSearch = await findTouUrl(html, baseUrl);
    
    if (touSearch.isBlocked) {
        console.log('      ⛔ Technical block detected while searching for TOU');
        result.techBlockFlag = true;
        result.touFlag = true;
        result.touNotes = `Technical block: ${touSearch.error}`;
        return result;
    }
    
    if (!touSearch.found) {
        console.log('      ℹ️ No TOU page found (no prohibition assumed)');
        result.touNotes = 'No TOU page found - no explicit prohibition';
        return result;
    }
    
    result.touUrl = touSearch.url;
    console.log(`      📄 Found TOU at: ${touSearch.url}`);
    
    // Fetch and scan TOU page
    const touResult = await fetchUrl(touSearch.url);
    
    if (touResult.isBlocked) {
        console.log('      ⛔ Technical block on TOU page');
        result.techBlockFlag = true;
        result.touFlag = true;
        result.touNotes = `Technical block accessing TOU: ${touResult.error}`;
        return result;
    }
    
    if (!touResult.success) {
        console.log(`      ⚠️ Could not fetch TOU page: ${touResult.error}`);
        result.touNotes = `Could not fetch TOU: ${touResult.error}`;
        return result;
    }
    
    // Scan for restrictions
    const touText = extractText(touResult.body);
    const restrictions = findRestrictions(touText);
    
    if (restrictions.hasRestrictions) {
        console.log(`      ⚠️ Found ${restrictions.foundKeywords.length} restriction keyword(s)`);
        result.touFlag = true;
        result.foundKeywords = restrictions.foundKeywords;
        result.context = restrictions.context;
        result.touNotes = `Restrictions found: ${restrictions.foundKeywords.join(', ')}`;
    } else {
        console.log('      ✅ No TOU restrictions found');
        result.touNotes = 'No scraping restrictions found in TOU';
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════════

/*
// Example usage:

async function checkOrganization(website) {
    // Option 1: Let scanTOU find everything
    const result = await scanTOU(website);
    
    // Option 2: Pre-fetch homepage and pass it (more efficient)
    const homepage = await fetchUrl(website);
    const result = await scanTOU(website, homepage.body);
    
    console.log('TOU Flag:', result.touFlag);
    console.log('Tech Block:', result.techBlockFlag);
    console.log('Notes:', result.touNotes);
    console.log('Keywords Found:', result.foundKeywords);
    
    return result;
}

// Run it:
checkOrganization('https://example.org');
*/

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS (if using as module)
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    scanTOU,
    findTouUrl,
    findRestrictions,
    fetchUrl,
    extractText,
    TOU_RESTRICTION_KEYWORDS,
    TOU_RESTRICTION_PHRASES,
    TOU_PATHS
};
