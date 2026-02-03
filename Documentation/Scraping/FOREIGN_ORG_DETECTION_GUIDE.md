# FOREIGN ORGANIZATION DETECTION - IMPLEMENTATION GUIDE
# Created: 2026-02-03
# ════════════════════════════════════════════════════════════════════════════════

## OVERVIEW

This document provides:
1. ConOp documentation updates (copy into your ConOp)
2. Integration code for org-scanner.js
3. PocketBase schema additions
4. Testing instructions

────────────────────────────────────────────────────────────────────────────────
## PART 1: CONOP DOCUMENTATION UPDATES
────────────────────────────────────────────────────────────────────────────────

### ADD TO: ORGANIZATION WORKFLOW STEP 1B: PROFILE-BASED DISCOVERY
### (After Step 9, before the divider)

```
          ** Step 10 (NEW 2026-02-03): Foreign Organization Location Check
               *** Google Search for org headquarters location
               *** AI analyzes search results to determine if US or foreign
               *** Foreign orgs auto-rejected to "Rejected by Mission"
               *** US orgs continue normal workflow
               *** Uncertain cases flagged for human review
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: ORGANIZATION WORKFLOW STEP 1C: EVENT-BASED DISCOVERY
### (After Step 10 in Phase B, before Phase C)

```
               *** Step 10.5 (NEW 2026-02-03): Foreign Organization Location Check
                    **** Search Google: "[Org Name]" headquarters location country
                    **** AI analyzes results using gpt-4o-mini
                    **** If FOREIGN (high/medium confidence):
                         - Set foreign_org_flag = TRUE
                         - Set headquarters_country = [detected country]
                         - Auto-set status = "Rejected by Mission"
                    **** If US-BASED:
                         - Set foreign_org_flag = FALSE
                         - Set headquarters_country = "United States"
                         - Continue normal workflow
                    **** If UNCERTAIN:
                         - Set foreign_org_flag = FALSE (default to US)
                         - Flag location_check_notes for human review
                         - Continue normal workflow
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: WORKFLOW - STATUS REFERENCES
### (Under "Rejected by Mission" section, add to "When to Use")

```
               *** Foreign organization detected (non-US headquartered) - foreign_org_flag
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: SCANNING - ORG-SCANNER DETAILS
### (After "org-scanner.js Detects:" list)

```
          ** Foreign Organization Detection (NEW 2026-02-03):
               *** Searches Google for org headquarters location
               *** Uses AI (gpt-4o-mini) to analyze search results
               *** Determines if org is US-based or foreign
               *** Auto-rejects foreign orgs to "Rejected by Mission"
               
          ** What Counts as FOREIGN:
               *** Foreign governments and government agencies
               *** All non-US headquartered organizations
               *** US subsidiaries of foreign parent companies
               *** International organizations headquartered outside US (NATO, UN, etc.)
               
          ** Confidence Handling:
               *** High confidence foreign → Auto-reject to "Rejected by Mission"
               *** High confidence US → Continue normal workflow
               *** Low/uncertain confidence → Flag for human review, default to US
