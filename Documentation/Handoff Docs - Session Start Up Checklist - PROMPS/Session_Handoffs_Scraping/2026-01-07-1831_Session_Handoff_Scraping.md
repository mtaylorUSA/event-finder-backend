# HAND OFF FOR SCRAPING 

Please find attached background documents for the Event Finder project. Please read the attached documents and confirm your understanding of the project. We are working to continue development of scraping websites.

-----

## Attachments:

     * Session Handoff document (current status):
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\Documentation\Session Statup Checklist - PROMPS\Session_Handoffs_Scraping

-----

     * ConOp - Tech Architecture and Approach (full project reference):
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\Documentation\ConOp

-----

     * Scraper Registry Files (NEW - 2026-01-06):
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\index.js
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\base-scraper.js
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrapers\custom\insa.js

-----

     * Master Scraper:
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\scrape-all-organizations.js

-----

     * Admin Interface:
          ** C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\admin-interface.html (v9 as of 2026-01-05)

-----

## Notes for New Session:

     * The scraper registry system was created on 2026-01-06
     * All new custom scrapers go in scrapers\custom\ folder
     * Legacy individual scrapers (scrape-cfr-events.js, scrape-cisa-events.js, scrape-insa-events.js) are deprecated
     * The root-level base-scraper.js is LEGACY - use scrapers\base-scraper.js instead
     * TOU and Privacy page checking is integrated into scrapers\base-scraper.js
     * Organizations map to scrapers via the scraper_key field in PocketBase

-----

## Current Scraping Status:

     * All scrapers are currently DISABLED awaiting permissions
     * GitHub Actions workflow (Scrape Events Daily) is ENABLED but won't scrape until orgs have:
          ** Status: "Live (Scraping Active)"
          ** scraping_enabled: true
          ** tou_flag: false
          ** tech_block_flag: false
