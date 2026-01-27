@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT NAME:  
2026-01-25-1428 ConOp Event_Finder.md


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
          ** Hosts the Admin Interface for remote record updating https://event-finder-ui-one.vercel.app/admin-interface-v22.html

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


-----

     * Remote access to the Admin Interface for record changes 
          ** Uses Vercel
          ** https://event-finder-ui-one.vercel.app/admin-interface-v22.html
          ** Username and Password in Bitwarden



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
# ADMIN INTERFACE

     * File: admin-interface-v22.html

-----

     * Access: 
          ** Open locally in browser, requires PocketBase admin login
          ** Hosts the Admin Interface for remote record updating https://event-finder-ui-one.vercel.app/admin-interface-v22.html

-----

     * Features:
          ** Header: "Event Finder Admin" - clickable, returns to Dashboard from anywhere
          ** 6 Main Tabs: Dashboard, Org By Status, Organizations, Contacts, Events, Icons
          ** Organization Profile Page with 4 sub-tabs

-----

     * Tab: Dashboard
          ** Stats overview: Total Orgs, Events, Nominated (Pending), Live (Scraping), Tech Blocked, Permission Denied, Duplicates
          ** Has Restrictions count (organizations with tou_flag=true OR tech_block_flag=true across ALL statuses) 
          ** Status breakdown by count 
          ** Tech Blocked count (organizations with tech_block_flag = true)
          ** Tech-Rendered Sites count (organizations with tech_rendering_flag = true) 
          ** Duplicates count (organizations with duplicate_flag = true) 
          ** Permission Denied count now uses permission_type = "Denied" 

-----

     * Tab: Org By Status 
          ** Two Independent Filter Dropdowns (selecting one resets the other):
               *** Dropdown 1 - Workflow Status:
                    **** Nominated (Pending Mission Review)
                    **** Mission Approved (Request Not Sent)
                    **** Permission Requested (Pending Org Response)
                    **** Permission Granted (Not Live)
                    **** Rejected by Mission
                    **** Rejected by Org
                    **** Live (Scraping Active)
                    **** Duplicates Only 
               *** Dropdown 2 - Orgs with Restrictions:
                    **** Nominated - Restricted!
                    **** Mission Approved - Restricted!
                    **** Permission Requested - Restricted!
                    **** Permission Granted - Restricted!
                    **** Rejected by Mission - Restricted!
                    **** Rejected by Org - Restricted!
          ** Restrictions dropdown filters by: status='X' AND (tou_flag=true OR tech_block_flag=true)
          ** Organization cards with status-specific content
          ** Go-Live date display is restriction-aware:
               *** Orgs WITH tou_flag: Shows "⚠️ Explicit Permission Required - No auto go-live date"
               *** Orgs WITHOUT tou_flag: Shows calculated date (sent + 7 days) with "implied permission" note
          ** Inline status dropdown for quick changes
          ** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events
          ** Status-specific buttons: Approve Mission, Generate Request
          ** Live Safety Warning: When changing status to "Live (Scraping Active)", checks for tou_flag, tech_block_flag, permission_type="Denied" and shows confirmation dialog if any are true

-----

     * Tab: Organizations
          ** Quick search by name
          ** Jump to Organization dropdown
          ** Filter by Status dropdown (redirects to Org By Status tab)
          ** Add Organization button (opens blank Profile Page)
          ** Organization cards showing:
               *** Policy Restriction warnings/alerts
               *** Duplicate warnings 
               *** Org name (links to Profile)
               *** Status badge
               *** Description
               *** Website
               *** Phone (from Main Contact or non-Leadership contact)
               *** Status dropdown (quick change)
               *** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events
          ** Badge indicators for rejection flags:
               *** ⛔ BLOCKED (tech_block_flag)
               *** ⚠️ TOU (tou_flag)
               *** 🚫 DECLINED (permission_type = "Denied") - updated from permission_denied_flag
               *** ⚙️ JS-RENDER (tech_rendering_flag)
               *** 🔁 DUPLICATE (duplicate_flag)

-----

     * Tab: Contacts
          ** List of all contacts across organizations
          ** Add Contact button
          ** Edit/Delete buttons per contact

