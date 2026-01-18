/**
 * batch-scrape-all.js
 * 
 * Batch processor that scans and scrapes ALL organizations with
 * status = "Live (Scraping Active)"
 * 
 * Features:
 * - Fetches all Live orgs from database
 * - Runs full scan (TOU, tech block, JS rendering checks)
 * - Scrapes events for orgs that pass safety gates
 * - Updates existing events with new/better data (doesn't skip duplicates)
 * - Respectful delays between orgs
 * - Summary report at the end
 * 
 * Usage:
 *   node batch-scrape-all.js              # Full run
 *   node batch-scrape-all.js --dry-run    # Preview only (no scraping)
 *   node batch-scrape-all.js --scan-only  # Scan all, don't scrape
 * 
 * Created: 2026-01-17
 */

require('dotenv').config();
const scanner = require('./scrapers/org-scanner');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Delay between organizations (be respectful)
const DELAY_BETWEEN_ORGS_MS = 10000; // 10 seconds

// Delay between scraping requests
const SCRAPE_DELAY_MS = 5000;

// Max events per org
const MAX_EVENTS_PER_ORG = 50;

let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
    if (authToken) return authToken;
    
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) throw new Error('Authentication failed');
    const data = await response.json();
    authToken = data.token;
    return authToken;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function getLiveOrganizations() {
    const filter = encodeURIComponent('status = "Live (Scraping Active)"');
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}&perPage=200`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!response.ok) throw new Error('Failed to fetch organizations');
    const data = await response.json();
    return data.items || [];
}

async function getOrganization(orgId) {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!response.ok) return null;
    return await response.json();
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractRootDomain(url) {
    if (!url) return '';
    let cleaned = url.replace(/^https?:\/\//, '').split('/')[0];
    const parts = cleaned.toLowerCase().split('.');
    if (parts.length <= 2) return cleaned.toLowerCase();
    return parts.slice(-2).join('.');
}

function extractText(html) {
    if (!html) return '';
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractLinks(html, baseUrl) {
    if (!html) return [];
    const links = [];
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1];
        let text = match[2].replace(/<[^>]+>/g, '').trim();
        
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
        
        if (!href.startsWith('http')) {
            try { href = new URL(href, baseUrl).href; } catch (e) { continue; }
        }
        
        if (href.includes('event') || href.includes('detail') || href.includes('calendar') || 
            href.includes('program') || href.includes('conference') || href.includes('seminar')) {
            links.push({ url: href, text: text.substring(0, 100) });
        }
    }
    return links;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY GATES
// ═══════════════════════════════════════════════════════════════════════════════

function checkSafetyGates(org) {
    const issues = [];
    
    if (org.status !== 'Live (Scraping Active)') {
        issues.push(`Status changed to "${org.status}"`);
    }
    if (org.tou_flag === true) {
        issues.push('TOU restrictions detected');
    }
    if (org.tech_block_flag === true) {
        issues.push('Tech block (403)');
    }
    if (org.tech_rendering_flag === true) {
        issues.push('JS rendering required');
    }
    if (org.permission_denied_flag === true) {
        issues.push('Permission denied by org');
    }
    
    return { safe: issues.length === 0, issues };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT EXTRACTION & SAVING (copied from scrape-organization.js with updates)
// ═══════════════════════════════════════════════════════════════════════════════

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

async function extractEventsWithAI(html, eventsUrl, orgName) {
    if (!OPENAI_API_KEY) return [];
    
    const extractedLinks = extractLinks(html, eventsUrl);
    const textContent = extractText(html).substring(0, 10000);
    const linksText = extractedLinks.length > 0 
        ? extractedLinks.map(l => `- "${l.text}" → ${l.url}`).join('\n')
        : '(No event links found)';
    
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
- url: The matching URL from AVAILABLE EVENT LINKS above

CRITICAL URL RULE:
- Match each event to its ACTUAL URL from the "AVAILABLE EVENT LINKS" list
- Use the EXACT URL from that list - do NOT modify or guess URLs
- If no matching link is found, set url to null

OTHER RULES:
- Only include FUTURE events (today or later - current date is January 2026)
- Skip past events
- Skip training/certification courses
- Skip job fairs or recruitment events

Return ONLY valid JSON array. If no events found, return: []`;

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

        if (!response.ok) return [];

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const events = JSON.parse(content);
        return Array.isArray(events) ? events : [];
        
    } catch (error) {
        return [];
    }
}

async function deepScrapeEvent(event, orgName) {
    if (!event.url || !OPENAI_API_KEY) return event;
    
    const result = await fetchUrl(event.url);
    if (!result.success) return event;
    
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

        if (!response.ok) return event;

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        return JSON.parse(content);
    } catch (error) {
        return event;
    }
}

function generateSourceId(event, orgDomain) {
    if (event.url) return event.url;
    const titleSlug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    return `${orgDomain}/${titleSlug}-${event.start_date || 'nodate'}`;
}

