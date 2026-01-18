/**
 * backfill-event-status.js
 * 
 * One-time migration script to set event_status='nominated' for all events
 * that have null or empty event_status values.
 * 
 * These are "legacy" events created before the event_status field was added.
 * 
 * Usage:
 *   node backfill-event-status.js           # Dry run (shows what would change)
 *   node backfill-event-status.js --commit  # Actually update the database
 * 
 * Created: 2026-01-17
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

let authToken = '';

async function authenticate() {
    console.log('🔐 Authenticating with PocketBase...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) {
        throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    authToken = data.token;
    console.log('✅ Authenticated');
}

async function getEventsWithoutStatus() {
    console.log('🔍 Finding events with null/empty event_status...');
    
    // Get all events and filter client-side (PocketBase null filtering can be tricky)
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?perPage=500&expand=organization`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    
    const data = await response.json();
    const allEvents = data.items || [];
    
    // Filter to only events with null/empty/undefined event_status
    const eventsToFix = allEvents.filter(e => !e.event_status || e.event_status === '');
    
    console.log(`   📊 Total events: ${allEvents.length}`);
    console.log(`   ⚠️ Events needing fix: ${eventsToFix.length}`);
    
    return eventsToFix;
}

async function updateEventStatus(eventId, newStatus) {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records/${eventId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({ event_status: newStatus })
        }
    );
    
    return response.ok;
}

async function main() {
    const args = process.argv.slice(2);
    const commitMode = args.includes('--commit');
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 BACKFILL EVENT STATUS');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${commitMode ? '🔴 COMMIT (will update database)' : '🟡 DRY RUN (preview only)'}`);
    console.log('');
    
    try {
        await authenticate();
        console.log('');
        
        const eventsToFix = await getEventsWithoutStatus();
        console.log('');
        
        if (eventsToFix.length === 0) {
            console.log('✅ No events need fixing. All events have event_status set.');
            return;
        }
        
        console.log('────────────────────────────────────────────────────────────────');
        console.log('📋 EVENTS TO UPDATE');
        console.log('────────────────────────────────────────────────────────────────');
        
        for (const event of eventsToFix) {
            const orgName = event.expand?.organization?.name || 'Unknown Org';
            const currentStatus = event.event_status || '(null/empty)';
            console.log(`   📅 "${event.title.substring(0, 50)}..."`);
            console.log(`      Org: ${orgName}`);
            console.log(`      Current event_status: ${currentStatus}`);
            console.log(`      New event_status: nominated`);
            console.log('');
        }
        
        if (!commitMode) {
            console.log('════════════════════════════════════════════════════════════════');
            console.log('🟡 DRY RUN COMPLETE');
            console.log('════════════════════════════════════════════════════════════════');
            console.log(`   Would update ${eventsToFix.length} event(s)`);
            console.log('');
            console.log('   To apply changes, run:');
            console.log('   node backfill-event-status.js --commit');
            console.log('════════════════════════════════════════════════════════════════');
            return;
        }
        
        // Actually update the events
        console.log('────────────────────────────────────────────────────────────────');
        console.log('💾 UPDATING DATABASE');
        console.log('────────────────────────────────────────────────────────────────');
        
        let successCount = 0;
        let failCount = 0;
        
        for (const event of eventsToFix) {
            const success = await updateEventStatus(event.id, 'nominated');
            if (success) {
                console.log(`   ✅ Updated: ${event.title.substring(0, 50)}...`);
                successCount++;
            } else {
                console.log(`   ❌ Failed: ${event.title.substring(0, 50)}...`);
                failCount++;
            }
        }
        
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('✅ BACKFILL COMPLETE');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`   Events updated: ${successCount}`);
        console.log(`   Events failed: ${failCount}`);
        console.log('════════════════════════════════════════════════════════════════');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
