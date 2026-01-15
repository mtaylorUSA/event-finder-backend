2025-12-07-1809 Tech Architecture and Approach.md

Last Updated: 2025-12-06



Use this document to bring a new Claude session up to speed on the project.



---



**## Project Overview**



&nbsp;	\* Event Finder aggregates public events from national security, defense, and intelligence community organizations into a single searchable database.



&nbsp;	\* Project Phases:

&nbsp;		\*\* Phase 1: Personal Tool

&nbsp;			Status:\*\* All scrapers disabled awaiting permissions



---



**## Tech Stack**

&nbsp;	\* Vercel: Host the Next.js web app + serverless/edge functions



&nbsp;	\* PocketBase: 

&nbsp;		#### Lightweight backend (auth, DB, file storage, realtime).
		#### Self‑host on Railway

	**\* PocketBase Admin URL -** https://event-discovery-backend-production.up.railway.app/\\\_/



&nbsp;	\* GitHub: Repo + CI integration with Vercel/Railway



&nbsp;	\* Railway: Host PocketBase 



&nbsp;	\* Bitwarden: Store API keys/secrets



&nbsp;	\* My system (local Dev): 

&nbsp;		\*\* HP Envy x360;  

&nbsp;		\*\* Windows 11 Personal;  

&nbsp;		\*\* Microsoft Office 365;  

&nbsp;		\*\* Powershell



&nbsp;	\* My folder paths: 

&nbsp;		\*\* OneDrive - C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder

&nbsp;		\*\* Local Machine - C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL

&nbsp;		\*\* .env - C:\\\\LOCAL FILES\\\\AI Stuff - LOCAL\\\\Event Finder - LOCAL\\\\.env

&nbsp;		\*\* Documentation- `...\\\\Event Finder\\\\Documentation\\\\Prompts\\\\` |



&nbsp;	\* Email with customers (TBD): Resend (easy on Vercel) or Mailgun/SendGrid (free tiers exist)



&nbsp;	\* Payments (TBD): Lemon Squeezy or Stripe (subscriptions)



&nbsp;	\* AI Features | OpenAI API | text-embedding-3-small, gpt-4o-mini



&nbsp;	\* Scripts | Node.js | Local + GitHub



&nbsp;	\* Version Control | Git + GitHub | github.com/mtaylorUSA/event-finder-backend



&nbsp;	\* Admin Interface | admin-interface.html | Local file



&nbsp;	\* Public UI | event-finder-ui-v7.html | Local file 



---



**## Documentation Files**
	\* `PocketBase-UI-Reference.md` | How to use PocketBase admin interface

&nbsp;	\* `PocketBase-Schema.md` | Current database schema and field details 

&nbsp;	\* `Running-Scripts.md` | How to execute scripts (Method A \\\& B) 

&nbsp;	\* `Event-Finder-Context.md` | This file - project overview for Claude 

&nbsp;	\* `Workflow.md` | Detailed workflow documentation 


---



**## Public UI Features (v7)**

&nbsp;	\* Header

&nbsp;		\*\* Event Finder logo/title (click to clear filters and go home)

&nbsp;		\*\* Search bar beside logo (searches title and description only)



&nbsp;	\* Sidebar Filters

&nbsp;		\*\* Event Format:\*\* Virtual / In-Person checkboxes

&nbsp;		\*\* Location filter:\*\* Appears when In-Person is checked (within X miles of ZIP)

&nbsp;		\*\* Date Range:\*\* Start date (defaults to today), End date (optional)

&nbsp;		\*\* View Results\*\* button (🔍)

&nbsp;		\*\* More Filters\*\* button (Topics, Regions, Organizations)

&nbsp;		\*\* Clear Filters\*\* button (🚫)



&nbsp;	\* Event Cards Display

&nbsp;		\*\* Title:\*\* Event name

&nbsp;		\*\* Description:\*\* 2 lines max, pulled from database

&nbsp;		\*\* Dates:\*\* Full month format (e.g., "December 18, 2025" or "December 9-10, 2025")

&nbsp;		\*\* Organization:\*\* Linked to org website

&nbsp;		\*\* Location:\*\* City, ST format (extracts from title if location field is bad)

&nbsp;		\*\* Link:\*\* "More details and registration" (links to event page)



&nbsp;	\* Search Behavior

 		\*\* Searches \*\*title and description only\*\* (not org name, topics, regions, location)

 		\*\* Short terms (3 chars or less like "AI") use word boundary matching to avoid false positives

 		\*\* Multi-word searches use \*\*OR logic\*\* (any word can match)

