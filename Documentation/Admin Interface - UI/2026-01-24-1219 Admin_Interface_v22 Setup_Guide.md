# Admin Interface v22 - Setup Guide

## 📋 Overview of Changes

Admin Interface v22 adds these new features for permission management:

1. ✅ **Contact Selector** - Choose which contact to email directly from the permission request screen
2. ✅ **TOU-Aware Draft Generation** - Drafts automatically reference the org's specific restriction language
3. ✅ **Correspondence Log** - Track multiple email exchanges (sent, received, notes)
4. ✅ **7-Day Go-Live Calculation** - Fixed timing (was incorrectly showing 14 days)

---

## ⚠️ REQUIRED: Add Database Field

Before using the Correspondence Log feature, you must add a new field to PocketBase:

### Step-by-Step Instructions

1. **Open PocketBase Admin**
   - Go to: `https://event-discovery-backend-production.up.railway.app/_/`
   - Log in with admin credentials (in Bitwarden)

2. **Navigate to Organizations Collection**
   - Click "Collections" in the left sidebar
   - Click on "organizations"

3. **Add New Field**
   - Click "+ New field" button
   - Configure the field as follows:

| Setting | Value |
|---------|-------|
| Field Name | `correspondence_log` |
| Field Type | Plain Text |
| Max Length | 50000 |
| Nonempty | ❌ (unchecked) |
| Presentable | ❌ (unchecked) |

4. **Save Changes**
   - Click the "Save" button (checkmark icon)

---

## 📁 Files to Deploy

Copy these files to your deployment:

| File | Destination | Notes |
|------|-------------|-------|
| `admin-interface-v22.html` | GitHub repo root | Replace v21 |
| `SOP_Permission_Request_Workflow.docx` | Share with users | Training document |

### Deployment Steps

1. **Update GitHub Repo**
```powershell
cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL"
git add admin-interface-v22.html
git commit -m "Admin Interface v22: contact selector, correspondence log, TOU-aware drafts"
git push
```

2. **Verify on Vercel**
   - Check: `https://event-finder-ui-one.vercel.app/admin-interface-v22.html`
   - Should auto-deploy in ~10 seconds

---

## 🧪 Testing Checklist

After deployment, verify these features work:

- [ ] Login works
- [ ] Contact selector loads contacts for an org
- [ ] Generate Draft button creates context-aware email
- [ ] Go-Live Date shows 7 days (not 14)
- [ ] Correspondence Log saves entries
- [ ] Correspondence Log displays timeline
- [ ] Delete entry works in timeline

---

## 📝 ConOp Updates Needed

Add to the ConOp document under ADMIN INTERFACE section:

```
** Version History:
     *** v22 (2026-01-24): Permission management enhancements
          **** Added contact selector in Permission Request section
          **** Generate Draft now uses restriction_context for TOU-flagged orgs
          **** Fixed go-live date calculation (7 days, not 14)
          **** Added Correspondence Log for tracking email exchanges
          **** New field: correspondence_log (JSON array in organizations collection)
```

Add to POCKETBASE COLLECTIONS section:

```
** Field Name: correspondence_log (added 2026-01-24)
** Field Type: Plain Text
** Setting - max length: 50000
** Setting - nonempty: off
** Setting - Presentable: off
** Field Purpose/Notes: JSON array storing correspondence entries. Each entry has: id, date, direction (sent/received/note), contactEmail, contactName, subject, text, addedAt
```

---

## 🎯 Quick Start for Users

1. Download the SOP document
2. Read through SOP-1 through SOP-5
3. Start with organizations in "Mission Approved (Request Not Sent)" status
4. Follow the step-by-step instructions

Questions? Contact your administrator.
