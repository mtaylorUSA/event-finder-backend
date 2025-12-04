/**
 * cleanup-orphaned-events.js
 * 
 * Finds and deletes events that are linked to organizations
 * that no longer exist (e.g., OpenAI/ChatGPT events)
 * 
 * Usage: node cleanup-orphaned-events.js
 * 
 * Last Updated: 2025-11-28
 */

require('dotenv').config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ============================================================================
// MAIN CLEANUP FUNCTION (with dynamic import for Node.js v18+)
// ============================================================================

async function cleanupOrphanedEvents() {
  // Dynamic import for node-fetch (works with Node.js v18+)
  const fetch = (await import('node-fetch')).default;
  
  let authToken = null;

  async function authenticate() {
    console.log('🔐 Authenticating with PocketBase...');
    
    try {
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
      console.log('✅ Authenticated successfully\n');
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      process.exit(1);
    }
  }
  console.log('════════════════════════════════════════');
  console.log('🧹 Orphaned Events Cleanup Script');
  console.log('════════════════════════════════════════\n');

  await authenticate();

  try {
    // Step 1: Get all valid organization IDs
    console.log('📥 Fetching valid organizations...');
    const orgsResponse = await fetch(
      `${POCKETBASE_URL}/api/collections/organizations/records?perPage=500`,
      { headers: { 'Authorization': authToken } }
    );
    const orgsData = await orgsResponse.json();
    const validOrgIds = new Set((orgsData.items || []).map(org => org.id));
    console.log(`   ✅ Found ${validOrgIds.size} valid organizations\n`);

    // Step 2: Get all events
    console.log('📥 Fetching all events...');
    const eventsResponse = await fetch(
      `${POCKETBASE_URL}/api/collections/events/records?perPage=500`,
      { headers: { 'Authorization': authToken } }
    );
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];
    console.log(`   ✅ Found ${events.length} total events\n`);

    // Step 3: Find orphaned events
    console.log('🔍 Checking for orphaned events...\n');
    const orphanedEvents = events.filter(event => {
      // Event is orphaned if:
      // 1. No organization field
      // 2. Organization ID doesn't exist in valid orgs
      return !event.organization || !validOrgIds.has(event.organization);
    });

    if (orphanedEvents.length === 0) {
      console.log('✅ No orphaned events found! Database is clean.\n');
      return;
    }

    console.log(`⚠️  Found ${orphanedEvents.length} orphaned event(s):\n`);
    console.log('────────────────────────────────────────');
    
    orphanedEvents.forEach((event, index) => {
      console.log(`${index + 1}. "${event.title}"`);
      console.log(`   ID: ${event.id}`);
      console.log(`   Org ID: ${event.organization || 'NONE'}`);
      console.log(`   Date: ${event.start_date || 'N/A'}`);
      console.log('');
    });

    console.log('────────────────────────────────────────\n');

    // Step 4: Delete orphaned events
    console.log('🗑️  Deleting orphaned events...\n');

    let deleted = 0;
    let errors = 0;

    for (const event of orphanedEvents) {
      try {
        const deleteResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/events/records/${event.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': authToken }
          }
        );

        if (deleteResponse.ok) {
          console.log(`   ✅ Deleted: "${event.title}"`);
          deleted++;
        } else {
          console.log(`   ❌ Failed to delete: "${event.title}"`);
          errors++;
        }
      } catch (error) {
        console.log(`   ❌ Error deleting "${event.title}": ${error.message}`);
        errors++;
      }
    }

    // Step 5: Also check for orphaned embeddings
    console.log('\n📥 Checking for orphaned embeddings...');
    const embeddingsResponse = await fetch(
      `${POCKETBASE_URL}/api/collections/event_embeddings/records?perPage=500`,
      { headers: { 'Authorization': authToken } }
    );
    const embeddingsData = await embeddingsResponse.json();
    const embeddings = embeddingsData.items || [];

    // Get remaining valid event IDs
    const remainingEventsResponse = await fetch(
      `${POCKETBASE_URL}/api/collections/events/records?perPage=500`,
      { headers: { 'Authorization': authToken } }
    );
    const remainingEventsData = await remainingEventsResponse.json();
    const validEventIds = new Set((remainingEventsData.items || []).map(e => e.id));

    const orphanedEmbeddings = embeddings.filter(emb => !validEventIds.has(emb.event));

    if (orphanedEmbeddings.length > 0) {
      console.log(`   ⚠️  Found ${orphanedEmbeddings.length} orphaned embedding(s)`);
      console.log('   🗑️  Deleting orphaned embeddings...\n');

      for (const emb of orphanedEmbeddings) {
        try {
          await fetch(
            `${POCKETBASE_URL}/api/collections/event_embeddings/records/${emb.id}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': authToken }
            }
          );
          console.log(`   ✅ Deleted embedding: ${emb.id}`);
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    } else {
      console.log('   ✅ No orphaned embeddings found\n');
    }

    // Summary
    console.log('\n════════════════════════════════════════');
    console.log('📊 CLEANUP SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`   🗑️  Events deleted: ${deleted}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   🧹 Embeddings cleaned: ${orphanedEmbeddings.length}`);
    console.log('\n✅ Cleanup complete!\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
cleanupOrphanedEvents();