&nbsp;  		\*\* Example: "AI Cyber" returns events matching "AI" OR "Cyber"



&nbsp;	\* Date Display Logic

&nbsp;		| Scenario | Format |

&nbsp;		|----------|--------|

&nbsp;		| Single day | December 18, 2025 |

&nbsp;		| Multi-day, same month | December 9-10, 2025 |

&nbsp;		| Multi-day, different months | December 30, 2025 to January 2, 2026 |

&nbsp;		| Multi-day, different years | December 30, 2025 to January 2, 2026 |



	\* Views

 		\*\* "List View:" Event cards (default)

 		\*\* "Calendar View:" Monthly calendar with events



---



**## Organization Workflow**



&nbsp;	\* "Organization Discovery" - Finding organizations to scrape



&nbsp;		\*\* Automatic Discovery (AI)

&nbsp;	 		\*\*\* Run `suggest-organizations.js`

 			\*\*\* AI analyzes existing approved organizations

 			\*\*\* AI suggests similar organizations in national security space

 			\*\*\* New orgs saved with status = `Pending Mission Review`



&nbsp;		\*\* Manual Discovery

 			\*\*\* Open PocketBase Admin or `admin-interface.html`

  			\*\*\* click "Add Organization"

 			\*\*\* Enter organization details

 			\*\*\* Set status = `Pending Mission Review`

 			\*\*\* Save





 	\* Mission Review

 		\*\* Open "Pending Review" tab in admin interface

  		\*\* For each organization:

  			\*\*\* Review website and mission

 			\*\*\* Check if fits national security focus

 			\*\*\* Check TOU flag (⚠️) if present



&nbsp;	\* Decision:

&nbsp;	 	\*\* ❌ "Reject": Status → `Mission Rejected` - Does not fit project mission	

&nbsp;		\*\* ✅ "Approve": Status → `Mission Approved Pending Permission` - Fits mission, needs permission

   	



&nbsp;	\* Permission Management	- Getting legal permission to scrape



&nbsp;		\*\* `Mission Approved Pending Permission`

&nbsp;	 		\*\*\* Add POC Contacts

 				For each approved organization:

&nbsp;	 			1. Research POC contact info:

   					- Check website footer, "Contact Us" page

   					- Look for permissions@, legal@, events@ emails

   					- Find staff directory for relevant contacts

 				2. Add contact via admin interface or `add-contacts.js`

 

 				3. Contact types:

   					- `Legal/Permissions` - Best for permission requests

   					- `Events` - Alternative contact

   					- `Media/PR` - Fallback option

   					- `Leadership` - Last resort

   					- `Other` - General inquiries



&nbsp;			\*\*\* Generate Permission Request Drafts

&nbsp;				1. Run `generate-permission-requests.js`

&nbsp;				2. Script automatically:

   					- Pulls your info from `settings` collection

   					- Finds best contact for each org (Legal/Permissions > Events > Other)

   					- Generates customized email draft

   					- Saves to `permission\\\\\\\\\\\\\\\_request\\\\\\\\\\\\\\\_draft` field



&nbsp;			\*\*\* Review and Send Permission Requests

&nbsp;				1. Open PocketBase Admin

&nbsp;				2. Go to organizations collection

&nbsp;				3. Filter by status = `Mission Approved Pending Permission`

&nbsp;				4. For each organization:

&nbsp;					- Open record

&nbsp;					- Review `permission\\\\\\\\\\\\\\\_request\\\\\\\\\\\\\\\_draft` field

&nbsp;					- Copy draft to email client

&nbsp;					- Edit if needed

&nbsp;					- Send email



&nbsp;			\*\*\* After sending:

&nbsp;				1. Update status 

&nbsp;					- `Permission Requested (Self)` - Owner sent email.  or 

&nbsp;					`Permission Requested (Lawyer)`  - Lawyer sent email

   				- Set `permission\\\\\\\\\\\\\\\_requested\\\\\\\\\\\\\\\_date` to today





&nbsp;		\*\* `Permission Granted` - Ready to enable scraping

&nbsp;			\*\*\*If Permission Granted:

&nbsp;				1. Paste approval email into `permission\\\\\\\_correspondence` field

&nbsp;				2. Update status → `Permission Granted`

&nbsp;				3. Set `permission\\\\\\\_response\\\\\\\_date` to today

