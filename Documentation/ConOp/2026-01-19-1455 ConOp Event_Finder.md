@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT NAME:  
2026-01-19_ConOp_Event_Finder.md


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# INTELLECTUAL PROPERTY NOTICE:  
The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT FORMATTING GUIDELINES: 
     * Legend: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" = Section Break
          "#" = Section Header (align left, Text in All Caps)
          "*" = Level 1 subheader/bullet (5 spaces from left + 1 asterisk)
          "-----" = Level 1 subheader/bullet Separator (align left, 1 space above and below)
          "**" = Level 2 bullet (10 spaces from left + 2 asterisks)
          "***" = Level 3 bullet (15 spaces from left + 3 asterisks)
          "****" = Level 4 bullet (20 spaces from left + 4 asterisks)

          >> NEW REFERENCE: Indicates a possible need to update documentation 
          >> NEW FEATURE: Indicates a new or desired capability to build
          >> NEW REFERENCE OR FEATURE: Indicates a possible need to update documentation and/or a new or desired capability to build


     * Formatting Example:
"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# HEADER 
     * Level 1 Bullet:

-----

          ** Level 2 Bullet:
               * Level 3 Bullet:
                    * Level 4 Bullet:

-----

     * Level 1 Bullet:
          ** Level 2 Bullet:
               *** Level 3 Bullet:
                    **** Level 4 Bullet:"

-----

     * Other Rules:
          ** No tables: Use bulleted lists to avoid formatting issues
          ** Export as *.md
          ** Retain formatting when generating a new version
          ** Always read document before making updates to ensure updates are placed in the correct Section
          ** No tables: Use bulleted lists to avoid formatting issues
          ** Only update relevant sections.   
          ** Do not truncate new versions of this document with placeholders like this "[REMAINDER OF DOCUMENT UNCHANGED - includes IMAGE GENERATION, TECH STACK, VERCEL, PUBLIC UI, EVENT SCRAPING, events collection, settings collection, topic_icons collection sections]".  Deliver the entire document with the changes made.


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# TECH STACK
     * Vercel: 
          ** Hosts the public-facing UI
          ** Auto-deploys when changes are pushed to GitHub
          ** Live URL: https://event-finder-ui-one.vercel.app
          ** Connected to: github.com/mtaylorUSA/event-finder-backend

-----

     * PocketBase: 
          ** Lightweight backend (auth, DB, file storage, realtime)
          ** Self‑host on Railway
          ** PocketBase Admin URL: https://event-discovery-backend-production.up.railway.app/_/
          ** API Rules: Public read access enabled for events and organizations

-----

     * GitHub: 
          ** Single repo for all project files (scripts, UI, docs)
          ** Repo: github.com/mtaylorUSA/event-finder-backend
          ** CI integration with Vercel (auto-deploy) and Railway

-----

     * Railway: Host PocketBase 

-----

     * Bitwarden: Store API keys/secrets

-----

     * My system (local Dev): 
          ** HP Envy x360
          ** Windows 11 Personal  
          ** Microsoft Office 365
          ** Powershell

-----

     * AI Features
          ** OpenAI API 
          ** text-embedding-3-small, gpt-4o-mini
          ** DALL·E 3 for topic icon generation

-----

     * FUTURE: Email with customers (TBD): 
          ** Resend (easy on Vercel) or 
          ** Mailgun/SendGrid (free tiers exist)

     * FUTURE: Payments (TBD): 
          ** Lemon Squeezy or 
          ** Stripe (subscriptions)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# MULTI-COMPUTER WORKFLOW
     * Architecture Overview
          ** Source of Truth: GitHub (github.com/mtaylorUSA/event-finder-backend)
          ** Secrets Storage: Bitwarden (encrypted vault)
          ** Local Work: Each computer has its own copy of the project
          ** Public Site: Vercel auto-deploys from GitHub

-----

     * Required Applications (install on each computer)
          ** Git: Version control, syncs with GitHub
          ** Node.js: Runs JavaScript scripts
          ** Bitwarden: Access to secrets/API keys

-----

     * Required Local Files (create on each computer)
          ** .env file: Contains secrets copied from Bitwarden
               *** POCKETBASE_URL
               *** POCKETBASE_ADMIN_EMAIL
               *** POCKETBASE_ADMIN_PASSWORD
               *** OPENAI_API_KEY
               *** OPENAI_IMAGE_MODEL=dall-e-3
               *** GOOGLE_SEARCH_API_KEY (for event-based discovery)
               *** GOOGLE_SEARCH_ENGINE_ID (for event-based discovery)

-----

     * Setting Up a New Computer
          ** 1. Install Git, Node.js, Bitwarden
          ** 2. Create folder: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL
          ** 3. Clone from GitHub: git clone https://github.com/mtaylorUSA/event-finder-backend.git .
          ** 4. Create .env file with secrets from Bitwarden
          ** 5. Run: npm install

-----

     * Before Stopping Work (on current computer)
          ** 1. git add -A
          ** 2. git commit -m "describe what you did"
          ** 3. git push
          ** 4. Vercel automatically deploys any UI changes

-----

     * Before Starting Work (on different computer)
          ** 1. Open PowerShell
          ** 2. cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL"
          ** 3. git pull

-----

     * Security Reminders
          ** ❌ NEVER commit .env to GitHub
          ** ❌ NEVER share API keys in chat, email, or cloud storage
          ** ✅ ALWAYS use Bitwarden for secrets
          ** ✅ ALWAYS verify .env doesn't appear in git status


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# PROJECT OVERVIEW
     * Event Finder aggregates public events from national security, defense, and intelligence community organizations into a single searchable database.

-----

     * Project Phases:
          ** Phase 1: 
               *** Tool pending final fixes before Pilot
               *** All new scrapers require permission process with Orgs to scrape and use their data
               *** Make functional enhancement to the tool

          ** Phase 2: Determine business model (ads, subscriptions, etc)

          ** Phase 3: Implement approach determined in Phase 2



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# VERCEL DEPLOYMENT

     * Live Site
          ** Current URL: https://event-finder-ui-one.vercel.app
          ** Status: ✅ Active and working
          ** Environment: Production

-----

     * How It Works
          ** Vercel is connected to GitHub repo: mtaylorUSA/event-finder-backend
          ** When you push changes to GitHub, Vercel automatically redeploys
          ** Deployment typically takes 5-10 seconds

-----

     * Key File
          ** index.html in the repo root is what Vercel serves
          ** This file is a copy of event-finder-ui-v7.html

-----

     * How to Update the Public UI
          ** 1. Make changes to index.html (or update event-finder-ui-v7.html and copy to index.html)
          ** 2. git add -A
          ** 3. git commit -m "Update UI"
          ** 4. git push
          ** 5. Vercel automatically deploys (wait ~10 seconds)
          ** 6. Verify at https://event-finder-ui-one.vercel.app

-----

     * Vercel Admin Access
          ** URL: https://vercel.com
          ** Login with GitHub account
          ** Project name: event-finder-ui

-----

     * Architecture Diagram
          ** GitHub Repo (event-finder-backend)
          **      │
          **      ├──► Vercel (auto-deploys index.html)
          **      │         │
          **      │         ▼
          **      │    https://event-finder-ui-one.vercel.app
          **      │
          **      └──► Your LOCAL folder (development)

-----

     * FUTURE ENAHNCEMENTS: 
          ** Migrate website to new URL: https://BalanceFWD.com


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ADMIN INTERFACE

     * File: admin-interface-v21.html (updated 2026-01-18)

-----

     * Access: Open locally in browser, requires PocketBase admin login

-----

     * Features:
          ** Header: "Event Finder Admin" - clickable, returns to Dashboard from anywhere
          ** 6 Main Tabs: Dashboard, Org By Status, Organizations, Contacts, Events, Icons
          ** Organization Profile Page with 4 sub-tabs

-----

     * Tab: Dashboard
          ** Stats overview: Total Orgs, Events, Nominated (Pending), Live (Scraping), Tech Blocked, Permission Denied, Duplicates (added 2026-01-19)
          ** Status breakdown by count (7 statuses as of 2026-01-15)
          ** Tech Blocked count (organizations with tech_block_flag = true)
          ** Tech-Rendered Sites count (organizations with tech_rendering_flag = true) - renamed 2026-01-17
          ** Duplicates count (organizations with duplicate_flag = true) - added 2026-01-19

-----

     * Tab: Org By Status
          ** Filter dropdown: All, plus 7 status values, plus Duplicates Only (updated 2026-01-19)
               *** Nominated (Pending Mission Review)
               *** Mission Approved (Request Not Sent)
               *** Permission Requested (Pending Org Response)
               *** Permission Granted (Not Live)
               *** Rejected by Mission
               *** Rejected by Org
               *** Live (Scraping Active)
               *** Duplicates Only (added 2026-01-19)
          ** Organization cards with status-specific content
          ** Inline status dropdown for quick changes
          ** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events
          ** Status-specific buttons: Approve Mission, Generate Request

-----

     * Tab: Organizations
          ** Quick search by name
          ** Jump to Organization dropdown
          ** Filter by Status dropdown (redirects to Org By Status tab)
          ** Add Organization button (opens blank Profile Page)
          ** Organization cards showing:
               *** Policy Restriction warnings/alerts (renamed from TOU - updated 2026-01-15)
               *** Duplicate warnings (added 2026-01-19)
               *** Org name (links to Profile)
               *** Status badge
               *** Description
               *** Website
               *** Phone (from Main Contact or non-Leadership contact)
               *** Status dropdown (quick change)
               *** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events
          ** Badge indicators for rejection flags (updated 2026-01-19):
               *** ⛔ BLOCKED (tech_block_flag)
               *** ⚠️ TOU (tou_flag)
               *** 🚫 DECLINED (permission_denied_flag)
               *** ⚙️ JS-RENDER (tech_rendering_flag)
               *** 🔁 DUPLICATE (duplicate_flag) - added 2026-01-19

-----

     * Tab: Contacts
          ** List of all contacts across organizations
          ** Add Contact button
          ** Edit/Delete buttons per contact

-----

     * Tab: Events (updated 2026-01-17)
          ** Filter by event status (All, Nominated, Approved, Rejected)
          ** Filter by organization
          ** Sort options: Date (Newest/Oldest), Organization (A-Z/Z-A), Recently Added
          ** List of all events with details
          ** Event status badges: 📋 Nominated, ✅ Approved, ❌ Rejected
          ** Accept/Reject buttons for event review
          ** Fade-out animation when accepting/rejecting from filtered view

-----

     * Tab: Icons
          ** Icon status stats (total, has icon, missing icon)
          ** Filter by icon status
          ** List of topic combinations with icons

-----

     * Organization Profile Page
          ** Accessed by clicking org name or action buttons
          ** Back to List button returns to previous view
          ** 4 Sub-tabs:

          ** Sub-tab: Overview
               *** Policy Restriction alerts (if flagged) (renamed from TOU - updated 2026-01-15)
               *** Tech Block alerts (if flagged)
               *** Organization Name
               *** Type
               *** Description
               *** Website
               *** Source ID (domain)
               *** Events URL
               *** Status dropdown (7 options as of 2026-01-15)
               *** Permission Type dropdown (Explicit, Implied) - updated 2026-01-17
               *** Discovery Method indicator (manual, profile-based, event-based)
               *** Event Policy dropdown (accept_all, propose_events)
               *** Save Overview button

          ** Sub-tab: Contacts
               *** Org info section (name, status, alerts)
               *** Sort by Last Name / First Name dropdown
               *** Add Contact button
               *** Contact cards with Edit/Delete buttons

          ** Sub-tab: Status & History
               *** General Info: Org name, status, website, AI reasoning (now shows AI summary)
               *** Rejection Flags Section (consolidated at TOP - added 2026-01-17):
                    **** Pink background box with all 4 rejection flags
                    **** ⚠️ TOU Restriction checkbox (tou_flag)
                    **** ⛔ Technical Block (403) checkbox (tech_block_flag)
                    **** ⚙️ Tech-Rendered Site checkbox (tech_rendering_flag) - renamed from js_render_flag
                    **** 🚫 Permission Denied checkbox (permission_denied_flag) - added 2026-01-17
                    **** Save Flags button
               *** Duplicate Info Box (read-only - added 2026-01-19):
                    **** Purple background box shown when duplicate_flag = true
                    **** Shows "Duplicate of: [Org Name]" with clickable link to primary org
                    **** Set by quality-audit.js script, not manually editable
               *** Discovery Info (if event-based):
                    **** Triggering Event Title
                    **** Triggering Event Score
                    **** Triggering Event URL
               *** Policy Document Assessment (renamed from TOU Assessment - updated 2026-01-15):
                    **** Policy Docs Scanned Date (auto-set when flags checked)
                    **** Policy Notes (shows all documents scanned and restrictions found)
                    **** Save Policy Info button
               *** Permission Request:
                    **** Permission Requested Date
                    **** Go-Live Date (auto-calculated: sent + 1 week) - updated 2026-01-17 from 2 weeks
                    **** Permission Request Draft Text (editable)
                    **** Buttons: Generate Draft, Copy Draft, Preview
                    **** Permission Request Final Text (editable)
                    **** Buttons: Copy Final, Preview
                    **** Permission Response Date
                    **** Permission Response Text (editable)
                    **** Save Permission Info button
               *** Scraping Info: 
                    **** Event count, Last scraped
                    **** Scraping Enabled checkbox
                    **** Scrape Notes (auto-populated by scanner when JS rendering detected)
                    **** Manual Notes
               *** Change Status dropdown

          ** Sub-tab: Events (updated 2026-01-17)
               *** Org info section (name, status, website, AI reasoning)
               *** Event count badge
               *** Event status summary: Nominated X, Approved X, Rejected X
               *** List of events from this organization with status badges
               *** Accept/Reject buttons per event
               *** Event Policy dropdown (change from event screen)

