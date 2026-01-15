# DOCUMENT NAME:  2026-01-04_Tech_Architecture_and_Approach.md


---


# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 


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


# CHANGE LOG

     * 2026-01-05: Technical Block Feature & TOU Automation
          ** Added tech_block_flag field to organizations collection
          ** Added tou_scanned_date field to organizations collection
          ** Updated admin-interface.html to v9 with:
               *** Technical Block checkbox in TOU Assessment section
               *** "Mark as Technically Blocked" button
               *** Automation: checking TOU Flag or Tech Block auto-sets date, disables scraping, changes status to Rejected
               *** Dashboard stat card showing count of technically blocked orgs
               *** Visual alerts (red danger box) for technically blocked organizations

     * 2026-01-04: Major Admin Interface Update
          ** Migrated to new 6-stage status workflow (from 8-stage)
          ** Added Organization Profile Page with 4 tabs (Overview, Contacts, Status & History, Events)
          ** Added Organizations Tab enhancements (search, filters, phone from contacts)
          ** Added new database fields: permission_type, permission_request_final
          ** Added new contact type: Main Contact
          ** Updated admin-interface.html to v8


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


# ADMIN INTERFACE

     * File: admin-interface.html (v9 as of 2026-01-05)

     * Access: Open locally in browser, requires PocketBase admin login

     * Features:
          ** Header: "Event Finder Admin" - clickable, returns to Dashboard from anywhere
          ** 5 Main Tabs: Dashboard, Org By Status, Organizations, Contacts, Events
          ** Organization Profile Page with 4 sub-tabs

     * Tab: Dashboard
          ** Stats overview: Total Orgs, Events, Nominated (Pending), Live (Scraping), Tech Blocked
          ** Status breakdown by count
          ** Tech Blocked count (organizations with tech_block_flag = true)

     * Tab: Org By Status
          ** Filter dropdown: All, plus 6 status values
          ** Organization cards with status-specific content
          ** Inline status dropdown for quick changes
          ** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events
          ** Status-specific buttons: Approve Mission, Generate Request

     * Tab: Organizations
          ** Quick search by name
          ** Jump to Organization dropdown
          ** Filter by Status dropdown (redirects to Org By Status tab)
          ** Add Organization button (opens blank Profile Page)
          ** Organization cards showing:
               *** TOU warnings/alerts
               *** Org name (links to Profile)
               *** Status badge
               *** Description
               *** Website
               *** Phone (from Main Contact or non-Leadership contact)
               *** Status dropdown (quick change)
               *** Action buttons: Edit Org, Edit Contacts, Edit Status, See Events

     * Tab: Contacts
          ** List of all contacts across organizations
          ** Add Contact button
          ** Edit/Delete buttons per contact

     * Tab: Events
          ** Filter by organization
          ** List of all events with details

     * Organization Profile Page
          ** Accessed by clicking org name or action buttons
          ** Back to List button returns to previous view
          ** 4 Sub-tabs:

          ** Sub-tab: Overview
               *** TOU alerts (if flagged)
               *** Organization Name
               *** Type
               *** Description
               *** Website
               *** Source ID (domain)
               *** Events URL
               *** Status dropdown
               *** Permission Type dropdown
               *** Save Overview button

          ** Sub-tab: Contacts
               *** Org info section (name, status, alerts)
               *** Sort by Last Name / First Name dropdown
               *** Add Contact button
               *** Contact cards with Edit/Delete buttons

          ** Sub-tab: Status & History
               *** General Info: Org name, status, website, AI reasoning
               *** TOU Assessment:
                    **** TOU Scanned Date (auto-set when flags checked)
                    **** TOU Flag checkbox (auto-triggers: set date, disable scraping, set status to Rejected)
                    **** Technical Block checkbox (auto-triggers: set date, check TOU flag, disable scraping, set status to Rejected, auto-fill notes)
                    **** TOU Notes
                    **** Save TOU Info button
                    **** "Mark as Technically Blocked" button (one-click to set all block fields)
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
               *** Scraping Info: Event count, Last scraped, Scraping enabled, Notes
               *** Change Status dropdown

          ** Sub-tab: Events
               *** Org info section (name, status, website, AI reasoning)
               *** Event count badge
               *** List of events from this organization

     * Future Enhancement: API Server for Automated Tasks
          ** Discussed but not implemented
          ** Would enable buttons to trigger: scraping, TOU checks, contact discovery
          ** Requires Express server on Railway with endpoints


