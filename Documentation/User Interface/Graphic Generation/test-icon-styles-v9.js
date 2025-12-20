/**
 * test-icon-styles-v9.js
 * 
 * Generates 3 icons with:
 * - Full bleed (good from v8)
 * - Same color palette (good from v8)
 * - FEWER elements, LESS dense
 * - SMOOTH blending, not chopped blocks
 * - Seamless overlapping, gradual fades
 * 
 * Usage: node test-icon-styles-v9.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const TEST_COMBINATIONS = [
    {
        name: '01_AI_Government',
        prompt: `1960s Space Race vintage illustration.

SUBJECT: AI and government mission operations

COMPOSITION: Only 2-3 visual elements that SMOOTHLY BLEND into each other:
- A vintage computer reel or radar screen
- American flag colors/stripes
- Subtle circuit pattern

BLENDING STYLE:
- Elements GRADUALLY FADE into one another with soft edges
- NO hard edges or sharp boundaries between elements
- Like a double-exposure photograph
- Smooth gradients connecting elements
- Dreamy, seamless transitions

COLORS: Teal, navy blue, muted red/white/blue. Vintage aged print tones.

FULL BLEED: Extends to all edges, no white space.

AESTHETIC: 1960s NASA, Space Race. Vintage government posters.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    },
    {
        name: '02_Climate_Global',
        prompt: `1960s Space Race vintage illustration.

SUBJECT: Global climate negotiations

COMPOSITION: Only 2-3 visual elements that SMOOTHLY BLEND into each other:
- Earth globe
- Olive branch or leaf
- Soft cloud or atmospheric layers

BLENDING STYLE:
- Elements GRADUALLY FADE into one another with soft edges
- NO hard edges or sharp boundaries between elements
- Like a double-exposure photograph
- Smooth gradients connecting elements
- Dreamy, seamless transitions

COLORS: Ocean blue, forest green, golden sunlight, cloud white. Vintage muted tones.

FULL BLEED: Extends to all edges, no white space.

AESTHETIC: 1960s international diplomacy, Space Race era.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    },
    {
        name: '03_China_Cyber',
        prompt: `1960s Space Race vintage illustration.

SUBJECT: China cybersecurity

COMPOSITION: Only 2-3 visual elements that SMOOTHLY BLEND into each other:
- Chinese flag (red with yellow stars) - MUST be recognizable
- Digital padlock or shield shape
- Subtle circuit traces

BLENDING STYLE:
- Elements GRADUALLY FADE into one another with soft edges
- NO hard edges or sharp boundaries between elements
- Like a double-exposure photograph
- The flag colors blend seamlessly with the cyber elements
- Dreamy, seamless transitions

COLORS: Chinese flag red and yellow prominent. Purple/violet cyber accents. Vintage muted tones.

FULL BLEED: Extends to all edges, no white space.

AESTHETIC: 1960s Cold War, Space Race era.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    }
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v9');

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
    console.log('🚀 Icon Style Tester v9 - SMOOTH BLEND Style');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Fewer elements (2-3 only)');
    console.log('📌 Smooth blending, no hard edges');
    console.log('📌 Double-exposure effect');
    console.log(`📁 Output folder: ${OUTPUT_DIR}`);
    console.log('════════════════════════════════════════════════════════════\n');

    if (!OPENAI_API_KEY) {
        console.error('❌ Missing OPENAI_API_KEY in .env file');
        process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
    }

    let successCount = 0;

    for (const combo of TEST_COMBINATIONS) {
        console.log('────────────────────────────────────────────────────────────');
        console.log(`🎨 ${combo.name}`);
        
        try {
            console.log('   ⏳ Generating with DALL-E 3...');
            const imageUrl = await generateImage(combo.prompt);
            
            console.log('   📥 Downloading image...');
            const imageBuffer = await downloadImage(imageUrl);
            
            const filename = `${combo.name}.png`;
            const filepath = path.join(OUTPUT_DIR, filename);
            fs.writeFileSync(filepath, imageBuffer);
            
            console.log(`   ✅ Saved: ${filename}`);
            successCount++;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   ✅ Images generated: ${successCount} / ${TEST_COMBINATIONS.length}`);
    console.log(`   📁 Location: ${OUTPUT_DIR}`);
    console.log('════════════════════════════════════════════════════════════\n');
}

main();