-----

     * FUTURE ENAHNCEMENTS: 
          ** Task Automation
               *** Enable buttons to trigger: scraping, TOU checks, contact discovery
               *** Requires Express server on Railway with endpoints
          ** Status Altering
          ** View AI-generated event icons next to the event in the Admin Interface


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# IMAGE GENERATION PROGRAM ARCHITECTURE

     * Purpose
          ** Generate safe, professional topic icons for event cards automatically
          ** Ensure visual consistency, safety, and policy compliance
          ** Support fully automated image generation with no human-in-the-loop

-----

     * Image Output Requirements
          ** Output format: PNG
          ** Generation size: 1024×1024 px (master)
          ** Display size: 80×130 px (CSS background-image with background-size: cover)
          ** Single cohesive icon only (never a collage, never multi-panel)

-----

     * Technology Stack
          ** OpenAI DALL·E 3 API for image generation
          ** Claude-written JavaScript code for automation
          ** PocketBase topic_icons collection for storage
          ** Sharp library for image processing
          ** Tesseract.js for OCR text detection

-----

     * Scripts 
          ** Node.js 
          ** Local + GitHub

-----

     * Version Control 
          ** Git + GitHub 
          ** github.com/mtaylorUSA/event-finder-backend

-----

     * Folder Structure
          ** The icon generation system lives in its own subfolder: icon-worker/
          ** Has its own node_modules and package.json (separate from root)
          ** Uses the ROOT .env file (scripts load from ../../.env)
          ** Source code is in icon-worker/src/

-----

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
               *** Loads environment variables from ROOT .env file (../../.env)
               *** Provides getConfig() function with all settings

          ** pbClient.js
               *** PocketBase API helpers (login, fetch, upload, update)

          ** openaiImages.js
               *** OpenAI DALL·E 3 API wrapper for image generation

-----

     * Critical Restrictions (Enforced in Every Prompt)
          ** No Text: Absolutely NO text, words, letters, numbers, labels, captions, watermarks, signatures, UI text, signage, or any readable glyphs
          ** US Politics Prohibition: NO US politicians (current or former), NO US political party symbols (no elephant, no donkey)
          ** Prohibited Official Marks: No official government seals or agency insignia (FBI, CIA, NSA, DHS, DoD, etc.), no specific military unit patches/badges/insignia
          ** Faces & People: No realistic human faces; human figures permitted only as abstract silhouettes with no identifiable features

-----

     * Geography Rules
          ** If COUNTRIES is populated: 
               *** Country flag OK
               *** National colors OK
               *** Country map OK (text-free, neutral)
          ** If COUNTRIES is empty and REGIONS is populated: 
               *** Regional map OK.  Silhouette ONLY (no flags or country maps)

-----

     * Validation Pipeline (Mandatory Post-Checks)
          ** Step 1: OCR scan - reject if any letters/numbers detected
          ** Step 2: Panel divider detection - reject if collage/grid composition detected
          ** Step 3 (optional): Downscale audit - simulate 80×130 display and reject if illegible

-----

     * Retry Logic
          ** Attempt 1: Standard prompt from policyEngine
          ** Attempt 2: Simplified to ONE bold shape filling the canvas
          ** Attempt 3: Maximum abstraction with pure geometric forms
          ** Attempt 4+: Extremely minimal with single gradient and subtle texture only
          ** Max attempts configurable via MAX_ATTEMPTS in .env (default: 6)

-----

     * Workflow
          ** Step 1: cd to icon-worker folder
          ** Step 2: Run npm run create-records to create topic_icons records for new combinations
          ** Step 3: Run npm run generate to generate icons for records missing icon_file
          ** Step 4: Icons are automatically uploaded to PocketBase and linked to events via topic_combination key

-----

     * Environment Variables (in ROOT .env file)
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

-----

     * Update Cadence
          ** rules.js: Updated when visual rules, domains, or modifiers are refined
          ** policyEngine.js: Updated when prompt construction logic changes
          ** Policy version tracked in compliance_notes field of each topic_icon record

-----

     * Field Name Mapping Note (IMPORTANT)
          ** The events collection uses "transnational_orgs" (plural with 's')
          ** The topic_icons collection uses "transnational_org" (singular, no 's')
          ** Scripts must account for this difference when reading from events and writing to topic_icons
          ** create-topic-icon-records.js reads event.transnational_orgs and writes to topic_icons.transnational_org


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE

     * Purpose
          ** Discover new organizations by analyzing EVENTS they host, rather than organizational profiles
          ** Identify organizations like Aspen Institute or American Bar Association that host relevant national security events among a broader portfolio of unrelated activities
          ** Use AI embeddings to score candidate events against existing event profile
          ** Complement profile-based discovery (suggest-organizations.js) with event-based discovery

-----

     * Problem Statement
          ** Many organizations host events relevant to the national security community but would not be identified through profile-based discovery because:
               *** Broad Mission Organizations: Their overall mission is not national security focused (e.g., Aspen Institute covers policy broadly; American Bar Association covers all legal topics)
               *** Occasional Relevant Events: They host 1-5 relevant events per year among dozens of unrelated events
               *** Profile Mismatch: Their organizational description does not mention cybersecurity, defense, or intelligence—but their event titles and descriptions do
          ** Result: Profile-based discovery misses these organizations entirely, causing gaps in event coverage

-----

     * Discovery Method Comparison
          ** Profile-Based Discovery (scrapers/suggest-organizations.js):
               *** Input: Existing organization profiles
               *** Source: AI training data (GPT knowledge)
               *** Finds: Organizations similar to current organizations
               *** Best For: Well-known think tanks, agencies, established organizations
               *** Limitations: Limited to AI's training knowledge cutoff
               *** Uses Embeddings: No
          ** Event-Based Discovery (scrapers/discover-orgs-by-events.js):
               *** Input: Existing event embeddings
               *** Source: Live web search
               *** Finds: Organizations hosting events similar to current events
               *** Best For: Broad-mission organizations with occasional relevant events
               *** Limitations: Requires web search API
               *** Uses Embeddings: Yes

-----

     * Ethical Approach - Snippets Only
          ** CRITICAL: The discovery script uses ONLY search result snippets from Google
          ** Search results include: title, URL, and snippet (text preview)
          ** The script does NOT fetch or scrape pages from organizations we haven't approved
          ** This ensures we respect TOU policies before ever accessing their sites
          ** Page fetching only occurs AFTER the discovery process identifies candidates:
               *** Homepage fetch: To find TOU page URL and gather basic org info
               *** TOU page fetch: To scan for scraping restrictions (ethical - reading rules to comply)
               *** Contact page fetch: ONLY if no TOU restrictions found

-----

     * Solution Architecture - Complete Flow
          ** Phase A: Web Search (No Page Fetching)
               *** Step A1: Build Ideal Event Profile
                    **** Input: All event embeddings from events we track
                    **** Process: Calculate centroid (average) of all event vectors
                    **** Output: Single "ideal event" embedding vector
                    **** Purpose: This vector represents "what a relevant event looks like"
               *** Step A2: Generate Search Queries
                    **** Input: Topic taxonomy, existing event titles, regions
                    **** Process: AI generates targeted search queries
                    **** Output: List of web search queries
                    **** Exclusions in prompt: Training, certifications, webinars, political, academic, aggregator lists
                    **** Examples: "cybersecurity conference 2026 DC", "national security summit 2026 washington"
               *** Step A3: Search Web for Candidate Events
                    **** Input: Search queries from Step A2
                    **** Process: Execute web searches via Google Custom Search API
                    **** Output: List of search results (title, URL, snippet ONLY)
                    **** Filter: Exclude URLs from organizations already tracked
                    **** Filter: Exclude results matching exclusion keywords (see Exclusion Keywords section)
               *** Step A4: Score Candidate Events Using Snippets
                    **** Input: Search result title + snippet (NOT page content)
                    **** Process: Generate embedding from title + snippet, calculate cosine similarity to Ideal Event Profile
                    **** Output: Similarity score (0.0 to 1.0)
                    **** Threshold: Events scoring > 0.40 proceed to Phase B (updated 2026-01-11)
               *** Step A5: Extract Domain from URL
                    **** Input: URL from high-scoring search result
                    **** Process: Parse URL to extract domain (no page fetching)
                    **** Output: Domain name (e.g., "aspeninstitute.org")
          ** Phase B: Initial Org Scan (Page Fetching - Ethical)
               *** Step B1: Fetch Homepage
                    **** Input: Domain from Step A5
                    **** Process: Fetch homepage to find TOU link and gather basic org info
                    **** Output: Homepage HTML for further processing
                    **** On 403/401 Error: Skip to Step B4 with tech_block_flag = TRUE
               *** Step B2: Policy Document Scan (renamed from TOU Scan - updated 2026-01-15)
                    **** Find ALL policy-relevant page URLs from homepage (terms, privacy, legal, etc.)
                    **** Fetch and scan EACH page for restriction keywords using context-aware detection
                    **** Output: tou_flag (TRUE if ANY page contains restrictions), tou_notes (specific phrases found)
               *** Step B3: POC Gathering
                    **** If NO restrictions: Fetch About/Contact pages, gather POC info
                    **** If restrictions found: Use web search for POC (LinkedIn, Wikipedia, etc.)
               *** Step B4: Create Nomination Record
                    **** Status: Nominated (Pending Mission Review) - ALWAYS
                    **** Populate fields: name, website, source_id, ai_reasoning, discovery_method
                    **** Set flags: tou_flag = TRUE or FALSE, tech_block_flag = TRUE or FALSE
                    **** Populate triggering event info: title, score, URL
          ** Phase C: Human Review
               *** Step C1: Human reviews nomination in Admin Interface
               *** Step C2: Human reviews flags and AI reasoning
               *** Step C3: Human decides: Approve or Reject
                    **** If Approve: Status → Mission Approved (Request Not Sent)
                    **** Cross-Reference: See ORGANIZATION WORKFLOW 2: MISSION REVIEW
               *** Sets event_policy if approving (accept_all or propose_events)

-----

     * Scanner Output (What Human Reviewer Sees)
          ** Flags:
               *** tou_flag = TRUE: Displays warning ⚠️ in Admin Interface
               *** tech_block_flag = TRUE: Displays warning ⚠️ in Admin Interface
          ** AI Reasoning: Summary of org and its events (from GPT-4o-mini analysis)
          ** Triggering Event: Title, similarity score, URL
          ** POC Info: Contact name/email if found

-----

     * Exclusion Keywords (Added 2026-01-11)
          ** Purpose: Filter out irrelevant results during Phase A search
          ** Applied to: Title + snippet text from search results
          ** Training/Certification:
               *** training, certification, certified, certificate program
               *** bootcamp, boot camp, workshop training, hands-on lab
          ** Books/Articles/Papers:
               *** book review, book club, reading group
               *** paper review, article review, research paper
               *** journal club, literature review, book discussion
               *** author talk, book signing
          ** Political:
               *** republican, democrat, gop, dnc, rnc
               *** trump, biden, obama, clinton, desantis, newsom
               *** campaign rally, political party, election campaign
               *** vote for, partisan
          ** Aggregator/List Pages:
               *** conferences to attend, top conferences, best conferences
               *** conference list, calendar of events, event calendar
               *** upcoming events, events list, over 3.4k, over 1k, over 2k
          ** Webinars:
               *** webinar, webinar series, web seminar, online seminar
          ** Academic/Education:
               *** provost, consortium, studies program
               *** graduate program, undergraduate, faculty
               *** curriculum, academic conference, student conference
          ** Industry/Vocational:
               *** grant program, state-funded, careers
               *** job fair, hiring event, recruitment

-----

     * Embedding Model
          ** Model: OpenAI text-embedding-3-small
          ** Dimensions: 1536
          ** Use Case: Event text similarity scoring

-----

     * Similarity Calculation
          ** Method: Cosine Similarity
          ** Score Interpretation:
               *** 1.0 = Identical meaning
               *** 0.70+ = Highly relevant
               *** 0.40-0.69 = Relevant (threshold for inclusion - updated 2026-01-11)
               *** < 0.40 = Not relevant
          ** Threshold History:
               *** Original: 0.70 (too restrictive - filtered all results in testing)
               *** Updated 2026-01-11: 0.40 (based on user feedback review)

-----

     * Web Search API
          ** Provider: Google Custom Search API
          ** Free Tier: 100 queries per day
          ** Environment Variables Required:
               *** GOOGLE_SEARCH_API_KEY: API key from Google Cloud Console
               *** GOOGLE_SEARCH_ENGINE_ID: Search engine ID from Programmable Search Engine

-----

     * Script: scrapers/discover-orgs-by-events.js
          ** Purpose: Automated discovery of organizations through analysis of events they host
          ** Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\discover-orgs-by-events.js
          ** Status: Functional (updated 2026-01-14)

-----

     * Configuration Options
          ** MAX_QUERIES: Number of search queries to execute (default: 5)
          ** MAX_RESULTS_PER_QUERY: Results to process per query (default: 10)
          ** SIMILARITY_THRESHOLD: Minimum score for relevance (default: 0.40, updated 2026-01-11)
          ** MAX_NOMINATIONS: Cap on new orgs per run (default: 10)

-----

     * Environment Variables Required
          ** POCKETBASE_URL: PocketBase server URL
          ** POCKETBASE_ADMIN_EMAIL: Admin login email
          ** POCKETBASE_ADMIN_PASSWORD: Admin login password
          ** OPENAI_API_KEY: OpenAI API key (for embeddings and AI analysis)
          ** GOOGLE_SEARCH_API_KEY: Google Custom Search API key
          ** GOOGLE_SEARCH_ENGINE_ID: Google Programmable Search Engine ID

