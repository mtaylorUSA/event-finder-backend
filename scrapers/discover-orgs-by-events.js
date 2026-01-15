/**
 * discover-orgs-by-events.js
 * 
 * Event-Based Organization Discovery Script
 * 
 * This script discovers new organizations following the ConOp workflow:
 * 
 * PHASE A: Web Search (No Page Fetching)
 *   A1. Build "ideal event profile" from existing event embeddings
 *   A2. Generate search queries using AI
 *   A3. Search Google for candidate events (snippets only)
 *   A4. Score candidates against ideal profile
 *   A5. Extract domain from high-scoring URLs
 * 
 * PHASE B: Initial Org Scan (Page Fetching - Ethical)
 *   B1. Fetch homepage (check for 403/401 tech block)
 *   B2. Find and scan TOU page for restrictions
 *   B3. Gather POC info (from site if no restrictions, from web search if restricted)
 *   B4. AI analysis for org name and summary
 * 
 * PHASE C: Human Mission Review (happens in Admin Interface)
 * 
 * Run with: node discover-orgs-by-events.js
 * 
 * Prerequisites:
 *   - Event embeddings must exist (run generate-embeddings.js first)
 *   - GOOGLE_SEARCH_API_KEY in .env
 *   - GOOGLE_SEARCH_ENGINE_ID in .env
 * 
 * Version: 2026-01-12-v2
 *   - Added safe words (summit, conference, forum, symposium) to override training/certification exclusions
 *   - Added foreign policy/affairs/relations to search queries
 *   - Added root domain duplicate detection (billington subdomains)
 *   - Added university department/center extraction for .edu domains
 *   - Added retail/hospitality exclusions
 *   - Added university event exclusions (orientation, open house)
 */

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// Discovery settings
const MAX_QUERIES = 5;                    // Number of search queries to run
const MAX_RESULTS_PER_QUERY = 10;         // Results per query (max 10 for free tier)
const SIMILARITY_THRESHOLD = 0.40;        // Minimum similarity score (0-1)
const MAX_NOMINATIONS = 10;               // Max orgs to nominate per run

// Safe words - if title contains these, override certain exclusions
// This allows "SANS Cyber Threat Intelligence Summit" through even if snippet has "training"
const SAFE_WORDS = [
    'summit',
    'conference',
    'forum',
    'symposium'
];

// Keywords that can be overridden by safe words
const OVERRIDABLE_EXCLUSIONS = [
    'training',
    'certification',
    'certified'
];

// Event exclusion keywords - skip candidates containing these
// NOTE: These filter EVENTS, not organizations
const EVENT_EXCLUSION_KEYWORDS = [
    // Training/Certification (can be overridden by safe words)
    'training',
    'certification',
    'certified',
    'certificate program',
    'bootcamp',
    'boot camp',
    'workshop training',
    'hands-on lab',
    
    // Books/Articles/Papers
    'book review',
    'book club',
    'reading group',
    'paper review',
    'article review',
    'research paper',
    'journal club',
    'literature review',
    'book discussion',
    'author talk',
    'book signing',
    
    // Political exclusions
    'republican',
    'democrat',
    'gop',
    'dnc',
    'rnc',
    'trump',
    'biden',
    'obama',
    'clinton',
    'desantis',
    'newsom',
    'campaign rally',
    'political party',
    'election campaign',
    'vote for',
    'partisan',
    
    // Aggregator/List pages (not actual events)
    'conferences to attend',
    'top conferences',
    'best conferences',
    'conference list',
    'calendar of events',
    'event calendar',
    'upcoming events',
    'events list',
    'over 3.4k',
    'over 1k',
    'over 2k',
    
    // Webinars (per user preference)
    'webinar',
    'webinar series',
    'web seminar',
    'online seminar',
    
    // Academic/Education focused (not NatSec practitioner events)
    // NOTE: Removed 'consortium' per user feedback - it catches relevant intel orgs
    'provost',
    'studies program',
    'graduate program',
    'undergraduate',
    'faculty',
    'curriculum',
    'academic conference',
    'student conference',
    
    // University events (not relevant) - Added 2026-01-12-v2
    'orientation',
    'open house',
    'campus visit',
    'campus tour',
    'admitted students',
    'prospective students',
    'commencement',
    'graduation ceremony',
    'alumni reunion',
    
    // Industry/Vocational (not NatSec events)
    'grant program',
    'state-funded',
    'careers',
    'job fair',
    'hiring event',
    'recruitment',
    
    // Healthcare/Nutrition (without NatSec angle)
    'hipaa',
    'healthcare conference',
    'medical conference',
    'nursing conference',
    'hospital',
    'patient care',
    'clinical',
    'nutrition',
    'food security',     // Different from national security
    'anti-hunger',
    'wic program',
    'food assistance',
    'dietary',
    'health summit',     // Generic health, not health security
    'wellness',
    'mental health',     // Unless cybersecurity/defense context
    'pharmaceutical',
    'drug policy',       // Unless national security context
    'medicare',
    'medicaid',
    'healthcare policy',
    'public health',     // Unless biosecurity context
    
    // Retail/Hospitality (not NatSec) - Added 2026-01-12-v2
    'retail',
    'hospitality',
    'retail and hospitality',
    'retail industry',
    'hospitality industry',
    'hotel',
    'restaurant',
    'consumer goods'
];

