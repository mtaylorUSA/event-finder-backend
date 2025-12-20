/**
 * test-icon-styles-v2.js
 * 
 * Generates sample icons in 1950s advertisement style variations.
 * Images fill the entire frame with no dead space.
 * 
 * Usage: node test-icon-styles-v2.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Test combination: Cybersecurity + China
const TEST_TOPIC = 'Cybersecurity';
const TEST_REGION = 'China';

// 1950s advertisement style variations
const STYLE_PROMPTS = {
    'A_1950s_Poster': `Create an icon in the style of a 1950s American advertisement poster for a national security event about cybersecurity and China.
Style: Bold mid-century illustration, vintage advertising art, strong graphic design like 1950s travel posters or propaganda art.
Color palette: Rich, saturated purples and violets for cyber themes, bold red and gold for China elements. Deep, confident colors.
Visual elements: Stylized padlock, shield, or surveillance imagery blended with Chinese architectural silhouettes or map outline.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Background should be a bold color or pattern that extends to all edges
- 1950s illustration style with bold shapes and confident lines
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Vintage, optimistic, mid-century modern aesthetic
- Suitable for 80x80 pixel display`,

    'B_1950s_Propaganda': `Create an icon in the style of 1950s propaganda poster art for a national security event about cybersecurity and China.
Style: Bold, graphic propaganda poster style from the 1950s, strong silhouettes, dramatic composition, powerful imagery.
Color palette: Deep purples and violets with bold red and gold accents. Limited color palette with high contrast.
Visual elements: Powerful shield or lock symbol, stylized globe or map, radiating lines suggesting vigilance and protection.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Bold colored background extending to all edges
- Strong silhouettes and shapes
- Dramatic, powerful composition
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- 1950s Cold War era aesthetic
- Suitable for 80x80 pixel display`,

    'C_1950s_Corporate': `Create an icon in the style of 1950s corporate illustration for a national security event about cybersecurity and China.
Style: Clean mid-century corporate art, like vintage IBM or Bell System advertisements, professional but with retro charm.
Color palette: Sophisticated purples and slate blues for cyber, with subtle red and gold accents for China.
Visual elements: Stylized technology symbols (circuits, locks, shields) in clean mid-century graphic style.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Solid or gradient background extending to all edges
- Clean, professional mid-century aesthetic
- Bold graphic shapes
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- 1950s corporate America aesthetic
- Suitable for 80x80 pixel display`,

    'D_1950s_Atomic_Age': `Create an icon in the style of 1950s Atomic Age design for a national security event about cybersecurity and China.
Style: Atomic Age / Space Age aesthetic, starbursts, atoms, boomerang shapes, optimistic futurism of the 1950s.
Color palette: Electric purples, teals, and magentas for cyber/tech, with red and gold accents for China.
Visual elements: Atomic symbols, starbursts, orbiting electrons combined with shield or lock imagery, retro-futuristic.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Bold, saturated background color extending to all edges
- Atomic Age decorative elements (starbursts, boomerangs, orbital rings)
- Optimistic, futuristic 1950s aesthetic
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Googie / Atomic Age style
- Suitable for 80x80 pixel display`,

    'E_1950s_Travel_Poster': `Create an icon in the style of vintage 1950s travel posters for a national security event about cybersecurity and China.
Style: Classic travel poster illustration, bold simplified shapes, romantic mid-century tourism art aesthetic.
Color palette: Rich purples and blues for cyber themes, warm red and gold for China, sunset-like gradients.
Visual elements: Stylized Great Wall silhouette or Chinese pagoda combined with modern digital shield or lock symbol, layered composition.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Gradient sky or bold color background extending to all edges
- Layered silhouettes creating depth
- Romantic, adventurous mid-century aesthetic
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Vintage travel poster composition
- Suitable for 80x80 pixel display`,

    'F_1950s_Magazine_Ad': `Create an icon in the style of 1950s magazine advertisement illustration for a national security event about cybersecurity and China.
Style: Glossy 1950s magazine ad art, rich colors, idealized imagery, confident American advertising aesthetic.
Color palette: Luxurious purples and violets for cyber, bold red and gold for China, rich saturated tones.
Visual elements: Stylized padlock or shield, globe imagery, strong diagonal composition suggesting progress and protection.
CRITICAL REQUIREMENTS:
- Image MUST fill the ENTIRE frame edge-to-edge - NO white space, NO margins, NO padding
- Rich, full-bleed background with no empty space
- Glossy, polished mid-century illustration style
- Confident, optimistic composition
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- 1950s Madison Avenue aesthetic
- Suitable for 80x80 pixel display`
};

// Output directory for test images
const OUTPUT_DIR = path.join(__dirname, 'test-icons-v2');

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
    console.log('🎨 Icon Style Tester - 1950s Advertisement Styles');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`📌 Test combo: ${TEST_TOPIC} + ${TEST_REGION}`);
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

    const styles = Object.keys(STYLE_PROMPTS);
    let successCount = 0;

    for (const styleName of styles) {
        console.log('────────────────────────────────────────────────────────────');
        console.log(`🎨 Style: ${styleName.replace(/_/g, ' ')}`);
        
        const prompt = STYLE_PROMPTS[styleName];
        
        try {
            console.log('   ⏳ Generating with DALL-E 3...');
            const imageUrl = await generateImage(prompt);
            
            console.log('   📥 Downloading image...');
            const imageBuffer = await downloadImage(imageUrl);
            
            const filename = `${styleName}.png`;
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
    console.log(`   ✅ Images generated: ${successCount} / ${styles.length}`);
    console.log(`   📁 Location: ${OUTPUT_DIR}`);
    console.log('════════════════════════════════════════════════════════════\n');
    console.log('👀 Open the test-icons-v2 folder to compare the styles!');
}

// Run
main();