-----

     * When to Run Event-Based Discovery
          ** Manual: As needed when expanding coverage
          ** Scheduled: Weekly to catch new events as they're announced
          ** After Enrichment: After running scrapers/enrich-events.js when embeddings are fresh

-----

     * Human Review Required
          ** This script nominates organizations—it does not approve them
          ** All discovered organizations enter the standard review workflow
          ** Workflow: Event-Based Discovery → TOU Scan → AI Analysis → Status: Nominated (Pending Mission Review) → Human Review → Approved or Rejected
          ** Human reviewer sees: TOU flag status, Tech Block status, AI-generated summary, Triggering event details, POC info

-----

     * Success Metrics
          ** Relevant orgs discovered: 5+ per month
          ** Precision: > 50% (Approved / Total Nominated)
          ** Coverage expansion: Events from discovered orgs fill topic gaps
          ** False positive rate: < 30% (Rejected / Total Nominated)

-----

     * Database Schema Additions for Event-Based Discovery
          ** organizations Collection - New Fields (Added 2026-01-11):
               *** discovery_method: Select (manual, profile-based, event-based)
               *** triggering_event_title: Text (Event that triggered discovery)
               *** triggering_event_score: Number (Similarity score 0-100)
               *** triggering_event_url: URL (Link to original event)

-----

     * Future Enhancements
          ** RSS/Atom Feed Discovery: Find orgs that publish event feeds
          ** Social Media Monitoring: Track #NatSec event announcements on LinkedIn/Twitter
          ** Conference Aggregator Scraping: Monitor sites like Eventbrite, Meetup for relevant events
          ** Feedback Loop: Use approved/rejected decisions to refine the ideal event profile over time

-----

     * Related Scripts (all in scrapers/ folder)
          ** generate-embeddings.js: Creates event embeddings (provides input for ideal profile)
          ** suggest-organizations.js: Profile-based org discovery (complementary method)
          ** enrich-events.js: Tags events with topics (enriched events improve embedding quality)
          ** scan-and-scrape-all-live-orgs.js: Unified scanner/scraper for all orgs (consolidated 2026-01-18)
          ** org-scanner.js: Core scanning module for policy docs, tech blocks, events URL, POC, and AI analysis (added 2026-01-14, context-aware detection added 2026-01-15)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# EVENT POLICY - ORGANIZATION TRUST LEVELS

     * Purpose
          ** Categorize organizations by how their events should be handled
          ** Streamline event approval workflow based on organizational trust
          ** Allow re-categorization at any time from Org or Event screens

-----

     * Event Policy Options
          ** accept_all: Auto-approve events from this org (exclusion rules still apply)
               *** Use for: INSA, CSIS, Brookings - orgs 100% in our lane
               *** Behavior: Scraper finds event → Check exclusion rules → If passes, auto-create with event_status "approved"
          ** propose_events: Scrape but propose each event for human review
               *** Use for: American Bar Association, Aspen Institute - mixed relevance
               *** Behavior: Scraper finds event → Check NatSec criteria + exclusion rules → If passes, create with event_status "nominated"

-----

     * Event Status Values (in events collection - added 2026-01-17)
          ** approved: Event shows in public UI
          ** nominated: Event needs human review in Admin Interface
          ** rejected: Event hidden from public, stays in database

-----

     * Exclusion Rules (Apply to All Orgs Regardless of Policy)
          ** Events are never auto-approved if they contain:
               *** Training, certification, webinar keywords
               *** Named politicians or political party references
               *** Book reviews, readings, paper discussions
          ** Cross-Reference: See Exclusion Keywords in EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE

-----

     * Setting Event Policy
          ** When: During Mission Review (Workflow 2) or any time after approval
          ** Where: Organization Profile → Overview tab → Event Policy dropdown
          ** Also: Events tab → Can change parent org's policy while reviewing events

-----

     * Reviewing Nominated Events (added 2026-01-17)
          ** Go to Events tab → Filter by "Nominated (Needs Review)"
          ** Review each event
          ** Click ✅ Accept to set event_status = "approved" (shows in public UI)
          ** Click ❌ Reject to set event_status = "rejected" (stays in DB, hidden from public)
          ** Events fade out when accepted/rejected from filtered view

-----

     * Overriding Individual Events
          ** Even with accept_all policy, human can reject specific events
          ** Events tab shows [Reject] button for each event
          ** Rejected events are hidden from public UI but remain in database

-----

     * Database Field (organizations collection)
          ** Field Name: event_policy
          ** Field Type: Select
          ** Values: accept_all, propose_events
          ** Default for new orgs: propose_events

-----

     * Database Field (events collection - added 2026-01-17)
          ** Field Name: event_status
          ** Field Type: Select
          ** Values: approved, nominated, rejected


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# WORKFLOW - STATUS REFERENCES

     * Status: Nominated (Pending Mission Review)
          ** Description: AI-suggested or manually added, awaiting review
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Review and approve/reject
          ** Note: Organizations with tou_flag or tech_block_flag = TRUE still receive this status; flags are for human review, not auto-rejection

-----

     * Status: Mission Approved (Request Not Sent)
          ** Description: Approved for mission, permission request not yet sent
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Add contacts, generate and send permission request

-----

     * Status: Permission Requested (Pending Org Response)
          ** Description: Permission email sent, waiting for response
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Wait for response (go-live date = sent + 1 week) - updated 2026-01-17 from 2 weeks

-----

     * Status: Permission Granted (Not Live)
          ** Description: Permission received (explicit or implied), not yet scraping
          ** Can Edit?: YES
          ** Can Scrape?: YES (when enabled)
          ** Shows in Public UI?: NO (until scraping produces events)
          ** Next Action: Enable scraping, change to Live
          ** Note: permission_type field indicates Explicit or Implied

-----

     * Status: Rejected by Mission (updated 2026-01-15)
          ** Description: Does not fit project mission/focus
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: Org doesn't align with national security focus, wrong sector, out of scope

-----

     * Status: Rejected by Org (updated 2026-01-17)
          ** Description: Organization has blocked us or denied permission
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: 
               *** Policy restrictions found in legal documents (TOU, Privacy Policy, etc.) - tou_flag
               *** Technical blocks encountered (403/401 errors) - tech_block_flag
               *** Tech-rendered site requiring Puppeteer (optional) - tech_rendering_flag
               *** Organization explicitly denied permission request - permission_denied_flag
          ** Auto-Set: Scanner auto-sets this status when any rejection flag is set on a Live org (updated 2026-01-17)

-----

     * Status: Live (Scraping Active)
          ** Description: Actively being scraped, events appear in public UI
          ** Can Edit?: YES
          ** Can Scrape?: YES
          ** Shows in Public UI?: YES
          ** Next Action: Monitor and maintain

-----

     * Migration Note (2026-01-04, updated 2026-01-15):
          ** Old 8-stage statuses were consolidated to 6 stages (2026-01-04)
          ** "Mission Rejected" and "Permission Rejected" merged into "Rejected (By Mission or Org)" (2026-01-04)
          ** "Permission Requested (Self)" and "Permission Requested (Lawyer)" merged into "Permission Requested (Pending Org Response)" (2026-01-04)
          ** "Permission Granted" renamed to "Permission Granted (Not Live)" (2026-01-04)
          ** "Scraping Active" renamed to "Live (Scraping Active)" (2026-01-04)
          ** "Rejected (By Mission or Org)" split into two separate statuses (2026-01-15):
               *** "Rejected by Mission" - Org doesn't fit project focus
               *** "Rejected by Org" - Org blocked us (TOU restrictions, tech blocks, or denied permission)
          ** Total status count: 7 (as of 2026-01-15)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW STEP 1A: DISCOVERY AND INITIAL SCAN - ORGS

     * Finding Organizations to scrape
          ** Organizations can be discovered through three methods:
               *** Manual Discovery: Admin manually adds organization
               *** Profile-Based Discovery (AI): AI suggests orgs similar to existing approved orgs
               *** Event-Based Discovery (AI + Embeddings): AI discovers orgs by finding similar events online

-----

     * Profile-Based Discovery
          ** Run Command: node scrapers/suggest-organizations.js
          ** AI suggests organizations similar to existing approved orgs
          ** Uses AI training knowledge to find similar organizations
          ** Creates nominations with status "Nominated (Pending Mission Review)"

-----

     * Event-Based Discovery
          ** Run Command: node scrapers/discover-orgs-by-events.js
          ** Prerequisites:
               *** Event embeddings must exist (run scrapers/generate-embeddings.js first)
               *** Google Search API credentials must be configured in .env
          ** See "EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE" section for detailed flow

-----

     * Manual Discovery
          ** In Admin Interface: Organizations tab → "Add Organization" button
          ** Fill in: Name, Website, Description, Type
          ** Sets discovery_method = "manual"
          ** Status: Nominated (Pending Mission Review)

-----

     * Initial Org Scan (org-scanner.js - updated 2026-01-18)
          ** Automated Checks (run during discovery or via scan-and-scrape-all-live-orgs.js --scan-only):
               *** Homepage fetch (checks for 403/401 errors)
               *** JavaScript rendering detection on homepage AND events page
               *** Event content detection (catches AJAX-loaded empty pages)
               *** Policy document discovery (finds all legal pages)
               *** Multi-page policy document scan (scans ALL legal pages)
               *** Context-aware restriction detection
               *** Events URL discovery
               *** POC info gathering
               *** AI-powered org analysis
          ** Sets flags based on scan:
               *** tou_flag: TRUE if restrictions found in ANY legal document, FALSE if clear
               *** tech_block_flag: TRUE if 403/401 error, FALSE otherwise
               *** tech_rendering_flag: TRUE if JavaScript rendering detected (renamed from js_render_flag - 2026-01-17)
          ** Populates tou_notes with specific phrases found and pages scanned
          ** Populates scrape_notes with JS rendering details

-----

     * Scanner Console Output for Each Scan Step
          ** Policy Doc Check:
               *** ✅ No restrictions found in policy documents
               *** ⚠️ Potential restrictions found (with context snippets)
          ** Tech Block Check:
               *** ✅ Site accessible
               *** ⛔ 403/401 - Site blocks automated access
          ** JavaScript Rendering Check:
               *** ✅ Server-side rendered (standard scraping should work)
               *** ⚙️ JavaScript-rendered site detected (needs Puppeteer)
          ** Events URL:
               *** ✅ Events page found: [URL]
               *** ⚠️ No events page found
          ** POC Info:
               *** ✅ Found X potential contacts
               *** ⚠️ No contact info found

-----

     * What Happens After Scan (for discovered orgs)
          ** All discovered orgs get status: Nominated (Pending Mission Review)
          ** Flags are SET but do NOT auto-reject during discovery
          ** Human reviewer sees flags and makes final decision
          ** This allows human to approve orgs despite flags if appropriate

-----

     * What to Do If TOU Flag is Set
          ** Set tou_flag = true
          ** Record specific restriction phrases in tou_notes
          ** Human reviews during Mission Review
          ** If restrictions are genuine: Status → Rejected by Org
          ** If false positive: Clear flag, proceed with approval

-----

     * What to Do If Tech Block Flag is Set
          ** Set tech_block_flag = true
          ** Set tou_flag = true (implied restriction)
          ** Organization technically cannot be scraped
          ** Status → Rejected by Org

-----

     * What to Do If Tech Rendering Flag is Set (updated 2026-01-17)
          ** Set tech_rendering_flag = true
          ** Status → Rejected by Org (changed from Nominated - 2026-01-17)
          ** Requires Puppeteer-based scraper to extract events
          ** Organization can be revisited when Puppeteer scrapers are implemented

-----

     * What to Do If All Checks Pass
          ** Leave tou_flag = false
          ** Leave tech_block_flag = false
          ** Leave tech_rendering_flag = false
          ** Proceed to Mission Review


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW STEP 1B: DISCOVERY AND INITIAL SCAN - EVENTS

     * Finding Events to scrape

