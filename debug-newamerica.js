/**
 * debug-newamerica.js
 * 
 * Debug script to see exactly what the AI receives when scraping New America
 */

require('dotenv').config();

const EVENTS_URL = 'https://www.newamerica.org/events/';

async function main() {
    const fetch = (await import('node-fetch')).default;
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 DEBUG: New America Events Page');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // Fetch the page
    console.log('📡 Fetching events page...');
    const response = await fetch(EVENTS_URL, {
        headers: {
            'User-Agent': 'EventFinderBot/1.0 (Research tool)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    });
    
    const html = await response.text();
    console.log(`✅ Fetched ${html.length} bytes`);
    console.log('');
    
    // Extract links
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📎 EXTRACTED EVENT LINKS:');
    console.log('════════════════════════════════════════════════════════════════');
    
    const links = [];
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1];
        let text = match[2].replace(/<[^>]+>/g, '').trim();
        
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
            continue;
        }
        
        if (!href.startsWith('http')) {
            try {
                href = new URL(href, EVENTS_URL).href;
            } catch (e) {
                continue;
            }
        }
        
        if (href.includes('event') || href.includes('detail') || href.includes('calendar') || 
            href.includes('program') || href.includes('conference') || href.includes('seminar')) {
            links.push({ url: href, text: text.substring(0, 100) });
            console.log(`   "${text.substring(0, 60)}"`);
            console.log(`   → ${href}`);
            console.log('');
        }
    }
    
    console.log(`Total event links found: ${links.length}`);
    console.log('');
    
    // Extract text content
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📝 TEXT CONTENT (first 3000 chars):');
    console.log('════════════════════════════════════════════════════════════════');
    
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    
    console.log(text.substring(0, 3000));
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // Look for dates
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📅 DATE PATTERNS FOUND:');
    console.log('════════════════════════════════════════════════════════════════');
    
    const datePatterns = [
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/gi,
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
        /\b\d{4}-\d{2}-\d{2}\b/g
    ];
    
    for (const pattern of datePatterns) {
        const matches = text.match(pattern);
        if (matches) {
            console.log(`Found dates: ${matches.slice(0, 10).join(', ')}`);
        }
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ DEBUG COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
}

main().catch(console.error);
