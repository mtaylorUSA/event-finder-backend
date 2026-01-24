PS C:\Users\mtayl> cd "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL"
PS C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL> node scrapers/scan-and-scrape-all-live-orgs.js --approved --scan-only

════════════════════════════════════════════════════════════════
🔄 UNIFIED SCAN + SCRAPE SYSTEM
════════════════════════════════════════════════════════════════

⏳ Initializing...
✅ Org Scanner initialized
   🔐 Authenticating with PocketBase...
   ✅ Authenticated
   ✅ Ready

════════════════════════════════════════════════════════════════
🔄 BATCH MODE: Processing All Orgs (except Rejected by Mission)
════════════════════════════════════════════════════════════════
   Mode: Scan Only
   Filter: Excludes "Rejected by Mission" only

📡 Fetching non-rejected-by-mission organizations...
   ✅ Found 60 organization(s)

────────────────────────────────────────────────────────────────
📋 Organizations to process:
────────────────────────────────────────────────────────────────
   1. AFCEA (Armed Forces Communications and Electronics Association) and INSA (Intelligence and National Security Alliance)
   2. American Enterprise Institute (AEI)
   3. Apex Defense
   4. Armed Forces Communications and Electronics Association (AFCEA)
   5. Atlantic Council
   6. Billington CyberSecurity
   7. Center for Strategic and International Studies (CSIS)
   8. Center for a New American Security (CNAS)
   9. Chatham House
   10. Consumer Technology Association (CTA)
   11. Council on Foreign Relations
   12. Cyber Threat Alliance (CTA)
   13. Cybersecurity & Infrastructure Security Agency (CISA)
   14. Cybersecurity Summit (CS)
   15. DSI Group
   16. E.Republic LLC
   17. Federal Business Council, Inc. (FBC)
   18. GIS Software for Mapping and Spatial Analytics
   19. Institute for Defense & Government Advancement (IDGA)
   20. Institute of International Finance
   21. Institute of National Security (INS)
   22. Intelligence & National Security Alliance (INSA)
   23. International Association of Privacy Professionals (IAPP)
   24. Jean Monnet Center of Excellence (JMCE)
   25. National Cyber Summit (NCS)
   26. National Cybersecurity Alliance
   27. National Defense Industrial Association (NDIA)
   28. National Defense University
   29. National Homeland Security Association
   30. National Security Agency
   31. National Security Data and Policy Institute (NSDPI)
   32. National Security Space Association (NSSA)
   33. New America
   34. Nuclear Energy Institute (NEI)
   35. Parliamentary Intelligence-Security Forum (PI-SF)
   36. Potomac Officers Club
   37. Professional Services Council (PSC)
   38. SAE Media Group
   39. SANS Institute
   40. SATShow
   41. Strategic Computing and Security Program (SCSP)
   42. Suits and Spooks
   43. Surface Navy Association (SNA)
   44. TeleStrategies, Inc. (TSI)
   45. The Aspen Institute
   46. The Belfer Center for Science and International Affairs
   47. The Brookings Institution
   48. The Hoover Institution
   49. The Institute for National Security Studies (INSS)
   50. The International Institute for Strategic Studies
   51. The National Guard Bureau
   52. The National Security Council (NSC)
   53. The RAND Corporation
   54. The Stanford Gordian Knot Center for National Security Innovation
   55. The Stimson Center
   56. UC Berkeley Center for Long-Term Cybersecurity (CLTC)
   57. Women in Cybersecurity (WiCyS)
   58. gartner.com
   59. hsdf.org
   60. rsaconference.com
────────────────────────────────────────────────────────────────


