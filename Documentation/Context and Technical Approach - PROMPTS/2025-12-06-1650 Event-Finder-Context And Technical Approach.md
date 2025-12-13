# Event Finder - Project Context

Last Updated: 2025-12-06

Use this document to bring a new Claude session up to speed on the project.

---

## Project Overview

**Event Finder** is a personal tool that aggregates public events from national security, defense, and intelligence community organizations into a single searchable database.

**Phase:** 1 (Personal Tool)
**Status:** All scrapers disabled awaiting permissions

---

## Tech Stack

| Component | Technology | Location |
|-----------|------------|----------|
| Backend Database | PocketBase | Railway (cloud) |
| Scripts | Node.js | Local + GitHub |
| AI Features | OpenAI API | text-embedding-3-small, gpt-4o-mini |
| Version Control | Git + GitHub | github.com/mtaylorUSA/event-finder-backend |
| Admin Interface | admin-interface.html | Local file |
| Public UI | event-finder-ui-v7.html | Local file |

---

## Current Database State

| Collection | Records | Purpose |
|------------|---------|---------|
| settings | 1 | Owner info for auto-generated emails |
| organizations | 21 | All organizations (18 pending permission, 3 rejected) |
| contacts | 11 | POC contacts for permission requests |
| events | 45 | Scraped event data |
| event_embeddings | 40 | AI embeddings for semantic search |

---

## Public UI Features (v7)

### Header
- **Event Finder** logo/title (click to clear filters and go home)
- **Search bar** beside logo (searches title and description only)

### Sidebar Filters
- **Event Format:** Virtual / In-Person checkboxes
- **Location filter:** Appears when In-Person is checked (within X miles of ZIP)
- **Date Range:** Start date (defaults to today), End date (optional)
- **View Results** button (🔍)
- **More Filters** button (Topics, Regions, Organizations)
- **Clear Filters** button (🚫)

### Event Cards Display
- **Title:** Event name
- **Description:** 2 lines max, pulled from database
- **Dates:** Full month format (e.g., "December 18, 2025" or "December 9-10, 2025")
- **Organization:** Linked to org website
- **Location:** City, ST format (extracts from title if location field is bad)
- **Link:** "More details and registration" (links to event page)

### Search Behavior
- Searches **title and description only** (not org name, topics, regions, location)
- Short terms (3 chars or less like "AI") use word boundary matching to avoid false positives
- Multi-word searches require all words to match

### Date Display Logic
| Scenario | Format |
|----------|--------|
| Single day | December 18, 2025 |
| Multi-day, same month | December 9-10, 2025 |
| Multi-day, different months | December 30, 2025 to January 2, 2026 |
| Multi-day, different years | December 30, 2025 to January 2, 2026 |

### Views
- **List View:** Event cards (default)
- **Calendar View:** Monthly calendar with events

---

