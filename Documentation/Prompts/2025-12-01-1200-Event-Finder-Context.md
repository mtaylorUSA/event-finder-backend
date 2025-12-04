# Event Finder - Project Context

**Last Updated:** 2025-12-01

## What It Is

Automated system to scrape/aggregate national security, defense, and intelligence community events. Currently in Phase 1 (personal tool, proof of concept).

## Current Status (December 2025)

- ⛔ **ALL SCRAPERS DISABLED** — awaiting permission responses
- ⛔ **GitHub Actions** — disabled
- ⛔ **Windows Task Scheduler** — disabled
- ✅ **PocketBase backend** — running on Railway
- ✅ **Database schema** — rebuilt and optimized (2025-11-28)
- ✅ **User Interface** — `event-finder-ui-v3.html` (single-file HTML)
- ✅ **AI Tagging** — Events tagged with topics and regions
- 🔧 **Deep Scrapers** — CFR scraper created, needs testing

## Tech Stack

| Component | Technology | Location |
|-----------|------------|----------|
| Backend/Database | PocketBase (SQLite) | Railway |
| Backend URL | `https://event-discovery-backend-production.up.railway.app` |
| PocketBase Admin | `https://event-discovery-backend-production.up.railway.app/_/` |
| GitHub Repo | `https://github.com/mtaylorUSA/event-finder-backend` |
| Local Project | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| Scraping | Node.js (Cheerio + node-fetch) | Local |
| AI Embeddings | OpenAI | API |
| AI Tagging | OpenAI GPT-4o-mini | API |
| Admin Interface | `admin-interface.html` (single-file HTML) | Local |
| User Interface | `event-finder-ui-v3.html` (single-file HTML) | Local |

## Key Files

### Interfaces
- `admin-interface.html` — Admin management UI
- `event-finder-ui-v3.html` — Public-facing event finder UI

### Scrapers
- `scrape-cisa-events.js` — CISA events (basic scraper)
- `scrape-insa-events.js` — INSA events (basic scraper)
- `scrape-cfr-events.js` — CFR events (deep scraper - visits each event page)
- `scrape-all-organizations.js` — Master script for all orgs
- `base-scraper.js` — Universal scraper template

### AI Scripts
- `enrich-events.js` — AI tagging for topics and regions
- `suggest-organizations.js` — AI organization suggestions
- `generate-embeddings.js` — AI embeddings generation

### Configuration
- `.env` — API keys (never expose)

## PocketBase Collections

| Collection | Purpose | Records |
|------------|---------|---------|
| `users` | User accounts (built-in auth) | 0 |
| `contacts` | Contact persons for organizations (multi-contact support) | 0 |
| `events` | Scraped events (title, dates, location, org link, etc.) | 45 |
| `organizations` | Approved event sources with permission tracking | 19 |
| `suggested_organizations` | AI-nominated orgs awaiting review | 8 |
| `rejected_organizations` | Orgs excluded from scraping | 0 |
| `event_embeddings` | Vector embeddings for AI search | 40 |

## Events Schema - Key Fields

| Field | Purpose |
|-------|---------|
| `title` | Event name |
| `description` | Event details |
| `start_date` | Event start date |
| `end_date` | Event end date (for multi-day events) |
| `start_time` | Event start time |
| `location` | Venue address or "Virtual" |
| `url` | Registration/event page link |
| `organization` | Relation to organizations collection |
| `source_id` | Unique ID for deduplication (usually the URL) |
| `event_type` | Virtual, In-person, or Hybrid |
| `topics` | Multi-select: AI & Emerging Tech, Careers & Professional Development, Climate & Security, Counterterrorism, Cybersecurity, Defense Policy, Diplomacy & Statecraft, Economic Security, Homeland Security, Intelligence, Military Operations, Nuclear/WMD, Space & Satellites |
| `regions` | Multi-select: Africa, Arctic, China, Domestic US, Europe/NATO, Global/Multilateral, Indo-Pacific, Latin America, Middle East, Russia |

## Database Design Principles

- **Contacts are centralized** — all contact persons stored in `contacts` collection with relations to organizations
- **Suggested orgs are temporary** — POC data stored temporarily, then moved to `contacts` upon approval
- **Deduplication via `source_id`** — events use `source_id` field to prevent duplicate scraping
- **Consistent naming** — `org_type` used across all collections (not `organization_type`)
- **AI Tagging** — Events have `topics` and `regions` multi-select fields for filtering

## Scraper Types

### Basic Scrapers (Level 1)
- Only scrape event list page
- Get: title, URL, date (limited info)
- Missing: full description, complete location
- Examples: `scrape-cisa-events.js`, `scrape-insa-events.js`

### Deep Scrapers (Level 2)
- Scrape event list page for URLs
- Visit each event page for full details
- Get: title, URL, date, full description, location, time
- Example: `scrape-cfr-events.js`

## User Interface Features

### Event Finder UI (`event-finder-ui-v3.html`)
- **Header:** Organizations count (clickable), Upcoming events count (clickable)
- **Search:** Centered search box
- **Filters:** Filter & Sort modal with topics, regions, organizations, event type, date range
- **Location:** Zip code + radius (UI only, not functional yet)
- **Views:** List view (tiles), Calendar view
- **Event Tiles:** Gradient + emoji image based on topic, inline field labels

### Running the UI Locally
Must run through local web server (CORS requirement):
```
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
npx http-server -p 8080 --cors
```
Then open: `http://localhost:8080/event-finder-ui-v3.html`

## Approval Workflow Summary

1. **AI suggests** new organizations → `suggested_organizations`
   - Gathers public info only (name, mission, POC, TOU)
   - Checks for duplicates across all 3 org collections
   - **No event scraping at this stage**
2. **AI checks TOU** → flags if scraping may be prohibited (doesn't auto-reject)
3. **Admin reviews** for mission fit → approves or rejects
4. **Admin creates contacts** → POC data moves from `suggested_organizations` to `contacts`
5. **Admin requests permission** from org POCs
6. **Permission granted** → enable scraping
7. **Permission denied** → add to `rejected_organizations`

## Known Data Quality Issues

| Issue | Status | Solution |
|-------|--------|----------|
| Descriptions empty or wrong | 🔴 Active | Deep scrapers needed for each org |
| Locations incomplete (city only) | 🔴 Active | Deep scrapers needed |
| Multi-day events not showing range | 🟡 Partial | UI supports it, scrapers need `end_date` |

## Guiding Principles

- Minimize costs (free/cheap solutions)
- Automate everything possible
- Zero legal risk (get permission before scraping)
- Technical simplicity
- Consistent database design
