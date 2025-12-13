✅ Recommended Fix Order – 2025-11-28
OrderCollectionActionRisk1contactsDelete → RebuildNone (0 records)2rejected_organizationsDelete → RebuildNone (0 records)3suggested_organizationsDelete → RebuildNone (0 records)4organizationsModify in placeLow (careful steps)5eventsModify in placeLow (minor changes)6event_embeddingsNo changesNone7usersNo changesNone



# PocketBase Database Audit

**Generated:** 2025-11-28
**Purpose:** Compare current database state to intended schema, identify issues, and plan fixes

---

## Summary of Issues Found

| Issue Type | Count |
|------------|-------|
| 🔴 Typos in field names | 2 |
| 🟠 Naming inconsistencies | 3 |
| 🟡 Field type mismatches | 2 |
| 🔵 Missing fields | 9 |
| ⚪ Potential structural improvements | 3 |

---

## Collection-by-Collection Audit

---

### 1. `users` (Built-in Auth Collection)

**Status:** ✅ No issues — PocketBase default

**Current Fields:** (PocketBase default auth fields)

**Action Required:** None

---

### 2. `contacts`

**Status:** ⚠️ Needs Review

**Current Fields:** Unknown (no records, no settings documented)

**Questions:**
- What is this collection for?
- Is it needed, or should POC data live elsewhere?
- Does it duplicate POC fields in other collections?

**Action Required:** Decide purpose or consider removing

---

### 3. `event_embeddings`

**Status:** ✅ Matches intended schema

**Current Fields:**
| Field | Type | Status |
|-------|------|--------|
| `event` | Relation | ✅ Correct |
| `embedding` | JSON | ✅ Correct |
| `model` | Plain Text | ✅ Correct |

**Action Required:** None

---

### 4. `events`

**Status:** ⚠️ Minor review needed

**Current Fields:**
| Field | Type | In Schema? | Status |
|-------|------|------------|--------|
| `title` | Plain Text | ✅ Yes | ✅ Correct |
| `description` | Rich Editor | ✅ Yes | ✅ Correct |
| `start_date` | DateTime | ✅ Yes | ✅ Correct |
| `end_date` | DateTime | ✅ Yes | ✅ Correct |
| `location` | Plain Text | ✅ Yes | ✅ Correct |
| `url` | URL | ✅ Yes | ✅ Correct |
| `organization` | Relation | ✅ Yes | ✅ Correct |
| `source_id` | Plain Text | ❓ Not in schema | Review if needed |
| `event_type` | Select | ✅ Yes | ✅ Correct |
| `registration_required` | Bool | ❓ Not in schema | Review if needed |
| `cost` | Plain Text | ✅ Yes | ✅ Correct |
| `target_audience` | Plain Text | ✅ Yes (as `audience`) | 🟠 Name differs from schema |
| `start_time` | Plain Text | ❓ Not in schema | Review if needed |
| `end_time` | Plain Text | ❓ Not in schema | Review if needed |
| `timezone` | Plain Text | ❓ Not in schema | Review if needed |

**Issues:**
1. 🟠 `target_audience` — schema says `audience`
2. ❓ Extra fields not in original schema: `source_id`, `registration_required`, `start_time`, `end_time`, `timezone`

**Action Required:** 
- Decide: Keep extra fields (they seem useful) or remove?
- Decide: Rename `target_audience` → `audience` for consistency?

---

### 5. `organizations`

**Status:** 🔴 Multiple issues

