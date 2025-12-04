# Event Finder - Approval & Scraping Workflow

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORGANIZATION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ AI Suggests  │───▶│   Mission    │───▶│  Permission  │───▶│  Active   │ │
│  │ Organization │    │   Approval   │    │   Approval   │    │  Scraping │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └───────────┘ │
│         │                   │                   │                          │
│         ▼                   ▼                   ▼                          │
│   TOU checked &        Approved or         Permission                      │
│   flagged if issue     Rejected            Status Tracked                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Stage 1: AI Suggests Organizations

**What happens:**
- AI analyzes existing organizations and events in database
- AI suggests up to 20 similar national security/defense organizations
- For each suggestion, AI gathers **publicly available info only** (no event scraping):
  - Organization name, website, mission/description
  - Organization type
  - POC / contact info
  - TOU/User Agreement (to check for scraping prohibitions)

**⚠️ IMPORTANT:** No events are scraped at this stage. Event scraping only begins after permission is granted.

**TOU Check Result:**
- ⚠️ If TOU may prohibit scraping → **Flag it** (record in PocketBase, highlight in Admin UI)
- This is a **warning**, not an automatic rejection
- Admin still reviews and makes final decision

**Where stored:** `suggested_organizations` collection

---

## Stage 2: Mission Approval (Admin Review)

**What happens:**
- Admin reviews suggested organizations in Admin Interface
- Admin sees TOU flags highlighted for attention
- Admin determines if org fits the project mission
- Admin marks each org as approved or rejected

**How to do it:**
1. Open `admin-interface.html`
2. Login
3. Navigate to Discover/Add Orgs
4. Review (note any TOU flags) and Approve/Reject

**Outcome:**
- ✅ Approved → proceeds to Permission stage
- ❌ Rejected → moved to `rejected_organizations`

---

## Stage 3: Permission Approval (Legal/Compliance)

**Permission Status Color Codes:**

| Status | Color | Meaning |
|--------|-------|---------|
| 🟡 Not Yet Requested | Yellow | Admin hasn't contacted org yet |
| 🔵 Permission Pending | Blue | Request sent, awaiting response |
| 🟢 Permission Granted | Green | Org approved scraping |
| 🔴 Permission Rejected | Red | Org denied scraping |

**Who requests permission:**
- **Phase 1 (Personal Use):** Admin contacts org POCs directly
- **Later Phases (Commercial):** Lawyer contacts org POCs

**What happens:**
1. Admin/Lawyer contacts organization POCs
2. Request permission to scrape public event data
3. Track response in PocketBase/Admin Interface
4. Document any permission terms or conditions

**Outcome:**
- 🟢 Granted → Enable scraping for this org
- 🔴 Rejected → Add to `rejected_organizations`

---

## Stage 4: Active Scraping

**What happens (when enabled):**
- Daily automated scraping via GitHub Actions (8 AM EST)
- `scrape-all-organizations.js` processes all approved orgs
- 2-second delay between orgs (polite scraping)
- Events saved to `events` collection
- Automatic deduplication
- Embeddings generated for semantic search

**Current Status:** ⛔ ALL SCRAPING DISABLED (awaiting permissions)

---

## Rejection Paths Summary

| Rejection Reason | When It Happens | Action |
|------------------|-----------------|--------|
| TOU Prohibits Scraping | AI check (Stage 1) | ⚠️ Flag only — Admin decides |
| Mission Mismatch | Admin review (Stage 2) | ❌ Move to `rejected_organizations` |
| Permission Denied | After request (Stage 3) | ❌ Move to `rejected_organizations` |

---

## Quick Reference: Where Things Happen

| Action | Location |
|--------|----------|
| Review suggested orgs | Admin Interface |
| See TOU flags | Admin Interface (highlighted) |
| Mission approve/reject | Admin Interface → PocketBase |
| Track permission status | Admin Interface → PocketBase |
| Send permission requests | Manual email |
| Enable/disable scrapers | GitHub Actions settings |
| View scraped events | PocketBase dashboard |