&nbsp;				4. Set `scraping\\\\\\\_enabled` = true

&nbsp;				5. Update status → `Scraping Active`



&nbsp;		\*\* `Permission Rejected` - Organization denied permission

&nbsp;			\*\*\* If Permission Rejected:

&nbsp;				1. Paste rejection email into `permission\\\\\\\_correspondence` field

&nbsp;				2. Update status → `Permission Rejected`

&nbsp;				3. Set `permission\\\\\\\_response\\\\\\\_date` to today



&nbsp;		\*\* If No Response (after 2 weeks):

&nbsp;			1. Send follow-up email

&nbsp;			2. Add note to `permission\\\\\\\_correspondence` field



&nbsp;		\*\* `Scraping Active` - Currently being scraped



**## Status Reference**



 		| Status | Can Edit? | Can Scrape? | Shows in UI? | Next Action |

 		|--------|-----------|-------------|--------------|-------------|

 		| Pending Mission Review | Yes | No | No | Review and approve/reject |

 		| Mission Approved Pending Permission | Yes | No | No | Send permission request |

 		| Mission Rejected | Yes | No | No | None (end state) |

 		| Permission Requested (Self) | Yes | No | No | Wait for response |

 		| Permission Requested (Lawyer) | Yes | No | No | Wait for response |

 		| Permission Granted | Yes | Yes | Yes\* | Enable scraping |

 		| Permission Rejected | Yes | No | No | None (end state) |

 		| Scraping Active | Yes | Yes | Yes | Monitor and maintain |



 	\* Events from approved organizations appear in the public UI after scraping.





---

**## Event Scraping**



&nbsp;	\* Enable Scraping



&nbsp;		\*\* Prerequisites:

&nbsp;			\*\*\* Status = `Permission Granted` or `Scraping Active`

&nbsp;			\*\*\* `scraping\_enabled` = true

&nbsp;			\*\*\* `events\_url` is set



&nbsp;	\* Run Scrapers



&nbsp;		\*\*Option A: Scrape All Enabled Organizations\*\*

&nbsp;		```powershell

&nbsp;		node scrape-all-organizations.js

&nbsp;		```



&nbsp;		\*\*Option B: Scrape Specific Organization\*\*

&nbsp;		```powershell

&nbsp;		node scrape-cfr-events.js

&nbsp;		node scrape-cisa-events.js

&nbsp;		node scrape-insa-events.js

&nbsp;		```



&nbsp;	\* Scraper Behavior

&nbsp;		1. Fetches events page from `events\_url`

&nbsp;		2. Parses event data (title, date, time, location, URL)

&nbsp;		3. Checks for duplicates by `source\_id`

&nbsp;		4. Saves new events to `events` collection

&nbsp;		5. Updates `last\_scraped` timestamp on organization



&nbsp;	\* Enrich Events (Optional)

&nbsp;		\*\* After scraping, run AI enrichment:

&nbsp;			```powershell

&nbsp;			node enrich-events.js

&nbsp;			```



&nbsp;		\*\* This adds:

&nbsp;			- Topic tags

&nbsp;			- Event type classification

&nbsp;			- Speaker extraction



&nbsp;	\* Generate Embeddings (Optional)



&nbsp;		\*\* For semantic search:

&nbsp;			```powershell

&nbsp;			node generate-embeddings.js

&nbsp;			```

&nbsp;			This creates vector embeddings for event search.



&nbsp;	\* After Scraping: Verify in Public UI

&nbsp;		1. Open `event-finder-ui-v7.html` in browser

&nbsp;		2. Refresh the page to load new data from PocketBase

&nbsp;		3. Verify new events appear correctly

&nbsp;		4. Check that dates, locations, and descriptions display properly



---



**## Public UI**

&nbsp;	\* The public-facing interface (`event-finder-ui-v7.html`) allows users to discover events.



&nbsp;	\* Accessing the UI



&nbsp;		1. Open `event-finder-ui-v7.html` in any browser

&nbsp;		2. UI automatically fetches data from PocketBase API

&nbsp;		3. No login required for viewing events



&nbsp;	\* UI Features



&nbsp;		\*\* Search:  Searches event title and description only 

&nbsp;		\*\* Date Filter: Start date defaults to today; end date optional

&nbsp;		\*\* Format Filter: Virtual / In-Person checkboxes 

&nbsp;		\*\* More Filters: Topics, Regions, Organizations

&nbsp;		\*\* List View: Event cards with details

