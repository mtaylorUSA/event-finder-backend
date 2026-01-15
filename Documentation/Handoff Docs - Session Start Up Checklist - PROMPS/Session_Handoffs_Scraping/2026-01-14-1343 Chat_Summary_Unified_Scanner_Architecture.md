# Chat Summary: Unified Scanner Architecture
**Date:** 2026-01-14  
**Session Focus:** Fixing events_url discovery gap + creating unified scanning system

---

## 🎯 Problem Identified

**CNAS had the wrong `events_url`** - the system was using the homepage instead of the actual events listing page.

### Root Cause Analysis

| Issue | Impact |
|-------|--------|
| No automated `events_url` finder exists | Manual orgs get wrong URLs |
| `discover-orgs-by-events.js` saves `triggering_event_url` but NOT `events_url` | Data is there but not extracted |
| Scanning logic duplicated across multiple files | Bugs must be fixed in multiple places |

### The Data Gap

```
triggering_event_url: https://cnas.org/events/2026-defense-summit  ✅ SAVED
events_url:           https://cnas.org/events                       ❌ NOT EXTRACTED
```

**The path to events listing was RIGHT THERE in the triggering URL - just never extracted!**

---

## 🏗️ New Architecture Decision

### Before (Fragmented)
```
discover-orgs-by-events.js ─┬─► Has its own scanning code (Phase B)
                            │
tou-scanner.js ─────────────┼─► Has its own TOU scanning code
                            │
suggest-organizations.js ───┴─► Has NO scanning (gap!)
                            
base-scraper.js ────────────► Has TOU check (only during scrape)
```

### After (Unified)
```
scanners/
├── org-scanner.js          ← NEW: Central scanning module (all logic lives here)
│   ├── scanOrganization()      - Master function
│   ├── findEventsUrl()         - NEW: Extract from triggering URL or discover
│   ├── scanTOU()               - Consolidated from tou-scanner.js
│   ├── checkTechBlock()        - Consolidated from base-scraper.js
│   ├── gatherPOC()             - Consolidated from discover-orgs-by-events.js
│   └── analyzeWithAI()         - Consolidated from discover-orgs-by-events.js
│
├── base-scraper.js         ← UPDATE: Import from org-scanner.js
└── index.js                ← UPDATE: Import from org-scanner.js

scan-organization.js        ← NEW: CLI wrapper
                               └── Calls org-scanner.scanOrganization()

discover-orgs-by-events.js  ← UPDATE: Call org-scanner.scanOrganization() in Phase B
suggest-organizations.js    ← UPDATE: Call org-scanner.scanOrganization() after discovery
```

---

## ✅ File Created This Session

### `scanners/org-scanner.js` (Central Module)

**Location:** `/home/claude/scanners/org-scanner.js`  
**Size:** ~1,100 lines  
**Status:** ✅ CREATED

#### Features Implemented

| Feature | Function | Status |
|---------|----------|--------|
| **Events URL Discovery** | `findEventsUrl()` | ✅ NEW |
| Extract from triggering URL | `extractEventsUrlFromTriggeringUrl()` | ✅ NEW |
| Validate events page | `validateEventsUrl()` | ✅ NEW |
| TOU Scanning | `scanTOU()` | ✅ Consolidated |
| Tech Block Detection | Via `fetchUrl()` | ✅ Consolidated |
| POC Gathering | `gatherPOC()` | ✅ Consolidated |
| AI Analysis | `analyzeWithAI()` | ✅ Consolidated |
| Database Operations | `getOrganization()`, `updateOrganization()` | ✅ NEW |

#### Events URL Discovery Strategies

The new `findEventsUrl()` function uses three strategies:

1. **Strategy 1: Extract from `triggering_event_url`**
   ```
   Input:  https://cnas.org/events/2026-defense-summit
   Output: https://cnas.org/events
   ```

2. **Strategy 2: Search homepage for events links**
   - Looks for `<a>` tags with events-related text or URLs
   - Keywords: events, calendar, upcoming, programs, conferences

3. **Strategy 3: Try common paths**
   - `/events`, `/calendar`, `/upcoming-events`, `/programs`, etc.

Each candidate is **validated** by checking for events page indicators (dates, registration links, etc.)