-----

     * How Event-Based Organization Discovery Works
          ** This workflow discovers NEW ORGANIZATIONS by finding EVENTS they host online
          ** It is NOT used to find events for organizations we already track (that's done by scraping)
          ** Flow: Search Web → Filter Exclusions → Score Event → Extract Domain → Policy Doc Scan → AI Analysis → Nominate Org → Human Review → If Approved, Build Scraper

-----

     * Event-Based Discovery Process (Detailed Steps)
          ** Phase A - Web Search (No Page Fetching):
               *** Step 1: System builds "ideal event profile" from embeddings of all existing events
               *** Step 2: System generates search queries based on topics and regions (excludes training, political, webinar, academic topics)
               *** Step 3: System searches Google for candidate events (returns title, URL, snippet only)
               *** Step 4: For each search result:
                    **** Check against exclusion keywords (skip if matches)
                    **** Generate embedding from title + snippet (NOT from fetched page)
                    **** Calculate similarity score against ideal event profile
                    **** If score > 0.40 (threshold, updated 2026-01-11), proceed to Phase B
               *** Step 5: Extract domain from high-scoring result URLs
          ** Phase B - Initial Org Scan (Page Fetching):
               *** Step 6: Fetch homepage from extracted domain
                    **** On 403/401 error: Set tech_block_flag = TRUE, skip to Step 10
                    **** Find: All policy-relevant page URLs
               *** Step 7: Fetch and scan ALL policy-relevant pages (updated 2026-01-15)
                    **** Scan each page for restriction keywords using context-aware detection
                    **** If restrictions found in ANY page: Set tou_flag = TRUE
                    **** Record specific phrases and which page they came from in tou_notes
               *** Step 8: Gather POC info
                    **** If NO restrictions: Fetch About/Contact pages, gather POC
                    **** If restrictions found: Use web search for POC (LinkedIn, Wikipedia, etc.)
               *** Step 9: AI Analysis (Added 2026-01-11)
                    **** Send homepage content to GPT-4o-mini
                    **** Extract: org_name (actual org, not event name), org_type, summary
                    **** AI looks for: "Presented by", "Hosted by", "A program of", copyright notices
               *** Step 10: Create nomination record
                    **** Status: Nominated (Pending Mission Review) - ALWAYS
                    **** name: AI-extracted org name (from Step 9)
                    **** ai_reasoning: AI-generated summary (from Step 9)
                    **** Set tou_flag, tech_block_flag based on scan
                    **** Set discovery_method: event-based
                    **** Populate triggering_event_title, score, URL
                    **** Populate POC info (if found)
          ** Phase C - Human Review:
               *** Step 11: Human reviews in Admin Interface
               *** Step 12: Human reviews AI reasoning (org/event summary)
               *** Step 13: Human decides: Approve (pursue permission) or Reject (choose "Rejected by Mission" or "Rejected by Org")
               *** Step 14: If approving, set event_policy (accept_all or propose_events)

-----

     * Run Command
          ** node scrapers/discover-orgs-by-events.js
          ** Prerequisites:
               *** Event embeddings must exist (run scrapers/generate-embeddings.js first)
               *** Google Search API credentials must be configured in .env

-----

     * What Happens After Discovery
          ** Discovered organizations go through standard workflow:
               *** Status: Nominated (Pending Mission Review) → Human reviews org, TOU status, AI summary, and triggering event
               *** Human sees: tou_flag, tech_block_flag, ai_reasoning (summary), triggering_event_title, triggering_event_score, POC info
               *** If approved: Mission Approved (Request Not Sent) → Continue permission workflow
               *** If rejected for mission fit: Rejected by Mission
               *** If rejected due to org restrictions: Rejected by Org
          ** If organization is approved and goes Live:
               *** Build custom scraper for organization's events page
               *** Scrape ALL relevant events from org (not just the triggering event)
               *** Event handling based on event_policy setting

-----

     * Policy-Relevant Document Review
          ** When evaluating a new organization, check ALL policy-relevant documents for scraping restrictions
          ** Documents to check (look in website footer, "Legal", or "Privacy," or "About" sections):
               *** Terms of Use (TOU)
               *** Terms of Service (TOS)
               *** User Agreement
               *** Acceptable Use Policy
               *** Website Terms and Conditions
               *** Copyright Notice
               *** Privacy Policy (may reference automated access)

          ** Key phrases indicating scraping restrictions:
               *** "automated access" or "automated means"
               *** "bots, spiders, scrapers, crawlers"
               *** "data mining" or "data harvesting"
               *** "systematic retrieval" or "systematic collection"
               *** "machine-readable copies"
               *** "crawling prohibited"
               *** "robotic process" or "robotic access"


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 2: MISSION REVIEW
     * Go to Org By Status tab, filter by "Nominated (Pending Mission Review)"
          ** For each organization:
               *** Review AI reasoning (now shows org/event summary - updated 2026-01-11)
               *** Review Policy Restriction flag (⚠️ warning shown if tou_flag = TRUE)
               *** Review Tech Block flag (⚠️ warning shown if tech_block_flag = TRUE)
               *** Review Tech Rendering flag (⚙️ warning shown if tech_rendering_flag = TRUE) - renamed 2026-01-17
               *** Review Permission Denied flag (🚫 warning shown if permission_denied_flag = TRUE) - added 2026-01-17
               *** For event-based discoveries: Review triggering event title, score, and URL
               *** Decide: Approve or Reject
                    **** If Approve: Change status to "Mission Approved (Request Not Sent)"
                    **** If Reject for mission fit: Change status to "Rejected by Mission"
                    **** If Reject due to org restrictions: Change status to "Rejected by Org"
               *** Set event_policy: accept_all or propose_events


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT 
     * Getting permission to scrape

-----

     * For organizations with status `Mission Approved (Request Not Sent)`:

          ** Step 1: Add POC Contacts 
               *** Review POC info gathered during Initial Org Scan
               *** If no POC info, research contact info from org website or web search
               *** Click "Edit Contacts" button to go to Profile → Contacts tab
               *** Click "Add Contact" button
               *** Contact types (priority order for permission requests):
                    **** Main Contact: Primary point of contact
                    **** Legal/Permissions: Best for permission requests
                    **** Events: Alternative contact
                    **** Media/PR: Fallback option
                    **** Leadership: Last resort
                    **** Other: General inquiries

          ** Step 2: Generate Permission Request
                    **** Click "Edit Status" or "Generate Request" button
                    **** In Status & History tab, click "Generate Draft" button
                    **** Review and edit draft as needed
                    **** Click "Copy Draft" to copy to clipboard
                    **** Send email to appropriate contact

          ** Step 3: After Sending
                    **** Set Permission Requested Date
                    **** Copy final sent text to "Permission Request Final Text" field
                    **** Change status to `Permission Requested (Pending Org Response)`
                    **** Click "Save Permission Info"

-----

     * For organizations with status `Permission Requested (Pending Org Response)`:
               *** Go-Live Date is automatically calculated (sent + 1 week) - updated 2026-01-17 from 2 weeks

-----

      * If permission granted:
               *** Paste approval email into Permission Response Text
               *** Set Permission Response Date
               *** Set permission_type to "Explicit"
               *** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)`

-----

     * If permission rejected:
               *** Paste rejection into Permission Response Text
               *** Set Permission Response Date
               *** Set permission_denied_flag to TRUE (added 2026-01-17)
               *** Change status to `Rejected by Org`

-----

     * If no response after 1 week (updated 2026-01-17 from 2 weeks):
          >>> NEW FEATURE NEEDED: ALERT TO NOTIFY OWNER OF NEED TO ADJUDICATE<<<
               *** Set permission_type to "Implied"
               *** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)` or `Rejected by Mission` or `Rejected by Org`

-----

     * For organizations with status `Permission Granted (Not Live)`:
               *** Enable scraping in Status & History tab
               *** Change status to `Live (Scraping Active)`

               >>> NEW FEATURE NEEDED: If there is a change to the status, update all associated fields. 


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 4: EVENT SCRAPING
     * Enable Scraping

          ** Prerequisites:

              *** Status: `Live (Scraping Active)`

              *** `events_url` is set (or custom scraper knows where to look)

-----

     * Scraper Architecture (consolidated 2026-01-18)
          ** The scraping system uses a unified scanner/scraper approach:
               *** scrapers/scan-and-scrape-all-live-orgs.js - Unified CLI for scanning and scraping (NEW 2026-01-18)
               *** scrapers/org-scanner.js - Core scanning module for policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
          ** Universal AI-powered scraper handles all organizations (no custom scrapers needed)
          ** Database field scraper_key is deprecated (no longer used)