-----

     * Tab: Events 
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
               *** Policy Restriction alerts (if flagged)
               *** Tech Block alerts (if flagged)
               *** Organization Name
               *** Type
               *** Description
               *** Website
               *** Source ID (domain)
               *** Events URL
               *** Status dropdown 
               *** Permission Type dropdown:
                    **** Explicit (Org Approved)
                    **** Implied (No Response)
                    **** Waiver (Flags exist, but approved)
                    **** Denied (Org explicitly declined) - Note, this replaced an earlier fields called "permission_denied_flag"
               *** Discovery Method indicator (manual, profile-based, event-based)
               *** Event Policy dropdown (accept_all, propose_events)
               *** Save Overview button

          ** Sub-tab: Contacts
               *** Org info section (name, status, alerts)
               *** Sort by Last Name / First Name dropdown
               *** Add Contact button
               *** Contact cards with Edit/Delete buttons

          ** Sub-tab: Status & History
               *** Scan & Scrape Status Section:
                    **** Stats grid: Last Scanned, Last Scraped, Events count, Scraping On/Off
                    **** Alert boxes for current flags:
                         ***** TOU Warning (bright yellow #fff3cd) - shows restriction_source_urls and restriction_context
                         ***** Tech Block (red)
                         ***** JS Rendering (blue)
                         ***** Success (green when all clear)
               *** Edit Flags & Settings (collapsible accordion):
                    **** ⚠️ TOU Restriction checkbox (tou_flag)
                    **** ⛔ Technical Block (403) checkbox (tech_block_flag)
                    **** ⚙️ Tech-Rendered Site checkbox (tech_rendering_flag)

                    **** 🤖 Scraping Enabled checkbox
                    **** TOU Scanned Date
                    **** Save Flags button
               *** Scan History Accordion:
                    **** Toggle button: "📜 View Scan & Scrape History"
                    **** Shows records from scan_logs collection
                    **** Displays: scan date, scan type, flags set, status changes
               *** Notes Section:
                    **** Single Notes field replaces separate tou_notes + scrape_notes + notes
                    **** Migration script combined legacy fields 
               *** Duplicate Info Box (read-only):
                    **** Purple background box shown when duplicate_flag = true
                    **** Shows "Duplicate of: [Org Name]" with clickable link to primary org
                    **** Set by quality-audit.js script, not manually editable
               *** Discovery Info (if event-based):
                    **** Triggering Event Title
                    **** Triggering Event Score
                    **** Triggering Event URL
               *** Policy Document Assessment:
                    **** Policy Docs Scanned Date (auto-set when flags checked)
                    **** Policy Notes (shows all documents scanned and restrictions found)
                    **** TOU Warning Box: When tou_flag=true, shows orange warning with restriction source URLs and context
                    **** Save Policy Info button
               *** Permission Request:
                    **** Contact Selector dropdown:
                         ***** Auto-loads contacts for current org
                         ***** Priority sorted: Legal/Permissions → Events → Main Contact → Media/PR → Other → Leadership
                         ***** Shows name, email, and contact_type
                    **** Permission Requested Date
                    **** Go-Live Date (restriction-aware):
                         ***** Orgs WITH tou_flag: Shows "⚠️ Explicit Permission Required - No auto go-live date (TOU restrictions)"
                         ***** Orgs WITHOUT tou_flag: Shows calculated date (sent + 7 days) with "implied permission if no response" note
                    **** Permission Request Draft Text (editable)
                    **** Generate Draft button (TOU-aware):
                         ***** Orgs WITH restrictions: Subject "Permission Request: Event Listing from [Org Name]", no deadline, multi-bullet format for restriction sources
                         ***** Orgs WITHOUT restrictions: Subject "Notice: Automated Event Collection from [Org Name]", includes 7-day proceed date, "No response needed if you are fine with this"
                         ***** Auto-detects source type from URL (Privacy Policy, Terms of Use, Legal page, Copyright page)
                         ***** Parses restriction_source_urls and restriction_context (newline-separated)
                         ***** Ends with "Regards," (no signature - user adds in email app)
                    **** Copy Draft, Preview buttons
                    **** Permission Request Final Text (editable)
                    **** Copy Final, Preview buttons
                    **** Permission Response Date
                    **** Permission Response Text (editable)
                    **** Save Permission Info button
               *** Correspondence Log:
                    **** Timeline of all communications with org
                    **** Add Entry button with fields: date, direction (sent/received/note), contact, subject, text
                    **** Displays entries newest-first with color coding by direction
                    **** Delete individual entries
                    **** Stores as JSON in correspondence_log field
               *** Scraping Info: 
                    **** Event count, Last scraped
                    **** Scraping Enabled checkbox
                    **** Scrape Notes (auto-populated by scanner when JS rendering detected)
                    **** Manual Notes
               *** Change Status dropdown (with Live Safety Warning):
                    **** When selecting "Live (Scraping Active)", checks for active restriction flags
                    **** If tou_flag, tech_block_flag, or permission_type="Denied" is true, shows confirmation dialog
                    **** Dialog lists active flags and requires explicit confirmation before status change

          ** Sub-tab: Events
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
                    **** Threshold: Events scoring > 0.40 proceed to Phase B 
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
               *** Step B2: Policy Document Scan
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

     * Exclusion Keywords 
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
               *** 0.40-0.69 = Relevant (threshold for inclusion)
               *** < 0.40 = Not relevant
          ** Threshold History:
               *** Original: 0.70 (too restrictive - filtered all results in testing)
               *** Updated to: 0.40 

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
          ** Status: Functional

-----

     * Configuration Options
          ** MAX_QUERIES: Number of search queries to execute (default: 5)
          ** MAX_RESULTS_PER_QUERY: Results to process per query (default: 10)
          ** SIMILARITY_THRESHOLD: Minimum score for relevance (default: 0.40)
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
          ** organizations Collection - New Fields:
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
          ** scan-and-scrape-all-live-orgs.js: Unified scanner/scraper for all orgs
          ** org-scanner.js: Core scanning module for policy docs, tech blocks, events URL, POC, and AI analysis (context-aware detection)


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

     * Event Status Values (in events collection)
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

     * Reviewing Nominated Events
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

     * Database Field (events collection)
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
          ** Next Action: Wait for response

-----

     * Status: Permission Granted (Not Live)
          ** Description: Permission received (explicit, implied, or waiver), not yet scraping
          ** Can Edit?: YES
          ** Can Scrape?: YES (when enabled)
          ** Shows in Public UI?: NO (until scraping produces events)
          ** Next Action: Enable scraping, change to Live
          ** Note: permission_type field indicates Explicit or Implied

-----

     * Status: Rejected by Mission 
          ** Description: Does not fit project mission/focus
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: Org doesn't align with national security focus, wrong sector, out of scope

-----

     * Status: Rejected by Org
          ** Description: Organization has blocked us or denied permission
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)
          ** When to Use: 
               *** Policy restrictions found in legal documents (TOU, Privacy Policy, etc.) - tou_flag
               *** Technical blocks encountered (403/401 errors) - tech_block_flag
               *** Tech-rendered site requiring Puppeteer (optional) - tech_rendering_flag
               *** Organization explicitly denied permission request - permission_type = "Denied"
          ** Auto-Set: Scanner auto-sets this status when any rejection flag is set on a Live org

-----

     * Status: Live (Scraping Active)
          ** Description: Actively being scraped, events appear in public UI
          ** Can Edit?: YES
          ** Can Scrape?: YES
          ** Shows in Public UI?: YES
          ** Next Action: Monitor and maintain



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

     * Initial Org Scan (org-scanner.js)
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
               *** tech_rendering_flag: TRUE if JavaScript rendering detected
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

     * What to Do If Tech Rendering Flag is Set 
          ** Set tech_rendering_flag = true
          ** Status → Rejected by Org 
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
                    **** If score > 0.40, proceed to Phase B
               *** Step 5: Extract domain from high-scoring result URLs
          ** Phase B - Initial Org Scan (Page Fetching):
               *** Step 6: Fetch homepage from extracted domain
                    **** On 403/401 error: Set tech_block_flag = TRUE, skip to Step 10
                    **** Find: All policy-relevant page URLs
               *** Step 7: Fetch and scan ALL policy-relevant pages
                    **** Scan each page for restriction keywords using context-aware detection
                    **** If restrictions found in ANY page: Set tou_flag = TRUE
                    **** Record specific phrases and which page they came from in tou_notes
               *** Step 8: Gather POC info
                    **** If NO restrictions: Fetch About/Contact pages, gather POC
                    **** If restrictions found: Use web search for POC (LinkedIn, Wikipedia, etc.)
               *** Step 9: AI Analysis
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
               *** Review AI reasoning (now shows org/event summary)
               *** Review Policy Restriction flag (⚠️ warning shown if tou_flag = TRUE)
               *** Review Tech Block flag (⚠️ warning shown if tech_block_flag = TRUE)
               *** Review Tech Rendering flag (⚙️ warning shown if tech_rendering_flag = TRUE) - renamed 2026-01-17
               *** Review Permission Status (🚫 warning shown if permission_type = "Denied")
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
               *** If there are no flags, then Go-Live Date is automatically calculated (sent + 1 week) 
               *** If there are flags, then the Partner Engagement Specialist must reach out and record times 

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
               *** Set permission_type to "Denied"
               *** Change status to `Rejected by Org`