```

────────────────────────────────────────────────────────────────────────────────

### ADD NEW SECTION: After "SCANNING - JAVASCRIPT RENDERING DETECTION"

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SCANNING - FOREIGN ORGANIZATION DETECTION

     * Purpose
          ** Automatically identify organizations headquartered outside the United States
          ** Prevent foreign orgs from entering the approval pipeline
          ** Save human reviewer time by auto-rejecting clearly foreign organizations
          ** Flag uncertain cases for manual review

-----

     * What Counts as "Foreign" (Auto-Reject)
          ** Foreign governments and government agencies
          ** All non-US headquartered organizations
          ** US subsidiaries of foreign parent companies (parent determines status)
          ** International organizations headquartered outside US:
               *** NATO (Brussels, Belgium)
               *** United Nations (New York, but considered international)
               *** World Bank (DC, but international status)
               *** IMF (DC, but international status)

-----

     * Detection Strategy
          ** Step 1: Google Search for "[Org Name]" headquarters location country
          ** Step 2: Collect top search result snippets (up to 6 results)
          ** Step 3: AI Analysis (gpt-4o-mini) determines:
               *** Is organization US-based or foreign?
               *** What country is headquarters in?
               *** Confidence level (high/medium/low)
               *** Does it need human review?
          ** Step 4: Based on AI result:
               *** Foreign (high/medium confidence) → Auto-reject
               *** US-based → Continue normal workflow
               *** Uncertain → Flag for review, default to US

-----

     * Database Fields (organizations collection)
          ** foreign_org_flag (Bool): True if org is non-US headquartered
          ** headquarters_country (Plain Text): Country where org is headquartered
          ** location_check_notes (Plain Text): Evidence/reasoning from location check

-----

     * Auto-Status Update Behavior
          ** For NEWLY DISCOVERED organizations:
               *** Foreign detected (high/medium confidence) → Status: "Rejected by Mission"
               *** US detected → Status unchanged (continues workflow)
               *** Uncertain → Status unchanged, flagged in location_check_notes
          ** For EXISTING organizations (one-time check):
               *** Same behavior as above
               *** Run: node scrapers/check-foreign-orgs.js

-----

     * Scanner Console Output
          ** When checking location:
               *** "🌍 Step: Location Check (Foreign Organization Detection)"
               *** "🔍 Searching for location info..."
               *** "🤖 Analyzing location with AI..."
          ** Results:
               *** "🌍 FOREIGN ORG DETECTED: [Country]" (auto-reject)
               *** "🇺🇸 US-BASED ORG CONFIRMED" (continue)
               *** "❓ UNCERTAIN - Flagged for human review"

-----

     * Scripts
          ** org-scanner.js: checkOrgLocation() function (integrated into scanOrganization)
          ** check-foreign-orgs.js: One-time script to check existing orgs
               *** Usage: node scrapers/check-foreign-orgs.js
               *** Options: --dry-run, --limit N, --org "Name", --force

-----

     * Google Search Quota Impact
          ** 2 searches per organization (location queries)
          ** Adds ~10-20 queries per discovery run
          ** Recommend running after daily scraping to stay within quota
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: POCKETBASE COLLECTIONS AND VALUES
### (In organizations collection section, after "Scanner Flags")

```
          ** Location Check Fields (NEW 2026-02-03)
               *** foreign_org_flag: True if org is non-US headquartered (Bool)
               *** headquarters_country: Country where org HQ is located (Plain Text)
               *** location_check_notes: Evidence/reasoning from check (Plain Text)

          ** Field Name: foreign_org_flag
          ** Field Type: Bool
          ** Setting - Nonfalsey: off
          ** Setting - Presentable: on
          ** Field Purpose/Notes: True if organization is headquartered outside the United States. Set by location check during scanning. Auto-rejects org to "Rejected by Mission" when detected.

          ** Field Name: headquarters_country
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 100
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Country where organization is headquartered. Examples: "United States", "United Kingdom", "Germany". Set by location check during scanning.

          ** Field Name: location_check_notes
          ** Field Type: Plain Text
          ** Setting - min length: BLANK
          ** Setting - max length: 1000
          ** Setting - Regex pattern: BLANK
          ** Setting - nonempty: off
          ** Setting - Presentable: off
          ** Field Purpose/Notes: Evidence and reasoning from foreign organization location check. Contains AI analysis results. Prefixed with "NEEDS HUMAN REVIEW:" if uncertain.
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: SCRIPTS
### (In "Permission & Organization Management" section)

```
          ** check-foreign-orgs.js (NEW 2026-02-03)
               *** Purpose: One-time script to check existing orgs for foreign status
               *** Scans all orgs NOT already "Rejected by Mission"
               *** Uses Google Search + AI to determine location
               *** Auto-rejects foreign orgs to "Rejected by Mission"
               *** Flags uncertain cases for human review
               *** Creates scan_logs entries for audit trail
               *** Run: node scrapers/check-foreign-orgs.js
               *** Options:
                    **** --dry-run: Preview without changes
                    **** --limit N: Process only N orgs
                    **** --org "Name": Check specific org
                    **** --force: Re-check previously checked orgs
```

────────────────────────────────────────────────────────────────────────────────

### ADD TO: scan_logs Collection
### (Add new scan_type value)

```
          ** Field Name: scan_type
          ** Field Type: Select
          ** Setting - Values: discovery, pre-scrape, manual, scheduled, contact-discovery, location-check
          ...
          ** Field Purpose/Notes: Type of scan performed. Values:
               *** discovery - Initial scan during org discovery
               *** pre-scrape - Scan before scraping events
               *** manual - Manual ad-hoc scan via adhoc-scanner.js or Admin Interface
               *** scheduled - Scheduled weekly scan (org-scanner.yml)
               *** contact-discovery - Google Search contact discovery (DEPRECATED 2026-01-31)
               *** location-check - Foreign organization location check (NEW 2026-02-03)
```

────────────────────────────────────────────────────────────────────────────────
## PART 2: POCKETBASE SCHEMA CHANGES
────────────────────────────────────────────────────────────────────────────────

### STEP 1: Add fields to organizations collection

In PocketBase Admin UI → Collections → organizations → Fields:

1. **foreign_org_flag**
   - Type: Bool
   - Nonfalsey: off
   - Presentable: on

2. **headquarters_country**
   - Type: Plain Text
   - Max length: 100
   - Nonempty: off
   - Presentable: off

3. **location_check_notes**
   - Type: Plain Text
   - Max length: 1000
   - Nonempty: off
   - Presentable: off

### STEP 2: Update scan_logs collection

Add "location-check" to the scan_type Select field values:
- Current: discovery, pre-scrape, manual, scheduled, contact-discovery
- New: discovery, pre-scrape, manual, scheduled, contact-discovery, location-check

────────────────────────────────────────────────────────────────────────────────
## PART 3: INTEGRATION CODE FOR org-scanner.js
────────────────────────────────────────────────────────────────────────────────

### STEP 1: Add the checkOrgLocation function

Copy the entire contents of org-location-check.js and add it to org-scanner.js
(or require it as a module).

### STEP 2: Add to scanOrganization() function

