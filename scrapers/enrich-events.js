// ============================================================================
// enrich-events.js - AI-powered event tagging for topics, regions, countries, and orgs
// ============================================================================
// Usage: node enrich-events.js
// Requires: OPENAI_API_KEY and POCKETBASE credentials in .env
// ============================================================================
// Updated: 2026-01-09 - Added countries and transnational_orgs per ConOp
// ============================================================================

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://event-discovery-backend-production.up.railway.app';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Valid tags - MUST match PocketBase exactly (from ConOp lines 1637-1676)
const VALID_TOPICS = [
    'Cybersecurity',
    'Defense Policy & Intelligence',
    'Nuclear & WMD',
    'Space & Satellites',
    'AI & Emerging Technology',
    'Terrorism & Counterterrorism',
    'Military & Conflict',
    'Homeland Security',
    'Environment & Climate',
    'Economic Security',
    'Diplomacy & Statecraft',
    'Humanitarian & Societal',
    'Careers & Professional Development',
    'Government Business & Modernization'
];

const VALID_REGIONS = [
    'Africa',
    'Arctic',
    'Domestic US',
    'Europe/Eurasia',
    'East and Southeast Asia',
    'Global/Multilateral',
    'South, Pacific and Oceania',
    'Latin America',
    'Middle East',
    'South Asia'
];

const VALID_COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia',
    'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
    'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const VALID_TRANSNATIONAL_ORGS = [
    'African Union',
    'ANZUS',
    'APEC',
    'Arab League',
    'ASEAN',
    'AUKUS',
    'BRICS',
    'Caribbean Community',
    'Commonwealth of Nations',
    'European Union',
    'Five Eyes',
    'G7',
    'G20',
    'Gulf Cooperation Council',
    'International Atomic Energy Agency',
    'International Criminal Court',
    'Interpol',
    'NATO',
    'OECD',
    'OPEC',
    'Organization of American States',
    'Pacific Islands Forum',
    'Quad',
    'Shanghai Cooperation Organisation',
    'United Nations',
    'World Bank',
    'World Health Organization',
    'World Trade Organization'
];

// Topic hints for AI understanding
const TOPIC_HINTS = {
    'Cybersecurity': 'hacking, data breaches, network security, cyber warfare, ransomware, cyber attacks, CISA',
    'Defense Policy & Intelligence': 'military strategy, defense budget, procurement, alliances, Pentagon, DoD, espionage, SIGINT, GEOINT, HUMINT, Intelligence Community, surveillance, reconnaissance, CIA, NSA, NGA, NRO, DIA',
    'Nuclear & WMD': 'nuclear weapons, nonproliferation, arms control, CBRN, missiles, deterrence, atomic',
    'Space & Satellites': 'space force, satellites, space security, GPS, orbital, launch, USSF',
    'AI & Emerging Technology': 'artificial intelligence, drones, autonomous systems, quantum, machine learning, UAV, generative AI, GenAI, HPC, data analytics',
    'Terrorism & Counterterrorism': 'terrorism, extremism, radicalization, CVE, ISIS, al-Qaeda, targeted violence, threat assessment',
    'Military & Conflict': 'warfighting, exercises, deployments, readiness, combat, troops, military operations',
    'Homeland Security': 'border security, emergency management, critical infrastructure, FEMA, DHS, physical security',
    'Environment & Climate': 'climate change, energy security, environmental threats, sustainability, climate security',
    'Economic Security': 'sanctions, trade, supply chains, economic statecraft, tariffs, CFIUS, economic policy',
    'Diplomacy & Statecraft': 'foreign policy, treaties, international relations, diplomacy, State Department, ambassadors',
    'Humanitarian & Societal': 'refugees, humanitarian aid, human rights, social issues, crisis response, NGOs',
    'Careers & Professional Development': 'training, networking, job skills, leadership, career, professional development, certifications, job fair',
    'Government Business & Modernization': 'federal contracting, procurement, IT modernization, digital transformation, government technology'
};