-----

     * If permission granted WITH existing TOU restrictions (Waiver scenario):
               *** Paste approval email into Permission Response Text
               *** Set Permission Response Date
               *** Set permission_type to "Waiver"
               *** This indicates: TOU has restrictions, but org gave explicit permission anyway
               *** Safety gates will skip flag checks for orgs with Waiver
               *** Scanner will NOT reset status if known flags are detected on subsequent scans
               *** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)`

-----

     * If no response after 1 week and no flags:
               *** Set permission_type to "Implied"
               *** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)` or `Rejected by Mission` or `Rejected by Org`

-----

     * For organizations with status `Permission Granted (Not Live)`:
          ** Human review to determine next steps:
               *** Change status to `Live (Scraping Active)`
               *** Update the permission_type field



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 4: EVENT SCRAPING
     * Enable Scraping

          ** Prerequisites:

              *** Status: `Live (Scraping Active)`

              *** `events_url` is set (or custom scraper knows where to look)

-----

     * Scraper Architecture 
          ** The scraping system uses a unified scanner/scraper approach:
               *** scrapers/scan-and-scrape-all-live-orgs.js - Unified CLI for scanning and scraping 
               *** scrapers/org-scanner.js - Core scanning module for policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
          ** Universal AI-powered scraper handles all organizations (no custom scrapers needed)


-----

     * Two Scan Scenarios
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
               *** Update DB record?: YES (updates tou_scanned_date)
               *** NEW Flag Detection: If flag goes FALSE → TRUE, action depends on permission_type
               *** Output status: "OK to scrape" or "STOP" (safety gate failure or new restriction)

-----

     * NEW Flag Detection on Live Orgs
          ** When scanning a LIVE organization, the scanner compares before/after state for each flag
          ** If a flag goes from FALSE to TRUE (new restriction detected):
               *** If permission_type = "Waiver": Log warning, continue scraping (waiver covers new restrictions)
               *** If no waiver: Reset status to "Nominated (Pending Mission Review)", stop scraping
          ** If a flag goes from TRUE to FALSE (restriction cleared):
               *** Log as good news, continue normally
          ** If flag stays same (known restriction):
               *** Check permission_type for waiver
               *** With waiver: Continue scraping
               *** Without waiver: Block at safety gate
          ** This replaces the old auto-rejection behavior with smarter flag-aware logic

-----

     * Safety Gates
          ** Safety Gate Check (4 checks with conditional flag bypass):
               *** Gate 1: Status must be "Live (Scraping Active)"
               *** Gate 2: permission_type must NOT be "Denied"
               *** Gate 3: If permission_type = "Waiver" → Skip flag checks (explicit permission overrides)
               *** Gate 4: If NOT Waiver → Check flags:
                    **** tou_flag must be FALSE
                    **** tech_block_flag must be FALSE
                    **** tech_rendering_flag must be FALSE
          ** Waiver Behavior: Organizations with permission_type = "Waiver" can have flags set but still scrape
          ** All gates logged to console with clear pass/fail indicators

-----

     * Scrape Flow (Per Organization)
          ** 1. Pre-Scrape Scan:
               *** Fetch ALL policy-relevant pages, scan for restriction keywords
               *** Check for NEW flags (flag that was FALSE, now TRUE)
               *** If NEW flag detected:
                    **** With Waiver: Log warning, continue
                    **** Without Waiver: Reset to Nominated, STOP
               *** Create scan_log entry
          ** 2. Safety Gate Check:
               *** Status = "Live (Scraping Active)"?
               *** permission_type != "Denied"?
               *** If permission_type = "Waiver" → Skip flag checks
               *** Otherwise → Check tou_flag, tech_block_flag, tech_rendering_flag
          ** 3. If Safety Gates Pass:
               *** Respectful Delay (5-8 seconds randomized)
               *** Scrape Events Page
               *** Deep scrape individual event pages for additional details
               *** Check event against exclusion rules (training, political, etc.)
               *** Apply event_policy (accept_all→approved, propose_events→nominated)
               *** Save Events + Update last_scraped

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
              *** Features: Auto-detects org, runs pre-scrape policy doc check, safety gates with waiver support, AI event extraction

          ** Option D: Scan Only Specific Organization (no scraping)
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --org "CNAS" --scan-only

          ** Option E: Discover New Org by Domain
              *** powershell
              *** node scrapers/scan-and-scrape-all-live-orgs.js --domain "csis.org"
              *** Features: Dedup check, full discovery scan, displays info for manual add

-----

     * Scraper Behavior
          ** 1. Checks safety gates (status, permission_type, flags with waiver bypass)
          ** 2. Checks Policy Doc and Privacy pages for restrictions (context-aware)
          ** 3. Detects NEW flags and handles based on permission_type:
               *** With Waiver: Log warning, continue
               *** Without Waiver: Reset to Nominated, stop
          ** 4. Fetches events page from `events_url`
          ** 5. Parses event data (title, date, time, location, URL)
          ** 6. Checks for duplicates by `source_id` AND by title+org+date (improved 2026-01-17)
          ** 7. Applies exclusion rules
          ** 8. Sets event_status based on event_policy (accept_all → approved, propose_events → nominated)
          ** 9. Saves new events to `events` collection
          ** 10. Updates `last_scraped` timestamp on organization
          ** 11. Creates scan_log entry with full audit trail

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
# SCRAPING REQUIREMENTS 

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
               *** restriction_source_urls: All URLs where restrictions were found (newline-separated) - NEW 2026-01-21
               *** restriction_context: 20 words before/after each trigger term (human-readable) - NEW 2026-01-21
               *** Implementation: scanTOU() captures ALL restriction pages, getContextWords() extracts 20-word context
               *** Status: ✅ IMPLEMENTED (2026-01-21)

