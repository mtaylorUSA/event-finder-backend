# Event Finder - PocketBase Collections & Fields

**Last Updated:** 2025-12-01

## PocketBase Admin URL
`https://event-discovery-backend-production.up.railway.app/_/`

---

## Collections Overview

| Collection | Purpose | Records |
|------------|---------|---------|
| `users` | User accounts (built-in) | 0 |
| `contacts` | Contact persons for organizations | 0 |
| `events` | Scraped event data | 45 |
| `organizations` | Approved event sources with permission tracking | 19 |
| `suggested_organizations` | AI-nominated orgs awaiting review | 8 |
| `rejected_organizations` | Orgs excluded from scraping | 0 |
| `event_embeddings` | Vector embeddings for AI search | 40 |

---

## Collection: `contacts`

*Stores contact persons for organizations — supports multiple contacts per org*

| Field | Type | Settings |
|-------|------|----------|
| `name` | Plain Text | max 200, Nonempty ✅, Presentable ✅ |
| `email` | Email | Presentable ✅ |
| `title` | Plain Text | max 200 |
| `phone` | Plain Text | max 50 |
| `organization` | Relation → `organizations` | Single, Presentable ✅ |
| `contact_type` | Select | Choices: `Leadership, Events, Legal/Permissions, Media/PR, Other`, Single, Presentable ✅ |
| `source_url` | URL | |
| `last_verified` | DateTime | |
| `notes` | Plain Text | max 2000 |

---

## Collection: `events`

*Scraped event data from approved organizations*

| Field | Type | Settings |
|-------|------|----------|
| `title` | Plain Text | |
| `description` | Rich Editor | |
| `start_date` | DateTime | |
| `end_date` | DateTime | |
| `location` | Plain Text | |
| `url` | URL | |
| `organization` | Relation → `organizations` | |
| `source_id` | Plain Text | max 500, Nonempty ✅ (for deduplication) |
| `event_type` | Select | Choices: `Virtual, In-person, Hybrid` |
| `registration_required` | Bool | |
| `cost` | Plain Text | |
| `target_audience` | Plain Text | |
| `start_time` | Plain Text | |
| `end_time` | Plain Text | |
| `timezone` | Plain Text | |
| `topics` | Select | Multi-select, Choices: `AI & Emerging Tech, Careers & Professional Development, Climate & Security, Counterterrorism, Cybersecurity, Defense Policy, Diplomacy & Statecraft, Economic Security, Homeland Security, Intelligence, Military Operations, Nuclear/WMD, Space & Satellites` |
| `regions` | Select | Multi-select, Choices: `Africa, Arctic, China, Domestic US, Europe/NATO, Global/Multilateral, Indo-Pacific, Latin America, Middle East, Russia` |

---

## Collection: `suggested_organizations`

*AI gathers publicly available info only — no event scraping at this stage*

| Field | Type | Settings |
|-------|------|----------|
| `name` | Plain Text | max 300, Nonempty ✅, Presentable ✅ |
| `website` | URL | Presentable ✅ |
| `description` | Plain Text | max 2000 |
| `org_type` | Plain Text | max 100, Presentable ✅ |
| `poc_name` | Plain Text | max 200 |
| `poc_email` | Email | |
| `poc_title` | Plain Text | max 200 |
| `ai_reasoning` | Plain Text | max 2000 |
| `similarity_score` | Number | min 0, max 100, Presentable ✅ |
| `suggested_date` | DateTime | Nonempty ✅, Presentable ✅ |
| `tou_flag` | Bool | Presentable ✅ |
| `tou_notes` | Plain Text | max 2000 |
| `status` | Select | Choices: `Pending, Mission Approved, Mission Rejected`, Single, Presentable ✅ |

---

## Collection: `organizations`

*Orgs move here after Mission Approval*

| Field | Type | Settings |
|-------|------|----------|
| `name` | Plain Text | Presentable ✅ |
| `website` | URL | Presentable ✅ |
| `description` | Plain Text | |
| `org_type` | Plain Text | max 100, Presentable ✅ |
| `mission_approved` | Bool | |
| `events_url` | URL | |
| `terms_status` | Select | Choices: `Not Indicated, Scraping OK, Scraping Prohibited` |
| `permission_status` | Select | Choices: `Not Yet Requested (Self), Not Yet Requested (Lawyer), Permission Pending (Requested by Self), Permission Pending (Requested by Lawyer), Permission Granted (Requested by Self), Permission Granted (Requested by Lawyer), Permission Rejected (Requested by Self), Permission Rejected (Requested by Lawyer)` |
| `permission_requested_date` | DateTime | |
| `permission_requested_by` | Select | Choices: `Admin, Lawyer`, Single |
| `permission_response_date` | DateTime | |
| `permission_document` | File | Single, max 10485760 bytes (10 MB) |
| `lawyer_verified` | Bool | |
| `scraping_enabled` | Bool | Presentable ✅ |
| `last_scraped` | DateTime | Presentable ✅ |
| `notes` | Rich Editor | |

---

## Collection: `rejected_organizations`

*Organizations excluded from scraping*

| Field | Type | Settings |
|-------|------|----------|
| `name` | Plain Text | max 300, Nonempty ✅, Presentable ✅ |
| `website` | URL | Presentable ✅ |
| `rejection_reason` | Select | Choices: `Mission Mismatch, Permission Denied, TOU Prohibits, Duplicate, Other`, Single, Nonempty ✅, Presentable ✅ |
| `rejection_notes` | Plain Text | max 2000 |
| `rejected_date` | DateTime | Nonempty ✅, Presentable ✅ |