-----

     * Two Scan Scenarios (added 2026-01-14, updated 2026-01-18)
          ** The unified scan-and-scrape-all-live-orgs.js handles two different scan scenarios:

          ** Discovery Scan (new organizations via --domain):
               *** When: Google finds org/event, or manual add via domain
               *** Purpose: Learn about new organization
               *** Find events_url?: YES (don't have it yet)
               *** Full Policy Doc scan?: YES (first time)
               *** AI analysis?: YES (need org name/type)
               *** POC gathering?: YES (first time)
               *** Create DB record?: NO (shows info for manual add)
               *** Output status: Displays discovery info for human review

          ** Pre-Scrape Scan (existing organizations via --org or --all):
               *** When: Before every scrape of Live org
               *** Purpose: Verify still OK to scrape
               *** Find events_url?: Verify it still works
               *** Full Policy Doc scan?: Re-check for changes
               *** AI analysis?: NO (already have it)
               *** POC gathering?: NO (already have it)
               *** Update DB record?: YES (updates tou_scanned_date, auto-sets status if restrictions found)
               *** Output status: "OK to scrape" or "STOP" (safety gate failure)

-----

     * Auto-Status Update on Restriction Detection (updated 2026-01-17)
          ** When scanning a LIVE organization and restrictions are found:
               *** If tou_flag is set TRUE: Status auto-changes to "Rejected by Org"
               *** If tech_block_flag is set TRUE: Status auto-changes to "Rejected by Org"
               *** If tech_rendering_flag is set TRUE: Status auto-changes to "Rejected by Org" (changed from Nominated - 2026-01-17)
               *** Previous status is logged in tou_notes
               *** Scraping is halted immediately
          ** This protects against policy changes by organizations after initial approval
          ** Does NOT apply to Nominated organizations (flags are for human review during discovery)

-----

     * Scrape Flow (Per Organization) - updated 2026-01-17
          ** 1. Safety Gate Check (5 checks - updated from 3):
               *** Status must be "Live (Scraping Active)"
               *** tou_flag must be FALSE
               *** tech_block_flag must be FALSE
               *** tech_rendering_flag must be FALSE (added 2026-01-17)
               *** permission_denied_flag must be FALSE (added 2026-01-17)
          ** 2. Policy Doc & Privacy Check (if tou_url or privacy_url configured):
               *** Fetch ALL policy-relevant pages, scan for restriction keywords using context-aware detection
               *** If 403 error: auto-set tech_block_flag, auto-set status to "Rejected by Org", STOP
               *** If restrictions found: auto-set tou_flag, auto-set status to "Rejected by Org", STOP
               *** Update tou_scanned_date
          ** 3. Respectful Delay (5-8 seconds randomized)
          ** 4. Scrape Events Page
          ** 5. Deep scrape each event page
          ** 6. Identify and record changes to the event, such as date, time description, etc.
          ** 7. Check event against exclusion rules (training, political, etc.)
          ** 8. Apply event_policy (updated 2026-01-17):
               *** If accept_all: Create event with event_status "approved" (shows in public UI)
               *** If propose_events: Create event with event_status "nominated" (needs human review)
           
          ** 9. Save Events + Update last_scraped

-----

     * Run Scrapers (consolidated 2026-01-18)
          ** Option A: Scan + Scrape ALL Live Organizations (Recommended for batch)
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --all
              *** Features: Full scan via org-scanner.js, 5 safety gates, AI event extraction, summary report

          ** Option B: Scan Only ALL Live Organizations (no scraping)
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --all --scan-only

          ** Option C: Scan + Scrape Specific Organization
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --org "INSA"
              *** Features: Auto-detects org, runs pre-scrape policy doc check, 5 safety gates, AI event extraction

          ** Option D: Scan Only Specific Organization (no scraping)
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --org "CNAS" --scan-only

          ** Option E: Discover New Org by Domain
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --domain "csis.org"
              *** Features: Dedup check, full discovery scan, displays info for manual add

-----

     * Scraper Behavior (updated 2026-01-17)
          ** 1. Checks 5 safety gates (status, tou_flag, tech_block_flag, tech_rendering_flag, permission_denied_flag)
          ** 2. Checks Policy Doc and Privacy pages for restrictions (context-aware)
          ** 3. If restrictions found on Live org: auto-sets status to "Rejected by Org"
          ** 4. Fetches events page from `events_url`
          ** 5. Parses event data (title, date, time, location, URL)
          ** 6. Checks for duplicates by `source_id` AND by title+org+date (improved 2026-01-17)
          ** 7. Applies exclusion rules
          ** 8. Sets event_status based on event_policy (accept_all → approved, propose_events → nominated)
          ** 9. Saves new events to `events` collection
          ** 10. Updates `last_scraped` timestamp on organization

-----

     * Custom Scrapers (DEPRECATED 2026-01-18)
          ** Custom scrapers are no longer needed - universal AI scraper handles all organizations
          ** The scrapers/custom/ folder and index.js registry have been removed
          ** The scraper_key field in PocketBase is deprecated

-----

     * Enrich Events (Optional)
          ** After scraping, run AI enrichment:
              *** powershell
              *** node scrapers/enrich-events.js

          ** This adds:
              *** Topic tags
              *** Event type classification
              *** Speaker extraction

-----

     * Generate Embeddings (For Event-Based Discovery)
          ** Purpose: Create vector embeddings for semantic search AND event-based organization discovery
          ** Run Command: node scrapers/generate-embeddings.js
          ** This creates:
              *** Vector embeddings stored in event_embeddings collection
              *** Enables semantic search functionality
              *** Provides input data for event-based organization discovery
          ** How Embeddings Are Used:
              *** Semantic Search: Compare user query embedding to event embeddings
              *** Event-Based Discovery: Calculate "ideal event profile" from all embeddings, compare candidate events against it
          ** Cross-Reference: See EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE section

-----

     * After Scraping: Verify in Public UI
          ** 1. Open https://event-finder-ui-one.vercel.app in browser
          ** 2. Refresh the page to load new data from PocketBase
          ** 3. Verify new events appear correctly (only "approved" events show)
          ** 4. Check that dates, locations, and descriptions display properly


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCRAPING REQUIREMENTS (added 2026-01-18)

     * Purpose
          ** Define the requirements that MUST be true for scanning/scraping to work correctly
          ** Guide development and maintenance of scanner and scraper code
          ** Ensure ConOp, scanner, and scraper stay in sync

-----

     * SCRAPING THINGS THAT MUST BE TRUE

          ** Requirement 1: We look at all the places on a website where we might find restrictions
               *** TOU and Variants with all web suffixes/extensions
               *** Privacy Policy
               *** User Agreement
               *** Cookie Policy
               *** Code of Conduct
               *** API/Developer Terms
               *** Copyright/Intellectual Property notices
               *** Other legal pages
               *** Implementation: TOU_PATHS array (40 paths) + isLegalPageUrl() patterns in org-scanner.js
               *** Status: ✅ IMPLEMENTED (2026-01-18 - expanded from 19 to 40 paths)

-----

          ** Requirement 2: We look for the best terms/phrases/concepts to identify potential restrictions on each page we find in #1
               *** HIGH_CONFIDENCE_RESTRICTION_TERMS: Direct indicators that flag immediately
               *** CONTEXT_REQUIRED_TERMS: Words that need prohibition phrases nearby
               *** PROHIBITION_PHRASES: Language indicating something is forbidden
               *** Implementation: findRestrictions() function in org-scanner.js
               *** Status: ⚠️ NEEDS IMPROVEMENT - missing "reproduce", "distribute", "aggregate" detection

-----

          ** Requirement 3: We interpret those potential restrictions and control for false positives and variants
               *** EXCLUDED_CONTEXTS: Patterns that indicate false positives (e.g., "our chatbot", "research on")
               *** Context window checking (150 characters)
               *** Word boundary matching to avoid partial matches
               *** Implementation: checkForExcludedContext(), checkForProhibitionPhrase() in org-scanner.js
               *** Status: ⚠️ NEEDS IMPROVEMENT - CSIS false positive shows content pages being scanned as TOU pages

-----

          ** Requirement 4: We update records properly and save the complete sentence/phrase of the restriction for human review
               *** tou_flag: Boolean indicating restrictions found
               *** tou_notes: Detailed text with context snippets
               *** tou_url: URL where restrictions were found
               *** Implementation: scanTOU() function updates org record in PocketBase
               *** Status: ⚠️ NEEDS IMPROVEMENT - should save full sentences, not just snippets

-----

          ** Requirement 5: We maintain an audit log of scans and scan/scrape results so we can see when something changes and do not overwrite earlier findings
               *** Track scan date and version
               *** Preserve historical findings
               *** Detect changes between scans
               *** Implementation: NOT YET IMPLEMENTED
               *** Status: ❌ NOT IMPLEMENTED

-----

          ** Requirement 6: We improve scanning and scraping based on what we learn (new org paths, new org phrasing)
               *** Document new patterns discovered in the field
               *** Update TOU_PATHS when new legal page URLs are discovered
               *** Update detection terms when new restriction language is found
               *** Implementation: Manual process - update org-scanner.js and ConOp
               *** Status: ✅ PROCESS EXISTS (manual)

-----

          ** Requirement 7: We keep the Scanner and Scanner/Scraper files in sync so functionality is the same
               *** org-scanner.js: Core scanning logic (TOU detection, restriction finding)
               *** scan-and-scrape-all-live-orgs.js: Imports from org-scanner.js, adds batch processing
               *** Implementation: scan-and-scrape-all-live-orgs.js requires('./org-scanner')
               *** Status: ✅ IN SYNC (scan-and-scrape imports from org-scanner)

-----

          ** Requirement 8: We keep the ConOp and the Scanner and Scanner/Scraper files in sync
               *** ConOp documents TOU_PATHS → must match org-scanner.js TOU_PATHS
               *** ConOp documents detection terms → must match org-scanner.js constants
               *** ConOp documents logic flow → must match org-scanner.js functions
               *** Implementation: Manual process - update both when changes are made
               *** Status: ✅ IN SYNC (as of 2026-01-18)

-----

     * Requirements Summary Table
          ** Req 1 (Where to look): ✅ IMPLEMENTED
          ** Req 2 (What to look for): ⚠️ NEEDS IMPROVEMENT
          ** Req 3 (Interpret/false positives): ⚠️ NEEDS IMPROVEMENT
          ** Req 4 (Save evidence): ⚠️ NEEDS IMPROVEMENT
          ** Req 5 (Audit log): ❌ NOT IMPLEMENTED
          ** Req 6 (Learn and improve): ✅ PROCESS EXISTS
          ** Req 7 (Scanner files in sync): ✅ IN SYNC
          ** Req 8 (ConOp in sync): ✅ IN SYNC


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# POLICY-RELEVANT DOCUMENT SCANNING (added 2026-01-15)

     * Purpose
          ** Scan ALL legal/policy documents for scraping restrictions
          ** Use context-aware detection to avoid false positives
          ** Automatically update organization status when restrictions are found on Live orgs

-----

     * Terminology Update (2026-01-15)
          ** Old Term: "TOU Scan" → New Term: "Policy Document Scan"
          ** Old Term: "TOU Flag" → New Term: "Policy Restriction Flag"
          ** Rationale: Scanner checks ALL legal documents, not just Terms of Use

-----

     * Policy-Relevant URL Patterns (40 paths - Updated 2026-01-18)
          ** Primary Legal / Terms (10 paths): /terms, /terms-of-use, /terms-use, /terms-of-service, /tos, /terms-and-conditions, /conditions, /conditions-of-use, /site-terms, /website-terms
          ** Privacy (7 paths): /privacy, /privacy-policy, /data-privacy, /cookie-policy, /cookies, /gdpr, /ccpa
          ** Legal Pages (8 paths): /legal, /legal/terms, /legal/privacy, /legal-notice, /disclaimer, /copyright, /copyright-notice, /intellectual-property
          ** Policies (5 paths): /policies, /policies-and-procedures, /site-policies, /website-policies, /usage-policy
          ** User Agreement (5 paths): /user-agreement, /acceptable-use, /acceptable-use-policy, /aup, /code-of-conduct
          ** API / Developer (5 paths): /api-terms, /api-policy, /developer-terms, /developers/terms, /data-use-policy

-----

     * Content Page Exclusions
          ** The scanner excludes content pages that might have legal-sounding URLs but are not policy documents
          ** Excluded path prefixes: /topics/, /programs/, /events/, /news/, /blog/, /articles/, /research/, /publications/, /experts/, /issues/, /regions/, /podcasts/, /videos/, /projects/, /commentary/, /analysis/, /briefs/, /papers/
          ** Example: /topics/pharmaceutical-drug-policy/ is NOT a policy page (it's content about drug policy)
          ** Example: /policies-and-procedures/ IS a policy page (it contains site policies)

-----

     * Context-Aware Restriction Detection (added 2026-01-15)
          ** Problem: Keywords like "bot" or "scraping" can appear in contexts that are NOT restrictions
               *** Example: "Our chatbot can help you" - NOT a restriction
               *** Example: "Staff should refrain from representing candidates" - NOT about scraping
          ** Solution: Two-tier keyword detection system

          ** HIGH_CONFIDENCE_RESTRICTION_TERMS (flag immediately, no context needed):
               *** Direct scraping: "web scraping", "screen scraping", "data scraping", "content scraping"
               *** Explicit bot restrictions: "no bots", "no robots", "use of bots", "automated scraping"
               *** Data mining: "data mining", "data harvesting", "text mining"
               *** Bulk access: "bulk download", "bulk access", "mass download"
               *** AI/ML training: "train AI", "AI training", "model training", "language model"

          ** CONTEXT_REQUIRED_TERMS (only flag if near a prohibition phrase):
               *** Single words: "bot", "bots", "robot", "scraping", "crawler", "harvest", "automated"
               *** Must appear within 150 characters of a PROHIBITION_PHRASE to trigger flag

          ** PROHIBITION_PHRASES (indicate something is forbidden):
               *** Direct: "may not", "shall not", "must not", "prohibited", "not permitted", "forbidden"
               *** Agreement: "agree not to", "refrain from", "covenant not to"
               *** Permission: "without permission", "without authorization", "without consent"

          ** EXCLUDED_CONTEXTS (skip if found near keyword - likely false positive):
               *** Staff policies: "staff should", "employees must", "personnel may"
               *** Product descriptions: "our bot", "our chatbot", "virtual assistant"
               *** Policy content: "policy on", "research on", "article about"

-----

     * Detection Logic Flow
          ** Step 1: Check HIGH_CONFIDENCE terms → Flag immediately if found
          ** Step 2: Check CONTEXT_REQUIRED terms:
               *** Found keyword? → Check for nearby PROHIBITION_PHRASE (within 150 chars)
               *** Prohibition found? → Check for EXCLUDED_CONTEXT nearby
               *** No exclusion? → FLAG as restriction
          ** Step 3: Record all findings in tou_notes with context snippets

-----

     * Auto-Status Update Behavior
          ** For LIVE organizations only:
               *** If restrictions detected → Status changes to "Rejected by Org"
               *** Previous status recorded in tou_notes
               *** Scraping halted
          ** For NOMINATED organizations:
               *** Flags are set but status remains "Nominated (Pending Mission Review)"
               *** Human reviewer makes final decision


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# JAVASCRIPT RENDERING DETECTION (added 2026-01-17)

     * Purpose
          ** Detect websites that use JavaScript frameworks to render event content
          ** Flag organizations that require headless browser (Puppeteer) for scraping
          ** Prevent failed scrape attempts on Single Page Applications (SPAs)

-----

     * Problem Statement
          ** Many modern websites use JavaScript frameworks (React, Vue, Angular, Next.js) to render content
          ** Standard HTTP fetches return only the page shell - no actual event data
          ** Events are loaded via AJAX/JavaScript after the page renders in a browser
          ** Without detection, scrapers attempt to parse empty pages and find no events
          ** Example: New America's events page appears empty when fetched via HTTP but shows events in browser

-----

     * Detection Strategy
          ** The scanner checks BOTH the homepage AND the events page for JavaScript rendering
          ** Step 1.5: Check homepage for JS rendering indicators
          ** Step 3.5: If homepage passed, check events page specifically for JS rendering
          ** Events page check includes "event content detection" - verifies actual event data exists

-----

     * JavaScript Rendering Indicators
          ** HIGH CONFIDENCE - Framework Root Elements:
               *** Empty <div id="root"></div> (React)
               *** Empty <div id="app"></div> (Vue)
               *** <div id="__next"> (Next.js)
               *** <div id="__nuxt"> (Nuxt.js)
          ** HIGH CONFIDENCE - Framework Attributes:
               *** data-reactroot, data-react-helmet
               *** ng-app, ng-controller (Angular)
               *** v-app, data-v- (Vue)
               *** __NEXT_DATA__, __NUXT__
               *** window.__INITIAL_STATE__, window.__PRELOADED_STATE__
          ** HIGH CONFIDENCE - Noscript Warnings:
               *** "you need to enable javascript"
               *** "please enable javascript"
               *** "javascript is required"
               *** "this site requires javascript"
          ** MEDIUM CONFIDENCE - Content Analysis:
               *** Very little text content despite large HTML
               *** High script count with minimal text
               *** Multiple loading indicators

-----

     * Event Content Detection (for events pages specifically)
          ** When checking an events page, scanner looks for actual event content:
               *** Date patterns (January 15, 01/15/2026, 2026-01-15)
               *** Time patterns (2:00 PM, 10 AM)
               *** Registration text (Register now, RSVP)
               *** Event phrases (Join us for, Save the date, Add to calendar)
          ** If fewer than 2 indicators found → Page flagged as JS-rendered
          ** This catches "hybrid" sites where homepage uses SSR but events load via AJAX

-----

     * Database Field (updated 2026-01-17)
          ** Field Name: tech_rendering_flag (renamed from js_render_flag)
          ** Field Type: Bool
          ** Purpose: True if site requires JavaScript to render event content
          ** Set By: org-scanner.js during homepage and events page analysis
          ** Display: Admin Interface shows ⚙️ JS-RENDER badge and info box

-----

     * Auto-Status Update Behavior (updated 2026-01-17)
          ** For LIVE organizations with tech_rendering_flag newly detected:
               *** Status changes to "Rejected by Org" (changed from Nominated)
               *** Scraping is blocked by safety gates
               *** Human can manually override if Puppeteer scraper is available
          ** For NOMINATED organizations:
               *** Flag is set, status remains "Nominated (Pending Mission Review)"
               *** Human reviewer sees JS rendering warning during review

-----

     * Admin Interface Display (updated 2026-01-17)
          ** Dashboard: Shows count of Tech-Rendered Sites (renamed from JS-Rendered)
          ** Org Cards: ⚙️ JS-RENDER badge displayed
          ** Info Box: Warning about tech-rendered site requiring Puppeteer
          ** Status & History Tab: ⚙️ Tech-Rendered Site checkbox in Rejection Flags section
          ** Scrape Notes: Auto-populated with JS detection details

-----

     * Scanner Console Output
          ** When checking homepage:
               *** "🔍 Checking for JavaScript rendering..."
               *** "✅ Server-side rendered (standard scraping should work)" OR
               *** "⚠️ JavaScript-rendered site detected (high confidence)"
          ** When checking events page:
               *** "🔍 Checking events page for JavaScript rendering..."
               *** "✅ Events page is server-side rendered" OR
               *** "⚠️ Events page is JavaScript-rendered (high confidence)"
               *** "ℹ️ Homepage uses SSR but events page requires JS"

-----

     * Future Enhancement
          ** Build Puppeteer-based scrapers for JS-rendered sites
          ** Puppeteer scrapers would use headless Chrome to render JavaScript before extracting events


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING/SCRAPING ARCHITECTURE (added 2026-01-19)
     * Purpose
          ** Clarifies the relationship between scanning and scraping
          ** Documents which files do what
          ** Explains how scan logging works

-----

     * Key Definitions
          ** Scanning: Checking TOU, legal pages, restrictions, tech blocks, JS rendering
          ** Scraping: Actually pulling events from the website
          ** A scan does NOT pull events - it only checks if scraping is allowed
          ** A scrape always does a scan first (safety gate check)

-----

     * File Responsibilities
          ** org-scanner.js
               *** Does Scanning: YES
               *** Does Scraping: NO
               *** Role: Core scanning module - all scanning logic lives here
               *** Other files import from this file
          ** scan-and-scrape-all-live-orgs.js
               *** Does Scanning: YES (via import from org-scanner.js)
               *** Does Scraping: YES
               *** Role: Batch operations - scans then scrapes
               *** Imports scanner, calls scanner functions, then does its own scraping logic
          ** discover-orgs-by-events.js
               *** Does Scanning: YES (via import from org-scanner.js)
               *** Does Scraping: NO
               *** Role: Event-based org discovery
               *** Imports scanner functions for TOU checking
          ** scan-legal-pages-diagnostic.js
               *** Does Scanning: YES (via import from org-scanner.js)
               *** Does Scraping: NO
               *** Role: Diagnostic tool for testing legal page detection

-----

     * File Dependency Diagram
          ** org-scanner.js (CORE MODULE - Source of Truth)
               *** ↑ imported by scan-and-scrape-all-live-orgs.js
               *** ↑ imported by discover-orgs-by-events.js
               *** ↑ imported by scan-legal-pages-diagnostic.js
          ** Rule: org-scanner.js is never run for scraping - it only scans
          ** Rule: Other files import scanner functions, they do NOT duplicate them

-----

     * What Happens During Each Operation
          ** Scenario A: Manual Scan Only
               *** Command: node org-scanner.js --org "CSIS" --update-db
               *** Uses: org-scanner.js directly
               *** Does: Scan only (TOU, restrictions, etc.)
               *** Creates: scan_log entry (type = manual)
               *** Does NOT: Pull events
          ** Scenario B: Batch Scan + Scrape
               *** Command: node scan-and-scrape-all-live-orgs.js
               *** Uses: scan-and-scrape-all-live-orgs.js which imports org-scanner.js
               *** Step 1: Calls scanner.scanOrganization() → creates scan_log (type = pre-scrape)
               *** Step 2: If safety gates pass → scrapes events → updates last_scraped
          ** Scenario C: Discovery
               *** Command: node scan-and-scrape-all-live-orgs.js --domain example.org
               *** Uses: scan-and-scrape-all-live-orgs.js which imports org-scanner.js
               *** Does: Scan only (no scrape for new orgs)
               *** Creates: scan_log entry (type = discovery)
          ** Scenario D: Scheduled (Future)
               *** Command: Triggered by GitHub Actions or cron
               *** Creates: scan_log entry (type = scheduled)

-----

     * Scan Log Types (scan_logs.scan_type field)
          ** manual: Just a scan (ran org-scanner directly)
          ** pre-scrape: Scan performed before scraping (batch job)
          ** discovery: Scan of a new organization being evaluated
          ** scheduled: Automated scheduled scan (future feature)

-----

     * Database Fields Updated by Scanning vs Scraping
          ** Fields updated by SCANNING (org-scanner.js):
               *** tou_flag, tou_url, tou_notes, tou_scanned_date
               *** tech_block_flag
               *** tech_rendering_flag
               *** no_legal_pages_flag
               *** microsite_suspect_flag, microsite_suspect_reason
               *** restriction_source_urls, restriction_context
               *** events_url (discovered during scan)
               *** status (auto-changed to "Rejected by Org" if restrictions found)
          ** Fields updated by SCRAPING (scan-and-scrape-all-live-orgs.js):
               *** last_scraped (DateTime of last successful scrape)
               *** Events added to events collection

-----

     * Scan Logging (scan_logs collection)
          ** Purpose: Audit trail of every scan performed
          ** Created by: org-scanner.js createScanLog() function
          ** When created: Every time scanOrganization() runs with updateDb=true
          ** Contains: All flags, URLs, contexts, status changes, duration, full log
          ** Benefit: Can see scan history for each org over time


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# PUBLIC UI FEATURES
     * Header
          ** Event Finder logo/title (click to clear filters and go home)
          ** Search bar beside logo (searches title and description only)

-----

     * Sidebar Filters
          ** Event Format: Virtual / In-Person checkboxes
          ** Location filter: Appears when In-Person is checked (within X miles of ZIP)
          ** Date Range: Start date (defaults to today), End date (optional)
          ** View Results: button (🔍)
          ** More Filters: button (Topics, Regions, Organizations)
          ** Clear Filters: button (🚫)

-----

     * Event Cards Display
          ** Title: Event name
          ** Description: 2 lines max, pulled from database
          ** Dates: Full month format (e.g., "December 18, 2025" or "December 9-10, 2025")
          ** Organization: Linked to org website
          ** Location: City, ST format (extracts from title if location field is bad)
          ** Link: "More details and registration" (links to event page)

-----

     * Search Behavior
          ** Searches: title and description only (not org name, topics, regions, location)
          ** Short terms (3 chars or less like "AI") use word boundary matching to avoid false positives
          ** Multi-word searches use "OR" logic (any word can match)
               *** Example: "AI Cyber" returns events matching "AI" OR "Cyber"

-----

     * Location Display Logic:
          ** If `event_type` contains "virtual" → displays "Virtual"
          ** If `event_type` contains "hybrid" → displays "Hybrid - City, ST"
          ** If `location` field has valid City, ST → displays as-is
          ** If `location` field has bad value (like "in-person") → extracts City, ST from title if possible
          ** Fallback → "Location TBD"

-----

     * Description Display:
          ** Displayed on event cards with 2-line maximum (CSS truncation)
          ** HTML stripped before display
          ** Used for search (along with title)

-----

     * Search Behavior:
          ** Only searches `title` and `description` fields
          ** Does NOT search organization name, topics, regions, or location
          ** Short terms (≤3 chars like "AI") use word boundary matching to prevent false positives
          ** Multi-word searches use **OR logic** (any word can match)
          ** Example: "AI Cyber" returns events matching "AI" OR "Cyber"

-----

     * Event Visibility (updated 2026-01-17)
          ** Only events with event_status = "approved" are shown in the public UI
          ** Events with event_status = "nominated" or "rejected" are not visible to public


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
               *** Has its own node_modules and package.json
               *** Uses ROOT .env file (no separate .env needed)
               *** See "icon-worker Folder" section below for contents
          ** node_modules
               *** Installed JavaScript dependencies for root project. 
               *** Auto-generated by npm install. Never edit manually.
          ** scrapers
               *** All scraping, scanning, discovery, and enrichment scripts (consolidated 2026-01-14)
               *** Contains registry system, base scraper, org scanner, and custom scrapers
               *** See "scrapers Folder" section below for contents

-----

     * Configuration Files (Root Level)
          ** .env 
               *** Secret credentials (PocketBase URL, admin email/password, OpenAI API key, OPENAI_IMAGE_MODEL, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID). 
               *** NEVER commit to GitHub. 
               *** Each computer needs its own copy.
               *** Used by BOTH root scripts AND icon-worker scripts.
          ** .gitignore 
               *** Tells Git which files to ignore (like .env and node_modules).
          ** package.json
               *** Lists project dependencies and metadata. 
               *** Used by npm install.
          ** package-lock.json 
               *** Locks exact versions of dependencies. 
               *** Auto-generated.

-----

     * User Interface Files (Root Level)
          ** index.html
               *** The file Vercel serves to the public.
               *** Copy of event-finder-ui-v7.html.
               *** Deployed at https://event-finder-ui-one.vercel.app
          ** event-finder-ui-v7.html 
               *** Development version of the public UI.
               *** Copy to index.html when ready to deploy.
          ** admin-interface-v21.html (updated 2026-01-18)
               *** Admin dashboard for managing organizations, contacts, and events. 
               *** Internal use only.
               *** Features: 7 status values, 4 rejection flags consolidated, event review with Accept/Reject, 5 safety gates, duplicate detection display, organization deletion with safety checks
          ** logo.png
               *** UI logo asset

-----

     * Deprecated Files (Root Level)
          ** tou-scanner.deprecated.js
               *** DEPRECATED as of 2026-01-14
               *** Functionality merged into scrapers/org-scanner.js
               *** Kept for reference only; will be removed in future cleanup

-----

     * Cleanup Scripts (Root Level)
          ** cleanup-orphaned-events.js 
               *** Removes events that no longer have a valid parent organization.
          ** cleanup-duplicate-events.js (added 2026-01-17)
               *** Removes duplicate events based on title + organization + start_date
               *** Run with --dry-run to preview before deleting

-----

     * One-Time Fix Scripts (Root Level)
          ** fix-cfr-events.js (added 2026-01-17)
               *** One-time script to set CFR events to "nominated" status
               *** Used after adding event_status field

-----

     * Setup and Utility Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure.
          ** proxy-server.js 
               *** Local proxy server to handle CORS issues when testing scrapers locally.

-----

     * scrapers Folder (consolidated 2026-01-18, updated 2026-01-19)
          ** scrapers/ (main scripts)
               *** scan-and-scrape-all-live-orgs.js - Unified scan + scrape CLI (NEW 2026-01-18, replaces scrape-organization.js, scrape-all-organizations.js, index.js, base-scraper.js)
               *** org-scanner.js - Core scanning module for policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
               *** quality-audit.js - Quality audit script for duplicate detection and flag summary (NEW 2026-01-19)
               *** discover-orgs-by-events.js - Event-based organization discovery
               *** suggest-organizations.js - Profile-based organization discovery
               *** enrich-events.js - AI enrichment for event topics
               *** generate-embeddings.js - Creates AI embeddings for semantic search
          ** DELETED FILES (2026-01-18):
               *** scrape-organization.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** scan-organization.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** scrape-all-organizations.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** index.js - Scraper registry no longer needed
               *** base-scraper.js - Functionality merged into unified script
               *** TOU_Scanning_Code.js - Reference file, never executed
               *** custom/ folder - Custom scrapers no longer needed

-----

     * icon-worker Folder
          ** icon-worker/ (root files)
               *** node_modules/ - Separate dependencies for image generation
               *** src/ - Source code folder (see below)
               *** .env.example - Template showing required environment variables
               *** eng.traineddata - Tesseract OCR training data for English text detection (binary)
               *** Image_Generation_Safety_Abstraction_Policy_v2.7.md - Policy document
               *** package.json - Dependencies: sharp, tesseract.js, dotenv, node-fetch
               *** package-lock.json - Locked dependency versions
               *** README.md - Setup and usage instructions

          ** icon-worker/src/ (source code)
               *** generate-topic-icons.js - Main worker script
               *** create-topic-icon-records.js - Creates records for new topic combinations
               *** clear-icons.js - Clears icons to force regeneration
               *** cleanup-topic-combinations.js - Fixes malformed combination keys
               *** rules.js - Visual rules (TOPIC_STYLE, REGION_STYLE, etc.)
               *** policyEngine.js - Prompt construction logic
               *** validators.js - OCR, panel detection, downscale audit
               *** config.js - Environment variable loader (loads from ROOT .env)
               *** pbClient.js - PocketBase API helpers
               *** openaiImages.js - DALL·E 3 API wrapper


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCRIPTS

     * Permission & Organization Management (in scrapers/ folder)
          ** suggest-organizations.js
               *** Profile-based discovery: AI suggests new organizations based on existing approved ones
               *** Uses AI training knowledge to find similar organizations
               *** Sets discovery_method = "profile-based"
               *** Run: node scrapers/suggest-organizations.js
          ** discover-orgs-by-events.js
               *** Event-based discovery: Discovers organizations by finding similar events online
               *** Uses embeddings to score candidate events against "ideal event profile"
               *** Performs policy doc scan and tech block check during discovery
               *** Runs AI analysis to extract org name and generate summary (added 2026-01-11)
               *** Applies exclusion keyword filtering (added 2026-01-11)
               *** Sets discovery_method = "event-based"
               *** Populates triggering_event_title, triggering_event_score, triggering_event_url
               *** Status: Functional (updated 2026-01-14)
               *** Run: node scrapers/discover-orgs-by-events.js
          ** org-scanner.js (added 2026-01-14, updated 2026-01-17)
               *** Unified scanning module consolidating policy doc, tech block, events URL, POC, and AI analysis
               *** Context-aware restriction detection to avoid false positives (added 2026-01-15)
               *** Auto-status update: sets "Rejected by Org" when restrictions found on Live orgs (added 2026-01-15)
               *** JavaScript/tech rendering detection (renamed tech_rendering_flag 2026-01-17)
               *** Used by discover-orgs-by-events.js and can be called directly for manual scans
               *** Functions: scanOrganization(), scanTOU(), findAllLegalUrls(), findRestrictions(), gatherPOC(), analyzeWithAI()
               *** Key Constants: HIGH_CONFIDENCE_RESTRICTION_TERMS, CONTEXT_REQUIRED_TERMS, PROHIBITION_PHRASES, EXCLUDED_CONTEXTS
               *** Run: node scrapers/org-scanner.js (CLI wrapper coming soon)

-----

     * Scrapers (consolidated 2026-01-18, updated 2026-01-19)
          ** scan-and-scrape-all-live-orgs.js (NEW 2026-01-18)
               *** Unified scan + scrape CLI replacing multiple legacy scripts
               *** Handles: batch mode (--all), single org (--org), domain discovery (--domain)
               *** Smart detection: new org vs existing org
               *** Two scan modes: Discovery Scan (new orgs) vs Pre-Scrape Scan (existing orgs)
               *** AI-powered universal event extraction using gpt-4o-mini
               *** extractLinks() function extracts actual href URLs from HTML before AI processing
               *** Deep scrapes individual event pages for additional details
               *** Deduplication checks (source_id + title/org/date)
               *** 5 Safety gates: status, tou_flag, tech_block_flag, tech_rendering_flag, permission_denied_flag
               *** Sets event_status based on event_policy (accept_all→approved, propose_events→nominated)
               *** Command line options: --all, --org "name", --domain "x.org", --scan-only, --skip-scan
               *** Run batch: node scrapers/scan-and-scrape-all-live-orgs.js --all
               *** Run single: node scrapers/scan-and-scrape-all-live-orgs.js --org "INSA"
               *** Tested: INSA (8/8 events), CNAS (17/17 events), Potomac Officers Club (13/13 events), CFR (9 events)
          ** quality-audit.js (NEW 2026-01-19)
               *** Quality audit script for scanning ALL organizations (any status)
               *** Detects duplicate organizations by:
                    **** Domain match (e.g., cnas.org = www.cnas.org)
                    **** Name similarity (≥75% Levenshtein similarity)
               *** Compares "completeness scores" to determine which org to keep:
                    **** Event count (most important)
                    **** Status priority (Live > Granted > Requested > Approved > Nominated)
                    **** Filled fields count
                    **** Recent scraping activity
               *** Flags less-complete org with duplicate_flag = true
               *** Links to primary org via duplicate_of relation
               *** Summarizes all flag issues (TOU, tech block, JS rendering, permission denied, duplicates)
               *** Command line options:
                    **** --duplicates: Check for duplicate organizations only
                    **** --flags: Check for flag issues only (TOU, tech block, JS render)
                    **** --dry-run: Report findings without updating database
                    **** --help: Show usage information
               *** Run full audit: node scrapers/quality-audit.js
               *** Run dry run (no DB changes): node scrapers/quality-audit.js --dry-run
               *** Run duplicates only: node scrapers/quality-audit.js --duplicates
          ** org-scanner.js (added 2026-01-14, updated 2026-01-17)
               *** Core scanning module used by scan-and-scrape-all-live-orgs.js
               *** Multi-page policy doc scanning - findAllLegalUrls() finds ALL legal pages, scanTOU() scans each one
               *** Context-aware restriction detection - avoids false positives (added 2026-01-15)
               *** JavaScript rendering detection on homepage AND events page
               *** Event content detection - catches AJAX-loaded events pages with no actual event content
               *** Sets tou_flag=TRUE if ANY legal page contains restrictions
               *** Sets tech_rendering_flag=TRUE if JavaScript rendering detected
               *** Auto-updates status to "Rejected by Org" when any rejection flag detected on Live orgs
               *** Records all pages scanned in tou_notes field
               *** Technical block detection (403/401)
               *** Events URL discovery from homepage and triggering URLs
               *** POC info gathering
               *** AI-powered org analysis
          ** DELETED FILES (2026-01-18):
               *** scrape-organization.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** scan-organization.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** scrape-all-organizations.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** index.js - Scraper registry no longer needed
               *** base-scraper.js - Functionality merged into unified script
               *** custom/insa.js - Custom scrapers deprecated, universal scraper handles all orgs
          ** list-ready-orgs.js (added 2026-01-15)
               *** Helper script to list orgs with status "Permission Granted (Not Live)"
               *** Run: node list-ready-orgs.js

-----

     * Data Enrichment (in scrapers/ folder)
          ** enrich-events.js
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.)
               *** Run: node scrapers/enrich-events.js
          ** generate-embeddings.js
               *** Creates AI embeddings for semantic search functionality
               *** Also provides input data for event-based organization discovery
               *** Embeddings stored in event_embeddings collection
               *** Run: node scrapers/generate-embeddings.js

-----

     * Topic Management (Root Level)
          ** update-event-topics.js
               *** Updates events collection to use new topic names
               *** Maps old names to new names (e.g., "Defense Policy" → "Defense Policy & Intelligence")
               *** Removes duplicates after mapping
          ** update-topic-icons.js
               *** Updates topic_icons collection to use new topic names
               *** Updates topic_combination field with new naming convention

-----

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

-----

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
               *** Loads environment variables from ROOT .env file
          ** pbClient.js
               *** PocketBase API helpers (login, fetch, upload, update)
          ** openaiImages.js
               *** OpenAI DALL·E 3 API wrapper for image generation

-----

     * Setup Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure
               *** Creates icon-worker/ and icon-worker/src/ directories
               *** Generates template .env file with placeholders
               *** Displays instructions for copying files and installing dependencies

-----

     * Cleanup
          ** cleanup-orphaned-events.js
               *** Removes events that no longer have a valid parent organization
          ** cleanup-bad-events.js
               *** Removes malformed or invalid event records from the database
          ** cleanup-duplicate-events.js (added 2026-01-17)
               *** Removes duplicate events based on title + organization + start_date
               *** Keeps oldest record, deletes newer duplicates
               *** Run with --dry-run first to preview

-----

     * Utilities
          ** proxy-server.js
               *** Local proxy server to handle CORS issues when testing scrapers locally


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# GITHUB ACTIONS
     * Workflow: Scrape Events Daily
          ** File: .github/workflows/scrape-events.yml
          ** Status: NEEDS UPDATE (workflow references old script, update to use scan-and-scrape-all-live-orgs.js)
          ** Schedule: Runs daily at 11:30 PM EST (04:30 UTC) - changed to avoid peak server hours
          ** What it does:
               *** Sets up Node.js environment
               *** Installs dependencies
               *** Runs scrapers/scan-and-scrape-all-live-orgs.js --all
          ** Secrets Required (in GitHub repo settings):
               *** POCKETBASE_URL
               *** POCKETBASE_ADMIN_EMAIL
               *** POCKETBASE_ADMIN_PASSWORD
               *** OPENAI_API_KEY

-----

     * Manual Trigger
          ** Go to GitHub repo → Actions tab
          ** Select "Scrape Events Daily" workflow
          ** Click "Run workflow" button
          ** Useful for: Testing, immediate updates

-----

     * Viewing Logs
          ** Go to GitHub repo → Actions tab
          ** Click on specific workflow run
          ** Expand "Run scraper" step to see output


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# POCKETBASE COLLECTIONS AND VALUES

     * contacts Collection - Stores POC contacts for each organization.

          ** Field Name: name
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Contact's full name

          ** Field Name: email
          ** Field Type: Email
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Primary email address

          ** Field Name: phone
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 20
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Phone number

          ** Field Name: title
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Job title/position

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → organizations
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: false
          ** Setting - Nonempty: on 
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Link to parent organization

          ** Field Name: contact_type
          ** Field Type: Select
          ** Setting - Values: Main Contact, Legal/Permissions, Events, Media/PR, Leadership, Other
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Role/type of contact

          ** Field Name: source
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 255
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Where contact info was found

-----

     * DateTime Field & Settings:
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

          ** Current Status of organizations as of 2025-12-07
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

-----

     * event_embeddings Collection - Stores AI embeddings for semantic search and event-based organization discovery.
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
          ** Field Purpose/Notes: OpenAI embedding vector (1536 dimensions)

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

          ** How Embeddings Are Used:
               *** Semantic Search: User query is converted to embedding, compared to event embeddings via cosine similarity
               *** Event-Based Discovery: All event embeddings are averaged to create "ideal event profile", candidate events are compared against this profile

-----

     * events Collection - Stores scraped event data.
          ** Field Name: title
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Event title
          ** UI Display: ✅ Displayed prominently

          ** Field Name: description
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event description
          ** UI Display: ✅ Displayed (2 lines, truncated)

          ** Field Name: url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Link to event details
          ** UI Display: ✅ "More details and registration" link

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → organizations
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: false
          ** Setting - Nonempty: off 
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Parent organization
          ** UI Display: ✅ Org name displayed with link

          ** Field Name: start_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Event start date
          ** UI Display: ✅ Displayed (formatted)

          ** Field Name: end_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Event end date
          ** UI Display: ✅ Displayed if multi-day

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

          ** Field Name: event_status (added 2026-01-17)
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): approved, nominated, rejected
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Event review status - approved shows in public UI, nominated needs review, rejected hidden but stored
          ** UI Display: ❌ Internal use only (determines public visibility)

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

          ** Field Name (text box): countries
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

          ** Field Name: location  
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

          ** Field Name: created   >>>THIS IS NOT IN THE EVENTS COLLECTION <<<
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When record was created
          ** UI Display: ❌ Internal use only

          ** Field Name: updated  >>>THIS IS NOT IN THE EVENTS COLLECTION <<<
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When record was updated
          ** UI Display: ❌ Internal use only


          ** Current Status of events as of 2025-12-07          
               *** 45 Scraped event data 

