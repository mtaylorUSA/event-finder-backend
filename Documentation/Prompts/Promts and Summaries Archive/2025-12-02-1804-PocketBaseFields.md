# Event Finder - PocketBase Collections & Fields

**Last Updated:** 2025-11-30
**Version:** 2.0 (Streamlined)

## PocketBase Admin URL
`https://event-discovery-backend-production.up.railway.app/_/`

---

## What Changed in v2.0

| Change | Details |
|--------|---------|
| ➕ NEW: `settings` collection | Stores owner info for auto-generated emails |
| 🔄 UPDATED: `organizations` | Added `status`, `source_id`, permission draft fields |
| ❌ REMOVED: `suggested_organizations` | Merged into `organizations` |
| ❌ REMOVED: `rejected_organizations` | Merged into `organizations` |

---

## Collections Overview (v2.0)

| Collection | Purpose | Records |
|------------|---------|---------|
| `users` | User accounts (built-in) | 0 |
| `settings` | Owner info for emails | 1 |
| `contacts` | Contact persons for organizations | 0 |
| `events` | Scraped event data | 45 |
| `organizations` | **All orgs (all statuses)** | 19+ |
| `event_embeddings` | Vector embeddings for AI search | 40 |

### Removed Collections
- ~~`suggested_organizations`~~ → Merged into `organizations`
- ~~`rejected_organizations`~~ → Merged into `organizations`

---

## Collection: `settings` ⭐ NEW

*Stores owner information for auto-generated permission request emails*

| Field | Type | Settings |
|-------|------|----------|
| `setting_name` | Plain Text | max 100, Nonempty ✅, Presentable ✅ |
| `my_name` | Plain Text | max 200, Nonempty ✅ |
| `my_email` | Email | Nonempty ✅ |
| `my_mobile` | Plain Text | max 50 |

**Usage:** Create ONE record with `setting_name = owner_info`

**Example Record:**
```
setting_name: owner_info
my_name: John Smith
my_email: john.smith@example.com
my_mobile: 555-123-4567
```

---

## Collection: `organizations` ⭐ UPDATED

*Single source of truth for ALL organizations (pending, approved, rejected, active)*

### Core Fields (Existing)

| Field | Type | Settings |
|-------|------|----------|
| `name` | Plain Text | max 300, Nonempty ✅, Presentable ✅ |
| `website` | URL | Presentable ✅ |
| `description` | Plain Text | max 2000 |
| `org_type` | Plain Text | max 100, Presentable ✅ |
| `events_url` | URL | |
| `scraping_enabled` | Bool | Presentable ✅ |
| `last_scraped` | DateTime | Presentable ✅ |
| `notes` | Rich Editor | |

### New Fields (v2.0)

| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| `source_id` | Plain Text | max 100, Nonempty ✅ | **Unique ID** (website domain, e.g., `csis.org`) |
| `status` | Select | Single, Nonempty ✅, Presentable ✅ | **Lifecycle status** (see values below) |
| `discovered_date` | DateTime | | When AI found this org |
| `ai_reasoning` | Plain Text | max 2000 | Why AI suggested this org |
| `similarity_score` | Number | min 0, max 100 | AI confidence score |
| `tou_flag` | Bool | Presentable ✅ | TOU may prohibit scraping |
| `tou_notes` | Plain Text | max 2000 | TOU details/concerns |
| `permission_request_draft` | Plain Text | max 5000 | **Auto-generated email** (editable) |
| `permission_request_date` | DateTime | | When request was sent |
| `permission_response_date` | DateTime | | When response received |
| `permission_correspondence` | Plain Text | max 10000 | **Paste approval email here** |
| `permission_document` | File | Single, max 10485760 bytes | Uploaded approval document |

### Removed Fields (v2.0)

| Field | Reason |
|-------|--------|
| `mission_approved` | Replaced by `status` field |
| `terms_status` | Replaced by `tou_flag` and `tou_notes` |
| `permission_status` | Replaced by `status` field |
| `permission_requested_by` | Incorporated into `status` values |
| `lawyer_verified` | Incorporated into `status` values |

### Status Field Values

**Copy this exactly for the Select field choices:**
```
Pending Mission Review, Mission Approved Pending Permission, Mission Rejected, Permission Requested (Self), Permission Requested (Lawyer), Permission Granted, Permission Rejected, Scraping Active
```

| Status Value | Meaning |
|--------------|---------|
| `Pending Mission Review` | AI just discovered, awaiting admin review |
| `Mission Approved Pending Permission` | Fits mission, permission request auto-generated |
| `Mission Rejected` | Does not fit project mission |
| `Permission Requested (Self)` | Admin sent permission request |
| `Permission Requested (Lawyer)` | Lawyer sent permission request |
| `Permission Granted` | Organization approved scraping |
| `Permission Rejected` | Organization denied scraping |
| `Scraping Active` | Currently being scraped |

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
| `source_url` | URL | Where contact info was found |
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
| `topics` | Select | Multi-select (see values below) |
| `regions` | Select | Multi-select (see values below) |

