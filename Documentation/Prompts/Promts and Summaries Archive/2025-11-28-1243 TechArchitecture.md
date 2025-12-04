# Event Finder - Tech Architecture

**Last Updated:** 2025-11-28

## Hosting & Services

| Service | Purpose | URL/Location |
|---------|---------|--------------|
| **Railway** | Hosts PocketBase backend | `https://event-discovery-backend-production.up.railway.app` |
| **PocketBase Admin** | Database management UI | `https://event-discovery-backend-production.up.railway.app/_/` |
| **GitHub** | Version control, Actions | `https://github.com/mtaylorUSA/event-finder-backend` |
| **OpenAI API** | Embeddings for semantic search | API key in `.env` |

## Local Development

| Component | Details |
|-----------|---------|
| **Computer** | HP Envy x360, Windows 11 |
| **Project Folder** | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| **Command Line** | PowerShell |
| **Runtime** | Node.js (JavaScript) |
| **Scraping Libraries** | Axios (HTTP requests) + Cheerio (HTML parsing) |

## Key Files

| File | Purpose |
|------|---------|
| `admin-interface.html` | Single-file web app for manual management |
| `base-scraper.js` | Universal scraper (works for any organization) |
| `scrape-all-organizations.js` | Master script that processes all orgs |
| `generate-embeddings.js` | Creates AI embeddings for events |
| `sync-organizations.js` | Syncs org data with PocketBase |
| `organizations.json` | Local org configuration |
| `.env` | API keys — **never expose** |
| `.gitignore` | Files excluded from GitHub |

## Folder Structure

```
Event Finder/
├── .github/              # GitHub Actions workflows
├── backup-2024-11-15/    # Old backup
├── Documentation/        # Project docs
├── node_modules/         # npm packages (auto-generated)
├── .env                  # API keys (secret)
├── admin-interface.html  # Admin UI
├── base-scraper.js       # Universal scraper
├── scrape-all-organizations.js
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
│   - Relation to org     │       │   - Relation to event   │
└─────────────────────────┘       └─────────────────────────┘

┌─────────────────────────┐
│ rejected_organizations  │  ← Orgs that didn't pass review
│   - rejection_reason    │
│   - rejected_date       │
└─────────────────────────┘
```

### Collection Record Counts (as of 2025-11-28)

| Collection | Records |
|------------|---------|
| `users` | 0 |
| `contacts` | 0 |
| `events` | 40 |
| `organizations` | 14 |
| `suggested_organizations` | 0 |
| `rejected_organizations` | 0 |
| `event_embeddings` | 40 |

## Deduplication Strategy

### Event Deduplication

- **Field:** `source_id` in `events` collection
- **How it works:** Each event has a unique identifier from the source website
- **Check:** Before inserting, script checks if `source_id` already exists
- **Result:** Duplicates are skipped, not inserted

### Organization Deduplication

- **When:** AI suggestion script runs
- **Checks:** All 3 collections before suggesting:
  - `organizations` (approved)
  - `suggested_organizations` (pending)
  - `rejected_organizations` (rejected)
- **Matching:** Name and/or website URL
- **Result:** Duplicates are skipped, not suggested

## Automation Status (November 2025)

| Automation | Status | Notes |
|------------|--------|-------|
| **GitHub Actions** | ⛔ DISABLED | Was: daily 8 AM EST scraping |
| **Windows Task Scheduler** | ⛔ DISABLED | "Conference Finder Agent" & "Finder Agent" |
| **Railway Scrapers** | ⛔ DISABLED | No active deployments |

## Scraper Behavior (when enabled)

- 2-second delay between organizations (polite scraping)
- Automatic deduplication via `source_id`
- Requires permission before reactivation
- Only scrapes orgs where `scraping_enabled = true`