════════════════════════════════════════════════════════════════
📌 [1/60] AFCEA (Armed Forces Communications and Electronics Association) and INSA (Intelligence and National Security Alliance)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: AFCEA (Armed Forces Communications and Electronics Association) and INSA (Intelligence and National Security Alliance)
════════════════════════════════════════════════════════════════
   Website: https://intelsummit.org
   Source ID: intelsummit.org
   Current events_url: https://www.youtube.com/user/INSAEvents
   Triggering URL: https://intelsummit.org/

   📡 Fetching homepage...
      ✅ Homepage fetched (31952 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (high confidence)
      📋 Reasons: Platform footer: "website powered by"; Hosted by pattern: "Co-hosted by AFCEA and INSA"
      🏢 Parent org(s) identified: AFCEA, INSA
      🔍 Looking up AFCEA's website...
      ✅ Found: https://www.afcea.org (via known_mapping)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (192680 bytes)
   📜 Scanning PARENT ORG for TOU: https://www.afcea.org
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.afcea.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://www.afcea.org/copyright...
         ⚠️ RESTRICTIONS FOUND: scraping
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.afcea.org/copyright (1 terms)
      📜 Scanning Legal Page: https://www.afcea.org/disclaimers...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.afcea.org/privacy...
         ✅ No restrictions
      📊 Scanned 4 page(s), 1 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.youtube.com/user/INSAEvents
      🔍 Validating events URL: https://www.youtube.com/user/INSAEvents
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://intelsummit.org/events
      🔍 Validating events URL: https://intelsummit.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://intelsummit.org/calendar
      🔍 Validating events URL: https://intelsummit.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://intelsummit.org/upcoming-events
      🔍 Validating events URL: https://intelsummit.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://intelsummit.org/programs
      🔍 Validating events URL: https://intelsummit.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://intelsummit.org/conferences
      🔍 Validating events URL: https://intelsummit.org/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://www.youtube.com/user/INSAEvents
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Very little text content (221 chars) despite large HTML (761057 chars), High script count (41) with minimal text content, Events page has no actual event content (only 1 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.afcea.org/copyright
   Restriction Sources: 1 page(s)
      • https://www.afcea.org/copyright
   Legal Pages Found: 4
   False Positives Filtered: 0
   Events URL: https://www.youtube.com/user/INSAEvents ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 88946ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [2/60] American Enterprise Institute (AEI)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: American Enterprise Institute (AEI)
════════════════════════════════════════════════════════════════
   Website: https://www.aei.org
   Source ID: aei.org
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (108472 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 6 legal link(s) in footer
      📄 Found 13 legal page(s) to scan
      📜 Scanning Terms of Use: https://www.aei.org/about/terms-of-use/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.aei.org/our-scholars/?policy-area=american-boond...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.aei.org/our-scholars/?policy-area=foreign-and-de...
         ⚠️ Could not fetch
      📜 Scanning Legal: https://www.aei.org/our-scholars/?policy-area=legal-and-cons...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.aei.org/policy-areas/foreign-defense-policy/...
         ⚠️ Could not fetch
      📜 Scanning Legal: https://www.aei.org/policy-areas/legal-and-constitutional/...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://www.aei.org/privacy...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://www.aei.org/privacy-policy...
         ⚠️ Could not fetch
      📜 Scanning Terms & Conditions: https://www.aei.org/legal/terms...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://www.aei.org/legal/privacy...
         ⚠️ Could not fetch
      📜 Scanning Copyright Notice: https://www.aei.org/copyright...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.aei.org/intellectual-property...
         ⚠️ Could not fetch
      📜 Scanning Terms & Conditions: https://www.aei.org/developers/terms...
         ⚠️ Could not fetch
      📊 Scanned 0 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.aei.org/events/
      🔍 Validating events URL: https://www.aei.org/events/
      ✅ Valid events page (found: upcoming events, past events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /contact: MediaServices@aei.org

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.aei.org/about/terms-of-use/
   Legal Pages Found: 13
   False Positives Filtered: 0
   Events URL: https://www.aei.org/events/ ✅
   POC Email: MediaServices@aei.org
   AI Org Name: N/A
   Scan Duration: 83266ms
   Fields Updated: tou_url, tou_flag, tou_notes, tou_scanned_date, events_url
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [3/60] Apex Defense
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Apex Defense
════════════════════════════════════════════════════════════════
   Website: https://apexdefense.org
   Source ID: apexdefense.org
   Current events_url: https://apexdefense.org/events
   Triggering URL: https://www.apexdefense.org/

   📡 Fetching homepage...
      ✅ Homepage fetched (470719 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: Hosted by pattern: "a dynamic defense technology event"; Missing typical org sections: about, careers, mission/history
      🏢 Parent org(s) identified: dynamic defense technology
      🔍 Looking up dynamic defense technology's website...
      ✅ Found: https://www.ddt.org (via constructed_url)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (168663 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.ddt.org
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.asp.events/client
      🔍 Validating events URL: https://www.asp.events/client
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://apexdefense.org/events
      🔍 Validating events URL: https://apexdefense.org/events
      ✅ Valid events page (found: register now, join us)
      ✅ Using events URL from common path
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: hello@apexdefense.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, no_legal_pages_flag, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: https://apexdefense.org/events ✅
   POC Email: hello@apexdefense.org
   AI Org Name: N/A
   Scan Duration: 234148ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, no_legal_pages_flag, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [4/60] Armed Forces Communications and Electronics Association (AFCEA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Armed Forces Communications and Electronics Association (AFCEA)
════════════════════════════════════════════════════════════════
   Website: https://www.afcea.org/
   Source ID: N/A
   Current events_url: https://www.afcea.org/events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (192680 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.afcea.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://www.afcea.org/copyright...
         ⚠️ RESTRICTIONS FOUND: scraping
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.afcea.org/copyright (1 terms)
      📜 Scanning Legal Page: https://www.afcea.org/disclaimers...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.afcea.org/privacy...
         ✅ No restrictions
      📊 Scanned 4 page(s), 1 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.afcea.org/afcea-europe/european-events-and-marketing
      🔍 Validating events URL: https://www.afcea.org/afcea-europe/european-events-and-marketing
      ✅ Valid events page (found: registration, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 0 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.afcea.org/copyright
   Restriction Sources: 1 page(s)
      • https://www.afcea.org/copyright
   Legal Pages Found: 4
   False Positives Filtered: 0
   Events URL: https://www.afcea.org/afcea-europe/european-events-and-marketing ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 52160ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [5/60] Atlantic Council
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Atlantic Council
════════════════════════════════════════════════════════════════
   Website: https://www.atlanticcouncil.org
   Source ID: atlanticcouncil.org
   Current events_url: https://www.atlanticcouncil.org/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (216417 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 6 legal link(s) in footer
      📄 Found 13 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.atlanticcouncil.org/privacy-policy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/cookie-policy/...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.atlanticcouncil.org/terms-of-use/...
         ⚠️ RESTRICTIONS FOUND: robots, spiders, harvest
            (0 high-confidence, 4 context-confirmed)
         📍 Restriction source: https://www.atlanticcouncil.org/terms-of-use/ (4 terms)
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/intellectual-independence-po...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/policy-on-donor-acceptance-a...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/modern-day-slavery-and-anti-...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.atlanticcouncil.org/terms-of-use...
         ⚠️ RESTRICTIONS FOUND: robots, spiders, harvest
            (0 high-confidence, 4 context-confirmed)
         📍 Restriction source: https://www.atlanticcouncil.org/terms-of-use (4 terms)
      📜 Scanning Privacy Policy: https://www.atlanticcouncil.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/cookie-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.atlanticcouncil.org/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.atlanticcouncil.org/legal/privacy...
         ⚠️ RESTRICTIONS FOUND: data mining
            (4 high-confidence, 0 context-confirmed)
         📍 Restriction source: https://www.atlanticcouncil.org/legal/privacy (4 terms)
      📜 Scanning Legal Page: https://www.atlanticcouncil.org/policies...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.atlanticcouncil.org/developers/terms...
         ✅ No restrictions
      📊 Scanned 13 page(s), 3 with restrictions, 2 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.atlanticcouncil.org/events/
      🔍 Validating events URL: https://www.atlanticcouncil.org/events/
      ✅ Valid events page (found: upcoming events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"restriction_context":{"code":"validation_max_text_constraint","message":"Must be less than 2000 character(s)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.atlanticcouncil.org/terms-of-use/
   Restriction Sources: 3 page(s)
      • https://www.atlanticcouncil.org/terms-of-use/
      • https://www.atlanticcouncil.org/terms-of-use
      • https://www.atlanticcouncil.org/legal/privacy
   Legal Pages Found: 13
   False Positives Filtered: 2
   Events URL: https://www.atlanticcouncil.org/events/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 103948ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [6/60] Billington CyberSecurity
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Billington CyberSecurity
════════════════════════════════════════════════════════════════
   Website: https://billingtoncybersecurity.com
   Source ID: billingtoncybersecurity.com
   Current events_url: https://billingtoncybersecurity.com/events
   Triggering URL: https://billingtoncybersecurity.com/

   📡 Fetching homepage...
      ✅ Homepage fetched (168801 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 9 legal page(s) to scan
      📜 Scanning Privacy Policy: https://billingtoncybersecurity.com/privacy-policy/...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Terms of Use: https://billingtoncybersecurity.com/terms-of-use/...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Terms & Conditions: https://billingtoncybersecurity.com/terms...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Terms of Use: https://billingtoncybersecurity.com/terms-of-use...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://billingtoncybersecurity.com/privacy...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Privacy Policy: https://billingtoncybersecurity.com/privacy-policy...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Terms & Conditions: https://billingtoncybersecurity.com/legal/terms...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://billingtoncybersecurity.com/legal/privacy...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Terms & Conditions: https://billingtoncybersecurity.com/developers/terms...
         ✅ No restrictions (1 false positives filtered)
      📊 Scanned 9 page(s), 0 with restrictions, 17 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://billingtoncybersecurity.com/events-2/
      🔍 Validating events URL: https://billingtoncybersecurity.com/events-2/
      ❌ Could not fetch URL (Page not found)
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://billingtoncybersecurity.com/events
      🔍 Validating events URL: https://billingtoncybersecurity.com/events
      ✅ Valid events page (found: upcoming events, register now)
      ✅ Using events URL from common path
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /about: sales@billingtoncybersecurity.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://billingtoncybersecurity.com/privacy-policy/
   Legal Pages Found: 9
   False Positives Filtered: 17
   Events URL: https://billingtoncybersecurity.com/events ✅
   POC Email: sales@billingtoncybersecurity.com
   AI Org Name: N/A
   Scan Duration: 77518ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [7/60] Center for Strategic and International Studies (CSIS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Center for Strategic and International Studies (CSIS)
════════════════════════════════════════════════════════════════
   Website: https://www.csis.org
   Source ID: csis.org
   Current events_url: https://www.csis.org/events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (313021 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.csis.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.csis.org/about/media/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.csis.org/accessibility...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Legal Page: https://www.csis.org/reprint-permissions...
         ✅ No restrictions
      📊 Scanned 4 page(s), 0 with restrictions, 2 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.csis.org/events
      🔍 Validating events URL: https://www.csis.org/events
      ✅ Valid events page (found: upcoming events, event date, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: ntarr@csis.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.csis.org/privacy-policy
   Legal Pages Found: 4
   False Positives Filtered: 2
   Events URL: https://www.csis.org/events ✅
   POC Email: ntarr@csis.org
   AI Org Name: N/A
   Scan Duration: 64002ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [8/60] Center for a New American Security (CNAS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Center for a New American Security (CNAS)
════════════════════════════════════════════════════════════════
   Website: https://conference.cnas.org
   Source ID: conference.cnas.org
   Current events_url: https://www.cnas.org/events
   Triggering URL: https://conference.cnas.org/

   📡 Fetching homepage...
      ✅ Homepage fetched (41911 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: URL pattern: subdomain suggests event site; Subdomain extracted: parent likely cnas.org
      ⚠️ No parent org name in page content
      🔍 Trying parent domain from URL: https://www.cnas.org
      ✅ Parent domain accessible (141204 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.cnas.org
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 3 legal page(s) to scan
      📜 Scanning Privacy Policy: https://policies.google.com/privacy...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Terms & Conditions: https://policies.google.com/terms...
         ✅ No restrictions (4 false positives filtered)
      📜 Scanning Legal Page: https://www.cnas.org/contact...
         ✅ No restrictions
      📊 Scanned 3 page(s), 0 with restrictions, 6 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://conference.cnas.org/events
      🔍 Validating events URL: https://conference.cnas.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://conference.cnas.org/calendar
      🔍 Validating events URL: https://conference.cnas.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://conference.cnas.org/upcoming-events
      🔍 Validating events URL: https://conference.cnas.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://conference.cnas.org/programs
      🔍 Validating events URL: https://conference.cnas.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://conference.cnas.org/conferences
      🔍 Validating events URL: https://conference.cnas.org/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ✅ Found POC on homepage: cbelisle@cnas.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: https://policies.google.com/privacy
   Legal Pages Found: 3
   False Positives Filtered: 6
   Events URL: Not found ⚠️
   POC Email: cbelisle@cnas.org
   AI Org Name: N/A
   Scan Duration: 74941ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [9/60] Chatham House
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Chatham House
════════════════════════════════════════════════════════════════
   Website: https://www.chathamhouse.org
   Source ID: chathamhouse.org
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (407292 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      ⛔ Technical block detected at: https://www.chathamhouse.org/terms

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 4044ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [10/60] Consumer Technology Association (CTA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Consumer Technology Association (CTA)
════════════════════════════════════════════════════════════════
   Website: https://ces.tech
   Source ID: ces.tech
   Current events_url: https://www.cta.tech/events/
   Triggering URL: https://www.ces.tech/

   📡 Fetching homepage...
      ✅ Homepage fetched (351818 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 8 legal page(s) to scan
      📜 Scanning Legal Page: https://www.ces.tech/about-ces/code-of-conduct/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.ces.tech/about-ces/privacy/...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.ces.tech/about-ces/terms-of-use/...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://ces.tech/terms-of-use...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://ces.tech/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://ces.tech/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://ces.tech/cookie-policy...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Legal Page: https://ces.tech/code-of-conduct...
         ✅ No restrictions
      📊 Scanned 8 page(s), 0 with restrictions, 2 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.cta.tech/events/
      🔍 Validating events URL: https://www.cta.tech/events/
      ✅ Valid events page (found: upcoming events, past events, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.ces.tech/about-ces/code-of-conduct/
   Legal Pages Found: 8
   False Positives Filtered: 2
   Events URL: https://www.cta.tech/events/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 80198ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [11/60] Council on Foreign Relations
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Council on Foreign Relations
════════════════════════════════════════════════════════════════
   Website: https://www.cfr.org
   Source ID: cfr.org
   Current events_url: https://www.cfr.org/event
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (317884 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 3 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.cfr.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.cfr.org/terms-use...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.cfr.org/contact-us...
         ✅ No restrictions
      📊 Scanned 3 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.cfr.org/event
      🔍 Validating events URL: https://www.cfr.org/event
      ✅ Valid events page (found: upcoming events, past events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.cfr.org/privacy-policy
   Legal Pages Found: 3
   False Positives Filtered: 0
   Events URL: https://www.cfr.org/event ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 102824ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [12/60] Cyber Threat Alliance (CTA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Cyber Threat Alliance (CTA)
════════════════════════════════════════════════════════════════
   Website: https://cyberthreatalliance.org
   Source ID: cyberthreatalliance.org
   Current events_url: https://www.cyberthreatalliance.org/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (132704 bytes)
   🔍 Checking for JavaScript rendering...
      ⚠️ JavaScript-rendered site detected (high confidence)
      📋 Reasons: Framework root element found: <div id="app">
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 1 legal page(s) to scan
      📜 Scanning Legal Page: https://www.cyberthreatalliance.org/contact/...
         ✅ No restrictions
      📊 Scanned 1 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.cyberthreatalliance.org/events/
      🔍 Validating events URL: https://www.cyberthreatalliance.org/events/
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://cyberthreatalliance.org/events
      🔍 Validating events URL: https://cyberthreatalliance.org/events
      ⚠️ May not be an events listing page
      📍 Trying: https://cyberthreatalliance.org/calendar
      🔍 Validating events URL: https://cyberthreatalliance.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cyberthreatalliance.org/upcoming-events
      🔍 Validating events URL: https://cyberthreatalliance.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cyberthreatalliance.org/programs
      🔍 Validating events URL: https://cyberthreatalliance.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cyberthreatalliance.org/conferences
      🔍 Validating events URL: https://cyberthreatalliance.org/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://www.cyberthreatalliance.org/events/
   👤 Gathering POC info...
      ✅ Found POC on /contact: newmember@cyberthreatalliance.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.cyberthreatalliance.org/contact/
   Legal Pages Found: 1
   False Positives Filtered: 0
   Events URL: https://www.cyberthreatalliance.org/events/ ⚠️
   POC Email: newmember@cyberthreatalliance.org
   AI Org Name: N/A
   Scan Duration: 75918ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [13/60] Cybersecurity & Infrastructure Security Agency (CISA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Cybersecurity & Infrastructure Security Agency (CISA)
════════════════════════════════════════════════════════════════
   Website: https://www.cisa.gov
   Source ID: cisa.gov
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (70893 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 3 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.cisa.gov/privacy-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.cisa.gov/terms-use...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.cisa.gov/privacy...
         ✅ No restrictions
      📊 Scanned 3 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.cisa.gov/news-events
      🔍 Validating events URL: https://www.cisa.gov/news-events
      ✅ Valid events page (found: upcoming events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: contact@cisa.dhs.gov

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.cisa.gov/privacy-policy
   Legal Pages Found: 3
   False Positives Filtered: 0
   Events URL: https://www.cisa.gov/news-events ✅
   POC Email: contact@cisa.dhs.gov
   AI Org Name: N/A
   Scan Duration: 132389ms
   Fields Updated: tou_url, tou_flag, tech_block_flag, tou_notes, tou_scanned_date, events_url
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [14/60] Cybersecurity Summit (CS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Cybersecurity Summit (CS)
════════════════════════════════════════════════════════════════
   Website: https://cybersecuritysummit.com
   Source ID: cybersecuritysummit.com
   Current events_url: https://cybersecuritysummit.com/solution-providers/
   Triggering URL: https://cybersecuritysummit.com/summit/dallas23-nov/

   📡 Fetching homepage...
      ✅ Homepage fetched (225208 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 8 legal page(s) to scan
      📜 Scanning Terms of Use: https://www.cyberriskalliance.com/terms-of-use...
         ⚠️ RESTRICTIONS FOUND: automated
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.cyberriskalliance.com/terms-of-use (1 terms)
      📜 Scanning Terms & Conditions: https://cybersecuritysummit.com/terms...
         ⚠️ RESTRICTIONS FOUND: automated
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://cybersecuritysummit.com/terms (1 terms)
      📜 Scanning Privacy Policy: https://cybersecuritysummit.com/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://cybersecuritysummit.com/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal: https://cybersecuritysummit.com/legal...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://cybersecuritysummit.com/legal/terms...
         ⚠️ RESTRICTIONS FOUND: automated
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://cybersecuritysummit.com/legal/terms (1 terms)
      📜 Scanning Privacy Policy: https://cybersecuritysummit.com/legal/privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://cybersecuritysummit.com/developers/terms...
         ⚠️ RESTRICTIONS FOUND: automated
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://cybersecuritysummit.com/developers/terms (1 terms)
      📊 Scanned 8 page(s), 4 with restrictions, 16 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://cybersecuritysummit.com/solution-providers/
      🔍 Validating events URL: https://cybersecuritysummit.com/solution-providers/
      ✅ Valid events page (found: register now)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.cyberriskalliance.com/terms-of-use
   Restriction Sources: 4 page(s)
      • https://www.cyberriskalliance.com/terms-of-use
      • https://cybersecuritysummit.com/terms
      • https://cybersecuritysummit.com/legal/terms
      • https://cybersecuritysummit.com/developers/terms
   Legal Pages Found: 8
   False Positives Filtered: 16
   Events URL: https://cybersecuritysummit.com/solution-providers/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 88112ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [15/60] DSI Group
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: DSI Group
════════════════════════════════════════════════════════════════
   Website: https://cbrn.dsigroup.org
   Source ID: cbrn.dsigroup.org
   Current events_url: https://dsigroup.org/events/
   Triggering URL: https://cbrn.dsigroup.org/

   📡 Fetching homepage...
      ✅ Homepage fetched (110705 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://dsigroup.org/privacy-policy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://dsigroup.org/contact-us/...
         ✅ No restrictions
      📊 Scanned 2 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://dsigroup.org/events/
      🔍 Validating events URL: https://dsigroup.org/events/
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://cbrn.dsigroup.org/events
      🔍 Validating events URL: https://cbrn.dsigroup.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cbrn.dsigroup.org/calendar
      🔍 Validating events URL: https://cbrn.dsigroup.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cbrn.dsigroup.org/upcoming-events
      🔍 Validating events URL: https://cbrn.dsigroup.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cbrn.dsigroup.org/programs
      🔍 Validating events URL: https://cbrn.dsigroup.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cbrn.dsigroup.org/conferences
      🔍 Validating events URL: https://cbrn.dsigroup.org/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://dsigroup.org/events/
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 1 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://dsigroup.org/privacy-policy/
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: https://dsigroup.org/events/ ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 70359ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [16/60] E.Republic LLC
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: E.Republic LLC
════════════════════════════════════════════════════════════════
   Website: https://events.govtech.com
   Source ID: events.govtech.com
   Current events_url: https://events.govtech.com/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (151746 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: Subdomain extracted: parent likely govtech.com; Hosted by pattern: "a Public Sector Cybersecurity Summit"
      🏢 Parent org(s) identified: Public Sector Cybersecurity
      🔍 Looking up Public Sector Cybersecurity's website...
      ✅ Found: https://www.psc.org (via constructed_url)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (221467 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.psc.org
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 8 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.psc.org/privacy-policy/...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.psc.org/terms-conditions/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.psc.org/site-map/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.psc.org/contact-us/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.psc.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.psc.org/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.psc.org/legal/privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.psc.org/developers/terms...
         ✅ No restrictions
      📊 Scanned 8 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://events.govtech.com/
      🔍 Validating events URL: https://events.govtech.com/
      ✅ Valid events page (found: upcoming events, past events, event calendar)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: event.sales@govtech.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: https://www.psc.org/privacy-policy/
   Legal Pages Found: 8
   False Positives Filtered: 0
   Events URL: https://events.govtech.com/ ✅
   POC Email: event.sales@govtech.com
   AI Org Name: N/A
   Scan Duration: 147559ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [17/60] Federal Business Council, Inc. (FBC)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Federal Business Council, Inc. (FBC)
════════════════════════════════════════════════════════════════
   Website: https://fbcinc.com
   Source ID: fbcinc.com
   Current events_url: https://fbcinc.com/search.aspx
   Triggering URL: https://www.fbcinc.com/search.aspx

   📡 Fetching homepage...
      ✅ Homepage fetched (53597 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://fbcinc.com/privacypolicy.aspx...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://fbcinc.com/terms.aspx...
         ✅ No restrictions
      📊 Scanned 2 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://fbcinc.com/search.aspx
      🔍 Validating events URL: https://fbcinc.com/search.aspx
      ✅ Valid events page (found: upcoming events, calendar of events, register now)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://fbcinc.com/privacypolicy.aspx
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: https://fbcinc.com/search.aspx ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 57226ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [18/60] GIS Software for Mapping and Spatial Analytics
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: GIS Software for Mapping and Spatial Analytics
════════════════════════════════════════════════════════════════
   Website: https://esri.com
   Source ID: esri.com
   Current events_url: https://www.esri.com/en-us/about/events/devtech/overview
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (62828 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      📄 Found 4 legal page(s) to scan
      📜 Scanning Privacy Policy: https://esri.com/privacy...
         ✅ No restrictions
      📜 Scanning Legal: https://esri.com/legal...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://esri.com/legal/privacy...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://esri.com/copyright...
         ✅ No restrictions
      📊 Scanned 4 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.esri.com/en-us/about/events/devtech/overview
      🔍 Validating events URL: https://www.esri.com/en-us/about/events/devtech/overview
      ✅ Valid events page (found: registration)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /contact: Accounts@esri.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://esri.com/privacy
   Legal Pages Found: 4
   False Positives Filtered: 0
   Events URL: https://www.esri.com/en-us/about/events/devtech/overview ✅
   POC Email: Accounts@esri.com
   AI Org Name: N/A
   Scan Duration: 98869ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [19/60] Institute for Defense & Government Advancement (IDGA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Institute for Defense & Government Advancement (IDGA)
════════════════════════════════════════════════════════════════
   Website: https://www.idga.org/
   Source ID: N/A
   Current events_url: https://www.idga.org/events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (147155 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning User Agreement: https://www.idga.org/user-agreement...
         ⚠️ RESTRICTIONS FOUND: spider, automated
            (0 high-confidence, 2 context-confirmed)
         📍 Restriction source: https://www.idga.org/user-agreement (2 terms)
      📜 Scanning Legal Page: https://www.idga.org/cookie-policy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.iqpc.com/privacy-policy...
         ⚠️ RESTRICTIONS FOUND: scraping, scrape, automated
            (0 high-confidence, 4 context-confirmed)
         📍 Restriction source: https://www.iqpc.com/privacy-policy (4 terms)
      📜 Scanning Legal Page: https://www.idga.org/contact-us...
         ✅ No restrictions
      📊 Scanned 4 page(s), 2 with restrictions, 1 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.idga.org/events
      🔍 Validating events URL: https://www.idga.org/events
      ✅ Valid events page (found: register now, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.idga.org/user-agreement
   Restriction Sources: 2 page(s)
      • https://www.idga.org/user-agreement
      • https://www.iqpc.com/privacy-policy
   Legal Pages Found: 4
   False Positives Filtered: 1
   Events URL: https://www.idga.org/events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 63964ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [20/60] Institute of International Finance
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Institute of International Finance
════════════════════════════════════════════════════════════════
   Website: https://iif.com
   Source ID: iif.com
   Current events_url: https://www.iif.com/Events/Upcoming-Events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (79670 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 7 legal page(s) to scan
      📜 Scanning Terms & Conditions: https://www.iif.com/Terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.iif.com/Privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://iif.com/terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://iif.com/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://iif.com/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://iif.com/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://iif.com/cookie-policy...
         ✅ No restrictions
      📊 Scanned 7 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.iif.com/Events/Upcoming-Events
      🔍 Validating events URL: https://www.iif.com/Events/Upcoming-Events
      ✅ Valid events page (found: upcoming events, past events, register now)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.iif.com/Terms
   Legal Pages Found: 7
   False Positives Filtered: 0
   Events URL: https://www.iif.com/Events/Upcoming-Events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 87695ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [21/60] Institute of National Security (INS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Institute of National Security (INS)
════════════════════════════════════════════════════════════════
   Website: https://vanderbilt.edu
   Source ID: vanderbilt.edu
   Current events_url: https://www.vanderbilt.edu/national-security/events
   Triggering URL: https://www.vanderbilt.edu/national-security/events/

   📡 Fetching homepage...
      ✅ Homepage fetched (158361 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 6 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.vanderbilt.edu/about/privacy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.vanderbilt.edu/about/contact/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.vanderbilt.edu/about/accessibility/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://vanderbilt.edu/privacy...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://vanderbilt.edu/data-privacy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://vanderbilt.edu/data-use-policy...
         ✅ No restrictions
      📊 Scanned 6 page(s), 0 with restrictions, 1 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://www.vanderbilt.edu/national-security/events
      🔍 Validating events URL: https://www.vanderbilt.edu/national-security/events
      ✅ Valid events page (found: rsvp)
      ✅ Using events URL from triggering event
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.vanderbilt.edu/about/privacy/
   Legal Pages Found: 6
   False Positives Filtered: 1
   Events URL: https://www.vanderbilt.edu/national-security/events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 71693ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [22/60] Intelligence & National Security Alliance (INSA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Intelligence & National Security Alliance (INSA)
════════════════════════════════════════════════════════════════
   Website: https://www.insaonline.org
   Source ID: insaonline.org
   Current events_url: https://www.insaonline.org/events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (43186 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Terms of Use: https://www.insaonline.org/website-terms-of-use...
         ⚠️ RESTRICTIONS FOUND: data scraping, data mining
            (2 high-confidence, 0 context-confirmed)
         📍 Restriction source: https://www.insaonline.org/website-terms-of-use (2 terms)
      📜 Scanning Privacy Policy: https://www.insaonline.org/privacy...
         ⚠️ RESTRICTIONS FOUND: data scraping, data mining
            (2 high-confidence, 0 context-confirmed)
         📍 Restriction source: https://www.insaonline.org/privacy (2 terms)
      📜 Scanning Legal Page: https://www.insaonline.org/contact-insa...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.insaonline.org/site-map...
         ✅ No restrictions
      📊 Scanned 4 page(s), 2 with restrictions, 2 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.insaonline.org/events
      🔍 Validating events URL: https://www.insaonline.org/events
      ✅ Valid events page (found: calendar of events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.insaonline.org/website-terms-of-use
   Restriction Sources: 2 page(s)
      • https://www.insaonline.org/website-terms-of-use
      • https://www.insaonline.org/privacy
   Legal Pages Found: 4
   False Positives Filtered: 2
   Events URL: https://www.insaonline.org/events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 77155ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [23/60] International Association of Privacy Professionals (IAPP)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: International Association of Privacy Professionals (IAPP)
════════════════════════════════════════════════════════════════
   Website: https://iapp.org
   Source ID: iapp.org
   Current events_url: https://iapp.org/conferences/speak-at-an-iapp-conference/?utm_source=Promo3&utm_medium=House&utm_campaign=PSRCFP&utm_content=CS0004
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (475450 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 6 legal page(s) to scan
      📜 Scanning Privacy Policy: https://iapp.org/privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://iapp.org/about/conditions-of-use...
         ✅ No restrictions
      📜 Scanning Legal Page: https://contact.iapp.org/support/home...
         ✅ No restrictions
      📜 Scanning Legal Page: https://iapp.org/train/foundations...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://iapp.org/about/privacy-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://iapp.org/about/refund-policy...
         ✅ No restrictions
      📊 Scanned 6 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://iapp.org/conferences
      🔍 Validating events URL: https://iapp.org/conferences
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://iapp.org/events
      🔍 Validating events URL: https://iapp.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://iapp.org/calendar
      🔍 Validating events URL: https://iapp.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://iapp.org/upcoming-events
      🔍 Validating events URL: https://iapp.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://iapp.org/programs
      🔍 Validating events URL: https://iapp.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://iapp.org/conferences
      🔍 Validating events URL: https://iapp.org/conferences
      ⚠️ May not be an events listing page
      ⚠️ Using best candidate (unvalidated): https://iapp.org/conferences
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://iapp.org/privacy
   Legal Pages Found: 6
   False Positives Filtered: 0
   Events URL: https://iapp.org/conferences ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 101434ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [24/60] Jean Monnet Center of Excellence (JMCE)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Jean Monnet Center of Excellence (JMCE)
════════════════════════════════════════════════════════════════
   Website: https://jmce.unc.edu
   Source ID: jmce.unc.edu
   Current events_url: https://www.unc.edu/events/
   Triggering URL: https://jmce.unc.edu/home/events-2023-2026/europe-week-2025-panel-us-eu-foreign-policy-and-transatlantic-security/

   📡 Fetching homepage...
      ✅ Homepage fetched (72889 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://europe.unc.edu/privacy/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://jmce.unc.edu/site-map/...
         ✅ No restrictions
      📊 Scanned 1 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://jmce.unc.edu/home/events-2023-2026
      🔍 Validating events URL: https://jmce.unc.edu/home/events-2023-2026
      ⚠️ May not be an events listing page
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.unc.edu/events/
      🔍 Validating events URL: https://www.unc.edu/events/
      ✅ Valid events page (found: event calendar)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: europe@unc.edu

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://europe.unc.edu/privacy/
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: https://www.unc.edu/events/ ✅
   POC Email: europe@unc.edu
   AI Org Name: N/A
   Scan Duration: 63967ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [25/60] National Cyber Summit (NCS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Cyber Summit (NCS)
════════════════════════════════════════════════════════════════
   Website: https://nationalcybersummit.com
   Source ID: nationalcybersummit.com
   Current events_url: N/A
   Triggering URL: https://www.nationalcybersummit.com/

   📡 Fetching homepage...
      ✅ Homepage fetched (29872 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (high confidence)
      📋 Reasons: Platform footer: "website powered by"; Hosted by pattern: "an similar cyber conference"
      🏢 Parent org(s) identified: similar cyber
      🔍 Looking up similar cyber's website...
      ✅ Found: https://www.sc.com (via constructed_url)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (700 bytes)
   📜 Scanning PARENT ORG for TOU: https://www.sc.com
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://nationalcybersummit.com/events
      🔍 Validating events URL: https://nationalcybersummit.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalcybersummit.com/calendar
      🔍 Validating events URL: https://nationalcybersummit.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalcybersummit.com/upcoming-events
      🔍 Validating events URL: https://nationalcybersummit.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalcybersummit.com/programs
      🔍 Validating events URL: https://nationalcybersummit.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalcybersummit.com/conferences
      🔍 Validating events URL: https://nationalcybersummit.com/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ✅ Found POC on homepage: NCS@eventpowersupport.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, no_legal_pages_flag

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: NCS@eventpowersupport.com
   AI Org Name: N/A
   Scan Duration: 111139ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, no_legal_pages_flag
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [26/60] National Cybersecurity Alliance
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Cybersecurity Alliance
════════════════════════════════════════════════════════════════
   Website: https://staysafeonline.org
   Source ID: staysafeonline.org
   Current events_url: https://staysafeonline.org/initiatives#events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (1800430 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://staysafeonline.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://staysafeonline.org/code-of-conduct...
         ✅ No restrictions
      📊 Scanned 2 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://staysafeonline.org/initiatives#events
      🔍 Validating events URL: https://staysafeonline.org/initiatives#events
      ✅ Valid events page (found: upcoming events, past events, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: name@email.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://staysafeonline.org/privacy-policy
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: https://staysafeonline.org/initiatives#events ✅
   POC Email: name@email.com
   AI Org Name: N/A
   Scan Duration: 53303ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [27/60] National Defense Industrial Association (NDIA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Defense Industrial Association (NDIA)
════════════════════════════════════════════════════════════════
   Website: https://ndia.org
   Source ID: ndia.org
   Current events_url: N/A
   Triggering URL: https://www.ndia.org/events/2026/4/21/6md3-missile-defense-conference

   📡 Fetching homepage...
      ✅ Homepage fetched (212 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⛔ Technical block detected at: https://ndia.org/cookies

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 19422ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [28/60] National Defense University
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Defense University
════════════════════════════════════════════════════════════════
   Website: N/A
   Source ID: ndu.edu
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⚠️ Homepage fetch failed: request to https://ndu.edu/ failed, reason: getaddrinfo ENOTFOUND ndu.edu
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://ndu.edu/events
      🔍 Validating events URL: https://ndu.edu/events
      ❌ Could not fetch URL (request to https://ndu.edu/events failed, reason: getaddrinfo ENOTFOUND ndu.edu)
      📍 Trying: https://ndu.edu/calendar
      🔍 Validating events URL: https://ndu.edu/calendar
      ❌ Could not fetch URL (request to https://ndu.edu/calendar failed, reason: getaddrinfo ENOTFOUND ndu.edu)
      📍 Trying: https://ndu.edu/upcoming-events
      🔍 Validating events URL: https://ndu.edu/upcoming-events
      ❌ Could not fetch URL (request to https://ndu.edu/upcoming-events failed, reason: getaddrinfo ENOTFOUND ndu.edu)
      📍 Trying: https://ndu.edu/programs
      🔍 Validating events URL: https://ndu.edu/programs
      ❌ Could not fetch URL (request to https://ndu.edu/programs failed, reason: getaddrinfo ENOTFOUND ndu.edu)
      📍 Trying: https://ndu.edu/conferences
      🔍 Validating events URL: https://ndu.edu/conferences
      ❌ Could not fetch URL (request to https://ndu.edu/conferences failed, reason: getaddrinfo ENOTFOUND ndu.edu)
      ❌ Could not discover events URL

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 45529ms
   Fields Updated: tou_notes, tou_scanned_date, no_legal_pages_flag
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [29/60] National Homeland Security Association
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Homeland Security Association
════════════════════════════════════════════════════════════════
   Website: https://nationalhomelandsecurity.org
   Source ID: nationalhomelandsecurity.org
   Current events_url: https://nationalhomelandsecurity.org/documents/2025/Safe_Events_Policy_v01.07.pdf
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (66624 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 3 legal page(s) to scan
      📜 Scanning Privacy Policy: https://nationalhomelandsecurity.org/nhsa-privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://nationalhomelandsecurity.org/documents/2025/2025_Can...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://nationalhomelandsecurity.org/privacy-policy...
         ✅ No restrictions (1 false positives filtered)
      📊 Scanned 3 page(s), 0 with restrictions, 1 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://nationalhomelandsecurity.org/documents/2025/Safe_Events_Policy_v01.07.pdf
      🔍 Validating events URL: https://nationalhomelandsecurity.org/documents/2025/Safe_Events_Policy_v01.07.pdf
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://nationalhomelandsecurity.org/events
      🔍 Validating events URL: https://nationalhomelandsecurity.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalhomelandsecurity.org/calendar
      🔍 Validating events URL: https://nationalhomelandsecurity.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalhomelandsecurity.org/upcoming-events
      🔍 Validating events URL: https://nationalhomelandsecurity.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalhomelandsecurity.org/programs
      🔍 Validating events URL: https://nationalhomelandsecurity.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://nationalhomelandsecurity.org/conferences
      🔍 Validating events URL: https://nationalhomelandsecurity.org/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://nationalhomelandsecurity.org/documents/2025/Safe_Events_Policy_v01.07.pdf
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 0 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ✅ Found POC on homepage: conference.info@nationalhomelandsecurity.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://nationalhomelandsecurity.org/nhsa-privacy-policy
   Legal Pages Found: 3
   False Positives Filtered: 1
   Events URL: https://nationalhomelandsecurity.org/documents/2025/Safe_Events_Policy_v01.07.pdf ⚠️
   POC Email: conference.info@nationalhomelandsecurity.org
   AI Org Name: N/A
   Scan Duration: 95386ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [30/60] National Security Agency
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Security Agency
════════════════════════════════════════════════════════════════
   Website: N/A
   Source ID: nsa.gov
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⛔ Technical block detected (403)

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 1787ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [31/60] National Security Data and Policy Institute (NSDPI)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Security Data and Policy Institute (NSDPI)
════════════════════════════════════════════════════════════════
   Website: https://nationalsecurity.virginia.edu
   Source ID: nationalsecurity.virginia.edu
   Current events_url: N/A
   Triggering URL: https://nationalsecurity.virginia.edu/events/intelligence-studies-consortium-isc-spring-2026-symposium

   📡 Fetching homepage...
      ✅ Homepage fetched (151753 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.virginia.edu/siteinfo/privacy...
         ⛔ Blocked (403)
      📜 Scanning Legal Page: http://accessibility.virginia.edu/...
         ⛔ Blocked (403)
      📊 Scanned 0 page(s), 0 with restrictions, 0 false positives filtered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.virginia.edu/siteinfo/privacy
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 46480ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [32/60] National Security Space Association (NSSA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: National Security Space Association (NSSA)
════════════════════════════════════════════════════════════════
   Website: https://nssaspace.org/
   Source ID: N/A
   Current events_url: https://nssaspace.org/upcoming/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (108523 bytes)
   🔍 Checking for JavaScript rendering...
      ⚠️ JavaScript-rendered site detected (high confidence)
      📋 Reasons: Noscript warning: "javascript is required"
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 5 legal page(s) to scan
      📜 Scanning Privacy Policy: https://nssaspace.org/privacy-policy/...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Legal Page: https://nssaspace.org/contact/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://nssaspace.org/privacy...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://nssaspace.org/privacy-policy...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://nssaspace.org/legal/privacy...
         ✅ No restrictions (1 false positives filtered)
      📊 Scanned 5 page(s), 0 with restrictions, 4 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://nssaspace.org/upcoming/
      🔍 Validating events URL: https://nssaspace.org/upcoming/
      ✅ Valid events page (found: upcoming events)
      ✅ Using events URL from homepage link
   👤 Gathering POC info...
      ✅ Found POC on homepage: info@nssaspace.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://nssaspace.org/privacy-policy/
   Legal Pages Found: 5
   False Positives Filtered: 4
   Events URL: https://nssaspace.org/upcoming/ ✅
   POC Email: info@nssaspace.org
   AI Org Name: N/A
   Scan Duration: 79029ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [33/60] New America
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: New America
════════════════════════════════════════════════════════════════
   Website: https://www.newamerica.org
   Source ID: newamerica.org
   Current events_url: https://www.newamerica.org/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (93302 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Legal Page: https://www.newamerica.org/policies-and-procedures/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.newamerica.org/contact-us/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.newamerica.org/contact...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.newamerica.org/policies-and-procedures...
         ✅ No restrictions
      📊 Scanned 4 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.newamerica.org/events/
      🔍 Validating events URL: https://www.newamerica.org/events/
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://www.newamerica.org/events
      🔍 Validating events URL: https://www.newamerica.org/events
      ⚠️ May not be an events listing page
      📍 Trying: https://www.newamerica.org/calendar
      🔍 Validating events URL: https://www.newamerica.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.newamerica.org/upcoming-events
      🔍 Validating events URL: https://www.newamerica.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.newamerica.org/programs
      🔍 Validating events URL: https://www.newamerica.org/programs
      ⚠️ May not be an events listing page
      📍 Trying: https://www.newamerica.org/conferences
      🔍 Validating events URL: https://www.newamerica.org/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://www.newamerica.org/events/
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 1 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.newamerica.org/policies-and-procedures/
   Legal Pages Found: 4
   False Positives Filtered: 0
   Events URL: https://www.newamerica.org/events/ ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 71449ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [34/60] Nuclear Energy Institute (NEI)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Nuclear Energy Institute (NEI)
════════════════════════════════════════════════════════════════
   Website: https://www.nei.org/
   Source ID: N/A
   Current events_url: https://www.nei.org/conferences#section1
   Triggering URL: N/A

   📡 Fetching homepage...
      ⛔ Technical block detected (403)

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 2319ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [35/60] Parliamentary Intelligence-Security Forum (PI-SF)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Parliamentary Intelligence-Security Forum (PI-SF)
════════════════════════════════════════════════════════════════
   Website: https://pi-sf.com
   Source ID: pi-sf.com
   Current events_url: N/A
   Triggering URL: https://pi-sf.com/

   📡 Fetching homepage...
      ✅ Homepage fetched (118348 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 1 legal page(s) to scan
      📜 Scanning Legal Page: https://pi-sf.com/contact/...
         ✅ No restrictions
      📊 Scanned 1 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://pi-sf.com/events
      🔍 Validating events URL: https://pi-sf.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://pi-sf.com/calendar
      🔍 Validating events URL: https://pi-sf.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://pi-sf.com/upcoming-events
      🔍 Validating events URL: https://pi-sf.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://pi-sf.com/programs
      🔍 Validating events URL: https://pi-sf.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://pi-sf.com/conferences
      🔍 Validating events URL: https://pi-sf.com/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://pi-sf.com/contact/
   Legal Pages Found: 1
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 94366ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [36/60] Potomac Officers Club
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Potomac Officers Club
════════════════════════════════════════════════════════════════
   Website: https://potomacofficersclub.com
   Source ID: potomacofficersclub.com
   Current events_url: https://potomacofficersclub.com/govcon-events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (151772 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 8 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.potomacofficersclub.com/privacy-policy/...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://potomacofficersclub.com/terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://potomacofficersclub.com/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://potomacofficersclub.com/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://potomacofficersclub.com/privacy-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://potomacofficersclub.com/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://potomacofficersclub.com/legal/privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://potomacofficersclub.com/developers/terms...
         ✅ No restrictions
      📊 Scanned 8 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://potomacofficersclub.com/govcon-events/
      🔍 Validating events URL: https://potomacofficersclub.com/govcon-events/
      ✅ Valid events page (found: upcoming events, past events, register now)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /contact: support@potomacofficersclub.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.potomacofficersclub.com/privacy-policy/
   Legal Pages Found: 8
   False Positives Filtered: 0
   Events URL: https://potomacofficersclub.com/govcon-events/ ✅
   POC Email: support@potomacofficersclub.com
   AI Org Name: N/A
   Scan Duration: 119978ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [37/60] Professional Services Council (PSC)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Professional Services Council (PSC)
════════════════════════════════════════════════════════════════
   Website: https://pscouncil.org
   Source ID: pscouncil.org
   Current events_url: https://www.pscouncil.org/psc/Events
   Triggering URL: https://www.pscouncil.org/psc/Events/__p/ce/Upcoming_Events.aspx?hkey=e7d9ae34-3f01-4c8a-aa1f-d641d000ee66

   📡 Fetching homepage...
      ✅ Homepage fetched (414280 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 46 legal page(s) to scan
      📜 Scanning Legal Page: https://pscouncil.org/PscStaff...
         ✅ No restrictions
      📜 Scanning Privacy Policy: http://www.pscouncil.org/__p/PSC_Privacy_Policy_and_Terms_of...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/terms...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://pscouncil.org/terms-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/terms-use...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://pscouncil.org/terms-of-service...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://pscouncil.org/tos...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/conditions-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/site-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/website-terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://pscouncil.org/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://pscouncil.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://pscouncil.org/data-privacy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/cookie-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/cookies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/gdpr...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/ccpa...
         ✅ No restrictions
      📜 Scanning Legal: https://pscouncil.org/legal...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://pscouncil.org/legal/privacy...
         ✅ No restrictions
      📜 Scanning Legal: https://pscouncil.org/legal-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/disclaimer...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://pscouncil.org/copyright...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://pscouncil.org/copyright-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/intellectual-property...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/policies-and-procedures...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/site-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/website-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/usage-policy...
         ✅ No restrictions
      📜 Scanning User Agreement: https://pscouncil.org/user-agreement...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://pscouncil.org/acceptable-use...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://pscouncil.org/acceptable-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/aup...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/code-of-conduct...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/api-terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/api-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/developer-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://pscouncil.org/developers/terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/data-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/about/media/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/reproduction-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://pscouncil.org/content-permissions...
         ✅ No restrictions
      📊 Scanned 46 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://www.pscouncil.org/psc/Events
      🔍 Validating events URL: https://www.pscouncil.org/psc/Events
      ⚠️ May not be an events listing page
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://pscouncil.org/psc/Events/__p/ce/Upcoming_Events.aspx?hkey=e7d9ae34-3f01-4c8a-aa1f-d641d000ee66
      🔍 Validating events URL: https://pscouncil.org/psc/Events/__p/ce/Upcoming_Events.aspx?hkey=e7d9ae34-3f01-4c8a-aa1f-d641d000ee66
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://pscouncil.org/events
      🔍 Validating events URL: https://pscouncil.org/events
      ⚠️ May not be an events listing page
      📍 Trying: https://pscouncil.org/calendar
      🔍 Validating events URL: https://pscouncil.org/calendar
      ⚠️ May not be an events listing page
      📍 Trying: https://pscouncil.org/upcoming-events
      🔍 Validating events URL: https://pscouncil.org/upcoming-events
      ⚠️ May not be an events listing page
      📍 Trying: https://pscouncil.org/programs
      🔍 Validating events URL: https://pscouncil.org/programs
      ⚠️ May not be an events listing page
      📍 Trying: https://pscouncil.org/conferences
      🔍 Validating events URL: https://pscouncil.org/conferences
      ⚠️ May not be an events listing page
      ⚠️ Using best candidate (unvalidated): https://www.pscouncil.org/psc/Events
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /about: benedetti@pscouncil.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://pscouncil.org/PscStaff
   Legal Pages Found: 46
   False Positives Filtered: 0
   Events URL: https://www.pscouncil.org/psc/Events ⚠️
   POC Email: benedetti@pscouncil.org
   AI Org Name: N/A
   Scan Duration: 133516ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [38/60] SAE Media Group
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: SAE Media Group
════════════════════════════════════════════════════════════════
   Website: https://smgconferences.com
   Source ID: smgconferences.com
   Current events_url: https://smgconferences.com/editors-corner/6319-news--gaasi-unveils-gambit-6-loitering-munition-with-airtoground-capability-for-international-cca-programs
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (320836 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 6 legal page(s) to scan
      📜 Scanning Privacy Policy: https://smgconferences.com/privacy-legals/privacy-policy/...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Privacy Policy: https://smgconferences.com/privacy-legals/code-of-conduct/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://smgconferences.com/privacy-legals/privacy-policy...
         ✅ No restrictions (3 false positives filtered)
      📜 Scanning Legal Page: https://smgconferences.com/cookies...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://smgconferences.com/privacy-legals/terms-of-use...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.smgconferences.com/privacy-legals/privacy-policy...
         ✅ No restrictions (3 false positives filtered)
      📊 Scanned 6 page(s), 0 with restrictions, 9 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://smgconferences.com/editors-corner/6319-news--gaasi-unveils-gambit-6-loitering-munition-with-airtoground-capability-for-international-cca-programs
      🔍 Validating events URL: https://smgconferences.com/editors-corner/6319-news--gaasi-unveils-gambit-6-loitering-munition-with-airtoground-capability-for-international-cca-programs
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://smgconferences.com/events
      🔍 Validating events URL: https://smgconferences.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://smgconferences.com/calendar
      🔍 Validating events URL: https://smgconferences.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://smgconferences.com/upcoming-events
      🔍 Validating events URL: https://smgconferences.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://smgconferences.com/programs
      🔍 Validating events URL: https://smgconferences.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://smgconferences.com/conferences
      🔍 Validating events URL: https://smgconferences.com/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://smgconferences.com/editors-corner/6319-news--gaasi-unveils-gambit-6-loitering-munition-with-airtoground-capability-for-international-cca-programs
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 1 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ✅ Found POC on homepage: events@saemediagroup.com

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://smgconferences.com/privacy-legals/privacy-policy/
   Legal Pages Found: 6
   False Positives Filtered: 9
   Events URL: https://smgconferences.com/editors-corner/6319-news--gaasi-unveils-gambit-6-loitering-munition-with-airtoground-capability-for-international-cca-programs ⚠️
   POC Email: events@saemediagroup.com
   AI Org Name: N/A
   Scan Duration: 84864ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [39/60] SANS Institute
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: SANS Institute
════════════════════════════════════════════════════════════════
   Website: https://sans.org
   Source ID: sans.org
   Current events_url: https://www.sans.org/cyber-security-training-events
   Triggering URL: https://www.sans.org/cyber-security-training-events/ai-summit-2026

   📡 Fetching homepage...
      ✅ Homepage fetched (455321 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 6 legal page(s) to scan
      📜 Scanning Privacy Policy: https://sans.org/legal/privacy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://sans.org/legal/terms-conditions...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://sans.org/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://sans.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://sans.org/gdpr...
         ✅ No restrictions
      📜 Scanning Legal: https://sans.org/legal...
         ✅ No restrictions
      📊 Scanned 6 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://www.sans.org/cyber-security-training-events
      🔍 Validating events URL: https://www.sans.org/cyber-security-training-events
      ✅ Valid events page (found: event details, join us)
      ✅ Using events URL from triggering event
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on /about/contact: support@sans.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://sans.org/legal/privacy
   Legal Pages Found: 6
   False Positives Filtered: 0
   Events URL: https://www.sans.org/cyber-security-training-events ✅
   POC Email: support@sans.org
   AI Org Name: N/A
   Scan Duration: 72839ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [40/60] SATShow
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: SATShow
════════════════════════════════════════════════════════════════
   Website: https://satshow.com
   Source ID: satshow.com
   Current events_url: https://mdevents.accessintel.com/satshow2026/wp-content/uploads/sites/121/2026/01/SATShow-Week-2026-Exhibitor-Services-Manual-01.14.26.pdf
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (221499 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 2 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.accessintel.com/privacypolicy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.accessintel.com/accessibility-statement...
         ✅ No restrictions
      📊 Scanned 2 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://mdevents.accessintel.com/satshow2026/wp-content/uploads/sites/121/2026/01/SATShow-Week-2026-Exhibitor-Services-Manual-01.14.26.pdf
      🔍 Validating events URL: https://mdevents.accessintel.com/satshow2026/wp-content/uploads/sites/121/2026/01/SATShow-Week-2026-Exhibitor-Services-Manual-01.14.26.pdf
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://satshow.com/events
      🔍 Validating events URL: https://satshow.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://satshow.com/calendar
      🔍 Validating events URL: https://satshow.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://satshow.com/upcoming-events
      🔍 Validating events URL: https://satshow.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://satshow.com/programs
      🔍 Validating events URL: https://satshow.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://satshow.com/conferences
      🔍 Validating events URL: https://satshow.com/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://mdevents.accessintel.com/satshow2026/wp-content/uploads/sites/121/2026/01/SATShow-Week-2026-Exhibitor-Services-Manual-01.14.26.pdf
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 1 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.accessintel.com/privacypolicy/
   Legal Pages Found: 2
   False Positives Filtered: 0
   Events URL: https://mdevents.accessintel.com/satshow2026/wp-content/uploads/sites/121/2026/01/SATShow-Week-2026-Exhibitor-Services-Manual-01.14.26.pdf ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 120270ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [41/60] Strategic Computing and Security Program (SCSP)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Strategic Computing and Security Program (SCSP)
════════════════════════════════════════════════════════════════
   Website: https://expo.scsp.ai
   Source ID: expo.scsp.ai
   Current events_url: https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240507T130000Z%2F20240508T220000Z&details=Join%20us%20May%207%20%26%208%20for%20an%20exciting%20series%20of%20events%20designed%20to%20unite%20pioneers%20of%20progress%20from%20across%20the%20global%20business%2C%20academic%2C%20and%20government%20sectors.&location=Walter%20E.%20Washington%20Convention%20Center%20Washington%2C%20DC&text=AI%20Expo%20for%20National%20Competitiveness%202024
   Triggering URL: https://expo.scsp.ai/

   📡 Fetching homepage...
      ✅ Homepage fetched (72391 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: Subdomain extracted: parent likely scsp.ai; Hosted by pattern: "produced by SCSP"
      🏢 Parent org(s) identified: SCSP
      🔍 Looking up SCSP's website...
      ✅ Found: https://www.scsp.org (via constructed_url)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (283742 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.scsp.org
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 1 legal page(s) to scan
      📜 Scanning Legal Page: https://scsp.org/contact/...
         ✅ No restrictions
      📊 Scanned 1 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240507T130000Z%2F20240508T220000Z&details=Join%20us%20May%207%20%26%208%20for%20an%20exciting%20series%20of%20events%20designed%20to%20unite%20pioneers%20of%20progress%20from%20across%20the%20global%20business%2C%20academic%2C%20and%20government%20sectors.&location=Walter%20E.%20Washington%20Convention%20Center%20Washington%2C%20DC&text=AI%20Expo%20for%20National%20Competitiveness%202024
      🔍 Validating events URL: https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240507T130000Z%2F20240508T220000Z&details=Join%20us%20May%207%20%26%208%20for%20an%20exciting%20series%20of%20events%20designed%20to%20unite%20pioneers%20of%20progress%20from%20across%20the%20global%20business%2C%20academic%2C%20and%20government%20sectors.&location=Walter%20E.%20Washington%20Convention%20Center%20Washington%2C%20DC&text=AI%20Expo%20for%20National%20Competitiveness%202024
      ⚠️ May not be an events listing page
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://expo.scsp.ai/events
      🔍 Validating events URL: https://expo.scsp.ai/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://expo.scsp.ai/calendar
      🔍 Validating events URL: https://expo.scsp.ai/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://expo.scsp.ai/upcoming-events
      🔍 Validating events URL: https://expo.scsp.ai/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://expo.scsp.ai/programs
      🔍 Validating events URL: https://expo.scsp.ai/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://expo.scsp.ai/conferences
      🔍 Validating events URL: https://expo.scsp.ai/conferences
      ❌ Could not fetch URL (Page not found)
      ⚠️ Using best candidate (unvalidated): https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240507T130000Z%2F20240508T220000Z&details=Join%20us%20May%207%20%26%208%20for%20an%20exciting%20series%20of%20events%20designed%20to%20unite%20pioneers%20of%20progress%20from%20across%20the%20global%20business%2C%20academic%2C%20and%20government%20sectors.&location=Walter%20E.%20Washington%20Convention%20Center%20Washington%2C%20DC&text=AI%20Expo%20for%20National%20Competitiveness%202024
   🔍 Checking events page for JavaScript rendering...
      ⚠️ Events page is JavaScript-rendered (high confidence)
      📋 Reasons: Events page has no actual event content (only 0 indicators found)
      ℹ️ Homepage uses SSR but events page requires JS
   👤 Gathering POC info...
      ✅ Found POC on homepage: events@scsp.ai

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: https://scsp.org/contact/
   Legal Pages Found: 1
   False Positives Filtered: 0
   Events URL: https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240507T130000Z%2F20240508T220000Z&details=Join%20us%20May%207%20%26%208%20for%20an%20exciting%20series%20of%20events%20designed%20to%20unite%20pioneers%20of%20progress%20from%20across%20the%20global%20business%2C%20academic%2C%20and%20government%20sectors.&location=Walter%20E.%20Washington%20Convention%20Center%20Washington%2C%20DC&text=AI%20Expo%20for%20National%20Competitiveness%202024 ⚠️
   POC Email: events@scsp.ai
   AI Org Name: N/A
   Scan Duration: 86474ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [42/60] Suits and Spooks
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Suits and Spooks
════════════════════════════════════════════════════════════════
   Website: https://founders.suitsandspooks.com/
   Source ID: N/A
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (96519 bytes)
   🔍 Checking for JavaScript rendering...
      ⚠️ JavaScript-rendered site detected (medium confidence)
      📋 Reasons: Very little text content (198 chars) despite large HTML (96519 chars), High script count (37) with minimal text content
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: URL pattern: subdomain suggests event site; Subdomain extracted: parent likely suitsandspooks.com
      ⚠️ No parent org name in page content
      🔍 Trying parent domain from URL: https://www.suitsandspooks.com
      ✅ Parent domain accessible (237207 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.suitsandspooks.com
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      📄 Found 44 legal page(s) to scan
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/terms...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.suitsandspooks.com/terms-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/terms-use...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://www.suitsandspooks.com/terms-of-service...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://www.suitsandspooks.com/tos...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/conditions-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/site-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/website-terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.suitsandspooks.com/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.suitsandspooks.com/privacy-policy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.suitsandspooks.com/data-privacy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/cookie-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/cookies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/gdpr...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/ccpa...
         ✅ No restrictions
      📜 Scanning Legal: https://www.suitsandspooks.com/legal...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.suitsandspooks.com/legal/privacy...
         ✅ No restrictions
      📜 Scanning Legal: https://www.suitsandspooks.com/legal-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/disclaimer...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://www.suitsandspooks.com/copyright...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://www.suitsandspooks.com/copyright-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/intellectual-property...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/policies-and-procedures...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/site-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/website-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/usage-policy...
         ✅ No restrictions
      📜 Scanning User Agreement: https://www.suitsandspooks.com/user-agreement...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://www.suitsandspooks.com/acceptable-use...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://www.suitsandspooks.com/acceptable-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/aup...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/code-of-conduct...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/api-terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/api-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/developer-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.suitsandspooks.com/developers/terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/data-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/about/media/reprint-permissio...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/reproduction-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.suitsandspooks.com/content-permissions...
         ✅ No restrictions
      📊 Scanned 44 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://founders.suitsandspooks.com/events
      🔍 Validating events URL: https://founders.suitsandspooks.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://founders.suitsandspooks.com/calendar
      🔍 Validating events URL: https://founders.suitsandspooks.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://founders.suitsandspooks.com/upcoming-events
      🔍 Validating events URL: https://founders.suitsandspooks.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://founders.suitsandspooks.com/programs
      🔍 Validating events URL: https://founders.suitsandspooks.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://founders.suitsandspooks.com/conferences
      🔍 Validating events URL: https://founders.suitsandspooks.com/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (medium confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: https://www.suitsandspooks.com/terms
   Legal Pages Found: 44
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 132669ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [43/60] Surface Navy Association (SNA)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Surface Navy Association (SNA)
════════════════════════════════════════════════════════════════
   Website: https://surfacewarfare.org
   Source ID: surfacewarfare.org
   Current events_url: https://navysnaevents.org/membership/application.php
   Triggering URL: https://surfacewarfare.org/events/national-symposium/

   📡 Fetching homepage...
      ✅ Homepage fetched (44475 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 1 legal link(s) in footer
      📄 Found 1 legal page(s) to scan
      📜 Scanning Legal Page: https://surfacewarfare.org/about/contact-us.php...
         ✅ No restrictions
      📊 Scanned 1 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://surfacewarfare.org/events
      🔍 Validating events URL: https://surfacewarfare.org/events
      ❌ Could not fetch URL (HTTP 403 - Access denied)
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://navysnaevents.org/membership/application.php
      🔍 Validating events URL: https://navysnaevents.org/membership/application.php
      ✅ Valid events page (found: upcoming events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://surfacewarfare.org/about/contact-us.php
   Legal Pages Found: 1
   False Positives Filtered: 0
   Events URL: https://navysnaevents.org/membership/application.php ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 70361ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [44/60] TeleStrategies, Inc. (TSI)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: TeleStrategies, Inc. (TSI)
════════════════════════════════════════════════════════════════
   Website: https://issworldtraining.com
   Source ID: issworldtraining.com
   Current events_url: N/A
   Triggering URL: https://www.issworldtraining.com/iss_europe/

   📡 Fetching homepage...
      ✅ Homepage fetched (19119 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://issworldtraining.com/events
      🔍 Validating events URL: https://issworldtraining.com/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://issworldtraining.com/calendar
      🔍 Validating events URL: https://issworldtraining.com/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://issworldtraining.com/upcoming-events
      🔍 Validating events URL: https://issworldtraining.com/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://issworldtraining.com/programs
      🔍 Validating events URL: https://issworldtraining.com/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://issworldtraining.com/conferences
      🔍 Validating events URL: https://issworldtraining.com/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, no_legal_pages_flag

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 57056ms
   Fields Updated: tou_notes, tou_scanned_date, no_legal_pages_flag
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [45/60] The Aspen Institute
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Aspen Institute
════════════════════════════════════════════════════════════════
   Website: https://www.aspeninstitute.org
   Source ID: N/A
   Current events_url: https://www.aspeninstitute.org/our-work/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (237393 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 5 legal page(s) to scan
      📜 Scanning Terms of Use: https://www.aspeninstitute.org/terms-of-use...
         ⚠️ RESTRICTIONS FOUND: data mining, robots
            (2 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.aspeninstitute.org/terms-of-use (3 terms)
      📜 Scanning Privacy Policy: https://www.aspeninstitute.org/privacy-policy...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Legal Page: https://www.aspeninstitute.org/contact/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.aspeninstitute.org/privacy...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Legal: https://www.aspeninstitute.org/legal...
         ✅ No restrictions
      📊 Scanned 5 page(s), 1 with restrictions, 8 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.aspeninstitute.org/our-work/events/
      🔍 Validating events URL: https://www.aspeninstitute.org/our-work/events/
      ✅ Valid events page (found: upcoming events, past events, event calendar)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.aspeninstitute.org/terms-of-use
   Restriction Sources: 1 page(s)
      • https://www.aspeninstitute.org/terms-of-use
   Legal Pages Found: 5
   False Positives Filtered: 8
   Events URL: https://www.aspeninstitute.org/our-work/events/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 83058ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [46/60] The Belfer Center for Science and International Affairs
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Belfer Center for Science and International Affairs
════════════════════════════════════════════════════════════════
   Website: https://www.belfercenter.org
   Source ID: belfercenter.org
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (82179 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 4 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.belfercenter.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.belfercenter.org/about-contact-us...
         ✅ No restrictions
      📜 Scanning Legal Page: https://accessibility.harvard.edu/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://accessibility.huit.harvard.edu/digital-accessibility...
         ✅ No restrictions
      📊 Scanned 4 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.belfercenter.org/events
      🔍 Validating events URL: https://www.belfercenter.org/events
      ✅ Valid events page (found: upcoming events, past events, rsvp)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.belfercenter.org/privacy-policy
   Legal Pages Found: 4
   False Positives Filtered: 0
   Events URL: https://www.belfercenter.org/events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 66503ms
   Fields Updated: tou_url, tou_flag, tou_notes, tou_scanned_date, events_url
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [47/60] The Brookings Institution
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Brookings Institution
════════════════════════════════════════════════════════════════
   Website: https://www.brookings.edu
   Source ID: brookings.edu
   Current events_url: https://www.brookings.edu/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (170274 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 8 legal link(s) in footer
      📄 Found 20 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.brookings.edu/brookings-institution-privacy-poli...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.brookings.edu/terms-of-use/...
         ⚠️ RESTRICTIONS FOUND: data mining, robots, spiders
            (1 high-confidence, 3 context-confirmed)
         📍 Restriction source: https://www.brookings.edu/terms-of-use/ (4 terms)
      📜 Scanning Legal Page: https://www.brookings.edu/programs/foreign-policy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/contact-brookings/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/articles/what-will-2026-bring-for-...
         ⚠️ RESTRICTIONS FOUND: harvest
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.brookings.edu/articles/what-will-2026-bring-for-us-migration-policy/ (1 terms)
      📜 Scanning Terms & Conditions: https://www.brookings.edu/events/staffing-the-government-an-...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/events/one-year-of-america-first-t...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/topics/u-s-trade-policy/...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.brookings.edu/terms...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://www.brookings.edu/terms-of-use...
         ⚠️ RESTRICTIONS FOUND: data mining, robots, spiders
            (1 high-confidence, 3 context-confirmed)
         📍 Restriction source: https://www.brookings.edu/terms-of-use (4 terms)
      📜 Scanning Terms of Service: https://www.brookings.edu/tos...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.brookings.edu/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.brookings.edu/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal: https://www.brookings.edu/legal...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.brookings.edu/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.brookings.edu/legal/privacy...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://www.brookings.edu/copyright...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/intellectual-property...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.brookings.edu/policies...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.brookings.edu/developers/terms...
         ✅ No restrictions
      📊 Scanned 20 page(s), 3 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.brookings.edu/events/
      🔍 Validating events URL: https://www.brookings.edu/events/
      ✅ Valid events page (found: past events)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"restriction_context":{"code":"validation_max_text_constraint","message":"Must be less than 2000 character(s)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.brookings.edu/terms-of-use/
   Restriction Sources: 3 page(s)
      • https://www.brookings.edu/terms-of-use/
      • https://www.brookings.edu/articles/what-will-2026-bring-for-us-migration-policy/
      • https://www.brookings.edu/terms-of-use
   Legal Pages Found: 20
   False Positives Filtered: 0
   Events URL: https://www.brookings.edu/events/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 90237ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [48/60] The Hoover Institution
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Hoover Institution
════════════════════════════════════════════════════════════════
   Website: N/A
   Source ID: hoover.org
   Current events_url: https://www.hoover.org/about/who-we-are/events
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (263499 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 5 legal page(s) to scan
      📜 Scanning Legal Page: https://hoover.org/about/contact-us...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.stanford.edu/site/accessibility/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://adminguide.stanford.edu/chapter-1/subchapter-6/polic...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://hoover.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hoover.org/policies...
         ✅ No restrictions
      📊 Scanned 5 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.hoover.org/about/who-we-are/events
      🔍 Validating events URL: https://www.hoover.org/about/who-we-are/events
      ✅ Valid events page (found: upcoming events, past events, join us)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: hoovermarketing@stanford.edu

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://hoover.org/about/contact-us
   Legal Pages Found: 5
   False Positives Filtered: 0
   Events URL: https://www.hoover.org/about/who-we-are/events ✅
   POC Email: hoovermarketing@stanford.edu
   AI Org Name: N/A
   Scan Duration: 80524ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [49/60] The Institute for National Security Studies (INSS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Institute for National Security Studies (INSS)
════════════════════════════════════════════════════════════════
   Website: https://www.inss.org.il
   Source ID: inss.org.il
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (139519 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 8 legal link(s) in footer
      📄 Found 12 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.inss.org.il/privacy/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://policies.google.com/privacy...
         ✅ No restrictions (2 false positives filtered)
      📜 Scanning Terms & Conditions: https://policies.google.com/terms...
         ✅ No restrictions (4 false positives filtered)
      📜 Scanning Legal Page: https://www.inss.org.il/subjects_tags/china/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.inss.org.il/research/israel-national-security-po...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.inss.org.il/publication/?ptype=1615...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.inss.org.il/contact-us/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.inss.org.il/accessibility/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.inss.org.il/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.inss.org.il/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal: https://www.inss.org.il/legal...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.inss.org.il/legal/privacy...
         ✅ No restrictions
      📊 Scanned 12 page(s), 0 with restrictions, 6 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.inss.org.il/event/
      🔍 Validating events URL: https://www.inss.org.il/event/
      ✅ Valid events page (found: past events, registration)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ✅ Found POC on homepage: info@inss.org.il

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.inss.org.il/privacy/
   Legal Pages Found: 12
   False Positives Filtered: 6
   Events URL: https://www.inss.org.il/event/ ✅
   POC Email: info@inss.org.il
   AI Org Name: N/A
   Scan Duration: 160383ms
   Fields Updated: tou_url, tou_flag, tou_notes, tou_scanned_date, events_url
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [50/60] The International Institute for Strategic Studies
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The International Institute for Strategic Studies
════════════════════════════════════════════════════════════════
   Website: https://www.iiss.org
   Source ID: iiss.org
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (111233 bytes)
   🔍 Checking for JavaScript rendering...
      ⚠️ JavaScript-rendered site detected (high confidence)
      📋 Reasons: Framework attribute found: ng-app, Very little text content (140 chars) despite large HTML (111233 chars), High script count (33) with minimal text content
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      📄 Found 3 legal page(s) to scan
      📜 Scanning Terms & Conditions: https://www.iiss.org/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.iiss.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.iiss.org/cookie-policy...
         ✅ No restrictions
      📊 Scanned 3 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://www.iiss.org/events
      🔍 Validating events URL: https://www.iiss.org/events
      ⚠️ May not be an events listing page
      📍 Trying: https://www.iiss.org/calendar
      🔍 Validating events URL: https://www.iiss.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.iiss.org/upcoming-events
      🔍 Validating events URL: https://www.iiss.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.iiss.org/programs
      🔍 Validating events URL: https://www.iiss.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.iiss.org/conferences
      🔍 Validating events URL: https://www.iiss.org/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ✅ Found POC on /contact-us: iiss-americas@iiss.org

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.iiss.org/terms-and-conditions
   Legal Pages Found: 3
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: iiss-americas@iiss.org
   AI Org Name: N/A
   Scan Duration: 67565ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [51/60] The National Guard Bureau
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The National Guard Bureau
════════════════════════════════════════════════════════════════
   Website: N/A
   Source ID: nationalguard.mil
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⚠️ Homepage fetch failed: request to https://nationalguard.mil/ failed, reason: getaddrinfo ENOTFOUND nationalguard.mil
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://nationalguard.mil/events
      🔍 Validating events URL: https://nationalguard.mil/events
      ❌ Could not fetch URL (request to https://nationalguard.mil/events failed, reason: getaddrinfo ENOTFOUND nationalguard.mil)
      📍 Trying: https://nationalguard.mil/calendar
      🔍 Validating events URL: https://nationalguard.mil/calendar
      ❌ Could not fetch URL (request to https://nationalguard.mil/calendar failed, reason: getaddrinfo ENOTFOUND nationalguard.mil)
      📍 Trying: https://nationalguard.mil/upcoming-events
      🔍 Validating events URL: https://nationalguard.mil/upcoming-events
      ❌ Could not fetch URL (request to https://nationalguard.mil/upcoming-events failed, reason: getaddrinfo ENOTFOUND nationalguard.mil)
      📍 Trying: https://nationalguard.mil/programs
      🔍 Validating events URL: https://nationalguard.mil/programs
      ❌ Could not fetch URL (request to https://nationalguard.mil/programs failed, reason: getaddrinfo ENOTFOUND nationalguard.mil)
      📍 Trying: https://nationalguard.mil/conferences
      🔍 Validating events URL: https://nationalguard.mil/conferences
      ❌ Could not fetch URL (request to https://nationalguard.mil/conferences failed, reason: getaddrinfo ENOTFOUND nationalguard.mil)
      ❌ Could not discover events URL

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_invalid_value","message":"Invalid value Rejected (By Mission or Org)."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 45737ms
   Fields Updated: tou_notes, tou_scanned_date, no_legal_pages_flag
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected (By Mission or Org)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [52/60] The National Security Council (NSC)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The National Security Council (NSC)
════════════════════════════════════════════════════════════════
   Website: https://www.whitehouse.gov/nsc/
   Source ID: N/A
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⚠️ Homepage fetch failed: Page not found
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      ⚠️ No legal pages found - flagging for review
   📅 Discovering events URL...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://www.whitehouse.gov/nsc/events
      🔍 Validating events URL: https://www.whitehouse.gov/nsc/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.whitehouse.gov/nsc/calendar
      🔍 Validating events URL: https://www.whitehouse.gov/nsc/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.whitehouse.gov/nsc/upcoming-events
      🔍 Validating events URL: https://www.whitehouse.gov/nsc/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.whitehouse.gov/nsc/programs
      🔍 Validating events URL: https://www.whitehouse.gov/nsc/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://www.whitehouse.gov/nsc/conferences
      🔍 Validating events URL: https://www.whitehouse.gov/nsc/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL

   💾 Updating database...
❌ Could not update organization: {"code":400,"message":"Something went wrong while processing your request.","data":{"status":{"code":"validation_required","message":"Missing required value."}}}
      ❌ Update failed

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ⚠️ YES (flagged)
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 59555ms
   Fields Updated: tou_notes, tou_scanned_date, no_legal_pages_flag
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [53/60] The RAND Corporation
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The RAND Corporation
════════════════════════════════════════════════════════════════
   Website: https://www.rand.org
   Source ID: rand.org
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⛔ Technical block detected (403)

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 2088ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [54/60] The Stanford Gordian Knot Center for National Security Innovation
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Stanford Gordian Knot Center for National Security Innovation
════════════════════════════════════════════════════════════════
   Website: https://gordianknot.fsi.stanford.edu
   Source ID: N/A
   Current events_url: https://gordianknot.fsi.stanford.edu/events?field_event_periods%5Bmin%5D=10/02/2020&field_event_periods%5Bmax%5D=10/02/2026
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (63296 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 5 legal link(s) in footer
      📄 Found 5 legal page(s) to scan
      📜 Scanning Terms & Conditions: https://www.stanford.edu/site/terms/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.stanford.edu/site/privacy/...
         ⚠️ RESTRICTIONS FOUND: automated
            (0 high-confidence, 1 context-confirmed)
         📍 Restriction source: https://www.stanford.edu/site/privacy/ (1 terms)
      📜 Scanning Legal Page: https://fsi.stanford.edu/policy...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://uit.stanford.edu/security/copyright-infringement...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.stanford.edu/site/accessibility/...
         ✅ No restrictions
      📊 Scanned 5 page(s), 1 with restrictions, 6 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://gordianknot.fsi.stanford.edu/events?field_event_periods%5Bmin%5D=10/02/2020&field_event_periods%5Bmax%5D=10/02/2026
      🔍 Validating events URL: https://gordianknot.fsi.stanford.edu/events?field_event_periods%5Bmin%5D=10/02/2020&field_event_periods%5Bmax%5D=10/02/2026
      ✅ Valid events page (found: past events, register now, rsvp)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.stanford.edu/site/privacy/
   Restriction Sources: 1 page(s)
      • https://www.stanford.edu/site/privacy/
   Legal Pages Found: 5
   False Positives Filtered: 6
   Events URL: https://gordianknot.fsi.stanford.edu/events?field_event_periods%5Bmin%5D=10/02/2020&field_event_periods%5Bmax%5D=10/02/2026 ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 80057ms
   Fields Updated: tou_notes, tou_scanned_date, restriction_source_urls, restriction_context
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [55/60] The Stimson Center
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: The Stimson Center
════════════════════════════════════════════════════════════════
   Website: https://www.stimson.org
   Source ID: stimson.org
   Current events_url: https://www.stimson.org/events/
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (651805 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 7 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.stimson.org/privacy-policy/...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.stimson.org/research/security-strategy/defense-p...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://www.stimson.org/conditions...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.stimson.org/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.stimson.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.stimson.org/legal/privacy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://www.stimson.org/code-of-conduct...
         ✅ No restrictions
      📊 Scanned 7 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://www.stimson.org/events/
      🔍 Validating events URL: https://www.stimson.org/events/
      ✅ Valid events page (found: past events, rsvp)
      ✅ Using events URL from homepage link
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.stimson.org/privacy-policy/
   Legal Pages Found: 7
   False Positives Filtered: 0
   Events URL: https://www.stimson.org/events/ ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 141221ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Mission Approved (Request Not Sent)" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [56/60] UC Berkeley Center for Long-Term Cybersecurity (CLTC)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: UC Berkeley Center for Long-Term Cybersecurity (CLTC)
════════════════════════════════════════════════════════════════
   Website: https://cybercivildefensesummit.org
   Source ID: cybercivildefensesummit.org
   Current events_url: N/A
   Triggering URL: https://cybercivildefensesummit.org/

   📡 Fetching homepage...
      ✅ Homepage fetched (83456 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ⚠️ Microsite detected (medium confidence)
      📋 Reasons: Hosted by pattern: "hosted by the UC Berkeley Center for Long"; Missing typical org sections: careers, news/press, mission/history
      🏢 Parent org(s) identified: the UC Berkeley Center for Long
      🔍 Looking up the UC Berkeley Center for Long's website...
      ✅ Found: https://www.berkeley.edu (via known_mapping_partial)
      📡 Fetching parent org homepage for TOU scan...
      ✅ Parent org homepage fetched (70138 bytes)
      ⚠️ MICROSITE SUSPECT: Medium confidence detection flagged for review
   📜 Scanning PARENT ORG for TOU: https://www.berkeley.edu
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 3 legal link(s) in footer
      📄 Found 6 legal page(s) to scan
      📜 Scanning Privacy Policy: https://www.berkeley.edu/privacy-policy/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.berkeley.edu/contact-us/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://dap.berkeley.edu/get-help/report-web-accessibility-i...
         ✅ No restrictions (1 false positives filtered)
      📜 Scanning Privacy Policy: https://www.berkeley.edu/privacy...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://www.berkeley.edu/privacy-policy...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://www.berkeley.edu/legal/privacy...
         ⚠️ Could not fetch
      📊 Scanned 1 page(s), 0 with restrictions, 1 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      🔍 Strategy 2: Searching homepage for events links...
      🔍 Strategy 3: Trying common events paths...
      📍 Trying: https://cybercivildefensesummit.org/events
      🔍 Validating events URL: https://cybercivildefensesummit.org/events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cybercivildefensesummit.org/calendar
      🔍 Validating events URL: https://cybercivildefensesummit.org/calendar
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cybercivildefensesummit.org/upcoming-events
      🔍 Validating events URL: https://cybercivildefensesummit.org/upcoming-events
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cybercivildefensesummit.org/programs
      🔍 Validating events URL: https://cybercivildefensesummit.org/programs
      ❌ Could not fetch URL (Page not found)
      📍 Trying: https://cybercivildefensesummit.org/conferences
      🔍 Validating events URL: https://cybercivildefensesummit.org/conferences
      ❌ Could not fetch URL (Page not found)
      ❌ Could not discover events URL
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ⚠️ YES (auto-rejected)
   TOU URL: https://www.berkeley.edu/privacy-policy/
   Legal Pages Found: 6
   False Positives Filtered: 1
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 83016ms
   Fields Updated: tou_notes, tou_scanned_date, microsite_detected, parent_org_website, microsite_suspect_flag, microsite_suspect_reason
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [57/60] Women in Cybersecurity (WiCyS)
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: Women in Cybersecurity (WiCyS)
════════════════════════════════════════════════════════════════
   Website: https://wicys.org
   Source ID: wicys.org
   Current events_url: https://www.wicys.org/events
   Triggering URL: https://www.wicys.org/events/wicys-2026/

   📡 Fetching homepage...
      ✅ Homepage fetched (105812 bytes)
   🔍 Checking for JavaScript rendering...
      ✅ Server-side rendered (standard scraping should work)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 4 legal link(s) in footer
      📄 Found 15 legal page(s) to scan
      📜 Scanning Legal Page: https://wicys.org/code-of-conduct/...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://wicys.org/privacy-policy/...
         ⚠️ Could not fetch
      📜 Scanning Terms of Use: https://wicys.org/terms-of-use/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://www.wicys.org/ada-statement/...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://wicys.org/contact/...
         ⚠️ Could not fetch
      📜 Scanning Terms & Conditions: https://wicys.org/terms...
         ⚠️ Could not fetch
      📜 Scanning Terms of Use: https://wicys.org/terms-of-use...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://wicys.org/privacy...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://wicys.org/privacy-policy...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://wicys.org/data-privacy...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://wicys.org/cookie-policy...
         ⚠️ Could not fetch
      📜 Scanning Terms & Conditions: https://wicys.org/legal/terms...
         ⚠️ Could not fetch
      📜 Scanning Privacy Policy: https://wicys.org/legal/privacy...
         ⚠️ Could not fetch
      📜 Scanning Legal Page: https://wicys.org/code-of-conduct...
         ⚠️ Could not fetch
      📜 Scanning Terms & Conditions: https://wicys.org/developers/terms...
         ⚠️ Could not fetch
      📊 Scanned 0 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 1: Extracting from triggering event URL...
      📍 Extracted: https://www.wicys.org/events
      🔍 Validating events URL: https://www.wicys.org/events
      ✅ Valid events page (found: calendar of events, join us)
      ✅ Using events URL from triggering event
   🔍 Checking events page for JavaScript rendering...
      ✅ Events page is server-side rendered
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_flag, tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://wicys.org/code-of-conduct/
   Legal Pages Found: 15
   False Positives Filtered: 0
   Events URL: https://www.wicys.org/events ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 44887536ms
   Fields Updated: tou_flag, tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [58/60] gartner.com
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: gartner.com
════════════════════════════════════════════════════════════════
   Website: https://gartner.com
   Source ID: gartner.com
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⛔ Technical block detected (403)

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 2170ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [59/60] hsdf.org
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: hsdf.org
════════════════════════════════════════════════════════════════
   Website: https://hsdf.org
   Source ID: hsdf.org
   Current events_url: https://hsdf.org/#upcoming
   Triggering URL: N/A

   📡 Fetching homepage...
      ✅ Homepage fetched (210108 bytes)
   🔍 Checking for JavaScript rendering...
      ⚠️ JavaScript-rendered site detected (high confidence)
      📋 Reasons: Framework attribute found: ng-app, Noscript warning: "please enable javascript", Multiple loading indicators found (2)
   🔍 Checking if site is a microsite...
      ✅ Main organization website (not a microsite)
   📜 Scanning ALL legal pages for restrictions...
      ℹ️ Using context-aware detection (v2026-01-19)
      🔍 Discovering legal pages...
      🦶 Found 2 legal link(s) in footer
      📄 Found 46 legal page(s) to scan
      📜 Scanning Legal Page: https://www.hsdf.org/about-hsdf/fulfillment-policy/...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://www.hsdf.org/privacy-statement/...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/terms...
         ✅ No restrictions
      📜 Scanning Terms of Use: https://hsdf.org/terms-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/terms-use...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://hsdf.org/terms-of-service...
         ✅ No restrictions
      📜 Scanning Terms of Service: https://hsdf.org/tos...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/terms-and-conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/conditions...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/conditions-of-use...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/site-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/website-terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://hsdf.org/privacy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://hsdf.org/privacy-policy...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://hsdf.org/data-privacy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/cookie-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/cookies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/gdpr...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/ccpa...
         ✅ No restrictions
      📜 Scanning Legal: https://hsdf.org/legal...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/legal/terms...
         ✅ No restrictions
      📜 Scanning Privacy Policy: https://hsdf.org/legal/privacy...
         ✅ No restrictions
      📜 Scanning Legal: https://hsdf.org/legal-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/disclaimer...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://hsdf.org/copyright...
         ✅ No restrictions
      📜 Scanning Copyright Notice: https://hsdf.org/copyright-notice...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/intellectual-property...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/policies-and-procedures...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/site-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/website-policies...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/usage-policy...
         ✅ No restrictions
      📜 Scanning User Agreement: https://hsdf.org/user-agreement...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://hsdf.org/acceptable-use...
         ✅ No restrictions
      📜 Scanning Acceptable Use Policy: https://hsdf.org/acceptable-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/aup...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/code-of-conduct...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/api-terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/api-policy...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/developer-terms...
         ✅ No restrictions
      📜 Scanning Terms & Conditions: https://hsdf.org/developers/terms...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/data-use-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/about/media/reprint-permissions...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/reproduction-policy...
         ✅ No restrictions
      📜 Scanning Legal Page: https://hsdf.org/content-permissions...
         ✅ No restrictions
      📊 Scanned 46 page(s), 0 with restrictions, 0 false positives filtered
   📅 Discovering events URL...
      🔍 Strategy 2: Searching homepage for events links...
      📍 Found link: https://hsdf.org/#upcoming
      🔍 Validating events URL: https://hsdf.org/#upcoming
      ✅ Valid events page (found: upcoming events)
      ✅ Using events URL from homepage link
   👤 Gathering POC info...
      ℹ️ No POC email found

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ✅ No
   TOU Flag: ✅ No
   Tech Rendering Flag: ⚙️ YES (high confidence)
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: https://www.hsdf.org/about-hsdf/fulfillment-policy/
   Legal Pages Found: 46
   False Positives Filtered: 0
   Events URL: https://hsdf.org/#upcoming ✅
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 388821ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tech_rendering_flag is true (site requires Puppeteer)

   ⏳ Waiting 3s before next org...

════════════════════════════════════════════════════════════════
📌 [60/60] rsaconference.com
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
🔍 SCANNING
────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════
🔍 SCANNING: rsaconference.com
════════════════════════════════════════════════════════════════
   Website: https://rsaconference.com
   Source ID: rsaconference.com
   Current events_url: N/A
   Triggering URL: N/A

   📡 Fetching homepage...
      ⛔ Technical block detected (403)

   💾 Updating database...
      ✅ Updated: tou_notes, tou_scanned_date

════════════════════════════════════════════════════════════════
📊 SCAN RESULTS
════════════════════════════════════════════════════════════════
   Tech Block: ⛔ YES
   TOU Flag: ⚠️ YES
   Tech Rendering Flag: ✅ No
   No Legal Pages: ✅ Found
   Microsite Suspect: ✅ No
   TOU URL: Not found
   Legal Pages Found: 0
   False Positives Filtered: 0
   Events URL: Not found ⚠️
   POC Email: Not found
   AI Org Name: N/A
   Scan Duration: 2448ms
   Fields Updated: tou_notes, tou_scanned_date
════════════════════════════════════════════════════════════════

   📝 Creating scan log...
⚠️ Could not create scan log: The requested resource wasn't found.

────────────────────────────────────────────────────────────────
🚦 SAFETY GATE CHECK
────────────────────────────────────────────────────────────────
   ❌ SAFETY GATES FAILED:
      • Status is "Rejected by Org" (must be "Live (Scraping Active)")
      • tou_flag is true (TOU restrictions detected)
      • tech_block_flag is true (site blocks access)


════════════════════════════════════════════════════════════════
📊 BATCH PROCESSING COMPLETE
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────
📈 OVERALL STATISTICS
────────────────────────────────────────────────────────────────
   Total organizations: 60
   Scanned: 60
   Scraped: 0
   Blocked (safety gates): 60
   Errors: 0

   📋 Total events found: 0
   💾 Total events saved (new): 0
   🔄 Total events updated: 0

────────────────────────────────────────────────────────────────
📋 RESULTS BY ORGANIZATION
────────────────────────────────────────────────────────────────
   ⛔ AFCEA (Armed Forces Communications and Electronics Association) and INSA (Intelligence and National Security Alliance) - BLOCKED [tou_flag, tech_rendering_flag]
   ⛔ American Enterprise Institute (AEI) - BLOCKED
   ⛔ Apex Defense - BLOCKED [no_legal_pages_flag, microsite_suspect_flag]
   ⛔ Armed Forces Communications and Electronics Association (AFCEA) - BLOCKED [tou_flag, tech_rendering_flag]
   ⛔ Atlantic Council - BLOCKED [tou_flag]
   ⛔ Billington CyberSecurity - BLOCKED
   ⛔ Center for Strategic and International Studies (CSIS) - BLOCKED
   ⛔ Center for a New American Security (CNAS) - BLOCKED [microsite_suspect_flag]
   ⛔ Chatham House - BLOCKED [tech_block_flag]
   ⛔ Consumer Technology Association (CTA) - BLOCKED
   ⛔ Council on Foreign Relations - BLOCKED
   ⛔ Cyber Threat Alliance (CTA) - BLOCKED [tech_rendering_flag]
   ⛔ Cybersecurity & Infrastructure Security Agency (CISA) - BLOCKED
   ⛔ Cybersecurity Summit (CS) - BLOCKED [tou_flag]
   ⛔ DSI Group - BLOCKED [tech_rendering_flag]
   ⛔ E.Republic LLC - BLOCKED [microsite_suspect_flag]
   ⛔ Federal Business Council, Inc. (FBC) - BLOCKED
   ⛔ GIS Software for Mapping and Spatial Analytics - BLOCKED
   ⛔ Institute for Defense & Government Advancement (IDGA) - BLOCKED [tou_flag]
   ⛔ Institute of International Finance - BLOCKED
   ⛔ Institute of National Security (INS) - BLOCKED
   ⛔ Intelligence & National Security Alliance (INSA) - BLOCKED [tou_flag]
   ⛔ International Association of Privacy Professionals (IAPP) - BLOCKED
   ⛔ Jean Monnet Center of Excellence (JMCE) - BLOCKED
   ⛔ National Cyber Summit (NCS) - BLOCKED [no_legal_pages_flag]
   ⛔ National Cybersecurity Alliance - BLOCKED
   ⛔ National Defense Industrial Association (NDIA) - BLOCKED [tech_block_flag]
   ⛔ National Defense University - BLOCKED [no_legal_pages_flag]
   ⛔ National Homeland Security Association - BLOCKED [tech_rendering_flag]
   ⛔ National Security Agency - BLOCKED [tou_flag, tech_block_flag]
   ⛔ National Security Data and Policy Institute (NSDPI) - BLOCKED [tech_block_flag]
   ⛔ National Security Space Association (NSSA) - BLOCKED [tech_rendering_flag]
   ⛔ New America - BLOCKED [tech_rendering_flag]
   ⛔ Nuclear Energy Institute (NEI) - BLOCKED [tou_flag, tech_block_flag]
   ⛔ Parliamentary Intelligence-Security Forum (PI-SF) - BLOCKED
   ⛔ Potomac Officers Club - BLOCKED
   ⛔ Professional Services Council (PSC) - BLOCKED
   ⛔ SAE Media Group - BLOCKED [tech_rendering_flag]
   ⛔ SANS Institute - BLOCKED
   ⛔ SATShow - BLOCKED [tech_rendering_flag]
   ⛔ Strategic Computing and Security Program (SCSP) - BLOCKED [tech_rendering_flag, microsite_suspect_flag]
   ⛔ Suits and Spooks - BLOCKED [tech_rendering_flag, microsite_suspect_flag]
   ⛔ Surface Navy Association (SNA) - BLOCKED
   ⛔ TeleStrategies, Inc. (TSI) - BLOCKED [no_legal_pages_flag]
   ⛔ The Aspen Institute - BLOCKED [tou_flag]
   ⛔ The Belfer Center for Science and International Affairs - BLOCKED
   ⛔ The Brookings Institution - BLOCKED [tou_flag]
   ⛔ The Hoover Institution - BLOCKED
   ⛔ The Institute for National Security Studies (INSS) - BLOCKED
   ⛔ The International Institute for Strategic Studies - BLOCKED [tech_rendering_flag]
   ⛔ The National Guard Bureau - BLOCKED [no_legal_pages_flag]
   ⛔ The National Security Council (NSC) - BLOCKED [no_legal_pages_flag]
   ⛔ The RAND Corporation - BLOCKED [tou_flag, tech_block_flag]
   ⛔ The Stanford Gordian Knot Center for National Security Innovation - BLOCKED [tou_flag]
   ⛔ The Stimson Center - BLOCKED
   ⛔ UC Berkeley Center for Long-Term Cybersecurity (CLTC) - BLOCKED [microsite_suspect_flag]
   ⛔ Women in Cybersecurity (WiCyS) - BLOCKED
   ⛔ gartner.com - BLOCKED [tou_flag, tech_block_flag]
   ⛔ hsdf.org - BLOCKED [tech_rendering_flag]
   ⛔ rsaconference.com - BLOCKED [tou_flag, tech_block_flag]

════════════════════════════════════════════════════════════════

PS C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL>