-----

          ** Requirement 5: We maintain an audit log of scans and scan/scrape results so we can see when something changes and do not overwrite earlier findings
               *** Track scan date, type, duration
               *** Preserve all flags and URLs found
               *** Record status changes (before/after)
               *** Full log output for debugging
               *** Implementation: scan_logs collection (22 fields) - createScanLog() in org-scanner.js
               *** Status: ✅ IMPLEMENTED (2026-01-21)

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
          ** Req 1 (Where to look): ✅ IMPLEMENTED - 40 paths + footer parsing
          ** Req 2 (What to look for): ✅ IMPLEMENTED - context-aware detection
          ** Req 3 (Interpret/false positives): ✅ IMPLEMENTED - excluded contexts, prohibition phrases
          ** Req 4 (Save evidence): ✅ IMPLEMENTED - restriction_source_urls, restriction_context
          ** Req 5 (Audit log): ✅ IMPLEMENTED - scan_logs collection (22 fields)
          ** Req 6 (Learn and improve): ✅ PROCESS EXISTS
          ** Req 7 (Scanner files in sync): ✅ IN SYNC
          ** Req 8 (ConOp in sync): ✅ IN SYNC (as of 2026-01-21)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# POLICY-RELEVANT DOCUMENT SCANNING

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

     * Policy-Relevant URL Patterns (40 paths)
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

     * Context-Aware Restriction Detection 
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
               *** Robotics policy discussions (NEW 2026-01-21): "robotics policy", "robot regulation", "robot ethics", "robotics research"
               *** Autonomous systems discussions (NEW 2026-01-21): "autonomous systems", "autonomous weapons", "drone policy", "unmanned systems"
               *** AI/ML policy discussions (NEW 2026-01-21): "ai governance", "ai regulation", "ai policy", "artificial intelligence policy", "machine learning research"
               *** Organizational research context (NEW 2026-01-21): "our research on", "our work on", "we study", "our experts", "our scholars"
               *** Publication context (NEW 2026-01-21): "this paper", "this article", "this report", "the author", "the researchers"

-----

     * Detection Logic Flow
          ** Step 1: Check HIGH_CONFIDENCE terms → Flag immediately if found
          ** Step 2: Check CONTEXT_REQUIRED terms:
               *** Found keyword? → Check for EXCLUDED_CONTEXT nearby first
               *** Exclusion found? → Skip (likely false positive)
               *** No exclusion? → Check for nearby PROHIBITION_PHRASE (within 150 chars)
               *** Prohibition found? → FLAG as restriction
          ** Step 3: Record all findings in tou_notes with context snippets

-----

     * POTENTIAL ADDITIONS TO CONSIDER (for future improvement)
          ** These terms appear in TOU documents but are not yet in scanner detection:
          ** Reproduction terms: "reproduce", "copy", "duplicate", "replicate"
          ** Distribution terms: "distribute", "redistribute", "disseminate"
          ** Aggregation terms: "aggregate", "compile", "collect systematically"
          ** Commercial use terms: "commercial purposes", "commercial use", "for profit"
          ** Derivative works terms: "derivative works", "modify", "adapt"
          ** Framing terms: "frame", "framing", "inline linking"
          ** Note: These would need CONTEXT_REQUIRED treatment (check for prohibition phrase nearby)
          ** Question: Should "commercial use" trigger a flag asking about our non-commercial status?

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
# JAVASCRIPT RENDERING DETECTION

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
          ** Field Name: tech_rendering_flag (renamed from js_render_flag)
          ** Field Type: Bool
          ** Purpose: True if site requires JavaScript to render event content
          ** Set By: org-scanner.js during homepage and events page analysis
          ** Display: Admin Interface shows ⚙️ JS-RENDER badge and info box

-----

     * Auto-Status Update Behavior 
          ** For LIVE organizations with tech_rendering_flag newly detected:
               *** Status changes to "Rejected by Org" (changed from Nominated)
               *** Scraping is blocked by safety gates
               *** Human can manually override if Puppeteer scraper is available
          ** For NOMINATED organizations:
               *** Flag is set, status remains "Nominated (Pending Mission Review)"
               *** Human reviewer sees JS rendering warning during review

-----

     * Admin Interface Display
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

-----

     * 2026-01-21 UPDATE: Events Page Only
          ** Homepage JS rendering NO LONGER sets tech_rendering_flag
          ** Only EVENTS PAGE JS rendering triggers the flag
          ** Rationale: Homepage JS (navbars, animations) doesn't affect our ability to scrape events or scan legal pages
          ** Implementation: detectJavaScriptRendering() still runs on homepage but only logs, doesn't flag
          ** Events page check (Step 3.5 in scanOrganization) still sets flag if JS-rendered
          ** This reduces false positives for sites with JS navbars but SSR content



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

     * Event Visibility
          ** Only events with event_status = "approved" are shown in the public UI
          ** Events with event_status = "nominated" or "rejected" are not visible to public


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

     * Name: logo.png
     * Type: Image
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\logo.png
     * Function/Purpose: UI logo asset

-----

     * Files - Cleanup Scripts (Root Level)

-----

     * Name: cleanup-orphaned-events.js
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\cleanup-orphaned-events.js
     * Function/Purpose: Removes orphaned events

-----

     * Name: cleanup-duplicate-events.js 
     * Type: JavaScript Script
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\cleanup-duplicate-events.js
     * Function/Purpose: Removes duplicate events based on title+org+date, run with --dry-run first

-----

     * Name: fix-cfr-events.js 
     * Type: JavaScript Script (one-time use)
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\fix-cfr-events.js
     * Function/Purpose: One-time script to set CFR events to nominated status after adding event_status field

-----

     * Name: migrate-notes-v24.js
     * Type: JavaScript Script (one-time use)
     * Location: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\migrate-notes-v24.js
     * Function/Purpose: One-time migration script to consolidate tou_notes + scrape_notes → notes field. Run with --dry-run first. 68 orgs migrated successfully.

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
          ** admin-interface-v22.html
               *** Admin dashboard for managing organizations, contacts, and events. 
               *** Internal use only.
               *** Features: 7 status values, 4 rejection flags consolidated, event review with Accept/Reject, 5 safety gates, duplicate detection display, organization deletion with safety checks
          ** logo.png
               *** UI logo asset


-----

     * Cleanup Scripts (Root Level)
          ** cleanup-orphaned-events.js 
               *** Removes events that no longer have a valid parent organization.
          ** cleanup-duplicate-events.js 
               *** Removes duplicate events based on title + organization + start_date
               *** Run with --dry-run to preview before deleting

-----

     * Setup and Utility Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure.
          ** proxy-server.js 
               *** Local proxy server to handle CORS issues when testing scrapers locally.