#### Exported Functions

```javascript
module.exports = {
    // Main scan function
    scanOrganization,
    
    // Individual components
    scanTOU,
    findEventsUrl,
    extractEventsUrlFromTriggeringUrl,
    validateEventsUrl,
    gatherPOC,
    analyzeWithAI,
    
    // Database operations
    getOrganization,
    getOrganizationByName,
    updateOrganization,
    
    // Utilities
    fetchUrl,
    extractText,
    sleep,
    
    // Constants
    TOU_RESTRICTION_KEYWORDS,
    EVENTS_PATHS,
    EVENTS_PAGE_INDICATORS
};
```

#### Usage Example

```javascript
const scanner = require('./scanners/org-scanner');

// Scan and update database
const result = await scanner.scanOrganization(org, { updateDb: true });

// Just scan (no DB update)
const result = await scanner.scanOrganization(org);

// Individual functions
const eventsResult = await scanner.findEventsUrl(org, homepageHtml);
const touResult = await scanner.scanTOU(website, html);
```

---

## 📋 Remaining Deliverables

| # | File | Action | Purpose | Status |
|---|------|--------|---------|--------|
| 1 | `scanners/org-scanner.js` | CREATE | Central scanning module | ✅ DONE |
| 2 | `scan-organization.js` | CREATE | CLI wrapper for standalone use | ⏳ NEXT |
| 3 | `discover-orgs-by-events.js` | UPDATE | Replace Phase B with call to org-scanner | ⏳ PENDING |
| 4 | `suggest-organizations.js` | UPDATE | Add scanning after profile-based discovery | ⏳ PENDING |
| 5 | `base-scraper.js` | UPDATE | Import TOU functions from org-scanner | ⏳ PENDING |
| 6 | `admin-interface-v14.html` | UPDATE | Add "🔍 Scan Org" button | ⏳ PENDING |

---

## 🔑 Key Design Decisions

### 1. Events URL Extraction Logic
```javascript
function extractEventsUrlFromTriggeringUrl(triggeringUrl) {
    // Find path segment containing: events, calendar, programs, etc.
    // Return URL up to and including that segment
    
    // Example:
    // https://cnas.org/events/2026-defense-summit → https://cnas.org/events
    // https://brookings.edu/events/2026/01/cyber → https://brookings.edu/events
}
```

### 2. Update Strategy (Preserve Existing Data)
- Only update empty fields
- Never overwrite existing `events_url` if already set
- Always update `tou_scanned_date`

### 3. Validation Before Saving
- Events URLs are validated by checking for:
  - Event indicators: "upcoming events", "register now", "event calendar"
  - Date patterns in the page content
- Unvalidated candidates are flagged but still usable

---

## 📁 Files Analyzed This Session

| File | Purpose |
|------|---------|
| `tou-scanner.js` | Existing TOU scanning (consolidated into org-scanner) |
| `discover-orgs-by-events.js` | Phase B scanning logic (consolidated) |
| `base-scraper.js` | TOU check during scrape (to be updated) |
| `insa.js` | Deep scraping example (reviewed for patterns) |
| `admin-interface-v13.html` | Current UI (to be updated with scan button) |
| `ConOp_Event_Finder.md` | Architecture reference |

---

## 💡 Next Steps

1. **Create `scan-organization.js` CLI wrapper** with commands:
   ```bash
   node scan-organization.js --org "CNAS"
   node scan-organization.js --org-id abc123
   node scan-organization.js --status "Nominated"
   node scan-organization.js --missing-events-url
   ```

2. **Test on CNAS** to verify events_url extraction works

3. **Update discovery scripts** to use the new module

4. **Add UI button** for manual scanning from Admin Interface

---

## 📊 Architecture Benefits

| Benefit | Description |
|---------|-------------|
| **Single Source of Truth** | Fix a bug once, fixed everywhere |
| **Consistent Behavior** | All orgs scanned the same way |
| **Easy to Extend** | Add new scanning features in one place |
| **CLI + Programmatic** | Run from command line OR call from scripts |
| **Admin UI Ready** | One module to expose via API endpoint later |
| **Matches ConOp Vision** | "Unified Scanning" (line 2923) |