// TOU restriction keywords (from ConOp)
const TOU_RESTRICTION_KEYWORDS = [
    'automated access',
    'automated means',
    'bots, spiders, scrapers',
    'bot, spider, scraper',
    'crawlers',
    'data mining',
    'data harvesting',
    'systematic retrieval',
    'systematic collection',
    'machine-readable copies',
    'crawling prohibited',
    'robotic process',
    'robotic access',
    'scraping',
    'web scraping',
    'automated data collection',
    'automated queries',
    'programmatic access'
];

// Common TOU page URL patterns
const TOU_URL_PATTERNS = [
    '/terms',
    '/terms-of-use',
    '/terms-of-service',
    '/tos',
    '/legal',
    '/legal/terms',
    '/privacy',
    '/privacy-policy',
    '/acceptable-use',
    '/user-agreement'
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
    const fetch = (await import('node-fetch')).default;
    
    console.log('════════════════════════════════════════════════════════════');
    console.log('🔍 Event-Based Organization Discovery');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Workflow: Phase A (Search) → Phase B (TOU Scan) → Phase C (Human Review)');
    console.log('');

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 0: Validate environment
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🔐 Validating environment...');
    
    const missing = [];
    if (!POCKETBASE_URL) missing.push('POCKETBASE_URL');
    if (!POCKETBASE_ADMIN_EMAIL) missing.push('POCKETBASE_ADMIN_EMAIL');
    if (!POCKETBASE_ADMIN_PASSWORD) missing.push('POCKETBASE_ADMIN_PASSWORD');
    if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
    if (!GOOGLE_SEARCH_API_KEY) missing.push('GOOGLE_SEARCH_API_KEY');
    if (!GOOGLE_SEARCH_ENGINE_ID) missing.push('GOOGLE_SEARCH_ENGINE_ID');
    
    if (missing.length > 0) {
        console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
        console.error('   Add these to your .env file');
        process.exit(1);
    }
    console.log('   ✅ All environment variables present');

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Authenticate with PocketBase
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('📡 Step 1: Connecting to PocketBase...');
    console.log('────────────────────────────────────────────────────────────');
    
    let authToken;
    try {
        const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identity: POCKETBASE_ADMIN_EMAIL,
                password: POCKETBASE_ADMIN_PASSWORD
            })
        });
        
        if (!authResponse.ok) {
            throw new Error('Authentication failed');
        }
        
        const authData = await authResponse.json();
        authToken = authData.token;
        console.log('   ✅ Authenticated successfully');
    } catch (error) {
        console.error('   ❌ Authentication failed:', error.message);
        process.exit(1);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Fetch existing data
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('📡 Step 2: Fetching existing data...');
    console.log('────────────────────────────────────────────────────────────');
    
    // Fetch events
    const eventsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?perPage=500`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];
    console.log(`   ✅ Found ${events.length} events`);
    
    // Fetch embeddings
    const embeddingsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/event_embeddings/records?perPage=500`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    const embeddingsData = await embeddingsResponse.json();
    const embeddings = embeddingsData.items || [];
    console.log(`   ✅ Found ${embeddings.length} event embeddings`);
    
    if (embeddings.length === 0) {
        console.error('');
        console.error('❌ No embeddings found! Run generate-embeddings.js first.');
        process.exit(1);
    }
    
    // Fetch existing organizations (for deduplication)
    const orgsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records?perPage=500`,
        { headers: { 'Authorization': `Bearer ${authToken}` } }
    );
    const orgsData = await orgsResponse.json();
    const existingOrgs = orgsData.items || [];
    console.log(`   ✅ Found ${existingOrgs.length} existing organizations`);
    
    // Build set of existing domains for deduplication
    // Also track ROOT domains for catching subdomains (e.g., billington subdomains)
    const existingDomains = new Set();
    const existingRootDomains = new Set();
    existingOrgs.forEach(org => {
        if (org.source_id) {
            existingDomains.add(org.source_id.toLowerCase());
            existingRootDomains.add(extractRootDomain(org.source_id));
        }
        if (org.website) {
            const domain = extractDomain(org.website);
            if (domain) {
                existingDomains.add(domain.toLowerCase());
                existingRootDomains.add(extractRootDomain(domain));
            }
        }
    });
    console.log(`   ✅ Tracking ${existingDomains.size} existing domains`);
    console.log(`   ✅ Tracking ${existingRootDomains.size} root domains`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE A: WEB SEARCH (No Page Fetching)
    // ═══════════════════════════════════════════════════════════════════════
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('🅰️  PHASE A: Web Search (Snippets Only)');
    console.log('════════════════════════════════════════════════════════════');

    // ─────────────────────────────────────────────────────────────────────────
    // A1: Build Ideal Event Profile (centroid)
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('📊 A1: Building ideal event profile...');
    console.log('────────────────────────────────────────────────────────────');
    
    const idealProfile = calculateCentroid(embeddings.map(e => e.embedding));
    console.log(`   ✅ Created centroid from ${embeddings.length} embeddings`);
    console.log(`   ✅ Vector dimensions: ${idealProfile.length}`);

    // ─────────────────────────────────────────────────────────────────────────
    // A2: Generate search queries
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('🤖 A2: Generating search queries...');
    console.log('────────────────────────────────────────────────────────────');
    
    const queries = await generateSearchQueries(fetch, events);
    console.log(`   ✅ Generated ${queries.length} search queries:`);
    queries.forEach((q, i) => console.log(`      ${i + 1}. "${q}"`));

    // ─────────────────────────────────────────────────────────────────────────
    // A3: Execute web searches
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('🌐 A3: Searching the web...');
    console.log('────────────────────────────────────────────────────────────');
    
    const allCandidates = [];
    // Track root domains nominated in THIS run to prevent duplicates like billington subdomains
    const nominatedRootDomains = new Set();
    
    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        console.log(`   📡 Searching: "${query}"...`);
        
        try {
            const results = await executeGoogleSearch(fetch, query);
            console.log(`      ✅ Found ${results.length} results`);
            
            for (const result of results) {
                const domain = extractDomain(result.link);
                const rootDomain = extractRootDomain(domain);
                
                // Skip if domain already tracked in database
                if (domain && existingDomains.has(domain.toLowerCase())) {
                    console.log(`      ⏭️  Skip (already tracked): ${domain}`);
                    continue;
                }
                
                // Skip if ROOT domain already tracked (catches subdomains of existing orgs)
                if (rootDomain && existingRootDomains.has(rootDomain)) {
                    console.log(`      ⏭️  Skip (root domain tracked): ${domain} → ${rootDomain}`);
                    continue;
                }
                
                // Skip if root domain already nominated in this run
                if (rootDomain && nominatedRootDomains.has(rootDomain)) {
                    console.log(`      ⏭️  Skip (root domain already nominated): ${domain} → ${rootDomain}`);
                    continue;
                }
                
                // Skip if already in candidates (exact domain match)
                if (allCandidates.some(c => c.domain === domain)) {
                    continue;
                }
                
                // Check exclusion keywords (with safe word override)
                const exclusionCheck = shouldExcludeCandidate(result.title, result.snippet);
                if (exclusionCheck.exclude) {
                    console.log(`      ⏭️  Skip (excluded: "${exclusionCheck.reason}"): ${result.title.substring(0, 40)}...`);
                    console.log(`         📝 Snippet: "${result.snippet.substring(0, 100)}..."`);
                    continue;
                }
                
                allCandidates.push({
                    title: result.title,
                    snippet: result.snippet,
                    url: result.link,
                    domain: domain,
                    rootDomain: rootDomain,
                    query: query
                });
                
                // Track this root domain to prevent duplicates in this run
                if (rootDomain) {
                    nominatedRootDomains.add(rootDomain);
                }
            }
            
            // Rate limiting between queries
            await sleep(1000);
            
        } catch (error) {
            console.log(`      ❌ Search error: ${error.message}`);
        }
    }
    
    console.log(`   ✅ Found ${allCandidates.length} unique candidates (after dedup)`);

    // ─────────────────────────────────────────────────────────────────────────
    // A4: Score candidates against ideal profile
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('📊 A4: Scoring candidates (using snippets)...');
    console.log('────────────────────────────────────────────────────────────');
    
    const scoredCandidates = [];
    
    for (let i = 0; i < allCandidates.length; i++) {
        const candidate = allCandidates[i];
        const progress = `[${i + 1}/${allCandidates.length}]`;
        
        console.log(`   ${progress} Scoring: "${candidate.title.substring(0, 50)}..."`);
        
        try {
            // Generate embedding for candidate (using title + snippet only)
            const textToEmbed = `${candidate.title} ${candidate.snippet}`;
            const candidateEmbedding = await generateEmbedding(fetch, textToEmbed);
            
            // Calculate similarity
            const similarity = cosineSimilarity(idealProfile, candidateEmbedding);
            candidate.similarity = similarity;
            candidate.similarityPercent = Math.round(similarity * 100);
            
            console.log(`      📊 Similarity: ${candidate.similarityPercent}%`);
            
            if (similarity >= SIMILARITY_THRESHOLD) {
                console.log(`      ✅ Above threshold (${SIMILARITY_THRESHOLD * 100}%)`);
                scoredCandidates.push(candidate);
            } else {
                console.log(`      ⏭️  Below threshold`);
            }
            
            // Rate limiting
            await sleep(200);
            
        } catch (error) {
            console.log(`      ❌ Scoring error: ${error.message}`);
        }
    }
    
    // Sort by similarity (highest first)
    scoredCandidates.sort((a, b) => b.similarity - a.similarity);
    
    console.log(`   ✅ ${scoredCandidates.length} candidates passed threshold`);

    // A5: Extract domains (already done during search)

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE B: INITIAL ORG SCAN (Page Fetching - Ethical)
    // ═══════════════════════════════════════════════════════════════════════
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('🅱️  PHASE B: Initial Org Scan (TOU + Tech Block Check)');
    console.log('════════════════════════════════════════════════════════════');
    
    if (scoredCandidates.length === 0) {
        console.log('   ℹ️  No candidates to scan.');
        console.log('   💡 Try lowering SIMILARITY_THRESHOLD or running more queries.');
        printSummary(0, 0, 0, 0, 0, 0);
        return;
    }
    
    const nominations = scoredCandidates.slice(0, MAX_NOMINATIONS);
    const scanResults = [];
    
    for (let i = 0; i < nominations.length; i++) {
        const candidate = nominations[i];
        const progress = `[${i + 1}/${nominations.length}]`;
        
        console.log('');
        console.log(`────────────────────────────────────────────────────────────`);
        console.log(`${progress} Scanning: ${candidate.domain}`);
        // Show triggering event in console output
        console.log(`    📄 Triggered by event: "${candidate.title.substring(0, 70)}${candidate.title.length > 70 ? '...' : ''}"`);
        console.log(`    🔗 Event URL: ${candidate.url}`);
        console.log(`    📊 Similarity: ${candidate.similarityPercent}%`);
        console.log(`────────────────────────────────────────────────────────────`);
        
        const scanResult = await performInitialOrgScan(fetch, candidate);
        scanResults.push(scanResult);
        
        // Log scan results
        console.log(`   📊 Scan Results:`);
        console.log(`      • Org Name: ${scanResult.orgName}`);
        if (scanResult.orgType) {
            console.log(`      • Org Type: ${scanResult.orgType}`);
        }
        console.log(`      • Tech Block: ${scanResult.techBlockFlag ? '⚠️ YES (403/401)' : '✅ No'}`);
        console.log(`      • TOU Flag: ${scanResult.touFlag ? '⚠️ YES (restrictions found)' : '✅ No restrictions'}`);
        if (scanResult.touNotes) {
            console.log(`      • TOU Notes: ${scanResult.touNotes.substring(0, 100)}...`);
        }
        if (scanResult.pocInfo) {
            console.log(`      • POC Found: ${scanResult.pocInfo.email || scanResult.pocInfo.name || 'Partial info'}`);
        }
        if (scanResult.aiSummary) {
            console.log(`      • 🤖 AI Summary: ${scanResult.aiSummary.substring(0, 150)}...`);
        }
        
        // Respectful delay between scans
        await sleep(2000);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // B5: Create nomination records
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log('💾 B5: Creating nomination records...');
    console.log('────────────────────────────────────────────────────────────');
    
    let savedCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let touFlagCount = 0;
    let techBlockCount = 0;
    
    for (const result of scanResults) {
        console.log(`   💾 Nominating: ${result.orgName || result.domain}`);
        
        try {
            // Create organization record with all gathered info
            const orgRecord = {
                name: result.orgName || result.domain,
                website: `https://${result.domain}`,
                source_id: result.domain,
                description: result.description || '',
                org_type: result.orgType || '',
                status: 'Nominated (Pending Mission Review)',
                discovery_method: 'event-based',
                triggering_event_title: result.triggeringEventTitle.substring(0, 500),
                triggering_event_snippet: (result.snippet || '').substring(0, 500),
                triggering_event_score: result.triggeringEventScore,
                triggering_event_url: result.triggeringEventUrl,
                tou_flag: result.touFlag,
                tech_block_flag: result.techBlockFlag,
                tou_notes: result.touNotes || '',
                tou_url: result.touUrl || '',
                tou_scanned_date: new Date().toISOString(),
                ai_reasoning: result.aiSummary || `Discovered via event: "${result.triggeringEventTitle}"`,
                discovered_date: new Date().toISOString(),
                scraping_enabled: false
            };
            
            const saveResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(orgRecord)
                }
            );
            
            if (!saveResponse.ok) {
                const errorData = await saveResponse.json();
                // Check if duplicate
                if (errorData.data?.source_id?.code === 'validation_not_unique') {
                    console.log(`      ⏭️  Already exists, skipping`);
                    skipCount++;
                    continue;
                }
                throw new Error(JSON.stringify(errorData));
            }
            
            const savedOrg = await saveResponse.json();
            
            // Save POC contact if we have info
            if (result.pocInfo && (result.pocInfo.email || result.pocInfo.name)) {
                await savePocContact(fetch, authToken, savedOrg.id, result.pocInfo);
            }
            
            // Log result with flags
            let flagStatus = '';
            if (result.touFlag) {
                flagStatus += ' ⚠️ TOU';
                touFlagCount++;
            }
            if (result.techBlockFlag) {
                flagStatus += ' ⚠️ TECH_BLOCK';
                techBlockCount++;
            }
            if (!flagStatus) flagStatus = ' ✅';
            
            console.log(`      ✅ Saved (score: ${result.triggeringEventScore}%)${flagStatus}`);
            savedCount++;
            
            // Add to existing domains to prevent duplicates in this run
            existingDomains.add(result.domain.toLowerCase());
            
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
            errorCount++;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────────────────────────────────────
    
    printSummary(queries.length, allCandidates.length, scoredCandidates.length, 
                 savedCount, skipCount, errorCount, touFlagCount, techBlockCount);
}

