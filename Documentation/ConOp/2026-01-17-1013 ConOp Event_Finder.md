@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT NAME:  
2026-01-17-ConOp_Event_Finder.md


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

     * File: admin-interface-v16.html (updated 2026-01-17)

-----

     * Access: Open locally in browser, requires PocketBase admin login

-----

     * Features:
          ** Header: "Event Finder Admin" - clickable, returns to Dashboard from anywhere
          ** 5 Main Tabs: Dashboard, Org By Status, Organizations, Contacts, Events
          ** Organization Profile Page with 4 sub-tabs

-----

     * Tab: Dashboard
          ** Stats overview: Total Orgs, Events, Nominated (Pending), Live (Scraping), Tech Blocked
          ** Status breakdown by count (7 statuses as of 2026-01-15)
          ** Tech Blocked count (organizations with tech_block_flag = true)
          ** JS-Rendered Sites count (organizations with js_render_flag = true) - added 2026-01-17

-----

     * Tab: Org By Status
          ** Filter dropdown: All, plus 7 status values (updated 2026-01-15)
               *** Nominated (Pending Mission Review)
               *** Mission Approved (Request Not Sent)
               *** Permission Requested (Pending Org Response)
               *** Permission Granted (Not Live)
               *** Rejected by Mission
               *** Rejected by Org
               *** Live (Scraping Active)
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
               *** Org name (links to Profile)
               *** Status badge
               *** Description
               *** Website
               *** Phone (from Main Contact or non-Leadership contact)
               *** Status dropdown (quick change)
               *** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events

-----

     * Tab: Contacts
          ** List of all contacts across organizations
          ** Add Contact button
          ** Edit/Delete buttons per contact

-----

     * Tab: Events
          ** Filter by organization
          ** List of all events with details
          ** Sort by:
               *** Org Name
               *** Date of Event

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
               *** Permission Type dropdown
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
               *** Discovery Info (if event-based):
                    **** Triggering Event Title
                    **** Triggering Event Score
                    **** Triggering Event URL
               *** Policy Document Assessment (renamed from TOU Assessment - updated 2026-01-15):
                    **** Policy Docs Scanned Date (auto-set when flags checked)
                    **** Policy Restriction Flag checkbox (sets tou_flag = true)
                    **** Technical Block checkbox (sets tech_block_flag = true)
                    **** Policy Notes (shows all documents scanned and restrictions found)
                    **** Save Policy Info button
                    **** "Mark as Technically Blocked" button (one-click to set all block fields)
                    **** Auto-Status Update: When Policy Restriction or Tech Block flag is set, status auto-changes to "Rejected by Org" (added 2026-01-15)
               *** Permission Request:
                    **** Permission Requested Date
                    **** Go-Live Date (auto-calculated: sent + 2 weeks)
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
                    **** JS-Rendered Site checkbox (sets js_render_flag = true) - added 2026-01-17
                    **** Scrape Notes (auto-populated by scanner when JS rendering detected)
                    **** Manual Notes
               *** Change Status dropdown

          ** Sub-tab: Events
               *** Org info section (name, status, website, AI reasoning)
               *** Event count badge
               *** List of events from this organization
               *** Event Policy dropdown (change from event screen)
               *** Reject Event button per event

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
                    **** Input: Policy-relevant page URLs found from homepage or common patterns
                    **** Process: Fetch ALL policy-relevant pages, scan each for restriction keywords using context-aware detection
                    **** Output: tou_flag (TRUE if ANY page contains restrictions), tou_notes (specific phrases found)
                    **** Ethical: Reading legal documents to comply with them is appropriate; we're checking their rules
               *** Step B3: Gather POC Info
                    **** If NO restrictions: Fetch About/Contact pages, extract POC from HTML
                    **** If restrictions found: Use web search for POC (LinkedIn, Wikipedia, etc.)
                    **** Output: POC info (name, email, phone) or null
               *** Step B4: AI Analysis for Org Name and Summary (Added 2026-01-11)
                    **** Input: Homepage HTML, domain, triggering event title
                    **** Process: AI extracts org_name (actual org, not event), org_type, summary
                    **** Output: Org name, org type, summary for ai_reasoning field
                    **** AI looks for: "Presented by", "Hosted by", "A program of", copyright notices
               *** Step B5: Create Organization Record
                    **** Input: All gathered information
                    **** Process: Save to organizations collection
                    **** Output: New organization record with:
                         ***** status = "Nominated (Pending Mission Review)" (ALWAYS - regardless of flags)
                         ***** name = AI-extracted org name (from B4)
                         ***** ai_reasoning = AI-generated summary (from B4)
                         ***** tou_flag = TRUE or FALSE
                         ***** tech_block_flag = TRUE or FALSE
                         ***** tou_notes = Specific restrictions found or "No restrictions found"
                         ***** discovery_method = "event-based"
                         ***** triggering_event_title, triggering_event_score, triggering_event_url
                         ***** POC info (if gathered)
          ** Phase C: Human Mission Review
               *** Human reviews nomination in Admin Interface
               *** Sees TOU flag and Tech Block flag prominently displayed
               *** Reviews AI reasoning (now shows useful org/event summary)
               *** Decides whether to pursue permission request or reject
               *** Sets event_policy if approving (accept_all or propose_events)
               *** Cross-Reference: See ORGANIZATION WORKFLOW 2: MISSION REVIEW

-----

     * Status Handling - CRITICAL
          ** ALL discovered organizations receive status = "Nominated (Pending Mission Review)"
          ** TOU restrictions and Technical Blocks do NOT automatically set status to "Rejected by Org" during discovery
          ** Flags are set to highlight issues for human review:
               *** tou_flag = TRUE: Displays warning ⚠️ in Admin Interface
               *** tech_block_flag = TRUE: Displays warning ⚠️ in Admin Interface
          ** Human reviewer makes final decision on whether to:
               *** Approve and pursue permission request (even with restrictions)
               *** Reject the organization (to "Rejected by Mission" or "Rejected by Org")
          ** Rationale: Some organizations with TOU restrictions may grant explicit permission when asked
          ** NOTE: Auto-status update to "Rejected by Org" only applies to LIVE organizations that encounter new restrictions during scanning (added 2026-01-15)

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
          ** scrape-all-organizations.js: Scrapes approved orgs (uses orgs discovered by this script)
          ** org-scanner.js: Unified scanning module for policy docs, tech blocks, events URL, POC, and AI analysis (added 2026-01-14, context-aware detection added 2026-01-15)


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
               *** Behavior: Scraper finds event → Check exclusion rules → If passes, auto-create with status "Approved"
          ** propose_events: Scrape but propose each event for human review
               *** Use for: American Bar Association, Aspen Institute - mixed relevance
               *** Behavior: Scraper finds event → Check NatSec criteria + exclusion rules → If passes, create with status "Proposed"

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

     * Overriding Individual Events
          ** Even with accept_all policy, human can reject specific events
          ** Events tab shows [Reject Event] button for each event
          ** Rejected events are hidden from public UI

