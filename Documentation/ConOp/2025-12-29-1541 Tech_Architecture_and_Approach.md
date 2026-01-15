# DOCUMENT NAME:  2025-12-29_Tech_Architecture_and_Approach.md


---


# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 


---


# DOCUMENT PURPOSE: this document to bring a new Claude and/or ChatGPT session up to speed on the project.


---


# DOCUMENT FORMATTING GUIDELINES: 
     * Legend:
          "#" = Section Header (align left, Text in All Caps)
          "*" = Level 1 bullet (5 spaces from left + 1 asterisk)
          "**" = Level 2 bullet (10 spaces from left + 2 asterisks)
          "***" = Level 3 bullet (15 spaces from left + 3 asterisks)
          "****" = Level 4 bullet (20 spaces from left + 4 asterisks)
          "---" = Section Separator (align left, 2 line spaces before and after)

     * Formatting Example:
"# HEADER 
     * Level 1 Bullet:
          * Level 2 Bullet:
               * Level 3 Bullet:
                    * Level 4 Bullet:

---"

     * Other Rules:
          * No tables: Use bulleted lists to avoid formatting issues
          * Export as *.md
          * Retain formatting when generating a new version
          * Always read document before making updates to ensure updates are placed in the correct Section
          * No tables: Use bulleted lists to avoid formatting issues
          * Only update relevant sections.   


---


# PROJECT OVERVIEW
     * Event Finder aggregates public events from national security, defense, and intelligence community organizations into a single searchable database.

     * Project Phases:
          ** Phase 1: 
               *** Tool for personal and small-group use.  Not for profit
               *** All scrapers disabled awaiting permissions
               *** Seek permission from Organizations to scrape and use their data
               *** Make functional enhancement to the tool

          ** Phase 2: Determine business model (not for profit, ads, subscriptions, etc)

          ** Phase 3: Implement approach determined in Phase 2


---


