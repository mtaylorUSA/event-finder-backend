# Admin Interface UI Requirements

# Document Updated: 2026-01-04


---


# Implementation Status Summary

     * ✅ Implemented (v8)
     * 🔄 Partial (some features working)
     * ⏳ Pending (not yet built)


---


# Header

     * ✅ Page Header "Event Finder Admin" is a clickable link back to Dashboard
     * ✅ Works from any tab or profile page


---


# Dashboard

     * ✅ Stats tiles: Total Orgs, Events, Nominated (Pending), Live (Scraping)
     * ✅ Status overview breakdown
     * ⏳ Tiles as links to filtered views (future enhancement)


---


# Tab: Organization By Status

     * ✅ Defaults to list of all organizations, sorted alphabetically
          ** ✅ Ignores "The" in organization name when sorting

     * ✅ Filter dropdown with options:
          ** ✅ All Organizations
          ** ✅ Nominated (Pending Mission Review)
          ** ✅ Mission Approved (Request Not Sent)
          ** ✅ Permission Requested (Pending Org Response)
          ** ✅ Permission Granted (Not Live)
          ** ✅ Rejected (By Mission or Org)
          ** ✅ Live (Scraping Active)


---


# Organization Cards in Org By Status Tab

     * ✅ All Organizations List displays:
          ** ✅ TOU Warnings/Alerts (yellow box if flagged)
          ** ✅ Organization Name (links to Profile Page)
          ** ✅ Current Status (badge)
          ** ✅ Org Description (truncated)
          ** ✅ Website (hyperlink)
          ** ✅ Status Dropdown (inline, allows quick change)
          ** ✅ Button: Edit Org → Profile/Overview
          ** ✅ Button: Edit Contacts → Profile/Contacts
          ** ✅ Button: Edit Status → Profile/Status & History
          ** ✅ Button: See Events → Profile/Events

     * ✅ Nominated (Pending Mission Review) List adds:
          ** ✅ AI Reasoning field
          ** ✅ "Approve Mission" button (red, changes status)

     * ✅ Mission Approved (Request Not Sent) List adds:
          ** ✅ Request sent date (if set)
          ** ✅ "Generate Request" button (red, links to Status & History)

     * ✅ Permission Requested (Pending Org Response) List adds:
          ** ✅ Request sent date
          ** ✅ Go Live Date (sent + 2 weeks, auto-calculated)

     * ✅ Permission Granted (Not Live) List adds:
          ** ✅ Permission Type badge (Explicit or Implied)

     * ✅ Rejected (By Mission or Org) List adds:
          ** ✅ POCs list (name, title, email, phone)

     * ✅ Live (Scraping Active) List adds:
          ** ✅ Event count
          ** ✅ Last scraped timestamp


---


# Tab: Organizations

     * ✅ Org List Parameters:
          ** ✅ Defaults to all organizations, sorted alphabetically (ignores "The")
          ** ✅ Quick Search by name (real-time filtering)
          ** ✅ Drop Down to jump to Organization by name
          ** ✅ Drop Down to filter by status (redirects to Org By Status tab)
          ** ✅ Button: Add Organization (opens blank Profile Page)

     * ✅ Organization Entries display:
          ** ✅ TOU Warnings/Alerts
          ** ✅ Org Name (links to Profile Page)
          ** ✅ Current Status (badge)
          ** ✅ Org Description
          ** ✅ Website (hyperlink)
          ** ✅ Org Main Phone Number (from Main Contact or non-Leadership contact)
          ** ✅ Status Dropdown (inline, allows quick change)
          ** ✅ Button: Edit Org → Profile/Overview
          ** ✅ Button: Edit Contacts → Profile/Contacts
          ** ✅ Button: Edit Status → Profile/Status & History
          ** ✅ Button: See Events → Profile/Events


---