-----

     * Database Field
          ** Field Name: event_policy
          ** Field Type: Select
          ** Values: accept_all, propose_events
          ** Default for new orgs: propose_events
          >> NEW FEATURE: Add this field to organizations collection in PocketBase


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
          ** Next Action: Wait for response (go-live date = sent + 2 weeks)

-----

     * Status: Permission Granted (Not Live)
          ** Description: Permission received (explicit or implied), not yet scraping
          ** Can Edit?: YES
          ** Can Scrape?: YES (when enabled)
          ** Shows in Public UI?: NO (until scraping produces events)
          ** Next Action: Enable scraping, change to Live
          ** Note: permission_type field indicates Explicit or Implied (No Response)

-----

     * Status: Rejected by Mission (updated 2026-01-15)
          ** Description: Does not fit project mission/focus
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: Org doesn't align with national security focus, wrong sector, out of scope

-----

     * Status: Rejected by Org (updated 2026-01-15)
          ** Description: Organization has blocked us or denied permission
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: 
               *** Policy restrictions found in legal documents (TOU, Privacy Policy, etc.)
               *** Technical blocks encountered (403/401 errors)
               *** Organization explicitly denied permission request
          ** Auto-Set: Scanner auto-sets this status when tou_flag or tech_block_flag is set on a Live org (added 2026-01-15)

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

     * Profile-Based Discovery of Orgs (AI)
          ** Purpose: Find organizations that LOOK like organizations we already track
          ** How It Works:
               *** AI analyzes existing approved organization profiles (name, type, description)
               *** AI uses its training knowledge to suggest similar organizations
               *** Suggestions are based on organizational similarity, not events
          ** Run Command: node scrapers/suggest-organizations.js
          ** Limitations:
               *** Can only suggest organizations AI knows from training data
               *** Cannot discover brand-new organizations (created after training cutoff)
               *** Misses broad-mission orgs that host occasional relevant events
          ** Output:
               *** New orgs saved with status: Nominated (Pending Mission Review)
               *** discovery_method field set to: profile-based
          ** Best For: Well-known think tanks, government agencies, established organizations

-----

     * Event-Based Discovery of Orgs (AI + Embeddings)
          ** Purpose: Find organizations that HOST EVENTS like events we already track
          ** How It Works:
               *** Phase A: Searches web using snippets only (no page fetching), filters with exclusion keywords
               *** Phase B: Performs Initial Org Scan (policy doc check, tech block check, POC gathering, AI analysis)
               *** Phase C: Creates nomination for human review
          ** Run Command: node scrapers/discover-orgs-by-events.js
          ** Requires:
               *** Event embeddings generated (run scrapers/generate-embeddings.js first)
               *** Google Search API credentials in .env
          ** Output:
               *** New orgs saved with status: Nominated (Pending Mission Review)
               *** name field: AI-extracted organization name (not event name)
               *** ai_reasoning field: AI-generated summary of org and events
               *** tou_flag and tech_block_flag set based on scan results
               *** discovery_method field set to: event-based
               *** triggering_event_title, triggering_event_score, triggering_event_url populated
               *** POC info populated (if available)
          ** Best For: 
               *** Broad-mission orgs with occasional relevant events (Aspen Institute, Bar Association)
               *** Organizations whose profile doesn't match but events do
               *** Newly created organizations not in AI training data
          ** Cross-Reference: See EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE section for full details

-----

     * Manual Discovery of Orgs
          ** Open admin-interface-v14.html
          ** Go to Organizations tab
          ** Click "Add Organization" button
          ** Enter organization details
          ** Status defaults to: Nominated (Pending Mission Review)
          ** discovery_method field set to: manual
          ** Save
          >> NEW FEATURE: Initiate Discovery scan to gather Org info, POC info, TOU scan, Technical Block scan  

-----

     * Initial Org Scan (Policy Document Check and Tech Block Check)
          ** Purpose: Gather information BEFORE Mission Review so reviewer has complete picture
          ** When It Runs:
               *** Automatically during Event-Based Discovery (Phase B)
               *** Manually triggered for Profile-Based or Manual Discovery
          ** What It Does:
               *** Fetches homepage to gather basic org info
               *** Finds ALL policy-relevant pages (TOU, Privacy Policy, User Agreement, etc.) and scans each for scraping restrictions
               *** Uses context-aware detection to avoid false positives (added 2026-01-15)
               *** Checks for 403/401 errors (technical blocks)
               *** Gathers POC info (if no restrictions) or searches web for POC (if restrictions found)
               *** Runs AI analysis to extract correct org name and generate summary (added 2026-01-11)
          ** Output: Populates organization record with:
               *** name: AI-extracted organization name (not event name)
               *** ai_reasoning: AI-generated summary of org and events
               *** tou_flag: TRUE if restrictions found in ANY legal document, FALSE if clear
               *** tech_block_flag: TRUE if 403/401 error, FALSE otherwise
               *** tou_notes: All pages scanned and specific restriction phrases found or "No restrictions found"
               *** tou_scanned_date: When scan was performed
               *** POC info (if found)

