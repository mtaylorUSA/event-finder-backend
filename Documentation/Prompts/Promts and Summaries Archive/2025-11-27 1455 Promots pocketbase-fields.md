# Event Finder - PocketBase Collections & Fields

## PocketBase Admin URL
`https://event-discovery-backend-production.up.railway.app/_/`

---

## Collections Overview

| Collection | Purpose |
|------------|---------|
| `users` | User accounts (built-in) |
| `events` | Scraped event data |
| `organizations` | Approved event sources with permission tracking |
| `suggested_organizations` | AI-nominated orgs awaiting review |
| `rejected_organizations` | Orgs excluded from scraping |
| `event_embeddings` | Vector embeddings for AI search |

---

## Collection: `events`

| Field | Type | Description |
|-------|------|-------------|
| `title` | Plain Text | Event name |
| `description` | Rich Editor | Event details |
| `start_date` | DateTime | Event start |
| `end_date` | DateTime | Event end |
| `location` | Plain Text | Venue or "Virtual" |
| `url` | URL | Link to event page |
| `organization` | Relation | Link to `organizations` |
| `event_type` | Select | Conference, Webinar, etc. |
| `cost` | Plain Text | Free, $X, etc. |
| `audience` | Plain Text | Target audience |

---

## Collection: `suggested_organizations`

*AI gathers publicly available info only — no event scraping at this stage*

| Field | Type | Description |
|-------|------|-------------|
| `name` | Plain Text | Organization name |
| `website` | URL | Main website |
| `description` | Plain Text | Mission / what they do |
| `org_type` | Plain Text | Think tank, nonprofit, government, etc. |
| `poc_name` | Plain Text | Point of contact name |
| `poc_email` | Email | Point of contact email |
| `poc_title` | Plain Text | Point of contact title |
| `ai_reasoning` | Plain Text | Why AI suggested this org |
| `similarity_score` | Number | AI confidence score |
| `suggested_date` | DateTime | When AI suggested |
| `tou_flag` | Bool | ⚠️ True if TOU may prohibit scraping |
| `tou_notes` | Plain Text | Details about TOU concerns |
| `status` | Select | Pending, Mission Approved, Mission Rejected |

---

## Collection: `organizations`

*Orgs move here after Mission Approval*

| Field | Type | Description |
|-------|------|-------------|
| `name` | Plain Text | Organization name |
| `website` | URL | Main website |
| `description` | Plain Text | What they do |
| `events_url` | URL | Events page to scrape |
| `permission_status` | Select | 🟡 Not Requested, 🔵 Pending, 🟢 Granted, 🔴 Rejected |
| `permission_requested_by` | Select | Admin, Lawyer |
| `permission_requested_date` | DateTime | When request was sent |
| `permission_response_date` | DateTime | When response received |
| `permission_contact` | Plain Text | Who granted/denied (name, title) |
| `permission_notes` | Plain Text | Terms, conditions, details |
| `permission_document` | File | Attachment (email screenshot, etc.) |
| `scraping_enabled` | Bool | Currently being scraped |
| `last_scraped` | DateTime | Last successful scrape |

---

## Collection: `rejected_organizations`

| Field | Type | Description |
|-------|------|-------------|
| `name` | Plain Text | Organization name |
| `website` | URL | Main website |
| `rejection_reason` | Select | Mission Mismatch, Permission Denied |
| `rejection_notes` | Plain Text | Details |
| `rejected_date` | DateTime | When rejected |

---

## Collection: `event_embeddings`

| Field | Type | Description |
|-------|------|-------------|
| `event` | Relation | Link to `events` |
| `embedding` | JSON | Vector array from OpenAI |
| `model` | Plain Text | Embedding model used |

---

## PocketBase Field Types Reference

| Icon | Type | Common Settings |
|------|------|-----------------|
| **T** | Plain Text | min/max length, regex, nonempty |
| ✏️ | Rich Editor | max length |
| **#** | Number | min/max, nonempty |
| 🔘 | Bool | — |
| ✉️ | Email | nonempty |
| 🔗 | URL | nonempty |
| 📅 | DateTime | min/max date, nonempty |
| ☰ | Select | options list, single/multiple |
| 🖼️ | File | max size, allowed types |
| ⤳ | Relation | collection, single/multiple, cascade delete |
| `{}` | JSON | max size |

---

## How to Add a New Field in PocketBase

1. Go to PocketBase Admin → Collections
2. Click the collection name
3. Click **"New field"**
4. Choose field type (icons above)
5. Enter field name
6. Click **sprocket icon** ⚙️ for settings:
   - Min/max values
   - Nonempty (required)
   - Presentable (show in list view)
7. Click **Save**
