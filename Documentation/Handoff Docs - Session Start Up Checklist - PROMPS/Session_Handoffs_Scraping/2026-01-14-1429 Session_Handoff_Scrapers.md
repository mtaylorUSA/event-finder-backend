# Handoff Document: Scrapers Folder Consolidation
**Date:** 2026-01-14
**Session Focus:** Unified Scanner Architecture & File Migration

---

## 🎯 Session Summary

This session consolidated all scraping, scanning, and discovery scripts into a single `scrapers/` folder and created a new unified scanning module (`org-scanner.js`).

---

## ✅ Completed This Session

| Task | Status | Details |
|------|--------|---------|
| Created `org-scanner.js` | ✅ Done | Unified module for TOU, tech blocks, events URL, POC, AI analysis |
| Migrated files to `scrapers/` | ✅ Done | 5 scripts moved from root to scrapers/ folder |
| Deprecated `tou-scanner.js` | ✅ Done | Renamed to `tou-scanner.deprecated.js` |
| Updated ConOp | ✅ Done | All file paths, run commands, and architecture updated |
| Tested migration | ✅ Done | `scrape-all-organizations.js --help` works |

---

## 📁 New File Structure

```
C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\
├── admin-interface-v11.html           ← Current admin UI
├── tou-scanner.deprecated.js          ← DEPRECATED
│
├── scrapers/                          ← ALL scraping/discovery scripts
│   ├── index.js                       ← Scraper registry
│   ├── base-scraper.js                ← Safety gates, generic scraper
│   ├── org-scanner.js                 ← NEW: Unified scanning module
│   ├── scrape-all-organizations.js    ← CLI runner (MOVED)
│   ├── discover-orgs-by-events.js     ← Org discovery (MOVED)
│   ├── suggest-organizations.js       ← Profile discovery (MOVED)
│   ├── generate-embeddings.js         ← Embeddings (MOVED)
│   ├── enrich-events.js               ← AI enrichment (MOVED)
│   └── custom/
│       └── insa.js                    ← Custom INSA scraper
│
└── icon-worker/                       ← Image generation (unchanged)
```

---

## 🔧 Updated Run Commands

| Script | New Command |
|--------|-------------|
| Scrape all orgs | `node scrapers/scrape-all-organizations.js` |
| Scrape specific org | `node scrapers/scrape-all-organizations.js --org "INSA"` |
| Event-based discovery | `node scrapers/discover-orgs-by-events.js` |
| Profile-based discovery | `node scrapers/suggest-organizations.js` |
| Generate embeddings | `node scrapers/generate-embeddings.js` |
| Enrich events | `node scrapers/enrich-events.js` |

---

## 🆕 New Module: scrapers/org-scanner.js

### Purpose
Central module for all organization scanning operations. Consolidates logic previously spread across `tou-scanner.js`, `discover-orgs-by-events.js`, and `base-scraper.js`.

### Features
- **TOU Scanning:** Discovers TOU pages, scans for restriction keywords
- **Tech Block Detection:** Detects 403/401 errors
- **Events URL Discovery:** Finds events page from homepage links or triggering URL
- **POC Gathering:** Extracts contact info from About/Contact pages
- **AI Analysis:** Uses GPT-4o-mini to extract org name, type, and summary

### Exported Functions
```javascript
const scanner = require('./scrapers/org-scanner');

// Main function - runs full scan
await scanner.scanOrganization(org, { updateDb: true });

// Individual components
await scanner.scanTOU(baseUrl, homepageHtml);
await scanner.findEventsUrl(org, homepageHtml);
await scanner.gatherPOC(homepageHtml, baseUrl);
await scanner.analyzeWithAI(html, domain, triggeringEventTitle);

// Database operations
await scanner.getOrganization(id);
await scanner.getOrganizationByName(name);
await scanner.updateOrganization(id, updates);

// Utilities
await scanner.fetchUrl(url);
scanner.extractText(html);
await scanner.sleep(ms);
```

### Configuration Constants (exported)
- `TOU_RESTRICTION_KEYWORDS` - Words indicating scraping restrictions
- `TOU_RESTRICTION_PHRASES` - Phrases indicating prohibitions
- `TOU_PATHS` - Common TOU page URL patterns
- `EVENTS_PATHS` - Common events page URL patterns
- `EVENTS_PAGE_INDICATORS` - Keywords indicating an events listing page
- `USER_AGENT` - Bot identification string

---

## 📋 Remaining Tasks (Next Session)

### Priority 1: Create CLI Wrapper
Create `scrapers/scan-organization.js` CLI script to manually scan individual orgs:
```
node scrapers/scan-organization.js --org "CNAS"
node scrapers/scan-organization.js --domain "cnas.org"
```

### Priority 2: Update discover-orgs-by-events.js
Refactor to use `org-scanner.js` module instead of duplicating scanning logic.

### Priority 3: Test on CNAS
Run unified scanner on CNAS organization to verify events URL discovery works.

### Priority 4: Update GitHub Actions
Verify `.github/workflows/scrape-events.yml` uses correct path:
```yaml
node scrapers/scrape-all-organizations.js
```

---

## 📎 Files to Attach for Next Chat

| File | Purpose |
|------|---------|
| `2026-01-14-1900_ConOp_Event_Finder.md` | Updated project documentation |
| `scrapers/org-scanner.js` | New unified scanning module |
| `scrapers/discover-orgs-by-events.js` | Needs refactoring to use org-scanner |

---

## 🗂️ Migration Log

A migration log was created during the file move:
- **File:** `migration-log-1768417388887.json`
- **Location:** Project root
- **Purpose:** Records what was moved for potential rollback

---

## ⚠️ Important Notes

1. **Old paths no longer work** - Scripts moved from root to `scrapers/`
2. **tou-scanner.js is deprecated** - Use `org-scanner.js` instead
3. **GitHub Actions may need update** - Check workflow file for correct path
4. **ConOp is source of truth** - `2026-01-14-1900_ConOp_Event_Finder.md`

---

## 📊 Session Statistics

- Files moved: 5
- Files deprecated: 1
- New modules created: 1
- Import paths updated: 4
- ConOp sections updated: 10+

---

*End of Handoff Document*
