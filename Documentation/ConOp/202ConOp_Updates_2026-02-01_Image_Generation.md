# ConOp Updates - 2026-02-01
# Image Generation Automation

This document contains updated sections for the ConOp to reflect the new automated image generation and enrichment workflow.

────────────────────────────────────────────────────────────────────────────────
## UPDATE 1: Workflow Files Location (Lines ~1264-1270)
## LOCATION: # SCANNING - ORG-SCANNER DETAILS section, "Workflow Files Location" subsection
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
     * Workflow Files Location:
          ** All GitHub Actions workflows in: .github/workflows/
               *** scrape-events.yml - Daily scraping
               *** suggest-organizations.yml - Monday profile-based discovery
               *** discover-orgs-by-events.yml - Wednesday event-based discovery
               *** org-scanner.yml - Saturday weekly re-scan
               *** contact-discovery.yml.disabled - DEPRECATED (functionality in org-scanner.js)
```

WITH THIS:
```
     * Workflow Files Location:
          ** All GitHub Actions workflows in: .github/workflows/
               *** scrape-events.yml - Daily scraping (11:30 PM EST)
               *** generate-topic-icons.yml - Daily enrichment + icon generation (12:00 AM EST) - NEW 2026-02-01
               *** suggest-organizations.yml - Monday profile-based discovery
               *** discover-orgs-by-events.yml - Wednesday event-based discovery
               *** org-scanner.yml - Saturday weekly re-scan
               *** contact-discovery.yml.disabled - DEPRECATED (functionality in org-scanner.js)
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 2: Enrich Events Section (Lines ~773-783)
## LOCATION: # ORGANIZATION WORKFLOW 4: SCRAPING section
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
     * Enrich Events (Optional)
          ** VALIDATED 2026-01-27: Command confirmed working
          ** After scraping, run AI enrichment:
              *** powershell
              *** node scrapers/enrich-events.js

          ** This adds:
              *** Topic tags
              *** Event type classification
              *** Speaker extraction
```

WITH THIS:
```
     * Enrich Events (AUTOMATED)
          ** UPDATED 2026-02-01: Now automated via generate-topic-icons.yml workflow
          ** Runs daily at 12:00 AM EST (30 min after scraping)
          ** Enriches ALL events (regardless of status) - cheap GPT-4o-mini calls
          ** Manual run (if needed): node scrapers/enrich-events.js

          ** This adds:
              *** Topic tags
              *** Region tags
              *** Country tags
              *** Transnational organization tags
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 3: After Scraping: Image Generation (Lines ~808-814)
## LOCATION: # ORGANIZATION WORKFLOW 4: SCRAPING section
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
     * After Scraping: Image Generation
          ** APPROVED events need topic icons for display on event cards
          ** If approved event has new topic/region/country/org combination:
               *** create-topic-icon-records.js creates topic_icons record (only for approved events)
               *** generate-topic-icons.js generates the actual image via DALL-E 3
          ** Nominated/rejected events are skipped (saves DALL-E API costs)
          ** See ORGANIZATION WORKFLOW 6: IMAGE GENERATION for details
```

WITH THIS:
```
     * After Scraping: Enrichment and Image Generation (AUTOMATED)
          ** UPDATED 2026-02-01: Fully automated via generate-topic-icons.yml workflow
          ** Daily at 12:00 AM EST (30 min after scraping):
               *** Step 1: enrich-events.js tags ALL events with topics/regions/countries
               *** Step 2: create-topic-icon-records.js creates topic_icons records for APPROVED events only
               *** Step 3: generate-topic-icons.js generates DALL-E 3 images for new records
          ** Cost optimization:
               *** Enrichment (GPT-4o-mini): ~$0.0001 per event - runs on ALL events
               *** Icon generation (DALL-E 3): ~$0.04 per image - runs on APPROVED events only
          ** See ORGANIZATION WORKFLOW 6: IMAGE GENERATION for details
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 4: ORGANIZATION WORKFLOW 6: IMAGE GENERATION (Lines ~848-886)
## LOCATION: Full section replacement
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS ENTIRE SECTION:
```
# ORGANIZATION WORKFLOW 6: IMAGE GENERATION 
     * VALIDATED 2026-01-31: Updated to reflect approved-events-only filtering

     * Purpose: Generate unique topic icons for approved events to display on event cards

-----

     * How Image Generation Works
          ** When an event is approved, it needs a topic icon for display
          ** Icon is based on: Topic + Region + Country + Organization combination
          ** System checks topic_icons collection for existing icon with matching combination
          ** If no icon exists: create-topic-icon-records.js creates the record, then generate-topic-icons.js creates the image via DALL-E 3 API
          ** IMPORTANT: Only APPROVED events are processed (nominated/rejected events are skipped to save DALL-E costs)

-----

     * Current Implementation
          ** Step 1: Run create-topic-icon-records.js to scan approved events for new combinations
               *** Command: cd icon-worker && node src/create-topic-icon-records.js
               *** Creates topic_icons records for new combinations (no images yet)
          ** Step 2: Run generate-topic-icons.js to generate images for records missing icon_file
               *** Command: cd icon-worker && node src/generate-topic-icons.js
               *** Calls DALL-E 3 API to generate 1024x1024 PNG
               *** Validates image (OCR text check, panel detection, downscale audit)
               *** Uploads valid icon to PocketBase
               *** Retries with simplified prompt if validation fails

-----

     * Safety and Compliance
          ** No text in images (OCR validation)
          ** No collages or multi-panel compositions
          ** No political figures or controversial imagery
          ** Consistent visual style per topic/region
          ** Max 6 attempts per icon before flagging for manual review

-----

     * Cross-Reference: See IMAGE GENERATION PROGRAM ARCHITECTURE section for full technical details
```