// Region hints for AI understanding
const REGION_HINTS = {
    'Africa': 'Sub-Saharan, North Africa, Sahel, Horn of Africa, African Union, Nigeria, Kenya, South Africa, Egypt',
    'Arctic': 'Arctic security, polar regions, Northern Sea Route, Alaska, Greenland, Nordic',
    'Domestic US': 'US internal policy, Congress, federal agencies, American, Washington DC, Capitol Hill, United States domestic',
    'Europe/Eurasia': 'EU, NATO allies, UK, France, Germany, transatlantic, European, Brussels, Russia, Ukraine, Baltics, Eastern Europe, Kremlin',
    'East and Southeast Asia': 'China, Japan, Korea, ASEAN, Taiwan, Hong Kong, South China Sea, Pacific, Vietnam, Philippines, Indonesia, AUKUS, Quad',
    'Global/Multilateral': 'UN, international orgs, global governance, treaties, multilateral, worldwide, G7, G20',
    'South, Pacific and Oceania': 'Australia, New Zealand, Pacific Islands, Oceania, ANZUS',
    'Latin America': 'Central America, South America, Caribbean, Mexico, Brazil, Venezuela, Colombia',
    'Middle East': 'Iran, Israel, Gaza, Palestine, Qatar, UAE, Yemen, Saudi Arabia, Gulf States, Syria, Iraq, Persian Gulf',
    'South Asia': 'India, Pakistan, Afghanistan, Bangladesh, Sri Lanka, Nepal'
};

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
    // Dynamic import for node-fetch (Node.js v18+ compatibility)
    const fetch = (await import('node-fetch')).default;

    console.log('════════════════════════════════════════');
    console.log('🏷️  Event Enrichment Script');
    console.log('    (AI-Powered Topic, Region, Country & Org Tagging)');
    console.log('════════════════════════════════════════');

    // Validate environment
    if (!OPENAI_API_KEY) {
        console.error('❌ Missing OPENAI_API_KEY in .env');
        process.exit(1);
    }
    if (!POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.error('❌ Missing PocketBase credentials in .env');
        process.exit(1);
    }

    // Authenticate with PocketBase
    console.log('🔐 Authenticating with PocketBase...');
    const authToken = await authenticatePocketBase(fetch);
    console.log('   ✅ Authenticated successfully');

    // Fetch all events
    console.log('📥 Fetching events from PocketBase...');
    const events = await fetchEvents(fetch, authToken);
    console.log(`   ✅ Found ${events.length} events`);

    // Filter events that need tagging (no topics or missing other fields)
    const needsTagging = events.filter(e =>
        (!e.topics || e.topics.length === 0) ||
        (!e.regions || e.regions.length === 0) ||
        (!e.countries || e.countries.length === 0) ||
        (!e.transnational_orgs || e.transnational_orgs.length === 0)
    );
    console.log(`   📋 ${needsTagging.length} events need tagging`);

    if (needsTagging.length === 0) {
        console.log('════════════════════════════════════════');
        console.log('✅ All events already tagged!');
        console.log('════════════════════════════════════════');
        return;
    }

    // Process events
    console.log('────────────────────────────────────────');
    console.log('🤖 Starting AI tagging...');
    console.log('────────────────────────────────────────');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < needsTagging.length; i++) {
        const event = needsTagging[i];
        const progress = `[${i + 1}/${needsTagging.length}]`;

        try {
            console.log(`${progress} 🔍 "${event.title.substring(0, 50)}${event.title.length > 50 ? '...' : ''}"`);

            // Get AI tags
            const tags = await getAITags(fetch, event);

            // Update event in PocketBase
            await updateEvent(fetch, authToken, event.id, tags, event);

            console.log(`        ✅ Topics: ${tags.topics.join(', ') || 'None'}`);
            console.log(`        ✅ Regions: ${tags.regions.join(', ') || 'None'}`);
            console.log(`        ✅ Countries: ${tags.countries.join(', ') || 'None'}`);
            console.log(`        ✅ Orgs: ${tags.transnational_orgs.join(', ') || 'None'}`);

            successCount++;

            // Rate limiting - wait 500ms between API calls
            await sleep(500);

        } catch (error) {
            console.log(`        ❌ Error: ${error.message}`);
            errorCount++;
        }
    }

    // Summary
    console.log('────────────────────────────────────────');
    console.log('📊 SUMMARY');
    console.log('────────────────────────────────────────');
    console.log(`   ✅ Tagged: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('════════════════════════════════════════');
    console.log('✅ Enrichment script completed!');
    console.log('════════════════════════════════════════');
}

// ============================================================================
// POCKETBASE FUNCTIONS
// ============================================================================

async function authenticatePocketBase(fetch) {
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error('PocketBase authentication failed');
    }

    const data = await response.json();
    return data.token;
}

async function fetchEvents(fetch, authToken) {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?perPage=500`,
        { headers: { 'Authorization': authToken } }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.items || [];
}

