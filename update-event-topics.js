/**
 * update-event-topics.js
 * 
 * This script updates all events in PocketBase to use the new topic names.
 * 
 * Mapping:
 *   - Defense Policy → Defense Policy & Intelligence
 *   - Intelligence → Defense Policy & Intelligence
 *   - Nuclear/WMD → Nuclear & WMD
 *   - AI & Emerging Tech → AI & Emerging Technology
 *   - Counterterrorism → Terrorism & Counterterrorism
 *   - Military Operations → Military & Conflict
 *   - Climate & Security → Environment & Climate
 * 
 * Run with: node update-event-topics.js
 */

require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

// Topic mapping: old name → new name
const topicMapping = {
    'Defense Policy': 'Defense Policy & Intelligence',
    'Intelligence': 'Defense Policy & Intelligence',
    'Nuclear/WMD': 'Nuclear & WMD',
    'AI & Emerging Tech': 'AI & Emerging Technology',
    'Counterterrorism': 'Terrorism & Counterterrorism',
    'Military Operations': 'Military & Conflict',
    'Climate & Security': 'Environment & Climate'
};

// Topics that don't change (for reference)
const unchangedTopics = [
    'Cybersecurity',
    'Space & Satellites',
    'Homeland Security',
    'Economic Security',
    'Diplomacy & Statecraft',
    'Careers & Professional Development'
];

// New topics (for reference)
const newTopics = [
    'Humanitarian & Societal',
    'Government Business & Modernization'
];

async function updateEventTopics() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 Event Topics Update Script');
    console.log('════════════════════════════════════════════════════════════');
    
    // Validate environment variables
    if (!process.env.POCKETBASE_URL) {
        console.error('❌ Error: POCKETBASE_URL not found in .env file');
        process.exit(1);
    }
    if (!process.env.POCKETBASE_ADMIN_EMAIL || !process.env.POCKETBASE_ADMIN_PASSWORD) {
        console.error('❌ Error: Admin credentials not found in .env file');
        process.exit(1);
    }

    const pb = new PocketBase(process.env.POCKETBASE_URL);
    
    try {
        // Authenticate as admin
        console.log('\n🔐 Authenticating with PocketBase...');
        await pb.admins.authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL,
            process.env.POCKETBASE_ADMIN_PASSWORD
        );
        console.log('✅ Authenticated successfully');

        // Fetch all events
        console.log('\n📡 Fetching all events...');
        const events = await pb.collection('events').getFullList({
            sort: 'title'
        });
        console.log(`✅ Found ${events.length} events`);

        // Process each event
        console.log('\n🔄 Processing events...');
        console.log('────────────────────────────────────────────────────────────');
        
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const event of events) {
            const oldTopics = event.topics || [];
            
            // Skip if no topics
            if (!oldTopics || oldTopics.length === 0) {
                console.log(`⏭️  Skipped (no topics): ${event.title.substring(0, 50)}...`);
                skippedCount++;
                continue;
            }

            // Map old topics to new topics
            const newTopics = oldTopics.map(topic => {
                if (topicMapping[topic]) {
                    return topicMapping[topic];
                }
                return topic; // Keep unchanged if not in mapping
            });

            // Remove duplicates (in case Defense Policy and Intelligence both mapped to same topic)
            const uniqueNewTopics = [...new Set(newTopics)];

            // Check if anything changed
            const hasChanges = JSON.stringify(oldTopics.sort()) !== JSON.stringify(uniqueNewTopics.sort());

            if (hasChanges) {
                try {
                    await pb.collection('events').update(event.id, {
                        topics: uniqueNewTopics
                    });
                    console.log(`✅ Updated: ${event.title.substring(0, 50)}...`);
                    console.log(`   Old: [${oldTopics.join(', ')}]`);
                    console.log(`   New: [${uniqueNewTopics.join(', ')}]`);
                    updatedCount++;
                } catch (err) {
                    console.log(`❌ Error updating: ${event.title.substring(0, 50)}...`);
                    console.log(`   Error: ${err.message}`);
                    errorCount++;
                }
            } else {
                console.log(`⏭️  No changes needed: ${event.title.substring(0, 50)}...`);
                skippedCount++;
            }
        }

        // Summary
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`✅ Updated: ${updatedCount} events`);
        console.log(`⏭️  Skipped (no changes): ${skippedCount} events`);
        console.log(`❌ Errors: ${errorCount} events`);
        console.log(`📊 Total processed: ${events.length} events`);
        console.log('════════════════════════════════════════════════════════════');

        if (errorCount === 0) {
            console.log('\n🎉 Topics update completed successfully!');
        } else {
            console.log('\n⚠️  Topics update completed with some errors. Review above.');
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
updateEventTopics();
