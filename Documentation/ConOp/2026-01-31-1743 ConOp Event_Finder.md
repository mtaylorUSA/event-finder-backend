@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# CONOP UPDATE - CONTACT GATHERING CONSOLIDATION (2026-01-31)
# Add/replace these sections in the ConOp document
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

-----

# SCRIPTS - UPDATE THE contact-discovery.js ENTRY:

          ** contact-discovery.js (DEPRECATED 2026-01-31)
               *** Status: DEPRECATED - Functionality merged into org-scanner.js
               *** Was: Google Search API contact discovery for permission outreach
               *** Now: Use org-scanner.js instead, which searches all 5 contact categories
               *** Keep file for reference but do not run
               *** Run: (deprecated) - use org-scanner.js instead

-----

# SCRIPTS - UPDATE THE org-scanner.js ENTRY:

          ** org-scanner.js 
               *** UPDATED 2026-01-31: Now handles ALL contact discovery (deprecates contact-discovery.js)
               *** Core scanning module for policy docs, tech blocks, JS rendering, events URL, POC, AI analysis
               *** NEW: Searches 5 contact categories: Legal/Permissions, Events, Media/PR, Leadership, General
               *** NEW: Smart skip logic - skips re-scans if org already has Legal or Events contact
               *** NEW: forceAggressive option for ad-hoc deep contact gathering
               *** NEW: Google query tracking (resetGoogleQueryCount, getGoogleQueryCount)
               *** Functions: scanOrganization(), gatherPOC(), gatherPOCViaGoogleSearch(), etc.
               *** Run: node scrapers/org-scanner.js (via scan-and-scrape-all-live-orgs.js)

-----

# SESSION HANDOFFS - CONTACT DISCOVERY AND ENHANCEMENT - REPLACE WITH:

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SESSION HANDOFFS - CONTACT DISCOVERY AND ENHANCEMENT

     * QUICK START PROMPT:
          ** "I'm working on Event Finder contact discovery. Please read ConOp sections: ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT and SCANNING - ORG-SCANNER DETAILS. Contact gathering is now unified in org-scanner.js. [Describe your specific task]"

-----

     * FILES TO UPLOAD:
          ** ✅ ConOp (this document)
          ** ✅ scrapers/org-scanner.js (has ALL contact gathering logic)
          ** ✅ scrapers/fix-orphan-contacts.js (domain matching)
          ** ⚪ admin-interface-v22.html (for Contacts tab reference)
          ** ❌ scrapers/contact-discovery.js (DEPRECATED - do not upload)

-----

     * ConOp Sections to Emphasize:
          ** ORGANIZATION WORKFLOW 8: CONTACT ENHANCEMENT
          ** SCANNING - ORG-SCANNER DETAILS
          ** POCKETBASE COLLECTIONS - contacts Collection

-----

     * MAJOR UPDATE (2026-01-31): Unified Contact Gathering
          ** org-scanner.js now handles ALL contact discovery
          ** contact-discovery.js is DEPRECATED (functionality merged)
          ** Searches 5 contact categories: Legal/Permissions, Events, Media/PR, Leadership, General
          ** Smart skip logic: Skips re-scans if org already has Legal or Events contact
          ** forceAggressive option: For ad-hoc deep contact gathering
          ** Google query tracking for quota awareness

-----

     * Contact Gathering Architecture (UPDATED 2026-01-31):

          ** ALL via org-scanner.js:
               *** gatherPOC(html, baseUrl, options) - Main function with skip logic
               *** gatherPOCViaGoogleSearch(orgName, domain, options) - Searches all 5 categories
               *** gatherPOCDirectFetch(html, baseUrl) - Direct fetch for clean orgs
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
               *** Usage: await scanner.scanOrganization(org, { forceAggressive: true })

          ** Orphan Contact Linking via fix-orphan-contacts.js:
               *** Links contacts without org to matching org by email domain
               *** Run: node scrapers/fix-orphan-contacts.js --dry-run

-----

     * Google Search Quota Management:
          ** 100 free queries/day limit
          ** First scan: Up to 5 queries (one per category)
          ** Re-scan: 0 queries (skips if has Legal or Events contact)
          ** Tracking: googleQueryCount, resetGoogleQueryCount(), getGoogleQueryCount()

-----

     * Run Commands:
          ** Org scan (includes contacts): node scrapers/scan-and-scrape-all-live-orgs.js --org "Name" --scan-only
          ** Org scan with aggressive contacts: (requires code change to pass forceAggressive: true)
          ** Fix orphan contacts: node scrapers/fix-orphan-contacts.js

-----

     * Last Session: 2026-01-31

-----

     * Current Status: ✅ UNIFIED AND WORKING
          ** contact-discovery.js DEPRECATED - all functionality in org-scanner.js
          ** 5 contact categories searched on first scan
          ** Smart skip on re-scans to conserve quota

-----

     * Remaining Work:
          ** 1. 🔧 Build ad-hoc scanner CLI with forceAggressive option
          ** 2. 📊 Add contact count to scan results display
          ** 3. 🗑️ Remove contact-discovery.js from GitHub Actions workflow

-----

# GITHUB ACTIONS - UPDATE/REMOVE:

     * Workflow: Contact Discovery (Daily) - REMOVE OR DISABLE
          ** File: .github/workflows/contact-discovery.yml
          ** Status: ❌ DEPRECATED - org-scanner.js handles contact discovery now
          ** Action: Disable or delete this workflow
          ** Contact discovery now happens during:
               *** Org Discovery scans (every 2 weeks)
               *** Event Scanner runs (every few days)
               *** Ad-hoc manual scans