// ============================================================================
// PHASE B HELPER FUNCTIONS
// ============================================================================

/**
 * Perform Initial Org Scan (Phase B)
 * - B1: Fetch homepage (check for tech block)
 * - B2: Find and scan TOU page
 * - B3: Gather POC info
 * - B4: AI analysis for org name and summary
 */
async function performInitialOrgScan(fetch, candidate) {
    const result = {
        domain: candidate.domain,
        orgName: '',
        orgType: '',
        description: '',
        aiSummary: '',
        touFlag: false,
        techBlockFlag: false,
        touNotes: '',
        touUrl: '',
        pocInfo: null,
        triggeringEventTitle: candidate.title,
        triggeringEventScore: candidate.similarityPercent,
        triggeringEventUrl: candidate.url,
        searchQuery: candidate.query,
        snippet: candidate.snippet
    };
    
    const baseUrl = `https://${candidate.domain}`;
    const isEduDomain = candidate.domain.endsWith('.edu');
    
    // ─────────────────────────────────────────────────────────────────────
    // B1: Fetch homepage (check for tech block)
    // ─────────────────────────────────────────────────────────────────────
    
    console.log(`   📡 B1: Fetching homepage...`);
    
    let homepageHtml = '';
    try {
        const response = await fetch(baseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 15000
        });
        
        if (response.status === 403 || response.status === 401) {
            console.log(`      ⚠️ Technical block detected (${response.status})`);
            result.techBlockFlag = true;
            result.touFlag = true;  // Implied restriction
            result.touNotes = `Technical block: ${response.status} ${response.statusText} response from homepage`;
            
            // Search web for org info when blocked
            console.log(`      🔍 Searching web for organization info...`);
            const webOrgInfo = await searchForOrgInfo(fetch, candidate.domain, candidate.title, isEduDomain);
            result.orgName = webOrgInfo.orgName || candidate.domain;
            result.orgType = webOrgInfo.orgType || '';
            result.aiSummary = webOrgInfo.summary || `Unable to analyze - site returned ${response.status} error. Discovered via event: "${candidate.title}"`;
            
            // Search for POC via web
            result.pocInfo = await searchForPocInfo(fetch, candidate.domain);
            return result;
        }
        
        if (!response.ok) {
            console.log(`      ⚠️ Homepage returned ${response.status}`);
            result.touNotes = `Homepage returned ${response.status} ${response.statusText}`;
            
            // Try web search for info
            const webOrgInfo = await searchForOrgInfo(fetch, candidate.domain, candidate.title, isEduDomain);
            result.orgName = webOrgInfo.orgName || candidate.domain;
            result.orgType = webOrgInfo.orgType || '';
            result.aiSummary = webOrgInfo.summary || `Unable to analyze - site returned ${response.status} error. Discovered via event: "${candidate.title}"`;
        } else {
            homepageHtml = await response.text();
            console.log(`      ✅ Homepage fetched (${homepageHtml.length} bytes)`);
            
            // Get basic info from meta tags (fallback)
            result.description = extractMetaDescription(homepageHtml);
        }
        
    } catch (error) {
        console.log(`      ⚠️ Homepage fetch error: ${error.message}`);
        result.touNotes = `Homepage fetch error: ${error.message}`;
        
        // Try web search for info
        const webOrgInfo = await searchForOrgInfo(fetch, candidate.domain, candidate.title, isEduDomain);
        result.orgName = webOrgInfo.orgName || candidate.domain;
        result.orgType = webOrgInfo.orgType || '';
        result.aiSummary = webOrgInfo.summary || `Unable to analyze - fetch error: ${error.message}. Discovered via event: "${candidate.title}"`;
        result.pocInfo = await searchForPocInfo(fetch, candidate.domain);
        return result;
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // B2: Find and scan TOU page
    // ─────────────────────────────────────────────────────────────────────
    
    console.log(`   📡 B2: Scanning for TOU restrictions...`);
    
    // Try to find TOU page URL from homepage
    const touUrl = findTouUrl(homepageHtml, baseUrl);
    
    if (touUrl) {
        result.touUrl = touUrl;
        console.log(`      📄 Found TOU page: ${touUrl}`);
        
        try {
            const touResponse = await fetch(touUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                },
                timeout: 10000
            });
            
            if (touResponse.ok) {
                const touHtml = await touResponse.text();
                const scanResult = scanForRestrictions(touHtml);
                
                if (scanResult.found) {
                    result.touFlag = true;
                    result.touNotes = `[TOU] Restrictions found: ${scanResult.keywords.join(', ')}`;
                    console.log(`      ⚠️ TOU restrictions found: ${scanResult.keywords.join(', ')}`);
                } else {
                    result.touNotes = 'Reviewed TOU page - no scraping restrictions found';
                    console.log(`      ✅ No TOU restrictions found`);
                }
            } else {
                console.log(`      ⚠️ TOU page returned ${touResponse.status}`);
            }
            
        } catch (error) {
            console.log(`      ⚠️ TOU fetch error: ${error.message}`);
        }
    } else {
        console.log(`      ℹ️ No TOU page link found on homepage`);
        
        // Try common TOU URL patterns
        for (const pattern of TOU_URL_PATTERNS.slice(0, 3)) {
            const testUrl = `${baseUrl}${pattern}`;
            try {
                const response = await fetch(testUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    timeout: 5000
                });
                
                if (response.ok) {
                    result.touUrl = testUrl;
                    const html = await response.text();
                    const scanResult = scanForRestrictions(html);
                    
                    if (scanResult.found) {
                        result.touFlag = true;
                        result.touNotes = `[TOU] Restrictions found at ${pattern}: ${scanResult.keywords.join(', ')}`;
                        console.log(`      ⚠️ Found restrictions at ${pattern}`);
                    } else {
                        result.touNotes = `Reviewed ${pattern} - no scraping restrictions found`;
                        console.log(`      ✅ Checked ${pattern} - no restrictions`);
                    }
                    break;
                }
            } catch (e) {
                // Continue to next pattern
            }
        }
        
        if (!result.touUrl) {
            result.touNotes = 'No TOU page found - unable to verify restrictions';
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // B3: Gather POC info
    // ─────────────────────────────────────────────────────────────────────
    
    console.log(`   📡 B3: Gathering POC info...`);
    
    if (result.touFlag || result.techBlockFlag) {
        // Use web search for POC (don't fetch more pages from restricted site)
        console.log(`      ℹ️ TOU/Block detected - using web search for POC`);
        result.pocInfo = await searchForPocInfo(fetch, candidate.domain);
    } else {
        // Try to extract POC from homepage or contact page
        result.pocInfo = extractPocFromHtml(homepageHtml);
        
        if (!result.pocInfo || !result.pocInfo.email) {
            // Try fetching contact page
            const contactUrl = findContactUrl(homepageHtml, baseUrl);
            if (contactUrl) {
                try {
                    const contactResponse = await fetch(contactUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        timeout: 10000
                    });
                    
                    if (contactResponse.ok) {
                        const contactHtml = await contactResponse.text();
                        result.pocInfo = extractPocFromHtml(contactHtml);
                    }
                } catch (e) {
                    // Ignore contact page errors
                }
            }
        }
    }
    
    if (result.pocInfo && result.pocInfo.email) {
        console.log(`      ✅ POC found: ${result.pocInfo.email}`);
    } else {
        console.log(`      ℹ️ No POC email found`);
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // B4: AI Analysis for org name and summary
    // ─────────────────────────────────────────────────────────────────────
    
    console.log(`   📡 B4: AI analysis for org name and summary...`);
    
    if (homepageHtml) {
        const aiAnalysis = await analyzeOrgWithAI(fetch, homepageHtml, candidate.domain, candidate.title, isEduDomain);
        result.orgName = aiAnalysis.orgName;
        result.orgType = aiAnalysis.orgType;
        result.aiSummary = aiAnalysis.summary;
    } else {
        result.orgName = candidate.domain;
        result.aiSummary = `Unable to analyze homepage. Discovered via event: "${candidate.title}"`;
    }
    
    return result;
}

