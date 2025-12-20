/**
 * test-icon-styles-v8.js
 * 
 * Generates 3 icons with:
 * 1) Collage of blending/overlapping/fading symbols
 * 2) Full bleed - no blank edges
 * 3) Balanced complexity for small display
 * 4) National flags when countries are involved
 * 5) Vintage 1960s space race aesthetic
 * 
 * Usage: node test-icon-styles-v8.js
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
        prompt: `Create a COLLAGE illustration in 1960s Space Race vintage style.

SUBJECT: AI and government mission operations

COLLAGE ELEMENTS (blend, overlap, and fade together):
- Vintage computer tape reels
- Radar screen with sweeping line
- Rocket or satellite silhouette
- Circuit board patterns
- American flag elements woven throughout

COLLAGE STYLE:
- Elements OVERLAP and BLEND into each other
- Some elements FADE at edges into other elements
- Layered composition with depth
- NO clear boundaries between elements

COLORS: Teal, navy blue, patriotic red/white/blue accents. Vintage muted tones like aged print materials.

FULL BLEED: Image must extend to ALL edges with no white space or margins. Elements touch and exceed frame edges.

AESTHETIC: 1960s NASA, Space Race, Cold War optimism. Vintage government technical posters.

RESTRICTIONS: No text/words/letters. No logos. Suitable for 80x80px display.`
    },
    {
        name: '02_Climate_Global',
        prompt: `Create a COLLAGE illustration in 1960s Space Race vintage style.

SUBJECT: Global climate negotiations and international diplomacy

COLLAGE ELEMENTS (blend, overlap, and fade together):
- Earth globe viewed from space
- Olive branches
- Abstract representations of multiple national flags blending together
- Clouds and atmospheric layers
- Handshake silhouette
- Orbital rings or satellite paths

COLLAGE STYLE:
- Elements OVERLAP and BLEND into each other
- Some elements FADE at edges into other elements
- Layered composition with depth
- NO clear boundaries between elements

COLORS: Earth tones - ocean blue, forest green, cloud white, golden sunlight. Vintage muted tones.

FULL BLEED: Image must extend to ALL edges with no white space or margins. Elements touch and exceed frame edges.

AESTHETIC: 1960s international cooperation, Space Race era, vintage United Nations style.

RESTRICTIONS: No text/words/letters. No logos. Suitable for 80x80px display.`
    },
    {
        name: '03_China_Cyber',
        prompt: `Create a COLLAGE illustration in 1960s Space Race vintage style.

SUBJECT: China cybersecurity threat

COLLAGE ELEMENTS (blend, overlap, and fade together):
- THE CHINESE FLAG (red background with yellow stars) as a prominent, recognizable element
- Digital padlock or shield
- Circuit board traces
- Vintage computer terminal
- Binary or data stream patterns
- Great Wall silhouette fading in background

COLLAGE STYLE:
- Elements OVERLAP and BLEND into each other
- Chinese flag elements weave throughout the composition
- Some elements FADE at edges into other elements
- Layered composition with depth
- NO clear boundaries between elements

COLORS: Chinese flag red and yellow MUST be prominent. Purple/violet for cyber elements. Vintage muted tones.

FULL BLEED: Image must extend to ALL edges with no white space or margins. Elements touch and exceed frame edges.

AESTHETIC: 1960s Cold War, Space Race era, vintage intelligence/security style.

RESTRICTIONS: No text/words/letters. No logos. Suitable for 80x80px display.`
    }
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v8');

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
    console.log('🚀 Icon Style Tester v8 - COLLAGE Style');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Collage: blending, overlapping, fading elements');
    console.log('📌 Full bleed: no blank edges');
    console.log('📌 Flags: included for country-specific topics');
    console.log('📌 Style: 1960s Space Race vintage');
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
