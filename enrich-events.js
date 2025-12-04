// ============================================================================
// enrich-events.js - AI-powered event tagging for topics and regions
// ============================================================================
// Usage: node enrich-events.js
// Requires: OPENAI_API_KEY and POCKETBASE credentials in .env
// ============================================================================

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://event-discovery-backend-production.up.railway.app';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Valid tags - must match PocketBase exactly
const VALID_TOPICS = [
    'Cybersecurity',
    'Defense Policy',
    'Intelligence',
    'Nuclear/WMD',
    'Space & Satellites',
    'AI & Emerging Tech',
    'Counterterrorism',
    'Military Operations',
    'Homeland Security',
    'Climate & Security',
    'Economic Security',
    'Diplomacy & Statecraft',
    'Careers & Professional Development'
];

const VALID_REGIONS = [
    'China',
    'Russia',
    'Middle East',
    'Indo-Pacific',
    'Europe/NATO',
    'Africa',
    'Latin America',
    'Arctic',
    'Global/Multilateral',
    'Domestic US'
];

// Topic hints for AI understanding
const TOPIC_HINTS = {
    'Cybersecurity': 'hacking, data breaches, network security, cyber warfare, ransomware, cyber attacks',
    'Defense Policy': 'military strategy, defense budget, procurement, alliances, Pentagon, DoD',
    'Intelligence': 'espionage, SIGINT, GEOINT, HUMINT, Intelligence Community, surveillance, reconnaissance, CIA, NSA, NGA',
    'Nuclear/WMD': 'nuclear weapons, nonproliferation, arms control, CBRN, missiles, deterrence',
    'Space & Satellites': 'space force, satellites, space security, GPS, orbital, launch',
    'AI & Emerging Tech': 'artificial intelligence, drones, autonomous systems, quantum, machine learning, UAV',
    'Counterterrorism': 'terrorism, extremism, radicalization, CVE, ISIS, al-Qaeda',
    'Military Operations': 'warfighting, exercises, deployments, readiness, combat, troops',
    'Homeland Security': 'border security, emergency management, critical infrastructure, FEMA, DHS',
    'Climate & Security': 'climate change, energy security, environmental threats, sustainability',
    'Economic Security': 'sanctions, trade, supply chains, economic statecraft, tariffs, CFIUS',
    'Diplomacy & Statecraft': 'foreign policy, treaties, international relations, diplomacy, State Department',
    'Careers & Professional Development': 'training, networking, job skills, leadership, career, professional'
};

// Region hints for AI understanding
const REGION_HINTS = {
    'China': 'Taiwan, Hong Kong, South China Sea, Taiwan Strait, PRC, CCP, Beijing, Xi Jinping, Chinese',
    'Russia': 'Ukraine, Baltics, Eastern Europe, Kremlin, Putin, Moscow, Russian, Soviet',
    'Middle East': 'Iran, Israel, Gaza, Palestine, Qatar, UAE, Yemen, Saudi Arabia, Gulf States, Syria, Iraq, Persian Gulf, Arabian',
    'Indo-Pacific': 'Japan, Korea, ASEAN, Australia, Pacific Islands, India, Southeast Asia, AUKUS, Quad',
    'Europe/NATO': 'EU, NATO allies, UK, France, Germany, transatlantic, European, Brussels',
    'Africa': 'Sub-Saharan, North Africa, Sahel, Horn of Africa, African',
    'Latin America': 'Central America, South America, Caribbean, Mexico, Brazil, Venezuela',
    'Arctic': 'Arctic security, polar regions, Northern Sea Route, Alaska, Greenland',
    'Global/Multilateral': 'UN, international orgs, global governance, treaties, multilateral, worldwide',
    'Domestic US': 'US internal policy, Congress, federal agencies, American, Washington DC, Capitol Hill'
};

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
    // Dynamic import for node-fetch (Node.js v18+ compatibility)
    const fetch = (await import('node-fetch')).default;
    
    console.log('════════════════════════════════════════');
    console.log('🏷️  Event Enrichment Script');
    console.log('    (AI-Powered Topic & Region Tagging)');
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
    
    // Filter events that need tagging (no topics or regions)
    const needsTagging = events.filter(e => 
        (!e.topics || e.topics.length === 0) || 
        (!e.regions || e.regions.length === 0)
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
        regions: tags.regions
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
                    content: `You are a national security events classifier. Your job is to assign topic and region tags to events. You must ONLY use tags from the provided lists. Return valid JSON only.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500
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
        return { topics: [], regions: [] };
    }
    
    // Validate tags against allowed values
    const validTopics = (parsed.topics || []).filter(t => VALID_TOPICS.includes(t));
    const validRegions = (parsed.regions || []).filter(r => VALID_REGIONS.includes(r));
    
    return {
        topics: validTopics,
        regions: validRegions
    };
}

function buildTaggingPrompt(event) {
    const topicsList = VALID_TOPICS.map(t => `- ${t} (${TOPIC_HINTS[t]})`).join('\n');
    const regionsList = VALID_REGIONS.map(r => `- ${r} (${REGION_HINTS[r]})`).join('\n');
    
    return `
Analyze this national security event and assign appropriate tags.

EVENT TITLE: ${event.title}

EVENT DESCRIPTION: ${event.description || 'No description provided'}

EVENT ORGANIZATION: ${event.organization || 'Unknown'}

═══════════════════════════════════════════════════════════════

AVAILABLE TOPICS (select all that apply):
${topicsList}

AVAILABLE REGIONS (select all that apply):
${regionsList}

═══════════════════════════════════════════════════════════════

INSTRUCTIONS:
1. Assign 1-4 topics that best describe the event's subject matter
2. Assign 0-3 regions that are the geographic focus (use "Global/Multilateral" if worldwide, leave empty if purely domestic with no specific focus)
3. Only use tags from the lists above - exact spelling required
4. If the event is a career fair or networking event, include "Careers & Professional Development"
5. If no region is specifically relevant, you may return an empty regions array

Return ONLY valid JSON in this exact format:
{
    "topics": ["Topic1", "Topic2"],
    "regions": ["Region1", "Region2"]
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