&nbsp;		\*\* Calendar View: Monthly calendar display



&nbsp;	\* How Data Flows to the UI



&nbsp;		\*\* PocketBase Database --> API Request --> event-finder-ui-v7.html --> User sees events



&nbsp;	\* What Users See on Event Cards

&nbsp;		\*\* Title: Event name 

&nbsp;		\*\* Description: 2 lines max 

&nbsp;		\*\* Dates: Full month format (e.g., "December 18, 2025") 

&nbsp;		\*\* Organization: Name with link to website

&nbsp;		\*\* Location: City, ST or "Virtual" or "Hybrid" 

&nbsp;		\*\* Link:  "More details and registration"



&nbsp;	\* Date Display Formats



&nbsp;		| Scenario | Display |

&nbsp;		|----------|---------|

&nbsp;		| Single day | December 18, 2025 |

&nbsp;		| Multi-day, same month | December 9-10, 2025 |

&nbsp;		| Different months | December 30, 2025 to January 2, 2026 |



&nbsp;	\* Search Behavior

&nbsp;		- Searches \*\*title\*\* and \*\*description\*\* only

&nbsp;		- Does NOT search organization name, topics, or location

&nbsp;		- Short terms (≤3 chars like "AI") use word boundary matching

&nbsp;		- Multi-word searches use \*\*OR logic\*\* (any word can match)

&nbsp;			- Example: "AI Cyber" returns events matching "AI" OR "Cyber"



&nbsp;	\* Updating Event Data for the UI:  To update how an event appears in the public UI:

&nbsp;		1. Open PocketBase Admin

&nbsp;		2. Click on `events` collection

&nbsp;		3. Find and click on the event

&nbsp;		4. Update fields:

&nbsp;			- `description` - What users see (2 lines max)

&nbsp;			- `start\_date` / `end\_date` - For date display

&nbsp;			- `location` - City, ST format preferred

&nbsp;		5. Click "Save"

&nbsp;		6. Refresh `event-finder-ui-v7.html` to see changes



---



**## Maintenance Tasks**

&nbsp;	\* Cleanup Orphaned Events

&nbsp;	\* Remove events whose organization was deleted:

&nbsp;		```powershell node cleanup-orphaned-events.js



&nbsp;	\* Cleanup Bad Events

&nbsp;		Remove events with missing required fields:

&nbsp;			```powershell node cleanup-bad-events.js

---





---



**## Quick Reference: Common Tasks**

&nbsp;	\* Add a New Organization

&nbsp;		1. Admin interface → "Add Organization"

&nbsp;		2. Fill in details, set status = `Pending Mission Review`

&nbsp;		3. Save



&nbsp;	\* Approve an Organization

&nbsp;		1. Admin interface → "Pending Review" tab

&nbsp;		2. Click "✅ Approve Mission"

&nbsp;		3. Status changes to `Mission Approved Pending Permission`



\### Send Permission Request

&nbsp;		1. Run `generate-permission-requests.js`

&nbsp;		2. Open org in PocketBase

&nbsp;		3. Copy `permission\_request\_draft`

&nbsp;		4. Send email

&nbsp;		5. Update status to `Permission Requested (Self)`



\### Enable Scraping After Approval

&nbsp;		1. Open org in PocketBase

&nbsp;		2. Set `scraping\_enabled` = true

&nbsp;		3. Set status = `Scraping Active`

&nbsp;		4. Run `node scrape-all-organizations.js`

&nbsp;		5. Refresh `event-finder-ui-v7.html` to verify events appear



\### Check Scraping Results

&nbsp;		1. Admin interface → "Events" tab

&nbsp;		2. Filter by organization

&nbsp;		3. Review scraped events

&nbsp;		4. Open `event-finder-ui-v7.html` to verify public display



\### Update an Event's Public Display

&nbsp;		1. Open PocketBase Admin → `events` collection

&nbsp;		2. Click on the event to edit

&nbsp;		3. Update `description`, `start\_date`, `end\_date`, or `location`

&nbsp;		4. Click "Save"

&nbsp;		5. Refresh `event-finder-ui-v7.html` to see changes



---



\## Workflow Diagram



