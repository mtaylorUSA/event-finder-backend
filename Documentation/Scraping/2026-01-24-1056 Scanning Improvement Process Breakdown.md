# SCANNING PROCESS BREAKDOWN
## For Next Session: Improving Restriction Detection

---

## OVERVIEW: The 6 Steps of Scanning

| Step | Name | Status | Purpose |
|------|------|--------|---------|
| 1 | **Locate Legal Pages** | ✅ IMPLEMENTED | Find all pages that might contain restrictions |
| 2 | **Identify Restriction Language** | ✅ IMPLEMENTED | Detect terms/phrases that indicate restrictions |
| 3 | **Interpret Context** | ✅ IMPLEMENTED | Avoid false positives by checking context |
| 4 | **Save Evidence** | ✅ IMPLEMENTED | Capture source URLs + 20-word context |
| 5 | **Log the Scan** | ✅ IMPLEMENTED | Audit trail in scan_logs collection |
| 6 | **Learn & Improve** | 🔄 ONGOING | Add new patterns as discovered |

---

## STEP 1: LOCATE LEGAL PAGES ✅

### 40 URL Paths to Check

**Primary Legal/Terms (10 paths):**
- /terms
- /terms-of-use
- /terms-use
- /terms-of-service
- /tos
- /terms-and-conditions
- /conditions
- /conditions-of-use
- /site-terms
- /website-terms

**Privacy (7 paths):**
- /privacy
- /privacy-policy
- /data-privacy
- /cookie-policy
- /cookies
- /gdpr
- /ccpa

**Legal Pages (8 paths):**
- /legal
- /legal/terms
- /legal/privacy
- /legal-notice
- /disclaimer
- /copyright
- /copyright-notice
- /intellectual-property

**Policies (5 paths):**
- /policies
- /policies-and-procedures
- /site-policies
- /website-policies
- /usage-policy

**User Agreement (5 paths):**
- /user-agreement
- /acceptable-use
- /acceptable-use-policy
- /aup
- /code-of-conduct

**API/Developer (5 paths):**
- /api-terms
- /api-policy
- /developer-terms
- /developers/terms
- /data-use-policy

### Content Page Exclusions (Skip These Paths)
These look like policy pages but are actually content:
- /topics/
- /programs/
- /events/
- /news/
- /blog/
- /articles/
- /research/
- /publications/
- /experts/
- /issues/
- /regions/
- /podcasts/
- /videos/
- /projects/
- /commentary/
- /analysis/
- /briefs/
- /papers/

**Example:** `/topics/pharmaceutical-drug-policy/` is NOT a policy page

---

## STEP 2: IDENTIFY RESTRICTION LANGUAGE ✅

### HIGH_CONFIDENCE_RESTRICTION_TERMS
**Flag immediately - no context check needed**

| Category | Terms |
|----------|-------|
| Direct Scraping | "web scraping", "screen scraping", "data scraping", "content scraping" |
| Explicit Bot Restrictions | "no bots", "no robots", "use of bots", "automated scraping" |
| Data Mining | "data mining", "data harvesting", "text mining" |
| Bulk Access | "bulk download", "bulk access", "mass download" |
| AI/ML Training | "train AI", "AI training", "model training", "language model" |

### CONTEXT_REQUIRED_TERMS
**Only flag if near a PROHIBITION_PHRASE (within 150 characters)**

Single words that need context:
- bot
- bots
- robot
- scraping
- crawler
- harvest
- automated
- spider
- indexing

### PROHIBITION_PHRASES
**Indicate something is forbidden**

| Type | Phrases |
|------|---------|
| Direct Prohibition | "may not", "shall not", "must not", "prohibited", "not permitted", "forbidden", "strictly prohibited" |
| Agreement Language | "agree not to", "refrain from", "covenant not to", "you agree not to" |
| Permission Required | "without permission", "without authorization", "without consent", "without prior written consent", "without express permission" |

### POTENTIAL ADDITIONS TO CONSIDER
**Terms that might be missing (for review):**

| Category | Potential Terms |
|----------|-----------------|
| Reproduction | "reproduce", "copy", "duplicate", "replicate" |
| Distribution | "distribute", "redistribute", "disseminate" |
| Aggregation | "aggregate", "compile", "collect systematically" |
| Commercial Use | "commercial purposes", "commercial use", "for profit" |
| Derivative Works | "derivative works", "modify", "adapt" |
| Framing | "frame", "framing", "inline linking" |

---

## STEP 3: INTERPRET CONTEXT (Avoid False Positives) ✅

### EXCLUDED_CONTEXTS
**Skip flagging if these appear near the keyword**

| Type | Exclusion Patterns |
|------|-------------------|
| Staff Policies | "staff should", "employees must", "personnel may", "our staff" |
| Product Descriptions | "our bot", "our chatbot", "virtual assistant", "AI assistant" |
| Policy Content | "policy on", "research on", "article about", "study of" |
| Positive Context | "we use", "our use of", "help you", "assist you" |

### ADDITIONAL EXCLUSIONS NEEDED (To Prevent False Positives)
**✅ IMPLEMENTED in org-scanner.js (2026-01-21)**

