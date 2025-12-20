/**
 * generate-embeddings.js
 * 
 * This script generates AI embeddings for events using OpenAI's text-embedding-3-small model.
 * Embeddings are stored in the event_embeddings collection for semantic search.
 * 
 * Run with: node generate-embeddings.js
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateEmbeddings() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 Generate Embeddings Script');
    console.log('════════════════════════════════════════════════════════════');

    // Validate environment variables
    if (!POCKETBASE_URL) {
        console.error('❌ Error: POCKETBASE_URL not found in .env file');
        process.exit(1);
    }
    if (!OPENAI_API_KEY) {
        console.error('❌ Error: OPENAI_API_KEY not found in .env file');
        process.exit(1);
    }

    try {
        // Fetch all events
        console.log('\n📡 Fetching events...');
        const eventsResponse = await fetch(`${POCKETBASE_URL}/api/collections/events/records?perPage=500`);
        const eventsData = await eventsResponse.json();
        const events = eventsData.items || [];
        console.log(`✅ Found ${events.length} total events`);

        // Fetch existing embeddings
        console.log('\n📡 Fetching existing embeddings...');
        const embeddingsResponse = await fetch(`${POCKETBASE_URL}/api/collections/event_embeddings/records?perPage=500`);
        const embeddingsData = await embeddingsResponse.json();
        const existingEmbeddings = new Set((embeddingsData.items || []).map(e => e.event));
        console.log(`✅ Found ${existingEmbeddings.size} existing embeddings`);

        // Find events needing embeddings
        const eventsNeedingEmbeddings = events.filter(event => !existingEmbeddings.has(event.id));
        console.log(`\n🔄 ${eventsNeedingEmbeddings.length} events need embeddings`);

        if (eventsNeedingEmbeddings.length === 0) {
            console.log('\n✅ All events already have embeddings!');
            return;
        }

        console.log('────────────────────────────────────────────────────────────');

        let successCount = 0;
        let errorCount = 0;

        for (const event of eventsNeedingEmbeddings) {
            try {
                // Create text to embed (title + description + topics + location)
                const topics = Array.isArray(event.topics) ? event.topics.join(', ') : '';
                const textToEmbed = `${event.title || ''} ${event.description || ''} ${topics} ${event.location || ''}`.trim();

                console.log(`📊 Generating embedding for: ${event.title.substring(0, 50)}...`);

                // Call OpenAI API
                const response = await fetch('https://api.openai.com/v1/embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'text-embedding-3-small',
                        input: textToEmbed
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`❌ API error for "${event.title}":`, response.status, errorData);
                    errorCount++;
                    continue;
                }

                const data = await response.json();
                const embedding = data.data[0].embedding;

                // Save embedding to PocketBase
                const saveResponse = await fetch(`${POCKETBASE_URL}/api/collections/event_embeddings/records`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event: event.id,
                        embedding: embedding,
                        model: 'text-embedding-3-small'
                    })
                });

                if (!saveResponse.ok) {
                    const errorData = await saveResponse.json();
                    console.error(`❌ Failed to save embedding for "${event.title}":`, errorData);
                    errorCount++;
                    continue;
                }

                console.log(`✅ Saved embedding for: ${event.title.substring(0, 50)}...`);
                successCount++;

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (err) {
                console.error(`❌ Error processing "${event.title}":`, err.message);
                errorCount++;
            }
        }

        // Summary
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`✅ Successfully generated: ${successCount} embeddings`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total processed: ${eventsNeedingEmbeddings.length} events`);
        console.log('════════════════════════════════════════════════════════════');

        if (errorCount === 0) {
            console.log('\n🎉 Embeddings generation completed successfully!');
        } else {
            console.log('\n⚠️  Embeddings generation completed with some errors. Review above.');
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
generateEmbeddings();