WITH THIS:
```
# ORGANIZATION WORKFLOW 6: IMAGE GENERATION 
     * UPDATED 2026-02-01: Now fully automated via GitHub Actions

     * Purpose: Generate unique topic icons for approved events to display on event cards

-----

     * How Image Generation Works (AUTOMATED)
          ** GitHub Action: generate-topic-icons.yml runs daily at 12:00 AM EST
          ** Three-step automated pipeline:
               *** Step 1: Enrich ALL events with topics/regions/countries (GPT-4o-mini - cheap)
               *** Step 2: Create topic_icons records for APPROVED events only
               *** Step 3: Generate DALL-E 3 images for records missing icon_file
          ** Icon is based on: Topic + Region + Country + Transnational Org combination
          ** System checks topic_icons collection for existing icon with matching combination
          ** IMPORTANT: Enrichment runs on ALL events; icon generation only for APPROVED events (saves DALL-E costs)

-----

     * Automation Details
          ** Workflow: .github/workflows/generate-topic-icons.yml
          ** Schedule: Daily at 12:00 AM EST (05:00 UTC) - 30 min after scrape-events.yml
          ** Manual trigger: GitHub Actions → Generate Topic Icons Daily → Run workflow
          ** Scripts executed (in order):
               *** node scrapers/enrich-events.js
               *** cd icon-worker && node src/create-topic-icon-records.js
               *** cd icon-worker && node src/generate-topic-icons.js

-----

     * Manual Execution (if needed)
          ** Step 1: Enrich events
               *** Command: node scrapers/enrich-events.js
               *** Tags ALL events missing topics/regions/countries
          ** Step 2: Create topic_icons records
               *** Command: cd icon-worker && node src/create-topic-icon-records.js
               *** Creates records for APPROVED events with new combinations
          ** Step 3: Generate icons
               *** Command: cd icon-worker && node src/generate-topic-icons.js
               *** Calls DALL-E 3 API, validates, uploads to PocketBase

-----

     * Safety and Compliance
          ** No text in images (OCR validation via Tesseract.js)
          ** No collages or multi-panel compositions
          ** No political figures or controversial imagery
          ** Consistent visual style per topic/region
          ** Max 6 attempts per icon before flagging for manual review

-----

     * Cost Optimization
          ** Enrichment (GPT-4o-mini): ~$0.0001 per event - runs on ALL events
          ** Icon generation (DALL-E 3): ~$0.04 per image - runs on APPROVED events only
          ** Existing icons are reused - only new combinations trigger generation

-----

     * Cross-Reference: See IMAGE GENERATION PROGRAM ARCHITECTURE section for full technical details
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 5: GITHUB ACTIONS Section - Add New Workflow (Lines ~2314-2406)
## LOCATION: # GITHUB ACTIONS section, add after "Scrape Events Daily" workflow
────────────────────────────────────────────────────────────────────────────────

ADD THIS NEW SECTION after the "Workflow: Scrape Events Daily" section (after line ~2335):

```
-----

     * Workflow: Enrich Events and Generate Topic Icons (Daily) - NEW 2026-02-01
          ** File: .github/workflows/generate-topic-icons.yml
          ** Status: ✅ Active
          ** Schedule: Daily at 12:00 AM EST (05:00 UTC) - 30 min after scrape-events.yml
          ** Scripts (in order):
               *** enrich-events.js - Tags ALL events with topics/regions/countries
               *** create-topic-icon-records.js - Creates records for APPROVED events
               *** generate-topic-icons.js - Generates DALL-E 3 images
          ** Purpose: Automate event enrichment and icon generation
          ** Cost: ~$0.0001/event (enrichment) + ~$0.04/icon (DALL-E 3)
          ** Note: Enrichment runs on ALL events; icon generation only for APPROVED events
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 6: SCRIPTS Section - Data Enrichment (Lines ~2231-2240)
## LOCATION: # SCRIPTS section, "Data Enrichment" subsection
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
     * Data Enrichment (in scrapers/ folder)
          ** enrich-events.js
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.)
               *** Run: node scrapers/enrich-events.js

          ** generate-embeddings.js
               *** Creates AI embeddings for semantic search functionality
               *** Also provides input data for event-based organization discovery
               *** Embeddings stored in event_embeddings collection
               *** Run: node scrapers/generate-embeddings.js
