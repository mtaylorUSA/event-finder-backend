# National Security Events Backend

PocketBase backend for discovering and managing national security events.

## Collections

- **organizations** - Event organizers (CISA, etc.)
- **events** - Scraped events with details
- **event_embeddings** - AI-generated embeddings for semantic search

## Scripts

- **scrape-cisa-events.js** - Scrapes events from CISA
- **generate-embeddings.js** - Generates embeddings for events

## Setup

1. Install dependencies: `npm install`
2. Create .env file with API keys
3. Run scraper: `node scrape-cisa-events.js`
4. Generate embeddings: `node generate-embeddings.js`