async function updateEvent(fetch, authToken, eventId, tags, event) {
    // Build update payload
    const updateData = {
        topics: tags.topics,
        regions: tags.regions,
        countries: tags.countries,
        transnational_orgs: tags.transnational_orgs
    };

    // If source_id is missing, generate one
    if (!event.source_id) {
        if (event.url) {
            updateData.source_id = event.url;
        } else {
            // Generate from title + date hash
            const hashInput = `${event.title}-${event.start_date || 'nodate'}`;
            updateData.source_id = `generated-${simpleHash(hashInput)}`;
        }
    }

    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records/${eventId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(updateData)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// ============================================================================
// OPENAI FUNCTIONS
// ============================================================================

async function getAITags(fetch, event) {
    const prompt = buildTaggingPrompt(event);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a national security events classifier. Your job is to assign topic, region, country, and transnational organization tags to events. You must ONLY use tags from the provided lists - use the EXACT spelling provided. Return valid JSON only.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 800
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parse JSON response
    let parsed;
    try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleanContent);
    } catch (e) {
        console.log(`        ⚠️ JSON parse error, using empty tags`);
        return { topics: [], regions: [], countries: [], transnational_orgs: [] };
    }

    // Validate tags against allowed values
    const validTopics = (parsed.topics || []).filter(t => VALID_TOPICS.includes(t));
    const validRegions = (parsed.regions || []).filter(r => VALID_REGIONS.includes(r));
    const validCountries = (parsed.countries || []).filter(c => VALID_COUNTRIES.includes(c));
    const validOrgs = (parsed.transnational_orgs || []).filter(o => VALID_TRANSNATIONAL_ORGS.includes(o));

    return {
        topics: validTopics,
        regions: validRegions,
        countries: validCountries,
        transnational_orgs: validOrgs
    };
}

function buildTaggingPrompt(event) {
    const topicsList = VALID_TOPICS.map(t => `- "${t}" (${TOPIC_HINTS[t]})`).join('\n');
    const regionsList = VALID_REGIONS.map(r => `- "${r}" (${REGION_HINTS[r]})`).join('\n');
    
    // For countries and orgs, just list them without hints (too many)
    const countriesList = VALID_COUNTRIES.join(', ');
    const orgsList = VALID_TRANSNATIONAL_ORGS.join(', ');

    return `
Analyze this national security event and assign appropriate tags.

EVENT TITLE: ${event.title}

EVENT DESCRIPTION: ${event.description || 'No description provided'}

EVENT ORGANIZATION: ${event.organization || 'Unknown'}

════════════════════════════════════════════════════════════════

AVAILABLE TOPICS (select 1-4 that apply - USE EXACT SPELLING):
${topicsList}

AVAILABLE REGIONS (select 0-3 that apply - USE EXACT SPELLING):
${regionsList}

AVAILABLE COUNTRIES (select 0-5 specific countries mentioned or focused on):
${countriesList}

AVAILABLE TRANSNATIONAL ORGANIZATIONS (select 0-3 if specifically mentioned or relevant):
${orgsList}

════════════════════════════════════════════════════════════════

INSTRUCTIONS:
1. TOPICS: Assign 1-4 topics that best describe the event's subject matter
2. REGIONS: Assign 0-3 regions that are the geographic focus
   - Use "Domestic US" for US-focused events with no international component
   - Use "Global/Multilateral" for worldwide or multi-region events
3. COUNTRIES: Assign 0-5 specific countries ONLY if they are explicitly mentioned or the clear focus
   - Do NOT assign countries just because they're in a region
   - Only assign if the country is specifically discussed in the event
4. TRANSNATIONAL_ORGS: Assign 0-3 organizations ONLY if they are explicitly mentioned
   - Examples: NATO summit, UN General Assembly, EU policy, G7 meeting
   - Do NOT assign just because the topic might relate to an org

CRITICAL: Use EXACT tag names from the lists above - copy the exact spelling including "&" symbols and spaces.

Return ONLY valid JSON in this exact format:
{
    "topics": ["Topic1", "Topic2"],
    "regions": ["Region1"],
    "countries": ["Country1", "Country2"],
    "transnational_orgs": ["Org1"]
}
`.trim();
}

// ============================================================================
// UTILITIES
// ============================================================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
});
