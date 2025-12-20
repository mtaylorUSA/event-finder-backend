/**
 * generate-topic-icons.js
 * 
 * Generates professional isometric icons for unique topic+region combinations
 * using DALL-E 3, then uploads them to PocketBase.
 * 
 * Usage: node generate-topic-icons.js
 * 
 * Requirements:
 *   - .env file with POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, 
 *     POCKETBASE_ADMIN_PASSWORD, OPENAI_API_KEY
 *   - npm install dotenv node-fetch (if not already installed)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Topic color descriptions for DALL-E prompts (matching your CSS)
const TOPIC_STYLES = {
    'AI & Emerging Tech': {
        colors: 'teal and cyan',
        motifs: 'circuit boards, neural networks, microchips, binary code'
    },
    'Careers & Professional Development': {
        colors: 'professional gray and slate blue',
        motifs: 'briefcase, ascending steps, handshake silhouette'
    },
    'Climate & Security': {
        colors: 'green and emerald',
        motifs: 'globe with leaves, weather patterns, earth'
    },
    'Counterterrorism': {
        colors: 'deep red and crimson',
        motifs: 'shield, crosshairs, protective barrier'
    },
    'Cybersecurity': {
        colors: 'purple and violet',
        motifs: 'digital lock, shield with circuitry, firewall'
    },
    'Defense Policy': {
        colors: 'navy blue and royal blue',
        motifs: 'shield, eagle silhouette, stars'
    },
    'Diplomacy & Statecraft': {
        colors: 'purple and lavender',
        motifs: 'handshake, olive branch, diplomatic seal'
    },
    'Economic Security': {
        colors: 'gold and amber',
        motifs: 'currency symbols, trade routes, financial charts'
    },
    'Homeland Security': {
        colors: 'dark blue and indigo',
        motifs: 'house with shield, protective dome, homeland outline'
    },
    'Intelligence': {
        colors: 'dark charcoal and slate gray',
        motifs: 'eye, satellite, data streams, shadowy figure'
    },
    'Military Operations': {
        colors: 'military green and forest green',
        motifs: 'generic military star, tactical map, compass'
    },
    'Nuclear/WMD': {
        colors: 'orange and warning red',
        motifs: 'atom symbol, radiation trefoil, containment dome'
    },
    'Space & Satellites': {
        colors: 'deep space blue and purple',
        motifs: 'satellite, orbit rings, stars, rocket silhouette'
    }
};

// Region visual elements for DALL-E prompts
const REGION_STYLES = {
    'Africa': 'African continent silhouette, warm earth tones accent',
    'Arctic': 'ice crystals, polar imagery, white and light blue accents',
    'China': 'subtle red and gold accents, Chinese geographic outline',
    'Domestic US': 'subtle American flag colors, US map silhouette',
    'Europe/NATO': 'European continent outline, blue and gold accents',
    'Global/Multilateral': 'interconnected globe, multiple flag colors',
    'Indo-Pacific': 'Pacific ocean, island chains, blue water tones',
    'Latin America': 'South American silhouette, vibrant color accents',
    'Middle East': 'Middle Eastern geographic outline, desert gold accents',
    'Russia': 'Russian geographic outline, red and white accents'
};

let authToken = null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Dynamic import for node-fetch (ESM module)
 */
async function getFetch() {
    const { default: fetch } = await import('node-fetch');
    return fetch;
}

/**
 * Authenticate with PocketBase
 */
