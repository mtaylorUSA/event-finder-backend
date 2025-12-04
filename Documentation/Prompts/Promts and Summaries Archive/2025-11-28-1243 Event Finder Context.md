# Event Finder - Project Context

**Last Updated:** 2025-11-28

## What It Is

Automated system to scrape/aggregate national security, defense, and intelligence community events. Currently in Phase 1 (personal tool, proof of concept).

## Current Status (November 2025)

- ⛔ **ALL SCRAPERS DISABLED** — awaiting permission responses
- ⛔ **GitHub Actions** — disabled
- ⛔ **Windows Task Scheduler** — disabled
- ✅ **PocketBase backend** — running on Railway
- ✅ **Database schema** — rebuilt and optimized (2025-11-28)

## Tech Stack

| Component | Technology | Location |
|-----------|------------|----------|
| Backend/Database | PocketBase (SQLite) | Railway |
| Backend URL | `https://event-discovery-backend-production.up.railway.app` |
| PocketBase Admin | `https://event-discovery-backend-production.up.railway.app/_/` |
| GitHub Repo | `https://github.com/mtaylorUSA/event-finder-backend` |
| Local Project | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| Scraping | Node.js (Axios + Cheerio) | Local |
| AI Embeddings | OpenAI | API |
| Admin Interface | `admin-interface.html` (single-file HTML) | Local |

## Key Files

- `base-scraper.js` — Universal scraper for any organization
- `scrape-all-organizations.js` — Master script for all orgs
- `admin-interface.html` — Manual management UI
- `generate-embeddings.js` — AI embeddings generation
- `.env` — API keys (never expose)

## PocketBase Collections

| Collection | Purpose | Records |
|------------|---------|---------|
| `users` | User accounts (built-in auth) | 0 |
| `contacts` | Contact persons for organizations (multi-contact support) | 0 |
| `events` | Scraped events (title, dates, location, org link, etc.) | 40 |
| `organizations` | Approved event sources with permission tracking | 14 |
| `suggested_organizations` | AI-nominated orgs awaiting review | 0 |
| `rejected_organizations` | Orgs excluded from scraping | 0 |
| `event_embeddings` | Vector embeddings for AI search | 40 |

## Database Design Principles

- **Contacts are centralized** — all contact persons stored in `contacts` collection with relations to organizations
- **Suggested orgs are temporary** — POC data stored temporarily, then moved to `contacts` upon approval
- **Deduplication via `source_id`** — events use `source_id` field to prevent duplicate scraping
- **Consistent naming** — `org_type` used across all collections (not `organization_type`)

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

## Guiding Principles

- Minimize costs (free/cheap solutions)
- Automate everything possible
- Zero legal risk (get permission before scraping)
- Technical simplicity
- Consistent database design
