/**
 * tou-scanner.js
 * 
 * Automated TOU (Terms of Use) scanner for Event Finder
 * - Scans organization websites for TOU pages
 * - Detects scraping restrictions via keyword matching
 * - Auto-updates PocketBase based on findings
 * - Defaults to REJECTED if suspicious keywords found (conservative approach)
 * 
 * Usage:
 *   node tou-scanner.js --url https://example.org        (scan only, no DB update)
 *   node tou-scanner.js --org-id abc123                  (scan and update PocketBase)
 *   node tou-scanner.js --org "Organization Name"        (scan and update PocketBase)
 *   node tou-scanner.js --all                            (scan all unscanned orgs)
 * 
 * Environment variables required:
 *   POCKETBASE_URL
 *   POCKETBASE_ADMIN_EMAIL
 *   POCKETBASE_ADMIN_PASSWORD
 * 
 * Last Updated: 2026-01-05
 */

require('dotenv').config();
const axios = require('axios');
const PocketBase = require('pocketbase/cjs');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const pb = new PocketBase(process.env.POCKETBASE_URL);
let authenticated = false;

// User agent for requests
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Request timeout (30 seconds)
const TIMEOUT = 30000;

// ═══════════════════════════════════════════════════════════════════════════
// RESTRICTION KEYWORDS (Conservative - defaults to REJECTED if found)
// ═══════════════════════════════════════════════════════════════════════════

const RESTRICTION_KEYWORDS = [
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
    'extract data',
    'extracting data',
    
    // Machine/programmatic access
    'machine readable',
    'machine-readable',
    'programmatic access',
    'programmatically',
    'systematic',
    'systematically',
    'bulk download',
    'bulk access',
    'mass download',
    
    // Reproduction restrictions
    'reproduce',
    'reproduction',
    'copy',
    'copying',
    'duplicate',
    'mirror',
    'mirroring',
    'republish',
    'redistribute',
    
    // Legal terms
    'unauthorized access',
    'unauthorized use',
    'prohibited',
    'strictly prohibited',
    'expressly prohibited',
    'not permitted',
    'without permission',
    'without prior written',
    'without express written',
    'violation',
    'violates'
];

