@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT NAME:  
2026-02-01-1400 ConOp Event_Finder.md





@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
TABLE OF CONTENTS

# INTELLECTUAL PROPERTY NOTICE  
# DOCUMENT FORMATTING GUIDELINES
# PROJECT OVERVIEW

# WORKFLOW OVERVIEW
# WORKFLOW - STATUS REFERENCES

# ORGANIZATION WORKFLOW STEP 1A: MANUAL DISCOVERY
# ORGANIZATION WORKFLOW STEP 1B: PROFILE-BASED DISCOVERY
# ORGANIZATION WORKFLOW STEP 1C: EVENT-BASED DISCOVERY 
     # EVENT-BASED ORGANIZATION DISCOVERY ARCHITECTURE
# ORGANIZATION WORKFLOW 2: MISSION REVIEW
# ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT 
# ORGANIZATION WORKFLOW 4: SCRAPING
# ORGANIZATION WORKFLOW 5: EVENT APPROVAL
# ORGANIZATION WORKFLOW 6: IMAGE GENERATION
# ORGANIZATION WORKFLOW 7: EVENT PUBLISHING AND CURATING
# ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT
# ORGANIZATION WORKFLOW 9: ORGANIZATION INFORMATION VALIDATION AND ENHANCEMENT

# EVENT POLICY - ORGANIZATION TRUST LEVELS

# SCANNING AND SCRAPING - PRINCIPLES
# SCANNING - UNIFIED APPROACH PHILOSOPHY - DECISION LOGIC
# SCANNING - ORG-SCANNER DETAILS
# SCANNING - POLICY-RELEVANT DOCUMENTS
# SCANNING - JAVASCRIPT RENDERING DETECTION
# SCANNING AND SCRAPING - LOGS

# IMAGE GENERATION PROGRAM ARCHITECTURE

# PUBLIC UI FEATURES

# KEY FOLDERS AND FILES
# SCRIPTS
# GITHUB ACTIONS

# POCKETBASE COLLECTIONS AND VALUES

# TECH STACK
# MULTI-COMPUTER WORKFLOW
# VERCEL DEPLOYMENT
# ADMIN INTERFACE

# SESSION HANDOFFS



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
# WORKFLOW OVERVIEW
     * Identify, Scan, and Nominate Organizations
          ** Manual Discovery
          ** Organization Profile-Based Discovery
          ** Event-Based Discovery

     * Assess and Adjudicate Organizations 
          ** Assess the Nominated Organization's fit, relevance, and appropriateness
          ** Assess difficultly in working with the Organization (based on restriction flags) 
          ** Determine if events should be approved on a case-by-case basis

     * Get Permission to Automatically Gather Information
          ** Partner Engagement Specialist reaches out to organizations to ensure Organizational awareness and/or verify permission.
          ** Send auto-generated emails
          ** Make phone calls
          ** Track correspondence
          ** Record results

     * Continually check for updates of organizational information and update system

     * Activate event scraping (with scanning) if appropriate and approved

     * Prepare Event Information for Users
          ** Approve events (if case by case)
          ** Generate images to accompany event information online
          ** Curate events as needed

     * Use Feedback Loop
          ** Use event and organization information to improve nominations for new events and Orgs


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
# ORGANIZATION WORKFLOW STEP 1A: MANUAL DISCOVERY

     * VALIDATED 2026-01-27: Currently NO automatic scanning for manual adds
     >>>>> FUTURE REQUIREMENT:  IMPLEMENT ORG-SCANNER TO PERFROM SCANNING AND RECURSIVE SEARCHING WHEN THERE IS A MANUAL DISCOVERY.

     * Current Implementation:
          * In Admin Interface: Organizations tab → "Add Organization" button
          * Fill in: Name, Website, Description, Type
          * Sets discovery method = "manual"
          * Status: Nominated (Pending Mission Review)
               ** NO automatic scanning when org is manually added
               ** User must manually run scan-and-scrape-all-live-orgs.js --org "name" to scan
               ** Flags are NOT automatically set

     >>>>> FUTURE REQUIREMENT:  ADD [SCAN AND NOMINATE] button
     >>>>> FUTURE REQUIREMENT: USE ORG-SCANNER AND RECURSIVE SEARCHING TO THIS STAGE OF THE PROCESS


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW STEP 1B: PROFILE-BASED DISCOVERY

     * Current Implementation (UPDATED 2026-01-31)
          * Mechanism: suggest-organizations.js  
          * Run Command: node scrapers/suggest-organizations.js
          * NOW USES org-scanner.js for actual scanning after AI suggests

-----

     * How Profile-Based Discovery Works (UPDATED 2026-01-31)
          ** Step 1: Script initializes org-scanner.js
          ** Step 2: Script fetches all approved organizations from PocketBase
          ** Step 3: AI (GPT-4o-mini) analyzes organizational profiles and patterns
          ** Step 4: AI suggests NEW organizations similar to approved ones
          ** Step 5: For each suggestion, AI provides: name, website, description, org_type
          ** Step 6: Script creates organization record with status = "Nominated (Pending Mission Review)"
          ** Step 7: Sets discovery_method = "profile-based"
          ** Step 8 (NEW): org-scanner.js scans the suggested org for REAL TOU/tech flags
          ** Step 9 (NEW): Smart POC gathering saves contacts if found
  
-----

     * Scanning NOW INTEGRATED (SECURITY UPDATE 2026-02-01):
          ** ✅ Uses org-scanner.js to verify AI suggestions
          ** ✅ Actually scans websites for TOU restrictions
          ** ✅ Detects tech blocks (403/401)
          ** ✅ Detects JS rendering requirements
          ** 🔒 Smart POC gathering via Google Search ONLY (never scrapes org sites)
          ** ✅ Saves contacts to contacts collection