```

WITH THIS:
```
     * Data Enrichment (in scrapers/ folder)
          ** enrich-events.js
               *** UPDATED 2026-02-01: Now automated via generate-topic-icons.yml workflow
               *** Uses GPT-4o-mini to tag events with topics, regions, countries, transnational orgs
               *** Processes ALL events (regardless of status) - very cheap (~$0.0001/event)
               *** Only enriches events missing tags (skips already-tagged events)
               *** Automated: Runs daily at 12:00 AM EST via generate-topic-icons.yml
               *** Manual run: node scrapers/enrich-events.js

          ** generate-embeddings.js
               *** Creates AI embeddings for semantic search functionality
               *** Also provides input data for event-based organization discovery
               *** Embeddings stored in event_embeddings collection
               *** Run: node scrapers/generate-embeddings.js
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 7: IMAGE GENERATION PROGRAM ARCHITECTURE - Workflow Section (Lines ~1840-1847)
## LOCATION: # IMAGE GENERATION PROGRAM ARCHITECTURE section, "Workflow" subsection
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
     * Workflow
          ** Step 1: cd to icon-worker folder
          ** Step 2: Run npm run create-records to create topic_icons records for new combinations
               *** Only scans APPROVED events (nominated/rejected are skipped)
               *** Saves DALL-E API costs by not generating icons for unapproved events
          ** Step 3: Run npm run generate to generate icons for records missing icon_file
          ** Step 4: Icons are automatically uploaded to PocketBase and linked to events via topic_combination key
```

WITH THIS:
```
     * Workflow (AUTOMATED - Updated 2026-02-01)
          ** GitHub Action: .github/workflows/generate-topic-icons.yml
          ** Schedule: Daily at 12:00 AM EST (05:00 UTC)
          ** Automated Steps:
               *** Step 1: enrich-events.js tags ALL events with topics/regions/countries (GPT-4o-mini)
               *** Step 2: create-topic-icon-records.js creates records for APPROVED events only
               *** Step 3: generate-topic-icons.js generates DALL-E 3 images for new records
               *** Step 4: Icons automatically uploaded to PocketBase and linked via topic_combination key
          ** Manual Execution (if needed):
               *** cd icon-worker
               *** npm run create-records (or: node src/create-topic-icon-records.js)
               *** npm run generate (or: node src/generate-topic-icons.js)
          ** Cost Optimization:
               *** Enrichment on ALL events (~$0.0001/event) enables better embeddings and admin review
               *** Icon generation only for APPROVED events (~$0.04/image) saves DALL-E costs
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 8: SESSION HANDOFFS - IMAGE GENERATION (Lines ~4178-4233)
## LOCATION: Full section replacement
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS:
```
# SESSION HANDOFFS - IMAGE GENERATION

     * QUICK START PROMPT:
          ** "I'm working on Event Finder image generation (DALL-E topic icons). Please read ConOp section: IMAGE GENERATION PROGRAM ARCHITECTURE. Key files are in icon-worker/src/. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ icon-worker/src/create-topic-icon-records.js
          ** ✅ icon-worker/src/generate-topic-icons.js
          ** ✅ icon-worker/src/rules.js
          ** ✅ icon-worker/src/policyEngine.js
          ** ✅ icon-worker/src/validators.js
          ** ⚪ icon-worker/Image_Generation_Safety_Abstraction_Policy_v2.7.md (for policy questions)

-----

     * ConOp Sections to Emphasize:
          ** IMAGE GENERATION PROGRAM ARCHITECTURE
          ** KEY FOLDERS AND FILES (icon-worker/ section)
          ** ORGANIZATION WORKFLOW 6: IMAGE GENERATION

-----

     * Technology Stack:
          ** OpenAI DALL·E 3 API for image generation
          ** Sharp library for image processing
          ** Tesseract.js for OCR text detection
          ** PocketBase topic_icons collection for storage

-----

     * Last Session: 2026-01-31
          ** Fixed create-topic-icon-records.js to only process APPROVED events
          ** Updated script to use config.js (consistent with generate-topic-icons.js)
          ** Saves DALL-E API costs by skipping nominated/rejected events

-----

     * Current Status: ✅ FUNCTIONAL
          ** ✅ Icons only generated for APPROVED events (saves DALL-E costs)
          ** ✅ create-topic-icon-records.js uses config.js for .env loading
          ** ✅ Validation includes OCR text check, panel detection, downscale audit
          ** ✅ Max 6 attempts per icon before flagging for manual review

-----

     * Blocked/Broken: None known

-----

     * Next Steps:
          ** Run icon generation after scraping and approving new events
          ** Monitor for failed validations
```