-----

     * scrapers Folder
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
               *** Runs AI analysis to extract org name and generate summary 
               *** Applies exclusion keyword filtering 
               *** Sets discovery_method = "event-based"
               *** Populates triggering_event_title, triggering_event_score, triggering_event_url
               *** Status: Functional
               *** Run: node scrapers/discover-orgs-by-events.js
          ** org-scanner.js 
               *** Unified scanning module consolidating policy doc, tech block, events URL, POC, and AI analysis
               *** Context-aware restriction detection to avoid false positives
               *** Auto-status update: sets "Rejected by Org" when restrictions found on Live orgs
               *** JavaScript/tech rendering detection 
               *** Used by discover-orgs-by-events.js and can be called directly for manual scans
               *** Functions: scanOrganization(), scanTOU(), findAllLegalUrls(), findRestrictions(), gatherPOC(), analyzeWithAI()
               *** Key Constants: HIGH_CONFIDENCE_RESTRICTION_TERMS, CONTEXT_REQUIRED_TERMS, PROHIBITION_PHRASES, EXCLUDED_CONTEXTS
               *** Run: node scrapers/org-scanner.js (CLI wrapper coming soon)

-----

     * Scrapers
          ** scan-and-scrape-all-live-orgs.js
               *** Unified scan + scrape CLI replacing multiple legacy scripts
               *** Handles: batch mode (--all), single org (--org), domain discovery (--domain)
               *** Smart detection: new org vs existing org
               *** Two scan modes: Discovery Scan (new orgs) vs Pre-Scrape Scan (existing orgs)
               *** AI-powered universal event extraction using gpt-4o-mini
               *** extractLinks() function extracts actual href URLs from HTML before AI processing
               *** Deep scrapes individual event pages for additional details
               *** Deduplication checks (source_id + title/org/date)
               *** Safety gates with waiver support, duplicate detection display, organization deletion with safety checks
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
          ** org-scanner.js
               *** Core scanning module used by scan-and-scrape-all-live-orgs.js
               *** Multi-page policy doc scanning - findAllLegalUrls() finds ALL legal pages, scanTOU() scans each one
               *** Context-aware restriction detection - avoids false positives
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
          ** list-ready-orgs.js 
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
          ** cleanup-duplicate-events.js 
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

          ** Auto-Discovery
               *** Scanner auto-saves POC contacts to database
               *** New contacts have notes: "Auto-discovered by scanner"
               *** contact_type auto-detected based on email prefix:
                    **** press@, media@ → Media/PR
                    **** events@, programs@ → Events
                    **** legal@, permissions@ → Legal/Permissions
                    **** ceo@, director@ → Leadership
                    **** Other prefixes → Other
               *** Existing contacts: last_verified date updated
               *** No duplicates: checks org + email before creating

