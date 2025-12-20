/**
 * test-icon-styles-v5.js
 * 
 * Generates 3 SIMPLE icons in 1960s Cold War / Space Race retro style.
 * SIMPLIFIED: Only 1-2 bold visual elements per icon.
 * 
 * Usage: node test-icon-styles-v5.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 3 real event combinations - SIMPLIFIED prompts
const TEST_COMBINATIONS = [
    {
        name: '01_AI_Government',
        prompt: `A simple, bold 1960s retro illustration of a stylized computer or robot head.

STYLE: 1960s Cold War era poster art. Simple, bold, graphic.

COLORS: Teal and cyan on a dark navy background.

COMPOSITION: ONE simple iconic element centered. Bold shapes, minimal detail.

CRITICAL REQUIREMENTS:
- SIMPLE - only ONE main visual element
- Fill entire frame edge-to-edge, no white space
- Bold flat colors, minimal gradients
- 1960s retro aesthetic
- NO text, words, or letters
- NO logos or brand names
- Suitable for 80x80 pixel display`
    },
    {
        name: '02_Climate_Global',
        prompt: `A simple, bold 1960s retro illustration of a stylized globe with a leaf or olive branch.

STYLE: 1960s diplomatic poster art. Simple, bold, graphic.

COLORS: Emerald green and ocean blue on a warm beige background.

COMPOSITION: ONE simple globe icon centered. Bold shapes, minimal detail.

CRITICAL REQUIREMENTS:
- SIMPLE - only ONE main visual element
- Fill entire frame edge-to-edge, no white space
- Bold flat colors, minimal gradients
- 1960s retro aesthetic
- NO text, words, or letters
- NO logos
- Suitable for 80x80 pixel display`
    },
    {
        name: '03_China_Cyber',
        prompt: `A simple, bold 1960s retro illustration combining a padlock with the red and yellow colors of the Chinese flag.

STYLE: 1960s Cold War era poster art. Simple, bold, graphic.

COLORS: Purple padlock/shield on a background using the red and yellow/gold colors of the People's Republic of China flag.

COMPOSITION: ONE simple padlock or shield icon centered against Chinese flag colors. Bold shapes, minimal detail.

CRITICAL REQUIREMENTS:
- SIMPLE - only ONE main visual element (padlock or shield)
- Background MUST use Chinese flag colors (red with yellow/gold accents)
- Fill entire frame edge-to-edge, no white space
- Bold flat colors, minimal gradients
- 1960s retro aesthetic
- NO text, words, or letters
- NO logos
- Suitable for 80x80 pixel display`
    }
];

// Output directory for test images
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v5');

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
    console.log('🚀 Icon Style Tester v5 - SIMPLIFIED 1960s Style');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Testing 3 SIMPLE icons (1-2 elements each)');
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
    console.log('👀 Open the test-icons-v5 folder to view the results!');
}

// Run
main();