-----

     * Policy-Relevant Document Review (renamed from Legal Document Review - updated 2026-01-15)
          ** When evaluating a new organization, check ALL policy-relevant documents for scraping restrictions
          ** Documents to check (look in website footer, "Legal", or "Privacy," or "About" sections):
               *** Terms of Use (TOU)
               *** Terms of Service (TOS)
               *** User Agreement
               *** Acceptable Use Policy
               *** Website Terms and Conditions
               *** Copyright Notice
               *** Privacy Policy (may reference automated access)
               *** Policies and Procedures pages
               *** Disclaimer pages

          ** URL Patterns for Policy-Relevant Pages (comprehensive list - updated 2026-01-15):
               *** Primary Legal: /terms, /terms-of-use, /terms-of-service, /tos, /terms-and-conditions, /conditions-of-use
               *** Privacy: /privacy, /privacy-policy, /data-privacy, /cookie-policy, /cookies, /gdpr, /ccpa
               *** Legal: /legal, /legal/terms, /legal/privacy, /legal-notice, /disclaimer, /copyright, /intellectual-property
               *** Policies: /policies, /policies-and-procedures, /site-policies, /usage-policy
               *** User Agreement: /user-agreement, /acceptable-use, /acceptable-use-policy, /aup, /code-of-conduct
               *** API: /api-terms, /api-policy, /developer-terms, /data-use-policy

          ** Key phrases indicating scraping restrictions:
               *** "automated access" or "automated means"
               *** "bots, spiders, scrapers, crawlers"
               *** "data mining" or "data harvesting"
               *** "systematic retrieval" or "systematic collection"
               *** "machine-readable copies"
               *** "crawling prohibited"
               *** "robotic process" or "robotic access"
               *** "web scraping" or "screen scraping"
               *** "bulk download" or "bulk access"

-----

     * If restrictions found from Org (Policy restriction):
          ** Set tou_flag = true
          ** Document specific restrictions in tou_notes field
          ** Note which document contains the restriction
          ** Example: "User Agreement Section 4.2 prohibits automated data collection"
          ** Status remains: Nominated (Pending Mission Review)
          ** Human reviewer decides whether to pursue permission request
          ** Use web search (not their site) to gather POC info for permission request
          >>> NEW FEATURE NEEDED: Generate alert in Admin interface

-----

     * If Technical Block discovered (e.g., 403 error):
          ** Set tech_block_flag = true
          ** Set tou_flag = true (implied restriction)
          ** Document in tou_notes: "Technical block: 403 Forbidden response"
          ** Status remains: Nominated (Pending Mission Review)
          ** Human reviewer decides whether to pursue permission request
          ** Use web search (not their site) to gather POC info for permission request
          >>> NEW FEATURE NEEDED: Generate alert in Admin interface

