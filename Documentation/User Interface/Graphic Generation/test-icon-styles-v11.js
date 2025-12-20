/**
 * test-icon-styles-v11.js
 * 
 * NEW APPROACH: Flag or color field fills ENTIRE background,
 * with simple icon overlaid on top. Matching China_Cyber success.
 * 
 * Usage: node test-icon-styles-v11.js
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

BACKGROUND: The American flag (stars and stripes) fills the ENTIRE canvas from edge to edge as the background. The flag extends beyond all edges - this is a cropped view of a larger flag. No margins. No blank space anywhere.

OVERLAY: A simple, recognizable robot head silhouette OR vintage computer monitor shape centered on the flag. The icon should be semi-transparent and blend softly with the flag behind it.

SUBTLE DETAIL: Very faint binary code (1s and 0s) ghosted in the background, barely visible.

BLENDING: The icon fades softly into the flag. Double-exposure effect. Dreamy, seamless. No hard edges.

COLORS: Red, white, blue of American flag. Icon in teal/cyan tones that blend with the flag colors.

AESTHETIC: 1960s Cold War, Space Race, vintage government poster.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    },
    {
        name: '02_Climate_Global',
        prompt: `1960s Space Race vintage illustration.

BACKGROUND: A view of Earth from space fills the ENTIRE canvas from edge to edge. Ocean blues and land greens extend beyond all edges - this is a cropped, zoomed-in view of the planet. No margins. No blank space anywhere. No black space border.

OVERLAY: A simple olive branch OR single leaf silhouette blending softly over the Earth. Semi-transparent, fading into the planet.

SUBTLE DETAIL: Soft atmospheric glow or cloud wisps, very subtle.

BLENDING: The leaf/branch fades softly into the Earth. Double-exposure effect. Dreamy, seamless. No hard edges.

COLORS: Ocean blue, forest green, cloud white, golden sunlight. Vintage muted tones.

AESTHETIC: 1960s Space Race, international cooperation, vintage NASA Earth photography style.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    },
    {
        name: '03_China_Cyber',
        prompt: `1960s Space Race vintage illustration.

BACKGROUND: The Chinese flag (bright red with yellow stars) fills the ENTIRE canvas from edge to edge as the background. The flag extends beyond all edges - this is a cropped view of a larger flag. No margins. No blank space anywhere.

OVERLAY: A digital padlock OR shield shape centered on the flag. The icon should be semi-transparent and blend softly with the flag behind it.

SUBTLE DETAIL: Very faint binary code (1s and 0s) cascading softly in the background, barely visible, ghosted behind the main elements.

BLENDING: The padlock/shield fades softly into the flag. Double-exposure effect. Dreamy, seamless. No hard edges.

COLORS: Chinese flag red and yellow. Icon in purple/violet tones that blend with the flag colors.

AESTHETIC: 1960s Cold War, Space Race era.

RESTRICTIONS: No text. No logos. Suitable for 80x80px.`
    }
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v11');

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
    console.log('🚀 Icon Style Tester v11 - Flag/Background + Icon Overlay');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Background fills 100% of canvas');
    console.log('📌 Simple icon overlay blends on top');
    console.log('📌 Matching China_Cyber winning formula');
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