-----

     * image_generation_errors Collection - Tracks errors during DALL·E icon generation for debugging and retry logic.

          ** Field Name: record_id
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: The PocketBase record ID of the topic_icons record that failed

          ** Field Name: topic_combination
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: The topic combination key (e.g., "Cybersecurity|Europe/Eurasia||NATO")

          ** Field Name: error_type
          ** Field Type: Select
          ** Setting - Values: ocr, panels, downscale, api_error, network, unknown
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Category of error that occurred during generation

          ** Field Name: error_message
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Detailed error message for debugging

          ** Field Name: prompt_used
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: The DALL·E prompt that caused the error

          ** Field Name: attempt_number
          ** Field Type: Number
          ** Setting - Min: 1
          ** Setting - Max: 10
          ** Setting - Nonzero: on
          ** Setting - Presentable: off
          ** Setting - No decimals: on
          ** Field Purpose/Notes: Which retry attempt failed (1-6 typically)

          ** Field Name: policy_version
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Version of policyEngine used (e.g., "v2.7")

-----

     * organizations Collection - Stores organization data.

          ** Field Name:  name 
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 200
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Organization full name (AI-extracted for event-based discovery)

          ** Field Name: org_type
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Think Tank, Trade Association, Professional Organization, Civilian Government Agency, Military/Defense Agency, University/Academic, News/Media, Non-profit, Corporation, Other
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Organization classification

          ** Field Name: description
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Organization description

          ** Field Name:  website 
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Main organization website

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
          ** Setting - Choices (text box, comma separated): Nominated (Pending Mission Review), Mission Approved (Request Not Sent), Permission Requested (Pending Org Response), Permission Granted (Not Live), Rejected by Mission, Rejected by Org, Live (Scraping Active)
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: on  
          ** Setting - Presentable: on  
          ** Field Purpose/Notes: Current workflow status (7 values as of 2026-01-15)

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
          ** Field Purpose/Notes: AI-generated summary of org and events (updated 2026-01-11)

          ** Field Name: similarity_score 
          ** Field Type: Number 
          ** Setting - Min: 0
          ** Setting - Max: 100
          ** Setting - Nonzero: off 
          ** Setting - Presentable: off 
          ** Setting - No decimals: off 
          ** Field Purpose/Notes: Profile similarity to existing orgs (0-100) 

          ** Field Name: discovery_method
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): manual, profile-based, event-based
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: How the organization was discovered
          ** Added: 2026-01-11

          ** Field Name: triggering_event_title
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: For event-based discovery: Title of event that triggered org nomination
          ** Added: 2026-01-11

          ** Field Name: triggering_event_score
          ** Field Type: Number 
          ** Setting - Min: 0
          ** Setting - Max: 100
          ** Setting - Nonzero: off 
          ** Setting - Presentable: off 
          ** Setting - No decimals: off 
          ** Field Purpose/Notes: For event-based discovery: Cosine similarity score (0-100) of triggering event
          ** Added: 2026-01-11

          ** Field Name: triggering_event_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: For event-based discovery: URL to the event that triggered org nomination
          ** Added: 2026-01-11

          ** Field Name: tou_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if any policy-relevant document (TOU, TOS, User Agreement, Privacy Policy, etc.) may prohibit scraping. Set during Initial Org Scan. Does NOT auto-reject during discovery; flags for human review. Auto-sets status to "Rejected by Org" if detected on Live org (added 2026-01-15).

          ** Field Name: tech_block_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if site returns 403/401 errors (technically blocks access). Set during Initial Org Scan. Does NOT auto-reject during discovery; flags for human review. Auto-sets status to "Rejected by Org" if detected on Live org (added 2026-01-15).
          ** Added: 2026-01-05

          ** Field Name: tech_rendering_flag (renamed from js_render_flag - 2026-01-17)
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if site uses JavaScript to render event content (React, Vue, Angular, Next.js, etc.). Set during Initial Org Scan when homepage or events page shows JS rendering indicators. Auto-sets status to "Rejected by Org" if detected on Live org (updated 2026-01-17 from Nominated). Requires headless browser (Puppeteer) for scraping.
          ** Added: 2026-01-17 (renamed from js_render_flag)

          ** Field Name: permission_denied_flag (added 2026-01-17)
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if organization explicitly denied permission to scrape. Set manually via Admin Interface when org responds negatively to permission request. Auto-sets status to "Rejected by Org" when set on Live org.
          ** Added: 2026-01-17

          ** Field Name: duplicate_flag (added 2026-01-19)
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if organization is identified as a duplicate of another org. Set by quality-audit.js script when domain or name match detected. Less-complete org gets flagged; more-complete org is kept as primary.
          ** Added: 2026-01-19

          ** Field Name: duplicate_of (added 2026-01-19)
          ** Field Type: Relation
          ** Setting - Select Collection: organizations
          ** Setting - Single/Multiple: Single
          ** Setting - Cascade delete: off
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Points to the primary (more complete) organization that this org is a duplicate of. Set by quality-audit.js script. Used by Admin Interface to show link to primary org for manual merge/delete workflow.
          ** Added: 2026-01-19

          ** Field Name: tou_scanned_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When policy-relevant pages were last scanned
          ** Added: 2026-01-05

          ** Field Name: tou_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: URL to Terms of Use page (primary policy doc) for automated scanning
          ** Added: 2026-01-06

          ** Field Name: privacy_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: URL to Privacy Policy page for automated scanning
          ** Added: 2026-01-06

          ** Field Name: tou_notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Notes about all policy-relevant documents reviewed (TOU, TOS, User Agreement, Acceptable Use Policy, Privacy Policy, etc.), which pages were scanned, and any restrictions found. Includes context-aware detection results (added 2026-01-15).

          ** Field Name: scrape_notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Auto-populated by scanner with technical scraping details. Includes JS rendering detection results, event content analysis, and other scraping-relevant observations.
          ** Added: 2026-01-17

          ** Field Name: scraper_key
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: DEPRECATED as of 2026-01-18. Was used to map organization to custom scraper in registry. Universal AI scraper now handles all organizations. Field retained for backwards compatibility but no longer used.
          ** Added: 2026-01-06
          ** Deprecated: 2026-01-18

          ** Field Name: go_live_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Calculated deadline (permission_requested_date + 7 days) for implied permission (updated 2026-01-17 from 14 days)
          ** Added: 2026-01-06

          ** Field Name: permission_type
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Explicit, Implied
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Type of permission received - Explicit (org granted) or Implied (no response after wait period)
          ** Updated: 2026-01-17 (removed "Implied (No Response)" - simplified to just "Implied")

          ** Field Name: event_policy
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): accept_all, propose_events
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: How to handle events from this org (accept_all → event_status=approved, propose_events → event_status=nominated)
          ** Added: 2026-01-11

          ** Status Field Values (organization.status) - Updated 2026-01-15
               *** Nominated (Pending Mission Review): AI-suggested, awaiting review
               *** Mission Approved (Request Not Sent): Approved, need to send permission request
               *** Permission Requested (Pending Org Response): Email sent, waiting for response
               *** Permission Granted (Not Live): Permission received, not yet scraping
               *** Rejected by Mission: Does not fit project mission/focus
               *** Rejected by Org: Organization blocked us (TOU restrictions, tech blocks, tech rendering, denied permission)
               *** Live (Scraping Active): Actively being scraped

          ** Permission Type Values (organization.permission_type) - Updated 2026-01-17
               *** (empty): Not yet determined
               *** Explicit: Organization granted permission
               *** Implied: No response after 1 week wait period

          ** Rejection Flags (4 flags - consolidated 2026-01-17)
               *** tou_flag: Policy document restrictions found
               *** tech_block_flag: 403/401 technical block
               *** tech_rendering_flag: JavaScript rendering required (renamed from js_render_flag)
               *** permission_denied_flag: Org explicitly denied permission (added 2026-01-17)

          ** Quality Flags (added 2026-01-19)
               *** duplicate_flag: Organization is a duplicate of another org (set by quality-audit.js)
               *** duplicate_of: Relation pointing to the primary org to keep

          ** DELETED FIELD: alert_type (removed 2026-01-17)
               *** Previously: Select with values tou_restriction, tech_block, ready_to_activate
               *** Functionality replaced by individual flag fields