/**
 * Find TOU page URL from homepage HTML
 */
function findTouUrl(html, baseUrl) {
    // Look for links with TOU-related text
    const patterns = [
        /href=["']([^"']*(?:terms|tos|legal|privacy|acceptable)[^"']*)["']/gi,
        /<a[^>]*>([^<]*(?:terms of|privacy|legal|acceptable use)[^<]*)<\/a>/gi
    ];
    
    for (const pattern of patterns) {
        const matches = html.matchAll(pattern);
        for (const match of matches) {
            let url = match[1];
            if (url && !url.startsWith('http')) {
                url = new URL(url, baseUrl).href;
            }
            if (url && (url.includes('term') || url.includes('legal') || url.includes('privacy'))) {
                return url;
            }
        }
    }
    
    return null;
}

/**
 * Find contact page URL from homepage HTML
 */
function findContactUrl(html, baseUrl) {
    const patterns = [
        /href=["']([^"']*contact[^"']*)["']/gi,
        /href=["']([^"']*about[^"']*)["']/gi
    ];
    
    for (const pattern of patterns) {
        const matches = html.matchAll(pattern);
        for (const match of matches) {
            let url = match[1];
            if (url && !url.startsWith('http')) {
                url = new URL(url, baseUrl).href;
            }
            return url;
        }
    }
    
    return null;
}