// Phrases that strongly indicate restrictions
const RESTRICTION_PHRASES = [
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

// Common TOU page paths to check
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

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════

async function authenticate() {
    if (authenticated) return;

    try {
        await pb.admins.authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL,
            process.env.POCKETBASE_ADMIN_PASSWORD
        );
        authenticated = true;
        console.log('✅ Authenticated with PocketBase');
    } catch (error) {
        console.error('❌ PocketBase authentication failed:', error.message);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// URL FETCHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch a URL with proper headers and error handling
 * @returns {Object} { success, status, body, error, isBlocked }
 */
async function fetchUrl(url) {
    console.log(`📡 Fetching: ${url}`);
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: TIMEOUT,
            validateStatus: () => true  // Accept all status codes
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

        if (response.status >= 400) {
            return {
                success: false,
                status: response.status,
                body: '',
                error: `HTTP ${response.status}`,
                isBlocked: false
            };
        }

        return {
            success: true,
            status: 200,
            body: response.data,
            error: null,
            isBlocked: false
        };

    } catch (error) {
        const isBlocked = error.message.includes('403') || 
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

// ═══════════════════════════════════════════════════════════════════════════
// TEXT EXTRACTION AND ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract text content from HTML
 */
function extractText(html) {
    if (typeof html !== 'string') return '';
    
    // Remove script and style tags
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Decode common HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

/**
 * Search for restriction keywords in text
 * @returns {Object} { hasRestrictions, foundKeywords, context }
 */
function findRestrictions(text) {
    const lowerText = text.toLowerCase();
    const foundKeywords = [];
    const context = [];

    // Check single keywords
    for (const keyword of RESTRICTION_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            
            // Extract context (100 chars before and after)
            const index = lowerText.indexOf(keyword.toLowerCase());
            const start = Math.max(0, index - 100);
            const end = Math.min(text.length, index + keyword.length + 100);
            const contextSnippet = '...' + text.substring(start, end).trim() + '...';
            context.push(`"${keyword}": ${contextSnippet}`);
        }
    }

    // Check phrases
    for (const phrase of RESTRICTION_PHRASES) {
        if (lowerText.includes(phrase.toLowerCase())) {
            foundKeywords.push(phrase);
            
            const index = lowerText.indexOf(phrase.toLowerCase());
            const start = Math.max(0, index - 100);
            const end = Math.min(text.length, index + phrase.length + 100);
            const contextSnippet = '...' + text.substring(start, end).trim() + '...';
            context.push(`"${phrase}": ${contextSnippet}`);
        }
    }

    // Remove duplicate keywords
    const uniqueKeywords = [...new Set(foundKeywords)];

    return {
        hasRestrictions: uniqueKeywords.length > 0,
        foundKeywords: uniqueKeywords,
        context: context.slice(0, 10)  // Limit to 10 examples
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// TOU PAGE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Find TOU page URL for a website
 */
async function findTouUrl(baseUrl) {
    console.log(`🔍 Searching for TOU page on ${baseUrl}`);

    // Normalize base URL
    let base = baseUrl.replace(/\/$/, '');
    if (!base.startsWith('http')) {
        base = 'https://' + base;
    }

    // First, check homepage for TOU links
    const homeResult = await fetchUrl(base);

    if (homeResult.isBlocked) {
        return { found: false, url: null, isBlocked: true, error: homeResult.error };
    }

    if (homeResult.success && typeof homeResult.body === 'string') {
        // Look for TOU links in the page
        const touLinkPattern = /href=["']([^"']*(?:terms|tos|legal|privacy|conditions|agreement)[^"']*)["']/gi;
        let match;
        
        while ((match = touLinkPattern.exec(homeResult.body)) !== null) {
            let href = match[1];
            
            // Convert relative URLs to absolute
            if (href.startsWith('/')) {
                href = base + href;
            } else if (!href.startsWith('http')) {
                href = base + '/' + href;
            }
            
            // Quick check if it looks like a TOU page
            if (href.match(/terms|tos|legal|privacy|conditions|agreement/i)) {
                console.log(`   📄 Found potential TOU link: ${href}`);
                return { found: true, url: href, isBlocked: false };
            }
        }
    }

    // Try common TOU paths
    for (const path of TOU_PATHS) {
        const touUrl = base + path;
        const result = await fetchUrl(touUrl);

        if (result.isBlocked) {
            return { found: false, url: touUrl, isBlocked: true, error: result.error };
        }

        if (result.success) {
            console.log(`   📄 Found TOU at: ${touUrl}`);
            return { found: true, url: touUrl, isBlocked: false };
        }

        // Small delay between requests (be polite)
        await sleep(1000);
    }

    return { found: false, url: null, isBlocked: false, error: 'No TOU page found' };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCANNING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Scan a TOU page for restrictions
 */
async function scanTouPage(touUrl) {
    console.log(`📜 Scanning TOU page: ${touUrl}`);

    const result = await fetchUrl(touUrl);

    if (result.isBlocked) {
        return {
            success: false,
            isBlocked: true,
            hasRestrictions: false,
            error: result.error,
            foundKeywords: [],
            context: []
        };
    }

    if (!result.success) {
        return {
            success: false,
            isBlocked: false,
            hasRestrictions: false,
            error: result.error,
            foundKeywords: [],
            context: []
        };
    }

    const text = extractText(result.body);
    const restrictions = findRestrictions(text);

    return {
        success: true,
        isBlocked: false,
        hasRestrictions: restrictions.hasRestrictions,
        foundKeywords: restrictions.foundKeywords,
        context: restrictions.context,
        error: null
    };
}

/**
 * Full TOU scan for an organization website
 */
async function scanOrganization(website) {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`🔍 TOU SCAN: ${website}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    const results = {
        website,
        touUrl: null,
        isBlocked: false,
        hasRestrictions: false,
        foundKeywords: [],
        context: [],
        recommendation: null,
        error: null
    };

    // Step 1: Find TOU page
    const touSearch = await findTouUrl(website);

    if (touSearch.isBlocked) {
        results.isBlocked = true;
        results.error = touSearch.error;
        results.recommendation = 'TECH_BLOCKED';
        console.log(`\n⛔ RESULT: Site is blocking automated requests`);
        console.log(`   Error: ${touSearch.error}`);
        return results;
    }

    if (!touSearch.found) {
        results.error = 'Could not find TOU page';
        results.recommendation = 'CLEAR';  // No TOU = no prohibition
        console.log(`\n✅ RESULT: No TOU page found (no prohibition)`);
        return results;
    }

    results.touUrl = touSearch.url;

    // Step 2: Scan TOU page for restrictions
    const scanResult = await scanTouPage(touSearch.url);

    if (scanResult.isBlocked) {
        results.isBlocked = true;
        results.error = scanResult.error;
        results.recommendation = 'TECH_BLOCKED';
        console.log(`\n⛔ RESULT: TOU page is blocking automated requests`);
        return results;
    }

    if (!scanResult.success) {
        results.error = scanResult.error;
        results.recommendation = 'MANUAL_REVIEW';
        console.log(`\n⚠️ RESULT: Could not scan TOU page`);
        console.log(`   Error: ${scanResult.error}`);
        return results;
    }

    results.hasRestrictions = scanResult.hasRestrictions;
    results.foundKeywords = scanResult.foundKeywords;
    results.context = scanResult.context;

    if (scanResult.hasRestrictions) {
        results.recommendation = 'TOU_RESTRICTED';
        console.log(`\n⚠️ RESULT: TOU RESTRICTIONS DETECTED`);
        console.log(`   Found ${scanResult.foundKeywords.length} suspicious keywords:`);
        scanResult.foundKeywords.slice(0, 10).forEach(kw => console.log(`     • ${kw}`));
        if (scanResult.context.length > 0) {
            console.log(`\n   Context snippets:`);
            scanResult.context.slice(0, 3).forEach(ctx => 
                console.log(`     ${ctx.substring(0, 150)}...`)
            );
        }
    } else {
        results.recommendation = 'CLEAR';
        console.log(`\n✅ RESULT: No restrictions found in TOU`);
    }

    return results;
}

/**
 * Scan and update organization in PocketBase
 */
async function scanAndUpdateOrganization(orgId) {
    await authenticate();

    // Get organization
    const org = await pb.collection('organizations').getOne(orgId);
    console.log(`\n📋 Organization: ${org.name}`);
    console.log(`   Website: ${org.website}`);
    console.log(`   Current Status: ${org.status}`);

    if (!org.website) {
        console.log('\n❌ ERROR: Organization has no website URL');
        return null;
    }

    // Scan TOU
    const results = await scanOrganization(org.website);
    const today = new Date().toISOString().split('T')[0];

    // Update PocketBase based on results
    if (results.isBlocked) {
        // Technical block detected
        console.log('\n💾 Updating PocketBase: Technical Block');
        await pb.collection('organizations').update(orgId, {
            status: 'Rejected (By Mission or Org)',
            tech_block_flag: true,
            tou_scanned_date: today,
            tou_notes: `⛔ TECHNICAL BLOCK DETECTED:\n\n${results.error}`,
            scraping_enabled: false
        });

    } else if (results.hasRestrictions) {
        // TOU restrictions detected
        const touLanguage = results.context.slice(0, 5).join('\n\n');
        console.log('\n💾 Updating PocketBase: TOU Restricted');
        await pb.collection('organizations').update(orgId, {
            status: 'Rejected (By Mission or Org)',
            tou_flag: true,
            tou_scanned_date: today,
            tou_notes: `⚠️ TOU RESTRICTION DETECTED:\n\nKeywords found: ${results.foundKeywords.join(', ')}\n\nContext:\n${touLanguage}`,
            scraping_enabled: false
        });

    } else if (results.recommendation === 'CLEAR') {
        // No restrictions found
        console.log('\n💾 Updating PocketBase: TOU Clear (Pending Mission Review)');
        await pb.collection('organizations').update(orgId, {
            status: 'Nominated (Pending Mission Review)',
            tou_flag: false,
            tech_block_flag: false,
            tou_scanned_date: today,
            tou_notes: results.touUrl 
                ? `✅ TOU scanned - No restrictions found.\n\nTOU URL: ${results.touUrl}`
                : '✅ No TOU page found (no prohibition).',
            scraping_enabled: false  // Keep false until approved
        });

    } else {
        // Manual review needed
        console.log('\n💾 Updating PocketBase: Manual review required');
        await pb.collection('organizations').update(orgId, {
            tou_scanned_date: today,
            tou_notes: `⚠️ Manual review required: ${results.error || 'Could not complete scan'}`,
            scraping_enabled: false
        });
    }

    console.log('\n✅ PocketBase updated');
    return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help')) {
        console.log(`
════════════════════════════════════════════════════════════════
TOU Scanner for Event Finder
════════════════════════════════════════════════════════════════

Usage:
  node tou-scanner.js --url <website-url>     Scan URL only (no DB update)
  node tou-scanner.js --org-id <id>           Scan org by PocketBase ID
  node tou-scanner.js --org "<name>"          Scan org by name
  node tou-scanner.js --all                   Scan all unscanned orgs

Options:
  --url <url>       Website URL to scan (no database update)
  --org-id <id>     PocketBase organization ID
  --org "<name>"    Organization name (use quotes if spaces)
  --all             Scan all organizations without tou_scanned_date

Environment Variables Required:
  POCKETBASE_URL              PocketBase server URL
  POCKETBASE_ADMIN_EMAIL      Admin email
  POCKETBASE_ADMIN_PASSWORD   Admin password

Examples:
  node tou-scanner.js --url https://www.csis.org
  node tou-scanner.js --org-id abc123def456
  node tou-scanner.js --org "Center for Strategic and International Studies"
  node tou-scanner.js --all

Keyword Detection:
  The scanner looks for suspicious keywords like "scraping", "automated access",
  "data mining", "prohibited", etc. If found, the organization is marked as
  REJECTED by default (conservative approach - better safe than sorry).
`);
        return;
    }

    // Parse arguments
    const urlIndex = args.indexOf('--url');
    const orgIdIndex = args.indexOf('--org-id');
    const orgNameIndex = args.indexOf('--org');
    const scanAll = args.includes('--all');

    try {
        if (urlIndex !== -1 && args[urlIndex + 1]) {
            // URL-only scan (no database update)
            const url = args[urlIndex + 1];
            await scanOrganization(url);

        } else if (orgIdIndex !== -1 && args[orgIdIndex + 1]) {
            // Scan by org ID
            const orgId = args[orgIdIndex + 1];
            await scanAndUpdateOrganization(orgId);

        } else if (orgNameIndex !== -1 && args[orgNameIndex + 1]) {
            // Scan by org name
            const orgName = args[orgNameIndex + 1];
            await authenticate();
            
            const result = await pb.collection('organizations').getList(1, 1, {
                filter: `name ~ "${orgName}"`
            });

            if (result.items.length === 0) {
                console.error(`❌ ERROR: Organization "${orgName}" not found`);
                process.exit(1);
            }

            await scanAndUpdateOrganization(result.items[0].id);

        } else if (scanAll) {
            // Scan all organizations without TOU scan date
            await authenticate();
            
            const result = await pb.collection('organizations').getList(1, 500, {
                filter: 'tou_scanned_date = null || tou_scanned_date = ""',
                sort: 'name'
            });

            console.log(`\n📋 Found ${result.items.length} organizations without TOU scan\n`);

            for (const org of result.items) {
                if (org.website) {
                    await scanAndUpdateOrganization(org.id);
                    // Rate limiting - 5 second delay between orgs
                    await sleep(5000);
                } else {
                    console.log(`\n⏭️ Skipping ${org.name} - no website URL`);
                }
            }

            console.log('\n════════════════════════════════════════════════════════════════');
            console.log('✅ All organizations scanned');
            console.log('════════════════════════════════════════════════════════════════\n');

        } else {
            console.error('❌ ERROR: Invalid arguments. Use --help for usage.');
            process.exit(1);
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('❌ Unhandled error:', error);
            process.exit(1);
        });
}

module.exports = {
    scanOrganization,
    scanTouPage,
    findTouUrl,
    findRestrictions,
    RESTRICTION_KEYWORDS,
    RESTRICTION_PHRASES
};