## Organization Workflow (8-Stage Lifecycle)

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Discovery                                                    │
│  └─→ Pending Mission Review                                     │
│       ├─→ Mission Rejected (end)                                │
│       └─→ Mission Approved Pending Permission                   │
│            └─→ Permission Requested (Self/Lawyer)               │
│                 ├─→ Permission Rejected (end)                   │
│                 └─→ Permission Granted                          │
│                      └─→ Scraping Active                        │
└─────────────────────────────────────────────────────────────────┘
```

**Status Values:**
1. `Pending Mission Review` - AI-suggested, awaiting admin review
2. `Mission Approved Pending Permission` - Fits mission, needs permission
3. `Mission Rejected` - Does not fit project mission
4. `Permission Requested (Self)` - Owner sent email
5. `Permission Requested (Lawyer)` - Lawyer sent email
6. `Permission Granted` - Ready to enable scraping
7. `Permission Rejected` - Organization denied permission
8. `Scraping Active` - Currently being scraped

---

## Scripts

| Script | Purpose |
|--------|---------|
| `generate-permission-requests.js` | Auto-generate permission request email drafts |
| `add-contacts.js` | Add POC contacts to database |
| `suggest-organizations.js` | AI suggests new organizations |
| `scrape-all-organizations.js` | Master scraper for all enabled orgs |
| `scrape-cfr-events.js` | CFR-specific scraper |
| `scrape-cisa-events.js` | CISA-specific scraper |
| `scrape-insa-events.js` | INSA-specific scraper |
| `enrich-events.js` | AI-tag events with topics |
| `generate-embeddings.js` | Create embeddings for semantic search |
| `cleanup-orphaned-events.js` | Remove events without valid org |
| `cleanup-bad-events.js` | Remove malformed events |
| `base-scraper.js` | Template for new scrapers |
| `proxy-server.js` | Local proxy for CORS issues |

---

## Key Files

| File | Purpose |
|------|---------|
| `admin-interface.html` | Admin UI for managing orgs, contacts, events |
| `event-finder-ui-v7.html` | Public-facing event search UI |
| `.env` | Environment variables (LOCAL DRIVE ONLY) |
| `package.json` | Node.js dependencies |

---

## GitHub Secrets (for GitHub Actions)

| Secret Name | Purpose |
|-------------|---------|
| `POCKETBASE_URL` | PocketBase server URL |
| `POCKETBASE_ADMIN_EMAIL` | Admin login email |
| `POCKETBASE_ADMIN_PASSWORD` | Admin login password |
| `OPENAI_API_KEY` | OpenAI API key |

---

## Organizations (21 Total)

**Status: Mission Approved Pending Permission (18):**
- American Enterprise Institute (AEI)
- Atlantic Council
- Belfer Center (Harvard)
- Brookings Institution
- Center for a New American Security (CNAS)
- Center for Strategic and International Studies (CSIS)
- Chatham House
- Council on Foreign Relations (CFR)
- Cyber Threat Alliance
- CISA (Cybersecurity and Infrastructure Security Agency)
- Hoover Institution
- IISS (International Institute for Strategic Studies)
- INSA (Intelligence and National Security Alliance)
- INSS (Institute for National Security Studies)
- New America
- Potomac Officers Club
- RAND Corporation
- Stimson Center

**Status: Mission Rejected (3):**
- National Guard Bureau
- National Defense University
- National Security Agency

---

## Contacts (11 Total)

**Tier 1 - Permissions Contacts:**
- CFR: permissions@cfr.org
- RAND: permissions@rand.org
- Brookings: permissions@brookings.edu, events@brookings.edu
- CSIS: externalrelations@csis.org
- AEI: Jacqueline Derks (Director of Events)

**Tier 2 - General Contacts:**
- INSA: info@insaonline.org
- New America: media@newamerica.org
- Atlantic Council: press@atlanticcouncil.org
- Hoover: heather.campbell@stanford.edu
- Chatham House: contact@chathamhouse.org

---

## File Locations

| Item | Location |
|------|----------|
| Code | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| .env | `C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env` |
| Documentation | `...\Event Finder\Documentation\Prompts\` |

---

## PocketBase Admin URL

```
https://event-discovery-backend-production.up.railway.app/_/
```

---

## Next Steps

1. Run `generate-permission-requests.js` to create email drafts
2. Review drafts in PocketBase admin
3. Send permission requests to Tier 1 organizations (CFR, RAND, Brookings, CSIS, AEI)
4. Update organization status to "Permission Requested (Self)"
5. Wait for responses
6. Upon approval, update status to "Permission Granted" and enable scraping

---

## Documentation Files

| File | Purpose |
|------|---------|
| `PocketBase-UI-Reference.md` | How to use PocketBase admin interface |
| `PocketBase-Schema.md` | Current database schema and field details |
| `Running-Scripts.md` | How to execute scripts (Method A & B) |
| `Event-Finder-Context.md` | This file - project overview for Claude |
| `Workflow.md` | Detailed workflow documentation |
