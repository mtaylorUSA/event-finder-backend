# DOCUMENT NAME:  2025-12-20-0832_Tech_Architecture_and_Approach_UPDATED.md


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
          ** Define how editorial-style images are generated automatically for events
          ** Ensure visual consistency, safety, and policy compliance
          ** Support fully automated image generation with no human-in-the-loop

     * Dual Outputs of This Project
          ** Program Documentation
               *** Human-readable reference material
               *** Includes methodology, definitions, taxonomies, domains, modifiers, and constraints
               *** Maintained as Markdown (*.md) files in the Documentation folder
               *** Used to:
                    **** Onboard new AI sessions (Claude or ChatGPT)
                    **** Explain design intent and rationale
                    **** Serve as the source of truth for visual rules

          ** Claude Integration Package
               *** Machine-consumable rules for automated image generation
               *** Designed to be consumed by Claude-written code
               *** No manual prompting or human intervention required at runtime
               *** Intended outputs include:
                    **** Structured configuration (e.g., JSON)
                    **** Deterministic rule sets (domains, modifiers, constraints)
                    **** Prompt-building logic derived from configuration

     * Conceptual Separation of Responsibilities
          ** ChatGPT (Image Design & Architecture)
               *** Develops and refines visual language
               *** Defines domains, modifiers, icon budgets, and overlay rules
               *** Produces Program Documentation and integration-ready logic

          ** Claude (Implementation)
               *** Writes application code and scripts
               *** Reads structured rules produced here
               *** Constructs automated requests to ChatGPT for image generation
               *** Operates with no human review once deployed

     * Guiding Principles for Automation
          ** Topics and regions are the only required inputs at runtime
          ** Visual domains and modifiers are selected deterministically
          ** Constraints prevent unsafe, political, or misleading imagery
          ** Symbolic iconography is controlled via explicit rules (e.g., icon budget)
          ** Consistency is achieved through configuration, not ad-hoc prompts

     * Update Cadence
          ** Program Documentation
               *** Updated whenever visual rules, domains, or modifiers are refined
               *** Acts as the authoritative design reference

          ** Claude Integration Package
               *** Updated only when rules stabilize or new rule categories are introduced
               *** Avoid frequent churn to prevent implementation instability
               *** Versioned snapshots recommended after major refinements


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
          ** Graphic generation

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
               *** New orgs saved with status = `Pending Mission Review`

          ** Manual Discovery
               *** Open PocketBase Admin or `admin-interface.html`
               *** click "Add Organization"
               *** Enter organization details
               *** Set status = `Pending Mission Review`
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
                    **** 3. Filter by status = `Mission Approved Pending Permission`
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
                         ***** 4. Set `scraping_enabled` = true
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
              *** Status = `Permission Granted` or `Scraping Active`
              *** `scraping_enabled` = true
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
          ** 2. Fill in details, set status = `Pending Mission Review`
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
          ** 2. Set `scraping_enabled` = true
          ** 3. Set status = `Scraping Active`
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
     * Folders
          ** .git
               *** Git version control data. 
               *** Tracks all changes to your project. 
               *** Never edit manually
          ** .github 
               *** GitHub automation workflows. 
               *** Contains scrape-events.yml for scheduled tasks.
          ** Documentation
               *** All project documentation, prompts, workflows, and reference materials.
          ** node_modules
               *** Installed JavaScript dependencies. 
               *** Auto-generated by npm install. Never edit manually.

     * Configuration Files
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

     * User Interface Files
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

     * Scraper Scripts
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
          ** scrape-events.yml 
               *** GitHub Actions workflow file for scheduled automated scraping.
               *** Currently DISABLED (awaiting permissions).

     * Data Enrichment Scripts
          ** enrich-events.js 
               *** Uses AI to tag events with topics (cybersecurity, defense, intelligence, etc.).
          ** generate-embeddings.js 
               *** Creates AI embeddings for semantic search functionality.

     * Organization Management Scripts
          ** suggest-organizations.js 
               *** Uses AI to suggest new organizations to add based on existing approved ones.
          ** add-contacts.js 
               *** Adds POC (point of contact) records to the database.
          ** generate-permission-requests.js 
               *** Auto-generates permission request email drafts for each organization.

     * Cleanup Scripts
          ** cleanup-bad-events.js 
               *** Removes malformed or invalid event records from the database.
          ** cleanup-orphaned-events.js 
               *** Removes events that no longer have a valid parent organization.

     * Utility Scripts
          ** proxy-server.js 
               *** Local proxy server to handle CORS issues when testing scrapers locally.


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

     * settings Collection - Stores application configuration.
| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| setting_name | Plain Text | max 100, Nonempty, Presentable | Unique identifier (e.g., "owner_info") |
| my_name | Plain Text | max 200, Nonempty | Owner's full name |
| my_email | Email | Nonempty | Owner's email address |
| my_mobile | Plain Text | max 50 | Owner's phone number |

          **Current Record:
               *** setting_name: `owner_info`
               *** Contains owner contact info for auto-generated permission request emails

     * organizations Collection - Stores all organizations (approved, pending, rejected) with unified status workflow.
| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| name | Plain Text | Nonempty, Presentable | Organization name |
| website | URL | | Main website |
| description | Plain Text | max 2000 | Organization description |
| org_type | Plain Text | | Type (Government, Nonprofit, Think Tank, Academic, Professional Association) |
| events_url | URL | | Direct link to events page |
| source_id | Plain Text | max 100 | Unique domain identifier (e.g., "csis.org") |
| status | Select | Single, Nonempty, Presentable | Current workflow status (see below) |
| discovered_date | DateTime | | When AI suggested this org |
| ai_reasoning | Plain Text | max 2000 | Why AI suggested this org |
| similarity_score | Number | min 0, max 100 | AI confidence score |
| tou_flag | Bool | Presentable | True if TOU may prohibit scraping |
| tou_notes | Plain Text | max 2000 | Notes about Terms of Use |
| permission_request_draft | Plain Text | max 5000 | Auto-generated email draft |
| permission_correspondence | Plain Text | max 10000 | Approval email thread |
| permission_requested_date | DateTime | | When permission was requested |
| permission_response_date | DateTime | | When response was received |
| scraping_enabled | Bool | | Whether scraper should run |
| last_scraped | DateTime | | Last successful scrape |
| notes | Plain Text | | Admin notes |

          ** Status Field Values (8-stage lifecycle):
| Status | Description |
|--------|-------------|
| Pending Mission Review | AI-suggested, awaiting admin review |
| Mission Approved Pending Permission | Approved for mission, needs permission request |
| Mission Rejected | Does not fit project mission |
| Permission Requested (Self) | Email sent by owner |
| Permission Requested (Lawyer) | Email sent by lawyer |
| Permission Granted | Permission received, ready to scrape |
| Permission Rejected | Organization denied permission |
| Scraping Active | Actively being scraped |
 
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

     * contacts Collection - Stores POC contacts for organizations.
| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| name | Plain Text | Nonempty, Presentable | Contact name or team name |
| organization | Relation | → organizations, Single | Linked organization |
| title | Plain Text | | Job title |
| email | Email | | Contact email |
| phone | Plain Text | | Contact phone |
| contact_type | Select | Single | Type: Leadership, Events, Legal/Permissions, Media/PR, Other |
| source_url | URL | | Where contact info was found |
| notes | Plain Text | | Additional notes |
| last_verified | DateTime | | When info was last verified |

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

     * events Collection - Stores scraped event data.
