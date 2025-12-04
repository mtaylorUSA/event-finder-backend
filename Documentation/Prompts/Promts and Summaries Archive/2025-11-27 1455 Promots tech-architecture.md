# Event Finder - Tech Architecture

## Hosting & Services

| Service | Purpose | URL/Location |
|---------|---------|--------------|
| **Railway** | Hosts PocketBase backend | `https://event-discovery-backend-production.up.railway.app` |
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

## Automation Status (November 2025)

| Automation | Status | Notes |
|------------|--------|-------|
| **GitHub Actions** | ⛔ DISABLED | Was: daily 8 AM EST scraping |
| **Windows Task Scheduler** | ⛔ DISABLED | "Conference Finder Agent" & "Finder Agent" |
| **Railway Scrapers** | ⛔ DISABLED | No active deployments |

## Scraper Behavior (when enabled)

- 2-second delay between organizations (polite scraping)
- Automatic deduplication
- Requires permission before reactivation