/**
 * Scan HTML for TOU restriction keywords
 */
function scanForRestrictions(html) {
    const lowerHtml = html.toLowerCase();
    const foundKeywords = [];
    
    for (const keyword of TOU_RESTRICTION_KEYWORDS) {
        if (lowerHtml.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
        }
    }
    
    return {
        found: foundKeywords.length > 0,
        keywords: foundKeywords
    };
}

/**
 * Extract meta description from HTML
 */
function extractMetaDescription(html) {
    const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (match) {
        return match[1].trim().substring(0, 500);
    }
    return '';
}

/**
 * Extract POC info from HTML
 */
function extractPocFromHtml(html) {
    const result = { name: '', email: '', phone: '' };
    
    // Find email addresses
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatch) {
        // Prefer contact/info/events emails
        const preferred = emailMatch.find(e => 
            e.includes('contact') || e.includes('info') || 
            e.includes('events') || e.includes('media')
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
 * Search web for POC info (used when we can't fetch their pages)
 */
async function searchForPocInfo(fetch, domain) {
    console.log(`      🔍 Searching web for POC info...`);
    
    try {
        const query = `"${domain}" contact email`;
        const results = await executeGoogleSearch(fetch, query);
        
        for (const result of results.slice(0, 3)) {
            // Look for email in snippet
            const emailMatch = result.snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
                return { email: emailMatch[0], name: '', phone: '', source: 'web_search' };
            }
        }
    } catch (e) {
        console.log(`      ⚠️ POC search failed: ${e.message}`);
    }
    
    return null;
}

/**
 * Search web for org info when site is blocked (403/401)
 */
async function searchForOrgInfo(fetch, domain, triggeringEventTitle, isEduDomain = false) {
    console.log(`      🔍 Searching web for organization info...`);
    
    try {
        const query = `"${domain}" organization about`;
        const results = await executeGoogleSearch(fetch, query);
        
        if (results.length > 0) {
            const snippets = results.slice(0, 3).map(r => `${r.title}: ${r.snippet}`).join('\n');
            
            let eduInstructions = '';
            if (isEduDomain) {
                eduInstructions = `
IMPORTANT - THIS IS A UNIVERSITY (.edu domain):
- Do NOT just return the university name
- Find the specific DEPARTMENT, CENTER, SCHOOL, or INSTITUTE that hosts this event
- Format: "Center/Department Name (University Name)"`;
            }
            
            const prompt = `Based on these search results about ${domain}, extract the organization info:

SEARCH RESULTS:
${snippets}

TRIGGERING EVENT: ${triggeringEventTitle}
${eduInstructions}

Return ONLY valid JSON:
{
  "org_name": "Full Organization Name (ACRONYM)",
  "org_type": "type here",
  "summary": "2-3 sentence summary"
}`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'You extract organization information from search results. Return only valid JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (response.ok) {
                const data = await response.json();
                let content = data.choices[0].message.content.trim();
                content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                
                const parsed = JSON.parse(content);
                console.log(`      ✅ Found org info via web search: "${parsed.org_name}"`);
                
                return {
                    orgName: parsed.org_name || domain,
                    orgType: parsed.org_type || '',
                    summary: parsed.summary || `Organization discovered via event: "${triggeringEventTitle}"`
                };
            }
        }
    } catch (e) {
        console.log(`      ⚠️ Org info search failed: ${e.message}`);
    }
    
    return {
        orgName: domain,
        orgType: '',
        summary: `Unable to gather org info - site blocked. Discovered via event: "${triggeringEventTitle}"`
    };
}

/**
 * Save POC contact to database
 */
async function savePocContact(fetch, authToken, orgId, pocInfo) {
    if (!pocInfo || !pocInfo.email) return;
    
    try {
        const contactRecord = {
            name: pocInfo.name || 'General Contact',
            email: pocInfo.email,
            phone: pocInfo.phone || '',
            organization: orgId,
            contact_type: 'Other',
            notes: pocInfo.source === 'web_search' ? 'Found via web search during discovery' : 'Extracted from website during discovery'
        };
        
        await fetch(`${POCKETBASE_URL}/api/collections/contacts/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(contactRecord)
        });
        
        console.log(`      💾 POC contact saved`);
    } catch (e) {
        console.log(`      ⚠️ Failed to save POC: ${e.message}`);
    }
}

/**
 * Use AI to analyze homepage and extract org name + summary
 */
async function analyzeOrgWithAI(fetch, html, domain, triggeringEventTitle, isEduDomain = false) {
    console.log(`      🤖 Analyzing with AI...`);
    
    const textContent = extractTextFromHtml(html);
    const truncatedText = textContent.substring(0, 4000);
    
    let eduInstructions = '';
    if (isEduDomain) {
        eduInstructions = `
IMPORTANT - THIS IS A UNIVERSITY (.edu domain):
- Do NOT just return the university name (e.g., "Christopher Newport University")
- Find the specific DEPARTMENT, CENTER, SCHOOL, or INSTITUTE that hosts this event
- Format: "Center/Department Name (University Name)"
- Example: "Center for Homeland Security Studies (Christopher Newport University)"`;
    }
    
    const prompt = `Analyze this organization's website content and extract information.

WEBSITE DOMAIN: ${domain}
TRIGGERING EVENT FOUND: ${triggeringEventTitle}
${eduInstructions}

WEBSITE CONTENT:
${truncatedText}

TASK: Extract the following information:

1. HOSTING ORGANIZATION NAME:
   - Format MUST be "Full Organization Name (ACRONYM)" if an acronym exists
   - NEVER return just an acronym like "AUVSI" or "DHS"
   - NEVER return generic page titles like "Home", "Welcome", "Events"
   - NEVER return event names as org names

2. ORGANIZATION TYPE: think tank, trade association, government agency, nonprofit, university, university center, university department, professional association, research institute, foundation, conference organizer, media organization, other

3. SUMMARY: 2-3 sentences about what this organization does and the types of events they host.

Return ONLY valid JSON:
{
  "org_name": "Full Organization Name (ACRONYM)",
  "org_type": "organization type",
  "summary": "2-3 sentence summary here."
}`;

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
                    { role: 'system', content: 'You extract organization information from website content. Always return the full organization name with acronym in parentheses if one exists. Never return just acronyms or page titles like "Home". For university websites, find the specific department or center. Return only valid JSON.' },
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
        
        let orgName = parsed.org_name || domain;
        const badPatterns = ['home', 'welcome', 'events', 'index', 'main'];
        if (badPatterns.some(p => orgName.toLowerCase() === p)) {
            console.log(`      ⚠️ AI returned bad org name "${orgName}", using domain`);
            orgName = domain;
        }
        
        console.log(`      ✅ AI extracted org: "${orgName}"`);
        
        return {
            orgName: orgName,
            orgType: parsed.org_type || '',
            summary: parsed.summary || ''
        };
        
    } catch (error) {
        console.log(`      ⚠️ AI analysis failed: ${error.message}`);
        return {
            orgName: domain.replace(/\.(com|org|net|edu|gov)$/, '').replace(/\./g, ' '),
            orgType: '',
            summary: `Organization discovered via event: ${triggeringEventTitle}`
        };
    }
}

/**
 * Extract readable text from HTML (strip tags)
 */
function extractTextFromHtml(html) {
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
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

// ============================================================================
// PHASE A HELPER FUNCTIONS
// ============================================================================

/**
 * Extract domain from URL
 */
function extractDomain(url) {
    if (!url) return '';
    try {
        let domain = url.toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '');
        domain = domain.split('/')[0];
        return domain;
    } catch (e) {
        return '';
    }
}

/**
 * Extract ROOT domain from a domain (for catching subdomains)
 */
function extractRootDomain(domain) {
    if (!domain) return '';
    
    const parts = domain.toLowerCase().split('.');
    
    if (parts.length <= 2) {
        return domain.toLowerCase();
    }
    
    const tld = parts[parts.length - 1];
    if (['edu', 'gov', 'org', 'com', 'net', 'io', 'ai'].includes(tld)) {
        return parts.slice(-2).join('.');
    }
    
    return parts.slice(-2).join('.');
}

/**
 * Calculate centroid (average) of embedding vectors
 */
function calculateCentroid(embeddings) {
    if (embeddings.length === 0) return [];
    
    const dimensions = embeddings[0].length;
    const centroid = new Array(dimensions).fill(0);
    
    for (const embedding of embeddings) {
        for (let i = 0; i < dimensions; i++) {
            centroid[i] += embedding[i];
        }
    }
    
    for (let i = 0; i < dimensions; i++) {
        centroid[i] /= embeddings.length;
    }
    
    return centroid;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have same dimensions');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (normA * normB);
}

/**
 * Generate embedding using OpenAI
 */
async function generateEmbedding(fetch, text) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: text.substring(0, 8000)
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown'}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
}

/**
 * Generate search queries using AI
 */
async function generateSearchQueries(fetch, existingEvents) {
    const sampleTitles = existingEvents
        .slice(0, 20)
        .map(e => e.title)
        .join('\n');
    
    const prompt = `You are helping discover national security events online.

EXISTING EVENT EXAMPLES:
${sampleTitles}

TASK: Generate ${MAX_QUERIES} Google search queries to find similar national security events.

REQUIREMENTS:
- Focus on: cybersecurity, defense, intelligence, homeland security, national security policy
- MUST include at least 2 queries with the word "intelligence"
- MUST include at least 1 query about "foreign policy" OR "foreign affairs" OR "foreign relations"
- Include terms like: conference, summit, forum, symposium, panel
- Include year: 2026
- Mix of broad and specific queries
- Include location terms: DC, Washington, virtual

EXCLUSIONS - Do NOT generate queries for:
- Training courses or certification programs
- Book reviews, reading groups, or paper discussions
- Political party events or named politicians
- Academic courses or bootcamps
- Webinars or online seminars
- "Top conferences" or "best events" aggregator lists
- Academic/student conferences
- Job fairs or recruitment events
- Healthcare or medical events (unless biosecurity/health security focused)
- Retail or hospitality industry events

Return ONLY a JSON array of query strings, no explanation:
["query1", "query2", ...]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You respond only with valid JSON arrays. No markdown.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to generate queries');
    }
    
    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
        return JSON.parse(content);
    } catch (e) {
        console.log('   ⚠️  Using fallback queries');
        return [
            '2026 cybersecurity conference Washington DC',
            '2026 intelligence community summit',
            'defense and intelligence forum 2026',
            'foreign policy summit 2026 DC',
            'homeland security conference 2026'
        ];
    }
}

/**
 * Execute Google Custom Search
 */
async function executeGoogleSearch(fetch, query) {
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', GOOGLE_SEARCH_API_KEY);
    url.searchParams.set('cx', GOOGLE_SEARCH_ENGINE_ID);
    url.searchParams.set('q', query);
    url.searchParams.set('num', MAX_RESULTS_PER_QUERY.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Search failed');
    }
    
    const data = await response.json();
    
    return (data.items || []).map(item => ({
        title: item.title || '',
        snippet: item.snippet || '',
        link: item.link || ''
    }));
}

/**
 * Sleep helper
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if candidate should be excluded based on title/snippet
 * Safe words in title override training/certification exclusions
 */
function shouldExcludeCandidate(title, snippet) {
    const titleLower = title.toLowerCase();
    const textToCheck = `${title} ${snippet}`.toLowerCase();
    
    // Check if title contains a safe word
    const hasSafeWord = SAFE_WORDS.some(sw => titleLower.includes(sw));
    
    for (const keyword of EVENT_EXCLUSION_KEYWORDS) {
        if (textToCheck.includes(keyword.toLowerCase())) {
            // If this is an overridable exclusion and we have a safe word in title, skip exclusion
            if (hasSafeWord && OVERRIDABLE_EXCLUSIONS.some(oe => keyword.toLowerCase().includes(oe))) {
                continue; // Don't exclude - safe word overrides
            }
            return { exclude: true, reason: keyword };
        }
    }
    
    return { exclude: false, reason: null };
}

/**
 * Print summary
 */
function printSummary(queries, candidates, passed, saved, skipped, errors, touFlags = 0, techBlocks = 0) {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   🔍 Search queries executed: ${queries}`);
    console.log(`   📄 Candidates found: ${candidates}`);
    console.log(`   ✅ Passed threshold: ${passed}`);
    console.log(`   💾 Nominations saved: ${saved}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('');
    console.log('   📋 Flag Summary:');
    console.log(`      ⚠️ TOU Restrictions: ${touFlags}`);
    console.log(`      ⚠️ Tech Blocks: ${techBlocks}`);
    console.log(`      ✅ No Issues: ${saved - touFlags - techBlocks + (touFlags > 0 && techBlocks > 0 ? Math.min(touFlags, techBlocks) : 0)}`);
    console.log('════════════════════════════════════════════════════════════');
    
    if (saved > 0) {
        console.log('');
        console.log('📋 NEXT STEPS (Phase C: Human Review):');
        console.log('   1. Open Admin Interface (admin-interface-v12.html)');
        console.log('   2. Go to "Org By Status" tab');
        console.log('   3. Filter by "Nominated (Pending Mission Review)"');
        console.log('   4. Review each nomination:');
        console.log('      • ⚠️ Check TOU Flag and Tech Block status');
        console.log('      • 📄 Review AI Reasoning for org summary');
        console.log('      • 🔗 Click triggering_event_url to view the event');
        console.log('      • 👤 Review POC info (if available)');
        console.log('   5. Decide: Approve (pursue permission) or Reject');
        console.log('');
    }
    
    console.log('✅ Discovery script completed!');
    console.log('');
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
    console.error('');
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