WITH THIS:
```
# SESSION HANDOFFS - IMAGE GENERATION

     * QUICK START PROMPT:
          ** "I'm working on Event Finder image generation (DALL-E topic icons). Please read ConOp section: IMAGE GENERATION PROGRAM ARCHITECTURE. Key files are in icon-worker/src/. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ icon-worker/src/create-topic-icon-records.js
          ** ✅ icon-worker/src/generate-topic-icons.js
          ** ✅ icon-worker/src/rules.js
          ** ✅ icon-worker/src/policyEngine.js
          ** ✅ icon-worker/src/validators.js
          ** ✅ scrapers/enrich-events.js (for enrichment questions)
          ** ⚪ icon-worker/Image_Generation_Safety_Abstraction_Policy_v2.7.md (for policy questions)

-----

     * ConOp Sections to Emphasize:
          ** IMAGE GENERATION PROGRAM ARCHITECTURE
          ** KEY FOLDERS AND FILES (icon-worker/ section)
          ** ORGANIZATION WORKFLOW 6: IMAGE GENERATION
          ** GITHUB ACTIONS (generate-topic-icons.yml workflow)

-----

     * Technology Stack:
          ** OpenAI GPT-4o-mini for event enrichment (topics, regions, countries)
          ** OpenAI DALL·E 3 API for image generation
          ** Sharp library for image processing
          ** Tesseract.js for OCR text detection
          ** PocketBase topic_icons collection for storage

-----

     * Last Session: 2026-02-01
          ** ✅ Created generate-topic-icons.yml GitHub Action for full automation
          ** ✅ Added enrich-events.js to workflow (tags ALL events before icon generation)
          ** ✅ Successfully tested end-to-end: approved event → enrichment → icon generated

-----

     * Current Status: ✅ FULLY AUTOMATED
          ** ✅ Daily workflow at 12:00 AM EST (generate-topic-icons.yml)
          ** ✅ Enrichment runs on ALL events (GPT-4o-mini - cheap)
          ** ✅ Icons only generated for APPROVED events (DALL-E 3 - saves costs)
          ** ✅ Validation includes OCR text check, panel detection, downscale audit
          ** ✅ Max 6 attempts per icon before flagging for manual review

-----

     * Blocked/Broken: None

-----

     * Next Steps:
          ** Monitor daily workflow runs in GitHub Actions
          ** Review any failed icon generations in PocketBase topic_icons collection
          ** Consider visual style adjustments in rules.js/policyEngine.js if needed
```

────────────────────────────────────────────────────────────────────────────────
## UPDATE 9: Event-Based Discovery Section (Lines ~542, 575)
## LOCATION: # EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE section
────────────────────────────────────────────────────────────────────────────────

REPLACE THIS (Line ~542):
```
          ** After Enrichment: After running scrapers/enrich-events.js when embeddings are fresh
```

WITH THIS:
```
          ** After Enrichment: enrich-events.js now runs automatically daily via generate-topic-icons.yml
```

REPLACE THIS (Line ~575):
```
          ** enrich-events.js: Tags events with topics (enriched events improve embedding quality)
```

WITH THIS:
```
          ** enrich-events.js: Tags events with topics (AUTOMATED daily via generate-topic-icons.yml - enriched events improve embedding quality)
```

────────────────────────────────────────────────────────────────────────────────
## SUMMARY OF CHANGES
────────────────────────────────────────────────────────────────────────────────

1. ✅ Added generate-topic-icons.yml to Workflow Files Location list
2. ✅ Changed "Enrich Events (Optional)" to "Enrich Events (AUTOMATED)"
3. ✅ Updated "After Scraping: Image Generation" to reflect automation
4. ✅ Rewrote ORGANIZATION WORKFLOW 6: IMAGE GENERATION section
5. ✅ Added new workflow entry to GITHUB ACTIONS section
6. ✅ Updated Data Enrichment section in SCRIPTS
7. ✅ Updated Workflow section in IMAGE GENERATION PROGRAM ARCHITECTURE
8. ✅ Rewrote SESSION HANDOFFS - IMAGE GENERATION section
9. ✅ Updated Event-Based Discovery references to enrichment

────────────────────────────────────────────────────────────────────────────────
## VALIDATION DATE: 2026-02-01
────────────────────────────────────────────────────────────────────────────────