---

## Collection: `event_embeddings`

*Vector embeddings for AI semantic search*

| Field | Type | Settings |
|-------|------|----------|
| `event` | Relation → `events` | |
| `embedding` | JSON | |
| `model` | Plain Text | |

---

## Topics Tag Values (for `events.topics`)

| Tag | Includes |
|-----|----------|
| AI & Emerging Tech | artificial intelligence, drones, autonomous systems, quantum |
| Careers & Professional Development | training, networking, job skills, leadership |
| Climate & Security | climate change, energy security, environmental threats |
| Counterterrorism | terrorism, extremism, radicalization, CVE |
| Cybersecurity | hacking, data breaches, network security, cyber warfare |
| Defense Policy | military strategy, defense budget, procurement, alliances |
| Diplomacy & Statecraft | foreign policy, treaties, international relations |
| Economic Security | sanctions, trade, supply chains, economic statecraft |
| Homeland Security | border security, emergency management, critical infrastructure |
| Intelligence | espionage, SIGINT, GEOINT, HUMINT, Intelligence Community, surveillance, reconnaissance |
| Military Operations | warfighting, exercises, deployments, readiness |
| Nuclear/WMD | nuclear weapons, nonproliferation, arms control, CBRN |
| Space & Satellites | space force, satellites, space security, GPS |

---

## Regions Tag Values (for `events.regions`)

| Tag | Includes |
|-----|----------|
| Africa | Sub-Saharan, North Africa, Sahel, Horn of Africa |
| Arctic | Arctic security, polar regions, Northern Sea Route |
| China | Taiwan, Hong Kong, South China Sea, Taiwan Strait, PRC, CCP |
| Domestic US | US internal policy, Congress, federal agencies |
| Europe/NATO | EU, NATO allies, UK, France, Germany, transatlantic |
| Global/Multilateral | UN, international orgs, global governance, treaties |
| Indo-Pacific | Japan, Korea, ASEAN, Australia, Pacific Islands, India |
| Latin America | Central America, South America, Caribbean, Mexico |
| Middle East | Iran, Israel, Gaza, Palestine, Qatar, UAE, Yemen, Saudi Arabia, Gulf States, Syria, Iraq, Persian Gulf |
| Russia | Ukraine, Baltics, Eastern Europe, Kremlin, Putin |

---

## PocketBase API Rules (Current Settings)

### Public Access (List/View)
- `events` — Public ✅
- `organizations` — Public ✅

### Admin Only
- `contacts` — Admin only
- `suggested_organizations` — Admin only
- `rejected_organizations` — Admin only
- `event_embeddings` — Admin only

---

## PocketBase Field Types Reference

### Plain Text (T icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| min length | text box | Optional minimum |
| max length | text box | Optional maximum |
| Regex pattern | text box | Optional validation |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### Rich Editor (pencil icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |
| strip urls domain | toggle on/off | Remove domain from URLs |

### Number (# icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Min | text box | Minimum value |
| Max | text box | Maximum value |
| Nonzero | toggle on/off | Cannot be zero |
| Presentable | toggle on/off | Show in list view |
| No decimals | toggle on/off | Integers only |

### Bool (toggle icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Nonfalsey | toggle on/off | Must be true |
| Presentable | toggle on/off | Show in list view |

### Email (envelope icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Except domains | text box | Block specific domains |
| Only domains | text box | Allow only specific domains |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### URL (chain link icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Except domains | text box | Block specific domains |
| Only domains | text box | Allow only specific domains |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### DateTime (calendar icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| min date (UTC) | text box | Earliest allowed date |
| max date (UTC) | text box | Latest allowed date |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### Select (bullet list icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Choices | text box | **Items must be entered in a single line, separated by commas** (e.g., `Option A, Option B, Option C`) |
| Single/multiple | picklist | Allow one or many selections |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### File (picture icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Single/multiple | picklist | Allow one or many files |
| Allowed types | picklist | Restrict file types |
| Choose presets | picklist | Common type presets |
| thumb sizes | text box | Thumbnail dimensions |
| Max file size | text box | **Value must be in bytes** (see conversion table below) |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |
| Protected | toggle on/off | Require auth to access |

**File Size Conversion Table:**

| Size | Bytes |
|------|-------|
| 1 MB | `1048576` |
| 5 MB | `5242880` |
| 10 MB | `10485760` |
| 25 MB | `26214400` |
| 50 MB | `52428800` |

### Relation (flow chart connector icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Select Collection | picklist | Target collection |
| Single/multiple | picklist | One or many relations |
| Cascade delete | picklist true/false | Delete related records |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### JSON ({} icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Max size (bytes) | text box | Maximum JSON size |
| String value normalizations | picklist | Normalization options |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

---

## How to Add a New Collection to PocketBase

1. Click **"+ New collection"** button
2. Add name
3. Specify Type:
   - Base Collection
   - View Collection
   - Auth Collection
4. Use the **"Fields"** tab (not the "API Rules" tab)
5. Add at least one field (required to save)
6. Click the **"Create"** button

---

## How to Add a New Field in PocketBase

1. Go to PocketBase Admin → Collections
2. Click the collection name
3. Click **"New field"**
4. Choose field type (icons above)
5. Enter field name
6. Click **sprocket icon** for settings
7. Configure settings as needed
8. Click **"Save"**

---

## How to Add a New Record to a Collection

1. Click on the named Collection
2. Click **"+ New record"** button
3. Fill in field values
4. Click **"Save"**

---

## How to Review APIs

1. Click on the named Collection
2. Click **"</> API Preview"** button