# IMAGE GENERATION PROGRAM ARCHITECTURE

     * Purpose
          ** Generate safe, professional topic icons for event cards automatically
          ** Ensure visual consistency, safety, and policy compliance
          ** Support fully automated image generation with no human-in-the-loop

     * Image Output Requirements
          ** Output format: PNG
          ** Generation size: 1024×1024 px (master)
          ** Display size: 80×130 px (CSS background-image with background-size: cover)
          ** Single cohesive icon only (never a collage, never multi-panel)

     * Technology Stack
          ** OpenAI DALL·E 3 API for image generation
          ** Claude-written JavaScript code for automation
          ** PocketBase topic_icons collection for storage
          ** Sharp library for image processing
          ** Tesseract.js for OCR text detection

     * Folder Structure
          ** The icon generation system lives in its own subfolder: icon-worker/
          ** Has its own node_modules, package.json, and .env file (separate from root)
          ** Source code is in icon-worker/src/

     * Key Components (in icon-worker/src/)
          ** rules.js
               *** Defines TOPIC_STYLE (colors and motifs per topic)
               *** Defines REGION_STYLE (colors and motifs per region)
               *** Defines ORG_MOTIFS (visual elements for transnational organizations)
               *** Defines COUNTRY_FLAG_HINTS (text-free flag color descriptions)
               *** Contains CRITICAL_REQUIREMENTS_BLOCK (safety rules for every prompt)
               *** Contains COLLAGE_TRIGGER_WORDS (blocked terms)

          ** policyEngine.js
               *** preflightPromptChecks(): Blocks prompts containing collage trigger words
               *** deriveIconPlan(): Determines what geographic elements are allowed
               *** buildDalleIconPrompt(): Constructs the DALL·E prompt from topics, countries, regions, and orgs

          ** validators.js
               *** ocrDetectAnyText(): Rejects images containing any text/letters/numbers (uses Tesseract OCR)
               *** detectPanelDividers(): Rejects collage or multi-panel compositions
               *** downscaleAuditCover80x130(): Verifies legibility at small display size

          ** generate-topic-icons.js
               *** Main worker script that generates icons
               *** Fetches topic_icons records needing icons from PocketBase
               *** Calls DALL·E 3 API via policyEngine
               *** Validates each image with all three validators
               *** Retries up to maxAttempts with increasingly simplified prompts
               *** Uploads valid icons to PocketBase

          ** create-topic-icon-records.js
               *** Scans events collection for unique topic/region/country/org combinations
               *** Creates topic_icons records for each unique combination
               *** Does not generate images (that's done by generate-topic-icons.js)

          ** clear-icons.js
               *** Clears icon_file, prompt_used, and compliance_notes from topic_icons records
               *** Used to force regeneration of all icons

          ** cleanup-topic-combinations.js
               *** Removes trailing pipe characters from topic_combination field
               *** Fixes malformed combination keys

          ** config.js
               *** Loads environment variables from .env
               *** Provides getConfig() function with all settings

          ** pbClient.js
               *** PocketBase API helpers (login, fetch, upload, update)

          ** openaiImages.js
               *** OpenAI DALL·E 3 API wrapper for image generation

     * Critical Restrictions (Enforced in Every Prompt)
          ** No Text: Absolutely NO text, words, letters, numbers, labels, captions, watermarks, signatures, UI text, signage, or any readable glyphs
          ** US Politics Prohibition: NO US politicians (current or former), NO US political party symbols (no elephant, no donkey)
          ** Prohibited Official Marks: No official government seals or agency insignia (FBI, CIA, NSA, DHS, DoD, etc.), no specific military unit patches/badges/insignia
          ** Faces & People: No realistic human faces; human figures permitted only as abstract silhouettes with no identifiable features

     * Geography Rules
          ** If COUNTRIES is populated: Include country flag colors and/or country map silhouettes (text-free, neutral)
          ** If COUNTRIES is empty and REGIONS is populated: Include regional map silhouette ONLY (no flags or country maps)

     * Validation Pipeline (Mandatory Post-Checks)
          ** Step 1: OCR scan - reject if any letters/numbers detected
          ** Step 2: Panel divider detection - reject if collage/grid composition detected
          ** Step 3 (optional): Downscale audit - simulate 80×130 display and reject if illegible

     * Retry Logic
          ** Attempt 1: Standard prompt from policyEngine
          ** Attempt 2: Simplified to ONE bold shape filling the canvas
          ** Attempt 3: Maximum abstraction with pure geometric forms
          ** Attempt 4+: Extremely minimal with single gradient and subtle texture only
          ** Max attempts configurable via MAX_ATTEMPTS in .env (default: 6)

     * Workflow
          ** Step 1: cd to icon-worker folder
          ** Step 2: Run npm run scan to create topic_icons records for new combinations
          ** Step 3: Run npm run generate to generate icons for records missing icon_file
          ** Step 4: Icons are automatically uploaded to PocketBase and linked to events via topic_combination key

     * icon-worker .env Configuration
          ** POCKETBASE_URL: PocketBase server URL
          ** POCKETBASE_ADMIN_EMAIL: Admin login email
          ** POCKETBASE_ADMIN_PASSWORD: Admin login password
          ** OPENAI_API_KEY: OpenAI API key
          ** OPENAI_IMAGE_MODEL: dall-e-3
          ** MAX_ITEMS: Max records to process per run (default: 25)
          ** MAX_ATTEMPTS: Max retry attempts per icon (default: 6)
          ** ENABLE_DOWNSCALE_AUDIT: true/false for legibility check
          ** DOWNSCALE_MIN_FOREGROUND_RATIO: Min foreground pixel ratio (default: 0.03)
          ** DOWNSCALE_MIN_STDDEV: Min grayscale standard deviation (default: 18)

     * Update Cadence
          ** rules.js: Updated when visual rules, domains, or modifiers are refined
          ** policyEngine.js: Updated when prompt construction logic changes
          ** Policy version tracked in compliance_notes field of each topic_icon record


---


# TECH STACK
     * Vercel: 
          ** Hosts the public-facing UI
          ** Auto-deploys when changes are pushed to GitHub
          ** Live URL: https://event-finder-ui-one.vercel.app
          ** Connected to: github.com/mtaylorUSA/event-finder-backend

     * PocketBase: 
          ** Lightweight backend (auth, DB, file storage, realtime)
          ** Self‑host on Railway
          ** PocketBase Admin URL: https://event-discovery-backend-production.up.railway.app/_/
          ** API Rules: Public read access enabled for events and organizations

     * GitHub: 
          ** Single repo for all project files (scripts, UI, docs)
          ** Repo: github.com/mtaylorUSA/event-finder-backend
          ** CI integration with Vercel (auto-deploy) and Railway

     * Railway: Host PocketBase 

     * Bitwarden: Store API keys/secrets

     * My system (local Dev): 
          ** HP Envy x360
          ** Windows 11 Personal  
          ** Microsoft Office 365
          ** Powershell

     * My folder paths: 
          ** Local Project Folder: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL
          ** .env location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env
          ** Documentation: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\Documentation\
          ** Backup (created 2025-12-13): C:\LOCAL FILES\AI Stuff - LOCAL\Event-Finder-Backup-2025-12-13

     * AI Features
          ** OpenAI API 
          ** text-embedding-3-small, gpt-4o-mini
          ** DALL·E 3 for topic icon generation

     * Scripts 
          ** Node.js 
          ** Local + GitHub

     * Version Control 
          ** Git + GitHub 
          ** github.com/mtaylorUSA/event-finder-backend

     * Admin Interface 
          ** admin-interface.html 

     * Public UI 
          ** index.html (deployed to Vercel)
          ** event-finder-ui-v7.html (development version)

     * FUTURE: Email with customers (TBD): 
          ** Resend (easy on Vercel) or 
          ** Mailgun/SendGrid (free tiers exist)

     * FUTURE: Payments (TBD): 
          ** Lemon Squeezy or 
          ** Stripe (subscriptions)


---


# VERCEL DEPLOYMENT

     * Live Site
          ** URL: https://event-finder-ui-one.vercel.app
          ** Status: ✅ Active and working
          ** Environment: Production

     * How It Works
          ** Vercel is connected to GitHub repo: mtaylorUSA/event-finder-backend
          ** When you push changes to GitHub, Vercel automatically redeploys
          ** Deployment typically takes 5-10 seconds

     * Key File
          ** index.html in the repo root is what Vercel serves
          ** This file is a copy of event-finder-ui-v7.html

     * How to Update the Public UI
          ** 1. Make changes to index.html (or update event-finder-ui-v7.html and copy to index.html)
          ** 2. git add -A
          ** 3. git commit -m "Update UI"
          ** 4. git push
          ** 5. Vercel automatically deploys (wait ~10 seconds)
          ** 6. Verify at https://event-finder-ui-one.vercel.app

     * Vercel Admin Access
          ** URL: https://vercel.com
          ** Login with GitHub account
          ** Project name: event-finder-ui

     * Architecture Diagram
          ** GitHub Repo (event-finder-backend)
          **      │
          **      ├──► Vercel (auto-deploys index.html)
          **      │         │
          **      │         ▼
          **      │    https://event-finder-ui-one.vercel.app
          **      │
          **      └──► Your LOCAL folder (development)


---


# PUBLIC UI FEATURES
     * Header
          ** Event Finder logo/title (click to clear filters and go home)
          ** Search bar beside logo (searches title and description only)

     * Sidebar Filters
          ** Event Format: Virtual / In-Person checkboxes
          ** Location filter: Appears when In-Person is checked (within X miles of ZIP)
          ** Date Range: Start date (defaults to today), End date (optional)
          ** View Results: button (🔍)
          ** More Filters: button (Topics, Regions, Organizations)
          ** Clear Filters: button (🚫)

     * Event Cards Display
          ** Title: Event name
          ** Description: 2 lines max, pulled from database
          ** Dates: Full month format (e.g., "December 18, 2025" or "December 9-10, 2025")
          ** Organization: Linked to org website
          ** Location: City, ST format (extracts from title if location field is bad)
          ** Link: "More details and registration" (links to event page)

     * Search Behavior
          ** Searches: title and description only (not org name, topics, regions, location)
          ** Short terms (3 chars or less like "AI") use word boundary matching to avoid false positives
          ** Multi-word searches use "OR" logic (any word can match)
               *** Example: "AI Cyber" returns events matching "AI" OR "Cyber"

     * Date Display Logic  (Scenario | Format)
          ** Single day | December 18, 2025
          ** Multi-day, same month | December 9-10, 2025
          ** Multi-day, different months | December 30, 2025 to January 2, 2026
          ** Multi-day, different years | December 30, 2025 to January 2, 2026

     * Views
          ** "List View:" Event cards (default)
          ** "Calendar View:" Monthly calendar with events


---


# ORGANIZATION WORKFLOW
     * "Organization Discovery": Finding organizations to scrape
          ** Automatic Discovery (AI)
               *** Run `suggest-organizations.js`
               *** AI analyzes existing approved organizations
               *** AI suggests similar organizations in national security space
               *** New orgs saved with status: `Pending Mission Review`

          ** Manual Discovery
               *** Open PocketBase Admin or `admin-interface.html`
               *** click "Add Organization"
               *** Enter organization details
               *** Set status: `Pending Mission Review`
               *** Save

     * Mission Review
          ** Open "Pending Review" tab in admin interface
          ** For each organization:
               *** Review website and mission
               *** Check if fits national security focus
               *** Check TOU flag (⚠️) if present

     * Decision:
          ** ❌ "Reject": Status → `Mission Rejected`: Does not fit project mission	
          ** ✅ "Approve": Status → `Mission Approved Pending Permission`: Fits mission, needs permission

     * Permission Management: Getting official permission to scrape
          ** `Mission Approved Pending Permission`
               *** Add POC Contacts.  For each approved organization:
                    **** 1. Research POC contact info:
                         ***** Check website footer, "Contact Us" page
                         ***** Look for permissions, legal, events emails
                         ***** Find staff directory for relevant contacts

                    **** 2. Add contact via admin interface or `add-contacts.js`

                    **** 3. Contact types:
                         ***** `Legal/Permissions`: Best for permission requests
                         ***** `Events`: Alternative contact
                         ***** `Media/PR`: Fallback option
                         ***** `Leadership`: Last resort
                         ***** `Other`: General inquiries

              *** Generate Permission Request Drafts
                    **** 1. Run `generate-permission-requests.js`
                    **** 2. Script automatically:
                         ***** Pulls your info from `settings` collection
                         ***** Finds best contact for each org (Legal/Permissions → Events → Other)
                         ***** Generates customized email draft
                         ***** Saves to `permission_request_draft` field

              *** Review and Send Permission Requests
                    **** 1. Open PocketBase Admin
                    **** 2. Go to organizations collection
                    **** 3. Filter by status: `Mission Approved Pending Permission`
                    **** 4. For each organization:
                         ***** Open record
                         ***** Review `permission_request_draft` field
                         ***** Copy draft to email client
                         ***** Edit if needed
                         ***** Send email

              *** After sending:
                    **** 1. Update status 
                         ***** `Permission Requested (Self)`: Owner sent email.  or 
                         ***** `Permission Requested (Lawyer)`: Lawyer sent email
                         ***** Set `permission_requested_date` to today

          ** `Permission Granted` - Ready to enable scraping
              *** If Permission Granted:
                         ***** 1. Paste approval email into `permission_correspondence` field
                         ***** 2. Update status → `Permission Granted`
                         ***** 3. Set `permission_response_date` to today
                         ***** 4. Set `scraping_enabled`: true
                         ***** 5. Update status → `Scraping Active`

          ** `Permission Rejected` - Organization denied permission

              *** If Permission Rejected:
                         ***** 1. Paste rejection email into `permission_correspondence` field
                         ***** 2. Update status → `Permission Rejected`
                         ***** 3. Set `permission_response_date` to today

          ** If No Response (after 2 weeks):
                         ***** 1. Send follow-up email
                         ***** 2. Add note to `permission_correspondence` field


          ** `Scraping Active` - Currently being scraped


---


# STATUS REFERENCE
     * Status: Pending Mission Review
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: Review and approve/reject

     * Status: Mission Approved Pending Permission
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: Send permission request

      * Status: Mission Rejected
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: None (end state) 

     * Status: Permission Requested (Self)
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: Wait for response

     * Status: Permission Requested (Lawyer)
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: Wait for response

     * Status: Permission Granted
          ** Can Edit?: YES
          ** Can Scrape?: YES
          ** Shows in UI?: YES
          ** Next Action: Enable scraping 

     * Status: Permission Rejected
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in UI?: NO
          ** Next Action: None (end state)

     * Status: Scraping Active
          ** Can Edit?: YES
          ** Can Scrape?: YES
          ** Shows in UI?: YES
          ** Next Action: Monitor and maintain

      * Events from approved organizations appear in the public UI after scraping.


---


# EVENT SCRAPING
     * Enable Scraping
          ** Prerequisites:
              *** Status: `Permission Granted` or `Scraping Active`
              *** `scraping_enabled`: true
              *** `events_url` is set

     * Run Scrapers
          ** Option A: Scrape All Enabled Organizations
              *** powershell
              *** node scrape-all-organizations.js

          ** Option B: Scrape Specific Organization
              *** powershell
              *** node scrape-cfr-events.js
              *** node scrape-cisa-events.js
              *** node scrape-insa-events.js

     * Scraper Behavior
          ** 1. Fetches events page from `events_url`
          ** 2. Parses event data (title, date, time, location, URL)
          ** 3. Checks for duplicates by `source_id`
          ** 4. Saves new events to `events` collection
          ** 5. Updates `last_scraped` timestamp on organization

     * Enrich Events (Optional)
          ** After scraping, run AI enrichment:
              *** powershell
              *** node enrich-events.js

          ** This adds:
              *** Topic tags
              *** Event type classification
              *** Speaker extraction

     * Generate Embeddings (Optional)
          ** For semantic search:
              *** powershell
              *** node generate-embeddings.js
              *** This creates vector embeddings for event search.

     * After Scraping: Verify in Public UI
          ** 1. Open https://event-finder-ui-one.vercel.app in browser
          ** 2. Refresh the page to load new data from PocketBase
          ** 3. Verify new events appear correctly
          ** 4. Check that dates, locations, and descriptions display properly


---


# PUBLIC UI

     * The public-facing interface is hosted at https://event-finder-ui-one.vercel.app

     * Accessing the UI
          ** 1. Go to https://event-finder-ui-one.vercel.app in any browser
          ** 2. UI automatically fetches data from PocketBase API
          ** 3. No login required for viewing events

     * UI Features
          ** Search:  Searches event title and description only 
          ** Date Filter: Start date defaults to today; end date optional
          ** Format Filter: Virtual / In-Person checkboxes 
          ** More Filters: Topics, Regions, Organizations
          ** List View: Event cards with details
          ** Calendar View: Monthly calendar display

     * How Data Flows to the UI
          ** PocketBase Database --> API Request --> Vercel (index.html) --> User sees events

     * What Users See on Event Cards
          ** Title: Event name 
          ** Description: 2 lines max 
          ** Dates: Full month format (e.g., "December 18, 2025") 
          ** Organization: Name with link to website
          ** Location: City, ST or "Virtual" or "Hybrid" 
          ** Link:  "More details and registration"

     * Date Display Formats (Scenario | Display)
          ** Single day | December 18, 2025
          ** Multi-day, same month | December 9-10, 2025
          ** Different months | December 30, 2025 to January 2, 2026

     * Search Behavior
          ** Searches title and description only
          ** Does NOT search organization name, topics, or location
          ** Short terms (≤3 chars like "AI") use word boundary matching
          ** Multi-word searches use OR logic (any word can match)
          ** Example: "AI Cyber" returns events matching "AI" OR "Cyber"


     * Updating Event Data for the UI:  To update how an event appears in the public UI:
          ** 1. Open PocketBase Admin
          ** 2. Click on `events` collection
          ** 3. Find and click on the event
          ** 4. Update fields:
              *** `description` - What users see (2 lines max)
              *** `start_date` / `end_date` - For date display
              *** `location` - City, ST format preferred
          ** 5. Click "Save"
          ** 6. Refresh https://event-finder-ui-one.vercel.app to see changes


---


# MAINTENANCE TASKS
     * Cleanup Orphaned Events

     * Remove events whose organization was deleted:
          ** powershell node cleanup-orphaned-events.js

     * Cleanup Bad Events
          ** Remove events with missing required fields:
               *** powershell node cleanup-bad-events.js


---


# QUICK REFERENCE / COMMON TASKS
     * Add a New Organization
          ** 1. Admin interface → "Add Organization"
          ** 2. Fill in details, set status: `Pending Mission Review`
          ** 3. Save

     * Approve an Organization
          ** 1. Admin interface → "Pending Review" tab
          ** 2. Click "✅ Approve Mission"
          ** 3. Status changes to `Mission Approved Pending Permission`

     * Send Permission Request
          ** 1. Run `generate-permission-requests.js`
          ** 2. Open org in PocketBase
          ** 3. Copy `permission_request_draft`
          ** 4. Send email
          ** 5. Update status to `Permission Requested (Self)`

     * Enable Scraping After Approval
          ** 1. Open org in PocketBase
          ** 2. Set `scraping_enabled`: true
          ** 3. Set status: `Scraping Active`
          ** 4. Run `node scrape-all-organizations.js`
          ** 5. Refresh https://event-finder-ui-one.vercel.app to verify events appear

     * Check Scraping Results
          ** 1. Admin interface → "Events" tab
          ** 2. Filter by organization
          ** 3. Review scraped events
          ** 4. Open https://event-finder-ui-one.vercel.app to verify public display

     * Update an Event's Public Display
          ** 1. Open PocketBase Admin → `events` collection
          ** 2. Click on the event to edit
          ** 3. Update `description`, `start_date`, `end_date`, or `location`
          ** 4. Click "Save"
          ** 5. Refresh https://event-finder-ui-one.vercel.app to see changes

     * Update the Public UI (index.html)
          ** 1. Edit index.html in your local project folder
          ** 2. git add -A
          ** 3. git commit -m "Update UI"
          ** 4. git push
          ** 5. Vercel auto-deploys in ~10 seconds
          ** 6. Verify at https://event-finder-ui-one.vercel.app

     * Generate Topic Icons
          ** 1. Open PowerShell and navigate to the icon-worker folder:
               *** cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker"
          ** 2. Run npm run scan to create records for new topic combinations
          ** 3. Run npm run generate to generate icons for records missing images
          ** 4. Icons are automatically uploaded to PocketBase topic_icons collection

     * Clear and Regenerate All Icons
          ** 1. cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker"
          ** 2. Run npm run clear to remove all existing icons
          ** 3. Run npm run generate to regenerate all icons


---


# SCRIPTS

     * Permission & Organization Management
          ** generate-permission-requests.js
               *** Auto-generate permission request email drafts
          ** add-contacts.js
               *** Add POC contacts to database
          ** suggest-organizations.js
               *** AI suggests new organizations based on existing approved ones

     * Scrapers
          ** scrape-all-organizations.js
               *** Master scraper that runs all enabled organization scrapers
          ** scrape-cfr-events.js
               *** Scrapes events from Council on Foreign Relations (CFR)
          ** scrape-cisa-events.js
               *** Scrapes events from CISA (Cybersecurity and Infrastructure Security Agency)
          ** scrape-insa-events.js
               *** Scrapes events from INSA (Intelligence and National Security Alliance)
          ** base-scraper.js
               *** Template/base code for creating new scrapers

     * Data Enrichment
          ** enrich-events.js
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.)
          ** generate-embeddings.js
               *** Creates AI embeddings for semantic search functionality

     * Topic Management (Root Level)
          ** update-event-topics.js
               *** Updates events collection to use new topic names
               *** Maps old names to new names (e.g., "Defense Policy" → "Defense Policy & Intelligence")
               *** Removes duplicates after mapping
          ** update-topic-icons.js
               *** Updates topic_icons collection to use new topic names
               *** Updates topic_combination field with new naming convention

     * Image Generation (icon-worker/src/)
          ** generate-topic-icons.js
               *** Main worker script for icon generation
               *** Fetches topic_icons records that are missing icon_file
               *** Builds prompts via policyEngine.js
               *** Calls DALL·E 3 API to generate images
               *** Validates images (OCR, panel detection, downscale audit)
               *** Retries with simplified prompts if validation fails
               *** Uploads valid icons to PocketBase
          ** create-topic-icon-records.js
               *** Scans events collection for unique topic/region/country/org combinations
               *** Creates topic_icons records for each unique combination
               *** Does not generate images (that's done by generate-topic-icons.js)
          ** clear-icons.js
               *** Clears icon_file, prompt_used, and compliance_notes from all topic_icons records
               *** Used to force regeneration of all icons
          ** cleanup-topic-combinations.js
               *** Removes trailing pipe characters from topic_combination field
               *** Fixes malformed combination keys

     * Image Generation Support Modules (icon-worker/src/)
          ** rules.js
               *** Defines visual rules: TOPIC_STYLE, REGION_STYLE, ORG_MOTIFS, COUNTRY_FLAG_HINTS
               *** Contains CRITICAL_REQUIREMENTS_BLOCK and COLLAGE_TRIGGER_WORDS
          ** policyEngine.js
               *** preflightPromptChecks(): Validates prompts before sending to DALL·E
               *** deriveIconPlan(): Determines allowed geographic elements
               *** buildDalleIconPrompt(): Constructs the final prompt
          ** validators.js
               *** ocrDetectAnyText(): OCR scan to reject images with text (uses Tesseract)
               *** detectPanelDividers(): Rejects collage/multi-panel compositions
               *** downscaleAuditCover80x130(): Verifies legibility at small size
          ** config.js
               *** Loads environment variables and configuration settings
          ** pbClient.js
               *** PocketBase API helpers (login, fetch, upload, update)
          ** openaiImages.js
               *** OpenAI DALL·E 3 API wrapper for image generation

     * Setup Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure
               *** Creates icon-worker/ and icon-worker/src/ directories
               *** Generates template .env file with placeholders
               *** Displays instructions for copying files and installing dependencies

     * Cleanup
          ** cleanup-orphaned-events.js
               *** Removes events that no longer have a valid parent organization
          ** cleanup-bad-events.js
               *** Removes malformed or invalid event records from the database

     * Utilities
          ** proxy-server.js
               *** Local proxy server to handle CORS issues when testing scrapers locally


---


# KEY FOLDERS AND FILES
     * Folders (Root Level)
          ** .git
               *** Git version control data. 
               *** Tracks all changes to your project. 
               *** Never edit manually
          ** .github 
               *** GitHub automation workflows. 
               *** Contains workflows/scrape-events.yml for scheduled tasks.
          ** Documentation
               *** All project documentation, prompts, workflows, and reference materials.
               *** Subfolders for different doc categories (Business and Market Analysis, Legal and Policy Docs, etc.)
          ** Event-Finder-Backup-2025-12-13
               *** Backup copy of project files
          ** icon-worker
               *** Separate subfolder for image generation system
               *** Has its own node_modules, package.json, and .env
               *** See "icon-worker Folder" section below for contents
          ** node_modules
               *** Installed JavaScript dependencies for root project. 
               *** Auto-generated by npm install. Never edit manually.

     * Configuration Files (Root Level)
          ** .env 
               *** Secret credentials (PocketBase URL, admin email/password, OpenAI API key). 
               *** NEVER commit to GitHub. 
               *** Each computer needs its own copy.
          ** .gitignore 
               *** Tells Git which files to ignore (like .env and node_modules).
          ** package.json
               *** Lists project dependencies and metadata. 
               *** Used by npm install.
          ** package-lock.json 
               *** Locks exact versions of dependencies. 
               *** Auto-generated.

     * User Interface Files (Root Level)
          ** index.html
               *** The file Vercel serves to the public.
               *** Copy of event-finder-ui-v7.html.
               *** Deployed at https://event-finder-ui-one.vercel.app
          ** event-finder-ui-v7.html 
               *** Development version of the public UI.
               *** Copy to index.html when ready to deploy.
          ** admin-interface.html 
               *** Admin dashboard for managing organizations, contacts, and events. 
               *** Internal use only.

     * Scraper Scripts (Root Level)
          ** scrape-all-organizations.js 
               *** Master scraper that runs all enabled organization scrapers.
          ** scrape-cfr-events.js 
               *** Scrapes events from Council on Foreign Relations (CFR).
          ** scrape-cisa-events.js 
               *** Scrapes events from CISA (Cybersecurity and Infrastructure Security Agency).
          ** scrape-insa-events.js 
               *** Scrapes events from INSA (Intelligence and National Security Alliance).
          ** base-scraper.js 
               *** Template/base code for creating new scrapers. Other scrapers inherit from this.

     * Data Enrichment Scripts (Root Level)
          ** enrich-events.js 
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.).
          ** generate-embeddings.js 
               *** Creates AI embeddings for semantic search functionality.

     * Topic Management Scripts (Root Level)
          ** update-event-topics.js
               *** Updates events collection to use new topic names.
          ** update-topic-icons.js
               *** Updates topic_icons records to use new topic names.

     * Organization Management Scripts (Root Level)
          ** suggest-organizations.js 
               *** Uses AI to suggest new organizations to add based on existing approved ones.
          ** add-contacts.js 
               *** Adds POC (point of contact) records to the database.
          ** generate-permission-requests.js 
               *** Auto-generates permission request email drafts for each organization.

     * Cleanup Scripts (Root Level)
          ** cleanup-bad-events.js 
               *** Removes malformed or invalid event records from the database.
          ** cleanup-orphaned-events.js 
               *** Removes events that no longer have a valid parent organization.

     * Setup and Utility Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure.
          ** proxy-server.js 
               *** Local proxy server to handle CORS issues when testing scrapers locally.

     * icon-worker Folder
          ** icon-worker/ (root files)
               *** node_modules/ - Separate dependencies for image generation
               *** src/ - Source code folder (see below)
               *** .env - Separate credentials file for icon-worker (copy from root or create new)
               *** .env.example - Template showing required environment variables
               *** eng.traineddata - Tesseract OCR training data for English text detection (binary)
               *** Image_Generation_Safety_Abstraction_Policy_v2.7.md - Policy document
               *** package.json - Dependencies: sharp, tesseract.js, dotenv, node-fetch
               *** package-lock.json - Locked dependency versions
               *** README.md - Setup and usage instructions

          ** icon-worker/src/ (source code)
               *** generate-topic-icons.js - Main worker script
               *** create-topic-icon-records.js - Creates records for new combinations
               *** clear-icons.js - Clears icons to force regeneration
               *** cleanup-topic-combinations.js - Fixes malformed combination keys
               *** rules.js - Visual rules (TOPIC_STYLE, REGION_STYLE, etc.)
               *** policyEngine.js - Prompt construction logic
               *** validators.js - OCR, panel detection, downscale audit
               *** config.js - Environment variable loader
               *** pbClient.js - PocketBase API helpers
               *** openaiImages.js - DALL·E 3 API wrapper


