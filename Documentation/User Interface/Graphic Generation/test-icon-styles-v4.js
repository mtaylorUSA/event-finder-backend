/**
 * test-icon-styles-v4.js
 * 
 * Generates 3 sample icons in 1960s Cold War / Space Race retro style
 * based on real events from the database.
 * 
 * IMPORTANT: Icons avoid company names or logos even if in event title/description.
 * 
 * Usage: node test-icon-styles-v4.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 3 real event combinations to test
const TEST_COMBINATIONS = [
    {
        name: '01_AI_Government_Mission_Ops',
        eventTitle: 'Generative and Agentic AI: From Mission Concepts to Secure Deployment',
        eventDescription: 'Integration of AI across mission operations in government and industry',
        topicColors: 'teal, cyan, and electric blue',
        topicMotifs: 'mainframe computers, punch cards, reel-to-reel tape machines, early computer terminals, radar screens, mission control consoles with analog dials',
        themeAccents: 'government building silhouettes, American eagle motifs, official-looking emblems (but NOT real government seals)'
    },
    {
        name: '02_Climate_Global_Negotiations',
        eventTitle: 'The Future of Global Climate Negotiations',
        eventDescription: 'International diplomacy and climate security',
        topicColors: 'emerald green, deep ocean blue, and earth brown',
        topicMotifs: 'stylized globe, weather patterns, diplomatic handshake silhouettes, United Nations-style imagery, world maps, olive branches',
        themeAccents: 'international flags represented as abstract color bars, conference table silhouettes, global cooperation imagery'
    },
    {
        name: '03_China_Cyber_Threat',
        eventTitle: 'The China - Cyber Threat',
        eventDescription: 'Cybersecurity challenges from China',
        topicColors: 'electric purple, violet, warning red, and gold',
        topicMotifs: 'padlocks, shields with circuit patterns, early computer terminals, radar warning screens, transmission towers, encrypted signals',
        themeAccents: 'Chinese geographic outline, Great Wall silhouette, Eastern geometric patterns, red and gold color accents'
    }
];

// Base prompt template for 1960s Cold War / Space Race style
function buildPrompt(combo) {
    return `Create a retro vintage illustration representing: "${combo.eventTitle}"
Context: ${combo.eventDescription}

STYLE: 1960s Cold War era / Space Race aesthetic. Think vintage NASA mission posters, Cold War government publications, mid-century defense industry art, and atomic age optimism. Bold graphic design with technological wonder and urgency.

COLOR PALETTE: ${combo.topicColors}.

VISUAL ELEMENTS: ${combo.topicMotifs}. ${combo.themeAccents}.

CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge with NO white space, NO margins, NO empty corners
- Bold colored or textured background extending to ALL edges
- Vintage 1960s illustration style with strong graphic shapes
- Retro-futuristic Cold War era feeling
- Slightly faded or aged color palette like vintage print materials
- ABSOLUTELY NO text, words, letters, numbers, or logos of any kind
- ABSOLUTELY NO company names, brand names, or corporate logos
- ABSOLUTELY NO realistic human faces
- ABSOLUTELY NO official government seals, military unit insignia, or real agency logos
- Suitable for display at 80x80 pixels
- Single cohesive composition, not a collage`;
}

// Output directory for test images
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v4');

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getFetch() {
    const { default: fetch } = await import('node-fetch');
    return fetch;
}

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

async function downloadImage(url) {
    const fetch = await getFetch();
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// ============================================================================
// MAIN PROCESS
// ============================================================================

async function main() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('🚀 Icon Style Tester v4 - 1960s Cold War / Space Race');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Testing 3 real event combinations');
    console.log('⚠️  No company names or logos will be included');
    console.log(`📁 Output folder: ${OUTPUT_DIR}`);
    console.log('════════════════════════════════════════════════════════════\n');

    // Validate environment
    if (!OPENAI_API_KEY) {
        console.error('❌ Missing OPENAI_API_KEY in .env file');
        process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
    }

    let successCount = 0;

    for (const combo of TEST_COMBINATIONS) {
        console.log('────────────────────────────────────────────────────────────');
        console.log(`🎨 ${combo.eventTitle}`);
        
        const prompt = buildPrompt(combo);
        
        try {
            console.log('   ⏳ Generating with DALL-E 3...');
            const imageUrl = await generateImage(prompt);
            
            console.log('   📥 Downloading image...');
            const imageBuffer = await downloadImage(imageUrl);
            
            const filename = `${combo.name}.png`;
            const filepath = path.join(OUTPUT_DIR, filename);
            fs.writeFileSync(filepath, imageBuffer);
            
            console.log(`   ✅ Saved: ${filename}`);
            successCount++;
            
            // Delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    // Summary
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   ✅ Images generated: ${successCount} / ${TEST_COMBINATIONS.length}`);
    console.log(`   📁 Location: ${OUTPUT_DIR}`);
    console.log('════════════════════════════════════════════════════════════\n');
    console.log('👀 Open the test-icons-v4 folder to view the results!');
}

// Run
main();
