# Handoff Document: Event-Based Organization Discovery
**Date:** 2026-01-11
**Purpose:** Continue development of event-based organization discovery feature

---

## SESSION SUMMARY

This session accomplished the following:

1. **Restored scrapers/ folder** that was accidentally deleted
2. **Updated base-scraper.js** to update existing events instead of skipping them
3. **Ran INSA deep scrape** - updated 8 events with new data
4. **Enriched events** - 51 events tagged with topics
5. **Generated 5 new icons** for new topic combinations
6. **Designed Event-Based Organization Discovery architecture**
7. **Updated ConOp** with complete documentation of the new discovery approach

---

## CURRENT STATE

### What Exists
| Component | Status | Location |
|-----------|--------|----------|
| Profile-based discovery | ✅ Working | `suggest-organizations.js` |
| Event embeddings generation | ✅ Working | `generate-embeddings.js` |
| Event enrichment | ✅ Working | `enrich-events.js` |
| Scrapers | ✅ Working | `scrapers/` folder |
| Icon generation | ✅ Working | `icon-worker/` folder |

### What Needs to Be Built
| Component | Status | Notes |
|-----------|--------|-------|
| `discover-orgs-by-events.js` | 🆕 Not started | Main script for event-based discovery |
| Web search API integration | 🆕 Not started | Need to choose: SerpAPI, Bing, or Google |
| New PocketBase fields | 🆕 Not added | discovery_method, triggering_event_* fields |

---

## ARCHITECTURE OVERVIEW

### Event-Based Discovery Flow
```
1. Build "Ideal Event Profile"
   - Average all existing event embeddings
   - Creates single vector representing "what relevant events look like"

2. Generate Search Queries
   - AI creates queries based on topics/regions
   - Examples: "cybersecurity conference 2026", "defense policy forum DC"

3. Search Web for Candidate Events
   - Execute queries via search API
   - Filter out URLs from orgs we already track

4. Extract Event Details
   - Fetch page content
   - Extract: title, description, date, host org

5. Score Candidate Events
   - Generate embedding for candidate
   - Calculate cosine similarity to ideal profile
   - Threshold: > 0.75 = relevant

6. Nominate Host Organizations
   - Check if org already exists (dedupe by domain)
   - Create nomination with status "Pending Mission Review"
   - Set discovery_method = "event-based"
   - Populate triggering_event_* fields
```

---

## KEY DECISIONS NEEDED

### 1. Web Search API Choice
| Option | Pros | Cons |
|--------|------|------|
| **SerpAPI** | Google results, reliable | $50/mo for 5000 searches |
| **Bing Search API** | Good results, Microsoft | Free tier: 1000/mo |
| **Google Custom Search** | Official Google | Free tier: 100/day, limited |

**Recommendation:** Start with Bing Search API (free tier) for testing

### 2. Database Field Additions
Add these fields to `organizations` collection in PocketBase:
- `discovery_method` (Select: manual, profile-based, event-based)
- `triggering_event_title` (Plain Text)
- `triggering_event_score` (Number 0-100)
- `triggering_event_url` (URL)

---

## PENDING ISSUE: Icon Display

Icons are not showing in admin interface. Investigation revealed:
- Events have topics/regions populated correctly
- topic_icons records exist with images
- The `icon` field on events is EMPTY (not linked)

**Root cause:** The system generates icons in topic_icons collection but doesn't link them to events. The admin interface needs to look up icons by combination_key match, OR we need to populate the event.icon relation field.

**Options to fix:**
1. Update admin interface to look up icons by key (client-side matching)
2. Create script to populate event.icon field by matching combination_key
3. Do lookup at scrape/enrichment time

---

## FILES TO ATTACH FOR NEXT CHAT

### Essential Files (attach these)
```
1. 2026-01-11-Updated_ConOp_Event_Finder.md
   - Full system documentation including new architecture
   - Location: Just downloaded from this session

2. generate-embeddings.js
   - Shows how embeddings are created
   - Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\

3. suggest-organizations.js
   - Profile-based discovery for reference
   - Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\

4. enrich-events.js
   - Shows AI enrichment pattern
   - Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\
```

### Optional Files (if context needed)
```
5. scrapers/base-scraper.js
   - If discussing scraper integration

6. icon-worker/src/create-topic-icon-records.js
   - If fixing icon display issue
```

---

## SUGGESTED OPENING PROMPT FOR NEXT CHAT

```
I'm building an Event Finder application that aggregates national security events. 

I need to implement "Event-Based Organization Discovery" - a feature that discovers new organizations by finding events they host online and scoring them against our existing events using embeddings.

I've attached:
- ConOp (full system documentation including the architecture)
- generate-embeddings.js (how we create embeddings)
- suggest-organizations.js (profile-based discovery for reference)
- enrich-events.js (AI enrichment pattern)

Please review the "EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE" section in the ConOp, then help me build discover-orgs-by-events.js.

First decision needed: Which web search API should we use? I'm considering Bing Search API (free tier).
```

---

## ENVIRONMENT VARIABLES NEEDED

Current `.env` file needs:
```
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=(in Bitwarden)
POCKETBASE_ADMIN_PASSWORD=(in Bitwarden)
OPENAI_API_KEY=(in Bitwarden)
OPENAI_IMAGE_MODEL=dall-e-3
SEARCH_API_KEY=(NEW - add after choosing search provider)
```

---

## QUICK REFERENCE

| Resource | URL/Location |
|----------|--------------|
| PocketBase Admin | https://event-discovery-backend-production.up.railway.app/_/ |
| GitHub Repo | https://github.com/mtaylorUSA/event-finder-backend |
| Public UI | https://event-finder-ui-one.vercel.app |
| Local Project | C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\ |

---

## TRANSCRIPT LOCATION

Full conversation transcript available at:
```
/mnt/transcripts/2026-01-11-19-14-07-scraper-recovery-update-logic-icon-generation.txt
```

Previous session transcripts referenced in journal.txt in same directory.

---

*Generated: 2026-01-11*