---


# GITHUB ACTIONS
     * Workflow: Scrape Events Daily
          ** File: .github/workflows/scrape-events.yml
          ** Status: DISABLED (as of 2025-11-20)
          ** Reason: Awaiting permissions from organizations
          ** When enabled: Runs daily at 8:45 AM EST

     * How to Re-enable
          ** 1. Go to https://github.com/mtaylorUSA/event-finder-backend/actions
          ** 2. Click "Scrape Events Daily" in left sidebar
          ** 3. Click "Enable workflow" button

     * Required GitHub Secrets
          ** POCKETBASE_URL: PocketBase server URL
          ** POCKETBASE_ADMIN_EMAIL: Admin login email
          ** POCKETBASE_ADMIN_PASSWORD: Admin login password
          ** OPENAI_API_KEY: OpenAI API key


---


# MULTI-COMPUTER WORKFLOW
     * Architecture Overview
          ** Source of Truth: GitHub (github.com/mtaylorUSA/event-finder-backend)
          ** Secrets Storage: Bitwarden (encrypted vault)
          ** Local Work: Each computer has its own copy of the project
          ** Public Site: Vercel auto-deploys from GitHub

     * Required Applications (install on each computer)
          ** Git: Version control, syncs with GitHub
          ** Node.js: Runs JavaScript scripts
          ** Bitwarden: Access to secrets/API keys

     * Required Local Files (create on each computer)
          ** .env file: Contains secrets copied from Bitwarden
               *** POCKETBASE_URL
               *** POCKETBASE_ADMIN_EMAIL
               *** POCKETBASE_ADMIN_PASSWORD
               *** OPENAI_API_KEY

     * Setting Up a New Computer
          ** 1. Install Git, Node.js, Bitwarden
          ** 2. Create folder: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL
          ** 3. Clone from GitHub: git clone https://github.com/mtaylorUSA/event-finder-backend.git .
          ** 4. Create .env file with secrets from Bitwarden
          ** 5. Run: npm install

     * Before Stopping Work (on current computer)
          ** 1. git add -A
          ** 2. git commit -m "describe what you did"
          ** 3. git push
          ** 4. Vercel automatically deploys any UI changes

     * Before Starting Work (on different computer)
          ** 1. Open PowerShell
          ** 2. cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL"
          ** 3. git pull

     * Security Reminders
          ** ❌ NEVER commit .env to GitHub
          ** ❌ NEVER share API keys in chat, email, or cloud storage
          ** ✅ ALWAYS use Bitwarden for secrets
          ** ✅ ALWAYS verify .env doesn't appear in git status


