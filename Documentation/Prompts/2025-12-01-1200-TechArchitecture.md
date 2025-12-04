# Event Finder - Tech Architecture

**Last Updated:** 2025-12-01

## Hosting & Services

| Service | Purpose | URL/Location |
|---------|---------|--------------|
| **Railway** | Hosts PocketBase backend | `https://event-discovery-backend-production.up.railway.app` |
| **PocketBase Admin** | Database management UI | `https://event-discovery-backend-production.up.railway.app/_/` |
| **GitHub** | Version control, Actions | `https://github.com/mtaylorUSA/event-finder-backend` |
| **OpenAI API** | Embeddings & AI tagging | API key in `.env` |

## Local Development

| Component | Details |
|-----------|---------|
| **Computer** | HP Envy x360, Windows 11 |
| **Project Folder** | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| **Command Line** | PowerShell |
| **Runtime** | Node.js (JavaScript) |
| **Scraping Libraries** | node-fetch (HTTP requests) + Cheerio (HTML parsing) |
| **Local Server** | `npx http-server -p 8080 --cors` (for running UI locally) |

## Key Files

### User Interfaces
| File | Purpose |
|------|---------|
| `event-finder-ui-v3.html` | Public-facing event finder UI |
| `admin-interface.html` | Admin management UI |

### Scrapers
| File | Purpose |
|------|---------|
| `scrape-cfr-events.js` | CFR deep scraper (Level 2 - visits each event page) |
| `scrape-cisa-events.js` | CISA basic scraper (Level 1 - list page only) |
| `scrape-insa-events.js` | INSA basic scraper (Level 1 - list page only) |
| `scrape-all-organizations.js` | Master script that processes all orgs |
| `base-scraper.js` | Universal scraper template |

### AI Scripts
| File | Purpose |
|------|---------|
| `enrich-events.js` | AI tagging for topics and regions (GPT-4o-mini) |
| `suggest-organizations.js` | AI organization suggestions (GPT-4o-mini) |
| `generate-embeddings.js` | Creates AI embeddings for events |

### Configuration
| File | Purpose |
|------|---------|
| `.env` | API keys — **never expose** |
| `.gitignore` | Files excluded from GitHub |
| `organizations.json` | Local org configuration |
| `scrape-events.yml` | GitHub Actions workflow |

## Folder Structure

```
Event Finder/
├── .github/              # GitHub Actions workflows
├── Documentation/        # Project docs
├── node_modules/         # npm packages (auto-generated)
├── .env                  # API keys (secret)
├── admin-interface.html  # Admin UI
├── event-finder-ui-v3.html # Public UI
├── scrape-cfr-events.js  # CFR deep scraper
├── scrape-cisa-events.js # CISA scraper
├── scrape-insa-events.js # INSA scraper
├── scrape-all-organizations.js
├── enrich-events.js      # AI tagging
├── suggest-organizations.js
├── generate-embeddings.js
├── package.json          # npm dependencies
└── README.md
```

## Database Architecture

### Collections Overview

```
┌─────────────────────────┐
│ suggested_organizations │  ← AI suggestions (staging area)
│   - poc_name, etc.      │  ← Temporary POC data
│   - status: Pending     │
└───────────┬─────────────┘
            │ Admin approves (status: Mission Approved)
            ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│     organizations       │◄──────│       contacts          │
│   - scraping_enabled    │       │   - Multiple per org    │
│   - permission_status   │       │   - contact_type        │
│   - events_url          │       │   - Relation to org     │
└───────────┬─────────────┘       └─────────────────────────┘
            │ Scraping (when enabled)
            ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│        events           │◄──────│    event_embeddings     │
│   - source_id (dedupe)  │       │   - AI vector search    │
│   - topics (multi)      │       │   - Relation to event   │
│   - regions (multi)     │       └─────────────────────────┘
│   - Relation to org     │
└─────────────────────────┘

┌─────────────────────────┐
│ rejected_organizations  │  ← Orgs that didn't pass review
│   - rejection_reason    │
│   - rejected_date       │
└─────────────────────────┘
```

### Collection Record Counts (as of 2025-12-01)

