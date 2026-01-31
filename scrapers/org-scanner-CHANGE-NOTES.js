/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORG-SCANNER.JS - CONTACT GATHERING UPDATES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * INSTRUCTIONS: These sections replace/add to the existing org-scanner.js
 * 
 * CHANGES MADE (2026-01-31):
 * - NEW: CONTACT_CATEGORIES constant with 5 categories
 * - NEW: googleQueryCount for quota tracking
 * - NEW: getExistingContactTypes() to check what contacts org already has
 * - REPLACED: gatherPOCViaGoogleSearch() now searches all 5 categories
 * - UPDATED: gatherPOC() with skip logic and forceAggressive option
 * - DEPRECATED: contact-discovery.js (functionality merged here)
 * 
 * QUOTA IMPACT:
 * - First scan: Up to 5 Google queries (one per category)
 * - Re-scan: 0 queries if org has Legal or Events contact
 * - forceAggressive: Always 5 queries
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ADD THIS: After line 111 (after CONTEXT_WINDOW = 150)
// ═══════════════════════════════════════════════════════════════════════════════

// Google Search quota tracking
let googleQueryCount = 0;

/**
 * CONTACT CATEGORIES
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
// ADD THIS: New helper function (add near other contact functions ~line 2720)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get existing contact types for an organization
 * Used to determine if we should skip contact gathering on re-scans
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
 */
function resetGoogleQueryCount() {
    googleQueryCount = 0;
}

/**
 * Get current Google query count
 */
function getGoogleQueryCount() {
    return googleQueryCount;
}


// ═══════════════════════════════════════════════════════════════════════════════
// REPLACE: gatherPOCViaGoogleSearch (around line 2387)
// ═══════════════════════════════════════════════════════════════════════════════

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
        
        // Try each search term until we find an email
        let foundForCategory = false;
        
        for (const searchTerm of category.searchTerms) {
            if (foundForCategory) break;
            
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
                
                await sleep(1000);  // Rate limit between queries
                
            } catch (error) {
                console.log(`      ⚠️ Search error: ${error.message}`);
            }
            
            // Only try first search term per category to conserve quota
            break;
        }
        
        if (!foundForCategory) {
            console.log(`      ℹ️ No ${category.type} contact found`);
        }
    }
    
    console.log(`      📊 Found ${foundContacts.length} contacts via Google Search`);
    return foundContacts;
}


// ═══════════════════════════════════════════════════════════════════════════════
// REPLACE: gatherPOC (around line 2544)
// ═══════════════════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════════════════
// ADD TO EXPORTS (around line 3870)
// ═══════════════════════════════════════════════════════════════════════════════

/*
Add these to module.exports:

    // Contact gathering (UPDATED 2026-01-31)
    gatherPOC,
    gatherPOCViaGoogleSearch,
    gatherPOCDirectFetch,
    getExistingContactTypes,        // NEW
    resetGoogleQueryCount,          // NEW
    getGoogleQueryCount,            // NEW
    CONTACT_CATEGORIES,             // NEW
    
    // Contact saving functions
    savePocContact,
    checkForDuplicateContact,
    detectEmailType,
    mapEmailTypeToContactType,
    calculateDataCompleteness,
*/


// ═══════════════════════════════════════════════════════════════════════════════
// UPDATE: scanOrganization() - contact saving section (around line 3650)
// This section should replace the existing POC saving logic
// ═══════════════════════════════════════════════════════════════════════════════

/*
FIND THIS SECTION (around line 3650):
    // ───────────────────────────────────────────────────────────────────────
    // Step 5: Gather POC Info
    // ───────────────────────────────────────────────────────────────────────

AND REPLACE THE POC SECTION WITH:
*/

async function scanOrganization_POC_SECTION_REPLACEMENT(org, result, options) {
    // ───────────────────────────────────────────────────────────────────────
    // Step 5: Gather POC Info (UPDATED 2026-01-31)
    // ───────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('Step 5: Gathering POC Contacts');
    console.log('────────────────────────────────────────────────────────────────');
    
    const pocResult = await gatherPOC(result.homepageHtml, org.website, {
        touFlag: result.touFlag,
        techBlockFlag: result.techBlockFlag,
        techRenderingFlag: result.techRenderingFlag,
        orgName: org.name,
        orgId: org.id,
        forceAggressive: options.forceAggressive || false
    });
    
    result.pocInfo = pocResult;
    result.pocSkipped = pocResult.skipped;
    result.pocContacts = pocResult.contacts || [];
    
    // Save all found contacts
    if (pocResult.contacts && pocResult.contacts.length > 0 && org.id) {
        console.log(`   💾 Saving ${pocResult.contacts.length} contacts...`);
        
        for (const contact of pocResult.contacts) {
            await savePocContact(org.id, {
                email: contact.email,
                name: contact.name,
                phone: contact.phone,
                source: contact.source
            }, 'org-scanner.js');
        }
    }
    
    // Return first contact email for backward compatibility
    if (pocResult.contacts && pocResult.contacts.length > 0) {
        result.pocEmail = pocResult.contacts[0].email;
    }
}
