/**
 * test-icon-styles-v7.js
 * 
 * Generates 3 icons in 1960s Cold War / Space Race retro style.
 * BALANCED complexity, CROPPED composition (elements bleed off edges).
 * 
 * Usage: node test-icon-styles-v7.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 3 event combinations - BALANCED complexity, CROPPED composition
const TEST_COMBINATIONS = [
    {
        name: '01_AI_Government',
        prompt: `1960s Cold War retro poster illustration: A CROPPED, ZOOMED-IN view of a vintage computer mainframe with spinning tape reels and blinking lights.

CRITICAL COMPOSITION:
- This is a CROP of a larger image - elements MUST extend BEYOND all four edges of the frame
- The mainframe should be LARGER than the frame, with parts cut off at the edges
- NO borders, NO margins, NO empty space at edges
- Viewer sees only the CENTER PORTION of a bigger scene

STYLE: Mid-century modern poster art, like vintage IBM or NASA promotional materials.

COLORS: Teal, cyan, and white on deep navy blue. Rich, saturated 1960s print colors.

REQUIREMENTS:
- Elements bleed off ALL edges (top, bottom, left, right)
- Looks like a zoomed-in crop of a larger poster
- 1960s retro-futuristic aesthetic
- NO text, words, or letters
- NO company logos
- Readable at 80x80 pixels`
    },
    {
        name: '02_Climate_Global',
        prompt: `1960s Cold War retro poster illustration: A CROPPED, ZOOMED-IN view of a stylized globe with olive branches, suggesting international environmental cooperation.

CRITICAL COMPOSITION:
- This is a CROP of a larger image - elements MUST extend BEYOND all four edges of the frame
- The globe should be LARGER than the frame, with parts cut off at the edges
- Olive branches extend beyond the frame edges
- NO borders, NO margins, NO empty space at edges
- Viewer sees only the CENTER PORTION of a bigger scene

STYLE: Mid-century diplomatic poster art, like vintage United Nations materials.

COLORS: Emerald green, ocean blue, and gold on warm tan. Rich, saturated 1960s print colors.

REQUIREMENTS:
- Elements bleed off ALL edges (top, bottom, left, right)
- Looks like a zoomed-in crop of a larger poster
- 1960s diplomatic/optimistic aesthetic
- NO text, words, or letters
- NO logos
- Readable at 80x80 pixels`
    },
    {
        name: '03_China_Cyber',
        prompt: `1960s Cold War retro poster illustration: A CROPPED, ZOOMED-IN view showing a purple digital padlock overlaid on the flag of the People's Republic of China.

CRITICAL COMPOSITION:
- This is a CROP of a larger image - elements MUST extend BEYOND all four edges of the frame
- The Chinese flag (red background, yellow stars) fills and EXCEEDS the entire frame
- Parts of the yellow stars are cut off at the edges
- The purple padlock is large and partially cropped at edges
- NO borders, NO margins, NO empty space at edges
- Viewer sees only the CENTER PORTION of a bigger scene

THE CHINESE FLAG MUST BE VISIBLE:
- Bright red background
- Yellow/gold stars (the 5-star pattern of the PRC flag)
- Stars and red background extend beyond frame edges

COLORS: Chinese flag red and yellow, with purple/violet padlock overlay.

REQUIREMENTS:
- Elements bleed off ALL edges (top, bottom, left, right)
- Chinese flag clearly recognizable even when cropped
- Looks like a zoomed-in crop of a larger poster
- 1960s Cold War aesthetic
- NO text, words, or letters
- Readable at 80x80 pixels`
    }
];

// Output directory for test images
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v7');

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
    console.log('🚀 Icon Style Tester v7 - CROPPED 1960s Style');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📌 Testing 3 icons (cropped/bleeding edge composition)');
    console.log('🇨🇳 Chinese flag explicitly requested');
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
    console.log('👀 Open the test-icons-v7 folder to view the results!');
}

// Run
main();
