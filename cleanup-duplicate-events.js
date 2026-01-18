/**
 * cleanup-duplicate-events.js
 * 
 * Finds and deletes duplicate events based on title + organization + start_date
 * Keeps the oldest record, deletes newer duplicates
 * 
 * Run: node cleanup-duplicate-events.js
 * Run with --dry-run to see what would be deleted without deleting
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🧹 CLEANUP DUPLICATE EVENTS');
    console.log('════════════════════════════════════════════════════════════════');
    if (DRY_RUN) {
        console.log('⚠️  DRY RUN MODE - No deletions will be made');
    }
    console.log('');
    
    // Authenticate
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
    
    // Fetch all events
    console.log('');
    console.log('📡 Fetching all events...');
    
    const eventsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?sort=created&perPage=500`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!eventsResponse.ok) {
        console.log('❌ Failed to fetch events');
        return;
    }
    
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];
    
    console.log(`   Found ${events.length} total events`);
    
    // Find duplicates based on title + organization + start_date
    console.log('');
    console.log('🔍 Finding duplicates...');
    
    const seen = new Map(); // key -> first event record
    const duplicates = [];
    
    for (const event of events) {
        // Create a normalized key for comparison
        const titleNormalized = event.title.toLowerCase().trim().substring(0, 60);
        const key = `${event.organization}|${titleNormalized}|${event.start_date || 'nodate'}`;
        
        if (seen.has(key)) {
            // This is a duplicate - mark for deletion
            duplicates.push({
                id: event.id,
                title: event.title,
                created: event.created,
                original: seen.get(key)
            });
        } else {
            seen.set(key, { id: event.id, title: event.title, created: event.created });
        }
    }
    
    console.log(`   Found ${duplicates.length} duplicate(s)`);
    
    if (duplicates.length === 0) {
        console.log('');
        console.log('✅ No duplicates found. Done!');
        return;
    }
    
    // Show duplicates
    console.log('');
    console.log('📋 Duplicates to remove:');
    duplicates.forEach((dup, i) => {
        console.log(`   ${i + 1}. "${dup.title.substring(0, 50)}..."`);
        console.log(`      ID: ${dup.id} (created: ${dup.created})`);
        console.log(`      Keeping: ${dup.original.id} (created: ${dup.original.created})`);
    });
    
    if (DRY_RUN) {
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('⚠️  DRY RUN COMPLETE - Run without --dry-run to delete');
        console.log('════════════════════════════════════════════════════════════════');
        return;
    }
    
    // Delete duplicates
    console.log('');
    console.log('🗑️  Deleting duplicates...');
    
    let deleted = 0;
    let failed = 0;
    
    for (const dup of duplicates) {
        try {
            const deleteResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/events/records/${dup.id}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': authToken }
                }
            );
            
            if (deleteResponse.ok) {
                console.log(`   ✅ Deleted: ${dup.title.substring(0, 50)}...`);
                deleted++;
            } else {
                console.log(`   ❌ Failed to delete: ${dup.id}`);
                failed++;
            }
        } catch (e) {
            console.log(`   ❌ Error: ${e.message}`);
            failed++;
        }
    }
    
    // Summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Duplicates found: ${duplicates.length}`);
    console.log(`   Deleted: ${deleted}`);
    console.log(`   Failed: ${failed}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

main().catch(console.error);