```

┌──────────────────────────────────────────────────────────────────────────┐

│                                                                          │

│   ┌─────────────┐     ┌─────────────────────┐     ┌─────────────────┐   │

│   │ AI Suggests │────▶│ Pending Mission     │────▶│ Mission         │   │

│   │ Organization│     │ Review              │     │ Rejected        │   │

│   └─────────────┘     └──────────┬──────────┘     └─────────────────┘   │

│                                  │                                       │

│                                  ▼                                       │

│                       ┌─────────────────────┐                           │

│                       │ Mission Approved    │                           │

│                       │ Pending Permission  │                           │

│                       └──────────┬──────────┘                           │

│                                  │                                       │

│                                  ▼                                       │

│                       ┌─────────────────────┐     ┌─────────────────┐   │

│                       │ Permission          │────▶│ Permission      │   │

│                       │ Requested           │     │ Rejected        │   │

│                       └──────────┬──────────┘     └─────────────────┘   │

│                                  │                                       │

│                                  ▼                                       │

│                       ┌─────────────────────┐                           │

│                       │ Permission          │                           │

│                       │ Granted             │                           │

│                       └──────────┬──────────┘                           │

│                                  │                                       │

│                                  ▼                                       │

│                       ┌─────────────────────┐                           │

│                       │ Scraping            │◀──┐                       │

│                       │ Active              │───┘ (recurring)           │

│                       └──────────┬──────────┘                           │

│                                  │                                       │

│                                  ▼                                       │

│                       ┌─────────────────────┐                           │

│                       │ Public UI           │                           │

│                       │ (event-finder-ui-v7)│                           │

│                       └─────────────────────┘                           │

│                                                                          │

└──────────────────────────────────────────────────────────────────────────┘

```



---





---



**## Scripts**



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



**## Key Files**



| File | Purpose |

|------|---------|

| `admin-interface.html` | Admin UI for managing orgs, contacts, events |

| `event-finder-ui-v7.html` | Public-facing event search UI |

| `.env` | Environment variables (LOCAL DRIVE ONLY) |

| `package.json` | Node.js dependencies |



---



**## GitHub Secrets (for GitHub Actions)**



| Secret Name | Purpose |

|-------------|---------|

| `POCKETBASE\_URL` | PocketBase server URL |

| `POCKETBASE\_ADMIN\_EMAIL` | Admin login email |

| `POCKETBASE\_ADMIN\_PASSWORD` | Admin login password |

| `OPENAI\_API\_KEY` | OpenAI API key |



---



**## Current Database State**

&nbsp;	\* organizations **as of 2025-12-07**

&nbsp;		\*\*Status: Mission Approved Pending Permission (18):

&nbsp;			- American Enterprise Institute (AEI)

&nbsp;			- Atlantic Council

&nbsp;			- Belfer Center (Harvard)

&nbsp;			- Brookings Institution

&nbsp;			- Center for a New American Security (CNAS)

&nbsp;			- Center for Strategic and International Studies (CSIS)

&nbsp;			- Chatham House

&nbsp;			- Council on Foreign Relations (CFR)

&nbsp;			- Cyber Threat Alliance

&nbsp;			- CISA (Cybersecurity and Infrastructure Security Agency)

&nbsp;			- Hoover Institution

&nbsp;			- IISS (International Institute for Strategic Studies)

&nbsp;			- INSA (Intelligence and National Security Alliance)

&nbsp;			- INSS (Institute for National Security Studies)

&nbsp;			- New America

&nbsp;			- Potomac Officers Club

&nbsp;			- RAND Corporation

&nbsp;			- Stimson Center



&nbsp;		\*\*Status: Mission Rejected (3):

&nbsp;			- National Guard Bureau

&nbsp;			- National Defense University

&nbsp;			- National Security Agency



&nbsp;	\* contacts 	

&nbsp;		\*\* Tier 1 - Permissions Contacts:\*\*

&nbsp;			- CFR: permissions@cfr.org

&nbsp;			- RAND: permissions@rand.org

&nbsp;			- Brookings: permissions@brookings.edu, events@brookings.edu

&nbsp;			- CSIS: externalrelations@csis.org

&nbsp;			- AEI: Jacqueline Derks (Director of Events)



&nbsp;		\*\*Tier 2 - General Contacts:\*\*

&nbsp;			- INSA: info@insaonline.org

&nbsp;			- New America: media@newamerica.org

&nbsp;			- Atlantic Council: press@atlanticcouncil.org

&nbsp;			- Hoover: heather.campbell@stanford.edu

&nbsp;			- Chatham House: contact@chathamhouse.org



&nbsp;	\* events 

&nbsp;		- 45 Scraped event data |

 

 	\* event\_embeddings | 40 | AI embeddings for semantic search |



---