---


# STATUS REFERENCE (6-Stage Workflow)

     * Status: Nominated (Pending Mission Review)
          ** Description: AI-suggested or manually added, awaiting review
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Review and approve/reject

     * Status: Mission Approved (Request Not Sent)
          ** Description: Approved for mission, permission request not yet sent
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Add contacts, generate and send permission request

     * Status: Permission Requested (Pending Org Response)
          ** Description: Permission email sent, waiting for response
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: Wait for response (go-live date = sent + 2 weeks)

     * Status: Permission Granted (Not Live)
          ** Description: Permission received (explicit or implied), not yet scraping
          ** Can Edit?: YES
          ** Can Scrape?: YES (when enabled)
          ** Shows in Public UI?: NO (until scraping produces events)
          ** Next Action: Enable scraping, change to Live
          ** Note: permission_type field indicates Explicit or Implied (No Response)

     * Status: Rejected (By Mission or Org)
          ** Description: Does not fit mission OR organization denied permission
          ** Can Edit?: YES
          ** Can Scrape?: NO
          ** Shows in Public UI?: NO
          ** Next Action: None (end state)

     * Status: Live (Scraping Active)
          ** Description: Actively being scraped, events appear in public UI
          ** Can Edit?: YES
          ** Can Scrape?: YES
          ** Shows in Public UI?: YES
          ** Next Action: Monitor and maintain

     * Migration Note (2026-01-04):
          ** Old 8-stage statuses were consolidated to 6 stages
          ** "Mission Rejected" and "Permission Rejected" merged into "Rejected (By Mission or Org)"
          ** "Permission Requested (Self)" and "Permission Requested (Lawyer)" merged into "Permission Requested (Pending Org Response)"
          ** "Permission Granted" renamed to "Permission Granted (Not Live)"
          ** "Scraping Active" renamed to "Live (Scraping Active)"


---


