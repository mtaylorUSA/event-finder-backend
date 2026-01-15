/**
 * list-ready-orgs.js
 * Lists organizations with status "Permission Granted (Not Live)"
 */

require('dotenv').config();

async function main() {
    const POCKETBASE_URL = process.env.POCKETBASE_URL;
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 ORGANIZATIONS READY TO ACTIVATE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    try {
        const filter = encodeURIComponent('status="Permission Granted (Not Live)"');
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${filter}&perPage=100`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            console.log('   No organizations found with status "Permission Granted (Not Live)"');
            console.log('');
            return;
        }
        
        console.log(`   Found ${data.items.length} org(s) ready to activate:`);
        console.log('');
        
        data.items.forEach((org, i) => {
            console.log(`   ${i + 1}. ${org.name}`);
            console.log(`      Website: ${org.website || 'N/A'}`);
            console.log(`      Events URL: ${org.events_url || 'N/A'}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