-----

     * Key Code Changes (2026-01-31):
          ** Added: const scanner = require('./org-scanner')
          ** Added: await scanner.init() at startup
          ** Added: await scanner.scanOrganization() after saving each org
          ** Removed: AI-guessed TOU flags (now uses real scan results)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW STEP 1C: EVENT-BASED DISCOVERY 
     * Purpose
          ** Discover new organizations by analyzing EVENTS they host, rather than organizational profiles
          ** Identify organizations that host relevant national security events but might be missed in profile-based discovery because they host a broader portfolio of unrelated activities or their organizational description does not mention cybersecurity, defense, or intelligence—but their event titles and descriptions do.  
          ** Use AI embeddings to score candidate events against existing event profile
          ** Complement profile-based discovery (suggest-organizations.js) with event-based discovery
          ** It is NOT used to find events for organizations we already track (that's done by scraping)

     * Mechanism: discover-orgs-by-events.js
          ** Run Command: node scrapers/discover-orgs-by-events.js
          ** node scrapers/discover-orgs-by-events.js

     * Prerequisites:
          ** Event embeddings must exist (run scrapers/generate-embeddings.js first)
          ** Google Search API credentials must be configured in .env

     * How It Works (UPDATED 2026-01-31):
          ** Flow: Search Web → Filter Exclusions → Score Event → Extract Domain → org-scanner.js Scan → Nominate Org → Human Review
          ** NOW IMPORTS org-scanner.js for Phase B scanning (no more duplicate code)

          ** Phase A: Searches Google for events matching ideal profile - Web Search (No Page Fetching):
               *** Step 1: System builds "ideal event profile" from embeddings of all existing events
               *** Step 2: System generates search queries based on topics and regions (excludes training, political, webinar, academic topics)
               *** Step 3: System searches Google for candidate events (returns title, URL, snippet only)
               *** Step 4: For each search result:
                    **** Check against exclusion keywords (skip if matches)
                    **** Generate embedding from title + snippet (NOT from fetched page)
                    **** Calculate similarity score against ideal event profile
                    **** If score > 0.40, proceed to Phase B
               *** Step 5: Extract domain from high-scoring result URLs

          ** Phase B: Scanning (SECURITY UPDATE 2026-02-01 - Now uses org-scanner.js):  
               *** NOW IMPORTS from org-scanner.js (removed duplicate code)
               *** Uses scanner.gatherPOC() for smart POC gathering (Google Search only)
               *** Uses scanner.savePocContact() for contact saving
               *** What Info It Scans: Homepage, all legal pages (TOU, Privacy, etc.)
               *** Does It Flag?: YES - real TOU/tech block/JS rendering detection
               *** What Info Does It Bring Back: org name, description, POC info (via Google Search), triggering event
               *** 🔒 SECURITY: Contact info gathered via Google Search only (never fetches /contact, /about, /team pages)

               *** Step 6: Fetch homepage from extracted domain
                    **** On 403/401 error: Set tech_block_flag = TRUE, use Google Search for info
                    **** Find: All policy-relevant page URLs

               *** Step 7: Fetch and scan ALL policy-relevant pages
                    **** Scan each page for restriction keywords using context-aware detection
                    **** If restrictions found in ANY page: Set tou_flag = TRUE
                    **** Record specific phrases and which page they came from in tou_notes

               *** Step 8: Smart POC Gathering (SECURITY UPDATE 2026-02-01)
                    **** 🔒 ALWAYS uses Google Search snippets ONLY (never scrapes org websites)
                    **** Respects ALL Terms of Use regardless of detected flags
                    **** Automatically saves contacts to contacts collection

               *** Step 9: AI Analysis
                    **** Send homepage content to GPT-4o-mini
                    **** Extract: org_name (actual org, not event name), org_type, summary
                    **** AI looks for: "Presented by", "Hosted by", "A program of", copyright notices

               *** Step 10: Create nomination record
                    **** Status: Nominated (Pending Mission Review) - ALWAYS
                    **** name: AI-extracted org name (from Step 9)
                    **** ai_reasoning: AI-generated summary (from Step 9)
                    **** Set tou_flag, tech_block_flag based on REAL scan (not guessed)
                    **** Set discovery_method: event-based
                    **** Populate triggering_event_title, score, URL
                    **** Populate POC info (if found)

          ** Phase C - Human Review:
               *** Step 11: Human reviews in Admin Interface
               *** Step 12: Human reviews AI reasoning (org/event summary)
               *** Step 13: Human decides: Approve (pursue permission) or Reject (choose "Rejected by Mission" or "Rejected by Org")
               *** Step 14: If approving, set event_policy (accept_all or propose_events)



     * Ethical Approach - Snippets Only
          ** CRITICAL: The discovery script uses ONLY search result snippets from Google
          ** Search results include: title, URL, and snippet (text preview)
          ** The script does NOT fetch or scrape pages from organizations we haven't approved
          ** This ensures we respect TOU policies before ever accessing their sites
          ** Page fetching only occurs AFTER the discovery process identifies candidates:
               *** Homepage fetch: To find TOU page URL and gather basic org info
               *** TOU page fetch: To scan for scraping restrictions (ethical - reading rules to comply)
               *** 🔒 Contact page fetch: NEVER - all contacts gathered via Google Search only (security policy 2026-02-01)

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
               *** Step B3: POC Gathering (SECURITY UPDATE 2026-02-01)
                    **** 🔒 ALWAYS uses Google Search only (never fetches About/Contact pages)
                    **** Searches all 5 contact categories: Legal/Permissions, Events, Media/PR, Leadership, General
                    **** Respects ALL org Terms of Use regardless of detected flags
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

     * Related Scripts (all in scrapers/ folder)
          ** generate-embeddings.js: Creates event embeddings (provides input for ideal profile)
          ** suggest-organizations.js: Profile-based org discovery (complementary method)
          ** enrich-events.js: Tags events with topics (enriched events improve embedding quality)
          ** scan-and-scrape-all-live-orgs.js: Unified scanner/scraper for all orgs
          ** org-scanner.js: Core scanning module for policy docs, tech blocks, events URL, POC, and AI analysis (context-aware detection)




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
# ORGANIZATION WORKFLOW 4: SCRAPING
     * Prerequisites:
               *** Status: `Live (Scraping Active)`
               *** `events_url` is set (or custom scraper knows where to look)
     
-----

     * Universal AI-powered scraper handles all organizations (no custom scrapers needed)

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
               *** A scan must proceed a scrape on an org website
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
          ** VALIDATED 2026-01-27: Command confirmed working
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

-----

     * After Scraping: Image Generation
          ** APPROVED events need topic icons for display on event cards
          ** If approved event has new topic/region/country/org combination:
               *** create-topic-icon-records.js creates topic_icons record (only for approved events)
               *** generate-topic-icons.js generates the actual image via DALL-E 3
          ** Nominated/rejected events are skipped (saves DALL-E API costs)
          ** See ORGANIZATION WORKFLOW 6: IMAGE GENERATION for details


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 5: EVENT APPROVAL

     * Purpose: Review and approve/reject scraped events before public display

-----

     * How Event Approval Works Today
          ** event_policy on organization determines initial event_status:
               *** accept_all: Events auto-created with event_status = "approved"
               *** propose_events: Events created with event_status = "nominated"
          ** Nominated events require human review in Admin Interface
          ** Admin can change event_status: nominated → approved OR nominated → rejected
          ** Only events with event_status = "approved" appear in Public UI

-----

     * Current Implementation
          ** Admin Interface: Events tab shows all events
          ** Filter by status to see "nominated" events needing review
          ** Click event to view details
          ** Use Accept/Reject buttons to update event_status
          ** Rejected events stay in database but hidden from public

-----

     >>>>> FUTURE: NEED BULK EVENT APPROVAL WORKFLOW
     >>>>> FUTURE: NEED EVENT DELETION CAPABILITY (CURRENTLY EVENTS PERSIST)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 7: EVENT PUBLISHING AND CURATING  

     * Purpose: Manage how approved events appear on the public website

-----

     * How Event Publishing Works Today
          ** Events with event_status = "approved" automatically appear in Public UI
          ** Public UI refreshes data from PocketBase on each page load
          ** Events display with: title, description, date, location, organization, topic icon
          ** Users can filter by topic, search by keyword, and sort by date

-----

     * Current Curation Capabilities
          ** Change event_status: approved ↔ rejected (hides/shows from public)
          ** Edit event details in PocketBase Admin or Admin Interface
          ** Events persist in database even when "rejected" (audit trail)

-----

     >>>>> FUTURE: NEED BULK CURATION TOOLS (HIDE MULTIPLE EVENTS)
     >>>>> FUTURE: NEED EVENT EXPIRATION HANDLING (AUTO-HIDE PAST EVENTS?)
     >>>>> FUTURE: NEED EVENT DELETION WORKFLOW



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT 

     * Purpose: To validate and improve our contact information of Orgs of interest
         ** Organization Leadership
         ** Organization Event Managers
         ** Organization Permission Granters

-----

     * Contact Discovery Methods (SECURITY UPDATE 2026-02-01):
          ** ALL contact discovery now via org-scanner.js using GOOGLE SEARCH ONLY
               *** 🔒 SECURITY POLICY: We NEVER scrape org websites for contact info
               *** This respects ALL Terms of Use regardless of detected flags
               *** gatherPOC() searches 5 contact categories: Legal/Permissions, Events, Media/PR, Leadership, General
               *** Smart skip: On re-scans, skips if org already has Legal or Events contact
               *** forceAggressive: Option to search all categories regardless of existing contacts
          ** Contacts auto-saved during any scan operation

-----

     * Contact Schema (UPDATED 2026-01-31):
          ** Core Fields:
               *** name, email, phone, title, organization (relation)
               *** contact_type: Main Contact, Leadership, Events, Legal/Permissions, Media/PR, Other
          ** New Fields for Better Data Management:
               *** emails (JSON array): [{email: "x@y.com", type: "Legal", is_primary: true}]
               *** phones (JSON array): [{phone: "555-1234", type: "office", is_primary: true}]
               *** email_normalized: Lowercase email for deduplication
               *** data_completeness: complete, partial, email_only, name_only
               *** source: Where contact was discovered (homepage, website:/path, google_search)
               *** last_verified: Timestamp of last verification
               *** is_active: Boolean (default true)
               *** possible_duplicate_of, merged_into: For deduplication workflow

-----

     * Smart POC Gathering (SECURITY UPDATE 2026-02-01):
          ** 🔒 gatherPOC() in org-scanner.js ALWAYS uses Google Search
          ** SECURITY: We NEVER scrape org websites for contacts (/contact, /about, /team, etc.)
          ** First scan (org has 0 contacts):
               *** Searches all 5 categories: Legal/Permissions, Events, Media/PR, Leadership, General
               *** Uses up to 5 Google queries (one per category)
          ** Re-scan (org has Legal or Events contact):
               *** Skips contact gathering entirely (saves quota)
               *** Logs: "Skipping contact gathering - already have Legal/Events contact"
          ** forceAggressive mode:
               *** Bypasses skip logic
               *** Searches all 5 categories regardless of existing contacts
               *** Usage: via adhoc-scanner.js --force-contacts
          ** gatherPOCDirectFetch() is DEPRECATED (security risk - never use)

-----

     * Email Type Detection:
          ** Legal: legal@, permissions@, licensing@, counsel@, compliance@
          ** Events: events@, programs@, conference@, meetings@, registration@
          ** Media/PR: media@, press@, pr@, communications@, news@
          ** General: info@, contact@, general@, hello@, inquiries@
          ** Personal: firstname@, firstname.lastname@ patterns

-----

     * Domain-to-Org Matching (NEW 2026-01-31):
          ** fix-orphan-contacts.js links orphan contacts to orgs by email domain
          ** Matches email domain to org website (e.g., jsmith@brookings.edu → brookings.edu)
          ** Admin Interface auto-suggests org when typing email in Add Contact form
          ** Run: node scrapers/fix-orphan-contacts.js --dry-run (preview)
          ** Run: node scrapers/fix-orphan-contacts.js (apply changes)

-----

     * Batch Contact Discovery (DEPRECATED 2026-01-31):
          ** Script: scrapers/contact-discovery.js - DEPRECATED
          ** Functionality merged into org-scanner.js
          ** Use org-scanner.js gatherPOC() with forceAggressive option instead
          ** Original features now in org-scanner.js:
               *** Searches for 5 contact types per org (was 3)
               *** Smart skip logic for re-scans
               *** Google query tracking

-----

     * Priority Batching (DEPRECATED - was in contact-discovery.js):
          ** No longer applicable - contact gathering happens during regular scans
          ** Smart skip logic replaces batching: 
               *** First scan: searches all 5 categories
               *** Re-scan: skips if has Legal or Events contact

-----

     * API Quota Management (UPDATED 2026-01-31):
          ** Free tier: 100 queries/day
          ** First scan: Up to 5 queries (one per contact category)
          ** Re-scan: 0 queries (skips if has Legal or Events contact)
          ** Tracking: googleQueryCount variable, resetGoogleQueryCount(), getGoogleQueryCount()
          ** Quota-efficient: Smart skip logic conserves queries for new orgs

-----

     * Run Commands (UPDATED 2026-01-31):
          ** Single org scan (includes 5-category POC search): node scrapers/scan-and-scrape-all-live-orgs.js --org "Org Name" --scan-only
          ** Fix orphan contacts: node scrapers/fix-orphan-contacts.js
          ** Batch discovery: DEPRECATED - use regular scanning instead



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 9: ORGANIZATION INFORMATION VALIDATION AND ENHANCEMENT

     * Purpose: Continually update organization information and allow ad hoc scans

-----

     * Run Commands (UPDATED 2026-02-01)
          ** Single org scan: node scrapers/scan-and-scrape-all-live-orgs.js --org "Org Name" --scan-only
          ** All approved orgs: node scrapers/scan-and-scrape-all-live-orgs.js --approved --scan-only
          ** Uses org-scanner.js for full scanning capability
          ** NEW: Ad-hoc scanner CLI: node scrapers/adhoc-scanner.js --org "Org Name"

-----

     * Ad-Hoc Scanner (NEW 2026-02-01):
          ** Script: scrapers/adhoc-scanner.js
          ** Purpose: On-demand organization scanning from Admin Interface or command line
          ** Usage: node scrapers/adhoc-scanner.js --org "Org Name"
          ** Options:
               *** --org "Name": Organization name to scan (required)
               *** --force-contacts: Search all 5 contact categories even if org has contacts
          ** 🔒 Security: Contact gathering ALWAYS uses Google Search only (never scrapes org websites)
          ** Output: TOU scan results, tech block detection, JS rendering check, POC contacts found
          ** Creates scan_log entry with scanType: 'manual'

-----

     * Admin Interface [Scan Org] Button (NEW 2026-02-01):
          ** ✅ IMPLEMENTED: [🔍 Scan] button added to org cards in Org By Status and Organizations tabs
          ** Clicking opens modal with:
               *** Generated command: node scrapers/adhoc-scanner.js --org "Name"
               *** Option: Force Contact Gathering checkbox (adds --force-contacts flag)
               *** Copy to Clipboard button
               *** 🔒 Safety Guarantee displayed: "Contact gathering ALWAYS uses Google Search only"
          ** User copies command and runs in PowerShell

-----

     * Information Gathered During Scan
          ** Policy Documents: Finds and scans all TOU, TOS, Privacy Policy pages
          ** Restriction Detection: Identifies scraping-related restrictions with context
          ** Technical Access: Tests for 403/401 blocks
          ** JavaScript Rendering: Detects if site requires JS to load content
          ** Events URL: Discovers/verifies events page location
          ** POC Information: 🔒 Gathered via Google Search only (never fetches org contact pages)
          ** AI Analysis: Generates organization summary and classification

-----

     * Database Fields Updated
          ** tou_flag: TRUE if restrictions found
          ** tech_block_flag: TRUE if 403/401 errors
          ** tech_rendering_flag: TRUE if JS rendering required
          ** tou_notes: Specific restriction phrases found
          ** scrape_notes: Technical details (JS rendering info)
          ** tou_scanned_date: Timestamp of scan
          ** events_url: Discovered events page (if found)

-----

     * What Happens If Flags Are Found
          ** tou_flag = TRUE: Records restriction quotes in tou_notes, updates tou_scanned_date
          ** tech_block_flag = TRUE: Records in tou_notes
          ** tech_rendering_flag = TRUE: Records in scrape_notes
          ** Status NOT changed automatically (human reviews in Admin Interface)

-----

     * ✅ COMPLETED 2026-02-01: Add [Run Scan] button on Admin Interface for each Org
          ** [🔍 Scan] button added to org cards in list views
          ** Opens modal with command generator and copy-to-clipboard
          ** Uses adhoc-scanner.js for on-demand scanning




@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# EVENT POLICY - ORGANIZATION TRUST LEVELS

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
# SCANNING AND SCRAPING - PRINCIPLES 
     * Purpose
          ** Scanning and Scraping are related.
          ** Scanners 
               *** Gather basic information about organizations (POC info, etc.) to facilitate outreach
               *** Assess viability of scraping with "flags"


          ** We maintain an audit log of scans and scan/scrape results so we can see when something changes and have quality control.

-----

     * 🔒 SECURITY ARCHITECTURE AFFIRMATION (2026-02-01):
          ** ALL scanners and scrapers use org-scanner.js as the core module
          ** ALL contact gathering uses GOOGLE SEARCH ONLY
          ** We NEVER scrape org websites for contact info (/contact, /about, /team, etc.)
          ** This respects ALL org Terms of Use regardless of detected flags
          ** gatherPOCDirectFetch() is DEPRECATED and disabled

          ** Unified Flow for ALL Scripts:
               *** Step 1: SCAN - Fetch homepage and legal pages for TOU/tech flags
               *** Step 2: FLAG - Set tou_flag, tech_block_flag, tech_rendering_flag as detected
               *** Step 3: GOOGLE - Gather contacts via Google Search only (respects all TOU)

          ** Scripts Using This Model:
               *** ✅ scan-and-scrape-all-live-orgs.js (daily scraping, weekly re-scan)
               *** ✅ suggest-organizations.js (profile-based discovery)
               *** ✅ discover-orgs-by-events.js (event-based discovery)
               *** ✅ adhoc-scanner.js (on-demand scanning)

-----

     * 📅 AUTOMATED WORKFLOW SCHEDULE (2026-02-01):
          ** All workflows spaced to stay within Google Search quota (100/day free tier)
          ** Discovery scripts run on separate days with buffer for quota reset

          ** Daily - 11:30 PM EST:
               *** Workflow: scrape-events.yml
               *** Script: scan-and-scrape-all-live-orgs.js --all
               *** Purpose: Pre-scrape scan + event scraping for Live orgs
               *** Google Queries: ~0 (skip logic - existing orgs have contacts)

          ** Monday - 10:00 PM EST:
               *** Workflow: suggest-organizations.yml
               *** Script: suggest-organizations.js
               *** Purpose: AI suggests new orgs based on existing approved org profiles
               *** Google Queries: ~15-25 (5 per new org suggested)

          ** Wednesday - 10:00 PM EST:
               *** Workflow: discover-orgs-by-events.yml
               *** Script: discover-orgs-by-events.js
               *** Purpose: Find new orgs by searching for similar events online
               *** Google Queries: ~30-50 (event searches + 5 per new org found)

          ** Saturday - 10:00 PM EST:
               *** Workflow: org-scanner.yml
               *** Script: scan-and-scrape-all-live-orgs.js --approved --scan-only
               *** Purpose: Re-scan all orgs (except Rejected by Mission) for TOU changes
               *** Google Queries: ~0 (skip logic - existing orgs have contacts)

          ** Manual (as needed):
               *** Script: adhoc-scanner.js --org "Name"
               *** Purpose: On-demand org scanning via CLI or Admin Interface [🔍 Scan] button
               *** Google Queries: Up to 5 per org (one per contact category)

-----

     * Workflow Files Location:
          ** All GitHub Actions workflows in: .github/workflows/
               *** scrape-events.yml - Daily scraping
               *** suggest-organizations.yml - Monday profile-based discovery
               *** discover-orgs-by-events.yml - Wednesday event-based discovery
               *** org-scanner.yml - Saturday weekly re-scan
               *** contact-discovery.yml.disabled - DEPRECATED (functionality in org-scanner.js)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING - UNIFIED APPROACH PHILOSOPHY - DECISION LOGIC
 
     * UNIFIED SCANNING ACHIEVED (2026-01-31):
          ** All discovery and scanning methods now use org-scanner.js as the core module
          ** This ensures consistent behavior across all workflows
          ** Previous goal of integration is now COMPLETE

-----

     * Discovery Methods Using org-scanner.js:
          ** Manual Discovery (via Admin Interface)
               *** Adds org to database with status "Nominated (Pending Mission Review)"
               *** No auto-scan yet (future enhancement)
          ** Profile-Based Discovery (suggest-organizations.js)
               *** AI suggests orgs based on existing approved orgs
               *** After saving, org-scanner.js scans for real TOU/tech flags
               *** Removed AI-guessed TOU flags - now uses actual scan results
               *** Saves POC contacts if found
          ** Event-Based Discovery (discover-orgs-by-events.js)
               *** Finds orgs by searching for similar events online
               *** Uses org-scanner.js for Phase B scanning
               *** Removed duplicate POC functions - now imports from org-scanner.js
               *** Saves POC contacts if found
          ** Pre-Scrape Scanning (scan-and-scrape-all-live-orgs.js)
               *** Scans before scraping Live orgs
               *** Uses org-scanner.js for all scanning
               *** Saves POC contacts if found

-----

     * org-scanner.js Detects:
          ** TOU/Policy Flags (scans ALL legal pages for restriction language)
          ** Technical Block Flags (403/401 errors)
          ** Technical Rendering Flags (JavaScript-rendered content)
          ** POC Contact Info (🔒 via Google Search only - never fetches contact pages)
          ** Events URL (discovers events page location)

-----

     * 🔒 SECURITY POLICY - Contact Gathering (NEW 2026-02-01):
          ** Contact gathering ALWAYS uses Google Search only
          ** We NEVER scrape org websites for contacts (/contact, /about, /team, etc.)
          ** This respects ALL org Terms of Use regardless of detected flags
          ** Even if no restrictions are detected, we cannot guarantee we haven't missed something
          ** Google Search is always safe - it only returns publicly indexed information
          ** gatherPOCDirectFetch() function is DEPRECATED and disabled

-----

     * Smart POC Gathering (SECURITY UPDATE 2026-02-01):
          ** gatherPOC() function ALWAYS uses Google Search
          ** 🔒 NEVER fetches contact pages from org websites
          ** Searches 5 categories: Legal/Permissions, Events, Media/PR, Leadership, General
          ** All methods save contacts to contacts collection with new schema fields

-----

     * Contact Saving (NEW 2026-01-31):
          ** All discovery methods auto-save contacts to contacts collection
          ** savePocContact() function handles:
               *** Duplicate checking by email_normalized
               *** Email type detection (Legal, Events, Media/PR, General, Personal)
               *** Data completeness calculation
               *** Updates last_verified on existing contacts
          ** New schema fields supported:
               *** emails (JSON array with type)
               *** phones (JSON array)
               *** email_normalized (lowercase for dedup)
               *** data_completeness (complete/partial/email_only/name_only)
               *** source (homepage, website:/path, google_search)

-----

     * HISTORICAL DECISIONS (Reference):
          ** 2026-01-27: Decided to integrate org-scanner into all discovery processes
          ** 2026-01-31: Integration COMPLETE - all scripts now use org-scanner.js
          ** Previous "short term" workarounds are no longer needed


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING - ORG-SCANNER DETAILS 

     * org-scanner.js is the core scanning module

     * org-scanner.js Usage (SECURITY UPDATE 2026-02-01):
          ** 🔒 SECURITY POLICY: Contact gathering ALWAYS uses Google Search only
          ** gatherPOCDirectFetch() is DEPRECATED - never scrapes org websites for contacts
          ** All discovery methods now use org-scanner.js:
               *** Manual Discovery: Run node scrapers/scan-and-scrape-all-live-orgs.js --org "name" --scan-only
               *** Ad-hoc Scan: Run node scrapers/adhoc-scanner.js --org "name" (NEW 2026-02-01)
               *** Profile-Based Discovery: suggest-organizations.js calls scanner.scanOrganization() after AI suggests
               *** Event-Based Discovery: discover-orgs-by-events.js imports scanner.gatherPOC() for Phase B
               *** Pre-Scrape Scanning: scan-and-scrape-all-live-orgs.js uses org-scanner.js
          ** To run scan: node scrapers/scan-and-scrape-all-live-orgs.js --org "Org Name" --scan-only
          ** Automated Checks:
               *** Homepage fetch (checks for 403/401 errors)
               *** JavaScript rendering detection on homepage AND events page
               *** Event content detection (catches AJAX-loaded empty pages)
               *** Policy document discovery (finds all legal pages)
               *** Multi-page policy document scan (scans ALL legal pages)
               *** Context-aware restriction detection
               *** Events URL discovery
               *** 🔒 Smart POC gathering via Google Search only (respects ALL TOU policies)
               *** AI-powered org analysis
               *** Contact saving to contacts collection

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
          ** If restrictions are genuine: Status: Nominated (Pending Mission Review)
          ** If false positive: Clear flag, proceed with approval
          ** Status: Nominated (Pending Mission Review)

-----

     * What to Do If Tech Block Flag is Set
          ** VALIDATED 2026-01-27: Behavior confirmed
          ** Set tech_block_flag = true
          ** Set tou_flag = true (implied restriction)
          ** Organization technically cannot be scraped
          ** Status: Nominated (Pending Mission Review)

-----

     * What to Do If Tech Rendering Flag is Set 
          ** Set tech_rendering_flag = true
          ** Requires Puppeteer-based scraper to extract events
          ** Organization can be revisited when Puppeteer scrapers are implemented
          ** Status: Nominated (Pending Mission Review)

-----

     * What to Do If All Checks Pass
          ** Leave tou_flag = false
          ** Leave tech_block_flag = false
          ** Leave tech_rendering_flag = false
          ** Proceed to Mission Review
          ** Status: Nominated (Pending Mission Review)


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING - POLICY-RELEVANT DOCUMENTS
     * Scan ALL legal/policy documents for scraping restrictions
          ** Use context-aware detection to avoid false positives
          ** Automatically update organization status when restrictions are found on Live orgs
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

     * We look for the best terms/phrases/concepts to identify potential restrictions
               *** HIGH_CONFIDENCE_RESTRICTION_TERMS: Direct indicators that flag immediately
               *** CONTEXT_REQUIRED_TERMS: Words that need prohibition phrases nearby
               *** PROHIBITION_PHRASES: Language indicating something is forbidden
               *** Implementation: findRestrictions() function in org-scanner.js
               *** Status: ⚠️ NEEDS IMPROVEMENT - missing "reproduce", "distribute", "aggregate" detection

     * We interpret those potential restrictions and control for false positives and variants
               *** EXCLUDED_CONTEXTS: Patterns that indicate false positives (e.g., "our chatbot", "research on")
               *** Context window checking (150 characters)
               *** Word boundary matching to avoid partial matches
               *** Implementation: checkForExcludedContext(), checkForProhibitionPhrase() in org-scanner.js
               *** Status: ⚠️ NEEDS IMPROVEMENT - CSIS false positive shows content pages being scanned as TOU pages

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
# SCANNING - JAVASCRIPT RENDERING DETECTION


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
# SCANNING AND SCRAPING - LOGS
     * Purpose:  To ensure we understand the history of our engagement with Orgs and their websites, maintain an updated understanding of Org preferences, and can speak in detail with Orgs when asking permissions.

     * Mechanisms
               *** Implementation: scan_logs collection (22 fields) - createScanLog() in org-scanner.js

     * How It Works:


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# IMAGE GENERATION PROGRAM ARCHITECTURE
     * VALIDATED 2026-01-31: Updated to reflect approved-events-only filtering
When an event has been approved, we generate an image to accompany it on the website. Only APPROVED events trigger icon generation (saves DALL-E API costs).

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
               *** Scans APPROVED events only for unique topic/region/country/org combinations
               *** Skips nominated/rejected events (saves DALL-E costs)
               *** Creates topic_icons records for each unique combination
               *** Uses config.js to load .env from project root (consistent with other scripts)
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
               *** Only scans APPROVED events (nominated/rejected are skipped)
               *** Saves DALL-E API costs by not generating icons for unapproved events
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
# KEY FOLDERS AND FILES

     * CONSOLIDATED 2026-01-27: Merged from "FILES - ROOT LEVEL" and "KEY FOLDERS AND FILES" sections

-----

     * Folders (Root Level)
          ** .git/
               *** Git version control data
               *** Tracks all changes to your project
               *** Never edit manually
          ** .github/
               *** GitHub automation workflows
               *** .github/workflows/scrape-events.yml - Daily event scraping
               *** .github/workflows/contact-discovery.yml - Daily contact discovery (NEW 2026-01-27)
               *** .github/workflows/org-scanner.yml - Weekly org scanning (NEW 2026-01-27)
          ** BACKUP - ARCHIVE/
               *** Archive of previous UI versions
          ** Documentation/
               *** All project documentation, prompts, workflows, and reference materials
               *** Subfolders: Admin Interface - UI, Business and Market Analysis, ConOp, Legal and Policy Docs, Partner Engagement - Permissions
          ** Event-Finder-Backup-2025-12-13/
               *** Backup copy of project files
          ** icon-worker/
               *** Separate subfolder for image generation system
               *** Has its own node_modules and package.json
               *** Uses ROOT .env file (no separate .env needed)
               *** See "icon-worker Folder Contents" below
          ** node_modules/
               *** Installed JavaScript dependencies for root project
               *** Auto-generated by npm install. Never edit manually.
          ** scrapers/
               *** All scraping, scanning, discovery, and enrichment scripts
               *** See "scrapers Folder Contents" below

-----

     * Configuration Files (Root Level)
          ** .env
               *** Secret credentials - NEVER commit to GitHub
               *** Each computer needs its own copy
               *** Used by BOTH root scripts AND icon-worker scripts
               *** Contents:
                    **** POCKETBASE_URL
                    **** POCKETBASE_ADMIN_EMAIL
                    **** POCKETBASE_ADMIN_PASSWORD
                    **** OPENAI_API_KEY
                    **** OPENAI_IMAGE_MODEL=dall-e-3
                    **** GOOGLE_SEARCH_API_KEY
                    **** GOOGLE_SEARCH_ENGINE_ID
          ** .gitignore
               *** Tells Git which files to ignore (like .env and node_modules)
          ** package.json
               *** Lists project dependencies and metadata
               *** Used by npm install
          ** package-lock.json
               *** Locks exact versions of dependencies
               *** Auto-generated

-----

     * User Interface Files (Root Level)
          ** index.html
               *** The file Vercel serves to the public
               *** Copy of event-finder-ui-v7.html
               *** Deployed at https://event-finder-ui-one.vercel.app
          ** event-finder-ui-v7.html
               *** Development version of the public UI
               *** Copy to index.html when ready to deploy
          ** admin-interface-v22.html
               *** Admin dashboard for managing organizations, contacts, and events
               *** Internal use only (also accessible via Vercel at /admin-interface-v22.html)
               *** Features: 7 status values, 4 rejection flags, event review with Accept/Reject, 5 safety gates, duplicate detection, organization deletion with safety checks
          ** logo.png
               *** UI logo asset

-----

     * Cleanup Scripts (Root Level)
          ** cleanup-orphaned-events.js
               *** Removes events that no longer have a valid parent organization
          ** cleanup-bad-events.js
               *** Removes malformed or invalid event records from the database
          ** cleanup-duplicate-events.js
               *** Removes duplicate events based on title + organization + start_date
               *** Run with --dry-run to preview before deleting

-----

     * Topic Management Scripts (Root Level)
          ** update-event-topics.js
               *** Updates events collection to use new topic names
               *** Maps old names to new names (e.g., "Defense Policy" → "Defense Policy & Intelligence")
               *** Removes duplicates after mapping
          ** update-topic-icons.js
               *** Updates topic_icons collection to use new topic names
               *** Updates topic_combination field with new naming convention

-----

     * One-Time Migration Scripts (Root Level)
          ** fix-cfr-events.js
               *** One-time script to set CFR events to nominated status after adding event_status field
               *** Status: COMPLETED
          ** migrate-notes-v24.js
               *** One-time migration to consolidate tou_notes + scrape_notes → notes field
               *** Run with --dry-run first
               *** Status: COMPLETED (68 orgs migrated)

-----

     * Utility Scripts (Root Level)
          ** setup-icon-worker.ps1
               *** PowerShell script to create icon-worker folder structure
          ** proxy-server.js
               *** Local proxy server to handle CORS issues when testing scrapers locally
          ** list-ready-orgs.js
               *** Helper script to list orgs with status "Permission Granted (Not Live)"
               *** Run: node list-ready-orgs.js

-----

     * scrapers Folder Contents
          ** VALIDATED 2026-02-01
          ** Main Scripts:
               *** scan-and-scrape-all-live-orgs.js - Unified scan + scrape CLI (NEW 2026-01-18)
               *** org-scanner.js - Core scanning module for policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
               *** adhoc-scanner.js - On-demand org scanning CLI with contact discovery (NEW 2026-02-01)
               *** quality-audit.js - Quality audit script for duplicate detection and flag summary (NEW 2026-01-19)
               *** discover-orgs-by-events.js - Event-based organization discovery
               *** suggest-organizations.js - Profile-based organization discovery
               *** enrich-events.js - AI enrichment for event topics
               *** generate-embeddings.js - Creates AI embeddings for semantic search
          ** DEPRECATED FILES (2026-02-01):
               *** contact-discovery.js - Functionality merged into org-scanner.js
          ** DELETED FILES (2026-01-18):
               *** scrape-organization.js, scan-organization.js, scrape-all-organizations.js - Replaced by scan-and-scrape-all-live-orgs.js
               *** index.js, base-scraper.js - Functionality merged into unified script
               *** TOU_Scanning_Code.js - Reference file, never executed
               *** custom/ folder - Custom scrapers no longer needed

-----

     * icon-worker Folder Contents
          ** Root Files:
               *** node_modules/ - Separate dependencies for image generation
               *** src/ - Source code folder
               *** .env.example - Template showing required environment variables
               *** eng.traineddata - Tesseract OCR training data for English text detection
               *** Image_Generation_Safety_Abstraction_Policy_v2.7.md - Policy document
               *** package.json - Dependencies: sharp, tesseract.js, dotenv, node-fetch
               *** package-lock.json - Locked dependency versions
               *** README.md - Setup and usage instructions
          ** Source Files (icon-worker/src/):
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

          ** contact-discovery.js (DEPRECATED 2026-01-31)
               *** Status: ❌ DEPRECATED - Functionality merged into org-scanner.js
               *** Was: Google Search API contact discovery for permission outreach
               *** Now: Use org-scanner.js instead, which searches all 5 contact categories
               *** File: Deleted from repo (backup available if needed)
               *** Replacement: org-scanner.js gatherPOC() with forceAggressive option

          ** suggest-organizations.js
               *** UPDATED 2026-01-31: Now calls org-scanner.js after AI suggests orgs
               *** Profile-based discovery: AI suggests new organizations based on existing approved ones
               *** Uses AI training knowledge to find similar organizations
               *** ✅ FIXED: Now uses REAL scan results (not AI guesses) for TOU flags
               *** Sets discovery_method = "profile-based"
               *** 🔒 Contact gathering via Google Search only (security policy 2026-02-01)
               *** Run: node scrapers/suggest-organizations.js

          ** discover-orgs-by-events.js
               *** UPDATED 2026-01-31: Now imports org-scanner.js for Phase B scanning
               *** Event-based discovery: Discovers organizations by finding similar events online
               *** Uses embeddings to score candidate events against "ideal event profile"
               *** ✅ FIXED: Removed duplicate POC functions, now uses scanner.gatherPOC()
               *** 🔒 Contact gathering via Google Search only (security policy 2026-02-01)
               *** Runs AI analysis to extract org name and generate summary 
               *** Applies exclusion keyword filtering 
               *** Sets discovery_method = "event-based"
               *** Populates triggering_event_title, triggering_event_score, triggering_event_url
               *** Status: ✅ Unified with org-scanner.js
               *** Run: node scrapers/discover-orgs-by-events.js

          ** org-scanner.js 
               *** SECURITY UPDATE 2026-02-01: Contact gathering ALWAYS uses Google Search only
               *** gatherPOCDirectFetch() DEPRECATED - we NEVER scrape org websites for contacts
               *** Unified scanning module: policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
               *** Context-aware restriction detection to avoid false positives
               *** Auto-status update: sets "Rejected by Org" when restrictions found on Live orgs
               *** JavaScript/tech rendering detection 
               *** Searches 5 contact categories: Legal/Permissions, Events, Media/PR, Leadership, General
               *** Smart skip logic - skips re-scans if org already has Legal or Events contact
               *** forceAggressive option for ad-hoc deep contact gathering
               *** Google query tracking (resetGoogleQueryCount, getGoogleQueryCount)
               *** Used by scan-and-scrape-all-live-orgs.js, discover-orgs-by-events.js, suggest-organizations.js, adhoc-scanner.js
               *** Functions: scanOrganization(), gatherPOC(), gatherPOCViaGoogleSearch(), savePocContact(), analyzeWithAI()
               *** Key Constants: HIGH_CONFIDENCE_RESTRICTION_TERMS, CONTACT_CATEGORIES, EXCLUDED_CONTEXTS
               *** Run: node scrapers/org-scanner.js (via scan-and-scrape-all-live-orgs.js)

          ** adhoc-scanner.js (NEW 2026-02-01)
               *** Purpose: On-demand organization scanning with contact discovery
               *** 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only
               *** Usage: node scrapers/adhoc-scanner.js --org "Org Name"
               *** Options:
                    **** --org "Name": Organization name to scan (required)
                    **** --force-contacts: Search all 5 contact categories even if org has contacts
               *** Output: TOU scan results, tech detection, contact discovery, scan_log creation
               *** Integration: Used by Admin Interface [Scan Org] button
               *** Run: node scrapers/adhoc-scanner.js --org "CNAS"

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
          ** NOTE: File descriptions in KEY FOLDERS AND FILES section
          ** update-event-topics.js
               *** Updates events collection to use new topic names
               *** Maps old names to new names (e.g., "Defense Policy" → "Defense Policy & Intelligence")
               *** Removes duplicates after mapping
               *** Run: node update-event-topics.js
          ** update-topic-icons.js
               *** Updates topic_icons collection to use new topic names
               *** Updates topic_combination field with new naming convention
               *** Run: node update-topic-icons.js

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

     * Root-Level Scripts Quick Reference
          ** NOTE: File descriptions are in KEY FOLDERS AND FILES section
          ** Cleanup Scripts:
               *** Run: node cleanup-orphaned-events.js
               *** Run: node cleanup-bad-events.js
               *** Run: node cleanup-duplicate-events.js --dry-run (preview first)
          ** Utility Scripts:
               *** Run: node proxy-server.js (starts local CORS proxy)
               *** Run: node list-ready-orgs.js (lists orgs ready to go live)
               *** Run: ./setup-icon-worker.ps1 (PowerShell - creates icon-worker folder structure)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# GITHUB ACTIONS

     * UPDATED 2026-02-01: Added suggest-organizations.yml and discover-orgs-by-events.yml, updated org-scanner.yml schedule

-----

     * 🔒 ALL WORKFLOWS USE SCAN → FLAG → GOOGLE MODEL:
          ** Every automated workflow uses org-scanner.js
          ** Contact gathering ALWAYS uses Google Search only
          ** Workflows spaced to stay within 100/day Google quota

-----

     * Workflow: Scrape Events Daily
          ** File: .github/workflows/scrape-events.yml
          ** Status: ✅ Active
          ** Schedule: Daily at 11:30 PM EST (04:30 UTC)
          ** Script: scan-and-scrape-all-live-orgs.js --all
          ** Purpose: Pre-scrape scan + event scraping for Live orgs
          ** Google Queries: ~0 (skip logic - existing orgs have contacts)

-----

     * Workflow: Profile-Based Org Discovery (Weekly) - NEW 2026-02-01
          ** File: .github/workflows/suggest-organizations.yml
          ** Status: ✅ Active
          ** Schedule: Monday at 10:00 PM EST (03:00 UTC Tuesday)
          ** Script: suggest-organizations.js
          ** Purpose: AI suggests new orgs based on existing approved org profiles
          ** Google Queries: ~15-25 (5 per new org suggested)
          ** Uses org-scanner.js for real TOU/tech flag detection

-----

     * Workflow: Event-Based Org Discovery (Weekly) - NEW 2026-02-01
          ** File: .github/workflows/discover-orgs-by-events.yml
          ** Status: ✅ Active
          ** Schedule: Wednesday at 10:00 PM EST (03:00 UTC Thursday)
          ** Script: discover-orgs-by-events.js
          ** Purpose: Find new orgs by searching for similar events online
          ** Google Queries: ~30-50 (event searches + 5 per new org found)
          ** Uses org-scanner.js for Phase B scanning

-----

     * Workflow: Weekly Organization Scanner - UPDATED 2026-02-01
          ** File: .github/workflows/org-scanner.yml
          ** Status: ✅ Active
          ** Schedule: Saturday at 10:00 PM EST (03:00 UTC Sunday) - moved from Sunday
          ** Script: scan-and-scrape-all-live-orgs.js --approved --scan-only
          ** Purpose: Re-scan all orgs (except Rejected by Mission) for TOU changes
          ** Google Queries: ~0 (skip logic - existing orgs have contacts)
          ** Manual trigger: Supports --limit input for testing

-----

     * Workflow: Contact Discovery (Daily) - DISABLED 2026-01-31
          ** File: .github/workflows/contact-discovery.yml.disabled
          ** Status: ❌ DISABLED - Functionality merged into org-scanner.js
          ** Reason: Contact gathering now happens during regular org scans
          ** org-scanner.js searches all 5 contact categories automatically
          ** To re-enable: Rename file back to contact-discovery.yml

-----

     * Secrets Required (in GitHub repo settings → Secrets and variables → Actions)
          ** POCKETBASE_URL ✅
          ** POCKETBASE_ADMIN_EMAIL ✅
          ** POCKETBASE_ADMIN_PASSWORD ✅
          ** OPENAI_API_KEY ✅
          ** GOOGLE_SEARCH_API_KEY ✅
          ** GOOGLE_SEARCH_ENGINE_ID ✅

-----

     * Manual Trigger
          ** Go to GitHub repo → Actions tab
          ** Select workflow from left sidebar
          ** Click "Run workflow" button
          ** For suggest-organizations: Can specify limit
          ** For discover-orgs-by-events: Can specify max_queries and max_nominations
          ** For org-scanner: Can specify limit for testing
          ** Useful for: Testing, immediate updates

-----

     * Viewing Logs
          ** Go to GitHub repo → Actions tab
          ** Click on specific workflow run
          ** Expand job steps to see output
          ** Scan results also appear in PocketBase scan_logs collection



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
          ** VALIDATED 2026-01-27: Added contact-discovery scan_type

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
          ** Setting - Values: discovery, pre-scrape, manual, scheduled, contact-discovery
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Type of scan performed. Values:
               *** discovery - Initial scan during org discovery
               *** pre-scrape - Scan before scraping events
               *** manual - Manual ad-hoc scan via adhoc-scanner.js or Admin Interface (UPDATED 2026-02-01)
               *** scheduled - Scheduled weekly scan (org-scanner.yml)
               *** contact-discovery - Google Search contact discovery (DEPRECATED 2026-01-31)

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

          ** Field Name: tou_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if any TOU/policy restrictions detected. RENAMED 2026-02-01 from restrictions_found to align with organizations collection.

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
          ** Field Purpose/Notes: Context snippets (10 words before/after trigger). Format: "PageType | URL | Quote" per line. Updated 2026-01-26 from 20 words to 10 words to fit tou_notes field limit.

          ** Field Name: tech_block_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if 403/401 detected. RENAMED 2026-02-01 from tech_block to align with organizations collection.

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

          ** Field Name: tech_rendering_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if events page requires JavaScript. RENAMED 2026-02-01 from js_rendering to align with organizations collection.

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

          ** Field Name: legal_pages_results
          ** Field Type: JSON
          ** Setting - Max size (bytes): 50000
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: NEW 2026-01-26. Structured per-page scan results for admin UI display. Array of objects: [{url, type, result, quote?, keywords?}]. Result values: 'clear', 'restrictions', 'blocked', 'error'. For pages with restrictions, includes quote (10 words before/after trigger) and keywords array.

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
>>>>> SECTION VALIDATION NEEDED: Verify events collection fields match PocketBase schema
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
>>>>> SECTION VALIDATION NEEDED: Verify organizations collection fields match PocketBase schema
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
          ** Field Purpose/Notes: Structured restriction data with page name, URL, and quote together. Format: "PageType | URL | Quote" (one per line). Example: "Terms of Use | https://example.org/terms | ...you may not use **robots**, spiders, or automated means..." Used by email generator to include specific citations. Updated 2026-01-26.

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
          ** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events, 🔍 Scan (NEW 2026-02-01)
          ** Status-specific buttons: Approve Mission, Generate Request
          ** [🔍 Scan] Button (NEW 2026-02-01):
               *** Opens modal with command generator
               *** Shows: node scrapers/adhoc-scanner.js --org "Name"
               *** Option: Force Contact Gathering checkbox
               *** Copy to Clipboard button
               *** 🔒 Safety Guarantee: "Contact gathering ALWAYS uses Google Search only"
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
               *** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events, 🔍 Scan (NEW 2026-02-01)
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

          ** Sub-tab: Status & History (REDESIGNED 2026-01-25)
               *** Two-Column Layout (Status + Relevant Contacts):
                    **** Left Column - Status & Flags:
                         ***** Status dropdown (7 workflow statuses)
                         ***** Read-only flag display (derived from scanner, not editable):
                              ****** ⚠️ TOU Restriction (tou_flag)
                              ****** ⚙️ Tech-Rendered Site (tech_rendering_flag)
                              ****** ⛔ Technical Block (tech_block_flag)
                         ***** Flags highlighted with color when active (yellow/blue/red)
                         ***** Note: "Flags are set automatically by the scanner and cannot be edited here"
                    **** Right Column - Relevant Contacts:
                         ***** Filtered to priority types only: Legal/Permissions, Events, Main Contact
                         ***** Shows email as mailto link for quick access
                         ***** Shows contact name and title
                         ***** Note: "Showing Legal/Permissions, Events, and Main Contact types only"
               *** Duplicate Info Box (read-only):
                    **** Purple background, shown when duplicate_flag = true
                    **** Shows "Duplicate of: [Org Name]" with clickable link
               *** Correspondence Log Section:
                    **** Header with "Add Correspondence" button
                    **** Add Correspondence accordion with 3 type buttons:
                         ***** 📞 Phone Call - date, contact selector, call notes generator, notes field
                         ***** 📤 Email Outreach - date, contact selector, subject, draft generator, final text sent
                         ***** 📥 Email Response - date, contact selector, subject, response text
                    **** Recommended contacts shown in each panel (priority sorted)
                    **** Draft generators for talking points and emails
                    **** Timeline display with color-coded entries by type
               *** Scanning and Scraping History Section:
                    **** Alert cards at top showing current flag status:
                         ***** TOU Restriction (yellow) - with parsed details:
                              ****** Scan date
                              ****** Pages scanned with status (✅ Clear / ⚠️ Restrictions)
                              ****** What's prohibited (human-readable list)
                              ****** Key quote from TOU
                              ****** Source link
                         ***** JS Rendering Required (blue)
                         ***** Technical Block (red)
                    **** Scan history log entries from scan_logs collection (redesigned 2026-01-26):
                         ***** Each entry shows date and scan type in header
                         ***** Three flag sections with checkboxes: TOU Restriction, Technical Block, Tech-Rendered Site
                         ***** For TOU restrictions: Quote box with actual restriction text, page type, and clickable URL
                         ***** Pages scanned list with color-coded results (green=clear, yellow=restrictions, red=blocked)
                         ***** JS Rendering alert box when applicable
               *** Notes Section:
                    **** Single Notes field (consolidated from legacy tou_notes + scrape_notes)
                    **** Save Notes button

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
# SESSION HANDOFFS - SCANNING AND SCRAPING

     * QUICK START PROMPT:
          ** "I'm working on Event Finder scanning/scraping. Please read ConOp sections: SCANNING - UNIFIED APPROACH PHILOSOPHY, SCANNING - ORG-SCANNER DETAILS, and ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT. SECURITY: Contact gathering ALWAYS uses Google Search only. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/scan-and-scrape-all-live-orgs.js
          ** ✅ scrapers/org-scanner.js
          ** ✅ scrapers/adhoc-scanner.js (NEW 2026-02-01)
          ** ✅ admin-interface-v22.html
          ** ⚪ PocketBase schema doc (if schema questions arise)

-----

     * ConOp Sections to Emphasize:
          ** SCANNING - UNIFIED APPROACH PHILOSOPHY - DECISION LOGIC
          ** SCANNING - ORG-SCANNER DETAILS
          ** ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT
          ** ORGANIZATION WORKFLOW 9: ORGANIZATION INFORMATION VALIDATION AND ENHANCEMENT
          ** SCANNING - POLICY-RELEVANT DOCUMENTS
          ** SCANNING - JAVASCRIPT RENDERING DETECTION
          ** SCANNING AND SCRAPING - LOGS

-----

     * Key Scripts:
          ** scan-and-scrape-all-live-orgs.js - Unified scan + scrape CLI
               *** Run all: node scrapers/scan-and-scrape-all-live-orgs.js --all
               *** Run single: node scrapers/scan-and-scrape-all-live-orgs.js --org "INSA"
               *** Scan only: node scrapers/scan-and-scrape-all-live-orgs.js --org "Name" --scan-only
          ** adhoc-scanner.js - On-demand scanning CLI (NEW 2026-02-01)
               *** Run: node scrapers/adhoc-scanner.js --org "Name"
               *** With forced contacts: node scrapers/adhoc-scanner.js --org "Name" --force-contacts
          ** org-scanner.js - Core scanning module (used by all discovery scripts)
          ** discover-orgs-by-events.js - Now imports from org-scanner.js
          ** suggest-organizations.js - Now uses org-scanner.js after AI suggests

-----

     * 🔒 SECURITY POLICY (NEW 2026-02-01):
          ** Contact gathering ALWAYS uses Google Search only
          ** We NEVER scrape org websites for contacts (/contact, /about, /team, etc.)
          ** gatherPOCDirectFetch() is DEPRECATED and disabled
          ** This respects ALL org Terms of Use regardless of detected flags

-----

     * Last Session: 2026-02-01

-----

     * Current Status: ✅ UNIFIED SCANNING COMPLETE + SECURITY HARDENED
          ** Scanner: ✅ org-scanner.js is core module for ALL discovery
          ** Smart POC: ✅ ALWAYS uses Google Search only (security hardened 2026-02-01)
          ** Contact Saving: ✅ All scanners auto-save contacts to contacts collection
          ** Ad-hoc Scanning: ✅ adhoc-scanner.js CLI added (NEW 2026-02-01)
          ** Admin Interface: ✅ [🔍 Scan] button on org cards (NEW 2026-02-01)
          ** Scripts Integrated:
               *** ✅ scan-and-scrape-all-live-orgs.js
               *** ✅ discover-orgs-by-events.js (imports org-scanner.js)
               *** ✅ suggest-organizations.js (calls scanner after AI suggests)
               *** ✅ adhoc-scanner.js (NEW 2026-02-01)

-----

     * Key Functions in org-scanner.js (SECURITY UPDATE 2026-02-01):
          ** gatherPOC(html, baseUrl, options) - Smart POC gathering, ALWAYS uses Google Search
          ** gatherPOCViaGoogleSearch(orgName, domain) - Google snippets for ALL orgs
          ** gatherPOCDirectFetch() - ⛔ DEPRECATED - never use (security risk)
          ** savePocContact(orgId, pocInfo, scanSource) - Saves to contacts collection
          ** Exports also include: extractDomainFromEmail, matchDomainToOrg

-----

     * Verified Working (CNAS test case 2026-02-01):
          ** Contact found via Google Search: 1 contact
          ** Google queries used: 4 (quota tracking working)
          ** 🔒 No org website scraping occurred

-----

     * Remaining Work:
          ** 1. 🧪 Test adhoc-scanner.js after Google quota resets
          ** 2. 📊 Add contact deduplication workflow in Admin Interface
          ** 3. 📝 Test full discovery workflow end-to-end


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - HOW TO USE THIS SECTION

     * Purpose: Get new Claude sessions up to speed FAST with context-rich handoff notes
     * Instructions: 
          ** 1. Find the handoff section matching your work area
          ** 2. Upload the listed files to the new chat
          ** 3. Copy/paste the "QUICK START PROMPT" to begin
          ** 4. After session, update the relevant handoff section with new progress

     * Handoff Sections Available:
          ** SCANNING AND SCRAPING - For scanner bugs, scrape issues, safety gates
          ** PERMISSION REQUESTS - For outreach workflow, email drafts, correspondence
          ** ORG WORKFLOW / PERMISSIONS - For status changes, mission review, permission tracking
          ** CONTACT DISCOVERY AND ENHANCEMENT - For POC gathering, contact-discovery.js, name/email extraction
          ** IMAGE GENERATION - For DALL-E topic icons, validators, policy engine
          ** ORG DISCOVERY - For discover-orgs-by-events.js, suggest-organizations.js
          ** ADMIN INTERFACE - For UI bugs, new features, display issues
          ** PUBLIC UI - For event-finder-ui, Vercel deployment, user-facing changes
          ** POCKETBASE SCHEMA - For collection changes, field additions, schema fixes
          ** ARCHITECTURE IMPROVEMENTS - For code consolidation, duplicate removal



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - PERMISSION REQUESTS

     * QUICK START PROMPT:
          ** "I'm working on the Event Finder permission request workflow. Please read the ConOp sections: ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT and ADMIN INTERFACE. The Admin Interface v22 has email draft generation. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ admin-interface-v22.html
          ** ⚪ PocketBase schema doc (if schema questions arise)

-----

     * ConOp Sections to Emphasize:
          ** ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT
          ** ADMIN INTERFACE (Status & History tab, Correspondence Log)
          ** WORKFLOW - STATUS REFERENCES
          ** EVENT POLICY - ORGANIZATION TRUST LEVELS

-----

     * Last Session: 2026-01-24
          ** ✅ Built TOU-aware email draft generation in Admin Interface:
               *** Orgs WITH restrictions: "Permission Request" format
                    **** Subject: "Permission Request: Event Listing from [Org Name]"
                    **** Multi-bullet format for restriction sources with page type detection
                    **** NO deadline mentioned
               *** Orgs WITHOUT restrictions: "Notice" format
                    **** Subject: "Notice: Automated Event Collection from [Org Name]"
                    **** Includes 7-day proceed date
                    **** "No response needed if you are fine with this"
          ** ✅ Added Contact Selector dropdown (priority sorted by contact_type)
          ** ✅ Added Correspondence Log for tracking all communications
          ** ✅ Added Go-Live date conditional display (no auto go-live for restricted orgs)
          ** ✅ Added Live Safety Warning when setting restricted orgs to Live
          ** ✅ Added correspondence_log field to PocketBase (Plain Text, max 50000 chars)

-----

     * Current Status: ✅ FUNCTIONAL
          ** Email drafts auto-generated with org-specific restriction context
          ** Correspondence tracking available via correspondence_log
          ** Two-way filter (status vs restrictions) for easy org navigation

-----

     * Blocked/Broken: None known

-----

     * Next Steps:
          ** 1. 📧 Generate and send permission requests to 14 orgs with tou_flag
          ** 2. 📝 Log sent emails in correspondence_log
          ** 3. 📊 Track responses and update org status accordingly
          ** 4. 🔧 Consider email sending integration (Resend/SendGrid)
          ** 5. 📄 Update SOP document for new email templates
          ** 6. ⚡ Add [Quick Scan] button to generate ad-hoc scan of a site



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - ORG WORKFLOW / PERMISSIONS

     * QUICK START PROMPT:
          ** "I'm working on Event Finder organization workflow. Please read ConOp sections: WORKFLOWS 1-4, STATUS REFERENCES, EVENT POLICY. I need help with [status changes / mission review / permission tracking / etc.]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ admin-interface-v22.html
          ** ⚪ scrapers/org-scanner.js (if scanning-related)

-----

     * ConOp Sections to Emphasize:
          ** ORGANIZATION WORKFLOW STEP 1A: MANUAL DISCOVERY
          ** ORGANIZATION WORKFLOW STEP 1B: PROFILE-BASED DISCOVERY
          ** ORGANIZATION WORKFLOW STEP 1C: EVENT-BASED DISCOVERY
          ** ORGANIZATION WORKFLOW 2: MISSION REVIEW
          ** ORGANIZATION WORKFLOW 3: PERMISSION MANAGEMENT
          ** ORGANIZATION WORKFLOW 4: SCRAPING
          ** WORKFLOW - STATUS REFERENCES
          ** EVENT POLICY - ORGANIZATION TRUST LEVELS

-----

     * Last Session: 2026-01-24
          ** ✅ Full permission request workflow in Admin Interface v22
          ** ✅ Contact selector dropdown (priority sorted)
          ** ✅ TOU-aware email draft generation (two formats)
          ** ✅ Correspondence log for tracking communications
          ** ✅ Go-Live date conditional display
          ** ✅ Live Safety Warning for restricted orgs
          ** Previous (2026-01-17): permission wait time 2wk→1wk, permission_type values updated

-----

     * Current Status: ✅ FUNCTIONAL

-----

     * Blocked/Broken: None known

-----

     * Next Steps:
          ** 1. 📧 Send permission requests to restricted orgs
          ** 2. 🔔 Add alert feature for go-live date notifications
          ** 3. 🔄 Implement auto-status updates based on response tracking



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - CONTACT DISCOVERY AND ENHANCEMENT

     * QUICK START PROMPT:
          ** "I'm working on Event Finder contact discovery. Please read ConOp sections: ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT and SCANNING - ORG-SCANNER DETAILS. 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only - we NEVER scrape org websites. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/org-scanner.js (has ALL contact gathering logic)
          ** ✅ scrapers/adhoc-scanner.js (NEW 2026-02-01 - on-demand scanning)
          ** ✅ scrapers/fix-orphan-contacts.js (domain matching)
          ** ⚪ admin-interface-v22.html (for Contacts tab reference)
          ** ❌ scrapers/contact-discovery.js (DEPRECATED - do not upload)

-----

     * ConOp Sections to Emphasize:
          ** ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT
          ** SCANNING - ORG-SCANNER DETAILS
          ** POCKETBASE COLLECTIONS - contacts Collection

-----

     * 🔒 SECURITY POLICY (NEW 2026-02-01):
          ** Contact gathering ALWAYS uses Google Search only
          ** We NEVER scrape org websites for contacts (/contact, /about, /team, etc.)
          ** gatherPOCDirectFetch() is DEPRECATED and disabled
          ** This respects ALL org Terms of Use regardless of detected flags
          ** Even if no restrictions detected, we cannot guarantee we haven't missed something

-----

     * MAJOR UPDATE (2026-02-01): Security-Hardened Contact Gathering
          ** gatherPOCDirectFetch() DEPRECATED - we NEVER scrape org websites for contacts
          ** gatherPOC() now ALWAYS uses Google Search only
          ** adhoc-scanner.js added for on-demand scanning with contact discovery
          ** Admin Interface [🔍 Scan] button uses adhoc-scanner.js

-----

     * Contact Gathering Architecture (SECURITY UPDATE 2026-02-01):

          ** ALL via org-scanner.js using GOOGLE SEARCH ONLY:
               *** gatherPOC(html, baseUrl, options) - Main function, ALWAYS uses Google Search
               *** gatherPOCViaGoogleSearch(orgName, domain, options) - Searches all 5 categories
               *** gatherPOCDirectFetch() - ⛔ DEPRECATED (security risk - never use)
               *** savePocContact(orgId, pocInfo, scanSource) - Saves to contacts collection
               *** getExistingContactTypes(orgId) - Check what contacts org already has
               *** CONTACT_CATEGORIES constant - 5 category definitions

          ** Skip Logic (for re-scans):
               *** If org has Legal/Permissions contact → Skip gathering
               *** If org has Events contact → Skip gathering
               *** Use forceAggressive: true to override skip

          ** forceAggressive Mode (for ad-hoc scans):
               *** Bypasses skip logic
               *** Searches all 5 categories regardless of existing contacts
               *** Usage: node scrapers/adhoc-scanner.js --org "Name" --force-contacts

          ** Orphan Contact Linking via fix-orphan-contacts.js:
               *** Links contacts without org to matching org by email domain
               *** Run: node scrapers/fix-orphan-contacts.js --dry-run

-----

     * New Contact Schema Fields (2026-01-31):
          ** emails (JSON array): [{email: "x@y.com", type: "Legal", is_primary: true}]
          ** phones (JSON array): [{phone: "555-1234", type: "office", is_primary: true}]
          ** email_normalized: Lowercase email for deduplication
          ** data_completeness: complete, partial, email_only, name_only
          ** source: Where discovered (google_search - always now)
          ** is_active: Boolean (default true)
          ** possible_duplicate_of, merged_into: For deduplication workflow

-----

     * Google Search Quota Management:
          ** 100 free queries/day limit
          ** First scan: Up to 5 queries (one per category)
          ** Re-scan: 0 queries (skips if has Legal or Events contact)
          ** Tracking: googleQueryCount, resetGoogleQueryCount(), getGoogleQueryCount()

-----

     * Run Commands (UPDATED 2026-02-01):
          ** Org scan (includes contacts): node scrapers/scan-and-scrape-all-live-orgs.js --org "Name" --scan-only
          ** Ad-hoc scan: node scrapers/adhoc-scanner.js --org "Name"
          ** Ad-hoc with forced contacts: node scrapers/adhoc-scanner.js --org "Name" --force-contacts
          ** Fix orphan contacts: node scrapers/fix-orphan-contacts.js

-----

     * Last Session: 2026-02-01

-----

     * Current Status: ✅ SECURITY HARDENED AND WORKING
          ** 🔒 Contact gathering ALWAYS uses Google Search only
          ** gatherPOCDirectFetch() DEPRECATED - never scrapes org websites
          ** 5 contact categories searched on first scan
          ** Smart skip on re-scans to conserve quota
          ** adhoc-scanner.js provides on-demand scanning
          ** Admin Interface [🔍 Scan] button for easy access

-----

     * Remaining Work:
          ** 1. 📊 Add contact deduplication workflow in Admin Interface
          ** 2. 🧪 Test after Google quota resets



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - ORG DISCOVERY

     * QUICK START PROMPT:
          ** "I'm working on Event Finder organization discovery. Please read ConOp sections: ORGANIZATION WORKFLOW STEP 1B/1C and SCANNING - UNIFIED APPROACH PHILOSOPHY. 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/discover-orgs-by-events.js (imports org-scanner.js)
          ** ✅ scrapers/suggest-organizations.js (calls org-scanner.js after AI)
          ** ✅ scrapers/org-scanner.js (core scanning module - GOOGLE SEARCH ONLY for contacts)
          ** ✅ scrapers/adhoc-scanner.js (NEW 2026-02-01 - on-demand scanning)
          ** ⚪ scrapers/generate-embeddings.js (for embedding questions)

-----

     * ConOp Sections to Emphasize:
          ** SCANNING - UNIFIED APPROACH PHILOSOPHY - DECISION LOGIC
          ** ORGANIZATION WORKFLOW STEP 1B: PROFILE-BASED DISCOVERY
          ** ORGANIZATION WORKFLOW STEP 1C: EVENT-BASED DISCOVERY
          ** ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT

-----

     * 🔒 SECURITY POLICY (NEW 2026-02-01):
          ** Contact gathering ALWAYS uses Google Search only
          ** We NEVER scrape org websites for contacts (/contact, /about, /team, etc.)
          ** gatherPOCDirectFetch() is DEPRECATED and disabled
          ** This applies to ALL discovery methods

-----

     * Last Session: 2026-02-01

-----

     * Current Status: ✅ UNIFIED, SECURE, AND FUNCTIONAL
          ** ✅ discover-orgs-by-events.js - imports org-scanner.js for Phase B
          ** ✅ suggest-organizations.js - scans after AI suggests (real flags, not guessed)
          ** ✅ All contact saving uses unified savePocContact()
          ** 🔒 Smart POC ALWAYS uses Google Search only (security hardened 2026-02-01)
          ** ✅ adhoc-scanner.js for on-demand scanning (NEW 2026-02-01)
          ** ✅ Admin Interface [🔍 Scan] button (NEW 2026-02-01)

-----

     * Architecture Debt RESOLVED (2026-02-01):
          ** ✅ FIXED: discover-orgs-by-events.js duplicate code removed
          ** ✅ FIXED: suggest-organizations.js now does real scans
          ** ✅ FIXED: All scripts use consistent POC gathering logic
          ** ✅ FIXED: contact-discovery.js consolidated into org-scanner.js
          ** 🔒 SECURITY: gatherPOCDirectFetch() deprecated (never scrapes org sites)

-----

     * Key Code Changes Made (2026-02-01):
          ** org-scanner.js:
               *** SECURITY: gatherPOC() now ALWAYS uses Google Search
               *** SECURITY: gatherPOCDirectFetch() DEPRECATED (security risk)
               *** Contact gathering respects ALL TOU policies regardless of flags
          ** adhoc-scanner.js (NEW):
               *** On-demand scanning CLI
               *** Usage: node scrapers/adhoc-scanner.js --org "Name"
               *** Option: --force-contacts to search all 5 categories
          ** Admin Interface:
               *** [🔍 Scan] button added to org cards
               *** Opens modal with command generator
               *** Shows security guarantee

-----

     * Next Steps:
          ** 1. 🧪 Test adhoc-scanner.js after Google quota resets
          ** 2. 📊 Add contact deduplication workflow in Admin Interface
          ** 3. ✅ DONE 2026-01-31: Fixed image generation (only approved events)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - ADMIN INTERFACE

     * QUICK START PROMPT:
          ** "I'm working on the Event Finder Admin Interface. Please read ConOp section: ADMIN INTERFACE. The file is admin-interface-v22.html. [Describe your specific task - UI bug, new feature, display issue]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ admin-interface-v22.html

-----

     * ConOp Sections to Emphasize:
          ** ADMIN INTERFACE (full section with all tabs documented)
          ** WORKFLOW - STATUS REFERENCES (for status dropdown values)
          ** POCKETBASE COLLECTIONS AND VALUES (for field names)
          ** ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT (for contact features)

-----

     * Admin Interface Structure:
          ** 6 Main Tabs: Dashboard, Org By Status, Organizations, Contacts, Events, Icons
          ** Organization Profile Page with 4 sub-tabs: Profile, Contacts, Status & History, Events
          ** Key Features:
               *** Two-way filter (status vs restrictions)
               *** TOU-aware email draft generation
               *** Correspondence log with timeline
               *** Scan history display with parsed restriction details
               *** Live Safety Warning for restricted orgs
               *** [🔍 Scan] button on org cards (NEW 2026-02-01)

-----

     * NEW FEATURES (2026-02-01):
          ** [🔍 Scan] Button on Org Cards:
               *** Added to Org By Status and Organizations tabs
               *** Opens modal with:
                    **** Generated command: node scrapers/adhoc-scanner.js --org "Name"
                    **** Force Contact Gathering checkbox
                    **** Copy to Clipboard button
                    **** 🔒 Safety Guarantee: "Contact gathering ALWAYS uses Google Search only"
               *** User copies command and runs in PowerShell

-----

     * PREVIOUS CONTACT FEATURES (2026-01-31):
          ** Organizations Tab:
               *** Contact count badges on org cards (👤 N contacts)
               *** Filter: "With contacts" / "Without contacts" dropdown
               *** Dashboard stats: Total contacts, orgs without contacts
          ** Contacts Tab:
               *** Filter by organization dropdown
               *** Data completeness badges (complete, partial, email_only, name_only)
          ** Add Contact Modal:
               *** Auto-suggest organization when typing email
               *** Matches email domain to org website
               *** Shows "✨ Auto-matched to: [Org Name] [Select]"

-----

     * Last Session: 2026-02-01
          ** Added [🔍 Scan] button to org cards in list views
          ** Button opens modal with adhoc-scanner.js command generator
          ** Added force contacts checkbox option
          ** Added security guarantee display

-----

     * Current Status: ✅ FUNCTIONAL (v22)

-----

     * Blocked/Broken: None known

-----

     * Next Steps:
          ** Add [Run Scraper] button for manual scrape triggers
          ** Improve bulk event approval workflow
          ** Add contact deduplication workflow



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - PUBLIC UI

     * QUICK START PROMPT:
          ** "I'm working on the Event Finder public-facing UI. Please read ConOp sections: PUBLIC UI FEATURES and VERCEL DEPLOYMENT. The file is index.html (copy of event-finder-ui-v7.html). [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ index.html
          ** ✅ event-finder-ui-v7.html (development version)

-----

     * ConOp Sections to Emphasize:
          ** PUBLIC UI FEATURES (full section)
          ** VERCEL DEPLOYMENT

-----

     * Live URLs:
          ** Public UI: https://event-finder-ui-one.vercel.app
          ** Admin: https://event-finder-ui-one.vercel.app/admin-interface-v22.html

-----

     * Deployment Process:
          ** 1. Edit index.html (or copy event-finder-ui-v7.html to index.html)
          ** 2. git add -A && git commit -m "Update UI" && git push
          ** 3. Vercel auto-deploys in ~10 seconds

-----

     * Last Session: Not recently worked on

-----

     * Current Status: ✅ LIVE on Vercel

-----

     * Blocked/Broken: None known

-----

     * Next Steps:
          ** 1. ✅ Verify events only show when event_status = "approved" (should already be working)
          ** 2. 🌐 Migrate to BalanceFWD.com domain



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - POCKETBASE SCHEMA

     * QUICK START PROMPT:
          ** "I'm working on Event Finder PocketBase schema. Please read ConOp section: POCKETBASE COLLECTIONS AND VALUES. I need to [add a field / modify collection / fix schema issue]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ⚪ PocketBase Admin UI access (login via browser)

-----

     * ConOp Sections to Emphasize:
          ** POCKETBASE COLLECTIONS AND VALUES (full section with all collections)

-----

     * Collections:
          ** organizations - Main org records with status, flags, permissions
          ** contacts - POC contacts linked to organizations
          ** events - Scraped event records
          ** scan_logs - Audit trail of all scan operations
          ** topic_icons - Generated images for event display
          ** event_embeddings - AI embeddings for semantic search
          ** settings - App configuration

-----

     * Last Session: 2026-02-01

-----

     * Current Status: ✅ FUNCTIONAL - Field naming aligned

-----

     * Blocked/Broken: None

-----

     * ✅ RESOLVED 2026-02-01: Field naming alignment
          ** scan_logs fields renamed to match organizations collection:
               *** restrictions_found → tou_flag
               *** tech_block → tech_block_flag
               *** js_rendering → tech_rendering_flag

-----

     * Next Steps:
          ** None - schema is consistent



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - ARCHITECTURE IMPROVEMENTS

     * QUICK START PROMPT:
          ** "I'm working on Event Finder architecture improvements. Please read ConOp sections: SCANNING - ORG-SCANNER DETAILS and SCRIPTS. 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/org-scanner.js (core scanning module)
          ** ✅ scrapers/adhoc-scanner.js (on-demand scanning - NEW 2026-02-01)
          ** ✅ scrapers/discover-orgs-by-events.js
          ** ✅ scrapers/suggest-organizations.js

-----

     * ConOp Sections to Emphasize:
          ** SCANNING - UNIFIED APPROACH PHILOSOPHY - DECISION LOGIC
          ** SCANNING - ORG-SCANNER DETAILS
          ** SCRIPTS (full section)
          ** KEY FOLDERS AND FILES

-----

     * ✅ ARCHITECTURE ISSUES RESOLVED (2026-02-01):

          ** Issue 1: discover-orgs-by-events.js duplicate code - ✅ RESOLVED
               *** Now imports org-scanner.js for all scanning
               *** Removed duplicate extractPocFromHtml(), searchForPocInfo(), savePocContact()

          ** Issue 2: suggest-organizations.js GUESSED at TOU flags - ✅ RESOLVED
               *** Now calls org-scanner.js after AI suggests orgs
               *** Uses real scan results, not AI guesses

          ** Issue 3: POC gathering locations duplicated - ✅ RESOLVED
               *** All POC gathering consolidated into org-scanner.js
               *** 🔒 SECURITY: gatherPOCDirectFetch() DEPRECATED (never scrapes org sites)
               *** All contact gathering uses Google Search only

          ** Issue 4: No ad-hoc scanner CLI - ✅ RESOLVED
               *** adhoc-scanner.js created (NEW 2026-02-01)
               *** Admin Interface [🔍 Scan] button added

          ** Issue 5: The Hoover Institution org missing website
               *** FIX: Manually add website URL

-----

     * 🔒 SECURITY POLICY (NEW 2026-02-01):
          ** Contact gathering ALWAYS uses Google Search only
          ** We NEVER scrape org websites for contacts
          ** gatherPOCDirectFetch() is DEPRECATED and disabled
          ** This addresses the ethical concern about scraping org sites without permission

-----

     * Contact Discovery Status (as of 2026-02-01):
          ** ✅ Unified in org-scanner.js
          ** ✅ 5 contact categories searched via Google Search
          ** ✅ Smart skip on re-scans
          ** ✅ adhoc-scanner.js for on-demand scanning
          ** ✅ Admin Interface [🔍 Scan] button



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - FUTURE REQUIREMENTS TRACKER

     * This section tracks all ">>>>>>" FUTURE REQUIREMENT markers in the ConOp

-----

     * MANUAL DISCOVERY (Workflow 1A):
          ** >>>>> IMPLEMENT ORG-SCANNER to perform scanning when there is a Manual Discovery
          ** >>>>> ADD [Scan and Nominate] button in Admin Interface
          ** >>>>> USE ORG-SCANNER AND RECURSIVE SEARCHING at this stage

-----

     * PROFILE-BASED DISCOVERY (Workflow 1B):
          ** ✅ DONE 2026-01-31: Integrate org-scanner.js to verify AI suggestions
          ** >>>>> Consider deprecating in favor of EVENT-BASED DISCOVERY

-----

     * ORGANIZATION VALIDATION (Workflow 9):
          ** ✅ DONE 2026-02-01: Add [Run Scan] button on Admin Interface for each Org
               *** [🔍 Scan] button added to org cards in list views
               *** Uses adhoc-scanner.js for on-demand scanning

-----

     * EVENT APPROVAL (Workflow 5):
          ** >>>>> NEED BULK EVENT APPROVAL WORKFLOW
          ** >>>>> NEED EVENT DELETION CAPABILITY (currently events persist)

-----

     * EVENT PUBLISHING (Workflow 7):
          ** >>>>> NEED BULK CURATION TOOLS (hide multiple events)
          ** >>>>> NEED EVENT EXPIRATION HANDLING (auto-hide past events?)
          ** >>>>> NEED EVENT DELETION WORKFLOW

-----

     * VERCEL DEPLOYMENT:
          ** >>>>> Migrate website to new URL: https://BalanceFWD.com


ESSENTIAL FEATURES TO FINISH
     * ✅ DONE 2026-01-31: Get all scanners and scrapers to use Org-Scanner to discover, nominate gather Orgs, events, pre-scrape check. Identify flags.    
     * ✅ DONE 2026-02-01: Use GOOGLE search to gather contacts - ALWAYS (security policy)
          * 🔒 SECURITY: We NEVER scrape org websites for contacts
          * gatherPOCDirectFetch() is DEPRECATED
          * Ensures we respect ALL Terms of Use regardless of detected flags
          * Google Search quota managed with smart skip logic
     * ✅ DONE 2026-02-01: Ad-hoc scanner CLI (adhoc-scanner.js) and Admin Interface [🔍 Scan] button
     * De-dupe Orgs
          * Make sure we get complete name of Org, followed by acronym, and we do not record the acronym as the org when the Org has a full name.
     * Standardize Org names
     * Standardize contact info.  
     * Build Event approval function.  
     * ✅ DONE 2026-01-31: Only generating images from DALL-E when an event has been approved.
