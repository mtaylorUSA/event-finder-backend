/**
 * contact-discovery.js
 * 
 * CONTACT DISCOVERY SCRIPT
 * 
 * Discovers contact information for organizations using Google Search snippets only.
 * Does NOT scrape organization websites - extracts info from search result snippets.
 * 
 * Features:
 * - Targets orgs with status "Mission Approved (Request Not Sent)"
 * - Priority batching: Clean → TOU Flag → Tech Block → Tech Rendering
 * - Searches for 3 contact types: Legal/Permissions, Events, Media/PR
 * - Recursive search if name found but no email
 * - Auto-throttles to stay under 100 free queries/day
 * - Tracks progress via scan_logs collection
 * - Updates existing contacts or creates new ones
 * 
 * Usage:
 *   node contact-discovery.js --batch 1           # Run batch 1 (clean orgs)
 *   node contact-discovery.js --batch 2           # Run batch 2 (TOU flag only)
 *   node contact-discovery.js --batch 3           # Run batch 3 (Tech block)
 *   node contact-discovery.js --batch 4           # Run batch 4 (Tech rendering)
 *   node contact-discovery.js --batch 1 --limit 10  # Limit to 10 orgs
 *   node contact-discovery.js --status            # Show batch status
 * 
 * Prerequisites:
 *   - GOOGLE_SEARCH_API_KEY in .env
 *   - GOOGLE_SEARCH_ENGINE_ID in .env
 * 
 * Last Updated: 2026-01-27
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// Throttling - stay under free tier
const MAX_QUERIES_PER_RUN = 95;  // Buffer under 100 free limit
const DELAY_BETWEEN_SEARCHES_MS = 1500;

// Contact types to search for
const CONTACT_TYPES = [
    {
        type: 'Legal/Permissions',
        searchTerms: ['legal department', 'legal contact', 'permissions', 'licensing', 'legal counsel'],
        emailPrefixes: ['legal', 'permissions', 'licensing', 'counsel', 'compliance']
    },
    {
        type: 'Events',
        searchTerms: ['events contact', 'events coordinator', 'events team', 'events department', 'programs'],
        emailPrefixes: ['events', 'programs', 'conferences', 'meetings', 'registration']
    },
    {
        type: 'Media/PR',
        searchTerms: ['media contact', 'press contact', 'media relations', 'public relations', 'communications'],
        emailPrefixes: ['media', 'press', 'pr', 'communications', 'comms', 'publicaffairs']
    }
];

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

let fetchModule;
let authToken = null;
let queryCount = 0;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    fetchModule = (await import('node-fetch')).default;
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const batchArg = args.find(a => a.startsWith('--batch'));
    const limitArg = args.find(a => a.startsWith('--limit'));
    const statusArg = args.includes('--status');
    
    let batchNumber = null;
    let limit = null;
    
    if (batchArg) {
        const batchIndex = args.indexOf('--batch');
        batchNumber = parseInt(args[batchIndex + 1]);
        if (isNaN(batchNumber) || batchNumber < 1 || batchNumber > 4) {
            console.log('❌ Invalid batch number. Use --batch 1, 2, 3, or 4');
            process.exit(1);
        }
    }
    
    if (limitArg) {
        const limitIndex = args.indexOf('--limit');
        limit = parseInt(args[limitIndex + 1]);
        if (isNaN(limit) || limit < 1) {
            console.log('❌ Invalid limit. Use --limit <number>');
            process.exit(1);
        }
    }
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📇 Contact Discovery Script');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Validate environment
    // ─────────────────────────────────────────────────────────────────────────
    
    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.log('❌ Missing PocketBase credentials in .env');
        process.exit(1);
    }
    
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
        console.log('❌ Missing Google Search API credentials in .env');
        console.log('   Required: GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID');
        process.exit(1);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🔐 Authenticating with PocketBase...');
    authToken = await authenticate();
    console.log('   ✅ Authenticated');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Show status or run batch
    // ─────────────────────────────────────────────────────────────────────────
    
    if (statusArg || !batchNumber) {
        await showBatchStatus();
        if (!batchNumber) {
            console.log('');
            console.log('💡 Usage: node contact-discovery.js --batch <1-4>');
            console.log('');
        }
        return;
    }
    
    await runBatch(batchNumber, limit);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH STATUS
// ═══════════════════════════════════════════════════════════════════════════════

async function showBatchStatus() {
    console.log('📊 Batch Status');
    console.log('────────────────────────────────────────');
    
    const targetStatus = 'Mission Approved (Request Not Sent)';
    
    // Fetch all orgs with target status
    const orgs = await fetchOrgsWithStatus(targetStatus);
    
    // Get orgs that already have contact discovery scans
    const scannedOrgIds = await getScannedOrgIds();
    
    // Categorize into batches
    const batches = {
        1: { name: 'Clean (no flags)', orgs: [] },
        2: { name: 'TOU Flag only', orgs: [] },
        3: { name: 'Tech Block Flag', orgs: [] },
        4: { name: 'Tech Rendering Flag', orgs: [] }
    };
    
    for (const org of orgs) {
        const alreadyScanned = scannedOrgIds.has(org.id);
        const batchNum = getBatchNumber(org);
        
        batches[batchNum].orgs.push({
            ...org,
            alreadyScanned
        });
    }
    
    // Sort each batch alphabetically
    for (const batch of Object.values(batches)) {
        batch.orgs.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Display status
    let totalRemaining = 0;
    
    for (const [num, batch] of Object.entries(batches)) {
        const total = batch.orgs.length;
        const scanned = batch.orgs.filter(o => o.alreadyScanned).length;
        const remaining = total - scanned;
        totalRemaining += remaining;
        
        const status = remaining === 0 ? '✅' : '⏳';
        console.log(`   Batch ${num}: ${batch.name}`);
        console.log(`   ${status} ${scanned}/${total} complete (${remaining} remaining)`);
        console.log('');
    }
    
    console.log('────────────────────────────────────────');
    console.log(`   Total orgs: ${orgs.length}`);
    console.log(`   Total remaining: ${totalRemaining}`);
    console.log('────────────────────────────────────────');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN BATCH
// ═══════════════════════════════════════════════════════════════════════════════

async function runBatch(batchNumber, limit) {
    const batchNames = {
        1: 'Clean (no flags)',
        2: 'TOU Flag only',
        3: 'Tech Block Flag',
        4: 'Tech Rendering Flag'
    };
    
    console.log(`🚀 Running Batch ${batchNumber}: ${batchNames[batchNumber]}`);
    console.log('────────────────────────────────────────');
    console.log('');
    
    const targetStatus = 'Mission Approved (Request Not Sent)';
    
    // Fetch all orgs with target status
    const allOrgs = await fetchOrgsWithStatus(targetStatus);
    
    // Get orgs that already have contact discovery scans
    const scannedOrgIds = await getScannedOrgIds();
    
    // Filter to this batch, exclude already scanned, sort alphabetically
    let orgsToProcess = allOrgs
        .filter(org => getBatchNumber(org) === batchNumber)
        .filter(org => !scannedOrgIds.has(org.id))
        .sort((a, b) => a.name.localeCompare(b.name));
    
    if (limit) {
        orgsToProcess = orgsToProcess.slice(0, limit);
    }
    
    if (orgsToProcess.length === 0) {
        console.log('   ✅ No orgs remaining in this batch!');
        console.log('');
        return;
    }
    
    console.log(`   📋 Orgs to process: ${orgsToProcess.length}`);
    console.log(`   🔍 Max queries this run: ${MAX_QUERIES_PER_RUN}`);
    console.log('');
    
    // Process orgs
    const stats = {
        orgsProcessed: 0,
        contactsCreated: 0,
        contactsUpdated: 0,
        urlsLogged: 0,
        errors: 0
    };
    
    for (const org of orgsToProcess) {
        // Check if we're approaching query limit
        if (queryCount >= MAX_QUERIES_PER_RUN - 6) {  // Reserve 6 for one more org worst case
            console.log('');
            console.log('⚠️ Approaching query limit. Stopping to stay under free tier.');
            break;
        }
        
        console.log('────────────────────────────────────────');
        console.log(`🏢 ${org.name}`);
        console.log(`   🌐 ${org.website}`);
        console.log('');
        
        try {
            const result = await discoverContactsForOrg(org);
            
            stats.orgsProcessed++;
            stats.contactsCreated += result.contactsCreated;
            stats.contactsUpdated += result.contactsUpdated;
            stats.urlsLogged += result.urlsLogged;
            
            // Create scan log entry
            await createScanLogEntry(org, result);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            stats.errors++;
        }
        
        console.log('');
    }
    
    // Print summary
    printSummary(stats, orgsToProcess.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT DISCOVERY FOR SINGLE ORG
// ═══════════════════════════════════════════════════════════════════════════════

async function discoverContactsForOrg(org) {
    const result = {
        contactsCreated: 0,
        contactsUpdated: 0,
        urlsLogged: 0,
        contactsFound: [],
        urlsForManualReview: []
    };
    
    const domain = extractDomain(org.website);
    if (!domain) {
        console.log('   ⚠️ Could not extract domain from website');
        return result;
    }
    
    // Get existing contacts for this org
    const existingContacts = await getExistingContacts(org.id);
    
    // Search for each contact type
    for (const contactType of CONTACT_TYPES) {
        console.log(`   🔍 Searching for ${contactType.type}...`);
        
        const contactResult = await searchForContactType(domain, contactType, existingContacts, org.id);
        
        if (contactResult.created) {
            result.contactsCreated++;
            result.contactsFound.push(contactResult.contact);
            console.log(`      ✅ Created: ${contactResult.contact.email}`);
        } else if (contactResult.updated) {
            result.contactsUpdated++;
            console.log(`      🔄 Updated: ${contactResult.contact.email}`);
        } else if (contactResult.urlForReview) {
            result.urlsLogged++;
            result.urlsForManualReview.push({
                type: contactType.type,
                url: contactResult.urlForReview
            });
            console.log(`      📝 URL logged for manual review`);
        } else {
            console.log(`      ℹ️ No contact found`);
        }
        
        await sleep(500);  // Brief pause between contact type searches
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH FOR SPECIFIC CONTACT TYPE
// ═══════════════════════════════════════════════════════════════════════════════

async function searchForContactType(domain, contactType, existingContacts, orgId) {
    const result = {
        created: false,
        updated: false,
        contact: null,
        urlForReview: null
    };
    
    // Build search query
    const searchTerm = contactType.searchTerms[0];
    const query = `site:${domain} ${searchTerm} email`;
    
    // Execute search
    const searchResults = await executeGoogleSearch(query);
    
    if (!searchResults || searchResults.length === 0) {
        return result;
    }
    
    // Try to extract contact info from snippets
    let extractedContact = extractContactFromSnippets(searchResults, contactType);
    
    // If we found a name but no email, try recursive search
    if (extractedContact.name && !extractedContact.email) {
        console.log(`      🔄 Found name "${extractedContact.name}", searching for email...`);
        
        const emailQuery = `"${extractedContact.name}" ${domain} email`;
        const emailResults = await executeGoogleSearch(emailQuery);
        
        if (emailResults && emailResults.length > 0) {
            const emailFromRecursive = extractEmailFromSnippets(emailResults);
            if (emailFromRecursive) {
                extractedContact.email = emailFromRecursive;
            }
        }
    }
    
    // If we still don't have an email, log the URL for manual review
    if (!extractedContact.email) {
        if (searchResults[0] && searchResults[0].link) {
            result.urlForReview = searchResults[0].link;
        }
        return result;
    }
    
    // Check if this contact already exists
    const existingContact = existingContacts.find(c => 
        c.email.toLowerCase() === extractedContact.email.toLowerCase()
    );
    
    if (existingContact) {
        // Update existing contact
        const updates = buildContactUpdates(existingContact, extractedContact, contactType.type);
        if (Object.keys(updates).length > 0) {
            await updateContact(existingContact.id, updates);
            result.updated = true;
            result.contact = { ...existingContact, ...updates };
        }
    } else {
        // Create new contact
        const newContact = {
            name: extractedContact.name || '',
            email: extractedContact.email,
            phone: extractedContact.phone || '',
            title: extractedContact.title || '',
            organization: orgId,
            contact_type: contactType.type,
            source: 'Google Search snippet',
            notes: 'Auto-discovered by contact-discovery.js',
            last_verified: new Date().toISOString()
        };
        
        const created = await createContact(newContact);
        if (created) {
            result.created = true;
            result.contact = newContact;
        }
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACT CONTACT INFO FROM SNIPPETS
// ═══════════════════════════════════════════════════════════════════════════════

function extractContactFromSnippets(searchResults, contactType) {
    const contact = {
        name: null,
        email: null,
        phone: null,
        title: null
    };
    
    for (const result of searchResults.slice(0, 5)) {
        const text = `${result.title} ${result.snippet}`;
        
        // Extract email
        if (!contact.email) {
            const email = extractEmailFromText(text, contactType.emailPrefixes);
            if (email) {
                contact.email = email;
            }
        }
        
        // Extract phone
        if (!contact.phone) {
            const phone = extractPhoneFromText(text);
            if (phone) {
                contact.phone = phone;
            }
        }
        
        // Extract name (look for patterns like "Contact: John Smith" or "John Smith, Director")
        if (!contact.name) {
            const name = extractNameFromText(text);
            if (name) {
                contact.name = name;
            }
        }
        
        // Extract title
        if (!contact.title) {
            const title = extractTitleFromText(text);
            if (title) {
                contact.title = title;
            }
        }
    }
    
    return contact;
}

function extractEmailFromSnippets(searchResults) {
    for (const result of searchResults.slice(0, 3)) {
        const text = `${result.title} ${result.snippet}`;
        const email = extractEmailFromText(text);
        if (email) {
            return email;
        }
    }
    return null;
}

function extractEmailFromText(text, preferredPrefixes = []) {
    // Find all emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex);
    
    if (!emails || emails.length === 0) {
        return null;
    }
    
    // Filter out common false positives
    const filteredEmails = emails.filter(e => {
        const lower = e.toLowerCase();
        return !lower.includes('example.com') &&
               !lower.includes('email.com') &&
               !lower.includes('domain.com') &&
               !lower.includes('yourcompany') &&
               !lower.includes('sentry.io') &&
               !lower.includes('github.com');
    });
    
    if (filteredEmails.length === 0) {
        return null;
    }
    
    // Prefer emails with matching prefixes
    if (preferredPrefixes.length > 0) {
        for (const prefix of preferredPrefixes) {
            const preferred = filteredEmails.find(e => 
                e.toLowerCase().startsWith(prefix.toLowerCase())
            );
            if (preferred) {
                return preferred;
            }
        }
    }
    
    return filteredEmails[0];
}

function extractPhoneFromText(text) {
    // US phone patterns
    const phoneRegex = /(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : null;
}

function extractNameFromText(text) {
    // Look for patterns like "Contact: John Smith" or "Contact John Smith"
    const contactPatterns = [
        /contact:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
        /contact\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+),\s*(?:Director|Manager|Coordinator|Officer|Chief|Head|VP|President)/i
    ];
    
    for (const pattern of contactPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const name = match[1].trim();
            // Validate it looks like a real name (2-4 words, reasonable length)
            const words = name.split(/\s+/);
            if (words.length >= 2 && words.length <= 4 && name.length <= 50) {
                return name;
            }
        }
    }
    
    return null;
}

function extractTitleFromText(text) {
    const titlePatterns = [
        /(?:Director|Manager|Coordinator|Officer|Chief|Head|VP|Vice President|President|Counsel|Attorney)\s+(?:of\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/i,
        /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Director|Manager|Coordinator|Officer)/i
    ];
    
    for (const pattern of titlePatterns) {
        const match = text.match(pattern);
        if (match) {
            const title = match[0].trim();
            if (title.length <= 100) {
                return title;
            }
        }
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

async function executeGoogleSearch(query) {
    queryCount++;
    
    console.log(`      📡 Query #${queryCount}: "${query.substring(0, 50)}..."`);
    
    try {
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.set('key', GOOGLE_SEARCH_API_KEY);
        url.searchParams.set('cx', GOOGLE_SEARCH_ENGINE_ID);
        url.searchParams.set('q', query);
        url.searchParams.set('num', '5');
        
        const response = await fetchModule(url.toString());
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Search failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        await sleep(DELAY_BETWEEN_SEARCHES_MS);
        
        return (data.items || []).map(item => ({
            title: item.title || '',
            snippet: item.snippet || '',
            link: item.link || ''
        }));
        
    } catch (error) {
        console.log(`      ⚠️ Search error: ${error.message}`);
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
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
    return data.token;
}

async function fetchOrgsWithStatus(status) {
    const filter = encodeURIComponent(`status = "${status}"`);
    const response = await fetchModule(
        `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}&perPage=500&sort=name`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch organizations');
    }
    
    const data = await response.json();
    return data.items || [];
}

async function getScannedOrgIds() {
    const filter = encodeURIComponent(`scan_type = "contact-discovery"`);
    const response = await fetchModule(
        `${POCKETBASE_URL}/api/collections/scan_logs/records?filter=${filter}&perPage=500`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    
    if (!response.ok) {
        return new Set();
    }
    
    const data = await response.json();
    const ids = new Set((data.items || []).map(log => log.organization));
    return ids;
}

async function getExistingContacts(orgId) {
    const filter = encodeURIComponent(`organization = "${orgId}"`);
    const response = await fetchModule(
        `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}&perPage=100`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    
    if (!response.ok) {
        return [];
    }
    
    const data = await response.json();
    return data.items || [];
}

async function createContact(contact) {
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(contact)
            }
        );
        
        return response.ok;
    } catch (error) {
        console.log(`      ⚠️ Failed to create contact: ${error.message}`);
        return false;
    }
}

async function updateContact(contactId, updates) {
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records/${contactId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updates)
            }
        );
        
        return response.ok;
    } catch (error) {
        console.log(`      ⚠️ Failed to update contact: ${error.message}`);
        return false;
    }
}

function buildContactUpdates(existing, newData, contactType) {
    const updates = {};
    
    // Always update last_verified
    updates.last_verified = new Date().toISOString();
    
    // Add name if missing
    if (!existing.name && newData.name) {
        updates.name = newData.name;
    }
    
    // Add phone if missing
    if (!existing.phone && newData.phone) {
        updates.phone = newData.phone;
    }
    
    // Add title if missing
    if (!existing.title && newData.title) {
        updates.title = newData.title;
    }
    
    // Update contact_type if it was "Other" and we now have a better type
    if (existing.contact_type === 'Other' && contactType !== 'Other') {
        updates.contact_type = contactType;
    }
    
    return updates;
}

async function createScanLogEntry(org, result) {
    const scanLog = {
        organization: org.id,
        scan_type: 'contact-discovery',
        scan_date: new Date().toISOString(),
        poc_found: result.contactsCreated > 0 || result.contactsUpdated > 0,
        full_log: JSON.stringify({
            contactsCreated: result.contactsCreated,
            contactsUpdated: result.contactsUpdated,
            urlsLogged: result.urlsLogged,
            contactsFound: result.contactsFound,
            urlsForManualReview: result.urlsForManualReview
        })
    };
    
    try {
        await fetchModule(
            `${POCKETBASE_URL}/api/collections/scan_logs/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(scanLog)
            }
        );
    } catch (error) {
        console.log(`   ⚠️ Failed to create scan log: ${error.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function extractDomain(url) {
    if (!url) return null;
    try {
        let domain = url.toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '');
        domain = domain.split('/')[0];
        return domain;
    } catch (e) {
        return null;
    }
}

function getBatchNumber(org) {
    // Batch 4: Tech Rendering Flag
    if (org.tech_rendering_flag) {
        return 4;
    }
    // Batch 3: Tech Block Flag
    if (org.tech_block_flag) {
        return 3;
    }
    // Batch 2: TOU Flag only
    if (org.tou_flag) {
        return 2;
    }
    // Batch 1: Clean (no flags)
    return 1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function printSummary(stats, totalInBatch) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   🏢 Orgs processed: ${stats.orgsProcessed}/${totalInBatch}`);
    console.log(`   📧 Contacts created: ${stats.contactsCreated}`);
    console.log(`   🔄 Contacts updated: ${stats.contactsUpdated}`);
    console.log(`   📝 URLs logged for review: ${stats.urlsLogged}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    console.log(`   🔍 Google queries used: ${queryCount}`);
    console.log('');
    
    const remaining = totalInBatch - stats.orgsProcessed;
    if (remaining > 0) {
        console.log(`   ⏳ Remaining in batch: ${remaining}`);
        console.log('   💡 Run again tomorrow to continue');
    } else {
        console.log('   ✅ Batch complete!');
    }
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════════

main().catch(error => {
    console.error('');
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