-----

     * scan_logs Collection - Tracks every scan operation for audit trail

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection: → organizations
          ** Setting - Single/multiple: Single
          ** Setting - Cascade delete: off
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Linked organization

          ** Field Name: scan_type
          ** Field Type: Select
          ** Setting - Values: discovery, pre-scrape, manual, scheduled
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Type of scan performed

          ** Field Name: scan_date
          ** Field Type: DateTime
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: When scan was performed

          ** Field Name: legal_pages_found
          ** Field Type: Number
          ** Setting - Min: 0
          ** Setting - No decimals: on
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Count of legal pages discovered

          ** Field Name: legal_page_urls
          ** Field Type: Plain Text
          ** Setting - max length: 2000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: URLs of legal pages found (newline-separated)

          ** Field Name: no_legal_pages_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if zero legal pages found

          ** Field Name: restrictions_found
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if any restrictions detected

          ** Field Name: restriction_terms
          ** Field Type: Plain Text
          ** Setting - max length: 500
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Terms that triggered restriction detection

          ** Field Name: restriction_source_urls
          ** Field Type: Plain Text
          ** Setting - max length: 2000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: URLs where restrictions were found

          ** Field Name: restriction_contexts
          ** Field Type: Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Context snippets (20 words before/after trigger)

          ** Field Name: tech_block
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if 403/401 detected

          ** Field Name: microsite_detected
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if microsite pattern detected

          ** Field Name: microsite_suspect
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if uncertain microsite detection

          ** Field Name: js_rendering
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if events page requires JavaScript

          ** Field Name: poc_found
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if POC contact discovered

          ** Field Name: poc_email
          ** Field Type: Email
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: POC email if found

          ** Field Name: status_before
          ** Field Type: Plain Text
          ** Setting - max length: 100
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Org status before scan

          ** Field Name: status_after
          ** Field Type: Plain Text
          ** Setting - max length: 100
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Org status after scan (if changed)

          ** Field Name: flags_set
          ** Field Type: Plain Text
          ** Setting - max length: 500
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Comma-separated list of flags set during scan

          ** Field Name: duration_ms
          ** Field Type: Number
          ** Setting - Min: 0
          ** Setting - No decimals: on
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Scan duration in milliseconds

          ** Field Name: error
          ** Field Type: Plain Text
          ** Setting - max length: 500
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Error message if scan failed

          ** Field Name: full_log
          ** Field Type: Plain Text
          ** Setting - max length: 10000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Complete log output for debugging

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

          ** Field Name: event_status 
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
          ** Field Purpose/Notes: Current workflow status

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
          ** Field Purpose/Notes: AI-generated summary of org and events

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

          ** Field Name: triggering_event_title
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: For event-based discovery: Title of event that triggered org nomination

          ** Field Name: triggering_event_score
          ** Field Type: Number 
          ** Setting - Min: 0
          ** Setting - Max: 100
          ** Setting - Nonzero: off 
          ** Setting - Presentable: off 
          ** Setting - No decimals: off 
          ** Field Purpose/Notes: For event-based discovery: Cosine similarity score (0-100) of triggering event

          ** Field Name: triggering_event_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: For event-based discovery: URL to the event that triggered org nomination

          ** Field Name: tou_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if any policy-relevant document (TOU, TOS, User Agreement, Privacy Policy, etc.) may prohibit scraping. Set during Initial Org Scan. Does NOT auto-reject during discovery; flags for human review. Auto-sets status to "Rejected by Org" if detected on Live org.

          ** Field Name: tech_block_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: BLANK
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if site returns 403/401 errors (technically blocks access). Set during Initial Org Scan. Does NOT auto-reject during discovery; flags for human review. Auto-sets status to "Rejected by Org" if detected on Live org.

          ** Field Name: tech_rendering_flag (renamed from js_render_flag - 2026-01-17)
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if site uses JavaScript to render event content (React, Vue, Angular, Next.js, etc.). Set during Initial Org Scan when homepage or events page shows JS rendering indicators. Auto-sets status to "Rejected by Org" if detected on Live org. Requires headless browser (Puppeteer) for scraping.

          ** Field Name: duplicate_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if organization is identified as a duplicate of another org. Set by quality-audit.js script when domain or name match detected. Less-complete org gets flagged; more-complete org is kept as primary.

          ** Field Name: duplicate_of
          ** Field Type: Relation
          ** Setting - Select Collection: organizations
          ** Setting - Single/Multiple: Single
          ** Setting - Cascade delete: off
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Points to the primary (more complete) organization that this org is a duplicate of. Set by quality-audit.js script. Used by Admin Interface to show link to primary org for manual merge/delete workflow.

          ** Field Name: no_legal_pages_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if scanner found zero legal pages on website. Flags orgs that may need manual review to find TOU/Privacy pages. Set by org-scanner.js during scan.

          ** Field Name: microsite_suspect_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if scanner detected uncertain microsite pattern. Auto-rejects org to "Rejected by Org" when flagged. Scanner may incorrectly identify a main site as a microsite.

          ** Field Name: microsite_suspect_reason
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 500
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Explanation of why scanner flagged the microsite as suspect. Helps human reviewer understand the detection.

          ** Field Name: restriction_source_urls
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: URLs of ALL pages where restrictions were found (newline-separated). Captures every page, not just the first.

          ** Field Name: restriction_context
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Human-readable context showing 20 words before and after each trigger term. Format: "[pageType] term: ...context **TRIGGER** context..."

          ** Field Name: tou_scanned_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: When policy-relevant pages were last scanned

          ** Field Name: tou_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: URL to Terms of Use page (primary policy doc) for automated scanning

          ** Field Name: privacy_url
          ** Field Type: URL 
          ** Setting - Except domains: BLANK
          ** Setting - Only domains: BLANK
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: URL to Privacy Policy page for automated scanning

          ** Field Name: tou_notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 2000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Notes about all policy-relevant documents reviewed (TOU, TOS, User Agreement, Acceptable Use Policy, Privacy Policy, etc.), which pages were scanned, and any restrictions found. Includes context-aware detection results.

          ** Field Name: scrape_notes
          ** Field Type (text box): Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 5000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Auto-populated by scanner with technical scraping details. Includes JS rendering detection results, event content analysis, and other scraping-relevant observations.

          ** Field Name: go_live_date
          ** Field Type: DateTime
          ** Setting - min date (UTC): BLANK
          ** Setting - max date (UTC): BLANK
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Calculated deadline (permission_requested_date + 7 days) for implied permission

          ** Field Name: permission_type
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): Explicit, Implied (No Response), Waiver, Denied
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Type of permission received or status:
               *** Explicit: Organization explicitly granted permission
               *** Implied (No Response): No response after 1 week wait period - proceed with scraping
               *** Waiver: TOU has restrictions, but org gave explicit permission anyway. Safety gates skip flag checks for orgs with Waiver.
               *** Denied: Organization explicitly denied permission. Replaces permission_denied_flag. Safety gates block scraping.

          ** Field Name: event_policy
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): accept_all, propose_events
          ** Setting - Single/Multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: How to handle events from this org (accept_all → event_status=approved, propose_events → event_status=nominated)

          ** Field Name: correspondence_log
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 50000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: JSON array storing correspondence history with org. Each entry contains: date, direction (sent/received/note), contact, subject, text. Displayed as timeline in Admin Interface Status & History tab.

          ** Status Field Values (organization.status)
               *** Nominated (Pending Mission Review): AI-suggested, awaiting review
               *** Mission Approved (Request Not Sent): Approved, need to send permission request
               *** Permission Requested (Pending Org Response): Email sent, waiting for response
               *** Permission Granted (Not Live): Permission received, not yet scraping
               *** Rejected by Mission: Does not fit project mission/focus
               *** Rejected by Org: Organization blocked us (TOU restrictions, tech blocks, tech rendering, denied permission)
               *** Live (Scraping Active): Actively being scraped

          ** Permission Type Values (organization.permission_type)
               *** (empty): Not yet determined
               *** Explicit: Organization explicitly granted permission
               *** Implied (No Response): No response after 1 week wait period - proceed with scraping
               *** Waiver: TOU restrictions exist, but org gave explicit permission anyway (safety gates skip flag checks)
               *** Denied: Organization explicitly denied permission (safety gates block scraping)

          ** Rejection Flags (3 flags)
               *** tou_flag: Policy document restrictions found
               *** tech_block_flag: 403/401 technical block
               *** tech_rendering_flag: JavaScript rendering required (renamed from js_render_flag)

          ** Quality Flags
               *** duplicate_flag: Organization is a duplicate of another org (set by quality-audit.js)
               *** duplicate_of: Relation pointing to the primary org to keep

          ** Scanner Flags
               *** no_legal_pages_flag: Scanner found zero legal pages on website
               *** microsite_suspect_flag: Uncertain microsite detection (auto-rejects)
               *** microsite_suspect_reason: Explanation of why microsite flagged

          ** Restriction Evidence Fields
               *** restriction_source_urls: All pages where restrictions found (newline-separated)
               *** restriction_context: 20 words before/after trigger term (human-readable)

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
# SESSION HANDOFFS

     * How to Use:
          ** Start of session: Tell Claude which domain, Claude reads that handoff + relevant ConOp sections
          ** End of session: Claude updates BOTH the ConOp content AND the relevant handoff section
          ** This keeps everything in sync in one document