async function getExistingEvent(sourceId, title, orgId) {
    try {
        // Check by source_id
        const filter1 = encodeURIComponent(`source_id = "${sourceId}"`);
        const response1 = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter1}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response1.ok) {
            const data1 = await response1.json();
            if (data1.items && data1.items.length > 0) return data1.items[0];
        }
        
        // Check by title + org
        const titleNormalized = title.toLowerCase().trim().substring(0, 60);
        const filter2 = encodeURIComponent(`organization = "${orgId}" && title ~ "${titleNormalized}"`);
        const response2 = await fetch(
            `${POCKETBASE_URL}/api/collections/events/records?filter=${filter2}`,
            { headers: { 'Authorization': authToken } }
        );
        
        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.items && data2.items.length > 0) return data2.items[0];
        }
    } catch (e) {}
    return null;
}

function isMeaningfulValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
        const trimmed = value.trim().toLowerCase();
        if (trimmed === '' || trimmed === 'n/a' || trimmed === 'tbd' || trimmed === 'null') return false;
    }
    return true;
}

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
    
    return Object.keys(updates).length > 0 ? { updates, changedFields } : null;
}

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

async function saveEvent(event, orgId, orgDomain, eventPolicy) {
    const sourceId = generateSourceId(event, orgDomain);
    const existing = await getExistingEvent(sourceId, event.title, orgId);
    
    if (existing) {
        const updateResult = getEventUpdates(existing, event);
        
        if (updateResult) {
            const success = await updateEvent(existing.id, updateResult.updates);
            if (success) {
                return { saved: false, updated: true, fields: updateResult.changedFields };
            }
            return { saved: false, updated: false, reason: 'update_failed' };
        }
        return { saved: false, updated: false, reason: 'no_changes' };
    }
    
    // New event
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
            return { saved: true, status: eventStatus };
        }
        return { saved: false, reason: 'api_error' };
    } catch (e) {
        return { saved: false, reason: e.message };
    }
}

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
                body: JSON.stringify({ last_scraped: new Date().toISOString() })
            }
        );
    } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPE SINGLE ORG
// ═══════════════════════════════════════════════════════════════════════════════