# Org Profile Page

     * ✅ Each organization has its own page with 4 Tabs
     * ✅ Header shows: Org Name, Current Status, Back to List button

     * ✅ Overview Tab:
          ** ✅ TOU Warnings/Alerts
          ** ✅ Org Name (editable)
          ** ✅ Type (editable)
          ** ✅ Org Description (editable)
          ** ✅ Website (editable)
          ** ✅ Source ID/domain (editable)
          ** ✅ Events URL (editable)
          ** ✅ Status Dropdown
          ** ✅ Permission Type Dropdown
          ** ✅ Save Overview button

     * ✅ Contacts Tab:
          ** ✅ Org Section: TOU alerts, Org Name, Status
          ** ✅ Sort dropdown: Last Name / First Name
          ** ✅ Add Contact button
          ** ✅ Contact cards with:
               *** ✅ Contact Name
               *** ✅ Contact Type badge
               *** ✅ Role/Position
               *** ✅ Email (with mailto link)
               *** ✅ Phone
               *** ✅ Notes
               *** ✅ Edit Contact button
               *** ✅ Delete Contact button

     * ✅ Status and History Tab:
          ** ✅ General Info Section:
               *** ✅ TOU Warnings/Alerts
               *** ✅ Org Name
               *** ✅ Status (badge)
               *** ✅ Website (hyperlink)
               *** ✅ AI Reasoning

          ** ✅ TOU Assessment Section:
               *** ✅ TOU Scanned Date
               *** ✅ TOU Flag checkbox
               *** ✅ TOU Notes
               *** ✅ Save TOU Info button

          ** ✅ Permission Request Section:
               *** ✅ Permission Requested Date
               *** ✅ Go-Live Date (auto-calculated: sent + 2 weeks)
               *** ✅ Permission Request Draft Text (editable)
               *** ✅ Button: Generate Draft
               *** ✅ Button: Copy Draft
               *** ✅ Button: Preview
               *** ✅ Permission Request Final Text (editable)
               *** ✅ Button: Copy Final
               *** ✅ Button: Preview
               *** ✅ Permission Response Date
               *** ✅ Permission Response Text (editable)
               *** ✅ Save Permission Info button

          ** ✅ Scraping Info Section:
               *** ✅ Events Scraped (auto from database)
               *** ✅ Last Scraped (auto from database)
               *** ✅ Scraping Enabled checkbox
               *** ✅ Scraping Notes
               *** ✅ Save Scraping Info button

          ** ✅ Change Status Section:
               *** ✅ Status Dropdown (full-width)

     * ✅ Events Tab:
          ** ✅ Org Info Section: TOU alerts, Org Name, Status, Website, AI Reasoning
          ** ✅ Event count badge
          ** ✅ Event cards with: Title, Date, Location, Type, Link to event


---


# Tab: Contacts (All Contacts)

     * ✅ List of all contacts across all organizations
     * ✅ Add Contact button
     * ✅ Contact cards display:
          ** ✅ Contact Name
          ** ✅ Contact Type badge
          ** ✅ Organization name
          ** ✅ Title
          ** ✅ Email (with mailto link)
          ** ✅ Phone
          ** ✅ Edit button
          ** ✅ Delete button

     * ⏳ Sorting options (future enhancement)
     * ⏳ Filtering by organization (future enhancement)


---


# Tab: Events (All Events)

     * ✅ Filter by Organization dropdown
     * ✅ Event cards display:
          ** ✅ Event Title
          ** ✅ Organization name
          ** ✅ Date
          ** ✅ Location
          ** ✅ Link to event

     * ⏳ Quick Search by name (future enhancement)
     * ⏳ Filter by Start date (future enhancement)
     * ⏳ Filter by Topic/Region (future enhancement)
     * ⏳ Add Event button (future enhancement)


---


# Contact Type Values

     * ✅ Main Contact (NEW - added 2026-01-04)
     * ✅ Leadership
     * ✅ Events
     * ✅ Legal/Permissions
     * ✅ Media/PR
     * ✅ Other


---


# Phone Number Display Logic (Organizations Tab)

     * ✅ First: Look for contact with contact_type = "Main Contact" that has phone
     * ✅ Fallback: Any contact that is NOT "Leadership" that has phone
     * ✅ If none found: Display "No phone"


---


# Future Enhancements (Not Yet Implemented)

     * ⏳ API Server for Automated Tasks
          ** Would enable buttons to trigger backend scripts
          ** Potential endpoints:
               *** /api/scrape - Run scraper for organization
               *** /api/check-tou - Scan org website for TOU restrictions
               *** /api/find-contacts - Auto-discover POC contacts
          ** Requires Express server on Railway

     * ⏳ Dashboard tiles as clickable links to filtered views

     * ⏳ Contacts Tab sorting and filtering

     * ⏳ Events Tab search, advanced filters, Add Event

     * ⏳ Individual Contact Profile Page


---


# Status Values (6-Stage Workflow)

     * Nominated (Pending Mission Review)
     * Mission Approved (Request Not Sent)
     * Permission Requested (Pending Org Response)
     * Permission Granted (Not Live)
     * Rejected (By Mission or Org)
     * Live (Scraping Active)


---