-----

     * settings Collection - Stores application-level settings like the permission request template.
          ** Field Name: key
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Setting identifier (e.g., "permission_request_template")

          ** Field Name: value
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Setting content (e.g., email template)

          ** Current Record:
               *** key: permission_request_template
               *** value: The full permission request email template with [ORGANIZATION], [WEBSITE], etc. placeholders

-----

     * topic_icons Collection - Stores AI-generated icons for unique topic/region/country/org combinations.
          ** Field Name: topic_combination
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Unique key format: "Topic|Region|Country|TransnationalOrg" (pipes separate elements)

          ** Field Name: topics
          ** Field Type: Select
          ** Setting - Choices: (same as events.topics)
          ** Setting - Single/multiple: Multiple
          ** Setting - Max select: 13
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: regions
          ** Field Type: Select
          ** Setting - Choices: (same as events.regions)
          ** Setting - Single/multiple: Multiple
          ** Setting - Max select: 10
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: countries
          ** Field Type: Select
          ** Setting - Choices: (same as events.countries)
          ** Setting - Single/multiple: Multiple
          ** Setting - Max select: 196
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: transnational_org (NOTE: singular, not plural like events collection)
          ** Field Type: Select
          ** Setting - Choices: (same as events.transnational_orgs)
          ** Setting - Single/multiple: Multiple
          ** Setting - Max select: 28
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: icon_file
          ** Field Type: File
          ** Setting - Max size (bytes): 5242880 (5 MB)
          ** Setting - MIME types: image/png
          ** Setting - Thumbs: BLANK
          ** Setting - Max select: 1
          ** Setting - Protected: off
          ** Setting - Nonempty: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: The AI-generated icon image

          ** Field Name: prompt_used
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: The DALL·E prompt that generated this icon

          ** Field Name: compliance_notes
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Policy version and validation results


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# FILES - ROOT LEVEL

     * Files - Configuration