-----

     * If no restrictions found from Org:
          ** Leave tou_flag = false
          ** Leave tech_block_flag = false
          ** Note in tou_notes: "Scanned [N] pages (TOS, Privacy Policy, etc.) - no scraping restrictions found"
          ** Record date of scan in tou_scanned_date
          ** Gather full POC info from their site


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
               *** Review Org name (AI-extracted, not event name)
               *** Review Policy Restriction flag (⚠️ warning shown if tou_flag = TRUE)
               *** Review Tech Block flag (⚠️ warning shown if tech_block_flag = TRUE)
               *** Review tou_notes for specific restriction details and which pages were scanned
               *** Assess if Org fits project focus
               *** If event-based discovery: Review triggering event details (title, score, URL)
               *** Review POC info (if available)

     * Decision:
          ** Reject (doesn't fit mission): Use status dropdown to change to `Rejected by Mission`
               *** Reasons: Doesn't fit national security focus, wrong sector, out of scope
          ** Reject (org blocked us): Use status dropdown to change to `Rejected by Org`
               *** Reasons: TOU restrictions, tech blocks, or org likely to deny permission
          ** Approve: Click "Approve Mission" button OR change status to `Mission Approved (Request Not Sent)`
               *** Can approve even with TOU restrictions if pursuing permission request
               *** POC info enables sending permission request
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
               *** Go-Live Date is automatically calculated (sent + 2 weeks)

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
               *** Change status to `Rejected by Org`

-----

     * If no response after 2 weeks:
          >>> NEW FEATURE NEEDED: ALERT TO NOTIFY OWNER OF NEED TO ADJUDICATE<<<
               *** Set permission_type to "Implied (No Response)"
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

     * Scraper Registry Architecture (as of 2026-01-14, updated 2026-01-15)
          ** The scraping system uses a registry pattern with database-driven configuration:
               *** scrapers/index.js - Central registry that routes orgs to custom or generic scrapers
               *** scrapers/base-scraper.js - Shared logic (safety gates, policy doc/Privacy checks, rate limiting)
               *** scrapers/org-scanner.js - Unified scanning module for policy docs, tech blocks, events URL, POC, AI analysis (added 2026-01-14, context-aware detection added 2026-01-15)
               *** scrapers/scrape-organization.js - Unified scan + scrape CLI for individual organizations (added 2026-01-14)
               *** scrapers/custom/ - Folder for organization-specific scrapers

          ** Organization-to-scraper mapping uses `scraper_key` field in PocketBase

          ** If no scraper_key set, universal AI-powered scraper is used

-----

     * Two Scan Scenarios (added 2026-01-14)
          ** The unified scrape-organization.js handles two different scan scenarios:

          ** Discovery Scan (new organizations via --domain):
               *** When: Google finds org/event, or manual add via domain
               *** Purpose: Learn about new organization
               *** Find events_url?: YES (don't have it yet)
               *** Full Policy Doc scan?: YES (first time)
               *** AI analysis?: YES (need org name/type)
               *** POC gathering?: YES (first time)
               *** Create DB record?: NO (shows info for manual add)
               *** Output status: Displays discovery info for human review

          ** Pre-Scrape Scan (existing organizations via --org):
               *** When: Before every scrape of Live org
               *** Purpose: Verify still OK to scrape
               *** Find events_url?: Verify it still works
               *** Full Policy Doc scan?: Re-check for changes
               *** AI analysis?: NO (already have it)
               *** POC gathering?: NO (already have it)
               *** Update DB record?: YES (updates tou_scanned_date, auto-sets status if restrictions found)
               *** Output status: "OK to scrape" or "STOP" (safety gate failure)

-----

     * Auto-Status Update on Restriction Detection (added 2026-01-15)
          ** When scanning a LIVE organization and restrictions are found:
               *** If tou_flag is set TRUE: Status auto-changes to "Rejected by Org"
               *** If tech_block_flag is set TRUE: Status auto-changes to "Rejected by Org"
               *** Previous status is logged in tou_notes
               *** Scraping is halted immediately
          ** This protects against policy changes by organizations after initial approval
          ** Does NOT apply to Nominated organizations (flags are for human review during discovery)

-----

     * Scrape Flow (Per Organization)
          ** 1. Safety Gate Check (3 checks):
               *** Status must be "Live (Scraping Active)"
               *** tou_flag must be FALSE
               *** tech_block_flag must be FALSE
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
          ** 8. Apply event_policy:
               *** If accept_all: Auto-approve event (unless exclusion rule hit)
               *** If propose_events: Create event with status "Proposed" for human review
           
          ** 9. Save Events + Update last_scraped

-----

     * Run Scrapers
          ** Option A: Unified Scan + Scrape (Recommended - added 2026-01-14)
              *** Scan and scrape specific organization:
              *** powershell
              *** node scrapers/scrape-organization.js --org "INSA"
              *** Features: Auto-detects org, runs pre-scrape policy doc check, safety gates, AI event extraction

          ** Option B: Scan Only (no scraping)
              *** powershell
              *** node scrapers/scrape-organization.js --org "CNAS" --scan-only

          ** Option C: Discover New Org by Domain
              *** powershell
              *** node scrapers/scrape-organization.js --domain "csis.org"
              *** Features: Dedup check, full discovery scan, creates nomination for review

          ** Option D: Scrape All Enabled Organizations (batch)
              *** powershell
              *** node scrapers/scrape-all-organizations.js

          ** Option E: Scrape Specific Organization (legacy)
              *** powershell
              *** node scrapers/scrape-all-organizations.js --org "INSA"

-----

     * Scraper Behavior
          ** 1. Checks safety gates (status, flags)
          ** 2. Checks Policy Doc and Privacy pages for restrictions (context-aware)
          ** 3. If restrictions found on Live org: auto-sets status to "Rejected by Org"
          ** 4. Fetches events page from `events_url`
          ** 5. Parses event data (title, date, time, location, URL)
          ** 6. Checks for duplicates by `source_id`
          ** 7. Applies exclusion rules
          ** 8. Applies event_policy (accept_all or propose_events)
          ** 9. Saves new events to `events` collection
          ** 10. Updates `last_scraped` timestamp on organization

-----

     * Adding a New Custom Scraper
          ** 1. Create scrapers/custom/[key].js with scrape() function
          ** 2. Add to CUSTOM_SCRAPERS in scrapers/index.js
          ** 3. Set organization's scraper_key field in PocketBase to match

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
          ** 3. Verify new events appear correctly
          ** 4. Check that dates, locations, and descriptions display properly


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

     * Policy-Relevant URL Patterns (35+ patterns)
          ** Primary Legal: /terms, /terms-of-use, /terms-of-service, /tos, /terms-and-conditions, /conditions-of-use
          ** Privacy: /privacy, /privacy-policy, /data-privacy, /cookie-policy, /cookies, /gdpr, /ccpa
          ** Legal: /legal, /legal/terms, /legal/privacy, /legal-notice, /disclaimer, /copyright, /intellectual-property
          ** Policies: /policies, /policies-and-procedures, /site-policies, /usage-policy
          ** User Agreement: /user-agreement, /acceptable-use, /acceptable-use-policy, /aup, /code-of-conduct
          ** API: /api-terms, /api-policy, /developer-terms, /data-use-policy

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

     * Database Field
          ** Field Name: js_render_flag
          ** Field Type: Bool
          ** Purpose: True if site requires JavaScript to render event content
          ** Set By: org-scanner.js during homepage and events page analysis
          ** Display: Admin Interface shows ⚙️ JS badge and info box

-----

     * Auto-Status Update Behavior
          ** For LIVE organizations with js_render_flag newly detected:
               *** Status changes to "Nominated (Pending Mission Review)"
               *** This is informational, not a rejection
               *** Human reviews whether Puppeteer scraper should be built
          ** For NOMINATED organizations:
               *** Flag is set, status remains "Nominated (Pending Mission Review)"
               *** Human reviewer sees JS rendering warning during review

-----

     * Admin Interface Display
          ** Dashboard: Shows count of JS-Rendered Sites
          ** Org Cards: ⚙️ JS badge displayed next to org name
          ** Info Box: Gray box with "JS-Rendered Site: Requires headless browser (Puppeteer) to scrape"
          ** Status & History Tab: Checkbox to manually set/unset js_render_flag
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
          ** admin-interface-v14.html (updated 2026-01-15)
               *** Admin dashboard for managing organizations, contacts, and events. 
               *** Internal use only.
               *** Features: 7 status values, auto-status update on restriction detection, split rejection statuses
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

-----

     * Setup and Utility Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure.
          ** proxy-server.js 
               *** Local proxy server to handle CORS issues when testing scrapers locally.

-----

     * scrapers Folder (consolidated 2026-01-14, updated 2026-01-15)
          ** scrapers/ (main scripts)
               *** index.js - Central registry, routes orgs to custom or generic scrapers
               *** base-scraper.js - Shared logic (safety gates, policy doc/Privacy checks, rate limiting, event saving)
               *** org-scanner.js - Unified scanning module for policy docs, tech blocks, events URL, POC, AI analysis (added 2026-01-14, context-aware detection added 2026-01-15)
               *** scrape-all-organizations.js - Master scraper using registry system (moved from root 2026-01-14)
               *** discover-orgs-by-events.js - Event-based organization discovery (moved from root 2026-01-14)
               *** suggest-organizations.js - Profile-based organization discovery (moved from root 2026-01-14)
               *** enrich-events.js - AI enrichment for event topics (moved from root 2026-01-14)
               *** generate-embeddings.js - Creates AI embeddings for semantic search (moved from root 2026-01-14)
          ** scrapers/custom/
               *** insa.js - INSA-specific scraper (scraper_key: "insa")
               *** (Add new custom scrapers here)

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
          ** org-scanner.js (added 2026-01-14, updated 2026-01-15)
               *** Unified scanning module consolidating policy doc, tech block, events URL, POC, and AI analysis
               *** Context-aware restriction detection to avoid false positives (added 2026-01-15)
               *** Auto-status update: sets "Rejected by Org" when restrictions found on Live orgs (added 2026-01-15)
               *** Used by discover-orgs-by-events.js and can be called directly for manual scans
               *** Functions: scanOrganization(), scanTOU(), findAllLegalUrls(), findRestrictions(), gatherPOC(), analyzeWithAI()
               *** Key Constants: HIGH_CONFIDENCE_RESTRICTION_TERMS, CONTEXT_REQUIRED_TERMS, PROHIBITION_PHRASES, EXCLUDED_CONTEXTS
               *** Run: node scrapers/org-scanner.js (CLI wrapper coming soon)

-----

     * Scrapers (Registry System - consolidated 2026-01-14, updated 2026-01-15)
          ** scrape-organization.js (added 2026-01-14, updated 2026-01-14)
               *** Unified scan + scrape CLI for individual organizations
               *** Smart detection: new org vs existing org
               *** Two scan modes: Discovery Scan (new orgs) vs Pre-Scrape Scan (existing orgs)
               *** AI-powered universal event extraction
               *** extractLinks() function extracts actual href URLs from HTML before AI processing (fixed 2026-01-14)
               *** Deep scrapes individual event pages for additional details (working as of 2026-01-14)
               *** Deduplication checks (domain-based)
               *** Safety gates: status, tou_flag, tech_block_flag (3 checks)
               *** Command line options: --org "name", --domain "x.org", --scan-only, --skip-scan
               *** Run: node scrapers/scrape-organization.js --org "INSA"
               *** Tested: INSA (8/8 events), CNAS (17/17 events), Potomac Officers Club (13/13 events)
          ** scrape-all-organizations.js
               *** Master scraper using registry system
               *** Scrapes all eligible organizations (status=Live, no flags)
               *** Command line options: --help, --org "name", --deep
               *** Run: node scrapers/scrape-all-organizations.js
          ** index.js
               *** Central registry that routes organizations to scrapers
               *** Uses scraper_key field from PocketBase to find custom scrapers
          ** base-scraper.js
               *** Shared scraping logic with safety gates
               *** Policy doc and Privacy page checking
               *** 403 detection and auto-blocking
               *** Rate limiting (5-8s randomized delays)
          ** org-scanner.js (added 2026-01-14, updated 2026-01-17)
               *** Unified scanning module
               *** Multi-page policy doc scanning - findAllLegalUrls() finds ALL legal pages, scanTOU() scans each one (updated 2026-01-15)
               *** Context-aware restriction detection - avoids false positives (added 2026-01-15)
               *** JavaScript rendering detection on homepage AND events page (added 2026-01-17)
               *** Event content detection - catches AJAX-loaded events pages with no actual event content (added 2026-01-17)
               *** Sets tou_flag=TRUE if ANY legal page contains restrictions
               *** Sets js_render_flag=TRUE if JavaScript rendering detected (added 2026-01-17)
               *** Auto-updates status to "Rejected by Org" when restrictions found on Live orgs (added 2026-01-15)
               *** Auto-updates status to "Nominated" when JS rendering detected on Live orgs (added 2026-01-17)
               *** Records all pages scanned in tou_notes field
               *** Technical block detection (403/401)
               *** Events URL discovery from homepage and triggering URLs
               *** POC info gathering
               *** AI-powered org analysis
          ** custom/insa.js
               *** INSA-specific scraper (scraper_key: "insa")
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

-----

     * Utilities
          ** proxy-server.js
               *** Local proxy server to handle CORS issues when testing scrapers locally


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# GITHUB ACTIONS
     * Workflow: Scrape Events Daily
          ** File: .github/workflows/scrape-events.yml
          ** Status: ENABLED (as of 2026-01-06, schedule updated 2026-01-14)
          ** Schedule: Runs daily at 11:30 PM EST (04:30 UTC) - changed to avoid peak server hours
          ** What it does:
               *** Sets up Node.js environment
               *** Installs dependencies
               *** Runs scrapers/scrape-all-organizations.js
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

          ** Field Name: js_render_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if site uses JavaScript to render event content (React, Vue, Angular, Next.js, etc.). Set during Initial Org Scan when homepage or events page shows JS rendering indicators. Auto-sets status to "Nominated (Pending Mission Review)" if detected on Live org. Requires headless browser (Puppeteer) for scraping.
          ** Added: 2026-01-17

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
          ** Field Purpose/Notes: Maps organization to custom scraper in registry (e.g., "insa" maps to scrapers/custom/insa.js)
          ** Added: 2026-01-06

          ** Field Name: go_live_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Calculated deadline (permission_requested_date + 14 days) for implied permission
          ** Added: 2026-01-06

          ** Field Name: alert_type
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): tou_restriction, tech_block, ready_to_activate
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Type of alert to display in Admin Interface
          ** Added: 2026-01-06

          ** Field Name: event_policy
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): accept_all, propose_events
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: How to handle events from this org (auto-approve or propose for review)
          ** Added: 2026-01-11
          >> NEW FEATURE: Add this field to PocketBase

          ** Status Field Values (organization.status) - Updated 2026-01-15
               *** Nominated (Pending Mission Review): AI-suggested, awaiting review
               *** Mission Approved (Request Not Sent): Approved, need to send permission request
               *** Permission Requested (Pending Org Response): Email sent, waiting for response
               *** Permission Granted (Not Live): Permission received, not yet scraping
               *** Rejected by Mission: Does not fit project mission/focus
               *** Rejected by Org: Organization blocked us (TOU restrictions, tech blocks, denied permission)
               *** Live (Scraping Active): Actively being scraped

          ** Permission Type Values (organization.permission_type)
               *** (empty): Not yet determined
               *** Explicit: Organization granted permission
               *** Implied (No Response): No response after 2 weeks

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
          ** Setting - Choices: (same as events.countries - all 196 countries)
          ** Setting - Single/multiple: Multiple
          ** Setting - Max select: 196
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: transnational_org
          ** Field Type: Select
          ** Setting - Choices: (same as events.transnational_orgs)
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Note: Field is singular (transnational_org) while events uses plural (transnational_orgs)

          ** Field Name: icon_file
          ** Field Type: File
          ** Setting - Single/multiple: Single
          ** Setting - Allowed types: image/png
          ** Setting - Max file size: 5242880 (5 MB)
          ** Setting - Nonempty: off
          ** Setting - Presentable: on
          ** Setting - Protected: off

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

     * Name: admin-interface-v14.html
     * Type: HTML Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\admin-interface-v14.html
     * Function/Purpose: Admin dashboard (internal use) - Updated 2026-01-15 with 7 status values, auto-status update, split rejection statuses

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