---

## Collection: `event_embeddings`

*Vector embeddings for AI semantic search*

| Field | Type | Settings |
|-------|------|----------|
| `event` | Relation → `events` | |
| `embedding` | JSON | |
| `model` | Plain Text | |

---

## Select Field Values Reference

### `organizations.status`

```
Pending Mission Review, Mission Approved Pending Permission, Mission Rejected, Permission Requested (Self), Permission Requested (Lawyer), Permission Granted, Permission Rejected, Scraping Active
```

### `contacts.contact_type`

```
Leadership, Events, Legal/Permissions, Media/PR, Other
```

### `events.topics`

```
AI & Emerging Tech, Careers & Professional Development, Climate & Security, Counterterrorism, Cybersecurity, Defense Policy, Diplomacy & Statecraft, Economic Security, Homeland Security, Intelligence, Military Operations, Nuclear/WMD, Space & Satellites
```

### `events.regions`

```
Africa, Arctic, China, Domestic US, Europe/NATO, Global/Multilateral, Indo-Pacific, Latin America, Middle East, Russia
```

---

## Topics Tag Definitions

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

## Regions Tag Definitions

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

## PocketBase API Rules

### Public Access (List/View)
- `events` — Public ✅
- `organizations` — Public ✅

### Admin Only
- `settings` — Admin only
- `contacts` — Admin only
- `event_embeddings` — Admin only

---

## Migration Instructions (v1 → v2)

### Step 1: Create `settings` Collection

1. Click **"+ New collection"**
2. Name: `settings`
3. Type: Base Collection
4. Add fields:
   - `setting_name` (Plain Text, max 100, Nonempty, Presentable)
   - `my_name` (Plain Text, max 200, Nonempty)
   - `my_email` (Email, Nonempty)
   - `my_mobile` (Plain Text, max 50)
5. Click **Create**
6. Add one record with your info

### Step 2: Update `organizations` Collection

Add these NEW fields:

| Field | Type | Settings |
|-------|------|----------|
| `source_id` | Plain Text | max 100 |
| `status` | Select | Single, Presentable (see values above) |
| `discovered_date` | DateTime | |
| `ai_reasoning` | Plain Text | max 2000 |
| `similarity_score` | Number | min 0, max 100 |
| `tou_flag` | Bool | Presentable |
| `tou_notes` | Plain Text | max 2000 |
| `permission_request_draft` | Plain Text | max 5000 |
| `permission_correspondence` | Plain Text | max 10000 |

### Step 3: Migrate Existing Data

For your 19 existing organizations:
1. Set `source_id` = website domain (e.g., `csis.org`)
2. Set `status` = `Mission Approved Pending Permission` (or appropriate status)

For 8 suggested_organizations:
1. Create new records in `organizations`
2. Set `status` = `Pending Mission Review`
3. Copy all relevant fields

### Step 4: Delete Old Collections (After Verification)

⚠️ **Only after confirming data is migrated:**
1. Delete `suggested_organizations`
2. Delete `rejected_organizations`

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
| Choices | text box | **Items separated by commas** |
| Single/multiple | picklist | Allow one or many selections |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### File (picture icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Single/multiple | picklist | Allow one or many files |
| Max file size | text box | **Value in bytes** |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

**File Size Conversion:**

| Size | Bytes |
|------|-------|
| 1 MB | `1048576` |
| 5 MB | `5242880` |
| 10 MB | `10485760` |

### Relation (flow chart connector icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Select Collection | picklist | Target collection |
| Single/multiple | picklist | One or many relations |
| Cascade delete | picklist | Delete related records |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

### JSON ({} icon)

| Setting | Type | Notes |
|---------|------|-------|
| name | text box | Field name |
| Max size (bytes) | text box | Maximum JSON size |
| Nonempty | toggle on/off | Required field |
| Presentable | toggle on/off | Show in list view |

---

## How to Add a New Collection

1. Click **"+ New collection"**
2. Add name
3. Specify Type: Base Collection
4. Add fields
5. Click **Create**

---

## How to Add a New Field

1. Go to PocketBase Admin → Collections
2. Click the collection name
3. Click **"New field"**
4. Choose field type
5. Enter field name
6. Click **sprocket icon** for settings
7. Configure settings
8. Click **Save**

---

## How to Add a New Record

1. Click on the Collection
2. Click **"+ New record"**
3. Fill in field values
4. Click **Save**