**Current Fields:**
| Field | Type | In Schema? | Status |
|-------|------|------------|--------|
| `name` | Plain Text | ✅ Yes | ✅ Correct |
| `website` | URL | ✅ Yes | ✅ Correct |
| `description` | Plain Text | ✅ Yes | ✅ Correct |
| `organization_type` | Select | ✅ Yes | 🟠 Schema says `org_type` in suggested_orgs |
| `mission_approved` | Bool | ❓ Not in schema | Review — may be useful |
| `permission_poc_name` | Plain Text | ✅ Yes (as `permission_contact`) | 🟠 Name differs |
| `permission_poc_email` | Email | ❓ Not in schema | Review — seems useful |
| `terms_status` | Select | ❓ Not in schema | Review purpose |
| `permission_status` | Select | ✅ Yes | ✅ Correct |
| `permission_request_date` | DateTime | ✅ Yes (as `permission_requested_date`) | 🟠 Name differs |
| `permission_response_date` | DateTime | ✅ Yes | ✅ Correct |
| `lawyer_verified` | Bool | ❓ Not in schema | Review — may relate to `permission_requested_by` |
| `scraper_acrtive` | Bool | ✅ Yes (as `scraping_enabled`) | 🔴 TYPO + name differs |
| `notes` | Rich Editor | ✅ Yes (as `permission_notes`) | 🟠 Name differs, type differs |

**Missing Fields (per schema):**
| Field | Type | Purpose |
|-------|------|---------|
| `events_url` | URL | Events page to scrape |
| `permission_requested_by` | Select | Admin or Lawyer |
| `permission_document` | File | Attachment (email screenshot, etc.) |
| `last_scraped` | DateTime | Last successful scrape |

**Issues:**
1. 🔴 **TYPO:** `scraper_acrtive` should be `scraper_active` or `scraping_enabled`
2. 🟠 `permission_poc_name` — schema says `permission_contact`
3. 🟠 `permission_request_date` — schema says `permission_requested_date`
4. 🟠 `notes` — schema says `permission_notes` (Plain Text, not Rich Editor)
5. 🟠 `organization_type` — `suggested_organizations` uses `org_type`
6. 🔵 Missing: `events_url`, `permission_requested_by`, `permission_document`, `last_scraped`

**Action Required:**
- Fix typo: `scraper_acrtive` → `scraping_enabled`
- Standardize field names across collections
- Add missing fields
- Decide on extra fields: keep or remove?

---

### 6. `rejected_organizations`

**Status:** 🔴 Significantly incomplete

**Current Fields:**
| Field | Type | In Schema? | Status |
|-------|------|------------|--------|
| `name` | Plain Text | ✅ Yes | ✅ Correct |
| `description` | Plain Text | ❓ Not in schema | Review if needed |

**Missing Fields (per schema):**
| Field | Type | Purpose |
|-------|------|---------|
| `website` | URL | Main website |
| `rejection_reason` | Select | Mission Mismatch, Permission Denied |
| `rejection_notes` | Plain Text | Details |
| `rejected_date` | DateTime | When rejected |

**Issues:**
1. 🔵 Missing 4 fields from schema
2. ❓ Has `description` which isn't in schema (may be useful to keep)

**Action Required:**
- Add missing fields: `website`, `rejection_reason`, `rejection_notes`, `rejected_date`
- Decide: Keep `description`?

---

### 7. `suggested_organizations`

**Status:** 🔴 Multiple issues

**Current Fields:**
| Field | Type | In Schema? | Status |
|-------|------|------------|--------|
| `name` | Plain Text | ✅ Yes | ✅ Correct |
| `website` | URL | ✅ Yes | ✅ Correct |
| `description` | Rich Editor | ✅ Yes | 🟡 Schema says Plain Text |
| `ai_reasoning` | Rich Editor | ✅ Yes | 🟡 Schema says Plain Text |
| `similarity_code` | Number | ✅ Yes (as `similarity_score`) | 🔴 TYPO: "code" vs "score" |
| `suggested_date` | DateTime | ✅ Yes | ✅ Correct |
| `org_type` | Plain Text | ✅ Yes | ✅ Correct |
| `poc_name` | Plain Text | ✅ Yes | ✅ Correct |
| `poc_email` | Email | ✅ Yes | ✅ Correct |
| `poc_title` | Plain Text | ✅ Yes | ✅ Correct |
| `tou_flag` | Bool | ✅ Yes | ✅ Correct |