-----

     * Files - Scrapers Folder (consolidated 2026-01-14, updated 2026-01-15)

-----

     * Name: index.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\index.js
     * Function/Purpose: Central scraper registry

-----

     * Name: base-scraper.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\base-scraper.js
     * Function/Purpose: Shared scraping logic with safety gates

-----

     * Name: org-scanner.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\org-scanner.js
     * Function/Purpose: Unified scanning module for policy docs, tech blocks, events URL, POC, AI analysis. Context-aware restriction detection (added 2026-01-15).
     * Added: 2026-01-14, Updated: 2026-01-15

-----

     * Name: scrape-organization.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\scrape-organization.js
     * Function/Purpose: Unified scan + scrape CLI for individual organizations with AI-powered event extraction
     * Features: Smart detection (new vs existing org), deduplication, safety gates, universal AI scraper
     * Usage: node scrapers/scrape-organization.js --org "INSA" or --domain "csis.org"
     * Added: 2026-01-14

-----

     * Name: scrape-all-organizations.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\scrape-all-organizations.js
     * Function/Purpose: Master scraper using registry system
     * Moved from root: 2026-01-14

-----

     * Name: discover-orgs-by-events.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\discover-orgs-by-events.js
     * Function/Purpose: Event-based organization discovery with AI analysis, TOU scanning, and exclusion filtering
     * Moved from root: 2026-01-14