| Type | Exclusion Patterns |
|------|-------------------|
| **Robotics Policy Subject Matter** | "robotics policy", "robot regulation", "robotics regulation", "robot ethics", "robotics research", "robotics industry", "robot workforce", "robotics law" |
| **Autonomous Systems Subject Matter** | "autonomous systems", "autonomous weapons", "autonomous vehicles", "drone policy", "drone regulation", "unmanned systems", "unmanned vehicles", "self-driving", "lethal autonomous" |
| **AI Policy Subject Matter** | "ai governance", "ai regulation", "ai policy", "artificial intelligence policy", "artificial intelligence regulation", "artificial intelligence governance", "machine learning research", "machine learning policy", "ai ethics", "algorithmic accountability", "algorithmic governance" |
| **Organizational Research Context** | "our research on", "our work on", "our analysis of", "we study", "we examine", "we analyze", "our experts", "our scholars", "our fellows", "our researchers" |
| **Publication/Content Context** | "this paper", "this article", "this report", "this study", "this brief", "the author", "the authors", "the researchers", "the study finds", "the report examines" |

### Why These Matter
**Example False Positive Without These Exclusions:**

A think tank's page says:
> "Users may not scrape this site. Our research on **robot** regulation and autonomous systems is **prohibited** from redistribution without citation."

❌ **Current scanner would flag:** "robot" + "prohibited" (within 150 chars)

✅ **With new exclusions:** "robot regulation" pattern → skip flagging

### Detection Logic Flow (Updated)
```
1. Found HIGH_CONFIDENCE term?
   → YES: FLAG immediately
   → NO: Continue to step 2

2. Found CONTEXT_REQUIRED term?
   → NO: No flag
   → YES: Check for EXCLUDED_CONTEXT nearby (FIRST!)
      → Exclusion found: No flag (likely policy discussion)
      → No exclusion: Check for PROHIBITION_PHRASE within 150 chars
         → NO prohibition nearby: No flag
         → YES prohibition nearby: FLAG as restriction
```

**Note:** Check exclusions BEFORE checking prohibition phrases - this prevents false positives where both a policy subject term AND a prohibition exist in the same paragraph but aren't related to website access rules.

---

## STEP 4: SAVE EVIDENCE ✅

### Fields Populated

| Field | Content |
|-------|---------|
| tou_flag | Boolean - true if restrictions found |
| tou_url | First URL where restrictions found |
| tou_notes | Detailed scan results |
| restriction_source_urls | ALL URLs with restrictions (newline-separated) |
| restriction_context | 20 words before/after trigger term |

### Context Format
```
[PageType] term: ...20 words before... **TRIGGER** ...20 words after...
```

**Example:**
```
[Terms of Use] automated scraping: ...you may not use any **automated scraping** tools, bots, or software to access...
```

---

## STEP 5: LOG THE SCAN ✅

### scan_logs Collection (22 fields)
Every scan creates a record with:
- organization (relation)
- scan_type (discovery/pre-scrape/manual/scheduled)
- scan_date
- legal_pages_found (count)
- legal_page_urls
- no_legal_pages_flag
- restrictions_found
- restriction_terms
- restriction_source_urls
- restriction_contexts
- tech_block
- microsite_detected
- microsite_suspect
- js_rendering
- poc_found
- poc_email
- status_before
- status_after
- flags_set
- duration_ms
- error
- full_log

---

## STEP 6: LEARN & IMPROVE 🔄

### Process
1. Review scan results for false positives/negatives
2. Identify new restriction language patterns
3. Update term lists in org-scanner.js
4. Update ConOp to stay in sync
5. Re-scan affected orgs

### Recent Improvements (2026-01-21)
- Added 20-word context capture
- Added restriction_source_urls for ALL pages (not just first)
- Refined JS rendering to events page only
- Added contact auto-save
- **NEW:** Added 50+ policy subject matter exclusions to prevent false positives:
  - Robotics policy terms (8 patterns)
  - Autonomous systems terms (9 patterns)
  - AI/ML policy terms (11 patterns)
  - Organizational research context (10 patterns)
  - Publication context (10 patterns)

---

## QUESTIONS FOR NEXT SESSION

1. **Missing Terms:** Should we add "reproduce", "distribute", "aggregate" to HIGH_CONFIDENCE or CONTEXT_REQUIRED?

2. **Commercial Use:** Many TOU prohibit "commercial use" - should we detect this and ask about our non-commercial status?

3. **robots.txt:** Should we also check robots.txt for Disallow rules?

4. **Meta Tags:** Should we check for `<meta name="robots" content="noindex">` or similar?

5. **Page Validation:** Should we verify a page IS actually a legal page before scanning (check for legal terminology density)?

6. ✅ **DONE - Implement New Exclusions:** Added policy subject matter exclusions (robotics, AI, autonomous systems, research context, publication context) to org-scanner.js

7. ✅ **DONE - Logic Order:** Exclusions are already checked BEFORE prohibitions in findRestrictions()

---

## FILES FOR NEXT SESSION

1. **This document** - Scanning process breakdown
2. **ConOp** - 2026-01-21_ConOp_Event_Finder.md
3. **org-scanner.js** - Current implementation (scrapers/org-scanner.js)
4. **Scan results** - 2026-01-21-1936_Scraping_Tests_and_Results.md