---


# KEY URLS REFERENCE
     * Public UI: https://event-finder-ui-one.vercel.app
     * PocketBase Admin: https://event-discovery-backend-production.up.railway.app/_/
     * GitHub Repo: https://github.com/mtaylorUSA/event-finder-backend
     * GitHub Actions: https://github.com/mtaylorUSA/event-finder-backend/actions
     * Vercel Dashboard: https://vercel.com (login with GitHub)


---


# PocketBase Collections and Values

     * contacts Collection - Stores POC contacts for organizations.

          ** Field Name: name
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 200
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Contact name or team name

          ** Field Name: email
          ** Field Type (text box): Email
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: on  
          ** Field Purpose/Notes:  Contact email

          ** Field Name: title
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 200
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Job title

          ** Field Name: phone
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Contact phone

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → organizations
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: false
          ** Setting - Nonempty: off 
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Linked organization

          ** Field Name: contact_type
          ** Field Type: Select
          ** Setting - Content (text box, comma separated): Leadership, Events, Legal/Permissions, Media/PR, Other
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on  
          ** Field Purpose/Notes: The role of the POC 

          ** Field Name: source_url 
          ** Field Type: URL 
          ** Setting - Except domains: BLANK 
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Where contact info was found

          ** Field Name: last_verified
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When info was last verified

          ** Field Name: notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Additional notes

          ** Current Status of contacts as of 2025-12-07
               *** Tier 1 - Permissions Contacts:
                    **** CFR: permissions@cfr.org
                    **** RAND: permissions@rand.org
                    **** Brookings: permissions@brookings.edu, events@brookings.edu
                    **** CSIS: externalrelations@csis.org
                    **** AEI: Jacqueline Derks (Director of Events)

               *** Tier 2 - General Contacts:
                    **** INSA: info@insaonline.org
                    **** New America: media@newamerica.org
                    **** Atlantic Council: press@atlanticcouncil.org
                    **** Hoover: heather.campbell@stanford.edu
                    **** Chatham House: contact@chathamhouse.org


     * event_embeddings Collection - Stores AI embeddings for semantic search.
          ** Field Name: event
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → events
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: true
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Linked event

          ** Field Name: embedding 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): 50000
          ** Setting - Nonempty: on
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: OpenAI embedding vector

          ** Field Name: model
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Model used (text-embedding-3-small)

          ** Current Status of event_embeddings as of 2025-12-07
               *** 40 AI embeddings for semantic search


     * events Collection - Stores scraped event data.
          ** Field Name: title
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Event title
          ** UI Display: ✅ Displayed, searchable

          ** Field Name: description
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event description
          ** UI Display: ✅ Displayed (2 lines max), searchable

          ** Field Name: start_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Event start date
          ** UI Display: ✅ Used for date display and filtering

          ** Field Name: end_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Event end date
          ** UI Display: ✅ Used for multi-day date display

          ** Field Name: url 
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Link to event page
          ** UI Display: ✅ Used for "More details and registration" link

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → organizations
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: false
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Source organization
          ** UI Display: ✅ Displayed with link to website

          ** Field Name: start_time
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event start time
          ** UI Display: ❌ Stored but NOT displayed

          ** Field Name: end_time
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event end time
          ** UI Display: ❌ Stored but NOT displayed

          ** Field Name (text box): source_id
          ** Field Type (text box): Plain Text
          ** Setting - min length (text box): BLANK
          ** Setting - max length (text box): 500
          ** Setting - Regex pattern (text box): BLANK
          ** Setting - nonempty (toggle): on
          ** Setting - Presentable (toggle): off
          ** UI Display: ❌ Internal use only

          ** Field Name (text box): event_type
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Virtual, In-person, Hybrid
          ** Setting - Single/multiple (picklist): Single
          ** Max select (text box): BLANK
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off 
          ** UI Display: ✅ Used for Virtual/In-Person filtering

          ** Field Name: registration_required
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off

          ** Field Name: cost
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off

          ** Field Name: target_audience
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 200
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off

          ** Field Name: start_time
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off

          ** Field Name: end_time
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off

          ** Field Name: timezone
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off

          ** Field Name: topics
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Cybersecurity, Defense Policy & Intelligence, Nuclear & WMD, Space & Satellites, AI & Emerging Technology, Terrorism & Counterterrorism, Military & Conflict, Homeland Security, Environment & Climate, Economic Security, Diplomacy & Statecraft, Humanitarian & Societal, Careers & Professional Development, Government Business & Modernization 
          ** Setting - Single/multiple (picklist): Multiple
          ** Max select: 13 
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on

          ** Field Name (text box): regions
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Africa, Arctic, Domestic US, Europe/Eurasia, East and Southeast Asia, Global/Multilateral, South, Pacific and Oceania, Latin America, Middle East, South Asia
          ** Setting - Single/multiple (picklist): Multiple
          ** If Multple: Max select (text box): 10
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off
          ** UI Display: ✅ Used in More Filters

          ** Field Name (text box): icon
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): topic-icons
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete (toggle): false
          ** Setting - Nonempty (toggle): off 
          ** Setting - Presentable (toggle): off 

          ** Field Name (text box): Countries
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Brunei, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Cape Verde, Central African Republic, Chad, Chile, China, Colombia, Comoros, Costa Rica, Croatia, Cuba, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Djibouti, Dominica, Dominican Republic, East Timor, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia, Fiji, Finland, France, Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Ivory Coast, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, New Zealand, Nicaragua, Niger, Nigeria, North Korea, North Macedonia, Norway, Oman, Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Republic of the Congo, Romania, Russia, Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, San Marino, Sao Tome and Principe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Sweden, Switzerland, Syria, Taiwan, Tajikistan, Tanzania, Thailand, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe
          ** Setting - Single/multiple (picklist): Multiple
          ** Setting - Max select (text box): 196
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off


          ** Field Name (text box): transnational_orgs
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): African Union, ANZUS, APEC, Arab League, ASEAN, AUKUS, BRICS, Caribbean Community, Commonwealth of Nations, European Union, Five Eyes, G7, G20, Gulf Cooperation Council, International Atomic Energy Agency, International Criminal Court, Interpol, NATO, OECD, OPEC, Organization of American States, Pacific Islands Forum, Quad, Shanghai Cooperation Organisation, United Nations, World Bank, World Health Organization, World Trade Organization
          ** Setting - Single/multiple (picklist): Multiple
          ** Setting - Max select (text box): 28
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off  

          ** Field Name: location  >>>THIS IS NOT IN THE EVENTS COLLECTION <<<
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event location
          ** UI Display: ✅ Displayed (City, ST format preferred)

          ** Field Name: registration_url   >>>THIS IS NOT IN THE DATABASE <<<
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Registration link
          ** UI Display: ✅ Used if available, else `url` is used 

          ** Field Name: speakers   >>>THIS IS NOT IN THE EVENTS COLLECTION <<<
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Speaker names
          ** UI Display: ❌ Not currently displayed

          ** Field Name: raw_data   >>>THIS IS NOT IN THE EVENTS COLLECTION <<<
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Original scraped data
          ** UI Display: ❌ Internal use only

          ** Field Name: created
          ** Field Type: Autodate
          ** Setting - On create: on
          ** Setting - On update: off
          ** Field Purpose/Notes: When record was created (auto-generated by PocketBase)
          ** UI Display: ❌ Internal use only

          ** Field Name: updated
          ** Field Type: Autodate
          ** Setting - On create: off
          ** Setting - On update: on
          ** Field Purpose/Notes: When record was updated (auto-generated by PocketBase)
          ** UI Display: ❌ Internal use only


          ** Current Status of events as of 2025-12-07          
               *** 45 Scraped event data 


     * image_generation_errors Collection - Logs failed icon generation attempts for debugging and improvement.

          ** Field Name: topic_icon_id
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → topic_icons
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: true
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Links to the topic_icon record that failed

          ** Field Name: topic_combination
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: The combination key (duplicated for easy lookup without joins)

          ** Field Name: error_type
          ** Field Type: Select
          ** Setting - Choices: ocr_text_detected, panel_dividers_detected, downscale_failed, api_error, max_attempts_exceeded
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Category of failure for pattern analysis

          ** Field Name: error_message
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Detailed error description

          ** Field Name: attempt_number
          ** Field Type: Number
          ** Setting - Min: 1
          ** Setting - Max: 10
          ** Setting - Nonzero: on
          ** Setting - Presentable: off
          ** Setting - No decimals: on
          ** Field Purpose/Notes: Which attempt failed (1-6 typically)

          ** Field Name: prompt_used
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: The DALL·E prompt that was used (for debugging)

          ** Field Name: resolved
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if error has been addressed (rules.js updated, icon regenerated successfully)

          ** Field Name: created
          ** Field Type: Autodate
          ** Setting - On create: on
          ** Setting - On update: off
          ** Field Purpose/Notes: When error was logged


     * organizations Collection - Stores all organizations (approved, pending, rejected) with unified status workflow.
          ** Field Name: name
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 255
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose: Organization name

          ** Field Name: website 
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Required field, Main website

          ** Field Name: description
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 1000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose: Organization description

          ** Field Name: permission_response_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: When response was received

          ** Field Name: notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Admin notes

          ** Field Name: org_type
          ** Field Type: Plain Text 
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: on
          ** Field Purpose: Type: Government, Nonprofit, Think Tank, Academic, Professional Association

          ** Field Name:  events_url 
          ** Field Type: URL 
          ** Setting - Except domains: BLANK 
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Direct link to events page

          ** Field Name: permission_requested_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When permission was requested





          **  Field Name: source_id
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: Blank
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Unique domain identifier (e.g., "csis.org")

          ** Field Name: status
          ** Field Type: Select
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: on  
          ** Setting - Presentable: on  
          ** Field Purpose/Notes: Current workflow status (see below)

          ** Field Name: discovered_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When AI suggested this org

          ** Field Name: ai_reasoning
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern:
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Why AI suggested this org

          ** Field Name: similarity_score 
          ** Field Type: Number 
          ** Setting - Min: 0
          ** Setting - Max: 100
          ** Setting - Nonzero: off 
          ** Setting - Presentable: off 
          ** Setting - No decimals: off 
          ** Field Purpose/Notes: AI confidence score

          ** Field Name: tou_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if TOU may prohibit scraping

          ** Field Name: tou_notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Notes about Terms of Use

          ** Field Name: permission_request_draft
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Auto-generated email draft

          ** Field Name: permission_correspondence
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 1000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Approval email thread

          ** Field Name (text box): permission_document 
          ** Field Type: File
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Allowed mime types (picklist): BLANK (no restriction)
          ** Setting - Choose presets (picklist):  BLANK
          ** Setting - thumb sizes (text box): BLANK
          ** Setting - Max file size (text box): 10485760
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off  
          ** Setting - Protected (toggle): off

          ** Field Name: scraping_enabled
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Whether scraper should run

          ** Field Name: last_scraped
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Last successful scrape



          ** Status Field Values (8-stage lifecycle):
               *** Pending Mission Review: AI-suggested, awaiting admin review
               *** Mission Approved Pending Permission: Approved for mission, needs permission request
               *** Mission Rejected: Does not fit project mission
               *** Permission Requested (Self): Email sent by owner
               *** Permission Requested (Lawyer): Email sent by lawyer
               *** Permission Granted: Permission received, ready to scrape
               *** Permission Rejected: Organization denied permission
               *** Scraping Active: Actively being scraped
 
          ** Current Status of organizations as of 2025-12-07
               *** Status: Mission Approved Pending Permission (18):
                    **** American Enterprise Institute (AEI)
                    **** Atlantic Council
                    **** Belfer Center (Harvard)
                    **** Brookings Institution
                    **** Center for a New American Security (CNAS)
                    **** Center for Strategic and International Studies (CSIS)
                    **** Chatham House
                    **** Council on Foreign Relations (CFR)
                    **** Cyber Threat Alliance
                    **** CISA (Cybersecurity and Infrastructure Security Agency)
                    **** Hoover Institution
                    **** IISS (International Institute for Strategic Studies)
                    **** INSA (Intelligence and National Security Alliance)
                    **** INSS (Institute for National Security Studies)
                    **** New America
                    **** Potomac Officers Club
                    **** RAND Corporation
                    **** Stimson Center

               *** Status: Mission Rejected (3):
                    **** National Guard Bureau
                    **** National Defense University
                    **** National Security Agency


     * settings Collection - Stores application configuration.
          ** Field Name: setting_name
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Unique identifier (e.g., "owner_info")

          ** Field Name: my_name
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 200
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: off
          ** Field Purpose: Owner's full name

          ** Field Name: my_email
          ** Field Type: Email
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: on
          ** Setting - Presentable: off  
          ** Field Purpose: Owner's email address
 
          ** Field Name: my_mobile
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern:
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose: Owner's phone number

          ** Current Record:
               *** setting_name: `owner_info`
               *** Contains owner contact info for auto-generated permission request emails


     * topic_icons Collection - Stores generated topic icons for event cards.
          ** Field Name: topic_combination
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Unique key: "Topics|Regions|Countries|Orgs" format

          ** Field Name: topics 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Array of topic strings

          ** Field Name: regions 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Array of region strings

          ** Field Name: countries 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Array of country strings

          ** Field Name: transnational_org 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Array of transnational org strings

          ** Field Name: icon_file  
          ** Field Type: File
          ** Setting - Single/multiple (picklist): BLANK
          ** Setting - Allowed types (picklist): BLANK
          ** Setting - Choose presets (picklist):  BLANK
          ** Setting - thumb sizes: BLANK
          ** Setting - Max file size: BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Setting - Protected: off 
          ** Field Purpose/Notes: Generated PNG icon (1024×1024) 

          ** Field Name: prompt_used
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: BLANK
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: DALL·E prompt that generated the icon

          ** Field Name: compliance_notes 
          ** Field Type: JSON
          ** Setting - Max size (bytes): BLANK
          ** Setting - String value normalizations (picklist): BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Validation metadata (policy version, attempts, audit results)

          ** Field Name: created
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When record was created

          **  Field Name: updated
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When record was updated

          ** How topic_icons Works:
               *** Events are matched to icons via the topic_combination key
               *** Key format: "Topic1,Topic2|Region1|Country1,Country2|Org1"
               *** Empty fields still include the pipe separator for consistency
               *** Example: "Cybersecurity,Defense Policy|Europe/Eurasia||NATO"

          ** Icon Generation Workflow:
               *** 1. create-topic-icon-records.js scans events and creates records for new combinations
               *** 2. generate-topic-icons.js finds records with empty icon_file
               *** 3. DALL·E 3 generates image based on policyEngine prompt
               *** 4. Validators check for text, panels, and legibility
               *** 5. Valid icon uploaded to icon_file field
               *** 6. prompt_used and compliance_notes fields updated