-----

     * Name: suggest-organizations.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\suggest-organizations.js
     * Function/Purpose: Profile-based organization discovery
     * Moved from root: 2026-01-14

-----

     * Name: enrich-events.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\enrich-events.js
     * Function/Purpose: AI enrichment for event topics
     * Moved from root: 2026-01-14

-----

     * Name: generate-embeddings.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\generate-embeddings.js
     * Function/Purpose: Creates AI embeddings for semantic search and event-based discovery
     * Moved from root: 2026-01-14

-----

     * Name: insa.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\custom\insa.js
     * Function/Purpose: INSA-specific scraper

-----

     * Files - icon-worker Root

-----

     * Name: package.json
     * Type: NPM Configuration
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\package.json
     * Function/Purpose: icon-worker dependencies

-----

     * Name: eng.traineddata
     * Type: Binary Data
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\eng.traineddata
     * Function/Purpose: Tesseract OCR training data for English text detection

-----

     * Name: Image_Generation_Safety_Abstraction_Policy_v2.7.md
     * Type: Markdown Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\Image_Generation_Safety_Abstraction_Policy_v2.7.md
     * Function/Purpose: Policy document for image generation

-----

     * Name: README.md
     * Type: Markdown Document
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\README.md
     * Function/Purpose: Setup and usage instructions for icon-worker

-----

     * Files - icon-worker Source (icon-worker/src/)

-----

     * Name: generate-topic-icons.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\generate-topic-icons.js
     * Function/Purpose: Main worker script for icon generation

-----

     * Name: create-topic-icon-records.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\create-topic-icon-records.js
     * Function/Purpose: Creates records for new topic combinations

-----

     * Name: clear-icons.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\clear-icons.js
     * Function/Purpose: Clears icons to force regeneration

-----

     * Name: cleanup-topic-combinations.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\cleanup-topic-combinations.js
     * Function/Purpose: Fixes malformed combination keys

-----

     * Name: rules.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\rules.js
     * Function/Purpose: Visual rules (TOPIC_STYLE, REGION_STYLE, ORG_MOTIFS, etc.)

-----

     * Name: policyEngine.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\policyEngine.js
     * Function/Purpose: Prompt construction logic for DALL·E

-----

     * Name: validators.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\validators.js
     * Function/Purpose: OCR, panel detection, downscale audit

-----

     * Name: config.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\config.js
     * Function/Purpose: Environment variable loader (loads from ROOT .env)

-----

     * Name: pbClient.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\pbClient.js
     * Function/Purpose: PocketBase API helpers

-----

     * Name: openaiImages.js
     * Type: JavaScript Module
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker\src\openaiImages.js
     * Function/Purpose: DALL·E 3 API wrapper

-----


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SUMMARY OF TECHNICAL NEEDS AND FUTURE ACTIONS

     * Admin Interface

          ** Top Nav
               *** Add Alert feature

          ** Dashboard
               *** Panels instead of Tiles

               *** Organziation Dashbaord Panel 
                    **** Arranged in this order:
                    **** Nominated (Pending Mission Review): COUNT
                         ***** Clickable to the list in that status
                    **** Nominated (Technically Blocked/TOU Restricted): COUNT
                         ***** Clickable to the list in that status
                         ***** Orgs prviosuly scraping that have have encountered TOU or Technical Block also appear in Alert Feature on Top Nav
                    **** Mission Approved (Request Not Sent): COUNT
                         ***** Clickable to the list in that status
                    **** Permission Requested (Pending Org Response): COUNT
                         ***** Clickable to the list in that status
                    **** Rejected by Mission: COUNT
                         ***** Clickable to the list in that status
                    **** Rejected by Org: COUNT
                         ***** Clickable to the list in that status
                    **** Live (Scraping Active): COUNT
                         ***** Clickable to the list in that status

               *** Events Dashbaord Panel  
                    **** Coming Events: COUNT
                         ***** Clickable to the list in that status 
                    **** Pending Adjudication: COUNT
                         ***** Clickable to the list in that status
                    **** Rejected: COUNT
                         ***** Clickable to the list in that status

