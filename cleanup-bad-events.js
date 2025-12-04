/**
 * cleanup-bad-events.js
 * 
 * Cleans up events with:
 * 1. Generic/bad titles (e.g., "Upcoming Events", "Events", "Calendar")
 * 2. Exact duplicates (same title + date + organization)
 * 
 * Usage: node cleanup-bad-events.js
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

// Generic/bad titles to delete (case-insensitive)
const BAD_TITLES = [
  'upcoming events',
  'events',
  'calendar',
  'event',
  'register',
  'registration',
  'sign up',
  'learn more',
  'read more',
  'click here',
  'view all',
  'see all',
  'more events',
  'all events',
  'event calendar',
  'our events',
  'featured events',
  'past events'
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function cleanupBadEvents() {
  // Dynamic import for node-fetch (works with Node.js v18+)
  const fetch = (await import('node-fetch')).default;
  
  let authToken = null;

  // ══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATION
  // ══════════════════════════════════════════════════════════════════════════

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

  // ══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  function isBadTitle(title) {
    if (!title) return true; // Empty titles are bad
    const normalized = title.toLowerCase().trim();
    if (normalized.length < 3) return true; // Too short
    return BAD_TITLES.includes(normalized);
  }

  function getEventKey(event) {
    // Create a unique key for duplicate detection
    const title = (event.title || '').toLowerCase().trim();
    const date = event.start_date || '';
    const org = event.organization || '';
    return `${title}|${date}|${org}`;
  }

  async function deleteEvent(eventId, title) {
    try {
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records/${eventId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': authToken }
        }
      );
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN CLEANUP LOGIC
  // ══════════════════════════════════════════════════════════════════════════

  console.log('════════════════════════════════════════');
  console.log('🧹 Bad Events Cleanup Script');
  console.log('════════════════════════════════════════\n');

  await authenticate();

  try {
    // Step 1: Fetch all events
    console.log('📥 Fetching all events...');
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/events/records?perPage=500&sort=title`,
      { headers: { 'Authorization': authToken } }
    );
    const data = await response.json();
    const events = data.items || [];
    console.log(`   ✅ Found ${events.length} total events\n`);

    // Step 2: Find events with bad titles
    console.log('🔍 Checking for bad titles...\n');
    const badTitleEvents = events.filter(e => isBadTitle(e.title));

    if (badTitleEvents.length > 0) {
      console.log(`⚠️  Found ${badTitleEvents.length} event(s) with bad titles:\n`);
      console.log('────────────────────────────────────────');
      badTitleEvents.forEach((event, index) => {
        console.log(`${index + 1}. "${event.title || '(empty)'}"`);
        console.log(`   ID: ${event.id}`);
        console.log(`   Date: ${event.start_date || 'N/A'}`);
      });
      console.log('────────────────────────────────────────\n');
    } else {
      console.log('✅ No events with bad titles found.\n');
    }

    // Step 3: Find duplicates (excluding bad title events we'll already delete)
    console.log('🔍 Checking for duplicates...\n');
    const seen = new Map();
    const duplicates = [];
    const goodEvents = events.filter(e => !isBadTitle(e.title));

    for (const event of goodEvents) {
      const key = getEventKey(event);
      
      if (seen.has(key)) {
        // This is a duplicate - mark for deletion
        duplicates.push(event);
      } else {
        // First occurrence - keep it
        seen.set(key, event);
      }
    }

    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate event(s):\n`);
      console.log('────────────────────────────────────────');
      duplicates.forEach((event, index) => {
        console.log(`${index + 1}. "${event.title}"`);
        console.log(`   ID: ${event.id}`);
        console.log(`   Date: ${event.start_date || 'N/A'}`);
        console.log(`   Org: ${event.organization}`);
      });
      console.log('────────────────────────────────────────\n');
    } else {
      console.log('✅ No duplicate events found.\n');
    }

    // Step 4: Combine all events to delete
    const eventsToDelete = [...badTitleEvents, ...duplicates];

    if (eventsToDelete.length === 0) {
      console.log('════════════════════════════════════════');
      console.log('✅ No cleanup needed! Database is clean.');
      console.log('════════════════════════════════════════\n');
      return;
    }

    // Step 5: Delete bad events
    console.log(`🗑️  Deleting ${eventsToDelete.length} event(s)...\n`);

    let deleted = 0;
    let errors = 0;

    for (const event of eventsToDelete) {
      const success = await deleteEvent(event.id, event.title);
      if (success) {
        console.log(`   ✅ Deleted: "${event.title || '(empty)'}"`);
        deleted++;
      } else {
        console.log(`   ❌ Failed: "${event.title || '(empty)'}"`);
        errors++;
      }
    }

    // Step 6: Clean up orphaned embeddings
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
    let embeddingsDeleted = 0;

    if (orphanedEmbeddings.length > 0) {
      console.log(`   ⚠️  Found ${orphanedEmbeddings.length} orphaned embedding(s)`);
      console.log('   🗑️  Deleting...\n');

      for (const emb of orphanedEmbeddings) {
        try {
          await fetch(
            `${POCKETBASE_URL}/api/collections/event_embeddings/records/${emb.id}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': authToken }
            }
          );
          embeddingsDeleted++;
        } catch (error) {
          // Ignore errors
        }
      }
      console.log(`   ✅ Deleted ${embeddingsDeleted} orphaned embeddings`);
    } else {
      console.log('   ✅ No orphaned embeddings found');
    }

    // Summary
    console.log('\n════════════════════════════════════════');
    console.log('📊 CLEANUP SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`   🏷️  Bad title events deleted: ${badTitleEvents.length}`);
    console.log(`   📋 Duplicate events deleted: ${duplicates.length}`);
    console.log(`   🗑️  Total events deleted: ${deleted}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   🧹 Embeddings cleaned: ${embeddingsDeleted}`);
    
    // Calculate new total
    const newTotal = events.length - deleted;
    console.log(`\n   📈 Events remaining: ${newTotal}`);
    console.log('\n✅ Cleanup complete!\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
cleanupBadEvents();
