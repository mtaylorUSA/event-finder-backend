# Event Finder - Project Context

## What It Is
Automated system to scrape/aggregate national security, defense, and intelligence community events. Currently in Phase 1 (personal tool, proof of concept).

## Current Status (November 2025)
- ⛔ **ALL SCRAPERS DISABLED** — awaiting permission responses
- ⛔ **GitHub Actions** — disabled
- ⛔ **Windows Task Scheduler** — disabled
- ✅ **PocketBase backend** — running on Railway

## Tech Stack
| Component | Technology | Location |
|-----------|------------|----------|
| Backend/Database | PocketBase (SQLite) | Railway |
| Backend URL | `https://event-discovery-backend-production.up.railway.app` |
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
- `users` — User accounts
- `events` — Scraped events (title, dates, location, org link, etc.)
- `organizations` — Event sources with permission status
- `suggested_organizations` — AI-nominated orgs awaiting review
- `rejected_organizations` — Orgs excluded from scraping
- `event_embeddings` — Vector embeddings for AI search

## Approval Workflow Summary
1. **AI suggests** new organizations → `suggested_organizations`
   - Gathers public info only (name, mission, POC, TOU)
   - **No event scraping at this stage**
2. **AI checks TOU** → flags if scraping may be prohibited (doesn't auto-reject)
3. **Admin reviews** for mission fit → approves or rejects
4. **Admin requests permission** from org POCs
5. **Permission granted** → enable scraping
6. **Permission denied** → add to `rejected_organizations`

## Guiding Principles
- Minimize costs (free/cheap solutions)
- Automate everything possible
- Zero legal risk (get permission before scraping)
- Technical simplicity
