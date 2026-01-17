/**
 * fix-cfr-events.js
 * 
 * One-time script to update CFR events to 'nominated' status
 * Run: node fix-cfr-events.js
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const CFR_ORG_ID = 'nnk3jwck6s0rjsn';

async function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔧 FIX CFR EVENTS: Set event_status to "nominated"');
    console.log('════════════════════════════════════════════════════════════════');
    
    // Authenticate
    console.log('');
    console.log('🔐 Authenticating...');
    
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!authResponse.ok) {
        console.log('❌ Authentication failed');
        return;
    }
    
    const authData = await authResponse.json();
    const authToken = authData.token;
    console.log('✅ Authenticated');
    
    // Find CFR events without event_status set (or empty)
    console.log('');
    console.log('📡 Finding CFR events that need event_status set to "proposed"...');
    
    // Find all CFR events - the new ones won't have event_status set yet
    const filter = encodeURIComponent(`organization = "${CFR_ORG_ID}"`);
    const eventsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?filter=${filter}&perPage=100`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!eventsResponse.ok) {
        console.log('❌ Failed to fetch events');
        return;
    }
    
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];
    
    // Filter to find events that need updating (not already 'nominated')
    const eventsToUpdate = events.filter(e => e.event_status !== 'nominated');
    
    console.log(`   Found ${events.length} CFR event(s) total`);
    console.log(`   Need to update: ${eventsToUpdate.length}`);
    
    if (eventsToUpdate.length === 0) {
        console.log('');
        console.log('✅ All events already set to "nominated". Done!');
        return;
    }
    
    // Update each event
    console.log('');
    console.log('🔄 Updating events to "nominated"...');
    
    let updated = 0;
    let failed = 0;
    
    for (const event of eventsToUpdate) {
        try {
            const updateResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/events/records/${event.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({ event_status: 'nominated' })
                }
            );
            
            if (updateResponse.ok) {
                console.log(`   ✅ Updated: ${event.title.substring(0, 50)}...`);
                updated++;
            } else {
                console.log(`   ❌ Failed: ${event.title.substring(0, 50)}...`);
                failed++;
            }
        } catch (e) {
            console.log(`   ❌ Error: ${event.title.substring(0, 50)}... - ${e.message}`);
            failed++;
        }
    }
    
    // Summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Events updated: ${updated}`);
    console.log(`   Events failed: ${failed}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

main().catch(console.error);
