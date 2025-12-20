2025-12-13-1935 Tech Architecture and Approach.md

Use this document to bring a new Claude session up to speed on the project.


     * 
          ** 
               *** 
                    **** 


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


#Tech Stack
     * Vercel: Host the Next.js web app + serverless/edge functions

     * PocketBase: 
          ** Lightweight backend (auth, DB, file storage, realtime)
          ** Self‑host on Railway
          ** PocketBase Admin URL - https://event-discovery-backend-production.up.railway.app

     * GitHub: Repo + CI integration with Vercel/Railway

     * Railway: Host PocketBase 

     * Bitwarden: Store API keys/secrets

     * My system (local Dev): 
          ** HP Envy x360
          ** Windows 11 Personal  
          ** Microsoft Office 365
          ** Powershell

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
          ** event-finder-ui-v7.html  

     * FUTURE: Email with customers (TBD): 
          ** Resend (easy on Vercel) or 
          ** Mailgun/SendGrid (free tiers exist)

     * FUTURE: Payments (TBD): 
          ** Lemon Squeezy or 
          ** Stripe (subscriptions)


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
                         ***** 2. Add note to `permission\\\\\\\_correspondence` field


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
              *** `scraping\_enabled` = true
              *** `events\_url` is set

     * Run Scrapers
          ** Option A: Scrape All Enabled Organizations\*\*
              *** powershell
              *** node scrape-all-organizations.js

          ** Option B: Scrape Specific Organization\*\*
              *** powershell
              *** node scrape-cfr-events.js
              *** node scrape-cisa-events.js
              *** node scrape-insa-events.js

     * Scraper Behavior
          ** 1. Fetches events page from `events\_url`
          ** 2. Parses event data (title, date, time, location, URL)
          ** 3. Checks for duplicates by `source\_id`
          ** 4. Saves new events to `events` collection
          ** 5. Updates `last\_scraped` timestamp on organization

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
          ** 1. Open `event-finder-ui-v7.html` in browser
          ** 2. Refresh the page to load new data from PocketBase
          ** 3. Verify new events appear correctly
          ** 4. Check that dates, locations, and descriptions display properly

---

# PUBLIC UI

     * The public-facing interface (`event-finder-ui-v7.html`) allows users to discover events.

     * Accessing the UI
          ** 1. Open `event-finder-ui-v7.html` in any browser
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
          ** PocketBase Database --> API Request --> event-finder-ui-v7.html --> User sees events

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
              *** `start_date" / `end_date` - For date display
              *** `location` - City, ST format preferred
          ** 5. Click "Save"
          ** 6. Refresh `event-finder-ui-v7.html` to see changes


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
          ** 3. Copy `permission\_request\_draft`
          ** 4. Send email
          ** 5. Update status to `Permission Requested (Self)`

     * Enable Scraping After Approval
          ** 1. Open org in PocketBase
          ** 2. Set `scraping\_enabled` = true
          ** 3. Set status = `Scraping Active`
          ** 4. Run `node scrape-all-organizations.js`
          ** 5. Refresh `event-finder-ui-v7.html` to verify events appear

     * Check Scraping Results
          ** 1. Admin interface → "Events" tab
          ** 2. Filter by organization
          ** 3. Review scraped events
          ** 4. Open `event-finder-ui-v7.html` to verify public display

     * Update an Event"s Public Display
          ** 1. Open PocketBase Admin → `events` collection
          ** 2. Click on the event to edit
          ** 3. Update `description`, `start\_date`, `end\_date`, or `location`
          ** 4. Click "Save"
          ** 5. Refresh `event-finder-ui-v7.html` to see changes


---



# SCRIPTS

     * 
          ** 
               *** 
                    **** 


| Script | Purpose |

|--------|---------|

| `generate-permission-requests.js` | Auto-generate permission request email drafts |

| `add-contacts.js` | Add POC contacts to database |

| `suggest-organizations.js` | AI suggests new organizations |

| `scrape-all-organizations.js` | Master scraper for all enabled orgs |

| `scrape-cfr-events.js` | CFR-specific scraper |

| `scrape-cisa-events.js` | CISA-specific scraper |

| `scrape-insa-events.js` | INSA-specific scraper |

| `enrich-events.js` | AI-tag events with topics |

| `generate-embeddings.js` | Create embeddings for semantic search |

| `cleanup-orphaned-events.js` | Remove events without valid org |

| `cleanup-bad-events.js` | Remove malformed events |

| `base-scraper.js` | Template for new scrapers |

| `proxy-server.js` | Local proxy for CORS issues |

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
          ** event-finder-ui-v7.html 
               *** Public-facing event search UI. 
               *** Users search and filter events here. 
               *** Current production version.
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
          ** proxy-server.js - Local proxy server to handle CORS issues when testing scrapers locally.


---

# GITHUB SECRETS (for GitHub Actions)
     * `POCKETBASE_URL":  PocketBase server URL
     * `POCKETBASE_ADMIN_EMAIL`: Admin login email
     * `POCKETBASE_ADMIN_PASSWORD`: Admin login password
     * `OPENAI_API_KEY`: OpenAI API key 


---


# CURRENT DATABASE STATE 
     * organizations as of 2025-12-07
          ** Status: Mission Approved Pending Permission (18):
               *** American Enterprise Institute (AEI)
               *** Atlantic Council
               *** Belfer Center (Harvard)
               *** Brookings Institution
               *** Center for a New American Security (CNAS)
               *** Center for Strategic and International Studies (CSIS)
               *** Chatham House
               *** Council on Foreign Relations (CFR)
               *** Cyber Threat Alliance
               *** CISA (Cybersecurity and Infrastructure Security Agency)
               *** Hoover Institution
               *** IISS (International Institute for Strategic Studies)
               *** INSA (Intelligence and National Security Alliance)
               *** INSS (Institute for National Security Studies)
               *** New America
               *** Potomac Officers Club
               *** RAND Corporation
               *** Stimson Center

          ** Status: Mission Rejected (3):
               *** National Guard Bureau
               *** National Defense University
               *** National Security Agency

     * contacts 	
          ** Tier 1 - Permissions Contacts:
               *** CFR: permissions@cfr.org
               *** RAND: permissions@rand.org
               *** Brookings: permissions@brookings.edu, events@brookings.edu
               *** CSIS: externalrelations@csis.org
               *** AEI: Jacqueline Derks (Director of Events)

          ** Tier 2 - General Contacts:
               *** INSA: info@insaonline.org
               *** New America: media@newamerica.org
               *** Atlantic Council: press@atlanticcouncil.org
               *** Hoover: heather.campbell@stanford.edu
               *** Chatham House: contact@chathamhouse.org

     * events 
          ** 45 Scraped event data 

     * event_embeddings:  40 AI embeddings for semantic search


---