| Collection | Records |
|------------|---------|
| `users` | 0 |
| `contacts` | 0 |
| `events` | 45 |
| `organizations` | 19 |
| `suggested_organizations` | 8 |
| `rejected_organizations` | 0 |
| `event_embeddings` | 40 |

## Scraper Architecture

### Level 1: Basic Scrapers (Current CISA, INSA)
```
Events List Page
      │
      ▼
Extract: title, URL, date (limited)
      │
      ▼
Save to PocketBase
```
**Limitation:** Missing full descriptions, complete addresses

### Level 2: Deep Scrapers (CFR)
```
Events List Page
      │
      ▼
Extract event URLs
      │
      ▼
Visit each event page ──► Extract: title, full description,
      │                    date/time, location, speakers
      ▼
Save to PocketBase
```
**Benefit:** Complete event information

## AI Tagging System

### Topics (13 categories)
- AI & Emerging Tech
- Careers & Professional Development
- Climate & Security
- Counterterrorism
- Cybersecurity
- Defense Policy
- Diplomacy & Statecraft
- Economic Security
- Homeland Security
- Intelligence
- Military Operations
- Nuclear/WMD
- Space & Satellites

### Regions (10 categories)
- Africa
- Arctic
- China
- Domestic US
- Europe/NATO
- Global/Multilateral
- Indo-Pacific
- Latin America
- Middle East
- Russia

### How It Works
1. `enrich-events.js` reads events from PocketBase
2. Sends title + description to GPT-4o-mini
3. AI returns matching topics and regions
4. Script validates against allowed values
5. Updates event records in PocketBase

## User Interface Architecture

### Event Finder UI (`event-finder-ui-v3.html`)

**Requirements:**
- Must run through local web server (CORS)
- Command: `npx http-server -p 8080 --cors`
- URL: `http://localhost:8080/event-finder-ui-v3.html`

**Features:**
| Feature | Description |
|---------|-------------|
| Header | Org count (clickable), Upcoming count (clickable) |
| Search | Centered search box |
| Filters | Topics, Regions, Organizations, Event Type, Date Range |
| Location | Zip code + radius (UI only, not functional) |
| Views | List (tiles), Calendar |
| Event Tiles | Gradient + emoji image, inline field labels |

**Topic-based Gradients:**
| Topic | Color |
|-------|-------|
| Cybersecurity | Purple |
| Defense Policy | Blue |
| Intelligence | Dark gray |
| Nuclear/WMD | Orange-red |
| Space & Satellites | Dark blue-purple |
| AI & Emerging Tech | Teal-cyan |
| Counterterrorism | Red |
| Military Operations | Green |
| Homeland Security | Navy |
| Climate & Security | Green |
| Economic Security | Gold |
| Diplomacy & Statecraft | Purple |
| Careers | Gray |

## Deduplication Strategy

### Event Deduplication

- **Field:** `source_id` in `events` collection
- **How it works:** Each event has a unique identifier (usually the URL)
- **Check:** Before inserting, script checks if `source_id` already exists
- **Result:** Duplicates are skipped or updated, not duplicated

### Organization Deduplication

- **When:** AI suggestion script runs
- **Checks:** All 3 collections before suggesting:
  - `organizations` (approved)
  - `suggested_organizations` (pending)
  - `rejected_organizations` (rejected)
- **Matching:** Name and/or website URL
- **Result:** Duplicates are skipped, not suggested

## Automation Status (December 2025)

| Automation | Status | Notes |
|------------|--------|-------|
| **GitHub Actions** | ⛔ DISABLED | Was: daily 8 AM EST scraping |
| **Windows Task Scheduler** | ⛔ DISABLED | "Conference Finder Agent" & "Finder Agent" |
| **Railway Scrapers** | ⛔ DISABLED | No active deployments |

## Environment Variables (`.env`)

```
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=your-email@example.com
POCKETBASE_ADMIN_PASSWORD=your-password
OPENAI_API_KEY=sk-...
```

## API Access

### Public APIs (no auth required)
- `GET /api/collections/events/records`
- `GET /api/collections/organizations/records`

### Admin APIs (auth required)
- All write operations
- `contacts` collection
- `suggested_organizations` collection
- `rejected_organizations` collection
- `event_embeddings` collection
