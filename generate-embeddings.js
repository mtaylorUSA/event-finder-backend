require('dotenv').config();
const fetch = require('node-fetch');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateEmbeddings() {
  try {
    console.log('Fetching events without embeddings...');
    
    const eventsResponse = await fetch(`${POCKETBASE_URL}/api/collections/events/records?perPage=500`);
    const eventsData = await eventsResponse.json();
    const events = eventsData.items || [];

    console.log(`Found ${events.length} total events`);

    const embeddingsResponse = await fetch(`${POCKETBASE_URL}/api/collections/event_embeddings/records?perPage=500`);
    const embeddingsData = await embeddingsResponse.json();
    const existingEmbeddings = new Set((embeddingsData.items || []).map(e => e.event));

    const eventsNeedingEmbeddings = events.filter(event => !existingEmbeddings.has(event.id));
    console.log(`${eventsNeedingEmbeddings.length} events need embeddings`);

    for (const event of eventsNeedingEmbeddings) {
      try {
        const textToEmbed = `${event.title} ${event.description} ${event.location}`.trim();
        
        console.log(`Generating embedding for: ${event.title}`);

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
          console.error(`API error for "${event.title}":`, response.status, errorData);
          continue;
        }

        const data = await response.json();
        const embedding = data.data[0].embedding;

        const createResponse = await fetch(`${POCKETBASE_URL}/api/collections/event_embeddings/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: event.id,
            embedding: embedding,
            model: 'text-embedding-3-small'
          })
        });

        if (createResponse.ok) {
          console.log(`✓ Created embedding for: ${event.title}`);
        } else {
          const errorData = await createResponse.json();
          console.error(`Failed to save embedding for "${event.title}":`, errorData);
        }

      } catch (err) {
        console.error(`Error processing "${event.title}":`, err.message);
      }
    }

    console.log('Embedding generation complete!');
  } catch (error) {
    console.error('Embedding generation failed:', error.message);
  }
}

generateEmbeddings();