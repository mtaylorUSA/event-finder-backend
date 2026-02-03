@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# DOCUMENT NAME:  
2026-02-02-1900 ConOp Event_Finder.md




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
                    **** Terms of Use, Privacy Policy, User Agreement, etc.
                    **** Context-aware restriction detection
                    **** Record triggering phrases and context

               *** Step 8: Check for JavaScript rendering on events page
                    **** If content is empty or shows JS framework indicators
                    **** Set tech_rendering_flag = TRUE

               *** Step 9: Gather POC info (🔒 ALWAYS via Google Search - never scrapes org sites)
                    **** Searches all 5 categories: Legal/Permissions, Events, Media/PR, Leadership, General
                    **** Saves contacts to contacts collection

               *** Step 10: AI-analyze org and generate summary
                    **** AI reviews: homepage content + policy docs + triggering event
                    **** AI generates: org name, description, relevance summary

               *** Step 11: Create organization record
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
               *** Set permission_type to "Implied (No Response)"
               *** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)`
               *** This is "implied permission" - proceed unless they object

-----

     * If no response after 1 week but HAS flags (tou_flag = TRUE):
               *** DO NOT proceed automatically
               *** Keep status at `Permission Requested (Pending Org Response)`
               *** Follow up with additional outreach
               *** Require explicit permission before changing to Live



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ORGANIZATION WORKFLOW 4: SCRAPING
     * Running the scraper for Live organizations

-----

     * Prerequisites:
          ** Organization status must be "Live (Scraping Active)"
          ** Organization must have events_url populated
          ** No active restriction flags OR permission_type = "Waiver"

-----

     * How to Run Scraper
          ** All Live orgs: node scrapers/scan-and-scrape-all-live-orgs.js --all
          ** Single org: node scrapers/scan-and-scrape-all-live-orgs.js --org "Org Name"
          ** GitHub Action runs automatically at 11:30 PM EST daily

-----

     * Pre-Scrape Safety Scan
          ** Every scrape operation begins with a safety scan
          ** Checks for NEW restriction flags since last scan
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
          ** UPDATED 2026-02-02: Only generates embeddings for APPROVED events
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

     * After Scraping: Image Generation (AUTOMATED)
          ** UPDATED 2026-02-02: Image generation is now fully automated via GitHub Actions
          ** Daily workflow runs at 1:03 AM EST to generate icons for new events
          ** APPROVED events with start_date >= today get topic icons
          ** If approved event has new topic/region/country/org combination:
               *** create-topic-icon-records.js creates topic_icons record (only for future approved events)
               *** generate-topic-icons.js generates the actual image via DALL-E 3
          ** Nominated/rejected events are skipped (saves DALL-E API costs)
          ** Past events (start_date < today) are skipped (saves DALL-E API costs)
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
     * UPDATED 2026-02-02: Fully automated via GitHub Actions daily workflow

     * Purpose: Generate unique topic icons for approved future events to display on event cards

-----

     * How Image Generation Works (UPDATED 2026-02-02)
          ** AUTOMATED: GitHub Action runs daily at 1:03 AM EST
          ** When an event is approved, the next daily run will check for missing icons
          ** Icons are based on: Topic + Region + Country + Organization combination
          ** System checks topic_icons collection for existing icon with matching combination
          ** If no icon exists: create-topic-icon-records.js creates the record, then generate-topic-icons.js creates the image via DALL-E 3 API
          ** IMPORTANT: Only APPROVED events with start_date >= today are processed
          ** Nominated/rejected events are skipped (saves DALL-E costs)
          ** Past events are skipped (saves DALL-E costs)

-----

     * Daily Automation Flow (NEW 2026-02-02)
          ** Step 1: GitHub Action triggers at 1:03 AM EST daily
          ** Step 2: create-topic-icon-records.js runs:
               *** Fetches events where event_status = "approved" AND start_date >= today
               *** For each event, builds topic_combination key
               *** Checks if key already exists in topic_icons collection
               *** Creates new topic_icons record only for missing combinations
          ** Step 3: generate-topic-icons.js runs:
               *** Fetches topic_icons records that have no icon_file
               *** Calls DALL-E 3 API to generate 1024x1024 PNG
               *** Validates image (OCR text check, panel detection, downscale audit)
               *** Uploads valid icon to PocketBase
               *** Retries with simplified prompt if validation fails

-----

     * topic_combination Key Format (UPDATED 2026-02-02)
          ** New format (4-part pipe-separated): "Topic1,Topic2|Region1,Region2|Country1|TransnationalOrg"
          ** Old format (topics only): "Topic1,Topic2"
          ** Public UI has backwards compatibility to check both formats
          ** Example new format: "AI & Emerging Technology,Defense Policy & Intelligence|Global/Multilateral||"
          ** Example old format: "Cybersecurity,Defense Policy & Intelligence"

-----

     * Manual Run (if needed)
          ** Step 1: Run create-topic-icon-records.js to scan approved future events for new combinations
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

     * Automated Weekly Scan
          ** GitHub Action: org-scanner.yml
          ** Runs: Saturday at 10:00 PM EST
          ** Script: scan-and-scrape-all-live-orgs.js --approved --scan-only
          ** Purpose: Re-scan all orgs (except Rejected by Mission) for TOU changes
          ** Google Queries: ~0 (smart skip logic for existing contacts)



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# EVENT POLICY - ORGANIZATION TRUST LEVELS

     * event_policy Field: Determines how scraped events are handled
          ** accept_all: Events auto-approved (event_status = "approved")
          ** propose_events: Events need review (event_status = "nominated")

-----

     * When to Use accept_all:
          ** High-trust organizations (known, reputable)
          ** Organizations with explicit permission
          ** Organizations with consistent, relevant event content

-----

     * When to Use propose_events:
          ** New organizations (need to validate event quality)
          ** Organizations with mixed content (some relevant, some not)
          ** When you want to curate which events appear



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING AND SCRAPING - PRINCIPLES

     * Ethical Scraping Principles
          ** Always check TOU before scraping
          ** Respect robots.txt
          ** Use reasonable request rates
          ** Stop immediately if asked

-----

     * Automation Schedule (UPDATED 2026-02-02)
          ** Workflow timing designed to:
               *** Stay within 100 free Google Search queries/day
               *** Spread API usage across the week
               *** Run during off-peak hours (late night EST)

          ** Daily - 11:30 PM EST:
               *** Workflow: scrape-events.yml
               *** Script: scan-and-scrape-all-live-orgs.js --all
               *** Purpose: Pre-scrape scan + event scraping for Live orgs
               *** Google Queries: ~0 (skip logic - existing orgs have contacts)

          ** Daily - 1:03 AM EST (NEW 2026-02-02):
               *** Workflow: generate-topic-icons.yml
               *** Scripts: create-topic-icon-records.js + generate-topic-icons.js
               *** Purpose: Generate DALL-E icons for approved future events
               *** Google Queries: 0
               *** OpenAI API: DALL-E 3 calls for new icons

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
               *** generate-topic-icons.yml - Daily icon generation (NEW 2026-02-02)
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
          ** All methods save contacts to contacts collection

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
          ** Commercial use: "commercial purposes", "commercial use", "for profit"
          ** Derivative works: "derivative", "modify", "adapt", "create works"


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING - JAVASCRIPT RENDERING DETECTION

     * Purpose: Identify sites that require headless browser (Puppeteer) for scraping

-----

     * Detection Method (in org-scanner.js)
          ** Step 1: Fetch events page HTML
          ** Step 2: Check for JavaScript framework indicators:
               *** React: <div id="root"></div> with minimal content
               *** Vue: <div id="app"></div> with minimal content
               *** Angular: ng-app, ng-controller attributes
               *** Next.js: __NEXT_DATA__ script tag
               *** Nuxt.js: __NUXT__ script tag
          ** Step 3: Check for empty content body (AJAX-loaded data)
          ** Step 4: If detected, set tech_rendering_flag = TRUE

-----

     * Impact on Scraping
          ** Standard fetch() cannot get content from JS-rendered pages
          ** These orgs require Puppeteer-based scrapers (not yet implemented)
          ** tech_rendering_flag = TRUE means: "works, but needs special handling"

-----

     * Current Status
          ** Detection: ✅ Working
          ** Puppeteer scrapers: ❌ Not implemented yet
          ** Orgs with flag: Tracked but not scraped


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING AND SCRAPING - LOGS

     * scan_logs Collection
          ** Every scan operation creates a record in scan_logs
          ** Captures: org, scan_type, date, all flags, restriction details, POC info
          ** Used for: Audit trail, debugging, reviewing scan history

-----

     * Log Entry Contents
          ** organization: Link to org record
          ** scan_type: discovery, pre-scrape, manual, scheduled, contact-discovery
          ** scan_date: When scan occurred
          ** legal_pages_found: Count of policy pages discovered
          ** legal_page_urls: URLs of all policy pages
          ** tou_flag, tech_block_flag, tech_rendering_flag: Scan results
          ** restriction_terms: Keywords that triggered detection
          ** restriction_contexts: Surrounding text for human review
          ** poc_found, poc_email: Contact discovery results
          ** status_before, status_after: If status changed
          ** duration_ms: How long scan took
          ** error: Any error messages

-----

     * Viewing Logs
          ** PocketBase Admin: scan_logs collection
          ** Admin Interface: Organization Profile → Status & History tab
          ** Console output during script execution



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# IMAGE GENERATION PROGRAM ARCHITECTURE
     * UPDATED 2026-02-02: Automation complete, future-events filtering implemented

     * Purpose
          ** Generate unique, AI-created topic icons for events displayed in Public UI
          ** Icons visually represent event topics, regions, and organizations
          ** Provides professional, consistent visual branding across event cards

-----

     * Automation (NEW 2026-02-02)
          ** GitHub Action: generate-topic-icons.yml
          ** Schedule: Daily at 1:03 AM EST (06:03 UTC)
          ** Runs automatically - no manual intervention needed
          ** Creates icons for newly approved events with missing topic combinations
          ** Manual trigger available via GitHub Actions UI ("Re-run all jobs")

-----

     * Future Events Filter (NEW 2026-02-02)
          ** create-topic-icon-records.js now filters: event_status = "approved" AND start_date >= today
          ** Past events are skipped (no icons generated for events that already occurred)
          ** This saves DALL-E API costs by not generating icons for past events
          ** Existing icons remain in database for historical reference

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

          ** create-topic-icon-records.js (UPDATED 2026-02-02)
               *** Scans APPROVED events with start_date >= today for unique topic/region/country/org combinations
               *** Skips nominated/rejected events (saves DALL-E costs)
               *** Skips past events (saves DALL-E costs)
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

     * Workflow (UPDATED 2026-02-02)
          ** Automated Daily (recommended):
               *** GitHub Action runs at 1:03 AM EST
               *** No manual steps needed
               *** Icons generated for any new approved future events
          ** Manual Run (if needed):
               *** Step 1: cd to icon-worker folder
               *** Step 2: Run npm run create-records to create topic_icons records for new combinations
               *** Step 3: Run npm run generate to generate icons for records missing icon_file
               *** Step 4: Icons are automatically uploaded to PocketBase and linked to events via topic_combination key

-----

     * topic_combination Key Format (UPDATED 2026-02-02)
          ** Format: "Topics|Regions|Countries|TransnationalOrg" (pipe-separated)
          ** Topics: Comma-separated list sorted alphabetically
          ** Regions: Comma-separated list sorted alphabetically
          ** Countries: Comma-separated list sorted alphabetically
          ** TransnationalOrg: Single value or empty
          ** Example: "AI & Emerging Technology,Defense Policy & Intelligence|Global/Multilateral||"
          ** Old format (topics only): "Cybersecurity,Defense Policy & Intelligence" (for backwards compatibility)
          ** Public UI checks both formats when looking up icons

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

-----

     * Known Issue: Image Variety (NOTED 2026-02-02)
          ** Current generated images can look similar across different topic combinations
          ** Future improvement: Tune rules.js and policyEngine.js for more visual variety
          ** Quick wins to consider:
               *** Add more visual variation per topic in rules.js
               *** Add randomization to prompt elements in policyEngine.js
               *** Reduce strict style constraints


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

     * Topic Icon Display (UPDATED 2026-02-02)
          ** Each event card displays a topic icon based on its topic_combination
          ** Icon lookup process:
               *** Build topic_combination key from event's topics, regions, countries, transnational_orgs
               *** Check topic_icons collection for matching key (new 4-part format)
               *** If not found, check for old format key (topics only) for backwards compatibility
               *** If icon found with icon_file, display the DALL-E generated image
               *** If no matching icon or no icon_file, display gradient placeholder with emoji
          ** Backwards Compatibility:
               *** Public UI (index.html) checks both old and new key formats
               *** Old format: "Topic1,Topic2" (topics only, comma-separated)
               *** New format: "Topic1,Topic2|Region1|Country1|Org1" (pipe-separated sections)
          ** Placeholder Fallback:
               *** If no icon found, displays CSS gradient background with calendar emoji
               *** Placeholder is purely visual - not stored in database

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
               *** .github/workflows/generate-topic-icons.yml - Daily icon generation (NEW 2026-02-02)
               *** .github/workflows/suggest-organizations.yml - Monday profile-based discovery
               *** .github/workflows/discover-orgs-by-events.yml - Wednesday event-based discovery
               *** .github/workflows/org-scanner.yml - Saturday weekly re-scan
               *** .github/workflows/contact-discovery.yml.disabled - DEPRECATED
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
          ** index.html (UPDATED 2026-02-02)
               *** The file Vercel serves to the public
               *** Contains topic icon display logic with backwards compatibility
               *** Displays only approved events
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
               *** enrich-events.js - AI enrichment for topic tagging
               *** generate-embeddings.js - Creates AI embeddings for semantic search (UPDATED 2026-02-02: only approved events)
               *** fix-orphan-contacts.js - Links orphan contacts to orgs by email domain

-----

     * icon-worker Folder Contents (UPDATED 2026-02-02)
          ** icon-worker/
               *** package.json - Dependencies for image generation
               *** node_modules/ - Installed packages
          ** icon-worker/src/
               *** create-topic-icon-records.js - Creates topic_icons records for approved future events
               *** generate-topic-icons.js - Generates images via DALL-E 3
               *** rules.js - Visual style definitions per topic/region
               *** policyEngine.js - Prompt construction logic
               *** validators.js - OCR, panel detection, downscale audit
               *** config.js - Loads ROOT .env file
               *** pbClient.js - PocketBase API helpers
               *** openaiImages.js - DALL-E 3 API wrapper
               *** clear-icons.js - Clears icons for regeneration
               *** cleanup-topic-combinations.js - Fixes malformed keys

-----

     * Organization Scanning (in scrapers/ folder)
          ** org-scanner.js
               *** Core scanning module used by ALL discovery scripts
               *** Detects: Policy restrictions, tech blocks, JS rendering, events URL, POC (via Google Search only)
               *** Exports: scanOrganization(), gatherPOC(), savePocContact(), etc.
               *** 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only
          ** scan-and-scrape-all-live-orgs.js
               *** Unified CLI for scanning and scraping
               *** Commands: --all, --org "Name", --scan-only, --approved
               *** Uses org-scanner.js for all scanning operations
          ** adhoc-scanner.js (NEW 2026-02-01)
               *** On-demand org scanning from command line
               *** Usage: node scrapers/adhoc-scanner.js --org "Name"
               *** Option: --force-contacts to search all 5 contact categories
               *** Creates scan_log entry with scanType: 'manual'

-----

     * Discovery Scripts (in scrapers/ folder)
          ** discover-orgs-by-events.js
               *** Event-based organization discovery
               *** NOW IMPORTS org-scanner.js (removed duplicate code)
               *** Searches Google for similar events, nominates hosting orgs
          ** suggest-organizations.js
               *** Profile-based organization discovery
               *** NOW USES org-scanner.js after AI suggests orgs
               *** Removed AI-guessed TOU flags - uses real scan results
          ** Org Scanners
               *** scan-and-scrape-all-live-orgs.js - Unified scanner/scraper
               *** org-scanner.js - Core scanning module (context-aware detection)
               *** Duplicate detection
               *** JavaScript rendering detection
               *** Technical block detection (403/401)
               *** Events URL discovery from homepage and triggering URLs
               *** POC info gathering
               *** AI-powered org analysis

-----

     * Data Enrichment (in scrapers/ folder)
          ** enrich-events.js
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.)
               *** Run: node scrapers/enrich-events.js

          ** generate-embeddings.js (UPDATED 2026-02-02)
               *** Creates AI embeddings for semantic search functionality
               *** Only generates embeddings for APPROVED events
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

     * Image Generation (icon-worker/src/) - UPDATED 2026-02-02
          ** generate-topic-icons.js
               *** Main worker script for icon generation
               *** Fetches topic_icons records that are missing icon_file
               *** Builds prompts via policyEngine.js
               *** Calls DALL·E 3 API to generate images
               *** Validates images (OCR, panel detection, downscale audit)
               *** Retries with simplified prompts if validation fails
               *** Uploads valid icons to PocketBase
          ** create-topic-icon-records.js (UPDATED 2026-02-02)
               *** Scans events collection for unique topic/region/country/org combinations
               *** Only processes APPROVED events with start_date >= today
               *** Skips past events (saves DALL-E costs)
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

     * UPDATED 2026-02-02: Added generate-topic-icons.yml for automated daily icon generation

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

     * Workflow: Generate Topic Icons Daily (NEW 2026-02-02)
          ** File: .github/workflows/generate-topic-icons.yml
          ** Status: ✅ Active
          ** Schedule: Daily at 1:03 AM EST (06:03 UTC)
          ** Scripts: 
               *** cd icon-worker && node src/create-topic-icon-records.js
               *** cd icon-worker && node src/generate-topic-icons.js
          ** Purpose: Generate DALL-E icons for approved future events
          ** Filters: event_status = "approved" AND start_date >= today
          ** Google Queries: 0
          ** OpenAI API: DALL-E 3 calls for new icons only
          ** Manual Trigger: Available via GitHub Actions UI ("Re-run all jobs")

-----

     * Workflow: Profile-Based Org Discovery (Weekly)
          ** File: .github/workflows/suggest-organizations.yml
          ** Status: ✅ Active
          ** Schedule: Monday at 10:00 PM EST (03:00 UTC Tuesday)
          ** Script: suggest-organizations.js
          ** Purpose: AI suggests new orgs based on existing approved org profiles
          ** Google Queries: ~15-25 (5 per new org suggested)
          ** Uses org-scanner.js for real TOU/tech flag detection

-----

     * Workflow: Event-Based Org Discovery (Weekly)
          ** File: .github/workflows/discover-orgs-by-events.yml
          ** Status: ✅ Active
          ** Schedule: Wednesday at 10:00 PM EST (03:00 UTC Thursday)
          ** Script: discover-orgs-by-events.js
          ** Purpose: Find new orgs by searching for similar events online
          ** Google Queries: ~30-50 (event searches + 5 per new org found)
          ** Uses org-scanner.js for Phase B scanning

-----

     * Workflow: Weekly Organization Scanner
          ** File: .github/workflows/org-scanner.yml
          ** Status: ✅ Active
          ** Schedule: Saturday at 10:00 PM EST (03:00 UTC Sunday)
          ** Script: scan-and-scrape-all-live-orgs.js --approved --scan-only
          ** Purpose: Re-scan all orgs (except Rejected by Mission) for TOU changes
          ** Google Queries: ~0 (skip logic - existing orgs have contacts)
          ** Manual trigger: Supports --limit input for testing

-----

     * Workflow: Contact Discovery (Daily) - DISABLED
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
          ** Click "Run workflow" button (or "Re-run all jobs" for existing run)
          ** For generate-topic-icons: Click on workflow, then "Re-run all jobs"
          ** For suggest-organizations: Can specify limit
          ** For discover-orgs-by-events: Can specify max_queries and max_nominations
          ** For org-scanner: Can specify limit for testing
          ** Useful for: Testing, immediate updates

-----

     * Viewing Logs
          ** Go to GitHub repo → Actions tab
          ** Click on specific workflow run
          ** Expand job steps to see output
          ** Use Ctrl+F in browser to search log text
          ** Scan results also appear in PocketBase scan_logs collection



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# POCKETBASE COLLECTIONS AND VALUES
     * VALIDATED 2026-02-01: scan_logs field names corrected to match actual database schema
          ** tou_flag, tech_block_flag, tech_rendering_flag (aligned with organizations collection)

-----

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
          ** VALIDATED 2026-02-01: Field names corrected to match database (tou_flag, tech_block_flag, tech_rendering_flag)

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
          ** Field Purpose/Notes: True if any TOU/policy restrictions detected. Aligned with organizations collection field name.

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
          ** Field Purpose/Notes: Context snippets (10 words before/after trigger). Format: "PageType | URL | Quote" per line.

          ** Field Name: tech_block_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if 403/401 error. Aligned with organizations collection field name.

          ** Field Name: microsite_suspect_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if uncertain microsite detection

          ** Field Name: tech_rendering_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: True if events page requires JavaScript. Aligned with organizations collection field name.

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
          ** Field Purpose/Notes: Structured per-page scan results for admin UI display.

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
          ** Setting - Max size (bytes): 50000
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
          ** Setting - max length: 500
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Event title

          ** Field Name: description
          ** Field Type (text box): Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event description

          ** Field Name: url
          ** Field Type: URL 
          ** Setting - Nonempty: off 
          ** Setting - Presentable: off  
          ** Field Purpose/Notes: Link to event details

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Select Collection (picklist): → organizations
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Cascade delete: false
          ** Setting - Nonempty: off 
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Parent organization

          ** Field Name: start_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Event start date

          ** Field Name: end_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Setting - Presentable: off 
          ** Field Purpose/Notes: Event end date

          ** Field Name: source_id
          ** Field Type (text box): Plain Text
          ** Setting - max length (text box): 500
          ** Setting - nonempty (toggle): on
          ** Setting - Presentable (toggle): off

          ** Field Name: event_type
          ** Field Type: Select
          ** Setting - Choices: Virtual, In-person, Hybrid
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off 

          ** Field Name: event_status 
          ** Field Type: Select
          ** Setting - Choices: approved, nominated, rejected
          ** Setting - Single/multiple (picklist): Single
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on 
          ** Field Purpose/Notes: Event review status - approved shows in public UI, nominated needs review, rejected hidden but stored

          ** Field Name: topics
          ** Field Type: Select
          ** Setting - Choices: Cybersecurity, Defense Policy & Intelligence, Nuclear & WMD, Space & Satellites, AI & Emerging Technology, Terrorism & Counterterrorism, Military & Conflict, Homeland Security, Environment & Climate, Economic Security, Diplomacy & Statecraft, Humanitarian & Societal, Careers & Professional Development, Government Business & Modernization 
          ** Setting - Single/multiple (picklist): Multiple
          ** Max select: 13 
          ** Setting - Nonempty: off  
          ** Setting - Presentable: on

          ** Field Name: regions
          ** Field Type: Select
          ** Setting - Choices: Africa, Arctic, Domestic US, Europe/Eurasia, East and Southeast Asia, Global/Multilateral, South, Pacific and Oceania, Latin America, Middle East, South Asia
          ** Setting - Single/multiple (picklist): Multiple
          ** Max select (text box): 10
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off

          ** Field Name: countries
          ** Field Type: Select
          ** Setting - Single/multiple (picklist): Multiple
          ** Setting - Max select (text box): 196
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off

          ** Field Name: transnational_orgs
          ** Field Type: Select
          ** Setting - Choices: African Union, ANZUS, APEC, Arab League, ASEAN, AUKUS, BRICS, Caribbean Community, Commonwealth of Nations, European Union, Five Eyes, G7, G20, Gulf Cooperation Council, International Atomic Energy Agency, International Criminal Court, Interpol, NATO, OECD, OPEC, Organization of American States, Pacific Islands Forum, Quad, Shanghai Cooperation Organisation, United Nations, World Bank, World Health Organization, World Trade Organization
          ** Setting - Single/multiple (picklist): Multiple
          ** Setting - Max select (text box): 28
          ** Setting - Nonempty (toggle): off  
          ** Setting - Presentable (toggle): off  

          ** Field Name: location  
          ** Field Type (text box): Plain Text
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Event location

-----

     * organizations Collection - Stores organization data.
          ** Key Fields:
               *** name: Organization name
               *** website: Organization URL
               *** status: Workflow status (7 values)
               *** event_policy: accept_all or propose_events
               *** permission_type: Explicit, Implied, Waiver, Denied
               *** tou_flag, tech_block_flag, tech_rendering_flag: Restriction flags
               *** discovery_method: manual, profile-based, event-based

-----

     * settings Collection - Stores application-level settings like the permission request template.
          ** Field Name: key
          ** Field Type (text box): Plain Text
          ** Setting - max length: 100
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Setting identifier (e.g., "permission_request_template")

          ** Field Name: value
          ** Field Type (text box): Plain Text
          ** Setting - max length: 50000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Setting content (e.g., email template)

-----

     * topic_icons Collection - Stores AI-generated icons for unique topic/region/country/org combinations.
          ** UPDATED 2026-02-02: Public read access enabled for icon display
          
          ** Field Name: topic_combination
          ** Field Type (text box): Plain Text
          ** Setting - max length: 500
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose/Notes: Unique key format: "Topics|Regions|Countries|TransnationalOrg" (pipe-separated). Old format "Topic1,Topic2" also supported for backwards compatibility.

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
          ** Setting - Single/multiple: Single
          ** Setting - Nonempty: off
          ** Setting - Presentable: off

          ** Field Name: icon_file
          ** Field Type: File
          ** Setting - Max select: 1
          ** Setting - Protected: off
          ** Setting - Nonempty: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: The AI-generated icon image

          ** Field Name: prompt_used
          ** Field Type: Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: The DALL·E prompt that generated this icon

          ** Field Name: compliance_notes
          ** Field Type: Plain Text
          ** Setting - max length: 2000
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
          ** API Rules: Public read access enabled for events, organizations, and topic_icons

-----

     * GitHub: 
          ** Single repo for all project files (scripts, UI, docs)
          ** Repo: github.com/mtaylorUSA/event-finder-backend
          ** CI integration with Vercel (auto-deploy) and Railway
          ** GitHub Actions for automated workflows

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
          ** Contains topic icon display with backwards compatibility (UPDATED 2026-02-02)

-----

     * How to Update the Public UI
          ** 1. Make changes to index.html
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
          ** Two Independent Filter Dropdowns (selecting one resets the other)
          ** Organization cards with status-specific content
          ** Inline status dropdown for quick changes
          ** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events, 🔍 Scan
          ** [🔍 Scan] Button opens modal with command generator

-----

     * Tab: Organizations
          ** Quick search by name
          ** Jump to Organization dropdown
          ** Add Organization button
          ** Organization cards with badges and action buttons

-----

     * Tab: Contacts
          ** List of all contacts across organizations
          ** Add Contact button
          ** Edit/Delete buttons per contact

-----

     * Tab: Events 
          ** Filter by event status (All, Nominated, Approved, Rejected)
          ** Filter by organization
          ** Accept/Reject buttons for event review

-----

     * Tab: Icons
          ** Icon status stats (total, has icon, missing icon)
          ** Filter by icon status
          ** List of topic combinations with icons

-----

     * Organization Profile Page
          ** 4 Sub-tabs: Overview, Contacts, Status & History, Events



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - SCANNING AND SCRAPING

     * QUICK START PROMPT:
          ** "I'm working on Event Finder scanning/scraping. Please read ConOp sections: SCANNING - UNIFIED APPROACH PHILOSOPHY, SCANNING - ORG-SCANNER DETAILS, and ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT. SECURITY: Contact gathering ALWAYS uses Google Search only. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/scan-and-scrape-all-live-orgs.js
          ** ✅ scrapers/org-scanner.js
          ** ✅ scrapers/adhoc-scanner.js
          ** ✅ admin-interface-v22.html

-----

     * Last Session: 2026-02-01

-----

     * Current Status: ✅ UNIFIED SCANNING COMPLETE + SECURITY HARDENED


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
# SESSION HANDOFFS - IMAGE GENERATION

     * QUICK START PROMPT:
          ** "I'm working on Event Finder image generation (DALL-E topic icons). Please read ConOp section: IMAGE GENERATION PROGRAM ARCHITECTURE. Key files are in icon-worker/src/. Current issue: Images look too similar, need more variety. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ icon-worker/src/create-topic-icon-records.js
          ** ✅ icon-worker/src/generate-topic-icons.js
          ** ✅ icon-worker/src/rules.js
          ** ✅ icon-worker/src/policyEngine.js
          ** ✅ icon-worker/src/validators.js

-----

     * ConOp Sections to Emphasize:
          ** IMAGE GENERATION PROGRAM ARCHITECTURE
          ** KEY FOLDERS AND FILES (icon-worker/ section)
          ** ORGANIZATION WORKFLOW 6: IMAGE GENERATION
          ** GITHUB ACTIONS (generate-topic-icons.yml)

-----

     * Technology Stack:
          ** OpenAI DALL·E 3 API for image generation
          ** Sharp library for image processing
          ** Tesseract.js for OCR text detection
          ** PocketBase topic_icons collection for storage

-----

     * Last Session: 2026-02-02

-----

     * What Was Completed (2026-02-02):
          ** ✅ Automation workflow created: generate-topic-icons.yml runs daily at 1:03 AM EST
          ** ✅ Future events filter: create-topic-icon-records.js now filters start_date >= today
          ** ✅ Workflow verified working: Successfully generated icons for 16/17 events
          ** ✅ Public UI displaying DALL-E images (backwards compatibility for old/new key formats)
          ** ✅ Backwards compatibility confirmed working in index.html

-----

     * Current Status: ✅ AUTOMATION WORKING
          ** ✅ Daily workflow runs automatically at 1:03 AM EST
          ** ✅ Only processes approved events with start_date >= today
          ** ✅ 16 of 17 events showing DALL-E images
          ** ⚠️ 1 event missing icon: "2026 Intel Summit" - needs investigation
          ** ⚠️ Image variety needs improvement (images look too similar)

-----

     * Known Issues:
          ** Missing Icon: "2026 Intel Summit" (Topics: AI & Emerging Technology, Defense Policy & Intelligence; Regions: Global/Multilateral) - icon should exist but wasn't generated
          ** Image Variety: Many generated images look nearly identical - need to tune rules.js and policyEngine.js

-----

     * Next Steps:
          ** 1. 🔍 Debug why "2026 Intel Summit" icon wasn't generated (check workflow logs)
          ** 2. 🎨 Improve image variety by tuning rules.js (add more visual variation per topic)
          ** 3. 🎨 Add randomization to prompt elements in policyEngine.js
          ** 4. 📊 Review all topic combinations to ensure coverage



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - PUBLIC UI

     * QUICK START PROMPT:
          ** "I'm working on the Event Finder public-facing UI. Please read ConOp sections: PUBLIC UI FEATURES and VERCEL DEPLOYMENT. The file is index.html. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ index.html

-----

     * Live URLs:
          ** Public UI: https://event-finder-ui-one.vercel.app
          ** Admin: https://event-finder-ui-one.vercel.app/admin-interface-v22.html

-----

     * Last Session: 2026-02-02

-----

     * What Was Completed (2026-02-02):
          ** ✅ Topic icon display working with DALL-E images
          ** ✅ Backwards compatibility for old/new topic_combination key formats
          ** ✅ Only approved events displayed
          ** ✅ 16/17 events showing icons

-----

     * Current Status: ✅ LIVE on Vercel



@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - FUTURE REQUIREMENTS TRACKER

     * This section tracks all ">>>>>>" FUTURE REQUIREMENT markers in the ConOp

-----

     * MANUAL DISCOVERY (Workflow 1A):
          ** >>>>> IMPLEMENT ORG-SCANNER to perform scanning when there is a Manual Discovery
          ** >>>>> ADD [Scan and Nominate] button in Admin Interface
          ** >>>>> USE ORG-SCANNER AND RECURSIVE SEARCHING at this stage

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
     * ✅ DONE 2026-02-01: Ad-hoc scanner CLI (adhoc-scanner.js) and Admin Interface [🔍 Scan] button
     * ✅ DONE 2026-01-31: Only generating images from DALL-E when an event has been approved.
     * ✅ DONE 2026-02-02: Automated daily icon generation workflow (generate-topic-icons.yml)
     * ✅ DONE 2026-02-02: Future events filter (start_date >= today) for icon generation
     * ✅ DONE 2026-02-02: Public UI topic icon display with backwards compatibility
     * De-dupe Orgs
     * Standardize Org names
     * Standardize contact info.  
     * Build Event approval function.
     * 🎨 NEXT: Improve image variety in rules.js and policyEngine.js