-----

     * SCRAPING
          ** Relevant ConOp Sections: 
               *** SCRAPING REQUIREMENTS
               *** ORGANIZATION WORKFLOW 4: EVENT SCRAPING 
               *** KEY FILES (scrapers/)
               *** POLICY-RELEVANT DOCUMENT SCANNING 
               *** JAVASCRIPT RENDERING DETECTION

          ** Files to Attach to New Chat:
               *** This ConOp document
               *** scrapers/scan-and-scrape-all-live-orgs.js
               *** scrapers/org-scanner.js
               *** admin-interface-v22.html
               *** PocketBase schema doc

          ** Last Session: 2026-01-21
               *** SCANNER V3 - Major enhancements implemented and tested:
                    **** no_legal_pages_flag - flags orgs with zero legal pages found
                    **** microsite_suspect_flag - flags uncertain microsite detections, auto-rejects
                    **** restriction_source_urls - captures ALL pages with restrictions (not just first)
                    **** restriction_context - 20 words before/after trigger term for human review
                    **** scan_logs collection - 22-field audit trail for every scan
                    **** Contact auto-save - POC emails saved to contacts collection automatically
                    **** JS rendering fix - only flags if EVENTS PAGE is JS-rendered (not homepage)
               *** PocketBase schema updated:
                    **** organizations: 5 new fields added (no_legal_pages_flag, microsite_suspect_flag, microsite_suspect_reason, restriction_source_urls, restriction_context)
                    **** scan_logs: new collection created (22 fields)
               *** Batch scan completed with --approved flag (60 orgs scanned)
               *** All 8 original requirements now ✅ IMPLEMENTED

          ** Current Status:
               *** All 8 scraping requirements: ✅ COMPLETE
               *** Scanner v3: ✅ DEPLOYED AND TESTED
               *** scan_logs: ✅ WORKING (records being created)
               *** Contact auto-save: ✅ WORKING (new contacts created with "Auto-discovered by scanner" note)

          ** Clean Orgs Ready for "Live" Status (23 total):
               *** American Enterprise Institute (AEI)
               *** Billington CyberSecurity
               *** Center for Strategic and International Studies (CSIS)
               *** Consumer Technology Association (CTA)
               *** Council on Foreign Relations
               *** Cybersecurity & Infrastructure Security Agency (CISA)
               *** Federal Business Council, Inc. (FBC)
               *** GIS Software for Mapping and Spatial Analytics
               *** Institute of International Finance
               *** Institute of National Security (INS)
               *** International Association of Privacy Professionals (IAPP)
               *** Jean Monnet Center of Excellence (JMCE)
               *** National Cybersecurity Alliance
               *** Parliamentary Intelligence-Security Forum (PI-SF)
               *** Potomac Officers Club
               *** Professional Services Council (PSC)
               *** SANS Institute
               *** Surface Navy Association (SNA)
               *** The Belfer Center for Science and International Affairs
               *** The Hoover Institution
               *** The Institute for National Security Studies (INSS)
               *** The Stimson Center
               *** Women in Cybersecurity (WiCyS)

          ** Flagged Orgs Requiring Review/Permission:
               *** tou_flag (14 orgs): Atlantic Council, Brookings, RAND, Aspen Institute, Stanford Gordian Knot, AFCEA, INSA, Cybersecurity Summit, IDGA, NSA, Nuclear Energy Institute, Gartner, RSA Conference, WiCyS
               *** tech_block_flag (8 orgs): Chatham House, NDIA, NSA, NSDPI, Nuclear Energy Institute, Gartner, RSA Conference
               *** tech_rendering_flag (13 orgs): New America, DSI Group, IISS, National Homeland Security Assoc, NSSA, SAE Media, SATShow, SCSP, Suits and Spooks, Cyber Threat Alliance, hsdf.org
               *** microsite_suspect_flag (6 orgs): CNAS, E.Republic, UC Berkeley CLTC, Apex Defense, SCSP, Suits and Spooks
               *** no_legal_pages_flag (6 orgs): National Cyber Summit, National Defense University, TeleStrategies, National Guard Bureau, National Security Council, Apex Defense

          ** Next Steps (for next session):
               *** 1. Review flagged orgs and determine which to request permission from
               *** 2. Generate customized permission request emails using restriction_context
               *** 3. Reference specific restrictions found (e.g., "Your copyright page states...")
               *** 4. Update org statuses based on responses
               *** 5. Set clean orgs to "Live" and begin scraping

-----

     * PERMISSION REQUESTS
          ** Relevant ConOp Sections: ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT, ADMIN INTERFACE

          ** Files to Attach to New Chat:
               *** This ConOp document
               *** admin-interface-v22.html
               *** PocketBase schema doc

          ** Last Session: 2026-01-24
               *** Built TOU-aware email draft generation in Admin Interface:
                    **** Orgs WITH restrictions: "Permission Request" format
                         ***** Subject: "Permission Request: Event Listing from [Org Name]"
                         ***** Multi-bullet format for restriction sources with page type detection
                         ***** NO deadline mentioned
                    **** Orgs WITHOUT restrictions: "Notice" format
                         ***** Subject: "Notice: Automated Event Collection from [Org Name]"
                         ***** Includes 7-day proceed date
                         ***** "No response needed if you are fine with this"
               *** Added Contact Selector dropdown (priority sorted by contact_type)
               *** Added Correspondence Log for tracking all communications
               *** Added Go-Live date conditional display (no auto go-live for restricted orgs)
               *** Added Live Safety Warning when setting restricted orgs to Live
               *** Added correspondence_log field to PocketBase (Plain Text, max 50000 chars)

          ** Current Status:
               *** Admin Interface v22 fully functional for permission request workflow
               *** Email drafts auto-generated with org-specific restriction context
               *** Correspondence tracking available via correspondence_log
               *** Two-way filter (status vs restrictions) for easy org navigation

          ** Next Steps:
               *** 1. Generate and send permission requests to 14 orgs with tou_flag
               *** 2. Log sent emails in correspondence_log
               *** 3. Track responses and update org status accordingly
               *** 4. Consider email sending integration (Resend/SendGrid)
               *** 5. Update SOP document for new email templates
               *** 6. Add [Quick Scan] to generate an ad-hoc scan of a site


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
          ** Key Files: admin-interface-v22.html 
          ** Last Session: 2026-01-24
               *** Created v22 with permission request workflow enhancements:
                    **** Two independent filter dropdowns on Org By Status tab (Workflow Status + Orgs with Restrictions)
                    **** Dashboard "Has Restrictions" stat card (counts orgs with tou_flag OR tech_block_flag across all statuses)
                    **** Contact selector dropdown for permission requests (priority sorted by contact_type)
                    **** TOU-aware email draft generation:
                         ***** Orgs WITH restrictions: Permission Request format, no deadline, multi-bullet restriction sources
                         ***** Orgs WITHOUT restrictions: Notice format, 7-day deadline, "no response needed" wording
                    **** Go-Live date conditional display (no auto go-live for restricted orgs)
                    **** Correspondence log (add/view/delete entries, stored as JSON)
                    **** Live Safety Warning (confirmation dialog when setting status to Live with active flags)
                    **** TOU Warning Box shows restriction_source_urls and restriction_context
          ** Current Status: Functional with permission request workflow, restriction filtering, correspondence tracking
          ** Blocked/Broken: None known
          ** Next Steps: 
               *** Refine user interface 
               *** Test email generation for orgs with restrictions
               *** Update SOP documentation for new email templates
               *** Consider adding email sending integration (Resend/SendGrid)

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
          ** Key Files: admin-interface-v22.html (Status & History tab)
          ** Last Session: 2026-01-24
               *** Built full permission request workflow in Admin Interface v22:
                    **** Contact selector dropdown (priority sorted)
                    **** TOU-aware email draft generation (two formats)
                    **** Correspondence log for tracking communications
                    **** Go-Live date conditional display
                    **** Live Safety Warning for restricted orgs
               *** Previous session (2026-01-17):
                    **** Updated permission wait time from 2 weeks to 1 week
                    **** Updated permission_type values to "Explicit" and "Implied"
                    **** Added permission_denied_flag
                    **** go_live_date now calculated as permission_requested_date + 7 days
          ** Current Status: Functional with complete permission request workflow
          ** Blocked/Broken: None known
          ** Next Steps: 
               *** Send permission requests to restricted orgs
               *** Add alert feature for go-live date notifications