---


# UI Display Notes
     * Date Display Format:
          ** Times (start_time, end_time) are stored but NOT displayed on the front-end. This avoids complexity with multi-day events that may have different times each day. Users click "More details and registration" to see specific times on the org's website
          ** Single day: December 18, 2025
          ** Multi-day, same month: December 9-10, 2025
          ** Multi-day, different months: December 30, 2025 to January 2, 2026
          ** Multi-day, different years: December 30, 2025 to January 2, 2026

     * Location Display Logic:
          ** If `event_type` contains "virtual" → displays "Virtual"
          ** If `event_type` contains "hybrid" → displays "Hybrid - City, ST"
          ** If `location` field has valid City, ST → displays as-is
          ** If `location` field has bad value (like "in-person") → extracts City, ST from title if possible
          ** Fallback → "Location TBD"

     * Description Display:
          ** Displayed on event cards with 2-line maximum (CSS truncation)
          ** HTML stripped before display
          ** Used for search (along with title)


---


# Search Behavior:
     * Only searches `title` and `description` fields
     * Does NOT search organization name, topics, regions, or location
     * Short terms (≤3 chars like "AI") use word boundary matching to prevent false positives
     * Multi-word searches use **OR logic** (any word can match)
          ** Example: "AI Cyber" returns events matching "AI" OR "Cyber"


---

