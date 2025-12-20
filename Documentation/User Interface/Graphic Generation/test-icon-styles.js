/**
 * test-icon-styles.js
 * 
 * Generates sample icons in 6 different styles for comparison.
 * Uses "Cybersecurity + China" as the test topic/region combination.
 * 
 * Usage: node test-icon-styles.js
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

// 6 different style prompts
const STYLE_PROMPTS = {
    'A_Flat_Minimal': `Create a flat, minimal 2D icon for a national security event about cybersecurity and China.
Style: Simple flat design with solid colors, clean geometric shapes, no gradients or shadows.
Color palette: Purple and violet for cyber, with subtle red and gold accents for China.
Visual elements: Digital lock or shield with circuitry, subtle Chinese geographic outline.
Requirements:
- Flat 2D design only, NO 3D perspective
- Simple shapes, solid fills
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Clean white background
- Suitable for 80x80 pixel display
- Modern app icon aesthetic`,

    'B_Gradient_Modern': `Create a modern 2D icon with subtle gradients for a national security event about cybersecurity and China.
Style: Modern logo style with smooth gradients, soft shadows, polished 2D design.
Color palette: Purple to violet gradient for cyber, with subtle red and gold accents for China.
Visual elements: Digital lock or shield with circuitry, subtle Chinese geographic outline.
Requirements:
- 2D design with subtle gradients and soft drop shadows
- Smooth color transitions
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Clean white background
- Suitable for 80x80 pixel display
- Modern tech company logo aesthetic`,

    'C_Line_Art': `Create a clean line art icon for a national security event about cybersecurity and China.
Style: Elegant line art with minimal fills, single stroke weight, professional outline style.
Color palette: Purple/violet lines for cyber elements, red/gold lines for China elements.
Visual elements: Digital lock or shield with circuitry patterns, subtle Chinese geographic outline.
Requirements:
- Clean outline/stroke style, minimal solid fills
- Consistent line weight throughout
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Clean white background
- Suitable for 80x80 pixel display
- Elegant, professional, minimalist`,

    'D_Glassmorphism': `Create a glassmorphism style icon for a national security event about cybersecurity and China.
Style: Frosted glass effect with soft blur, transparency, subtle light reflections, modern tech aesthetic.
Color palette: Translucent purple/violet for cyber, with subtle red and gold accents for China.
Visual elements: Digital lock or shield with circuitry, subtle Chinese geographic outline.
Requirements:
- Frosted glass/blur effect
- Soft, glowing edges
- Subtle transparency and light effects
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Soft gradient background (light purple to white)
- Suitable for 80x80 pixel display
- Modern, premium tech aesthetic`,

    'E_Badge_Emblem': `Create a badge/emblem style icon for a national security event about cybersecurity and China.
Style: Official badge or emblem design, circular or shield-shaped frame, symmetrical, authoritative.
Color palette: Purple and violet for cyber, with subtle red and gold accents for China.
Visual elements: Digital lock or circuitry inside a shield or circular badge frame, subtle Chinese elements.
Requirements:
- Badge, seal, or emblem shape (circular or shield)
- Symmetrical, official-looking design
- No text or words
- No realistic human faces
- NO official government seals or military unit insignia - create ORIGINAL design
- Clean white background
- Suitable for 80x80 pixel display
- Professional, authoritative, governmental feel`,

    'F_Abstract_Geometric': `Create an abstract geometric icon for a national security event about cybersecurity and China.
Style: Abstract shapes and patterns representing concepts, artistic but professional, geometric forms.
Color palette: Purple and violet geometric shapes for cyber, with red and gold accents for China.
Visual elements: Abstract representation of digital security (hexagons, nodes, connections) blended with Chinese-inspired geometric patterns.
Requirements:
- Abstract geometric shapes
- Artistic interpretation of concepts
- No literal representations
- No text or words
- No realistic human faces
- No official government seals or military unit insignia
- Clean white background
- Suitable for 80x80 pixel display
- Modern, artistic, distinctive`
};

// Output directory for test images
const OUTPUT_DIR = path.join(__dirname, 'test-icons');

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
    console.log('🎨 Icon Style Tester');
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
    console.log('👀 Open the test-icons folder to compare the styles!');
}

// Run
main();