**Missing Fields (per schema):**
| Field | Type | Purpose |
|-------|------|---------|
| `tou_notes` | Plain Text | Details about TOU concerns |
| `status` | Select | Pending, Mission Approved, Mission Rejected |

**Issues:**
1. 🔴 **TYPO:** `similarity_code` should be `similarity_score`
2. 🟡 `description` is Rich Editor — schema says Plain Text
3. 🟡 `ai_reasoning` is Rich Editor — schema says Plain Text
4. 🔵 Missing: `tou_notes`, `status`

**Action Required:**
- Fix typo: `similarity_code` → `similarity_score`
- Decide: Keep Rich Editor for description/ai_reasoning (more flexible) or change to Plain Text?
- Add missing fields: `tou_notes`, `status`

---

## Cross-Collection Naming Inconsistencies

| Concept | `suggested_organizations` | `organizations` | Recommendation |
|---------|---------------------------|-----------------|----------------|
| Org type | `org_type` | `organization_type` | Standardize to `org_type` (shorter) |
| POC name | `poc_name` | `permission_poc_name` | Keep both — different contexts |
| POC email | `poc_email` | `permission_poc_email` | Keep both — different contexts |
| Description | Rich Editor | Plain Text | Standardize to Rich Editor (more flexible) |

---

## Decision Points for You

Before we fix issues, please decide:

### 1. Field Type: Description fields
- **Option A:** Use Plain Text everywhere (simpler, schema-compliant)
- **Option B:** Use Rich Editor everywhere (more formatting flexibility)

### 2. Extra fields in `events`
- `source_id`, `registration_required`, `start_time`, `end_time`, `timezone`
- **Option A:** Keep them (they seem useful)
- **Option B:** Remove them (strict schema compliance)

### 3. Field naming: `audience` vs `target_audience`
- **Option A:** Rename to `audience` (matches schema)
- **Option B:** Keep `target_audience` (more descriptive)

### 4. Field naming: `org_type` vs `organization_type`
- **Option A:** Standardize to `org_type` (shorter)
- **Option B:** Standardize to `organization_type` (more explicit)

### 5. `contacts` collection
- **Option A:** Define its purpose and fields
- **Option B:** Remove it (POC data lives in other collections)

---

## Recommended Fix Order

1. **`suggested_organizations`** — Fix typo, add missing fields (we started here)
2. **`organizations`** — Fix typo, standardize names, add missing fields
3. **`rejected_organizations`** — Add missing fields
4. **`events`** — Standardize names (minor)
5. **`contacts`** — Decide purpose or remove
6. **`event_embeddings`** — No changes needed
7. **`users`** — No changes needed

---

## Appendix: Complete Field Settings Reference

### Plain Text (T)
- min length: (text box)
- max length: (text box)
- Regex pattern: (text box)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### Rich Editor (✏️)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)
- strip urls domain: (toggle on/off)

### Number (#)
- Min: (text box)
- Max: (text box)
- Nonzero: (toggle on/off)
- Presentable: (toggle on/off)
- No decimals: (toggle on/off)

### Bool (toggle)
- Nonfalsey: (toggle on/off)
- Presentable: (toggle on/off)

### Email (✉️)
- Except domains: (text box)
- Only domains: (text box)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### URL (🔗)
- Except domains: (text box)
- Only domains: (text box)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### DateTime (📅)
- min date (UTC): (text box)
- max date (UTC): (text box)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### Select (☰)
- Choices: (text box)
- Single/multiple: (picklist)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### File (🖼️)
- Single/multiple: (picklist)
- Allowed types: (picklist)
- Choose presets: (picklist)
- thumb sizes: (text box)
- Max file size: (text box)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)
- Protected: (toggle on/off)

### Relation (⤳)
- Select Collection: (picklist)
- Single/multiple: (picklist)
- Cascade delete: (picklist true/false)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

### JSON ({})
- Max size (bytes): (text box)
- String value normalizations: (picklist)
- Nonempty: (toggle on/off)
- Presentable: (toggle on/off)

