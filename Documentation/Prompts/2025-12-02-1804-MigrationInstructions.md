# Event Finder - Database Migration Guide (v1 → v2)

**Date:** 2025-11-30
**Purpose:** Step-by-step instructions to update PocketBase schema

---

## Overview

This migration:
1. Creates new `settings` collection
2. Updates `organizations` collection with new fields
3. Migrates data from `suggested_organizations` 
4. Removes obsolete collections

**Estimated Time:** 30-45 minutes

---

## Pre-Migration Checklist

- [ ] Backup your PocketBase data (Railway has automatic backups)
- [ ] Have PocketBase Admin open: `https://event-discovery-backend-production.up.railway.app/_/`
- [ ] Have this document open for reference

---

## Step 1: Create `settings` Collection

### 1.1 Create the Collection

1. 🌐 **Platform:** Browser
2. 📄 **Go to:** PocketBase Admin
3. 🔘 **Click:** "+ New collection" button
4. 📝 **Enter name:** `settings`
5. 🔘 **Select Type:** Base Collection
6. 🔘 **Click:** "New field" to add fields

### 1.2 Add Fields

**Field 1: setting_name**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `setting_name`
4. Click sprocket ⚙️ for settings:
   - max length: `100`
   - Toggle ON: Nonempty
   - Toggle ON: Presentable
5. Click outside to close

**Field 2: my_name**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `my_name`
4. Click sprocket ⚙️:
   - max length: `200`
   - Toggle ON: Nonempty
5. Click outside to close

**Field 3: my_email**
1. Click "New field"
2. Choose: Email (envelope icon)
3. Name: `my_email`
4. Click sprocket ⚙️:
   - Toggle ON: Nonempty
5. Click outside to close

**Field 4: my_mobile**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `my_mobile`
4. Click sprocket ⚙️:
   - max length: `50`
5. Click outside to close

### 1.3 Save the Collection

1. 🔘 **Click:** "Create" button

**✅ You should see:** `settings` collection in the left sidebar

### 1.4 Add Your Info Record

1. 🔘 **Click:** `settings` collection
2. 🔘 **Click:** "+ New record"
3. 📝 **Fill in:**
   - `setting_name`: `owner_info`
   - `my_name`: *Your full name*
   - `my_email`: *Your email address*
   - `my_mobile`: *Your phone number*
4. 🔘 **Click:** "Save"

**✅ You should see:** 1 record in the settings collection

---

## Step 2: Update `organizations` Collection

### 2.1 Open Organizations Collection

1. 🔘 **Click:** `organizations` in the left sidebar
2. 🔘 **Click:** The collection name header (or gear icon) to edit schema

### 2.2 Add New Fields

**Field 1: source_id** (Unique identifier - website domain)
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `source_id`
4. Click sprocket ⚙️:
   - max length: `100`
5. Click outside to close

**Field 2: status** ⭐ IMPORTANT
1. Click "New field"
2. Choose: Select (bullet list icon)
3. Name: `status`
4. Click sprocket ⚙️:
   - In "Choices" box, paste this EXACTLY:
   ```
   Pending Mission Review, Mission Approved Pending Permission, Mission Rejected, Permission Requested (Self), Permission Requested (Lawyer), Permission Granted, Permission Rejected, Scraping Active
   ```
   - Select: Single
   - Toggle ON: Presentable
5. Click outside to close

**Field 3: discovered_date**
1. Click "New field"
2. Choose: DateTime (calendar icon)
3. Name: `discovered_date`
4. Click outside to close

**Field 4: ai_reasoning**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `ai_reasoning`
4. Click sprocket ⚙️:
   - max length: `2000`
5. Click outside to close