-----

     * POCKETBASE SCHEMA
          ** Relevant ConOp Sections: POCKETBASE COLLECTIONS AND VALUES
          ** Key Files: PocketBase Admin UI
          ** Last Session: 2026-01-24
               *** Added correspondence_log field to organizations collection:
                    **** Plain Text, max 50000 chars
                    **** Stores JSON array of correspondence entries
                    **** Used by Admin Interface correspondence log feature
               *** Previous session (2026-01-21): Added 5 new fields to organizations collection:
                    **** no_legal_pages_flag (Bool) - flags orgs with zero legal pages
                    **** microsite_suspect_flag (Bool) - flags uncertain microsite detection
                    **** microsite_suspect_reason (Plain Text) - explanation of detection
                    **** restriction_source_urls (Plain Text) - all pages with restrictions
                    **** restriction_context (Plain Text) - 20 words before/after trigger
               *** Created scan_logs collection (22 fields) for audit trail
               *** Renamed "scan_logs_Collection" to "scan_logs" (fixed naming)
               *** Previous session (2026-01-19): duplicate_flag, duplicate_of fields
          ** Current Status: Schema fully updated for Admin Interface v22
          ** Blocked/Broken: None
          ** Next Steps: None immediate




@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# NEXT SESSION HANDOFF - ADMIN INTERFACE CLEANUP (2026-01-25)

     * Session Focus: Clean up Admin Interface permission request and tracking sections for better UX.

-----

     * Files to Upload:
          ** This ConOp document (2026-01-25_ConOp_Event_Finder.md)
          ** admin-interface-v22.html (latest version with waiver support)
          ** org-scanner.js (if scanner changes needed)
          ** scan-and-scrape-all-live-orgs.js (if scraper changes needed)

-----

     * Completed This Session (2026-01-25):
          ** Implemented Waiver workflow for orgs with TOU flags but explicit permission:
               *** permission_type now has 4 values: Explicit, Implied (No Response), Waiver, Denied
               *** Waiver = TOU has restrictions, but org gave explicit permission anyway
               *** Denied = Org explicitly declined (replaces permission_denied_flag)
          ** Updated scanner with NEW flag detection logic:
               *** Tracks before/after state for tou_flag, tech_block_flag, tech_rendering_flag
               *** If flag goes FALSE → TRUE:
                    **** With Waiver: Log warning, continue scraping
                    **** Without Waiver: Reset status to "Nominated (Pending Mission Review)", stop scraping
               *** Flags are now informational only - no auto-rejection
          ** Updated safety gates with waiver support:
               *** Gate 1: Status must be "Live (Scraping Active)"
               *** Gate 2: permission_type must NOT be "Denied"
               *** Gate 3: If permission_type = "Waiver" → Skip flag checks
               *** Gate 4: Otherwise check tou_flag, tech_block_flag, tech_rendering_flag
          ** Deleted permission_denied_flag from PocketBase (replaced by permission_type = "Denied")
          ** Updated Admin Interface v22:
               *** permission_type dropdown now has 4 options
               *** Removed permissionDeniedFlag checkbox from Flags section
               *** Added note pointing users to permission_type dropdown for denied status
               *** Updated dashboard stats to use permission_type = "Denied"
          ** Migrated notes fields (68 orgs):
               *** Combined tou_notes + scrape_notes → notes
               *** 4 orgs had encoding issues (data preserved in original fields)
          ** Verified scanner and scraper deployed to local .\scrapers\ folder
          ** Deployed admin-interface-v22.html to Vercel

-----

     * Key Changes for Orgs with TOU Restrictions:
          ** If org has tou_flag=true AND gives explicit permission:
               *** Set permission_type = "Waiver"
               *** Org can now go Live even with flags set
               *** Safety gates skip flag checks for Waiver orgs
               *** Scanner won't reset status when it sees the known flags
          ** If org has tou_flag=true AND declines permission:
               *** Set permission_type = "Denied"
               *** Safety gates block all scraping
               *** Status should be "Rejected by Org"

-----

     * Files Updated This Session:
          ** admin-interface-v22.html - Waiver dropdown, removed permission_denied_flag
          ** org-scanner.js - NEW flag detection, waiver-aware logic
          ** scan-and-scrape-all-live-orgs.js - Waiver-aware safety gates
          ** migrate-notes-v24.js - One-time migration script (already run)

-----

     * Next Steps:
          ** 1. Clean up Admin Interface permission request UX
          ** 2. Improve correspondence log workflow
          ** 3. Send permission requests to orgs with restrictions
          ** 4. Set permission_type = "Waiver" for orgs that approve despite TOU
          ** 5. Continue activating clean orgs
          ** 6. Add alert feature for go-live date notifications

-----

     * System State (as of 2026-01-25):
          ** 75 organizations total
          ** permission_type field is single source of truth for permission status
          ** Flags are informational only - do not auto-change status
          ** NEW flag detection triggers status reset to Nominated (unless waiver exists)
          ** Safety gates enforce Live status + permission_type checks
          ** Waiver support allows scraping orgs with known flags


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SUMMARY OF BUSINESS NEEDS AND FUTURE ACTIONS

     * Incorporate - USG

     * Trademark - USPTO: Logo

     * Trademark - USPTO: Name / BalanceFWD

     * Trademark - USPTO: Name / Balance Forward

     * Taxes