# ORGANIZATION WORKFLOW

     * Organization Discovery: Finding organizations to scrape
          ** Automatic Discovery (AI)
               *** Run `suggest-organizations.js`
               *** AI analyzes existing approved organizations
               *** AI suggests similar organizations in national security space
               *** New orgs saved with status: `Nominated (Pending Mission Review)`

          ** Manual Discovery
               *** Open admin-interface.html
               *** Go to Organizations tab
               *** Click "Add Organization" button
               *** Enter organization details
               *** Status defaults to `Nominated (Pending Mission Review)`
               *** Save

     * Legal Document Review (TOU Check)
          ** When evaluating a new organization, check ALL legal/usage documents for scraping restrictions
          ** Documents to check (look in website footer, "Legal", or "About" sections):
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

          ** If restrictions found:
               *** Set tou_flag = true in Status & History tab
               *** Document specific restrictions in tou_notes field
               *** Note which document contains the restriction
               *** Example: "User Agreement Section 4.2 prohibits automated data collection"

          ** If no restrictions found:
               *** Leave tou_flag = false
               *** Optionally note in tou_notes: "Reviewed TOS, Privacy Policy - no scraping restrictions found"

     * Mission Review
          ** Go to Org By Status tab, filter by "Nominated (Pending Mission Review)"
          ** For each organization:
               *** Review website and mission
               *** Check if fits national security focus
               *** Review TOU flag (⚠️ warning shown if flagged)

     * Decision:
          ** Reject: Use status dropdown to change to `Rejected (By Mission or Org)`
          ** Approve: Click "Approve Mission" button OR change status to `Mission Approved (Request Not Sent)`

     * Permission Management: Getting permission to scrape
          ** For organizations with status `Mission Approved (Request Not Sent)`:

               *** Step 1: Add POC Contacts
                    **** Click "Edit Contacts" button to go to Profile → Contacts tab
                    **** Click "Add Contact" button
                    **** Research contact info from org website
                    **** Contact types (priority order for permission requests):
                         ***** Main Contact: Primary point of contact
                         ***** Legal/Permissions: Best for permission requests
                         ***** Events: Alternative contact
                         ***** Media/PR: Fallback option
                         ***** Leadership: Last resort
                         ***** Other: General inquiries

               *** Step 2: Generate Permission Request
                    **** Click "Edit Status" or "Generate Request" button
                    **** In Status & History tab, click "Generate Draft" button
                    **** Review and edit draft as needed
                    **** Click "Copy Draft" to copy to clipboard
                    **** Send email to appropriate contact

               *** Step 3: After Sending
                    **** Set Permission Requested Date
                    **** Copy final sent text to "Permission Request Final Text" field
                    **** Change status to `Permission Requested (Pending Org Response)`
                    **** Click "Save Permission Info"

          ** For organizations with status `Permission Requested (Pending Org Response)`:
               *** Go-Live Date is automatically calculated (sent + 2 weeks)
               *** If permission granted:
                    **** Paste approval email into Permission Response Text
                    **** Set Permission Response Date
                    **** Set permission_type to "Explicit"
                    **** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)`

               *** If permission rejected:
                    **** Paste rejection into Permission Response Text
                    **** Set Permission Response Date
                    **** Change status to `Rejected (By Mission or Org)`

               *** If no response after 2 weeks:
                    **** Set permission_type to "Implied (No Response)"
                    **** Change status to `Permission Granted (Not Live)` or `Live (Scraping Active)`

          ** For organizations with status `Permission Granted (Not Live)`:
               *** Enable scraping in Status & History tab
               *** Change status to `Live (Scraping Active)`


---


# POCKETBASE COLLECTIONS

     * organizations Collection - Stores all organizations with unified status workflow.

          ** Field Name: name
          ** Field Type: Plain Text
          ** Setting - max length: 255
          ** Setting - nonempty: on
          ** Setting - Presentable: on
          ** Field Purpose: Organization name

          ** Field Name: website 
          ** Field Type: URL 
          ** Setting - Nonempty: off 
          ** Field Purpose: Main website

          ** Field Name: description
          ** Field Type: Plain Text
          ** Setting - max length: 1000
          ** Setting - nonempty: off
          ** Field Purpose: Organization description

          ** Field Name: org_type
          ** Field Type: Plain Text 
          ** Setting - max length: 100
          ** Setting - nonempty: off
          ** Field Purpose: Type: Government, Nonprofit, Think Tank, Academic, Professional Association

          ** Field Name: source_id
          ** Field Type: Plain Text
          ** Setting - max length: 100
          ** Setting - nonempty: off
          ** Field Purpose: Unique domain identifier (e.g., "csis.org")

          ** Field Name: events_url 
          ** Field Type: URL 
          ** Setting - Nonempty: off
          ** Field Purpose: Direct link to events page

          ** Field Name: status
          ** Field Type: Select
          ** Setting - Single/Multiple: Single
          ** Setting - Nonempty: on  
          ** Setting - Presentable: on  
          ** Setting - Values (6 options):
               *** Nominated (Pending Mission Review)
               *** Mission Approved (Request Not Sent)
               *** Permission Requested (Pending Org Response)
               *** Permission Granted (Not Live)
               *** Rejected (By Mission or Org)
               *** Live (Scraping Active)
          ** Field Purpose: Current workflow status

          ** Field Name: permission_type
          ** Field Type: Select
          ** Setting - Single/Multiple: Single
          ** Setting - Nonempty: off
          ** Setting - Values (2 options):
               *** Explicit
               *** Implied (No Response)
          ** Field Purpose: Indicates how permission was obtained
          ** Added: 2026-01-04

          ** Field Name: discovered_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Field Purpose: When AI suggested this org

          ** Field Name: ai_reasoning
          ** Field Type: Plain Text
          ** Setting - max length: 2000
          ** Setting - nonempty: off
          ** Field Purpose: Why AI suggested this org

          ** Field Name: similarity_score 
          ** Field Type: Number 
          ** Setting - Min: 0
          ** Setting - Max: 100
          ** Field Purpose: AI confidence score

          ** Field Name: tou_flag
          ** Field Type: Bool
          ** Setting - Presentable: on
          ** Field Purpose: True if legal documents may prohibit scraping

          ** Field Name: tech_block_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose: True if organization technically blocks automated requests (e.g., 403 Forbidden)
          ** Added: 2026-01-05

          ** Field Name: tou_scanned_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose: Date when TOU/legal documents were reviewed
          ** Added: 2026-01-05

          ** Field Name: tou_notes
          ** Field Type: Plain Text
          ** Setting - max length: 2000
          ** Setting - nonempty: off
          ** Field Purpose: Notes about legal documents reviewed and restrictions found

          ** Field Name: permission_requested_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Field Purpose: When permission request was sent

          ** Field Name: permission_response_date
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Field Purpose: When response was received

          ** Field Name: permission_request_draft
          ** Field Type: Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Field Purpose: Working draft of permission request email

          ** Field Name: permission_request_final
          ** Field Type: Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Field Purpose: Final version of permission request that was sent
          ** Added: 2026-01-04

          ** Field Name: permission_correspondence
          ** Field Type: Plain Text
          ** Setting - max length: 5000
          ** Setting - nonempty: off
          ** Field Purpose: Organization's response / correspondence

          ** Field Name: permission_document 
          ** Field Type: File
          ** Setting - Single/multiple: Single
          ** Setting - Max file size: 10485760
          ** Field Purpose: Uploaded permission document (if any)

          ** Field Name: scraping_enabled
          ** Field Type: Bool
          ** Field Purpose: Whether scraper should run

          ** Field Name: last_scraped
          ** Field Type: DateTime
          ** Setting - Nonempty: off  
          ** Field Purpose: Last successful scrape timestamp

          ** Field Name: notes
          ** Field Type: Plain Text
          ** Setting - nonempty: off
          ** Field Purpose: Admin/scraping notes


     * contacts Collection - Stores contact information for organizations.

          ** Field Name: organization
          ** Field Type: Relation
          ** Setting - Collection: organizations
          ** Setting - Single/Multiple: Single
          ** Setting - Nonempty: on
          ** Field Purpose: Links contact to organization

          ** Field Name: name
          ** Field Type: Plain Text
          ** Setting - max length: 255
          ** Setting - nonempty: on
          ** Field Purpose: Contact's full name

          ** Field Name: title
          ** Field Type: Plain Text
          ** Setting - max length: 255
          ** Setting - nonempty: off
          ** Field Purpose: Contact's job title/position

          ** Field Name: email
          ** Field Type: Email
          ** Setting - nonempty: off
          ** Field Purpose: Contact's email address

          ** Field Name: phone
          ** Field Type: Plain Text
          ** Setting - max length: 50
          ** Setting - nonempty: off
          ** Field Purpose: Contact's phone number

          ** Field Name: contact_type
          ** Field Type: Select
          ** Setting - Single/Multiple: Single
          ** Setting - Nonempty: off
          ** Setting - Values (6 options):
               *** Main Contact
               *** Leadership
               *** Events
               *** Legal/Permissions
               *** Media/PR
               *** Other
          ** Field Purpose: Type of contact for prioritization
          ** Updated: 2026-01-04 (added Main Contact)

          ** Field Name: source_url
          ** Field Type: URL
          ** Setting - nonempty: off
          ** Field Purpose: Where contact info was found

          ** Field Name: notes
          ** Field Type: Plain Text
          ** Setting - nonempty: off
          ** Field Purpose: Notes about contact

          ** Field Name: last_verified
          ** Field Type: DateTime
          ** Setting - Nonempty: off
          ** Field Purpose: When contact info was last verified


---


[REMAINDER OF DOCUMENT UNCHANGED - includes IMAGE GENERATION, TECH STACK, VERCEL, PUBLIC UI, EVENT SCRAPING, events collection, settings collection, topic_icons collection sections]