Find the comment "// Step 5: POC Gathering" and AFTER that section (before Step 6),
add this code block:

```javascript
    // ───────────────────────────────────────────────────────────────────────
    // Step 5.5: Foreign Organization Location Check (NEW 2026-02-03)
    // ───────────────────────────────────────────────────────────────────────
    
    if (!options.skipLocationCheck) {
        const locationResult = await checkOrgLocation(org.name, org.website, {
            GOOGLE_SEARCH_API_KEY,
            GOOGLE_SEARCH_ENGINE_ID,
            OPENAI_API_KEY,
            fetch: async (url) => {
                // Use node-fetch or built-in fetch
                const nodeFetch = (await import('node-fetch')).default;
                return nodeFetch(url);
            }
        });
        
        result.foreignOrgFlag = locationResult.isForeign;
        result.headquartersCountry = locationResult.headquartersCountry;
        result.locationCheckNotes = locationResult.notes;
        result.locationNeedsReview = locationResult.needsHumanReview;
        
        // Auto-reject foreign organizations
        if (locationResult.isForeign && locationResult.confidence !== 'low') {
            console.log('      🌍 Auto-rejecting foreign organization');
            result.autoRejectedAsForeign = true;
            result.newStatus = 'Rejected by Mission';
            result.statusChanged = true;
            result.previousStatus = org.status;
        }
    }
```

### STEP 3: Add database field updates

In the Step 6 database update section, add these field updates:

```javascript
        // Foreign org location fields (NEW 2026-02-03)
        if (result.foreignOrgFlag !== undefined) {
            updates.foreign_org_flag = result.foreignOrgFlag;
            result.fieldsUpdated.push('foreign_org_flag');
        }
        if (result.headquartersCountry) {
            updates.headquarters_country = result.headquartersCountry;
            result.fieldsUpdated.push('headquarters_country');
        }
        if (result.locationCheckNotes) {
            updates.location_check_notes = result.locationCheckNotes;
            result.fieldsUpdated.push('location_check_notes');
        }
        
        // Auto-reject foreign orgs to "Rejected by Mission"
        if (result.autoRejectedAsForeign) {
            updates.status = 'Rejected by Mission';
            result.fieldsUpdated.push('status');
        }
```

### STEP 4: Add to result summary output

In the scan results summary section, add:

```javascript
    console.log(`   Foreign Org: ${result.foreignOrgFlag ? '🌍 YES (' + result.headquartersCountry + ')' : '🇺🇸 No'}`);
    if (result.locationNeedsReview) {
        console.log(`   Location Review: ❓ Needs human review`);
    }
```

### STEP 5: Add to exports

```javascript
module.exports = {
    // ... existing exports ...
    checkOrgLocation,
    // ... rest of exports ...
};
```

────────────────────────────────────────────────────────────────────────────────
## PART 4: TESTING
────────────────────────────────────────────────────────────────────────────────

### Test 1: Dry run on existing orgs

```powershell
node scrapers/check-foreign-orgs.js --dry-run --limit 5
```

Expected output:
- Shows 5 orgs being checked
- Shows foreign/US status for each
- "This was a DRY RUN" message at end
- No database changes made

### Test 2: Check specific org (known foreign)

```powershell
node scrapers/check-foreign-orgs.js --org "NATO" --dry-run
```

Expected: Should detect as foreign (Brussels, Belgium)

### Test 3: Check specific org (known US)

```powershell
node scrapers/check-foreign-orgs.js --org "CSIS" --dry-run
```

Expected: Should detect as US-based (Washington, DC)

### Test 4: Run for real

```powershell
node scrapers/check-foreign-orgs.js --limit 10
```

Expected:
- Database fields updated
- Foreign orgs have status changed to "Rejected by Mission"
- scan_logs entries created

### Test 5: Verify in Admin Interface

1. Open Admin Interface
2. Go to Org By Status tab
3. Filter by "Rejected by Mission"
4. Verify foreign orgs show foreign_org_flag = true
5. Check location_check_notes for reasoning

────────────────────────────────────────────────────────────────────────────────
## SUMMARY OF FILES CREATED
────────────────────────────────────────────────────────────────────────────────

1. **org-location-check.js** - Location check module (integrate into org-scanner.js)
2. **check-foreign-orgs.js** - One-time script for existing orgs
3. **FOREIGN_ORG_DETECTION_GUIDE.md** - This documentation file

────────────────────────────────────────────────────────────────────────────────
## NEXT STEPS
────────────────────────────────────────────────────────────────────────────────

1. ⬜ Add 3 new fields to organizations collection in PocketBase
2. ⬜ Add "location-check" to scan_logs.scan_type values
3. ⬜ Copy check-foreign-orgs.js to scrapers/ folder
4. ⬜ Integrate org-location-check.js code into org-scanner.js
5. ⬜ Run --dry-run test on existing orgs
6. ⬜ Run check-foreign-orgs.js on all existing orgs
7. ⬜ Update ConOp with documentation above
8. ⬜ Update Admin Interface to display foreign_org_flag badge

Would you like me to proceed with any of these steps?
