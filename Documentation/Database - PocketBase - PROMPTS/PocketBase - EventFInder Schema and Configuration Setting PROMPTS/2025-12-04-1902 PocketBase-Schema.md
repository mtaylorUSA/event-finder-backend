\# PocketBase Schema - Event Finder



Last Updated: 2025-12-04



This document describes the current database schema for the Event Finder project.



---



\## Collections Overview



| Collection | Records | Purpose |

|------------|---------|---------|

| settings | 1 | App configuration and owner info |

| organizations | 21 | Organizations to scrape events from |

| contacts | 11 | POC contacts for organizations |

| events | 45 | Scraped event data |

| event\_embeddings | 40 | AI embeddings for semantic search |



---



\## settings Collection



Stores application configuration.



| Field | Type | Settings | Purpose |

|-------|------|----------|---------|

| setting\_name | Plain Text | max 100, Nonempty, Presentable | Unique identifier (e.g., "owner\_info") |

| my\_name | Plain Text | max 200, Nonempty | Owner's full name |

| my\_email | Email | Nonempty | Owner's email address |

| my\_mobile | Plain Text | max 50 | Owner's phone number |



\*\*Current Record:\*\*

\- setting\_name: `owner\_info`

\- Contains owner contact info for auto-generated permission request emails



---



\## organizations Collection



Stores all organizations (approved, pending, rejected) with unified status workflow.



| Field | Type | Settings | Purpose |

|-------|------|----------|---------|

| name | Plain Text | Nonempty, Presentable | Organization name |

| website | URL | | Main website |

| description | Plain Text | max 2000 | Organization description |

| org\_type | Plain Text | | Type (Government, Nonprofit, Think Tank, Academic, Professional Association) |

| events\_url | URL | | Direct link to events page |

| source\_id | Plain Text | max 100 | Unique domain identifier (e.g., "csis.org") |

| status | Select | Single, Nonempty, Presentable | Current workflow status (see below) |

| discovered\_date | DateTime | | When AI suggested this org |

| ai\_reasoning | Plain Text | max 2000 | Why AI suggested this org |

| similarity\_score | Number | min 0, max 100 | AI confidence score |

| tou\_flag | Bool | Presentable | True if TOU may prohibit scraping |

| tou\_notes | Plain Text | max 2000 | Notes about Terms of Use |

| permission\_request\_draft | Plain Text | max 5000 | Auto-generated email draft |

| permission\_correspondence | Plain Text | max 10000 | Approval email thread |

| permission\_requested\_date | DateTime | | When permission was requested |

| permission\_response\_date | DateTime | | When response was received |

| scraping\_enabled | Bool | | Whether scraper should run |

| last\_scraped | DateTime | | Last successful scrape |

| notes | Plain Text | | Admin notes |



\*\*Status Field Values (8-stage lifecycle):\*\*



| Status | Description |

|--------|-------------|

| Pending Mission Review | AI-suggested, awaiting admin review |

| Mission Approved Pending Permission | Approved for mission, needs permission request |

| Mission Rejected | Does not fit project mission |

| Permission Requested (Self) | Email sent by owner |

| Permission Requested (Lawyer) | Email sent by lawyer |

| Permission Granted | Permission received, ready to scrape |

| Permission Rejected | Organization denied permission |

| Scraping Active | Actively being scraped |



\*\*Current Counts by Status:\*\*

\- Mission Approved Pending Permission: 18

\- Mission Rejected: 3



---



\## contacts Collection



Stores POC contacts for organizations.



| Field | Type | Settings | Purpose |

|-------|------|----------|---------|

| name | Plain Text | Nonempty, Presentable | Contact name or team name |

| organization | Relation | → organizations, Single | Linked organization |

| title | Plain Text | | Job title |

| email | Email | | Contact email |

| phone | Plain Text | | Contact phone |

| contact\_type | Select | Single | Type: Leadership, Events, Legal/Permissions, Media/PR, Other |

| source\_url | URL | | Where contact info was found |

| notes | Plain Text | | Additional notes |

| last\_verified | DateTime | | When info was last verified |



\*\*Current Contacts (11 total):\*\*



Tier 1 (permissions contacts):

\- Council on Foreign Relations: permissions@cfr.org

\- The RAND Corporation: permissions@rand.org

\- The Brookings Institution: permissions@brookings.edu, events@brookings.edu

\- CSIS: externalrelations@csis.org

\- AEI: Jacqueline Derks (Director of Events)



Tier 2 (general contacts):

\- INSA: info@insaonline.org

\- New America: media@newamerica.org

\- Atlantic Council: press@atlanticcouncil.org

\- The Hoover Institution: heather.campbell@stanford.edu

\- Chatham House: contact@chathamhouse.org



---



\## events Collection



Stores scraped event data.



| Field | Type | Settings | Purpose |

|-------|------|----------|---------|

| title | Plain Text | Nonempty, Presentable | Event title |

| organization | Relation | → organizations, Single | Source organization |

| url | URL | | Link to event page |

| start\_date | DateTime | | Event start date |

| end\_date | DateTime | | Event end date |

| start\_time | Plain Text | | Event start time |

| end\_time | Plain Text | | Event end time |

| location | Plain Text | | Event location |

| description | Plain Text | | Event description |

| event\_type | Plain Text | | Type (webinar, in-person, hybrid) |

| registration\_url | URL | | Registration link |

| speakers | Plain Text | | Speaker names |

| topics | Plain Text | | Event topics/tags |

| source\_id | Plain Text | | Unique ID from source |

| raw\_data | JSON | | Original scraped data |

| created | DateTime | | When record was created |

| updated | DateTime | | When record was updated |



---



\## event\_embeddings Collection



Stores AI embeddings for semantic search.



| Field | Type | Settings | Purpose |

|-------|------|----------|---------|

| event | Relation | → events, Single | Linked event |

| embedding | JSON | | OpenAI embedding vector |

| model | Plain Text | | Model used (text-embedding-3-small) |

| created | DateTime | | When embedding was created |



---



\## Deleted Collections (v1.0 → v2.0 Migration)



These collections were consolidated into the `organizations` collection:

\- ~~suggested\_organizations~~ → Now: organizations with status "Pending Mission Review"

\- ~~rejected\_organizations~~ → Now: organizations with status "Mission Rejected"



\## Deleted Fields (v1.0 → v2.0 Migration)



These fields were replaced by the `status` field:

\- ~~mission\_approved~~ (Bool)

\- ~~terms\_status~~ (Select)

\- ~~permission\_status~~ (Select)

\- ~~permission\_requested\_by~~ (Select)

\- ~~lawyer\_verified~~ (Bool)

