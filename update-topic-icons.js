/**
 * update-topic-icons.js
 * 
 * This script updates all topic_icons records in PocketBase to use the new topic names.
 * The topic_combination field format is: "topic1,topic2|region1,region2"
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
 * Run with: node update-topic-icons.js
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

/**
 * Updates topics in a topic_combination string
 * Format: "topic1,topic2,topic3|region1,region2"
 */
function updateTopicCombination(combinationString) {
    if (!combinationString) return combinationString;
    
    // Split by | to separate topics from regions
    const parts = combinationString.split('|');
    const topicsPart = parts[0] || '';
    const regionsPart = parts[1] || '';
    
    // Split topics by comma
    const topics = topicsPart.split(',').map(t => t.trim()).filter(t => t);
    
    // Map old topics to new topics
    const updatedTopics = topics.map(topic => {
        if (topicMapping[topic]) {
            return topicMapping[topic];
        }
        return topic;
    });
    
    // Remove duplicates (in case Defense Policy and Intelligence both mapped to same topic)
    const uniqueTopics = [...new Set(updatedTopics)];
    
    // Reconstruct the combination string
    if (regionsPart) {
        return `${uniqueTopics.join(',')}|${regionsPart}`;
    } else {
        return uniqueTopics.join(',');
    }
}

async function updateTopicIcons() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 Topic Icons Update Script');
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

        // Fetch all topic_icons records
        console.log('\n📡 Fetching all topic_icons records...');
        const records = await pb.collection('topic_icons').getFullList({
            sort: 'topic_combination'
        });
        console.log(`✅ Found ${records.length} records`);

        // Process each record
        console.log('\n🔄 Processing records...');
        console.log('────────────────────────────────────────────────────────────');
        
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const record of records) {
            const oldCombination = record.topic_combination || '';
            
            // Skip if no topic_combination
            if (!oldCombination) {
                console.log(`⏭️  Skipped (empty): Record ${record.id}`);
                skippedCount++;
                continue;
            }

            // Update the topic combination
            const newCombination = updateTopicCombination(oldCombination);

            // Check if anything changed
            if (oldCombination !== newCombination) {
                try {
                    await pb.collection('topic_icons').update(record.id, {
                        topic_combination: newCombination
                    });
                    console.log(`✅ Updated: ${record.id}`);
                    console.log(`   Old: ${oldCombination}`);
                    console.log(`   New: ${newCombination}`);
                    updatedCount++;
                } catch (err) {
                    console.log(`❌ Error updating: ${record.id}`);
                    console.log(`   Error: ${err.message}`);
                    errorCount++;
                }
            } else {
                console.log(`⏭️  No changes needed: ${oldCombination.substring(0, 50)}...`);
                skippedCount++;
            }
        }

        // Summary
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`✅ Updated: ${updatedCount} records`);
        console.log(`⏭️  Skipped (no changes): ${skippedCount} records`);
        console.log(`❌ Errors: ${errorCount} records`);
        console.log(`📊 Total processed: ${records.length} records`);
        console.log('════════════════════════════════════════════════════════════');

        if (errorCount === 0) {
            console.log('\n🎉 Topic icons update completed successfully!');
        } else {
            console.log('\n⚠️  Topic icons update completed with some errors. Review above.');
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
updateTopicIcons();