| Field | Type | Settings | Purpose | UI Display |
|-------|------|----------|---------|------------|
| title | Plain Text | Nonempty, Presentable | Event title | ✅ Displayed, searchable |
| organization | Relation | → organizations, Single | Source organization | ✅ Displayed with link to website |
| url | URL | | Link to event page | ✅ Used for "More details and registration" link |
| start_date | DateTime | | Event start date | ✅ Used for date display and filtering |
| end_date | DateTime | | Event end date | ✅ Used for multi-day date display |
| start_time | Plain Text | | Event start time | ❌ Stored but NOT displayed |
| end_time | Plain Text | | Event end time | ❌ Stored but NOT displayed |
| location | Plain Text | | Event location | ✅ Displayed (City, ST format preferred) |
| description | Plain Text | | Event description | ✅ Displayed (2 lines max), searchable |
| event_type | Plain Text | | Type (webinar, in-person, hybrid) | ✅ Used for Virtual/In-Person filtering |
| registration_url | URL | | Registration link | ✅ Used if available, else `url` is used |
| speakers | Plain Text | | Speaker names | ❌ Not currently displayed |
| topics | Plain Text | | Event topics/tags | ✅ Used in More Filters, shown as emoji on card |
| regions | Plain Text | | Geographic regions | ✅ Used in More Filters |
| source_id | Plain Text | | Unique ID from source | ❌ Internal use only |
| raw_data | JSON | | Original scraped data | ❌ Internal use only |
| created | DateTime | | When record was created | ❌ Internal use only |
| updated | DateTime | | When record was updated | ❌ Internal use only |

          ** Topics in Database (topics field):
               *** Cybersecurity, Defense Policy & Intelligence, Nuclear & WMD, Space & Satellites, AI & Emerging Technology, Terrorism & Counterterrorism, Military & Conflict, Homeland Security, Environment & Climate, Economic Security, Diplomacy & Statecraft, Humanitarian & Societal, Careers & Professional Development, Government Business & Modernization 


          ** Regions in Database (regions field):
               *** Africa, Arctic, Domestic US, Europe/Eurasia, East and Southeast Asia, Global/Multilateral, South, Pacific and Oceania, Latin America, Middle East, South Asia


          ** Countries in in Database (countries field):
               *** Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Brunei, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Cape Verde, Central African Republic, Chad, Chile, China, Colombia, Comoros, Costa Rica, Croatia, Cuba, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Djibouti, Dominica, Dominican Republic, East Timor, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia, Fiji, Finland, France, Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Ivory Coast, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, New Zealand, Nicaragua, Niger, Nigeria, North Korea, North Macedonia, Norway, Oman, Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Republic of the Congo, Romania, Russia, Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, San Marino, Sao Tome and Principe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Sweden, Switzerland, Syria, Taiwan, Tajikistan, Tanzania, Thailand, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe


          ** Transnational Organizations in Database (transnational_orgs field):
               *** African Union, ANZUS, APEC, Arab League, ASEAN, AUKUS, BRICS, Caribbean Community, Commonwealth of Nations, European Union, Five Eyes, G7, G20, Gulf Cooperation Council, International Atomic Energy Agency, International Criminal Court, Interpol, NATO, OECD, OPEC, Organization of American States, Pacific Islands Forum, Quad, Shanghai Cooperation Organisation, United Nations, World Bank, World Health Organization, World Trade Organization

          ** Current Status of events as of 2025-12-07          
               *** 45 Scraped event data 


     * event_embeddings Collection - Stores AI embeddings for semantic search.
| Field | Type | Settings | Purpose |
|-------|------|----------|---------|
| event | Relation | → events, Single | Linked event |
| embedding | JSON | | OpenAI embedding vector |
| model | Plain Text | | Model used (text-embedding-3-small) |
| created | DateTime | | When embedding was created |

          ** Current Status of event_embeddings as of 2025-12-07
               *** 40 AI embeddings for semantic search


---


# UI Display Notes
     * Date Display Format:
          ** Times (start_time, end_time) are stored but **NOT displayed** on the front-end.  This avoids complexity with multi-day events that may have different times each day.  Users click "More details and registration" to see specific times on the org's website
| Date Scenario | Display Format |
|---------------|----------------|
| Single day | December 18, 2025 |
| Multi-day, same month | December 9-10, 2025 |
| Multi-day, different months | December 30, 2025 to January 2, 2026 |
| Multi-day, different years | December 30, 2025 to January 2, 2026 |

     * Location Display Logic:
          ** If `event_type` contains "virtual" → displays "Virtual"
          ** If `event_type` contains "hybrid" → displays "Hybrid - City, ST"
          ** If `location` field has valid City, ST → displays as-is
          ** If `location` field has bad value (like "in-person") → extracts City, ST from title if possible
          ** Fallback → "Location TBD"

     *Description Display:
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

