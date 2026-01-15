# PocketBase Schema - Event Finder

# Last Updated: 2025-12-06

This document describes the current database schema for the Event Finder project.

---

## Collections Overview

| Collection | Records | Purpose |
|------------|---------|---------|
| settings | 1 | App configuration and owner info |
| organizations | 21 | Organizations to scrape events from |
| contacts | 11 | POC contacts for organizations |
| events | 45 | Scraped event data |
| event_embeddings | 40 | AI embeddings for semantic search |

---

## settings Collection

Stores application configuration.

| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| setting_name | Plain Text | max 100, Nonempty, Presentable | Unique identifier (e.g., "owner_info") |
| my_name | Plain Text | max 200, Nonempty | Owner's full name |
| my_email | Email | Nonempty | Owner's email address |
| my_mobile | Plain Text | max 50 | Owner's phone number |

**Current Record:**
- setting_name: `owner_info`
- Contains owner contact info for auto-generated permission request emails

---

## organizations Collection

Stores all organizations (approved, pending, rejected) with unified status workflow.

| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| name | Plain Text | Nonempty, Presentable | Organization name |

| website | URL | | Main website |

| description | Plain Text | max 2000 | Organization description |

| org_type | Plain Text | | Type (Government, Nonprofit, Think Tank, Academic, Professional Association) |

| events_url | URL | | Direct link to events page |

| source_id | Plain Text | max 100 | Unique domain identifier (e.g., "csis.org") |

| status | Select | Single, Nonempty, Presentable | Current workflow status (see below) |

| discovered_date | DateTime | | When AI suggested this org |

| ai_reasoning | Plain Text | max 2000 | Why AI suggested this org |

| similarity_score | Number | min 0, max 100 | AI confidence score |

| tou_flag | Bool | Presentable | True if TOU may prohibit scraping |

| tou_notes | Plain Text | max 2000 | Notes about Terms of Use |

| permission_request_draft | Plain Text | max 5000 | Auto-generated email draft |

| permission_correspondence | Plain Text | max 10000 | Approval email thread |

| permission_requested_date | DateTime | | When permission was requested |

| permission_response_date | DateTime | | When response was received |

| scraping_enabled | Bool | | Whether scraper should run |

| last_scraped | DateTime | | Last successful scrape |

| notes | Plain Text | | Admin notes |


**Status Field Values (8-stage lifecycle):**

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

**Current Counts by Status:**
- Mission Approved Pending Permission: 18
- Mission Rejected: 3

---

## contacts Collection

Stores POC contacts for organizations.

| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| name | Plain Text | Nonempty, Presentable | Contact name or team name |
| organization | Relation | → organizations, Single | Linked organization |
| title | Plain Text | | Job title |
| email | Email | | Contact email |
| phone | Plain Text | | Contact phone |
| contact_type | Select | Single | Type: Leadership, Events, Legal/Permissions, Media/PR, Other |
| source_url | URL | | Where contact info was found |
| notes | Plain Text | | Additional notes |
| last_verified | DateTime | | When info was last verified |

**Current Contacts (11 total):**

Tier 1 (permissions contacts):
- Council on Foreign Relations: permissions@cfr.org
- The RAND Corporation: permissions@rand.org
- The Brookings Institution: permissions@brookings.edu, events@brookings.edu
- CSIS: externalrelations@csis.org
- AEI: Jacqueline Derks (Director of Events)

Tier 2 (general contacts):
- INSA: info@insaonline.org
- New America: media@newamerica.org
- Atlantic Council: press@atlanticcouncil.org
- The Hoover Institution: heather.campbell@stanford.edu
- Chatham House: contact@chathamhouse.org

---

## events Collection

Stores scraped event data.

| Field | Type | Settings | Purpose | UI Display |
|-------|------|----------|---------|------------|
| title | Plain Text | Nonempty, Presentable | Event title | ✅ Displayed, searchable |
| organization | Relation | → organizations, Single | Source organization | ✅ Displayed with link to website |
| url | URL | | Link to event page | ✅ Used for "More details and registration" link |
| start_date | DateTime | | Event start date | ✅ Used for date display and filtering |
| end_date | DateTime | | Event end date | ✅ Used for multi-day date display |
| start_time | Plain Text | | Event start time | ❌ Stored but NOT displayed |
| end_time | Plain Text | | Event end time | ❌ Stored but NOT displayed |
| location | Plain Text | | Event location | ✅ Displayed (City, ST format preferred) |
| description | Plain Text | | Event description | ✅ Displayed (2 lines max), searchable |
| event_type | Plain Text | | Type (webinar, in-person, hybrid) | ✅ Used for Virtual/In-Person filtering |
| registration_url | URL | | Registration link | ✅ Used if available, else `url` is used |
| speakers | Plain Text | | Speaker names | ❌ Not currently displayed |
| topics | Plain Text | | Event topics/tags | ✅ Used in More Filters, shown as emoji on card |
| regions | Plain Text | | Geographic regions | ✅ Used in More Filters |
| source_id | Plain Text | | Unique ID from source | ❌ Internal use only |
| raw_data | JSON | | Original scraped data | ❌ Internal use only |
| created | DateTime | | When record was created | ❌ Internal use only |
| updated | DateTime | | When record was updated | ❌ Internal use only |

### UI Display Notes

**Date Display Format:**
- Times (start_time, end_time) are stored but **NOT displayed** on the front-end
- This avoids complexity with multi-day events that may have different times each day
- Users click "More details and registration" to see specific times on the org's website

| Date Scenario | Display Format |
|---------------|----------------|
| Single day | December 18, 2025 |
| Multi-day, same month | December 9-10, 2025 |
| Multi-day, different months | December 30, 2025 to January 2, 2026 |
| Multi-day, different years | December 30, 2025 to January 2, 2026 |

**Location Display Logic:**
- If `event_type` contains "virtual" → displays "Virtual"
- If `event_type` contains "hybrid" → displays "Hybrid - City, ST"
- If `location` field has valid City, ST → displays as-is
- If `location` field has bad value (like "in-person") → extracts City, ST from title if possible
- Fallback → "Location TBD"

**Description Display:**
- Displayed on event cards with 2-line maximum (CSS truncation)
- HTML stripped before display
- Used for search (along with title)

**Search Behavior:**
- Only searches `title` and `description` fields
- Does NOT search organization name, topics, regions, or location
- Short terms (≤3 chars like "AI") use word boundary matching to prevent false positives
- Multi-word searches use **OR logic** (any word can match)
  - Example: "AI Cyber" returns events matching "AI" OR "Cyber"

---

## event_embeddings Collection

Stores AI embeddings for semantic search.

| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| event | Relation | → events, Single | Linked event |
| embedding | JSON | | OpenAI embedding vector |
| model | Plain Text | | Model used (text-embedding-3-small) |
| created | DateTime | | When embedding was created |

---

## Deleted Collections (v1.0 → v2.0 Migration)

These collections were consolidated into the `organizations` collection:
- ~~suggested_organizations~~ → Now: organizations with status "Pending Mission Review"
- ~~rejected_organizations~~ → Now: organizations with status "Mission Rejected"

## Deleted Fields (v1.0 → v2.0 Migration)

These fields were replaced by the `status` field:
- ~~mission_approved~~ (Bool)
- ~~terms_status~~ (Select)
- ~~permission_status~~ (Select)
- ~~permission_requested_by~~ (Select)
- ~~lawyer_verified~~ (Bool)
