# Admin Interface v22 - Setup Guide

## 📋 Overview of Changes

Admin Interface v22 improves permission management workflow:

### New Features
1. ✅ **Contact Selector** - Choose which contact to email directly from the permission request screen
2. ✅ **TOU-Aware Draft Generation** - Drafts automatically reference the org's specific restriction language
3. ✅ **Correspondence Log** - Track multiple email exchanges (sent, received, notes)
4. ✅ **Smart Filters** - Filter by status + restriction combinations
5. ✅ **Conditional Go-Live Logic** - No deadline for orgs with restrictions; 7-day deadline for clean orgs
6. ✅ **Live Safety Check** - Warning when trying to set Live with unresolved restriction flags

────────────────────────────────────────

## 🎯 Design Principle

**Statuses = Workflow Position** (7 statuses, unchanged)
**Flags = Constraints** that modify behavior at each step

| Flag | Effect |
|------|--------|
| `tou_flag` | Permission REQUEST email (no deadline), no auto go-live |
| `tech_block_flag` | Same as above |
| `permission_denied_flag` | Warning if trying to go Live |
| No flags | Notice email (7-day deadline), implied permission OK |

────────────────────────────────────────

## ⚠️ REQUIRED: Add PocketBase Field

You must add **ONE** new field before using the Correspondence Log:

### Step-by-Step

1. **Open PocketBase Admin**
   - URL: `https://event-discovery-backend-production.up.railway.app/_/`
   - Log in with admin credentials (in Bitwarden)

2. **Navigate to Organizations Collection**
   - Click "Collections" in the left sidebar
   - Click on "organizations"

3. **Add New Field** - Click "+ New field" and configure:

| Setting | Value |
|---------|-------|
| Field Name | `correspondence_log` |
| Field Type | Plain Text |
| Min Length | *(leave blank)* |
| Max Length | `50000` |
| Regex Pattern | *(leave blank)* |
| Nonempty | ❌ Off |
| Presentable | ❌ Off |

4. **Save** - Click the checkmark icon

────────────────────────────────────────

## 📊 New Filter Options

The "Org By Status" tab now has smart filters:

| Filter | Shows |
|--------|-------|
| 🟣 Nominated - All | All nominated orgs |
| 🟣 Nominated - Clean | Nominated, NO restriction flags |
| 🟠 Nominated - Has Restrictions | Nominated WITH restriction flags |
| 🔵 Mission Approved - All | All mission approved orgs |
| 🔵 Mission Approved - Clean | Approved, NO restriction flags |
| 🟠 Mission Approved - Has Restrictions | Approved WITH restriction flags |
| 🟡 Permission Requested - All | All pending orgs |
| 🟡 Permission Requested - Clean | Pending, shows 7-day go-live date |
| 🟠 Permission Requested - Awaiting Explicit Reply | Pending WITH restrictions (no deadline) |
| 🟠 All With Restrictions | Any status with tou_flag OR tech_block_flag |

────────────────────────────────────────

## 📧 Email Generation Logic

| Org Has Restrictions? | Email Type | Deadline in Email | Go-Live Shown |
|----------------------|------------|-------------------|---------------|
| ❌ No (clean) | **Notice** | ✅ 7 days | ✅ Calculated date |
| ✅ Yes (flagged) | **Request** | ❌ None | ⚠️ "Explicit Permission Required" |

────────────────────────────────────────

## 🛡️ Live Safety Check

When changing status to "Live (Scraping Active)", the system checks for:
- `tou_flag`
- `tech_block_flag`  
- `permission_denied_flag`

If any are true, you'll see a warning confirmation before proceeding.

────────────────────────────────────────

## 📁 Deployment

### Files to Deploy

| File | Destination |
|------|-------------|
| `admin-interface-v22.html` | GitHub repo root |

### Steps

```powershell
cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL"
git add admin-interface-v22.html
git commit -m "Admin Interface v22: smart filters, correspondence log, TOU-aware drafts"
git push
```

Verify: `https://event-finder-ui-one.vercel.app/admin-interface-v22.html`

────────────────────────────────────────

## 🧪 Testing Checklist

- [ ] Login works
- [ ] Dashboard shows "🟠 Has Restrictions" count
- [ ] New filter options appear in Org By Status dropdown
- [ ] Filters correctly show clean vs restricted orgs
- [ ] Generate Draft creates correct email type based on flags
- [ ] Go-Live Date shows for clean orgs only
- [ ] "Explicit Permission Required" warning shows for flagged orgs
- [ ] Correspondence Log saves and displays entries
- [ ] Live safety warning appears when flags present

────────────────────────────────────────

## 📝 ConOp Updates Needed

### ADMIN INTERFACE section:
```
** Version History:
     *** v22 (2026-01-24): Permission management enhancements
          **** Added contact selector in Permission Request section
          **** Generate Draft now uses restriction_context for flagged orgs
          **** Added smart filters: status + restriction flag combinations
          **** Added Correspondence Log for tracking email exchanges
          **** New field: correspondence_log (JSON array)
          **** Go-live date only shown for orgs WITHOUT restriction flags
          **** Live safety check warns when flags present
          **** Dashboard shows "Has Restrictions" count across all statuses
```

### POCKETBASE COLLECTIONS section:
```
** Field Name: correspondence_log (added 2026-01-24)
** Field Type: Plain Text
** Setting - max length: 50000
** Setting - nonempty: off
** Setting - Presentable: off
** Field Purpose/Notes: JSON array storing correspondence entries. 
   Each entry: id, date, direction (sent/received/note), contactEmail, 
   contactName, subject, text, addedAt
```

────────────────────────────────────────

## 🎯 Quick Start

1. ✅ Add `correspondence_log` field to PocketBase
2. ✅ Deploy `admin-interface-v22.html`
3. ✅ Test filters and features
4. 📋 Update documentation
