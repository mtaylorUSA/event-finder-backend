\# Event Finder - Project Context



Last Updated: 2025-12-04



Use this document to bring a new Claude session up to speed on the project.



---



\## Project Overview



\*\*Event Finder\*\* is a personal tool that aggregates public events from national security, defense, and intelligence community organizations into a single searchable database.



\*\*Phase:\*\* 1 (Personal Tool)

\*\*Status:\*\* All scrapers disabled awaiting permissions



---



\## Tech Stack



| Component | Technology | Location |

|-----------|------------|----------|

| Backend Database | PocketBase | Railway (cloud) |

| Scripts | Node.js | Local + GitHub |

| AI Features | OpenAI API | text-embedding-3-small, gpt-4o-mini |

| Version Control | Git + GitHub | github.com/mtaylorUSA/event-finder-backend |

| Admin Interface | admin-interface.html | Local file |

| Public UI | event-finder-ui-v3.html | Local file |



---



\## Current Database State



| Collection | Records | Purpose |

|------------|---------|---------|

| settings | 1 | Owner info for auto-generated emails |

| organizations | 21 | All organizations (18 pending permission, 3 rejected) |

| contacts | 11 | POC contacts for permission requests |

| events | 45 | Scraped event data |

| event\_embeddings | 40 | AI embeddings for semantic search |



---



\## Organization Workflow (8-Stage Lifecycle)

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



\*\*Status Values:\*\*

1\. `Pending Mission Review` - AI-suggested, awaiting admin review

2\. `Mission Approved Pending Permission` - Fits mission, needs permission

3\. `Mission Rejected` - Does not fit project mission

4\. `Permission Requested (Self)` - Owner sent email

5\. `Permission Requested (Lawyer)` - Lawyer sent email

6\. `Permission Granted` - Ready to enable scraping

7\. `Permission Rejected` - Organization denied permission

8\. `Scraping Active` - Currently being scraped



---



\## Scripts



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



\## Key Files



| File | Purpose |

|------|---------|

| `admin-interface.html` | Admin UI for managing orgs, contacts, events |

| `event-finder-ui-v3.html` | Public-facing event search UI |

| `.env` | Environment variables (LOCAL DRIVE ONLY) |

| `package.json` | Node.js dependencies |



---



\## GitHub Secrets (for GitHub Actions)



| Secret Name | Purpose |

|-------------|---------|

| `POCKETBASE\_URL` | PocketBase server URL |

| `POCKETBASE\_ADMIN\_EMAIL` | Admin login email |

| `POCKETBASE\_ADMIN\_PASSWORD` | Admin login password |

| `OPENAI\_API\_KEY` | OpenAI API key |



---



\## Organizations (21 Total)



\*\*Status: Mission Approved Pending Permission (18):\*\*

\- American Enterprise Institute (AEI)

\- Atlantic Council

\- Belfer Center (Harvard)

\- Brookings Institution

\- Center for a New American Security (CNAS)

\- Center for Strategic and International Studies (CSIS)

\- Chatham House

\- Council on Foreign Relations (CFR)

\- Cyber Threat Alliance

\- CISA (Cybersecurity and Infrastructure Security Agency)

\- Hoover Institution

\- IISS (International Institute for Strategic Studies)

\- INSA (Intelligence and National Security Alliance)

\- INSS (Institute for National Security Studies)

\- New America

\- Potomac Officers Club

\- RAND Corporation

\- Stimson Center



\*\*Status: Mission Rejected (3):\*\*

\- National Guard Bureau

\- National Defense University

\- National Security Agency



---



\## Contacts (11 Total)



\*\*Tier 1 - Permissions Contacts:\*\*

\- CFR: permissions@cfr.org

\- RAND: permissions@rand.org

\- Brookings: permissions@brookings.edu, events@brookings.edu

\- CSIS: externalrelations@csis.org

\- AEI: Jacqueline Derks (Director of Events)



\*\*Tier 2 - General Contacts:\*\*

\- INSA: info@insaonline.org

\- New America: media@newamerica.org

\- Atlantic Council: press@atlanticcouncil.org

\- Hoover: heather.campbell@stanford.edu

\- Chatham House: contact@chathamhouse.org



---



\## File Locations



| Item | Location |

|------|----------|

| Code | `C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder` |

| .env | `C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL\\.env` |

| Documentation | `...\\Event Finder\\Documentation\\Prompts\\` |



---



\## PocketBase Admin URL

```

https://event-discovery-backend-production.up.railway.app/\_/

```





\## Documentation Files



| File | Purpose |

|------|---------|

| `PocketBase-UI-Reference.md` | How to use PocketBase admin interface |

| `PocketBase-Schema.md` | Current database schema and field details |

| `Running-Scripts.md` | How to execute scripts (Method A \& B) |

| `Event-Finder-Context and Tech Architecture.md` | This file - project overview for Claude |

| `Workflow.md` | Detailed workflow documentation |