async function scrapeOrganization(org, scanOnly = false) {
    const result = {
        orgName: org.name,
        orgId: org.id,
        scanned: false,
        scraped: false,
        safetyPassed: false,
        eventsFound: 0,
        eventsSaved: 0,
        eventsUpdated: 0,
        eventsUnchanged: 0,
        error: null,
        statusChanged: null
    };
    
    // Step 1: Scan
    console.log(`\n   🔍 Scanning...`);
    
    try {
        const scanResult = await scanner.scanOrganization(org, {
            updateDb: true,
            skipTOU: false,
            skipEventsUrl: false,
            skipAI: true  // Skip AI for batch (saves time/cost)
        });
        result.scanned = true;
        
        if (scanResult.statusChanged) {
            result.statusChanged = scanResult.newStatus;
            console.log(`      🔄 Status changed to: ${scanResult.newStatus}`);
        }
    } catch (e) {
        result.error = `Scan failed: ${e.message}`;
        console.log(`      ❌ Scan failed: ${e.message}`);
        return result;
    }
    
    // Step 2: Re-fetch org and check safety gates
    const updatedOrg = await getOrganization(org.id);
    if (!updatedOrg) {
        result.error = 'Could not re-fetch org';
        return result;
    }
    
    const safetyCheck = checkSafetyGates(updatedOrg);
    
    if (!safetyCheck.safe) {
        console.log(`      ⚠️ Safety gates failed: ${safetyCheck.issues.join(', ')}`);
        result.error = safetyCheck.issues.join(', ');
        return result;
    }
    
    result.safetyPassed = true;
    console.log(`      ✅ Safety gates passed`);
    
    if (scanOnly) {
        console.log(`      ℹ️ Scan only mode - skipping scrape`);
        return result;
    }
    
    // Step 3: Scrape events
    const eventsUrl = updatedOrg.events_url;
    if (!eventsUrl) {
        console.log(`      ⚠️ No events_url - skipping scrape`);
        result.error = 'No events_url';
        return result;
    }
    
    console.log(`   📥 Scraping events...`);
    await sleep(SCRAPE_DELAY_MS);
    
    const pageResult = await fetchUrl(eventsUrl);
    if (!pageResult.success) {
        console.log(`      ❌ Could not fetch events page`);
        result.error = 'Could not fetch events page';
        return result;
    }
    
    // Extract events
    const events = await extractEventsWithAI(pageResult.body, eventsUrl, org.name);
    result.eventsFound = events.length;
    console.log(`      📋 Found ${events.length} events`);
    
    if (events.length === 0) {
        result.scraped = true;
        return result;
    }
    
    // Deep scrape each event
    const enrichedEvents = [];
    for (let i = 0; i < Math.min(events.length, MAX_EVENTS_PER_ORG); i++) {
        const event = events[i];
        if (event.url && event.url !== eventsUrl) {
            await sleep(2000);
            const enriched = await deepScrapeEvent(event, org.name);
            enrichedEvents.push(enriched);
        } else {
            enrichedEvents.push(event);
        }
    }
    
    // Save events
    const eventPolicy = updatedOrg.event_policy || 'propose_events';
    const orgDomain = extractRootDomain(updatedOrg.website);
    
    for (const event of enrichedEvents) {
        const saveResult = await saveEvent(event, org.id, orgDomain, eventPolicy);
        if (saveResult.saved) {
            result.eventsSaved++;
        } else if (saveResult.updated) {
            result.eventsUpdated++;
            console.log(`      🔄 Updated: ${event.title.substring(0, 40)}... (${saveResult.fields.join(', ')})`);
        } else {
            result.eventsUnchanged++;
        }
    }
    
    await updateLastScraped(org.id);
    result.scraped = true;
    
    console.log(`      💾 Saved: ${result.eventsSaved} new, ${result.eventsUpdated} updated, ${result.eventsUnchanged} unchanged`);
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const scanOnly = args.includes('--scan-only');
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔄 BATCH SCAN & SCRAPE - ALL LIVE ORGANIZATIONS');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${dryRun ? '🟡 DRY RUN (preview only)' : scanOnly ? '🔍 SCAN ONLY' : '🟢 FULL RUN'}`);
    console.log('');
    
    // Initialize
    console.log('⏳ Initializing...');
    await scanner.init();
    await authenticate();
    console.log('✅ Ready\n');
    
    // Get all live orgs
    console.log('📡 Fetching Live organizations...');
    const orgs = await getLiveOrganizations();
    console.log(`   Found ${orgs.length} organization(s) with status "Live (Scraping Active)"\n`);
    
    if (orgs.length === 0) {
        console.log('   No organizations to process.');
        return;
    }
    
    if (dryRun) {
        console.log('────────────────────────────────────────────────────────────────');
        console.log('📋 ORGANIZATIONS TO PROCESS (Dry Run)');
        console.log('────────────────────────────────────────────────────────────────');
        for (const org of orgs) {
            console.log(`   • ${org.name}`);
            console.log(`     Website: ${org.website}`);
            console.log(`     Events URL: ${org.events_url || '(not set)'}`);
            console.log('');
        }
        console.log('════════════════════════════════════════════════════════════════');
        console.log('🟡 DRY RUN COMPLETE - No changes made');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('\nTo run for real, use: node batch-scrape-all.js');
        return;
    }
    
    // Process each org
    const results = [];
    
    for (let i = 0; i < orgs.length; i++) {
        const org = orgs[i];
        
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`📍 [${i + 1}/${orgs.length}] ${org.name}`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`   Website: ${org.website}`);
        console.log(`   Events URL: ${org.events_url || '(discovering...)'}`);
        
        const result = await scrapeOrganization(org, scanOnly);
        results.push(result);
        
        // Delay between orgs
        if (i < orgs.length - 1) {
            console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_ORGS_MS / 1000}s before next org...`);
            await sleep(DELAY_BETWEEN_ORGS_MS);
        }
    }
    
    // Summary
    console.log('\n');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 BATCH SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    
    const successful = results.filter(r => r.scraped || r.scanned);
    const failed = results.filter(r => r.error && !r.scanned);
    const safetyFailed = results.filter(r => r.scanned && !r.safetyPassed);
    
    const totalSaved = results.reduce((sum, r) => sum + r.eventsSaved, 0);
    const totalUpdated = results.reduce((sum, r) => sum + r.eventsUpdated, 0);
    const totalUnchanged = results.reduce((sum, r) => sum + r.eventsUnchanged, 0);
    const totalFound = results.reduce((sum, r) => sum + r.eventsFound, 0);
    
    console.log(`\n   Organizations processed: ${orgs.length}`);
    console.log(`   ✅ Successful: ${successful.length}`);
    console.log(`   ⚠️ Safety gates failed: ${safetyFailed.length}`);
    console.log(`   ❌ Errors: ${failed.length}`);
    
    console.log(`\n   Events found: ${totalFound}`);
    console.log(`   Events saved (new): ${totalSaved}`);
    console.log(`   Events updated: ${totalUpdated}`);
    console.log(`   Events unchanged: ${totalUnchanged}`);
    
    if (safetyFailed.length > 0) {
        console.log('\n   ⚠️ Orgs that failed safety gates:');
        for (const r of safetyFailed) {
            console.log(`      • ${r.orgName}: ${r.error}`);
        }
    }
    
    if (failed.length > 0) {
        console.log('\n   ❌ Orgs with errors:');
        for (const r of failed) {
            console.log(`      • ${r.orgName}: ${r.error}`);
        }
    }
    
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('✅ BATCH COMPLETE');
    console.log('════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