**Field 5: similarity_score**
1. Click "New field"
2. Choose: Number (# icon)
3. Name: `similarity_score`
4. Click sprocket ⚙️:
   - Min: `0`
   - Max: `100`
5. Click outside to close

**Field 6: tou_flag**
1. Click "New field"
2. Choose: Bool (toggle icon)
3. Name: `tou_flag`
4. Click sprocket ⚙️:
   - Toggle ON: Presentable
5. Click outside to close

**Field 7: tou_notes**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `tou_notes`
4. Click sprocket ⚙️:
   - max length: `2000`
5. Click outside to close

**Field 8: permission_request_draft**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `permission_request_draft`
4. Click sprocket ⚙️:
   - max length: `5000`
5. Click outside to close

**Field 9: permission_correspondence**
1. Click "New field"
2. Choose: Plain Text (T icon)
3. Name: `permission_correspondence`
4. Click sprocket ⚙️:
   - max length: `10000`
5. Click outside to close

### 2.3 Save the Collection

1. 🔘 **Click:** "Save" button

**✅ You should see:** Updated organizations collection with new fields

---

## Step 3: Update Existing Organization Records

### 3.1 Update Each of Your 19 Organizations

For each organization:

1. 🔘 **Click:** on the organization record to edit
2. 📝 **Set `source_id`:** Extract domain from website
   - Example: If website is `https://www.csis.org/events`, set `source_id` = `csis.org`
3. 📝 **Set `status`:** Choose appropriate value:
   - If you haven't contacted them yet: `Mission Approved Pending Permission`
   - If you've sent a request: `Permission Requested (Self)`
   - If they approved: `Permission Granted`
4. 🔘 **Click:** "Save"

### 3.2 Quick Reference: Domain Extraction

| Organization | source_id |
|--------------|-----------|
| American Enterprise Institute (AEI) | `aei.org` |
| Atlantic Council | `atlanticcouncil.org` |
| Center for Strategic and International Studies (CSIS) | `csis.org` |
| Chatham House | `chathamhouse.org` |
| Council on Foreign Relations | `cfr.org` |
| Cyber Threat Alliance (CTA) | `cyberthreatalliance.org` |
| CISA | `cisa.gov` |
| INSA | `insaonline.org` |
| New America | `newamerica.org` |
| Potomac Officers Club | `potomacofficersclub.com` |
| Belfer Center | `belfercenter.org` |
| Brookings Institution | `brookings.edu` |
| CNAS | `cnas.org` |
| Hoover Institution | `hoover.org` |
| INSS | `inss.org.il` |
| IISS | `iiss.org` |
| RAND Corporation | `rand.org` |
| Stimson Center | `stimson.org` |

---

## Step 4: Migrate Suggested Organizations (If Any)

### 4.1 Check for Pending Suggestions

1. 🔘 **Click:** `suggested_organizations` in sidebar
2. 📝 **Note:** How many records exist

### 4.2 For Each Suggested Organization

1. **Open** the suggested_organizations record
2. **Create** a new record in `organizations`:
   - Copy `name`, `website`, `description`, `org_type`
   - Set `source_id` = domain from website
   - Set `status` = `Pending Mission Review`
   - Copy `tou_flag`, `tou_notes` if they exist
   - Copy `ai_reasoning`, `similarity_score` if they exist
   - Set `discovered_date` = current date
3. **Create** a contact record in `contacts` (if POC info exists):
   - Copy POC info from suggested org
   - Link to the new organization record

---

## Step 5: Remove Obsolete Fields (Optional)

After migration is complete and verified, you can remove these old fields from `organizations`:

| Field to Remove | Reason |
|-----------------|--------|
| `mission_approved` | Replaced by `status` |
| `terms_status` | Replaced by `tou_flag` + `tou_notes` |
| `permission_status` | Replaced by `status` |
| `permission_requested_by` | Now part of `status` value |
| `lawyer_verified` | Now part of `status` value |

**⚠️ Only remove fields after confirming data is correctly migrated!**

---

## Step 6: Delete Old Collections (Optional)

**⚠️ Only do this after confirming all data is migrated!**

1. 🔘 **Click:** `suggested_organizations`
2. 🔘 **Click:** Settings/gear icon
3. 🔘 **Click:** "Delete collection"
4. ⚠️ **Confirm** deletion

Repeat for `rejected_organizations`

---

## Post-Migration Verification

### Checklist

- [ ] `settings` collection exists with 1 record containing your info
- [ ] `organizations` collection has new fields: `source_id`, `status`, etc.
- [ ] All 19 organizations have `source_id` set
- [ ] All 19 organizations have `status` set
- [ ] Any suggested organizations have been migrated
- [ ] `contacts` collection has POC records linked to organizations

### Test the API

Open in browser:
```
https://event-discovery-backend-production.up.railway.app/api/collections/organizations/records
```

**✅ You should see:** Organizations with new `source_id` and `status` fields

---

## Rollback Plan

If something goes wrong:
1. Railway has automatic backups
2. Contact Railway support to restore from backup
3. Or manually recreate deleted collections if needed

---

## Next Steps After Migration

1. ✅ Run migration script to add POC contacts (coming next)
2. ✅ Test permission request generation
3. ✅ Begin sending permission requests to Tier 1 organizations

---

## Need Help?

If you get stuck on any step:
1. Take a screenshot
2. Note which step you're on
3. Share with me and I'll help troubleshoot
