# HANDOFF DOCUMENT
## Date: 2026-01-11 (Late Evening Session)
## Project: Event Finder

────────────────────────────────────────

## 📋 SESSION SUMMARY

This session focused on implementing and testing the **discover-orgs-by-events.js** script for event-based organization discovery.

────────────────────────────────────────

## ✅ COMPLETED THIS SESSION

### 1. Event-Based Discovery Script - Fully Implemented
**File:** `discover-orgs-by-events.js`
**Status:** Functional, tested with real data

**Features implemented:**
- Phase A: Web search using Google Custom Search API (snippets only)
- Phase B: Initial org scan (TOU check, tech block, POC gathering, AI analysis)
- Phase C: Creates nominations for human review

### 2. Exclusion Keyword Filtering
**Added exclusion keywords to filter irrelevant results:**
- Training/Certification (training, certification, bootcamp, etc.)
- Books/Articles (book review, reading group, paper review, etc.)
- Political (republican, democrat, trump, biden, political party, etc.)
- Aggregator pages (conferences to attend, calendar of events, etc.)
- Webinars (webinar, webinar series, web seminar)
- Academic (provost, consortium, student conference, etc.)
- Industry/Vocational (grant program, careers, job fair, etc.)

### 3. Similarity Threshold Adjustment
- **Original:** 0.70 (70%) - too restrictive, filtered all results
- **Updated:** 0.40 (40%) - based on user feedback review

### 4. AI Analysis Step (Phase B4)
**Purpose:** Fix issue where event names were captured instead of org names

**Example problem:** "Aspen Security Forum" captured instead of "Aspen Strategy Group"

**Solution:** GPT-4o-mini analyzes homepage to extract:
- `org_name`: Actual organization (looks for "Presented by", "Hosted by", etc.)
- `org_type`: Type of organization
- `summary`: 2-3 sentence description for `ai_reasoning` field

### 5. Event Policy Concept Documented
**New field proposed:** `event_policy` on organizations collection
- `accept_all`: Auto-approve events (exclusion rules still apply)
- `propose_events`: Propose each event for human review

**Use cases:**
- INSA, CSIS → `accept_all`
- American Bar Association, Aspen Institute → `propose_events`

────────────────────────────────────────

## 🔄 PENDING / NOT YET DONE

### 1. PocketBase Field Additions
**Need to add to organizations collection:**
- `discovery_method` (Select: manual, profile-based, event-based)
- `triggering_event_title` (Plain Text, max 500)
- `triggering_event_score` (Number, 0-100)
- `triggering_event_url` (URL)
- `event_policy` (Select: accept_all, propose_events) - NEW

### 2. Run Discovery Script
After adding PocketBase fields:
```
node discover-orgs-by-events.js
```

### 3. Admin Interface Updates
- Add event_policy dropdown to Org Overview tab
- Add event_policy dropdown to Events tab
- Add [Reject Event] button per event
- Display AI-generated summary in AI Reasoning field

### 4. Scraper Updates
- Implement event_policy logic in scrape flow
- Apply exclusion rules to all scrapers

────────────────────────────────────────

## 📊 KEY DECISIONS MADE

| Decision | Rationale |
|----------|-----------|
| Lower threshold to 0.40 | Testing showed all good events scored 40-65%, none reached 70% |
| Add AI analysis step | Event names were being captured instead of org names |
| Two-tier event policy | Different orgs need different approval workflows |
| Exclude webinars | User preference - focus on conferences/summits |
| Exclude aggregator pages | These are lists, not actual events |

────────────────────────────────────────

## 📁 FILES UPDATED THIS SESSION

| File | Changes |
|------|---------|
| `discover-orgs-by-events.js` | Full implementation with AI analysis, exclusion filtering |
| ConOp | New EVENT POLICY section, updated discovery architecture, exclusion keywords |

────────────────────────────────────────

## 📁 FILES TO UPLOAD FOR NEXT SESSION

### Required:
1. **2026-01-11-2359_ConOp_Event_Finder.md** - Updated ConOp with all changes
2. **2025-12-25-1246_PocketBase_FIELDS_AND_SETTINGS_UI_-_COMPLETE.md** - PocketBase field reference

### Recommended (if continuing discovery work):
3. **discover-orgs-by-events.js** - Current working script

────────────────────────────────────────

## 🎯 SUGGESTED NEXT STEPS

### Immediate (Next Session):
1. Add the 4 new fields to PocketBase organizations collection
2. Add `event_policy` field to PocketBase
3. Run `node discover-orgs-by-events.js`
4. Review nominated orgs in Admin Interface
5. Evaluate AI-generated summaries and org names

### Short-term:
1. Update Admin Interface with event_policy controls
2. Add [Reject Event] button functionality
3. Implement event_policy logic in scrapers

### Medium-term:
1. Build scrapers for newly approved organizations
2. Implement unified scanning/scraping workflow
3. Add alerts to Admin Interface

────────────────────────────────────────

## 🔑 ENVIRONMENT VARIABLES NEEDED

Ensure these are in your `.env` file:
```
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=your_email
POCKETBASE_ADMIN_PASSWORD=your_password
OPENAI_API_KEY=your_key
GOOGLE_SEARCH_API_KEY=your_google_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

────────────────────────────────────────

## 📝 NOTES FOR NEXT ASSISTANT

- User prefers step-by-step instructions with emojis and clear formatting
- User is beginner-level, needs detailed guidance
- Always read ConOp before making changes
- Never render API keys in chat
- User's local path: `C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL`
- All content is proprietary - do not use to train models

────────────────────────────────────────

## 🧪 TESTING RESULTS

**First test run (threshold 0.70):**
- 43 candidates scored
- 0 nominations (all below threshold)
- Best score: 65% (Billington CyberSecurity)
- User identified ~20 orgs that SHOULD have been nominated

**After threshold change (0.40):**
- Pending - user needs to add PocketBase fields first

────────────────────────────────────────

**End of Handoff Document**