-----

     * Events Tab
          ** Sort by:
               *** Org Name 
               *** Date of Event
          ** [Reject Event] button
          ** [Generate New Image] button to submit new request
          ** Event Policy dropdown (change parent org's policy from event screen)

-----

     * Org Tab
          ** Add [Scan New Org] Button to get key info about a new org found manually (POCs, URLS, TOU Scan, tech Block)
          ** When click save Org button, take me back to Org List
          ** Add [Scan New Org] Button to get key info about a new org found manually (POCs, URLS, TOU Scan, tech Block)
          ** When click save Org button, take me back to Org List
          ** Event Policy dropdown (accept_all or propose_events)

-----

     * Nomination Workflow:
          ** Org Approval
               *** Accept all events by Org (event_policy = accept_all)
                    **** Example: Accept all INSA events, unless the event is training (certifications, webinars, etc.), references polticians or politcal parties, etc.

               *** Accept only events by Org that meet NatSec criteria and exclusion Rules (event_policy = propose_events)
                    **** Example: The American Bar Association: Hold Org, events that meet Natsec criteria, unless the event is training (certifications, webinars, etc.), references polticians or politcal parties, etc.


-----

     * Scraping Exclusion Rules 
          ** Ensure all Scrapers have core exlusion rules
               *** No named politicians, political party names, etc (these rules might be in the image generation rules)

          ** Exclude training and certification events.

          ** Exclude Book/Report Readings, Reviews

          ** Exclude webinars (added 2026-01-11)

          ** Exclude aggregator/list pages (added 2026-01-11)

          ** Exclude academic/student conferences (added 2026-01-11)

-----

     * Event-Based Organization Discovery
          ** Script: scrapers/discover-orgs-by-events.js - Status: Functional (updated 2026-01-14)
          ** Configure Google Custom Search API credentials in .env
          ** New fields added to organizations collection in PocketBase (2026-01-11):
               *** discovery_method
               *** triggering_event_title
               *** triggering_event_score
               *** triggering_event_url
          ** Update Admin Interface to display:
               *** TOU and Tech Block flags prominently on nomination cards
               *** Triggering event info for event-based discoveries
               *** AI-generated summary in AI Reasoning field
               *** POC info gathered during discovery

-----

     * PocketBase Field to Add
          ** event_policy: Select (accept_all, propose_events) on organizations collection
          ** ✅ COMPLETED: Update status field to include 7 values (split Rejected) - 2026-01-15

-----

     * Scrape and Deep Scrape for Changes

-----
     * Image Generation Updates:
          * If there are no countries mentioned, only use topic icons
          * If there are no discrenable topics/regions

-----

     * Go Live with URL / Versel

-----

     * Unified Scanning/Scraping Architecture (implemented 2026-01-14, updated 2026-01-17)
          ** ✅ COMPLETED: Created scrapers/org-scanner.js unified module
          ** ✅ COMPLETED: Consolidated files into scrapers/ folder
          ** ✅ COMPLETED: Deprecated standalone tou-scanner.js
          ** ✅ COMPLETED: Created scrapers/scrape-organization.js unified CLI (2026-01-14)
          ** ✅ COMPLETED: Removed scraping_enabled field - status is sole source of truth (2026-01-14)
          ** ✅ COMPLETED: Simplified safety gates to 3 checks: status, tou_flag, tech_block_flag (2026-01-14)
          ** ✅ COMPLETED: AI-powered universal event extraction (2026-01-14)
          ** ✅ COMPLETED: Tested on INSA - 8 events extracted and saved (2026-01-14)
          ** ✅ COMPLETED: Fixed deep scrape URL extraction - extractLinks() function extracts actual href links from HTML (2026-01-14)
          ** ✅ COMPLETED: Tested on CNAS - 17 events extracted and saved, 17/17 deep scrapes successful (2026-01-14)
          ** ✅ COMPLETED: Updated GitHub Actions schedule to 11:30 PM EST (04:30 UTC) to avoid peak server hours (2026-01-14)
          ** ✅ COMPLETED: Multi-page policy doc scanning - findAllLegalUrls() scans ALL legal pages instead of stopping at first (2026-01-15)
          ** ✅ COMPLETED: Tested on Potomac Officers Club - scanned 7 legal pages, 13 events saved (2026-01-15)
          ** ✅ COMPLETED: Context-aware restriction detection - avoids false positives from keywords like "bot" appearing in non-restriction contexts (2026-01-15)
          ** ✅ COMPLETED: Split rejection status - "Rejected by Mission" vs "Rejected by Org" (2026-01-15)
          ** ✅ COMPLETED: Auto-status update - scanner auto-sets "Rejected by Org" when restrictions found on Live orgs (2026-01-15)
          ** ✅ COMPLETED: Admin Interface v14 with 7 status values and split rejections (2026-01-15)
          ** ✅ COMPLETED: JavaScript rendering detection on homepage and events page (2026-01-17)
          ** ✅ COMPLETED: Event content detection - catches AJAX-loaded events pages (2026-01-17)
          ** ✅ COMPLETED: js_render_flag field added to PocketBase (2026-01-17)
          ** ✅ COMPLETED: Admin Interface v16 with JS render flag display (2026-01-17)
          ** REMAINING: Update discover-orgs-by-events.js to use org-scanner module
          ** REMAINING: Continue activating orgs from "Permission Granted (Not Live)" list
          ** REMAINING: Build Puppeteer scrapers for JS-rendered sites
          ** Features in scrape-organization.js:
               *** Smart detection: new org vs existing org
               *** Two scan modes: Discovery Scan vs Pre-Scrape Scan
               *** Deduplication checks (domain-based)
               *** Safety gates (3 checks)
               *** AI-powered event extraction from listing pages
               *** extractLinks() function extracts actual URLs before AI processing
               *** Deep scrape individual event pages for additional details
               *** Rate limiting (respectful delays)
          ** Features in org-scanner.js:
               *** findAllLegalUrls() - discovers ALL legal page links from homepage + tries common paths
               *** scanTOU() - scans ALL legal pages, flags if ANY contain restrictions
               *** Context-aware restriction detection - HIGH_CONFIDENCE vs CONTEXT_REQUIRED keywords (added 2026-01-15)
               *** detectJavaScriptRendering() - checks for SPA frameworks, noscript warnings, empty content (added 2026-01-17)
               *** Event content detection - verifies events pages have actual event data (added 2026-01-17)
               *** Auto-status update to "Rejected by Org" for Live orgs with restrictions (added 2026-01-15)
               *** Auto-status update to "Nominated" for Live orgs with JS rendering (added 2026-01-17)
               *** Records all pages scanned in tou_notes field
               *** getPageType() - identifies page type (Privacy Policy, Terms of Service, etc.) for logging

-----

     * Date of Events -  Fix

-----

     * Location of Event fixes

-----

     * TOU

-----

     * Privacy Agreement

-----

     * Get CISA and USG RFIs - approval from OGC

-----

     * Email Addresses (@BlanceFWD.com)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS BY DOMAIN

     * How to Use:
          ** Start of session: Tell Claude which domain, Claude reads that handoff + relevant ConOp sections
          ** End of session: Claude updates BOTH the ConOp content AND the relevant handoff section
          ** This keeps everything in sync in one document

-----

     * SCRAPING
          ** Relevant ConOp Sections: ORGANIZATION WORKFLOW 4: EVENT SCRAPING, KEY FILES (scrapers/), POLICY-RELEVANT DOCUMENT SCANNING, JAVASCRIPT RENDERING DETECTION
          ** Files to Attach to New Chat:
               *** This ConOp document
               *** scrapers/scrape-organization.js
               *** scrapers/org-scanner.js
               *** scrapers/base-scraper.js
               *** admin-interface-v16.html
          ** Last Session: 2026-01-17
               *** Added JavaScript rendering detection to org-scanner.js
               *** Scanner now checks BOTH homepage AND events page for JS rendering
               *** Added event content detection - catches AJAX-loaded events pages (like New America) that have page shell but no actual event data
               *** Added js_render_flag field to PocketBase organizations collection
               *** Added scrape_notes field to PocketBase organizations collection
               *** Created admin-interface-v16.html with JS render flag display:
                    **** Dashboard shows JS-Rendered Sites count
                    **** Org cards show ⚙️ JS badge
                    **** Info boxes show JS rendering warnings
                    **** Status & History tab has JS-Rendered Site checkbox
               *** Auto-status update: When JS rendering detected on Live org, status changes to "Nominated (Pending Mission Review)"
               *** Tested on New America - detected that homepage is SSR but events page lacks actual event content
               *** Scanned Council on Foreign Relations - passed all checks, ready to scrape
               *** Previous sessions: Context-aware restriction detection (2026-01-15), multi-page TOU scanning (2026-01-15), deep scrape fixes (2026-01-14)
          ** Current Status: Working - JS rendering detection, context-aware detection, multi-page scanning, auto-status update all functional
          ** Blocked/Broken: None
          ** Next Steps: 
               *** Deploy updated org-scanner.js and admin-interface-v16.html
               *** Full scrape Council on Foreign Relations (CFR)
               *** Continue activating orgs from "Permission Granted (Not Live)" list:
                    **** Council on Foreign Relations - ready to scrape ✅
                    **** Chatham House
                    **** The International Institute for Strategic Studies
                    **** The Stimson Center
                    **** Cyber Threat Alliance (CTA)
                    **** The RAND Corporation
               *** Orgs with known issues:
                    **** Atlantic Council - has TOU restrictions ("Rejected by Org")
                    **** Center for Strategic and International Studies (CSIS) - has restrictions ("Rejected by Org")
                    **** The Brookings Institution - has restrictions ("Rejected by Org")
                    **** New America - JS-rendered events page (needs Puppeteer scraper or manual flag)
          ** Helper Script: list-ready-orgs.js - lists orgs with status "Permission Granted (Not Live)"

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
          ** Last Session: 
          ** Current Status: Functional but needs update to use org-scanner module
          ** Blocked/Broken: discover-orgs-by-events.js should be updated to use org-scanner
          ** Next Steps: Integrate org-scanner module

-----

     * ADMIN INTERFACE
          ** Relevant ConOp Sections: ADMIN INTERFACE, WORKFLOW - STATUS REFERENCES
          ** Key Files: admin-interface-v16.html (updated 2026-01-17)
          ** Last Session: 2026-01-17
               *** Created v16 with JavaScript rendering detection display:
                    **** Dashboard shows JS-Rendered Sites count
                    **** Org cards display ⚙️ JS badge next to org name
                    **** Info boxes show JS rendering warnings (gray background)
                    **** Status & History tab has JS-Rendered Site checkbox
                    **** Saves js_render_flag to database
               *** Previous: v14 with 7 status values (2026-01-15)
          ** Current Status: Functional with 7 statuses and JS render flag display
          ** Blocked/Broken: None known
          ** Next Steps: Add alert feature, task automation buttons

-----

     * PUBLIC UI
          ** Relevant ConOp Sections: PUBLIC UI FEATURES, VERCEL DEPLOYMENT
          ** Key Files: index.html, event-finder-ui-v7.html
          ** Last Session: 
          ** Current Status: Live on Vercel
          ** Blocked/Broken: None known
          ** Next Steps: Migrate to BalanceFWD.com domain

-----

     * ORG WORKFLOW / PERMISSIONS
          ** Relevant ConOp Sections: WORKFLOWS 1-4, STATUS REFERENCES, EVENT POLICY
          ** Key Files: Admin interface (Status & History tab)
          ** Last Session: 2026-01-15 - Updated status values to include 7 options with split rejections
          ** Current Status: Functional
          ** Blocked/Broken: None known
          ** Next Steps: 

-----

     * POCKETBASE SCHEMA
          ** Relevant ConOp Sections: POCKETBASE COLLECTIONS AND VALUES
          ** Key Files: PocketBase Admin UI
          ** Last Session: 2026-01-17
               *** Added js_render_flag field to organizations collection:
                    **** Field type: Bool
                    **** Purpose: Flags sites that use JavaScript to render event content
                    **** Set by scanner when JS rendering detected
               *** Added scrape_notes field to organizations collection:
                    **** Field type: Plain Text
                    **** Max length: 5000
                    **** Purpose: Auto-populated with JS detection results and scraping observations
               *** Previous: Updated status field to 7 values (2026-01-15)
          ** Current Status: Schema updated with js_render_flag and scrape_notes
          ** Blocked/Broken: None
          ** Next Steps: 
               *** Add event_policy field to organizations collection when ready




@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SUMMARY OF BUSINESS NEEDS AND FUTURE ACTIONS

     * Incorporate - USG

     * Trademark - USPTO: Logo

     * Trademark - USPTO: Name / BalanceFWD

     * Trademark - USPTO: Name / Balance Forward

     * Taxes