async function authenticate() {
    const fetch = await getFetch();
    console.log('🔐 Authenticating with PocketBase...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    authToken = data.token;
    console.log('✅ Authenticated successfully\n');
}

/**
 * Fetch all events from PocketBase
 */
async function fetchAllEvents() {
    const fetch = await getFetch();
    console.log('📡 Fetching events from PocketBase...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/collections/events/records?perPage=500`, {
        headers: { 'Authorization': authToken }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.items.length} events\n`);
    return data.items;
}

/**
 * Fetch existing topic icons from PocketBase
 */
async function fetchExistingIcons() {
    const fetch = await getFetch();
    console.log('📡 Fetching existing topic icons...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/collections/topic_icons/records?perPage=500`, {
        headers: { 'Authorization': authToken }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch icons: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.items.length} existing icons\n`);
    return data.items;
}

/**
 * Generate a unique key for a topic+region combination
 */
function generateCombinationKey(topics, regions) {
    const sortedTopics = (topics || []).slice().sort();
    const sortedRegions = (regions || []).slice().sort();
    return `${sortedTopics.join(',')}|${sortedRegions.join(',')}`;
}

/**
 * Build a DALL-E prompt for a topic+region combination
 */
function buildDallePrompt(topics, regions) {
    const topicList = topics || [];
    const regionList = regions || [];
    
    // Gather style elements from topics
    let colors = [];
    let motifs = [];
    
    for (const topic of topicList) {
        const style = TOPIC_STYLES[topic];
        if (style) {
            colors.push(style.colors);
            motifs.push(style.motifs);
        }
    }
    
    // Gather region elements
    let regionElements = [];
    for (const region of regionList) {
        const style = REGION_STYLES[region];
        if (style) {
            regionElements.push(style);
        }
    }
    
    // Build the prompt
    const colorString = colors.length > 0 ? colors.join(' blended with ') : 'professional blue and gray';
    const motifString = motifs.length > 0 ? motifs.join(', ') : 'shield, globe, security symbols';
    const regionString = regionElements.length > 0 ? ` Incorporate: ${regionElements.join('; ')}.` : '';
    
    const prompt = `Create a professional isometric 3D icon for a national security event. 
Style: Clean isometric perspective with subtle depth and shadows. Corporate and professional look.
Color palette: ${colorString}.
Visual elements: ${motifString}.${regionString}
Requirements: 
- Single cohesive icon, not a collage
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Clean white or transparent background
- Suitable for 80x80 pixel display
- Modern, polished, professional appearance`;

    return prompt;
}

/**
 * Generate an image using DALL-E 3
 */
async function generateImage(prompt) {
    const fetch = await getFetch();
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`DALL-E API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.data[0].url;
}

/**
 * Download an image from URL and return as buffer
 */
async function downloadImage(url) {
    const fetch = await getFetch();
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    return buffer;
}

/**
 * Upload icon to PocketBase topic_icons collection
 */
async function uploadIcon(combinationKey, prompt, imageBuffer) {
    const fetch = await getFetch();
    const FormData = (await import('form-data')).default;
    
    const formData = new FormData();
    formData.append('topic_combination', combinationKey);
    formData.append('prompt_used', prompt);
    formData.append('icon_file', imageBuffer, {
        filename: `icon_${Date.now()}.png`,
        contentType: 'image/png'
    });

    const response = await fetch(`${POCKETBASE_URL}/api/collections/topic_icons/records`, {
        method: 'POST',
        headers: {
            'Authorization': authToken,
            ...formData.getHeaders()
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload icon: ${error}`);
    }

    const data = await response.json();
    return data;
}

/**
 * Update an event with its icon relation
 */
async function updateEventIcon(eventId, iconId) {
    const fetch = await getFetch();
    
    const response = await fetch(`${POCKETBASE_URL}/api/collections/events/records/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        body: JSON.stringify({ icon: iconId })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update event ${eventId}: ${error}`);
    }
}

// ============================================================================
// MAIN PROCESS
// ============================================================================

async function main() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('🎨 Topic Icon Generator');
    console.log('════════════════════════════════════════════════════════════\n');

    // Validate environment
    if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD || !OPENAI_API_KEY) {
        console.error('❌ Missing required environment variables.');
        console.error('   Required: POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL,');
        console.error('             POCKETBASE_ADMIN_PASSWORD, OPENAI_API_KEY');
        process.exit(1);
    }

    try {
        // Authenticate
        await authenticate();

        // Fetch data
        const events = await fetchAllEvents();
        const existingIcons = await fetchExistingIcons();

        // Build map of existing icons by combination key
        const existingIconMap = {};
        for (const icon of existingIcons) {
            existingIconMap[icon.topic_combination] = icon;
        }

        // Find unique combinations from events
        const combinationToEvents = {};
        for (const event of events) {
            // Parse topics and regions (stored as JSON arrays or comma-separated)
            let topics = event.topics;
            let regions = event.regions;
            
            // Handle if stored as string
            if (typeof topics === 'string') {
                try {
                    topics = JSON.parse(topics);
                } catch {
                    topics = topics.split(',').map(t => t.trim()).filter(t => t);
                }
            }
            if (typeof regions === 'string') {
                try {
                    regions = JSON.parse(regions);
                } catch {
                    regions = regions.split(',').map(r => r.trim()).filter(r => r);
                }
            }
            
            // Ensure arrays
            topics = Array.isArray(topics) ? topics : [];
            regions = Array.isArray(regions) ? regions : [];
            
            const key = generateCombinationKey(topics, regions);
            
            if (!combinationToEvents[key]) {
                combinationToEvents[key] = {
                    topics: topics,
                    regions: regions,
                    eventIds: []
                };
            }
            combinationToEvents[key].eventIds.push(event.id);
        }

        const uniqueCombinations = Object.keys(combinationToEvents);
        console.log(`📊 Found ${uniqueCombinations.length} unique topic+region combinations\n`);

        // Process each combination
        let generated = 0;
        let skipped = 0;
        let linked = 0;

        for (const key of uniqueCombinations) {
            const combo = combinationToEvents[key];
            const topicsDisplay = combo.topics.length > 0 ? combo.topics.join(', ') : '(no topics)';
            const regionsDisplay = combo.regions.length > 0 ? combo.regions.join(', ') : '(no regions)';
            
            console.log('────────────────────────────────────────────────────────────');
            console.log(`📌 Combination: ${topicsDisplay} | ${regionsDisplay}`);
            console.log(`   Events with this combo: ${combo.eventIds.length}`);

            let iconRecord;

            // Check if icon already exists
            if (existingIconMap[key]) {
                iconRecord = existingIconMap[key];
                console.log(`   ⏭️  Icon already exists (ID: ${iconRecord.id})`);
                skipped++;
            } else {
                // Generate new icon
                console.log('   🎨 Generating new icon with DALL-E 3...');
                
                const prompt = buildDallePrompt(combo.topics, combo.regions);
                
                try {
                    const imageUrl = await generateImage(prompt);
                    console.log('   📥 Downloading image...');
                    
                    const imageBuffer = await downloadImage(imageUrl);
                    console.log('   📤 Uploading to PocketBase...');
                    
                    iconRecord = await uploadIcon(key, prompt, imageBuffer);
                    existingIconMap[key] = iconRecord;
                    
                    console.log(`   ✅ Icon created (ID: ${iconRecord.id})`);
                    generated++;
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`   ❌ Error generating icon: ${error.message}`);
                    continue;
                }
            }

            // Link events to icon
            console.log(`   🔗 Linking ${combo.eventIds.length} events to icon...`);
            for (const eventId of combo.eventIds) {
                try {
                    await updateEventIcon(eventId, iconRecord.id);
                    linked++;
                } catch (error) {
                    console.error(`   ⚠️  Failed to link event ${eventId}: ${error.message}`);
                }
            }
        }

        // Summary
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`   🎨 Icons generated: ${generated}`);
        console.log(`   ⏭️  Icons skipped (already existed): ${skipped}`);
        console.log(`   🔗 Events linked to icons: ${linked}`);
        console.log('════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run
main();