-----

     * Name: .env
     * Type: Environment Variables
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env
     * Function/Purpose: Secret credentials - NEVER commit to GitHub

-----

     * Name: .gitignore
     * Type: Git Configuration
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.gitignore
     * Function/Purpose: Tells Git which files to ignore

-----

     * Name: package.json
     * Type: NPM Configuration
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\package.json
     * Function/Purpose: Lists project dependencies

-----

     * Name: package-lock.json
     * Type: NPM Lock File
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\package-lock.json
     * Function/Purpose: Locks exact dependency versions

-----

     * Files - User Interface

-----

     * Name: index.html
     * Type: HTML Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\index.html
     * Function/Purpose: Public UI served by Vercel

-----

     * Name: event-finder-ui-v7.html
     * Type: HTML Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\event-finder-ui-v7.html
     * Function/Purpose: Development version of public UI

-----

     * Name: admin-interface-v17.html (updated 2026-01-17)
     * Type: HTML Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\admin-interface-v17.html
     * Function/Purpose: Admin dashboard (internal use) - Updated 2026-01-17 with consolidated rejection flags, event review with Accept/Reject, 5 safety gates

-----

     * Name: logo.png
     * Type: Image
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\logo.png
     * Function/Purpose: UI logo asset

-----

     * Files - Deprecated Scripts (Root Level)

-----

     * Name: tou-scanner.deprecated.js
     * Type: JavaScript Script (DEPRECATED)
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\tou-scanner.deprecated.js
     * Function/Purpose: DEPRECATED - Functionality merged into scrapers/org-scanner.js (2026-01-14)

-----

     * Files - Cleanup Scripts (Root Level)

-----

     * Name: cleanup-orphaned-events.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\cleanup-orphaned-events.js
     * Function/Purpose: Removes orphaned events

-----

     * Name: cleanup-duplicate-events.js (added 2026-01-17)
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\cleanup-duplicate-events.js
     * Function/Purpose: Removes duplicate events based on title+org+date, run with --dry-run first

-----

     * Name: fix-cfr-events.js (added 2026-01-17)
     * Type: JavaScript Script (one-time use)
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\fix-cfr-events.js
     * Function/Purpose: One-time script to set CFR events to nominated status after adding event_status field

-----

     * Files - Utility Scripts (Root Level)

-----

     * Name: proxy-server.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\proxy-server.js
     * Function/Purpose: Local CORS proxy for testing

-----

     * Name: setup-icon-worker.ps1
     * Type: PowerShell Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\setup-icon-worker.ps1
     * Function/Purpose: Creates icon-worker folder structure


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS BY DOMAIN

     * How to Use:
          ** Start of session: Tell Claude which domain, Claude reads that handoff + relevant ConOp sections
          ** End of session: Claude updates BOTH the ConOp content AND the relevant handoff section
          ** This keeps everything in sync in one document

-----

     * SCRAPING
          ** Relevant ConOp Sections: SCRAPING REQUIREMENTS, ORGANIZATION WORKFLOW 4: EVENT SCRAPING, KEY FILES (scrapers/), POLICY-RELEVANT DOCUMENT SCANNING, JAVASCRIPT RENDERING DETECTION
          ** Files to Attach to New Chat:
               *** This ConOp document
               *** scrapers/scan-and-scrape-all-live-orgs.js
               *** scrapers/org-scanner.js
               *** scrapers/quality-audit.js
               *** admin-interface-v21.html
          ** Last Session: 2026-01-18 (evening)
               *** Created SCRAPING REQUIREMENTS section in ConOp with 8 requirements
               *** Expanded TOU_PATHS from 19 to 40 paths to check all places restrictions might be
               *** Added paths: /terms-use, /gdpr, /ccpa, /intellectual-property, /copyright, /aup, /code-of-conduct, /api-terms, /developer-terms, etc.
               *** Synced isLegalPageUrl() patterns with TOU_PATHS (was out of sync)
               *** Synced legalLastSegments list with TOU_PATHS
               *** Added more suffix patterns for org-specific URLs (e.g., -code-of-conduct, -legal-notice)
               *** Previous session (2026-01-18 afternoon): Analyzed 12 TOU-flagged orgs, found CSIS false positive (content page scanned as TOU), identified gaps in scanner
          ** Current Status: 
               *** Requirement 1 (Where to look): ✅ IMPLEMENTED - 40 paths
               *** Requirement 2 (What to look for): ⚠️ NEEDS IMPROVEMENT - missing "reproduce", "distribute"
               *** Requirement 3 (Interpret/false positives): ⚠️ NEEDS IMPROVEMENT - content pages being scanned
               *** Requirement 4 (Save evidence): ⚠️ NEEDS IMPROVEMENT - need full sentences
               *** Requirement 5 (Audit log): ❌ NOT IMPLEMENTED
               *** Requirement 6 (Learn and improve): ✅ PROCESS EXISTS
               *** Requirement 7 (Scanner files in sync): ✅ IN SYNC
               *** Requirement 8 (ConOp in sync): ✅ IN SYNC
          ** Blocked/Broken: 
               *** GitHub Actions workflow still references old scrape-all-organizations.js
               *** Content pages (not TOU pages) being scanned for restrictions (caused CSIS false positive)
          ** Next Steps (in order):
               *** Requirement 2: Add RESTRICTED_ACTIONS detection ("reproduce", "distribute", "aggregate", etc.)
               *** Requirement 3: Add TOU page content validation (verify page IS a TOU before scanning)
               *** Requirement 3: Add sentence-level context analysis (distinguish prohibition vs description)
               *** Requirement 4: Save full sentence evidence in tou_notes
               *** Requirement 5: Design audit log for tracking scan history

-----

     * IMAGE GENERATION
          ** Relevant ConOp Sections: IMAGE GENERATION PROGRAM ARCHITECTURE, KEY FILES (icon-worker/)
          ** Key Files: generate-topic-icons.js, rules.js, policyEngine.js, validators.js
          ** Last Session: 
          ** Current Status: Functional
          ** Blocked/Broken: None known
          ** Next Steps: 

-----

     * ORG DISCOVERY
          ** Relevant ConOp Sections: EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE, WORKFLOW 1A/1B
          ** Key Files: discover-orgs-by-events.js, suggest-organizations.js, org-scanner.js
          ** Last Session: 2026-01-18
               *** Architecture consolidation removed old files that discover-orgs-by-events.js may have referenced
               *** discover-orgs-by-events.js has its own scanning logic - does not depend on deleted files
          ** Current Status: Functional
          ** Blocked/Broken: None known
          ** Next Steps: Verify discover-orgs-by-events.js still works after file cleanup

-----

     * ADMIN INTERFACE
          ** Relevant ConOp Sections: ADMIN INTERFACE, WORKFLOW - STATUS REFERENCES
          ** Key Files: admin-interface-v21.html (updated 2026-01-18)
          ** Last Session: 2026-01-18
               *** Created v21 with organization deletion features:
                    **** Profile header: Added 🗑️ Delete Org button (next to Back button)
                    **** Org By Status cards: Added 🗑️ Delete button (far right position)
                    **** Organizations cards: Added 🗑️ Delete button (far right position)
                    **** Delete includes safety checks (shows event/contact counts, requires 2-step confirmation)
                    **** Changed Approve Mission button from red to green (btn-success)
               *** Previous v20 (2026-01-19): Duplicate detection features (badges, info boxes, filter)
               *** Previous v17 (2026-01-17): 4 rejection flags, event review with Accept/Reject
          ** Current Status: Functional with delete capability, duplicate display, 4 rejection flags, event review
          ** Blocked/Broken: Event status filter not working correctly - shows "No Events Found" when filtering by specific status + org combination even when events exist
          ** Next Steps: 
               *** Debug event_status filter issue
               *** Verify event_status field values in database

-----

     * PUBLIC UI
          ** Relevant ConOp Sections: PUBLIC UI FEATURES, VERCEL DEPLOYMENT
          ** Key Files: index.html, event-finder-ui-v7.html
          ** Last Session: 
          ** Current Status: Live on Vercel
          ** Blocked/Broken: None known
          ** Next Steps: 
               *** Update public UI to only show events with event_status = "approved"
               *** Migrate to BalanceFWD.com domain

-----

     * ORG WORKFLOW / PERMISSIONS
          ** Relevant ConOp Sections: WORKFLOWS 1-4, STATUS REFERENCES, EVENT POLICY
          ** Key Files: Admin interface (Status & History tab)
          ** Last Session: 2026-01-17
               *** Updated permission wait time from 2 weeks to 1 week
               *** Updated permission_type values to "Explicit" and "Implied" (removed "No Response" qualifier)
               *** Added permission_denied_flag for when orgs explicitly deny permission
               *** go_live_date now calculated as permission_requested_date + 7 days (was 14)
          ** Current Status: Functional with updated wait times
          ** Blocked/Broken: None known
          ** Next Steps: Add alert feature for go-live date notifications

-----

     * POCKETBASE SCHEMA
          ** Relevant ConOp Sections: POCKETBASE COLLECTIONS AND VALUES
          ** Key Files: PocketBase Admin UI
          ** Last Session: 2026-01-19
               *** Added duplicate_flag field to organizations collection:
                    **** Field type: Bool
                    **** Purpose: Flags orgs identified as duplicates by quality-audit.js
                    **** Set automatically by quality audit script
               *** Added duplicate_of field to organizations collection:
                    **** Field type: Relation (to organizations)
                    **** Single value
                    **** Purpose: Points to the primary org this is a duplicate of
                    **** Set automatically by quality audit script
               *** Previous session (2026-01-17): 4 rejection flags, event_status field
          ** Current Status: Schema updated with duplicate detection fields
          ** Blocked/Broken: None
          ** Next Steps: None immediate




@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SUMMARY OF BUSINESS NEEDS AND FUTURE ACTIONS

     * Incorporate - USG

     * Trademark - USPTO: Logo

     * Trademark - USPTO: Name / BalanceFWD

     * Trademark - USPTO: Name / Balance Forward

     * Taxes



