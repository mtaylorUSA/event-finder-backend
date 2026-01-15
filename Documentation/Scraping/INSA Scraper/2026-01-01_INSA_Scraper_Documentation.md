# INSA Scraper Documentation

**Organization:** Intelligence and National Security Alliance (INSA)
**Website:** https://www.insaonline.org
**Permission Status:** ✅ GRANTED (Deep scraping approved)
**Permission Date:** January 1, 2026

---

## 📋 Overview

This document captures the approach used to scrape INSA events, including discovery methods, page structure analysis, and implementation notes for future reference.

---

## 🔍 Discovery Process

### How We Found Event Sources

1. **Main Events Page**
   - URL: `https://www.insaonline.org/calendar-of-events`
   - Shows: Future events only
   - Structure: List of event cards with thumbnails

2. **Past Events Discovery**
   - No dedicated "past events" listing page exists
   - Past events accessible via direct URL pattern
   - Used web search: `site:insaonline.org/detail-pages/event 2024`
   - Sitemap may be available at: `https://www.insaonline.org/sitemap.xml`

3. **Event Detail Page URL Pattern**
   ```
   https://www.insaonline.org/detail-pages/event/YYYY/MM/DD/default-calendar/event-slug
   ```
   Example: `/detail-pages/event/2026/01/15/default-calendar/breakfast-panel`

---

## 🏗️ Page Structure Analysis

### Calendar Page (`/calendar-of-events`)

**HTML Structure:**
- Events listed as anchor tags with `href*="/detail-pages/event/"`
- Each event contains:
  - Title (in `<strong>` or heading element)
  - Date/time (e.g., "January 15, 2026 8:00 AM to 10:00 AM")
  - Location (e.g., "Arlington, VA" or "Virtual")
  - Thumbnail image
  - "Learn More" link to detail page

**Date Formats Found:**
- Single day: `January 15, 2026 8:00 AM to 10:00 AM`
- Multi-day: `August 27 to 28, 2024`
- Virtual events may not have times

**Location Patterns:**
- `Arlington, VA`
- `McLean, VA`
- `Herndon, VA`
- `Washington, D.C.`
- `Bethesda, MD`
- `Chantilly, VA`
- `Virtual` (for online events)

### Event Detail Pages

**Content Available:**
- Full event description/recap
- Speaker names with titles and organizations
- Event photos links
- Recording links (for past events)
- Registration links (for future events)
- Sponsor acknowledgments

**Speaker Patterns Found:**
- `The Hon. [Name], [Title], [Organization]`
- Military ranks: `Gen`, `Lt Gen`, `VADM`, `ADM`, `Col`
- Academic: `Dr. [Name]`, `PhD`
- Format: `Name, Title, Organization`

---

## ⚙️ Implementation Details

### Scraper Modes

| Mode | Command | Description |
|------|---------|-------------|
| Basic | `node scrape-insa-events.js` | Calendar page only |
| Deep | `node scrape-insa-events.js --deep` | + Detail pages |
| Past | `node scrape-insa-events.js --past` | + Historical events |

### Rate Limiting

- **Delay:** 2,500ms between requests
- **Reason:** Server returned rate limit errors during testing
- **Implementation:** `await sleep(REQUEST_DELAY_MS)` between detail page fetches

### Deduplication

- **Method:** `source_id` field = full event URL
- **Check:** Query PocketBase before creating new record
- **Update:** If deep scraping finds new description, update existing record

### Fields Captured

| Field | Source | Notes |
|-------|--------|-------|
| title | Calendar | Event name |
| url | Calendar | Full URL to detail page |
| start_date | Calendar | ISO format |
| end_date | Calendar | ISO format |
| start_time | Calendar | "8:00 AM ET" format |
| end_time | Calendar | "10:00 AM ET" format |
| location | Calendar | City, State or "Virtual" |
| description | Detail page | Full text, max 2000 chars |
| speakers | Detail page | Appended to description |
| organization | Config | INSA org ID in PocketBase |
| source_id | Generated | Full URL for deduplication |
| event_type | Parsed | "In-person" or "Virtual" |

---

## 📝 Lessons Learned

### What Worked Well
1. Using URL as source_id for reliable deduplication
2. Rate limiting prevented server blocks
3. Multiple CSS selector fallbacks for content extraction

### Challenges Encountered
1. **No past events listing** - Required web search to discover URLs
2. **Inconsistent HTML structure** - Different pages use different containers
3. **Speaker extraction** - Various formats required multiple regex patterns

### Recommendations for Future Scrapers
1. Always check for sitemap first (`/sitemap.xml`)
2. Implement rate limiting from the start (2+ seconds)
3. Use multiple CSS selectors with fallbacks
4. Test on both future and past event pages
5. Document URL patterns discovered

---

## 🔧 Maintenance Notes

### When to Re-run
- Weekly for new events
- After major INSA events for recaps

### Monitoring
- Check `last_scraped` timestamp on INSA organization record
- Review error logs for failed requests

### Known Issues
- Past events require manual URL discovery or sitemap parsing
- Some speaker names may include extra text (panels, moderators)

---

## 📅 History

| Date | Action | Notes |
|------|--------|-------|
| 2025-11-28 | Initial scraper created | Basic calendar scraping |
| 2026-01-01 | Enhanced with deep scraping | Permission granted for detail pages |
| 2026-01-01 | Added rate limiting | 2.5s delay between requests |
| 2026-01-01 | Documentation created | This file |

---

*Last Updated: January 1, 2026*
