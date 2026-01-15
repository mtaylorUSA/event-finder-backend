# Event Finder Backend - Dynamic Scraper System

## Overview

This is the backend scraping system for the National Security Events Aggregator. It automatically scrapes events from all organizations stored in PocketBase.

## Features

✅ **Dynamic Organization Scraping** - Automatically scrapes ALL organizations in PocketBase  
✅ **Generic Event Detection** - Uses common patterns to find events on any website  
✅ **Duplicate Prevention** - Skips events that already exist in the database  
✅ **Intelligent Date Parsing** - Handles multiple date formats  
✅ **Automatic Daily Runs** - GitHub Actions runs at 8 AM EST every day  
✅ **Manual Triggering** - Can also run manually from GitHub Actions tab

## How It Works

1. **Fetch Organizations**: Connects to PocketBase and retrieves all organizations
2. **Scrape Each Website**: Visits each organization's website or events page
3. **Extract Events**: Uses common HTML patterns to find event information
4. **Parse & Validate**: Extracts title, date, URL, and description
5. **Save to Database**: Stores new events in PocketBase (skips duplicates)

## Files

- **`base-scraper.js`** - Core scraping logic with generic event detection
- **`scrape-all-organizations.js`** - Main script that processes all organizations
- **`.github/workflows/scrape-events.yml`** - GitHub Actions workflow for daily automation
- **`package.json`** - Dependencies and scripts
- **Legacy scrapers** (optional):
  - `scrape-cisa-events.js` - Custom CISA scraper
  - `scrape-insa-events.js` - Custom INSA scraper
  - `scrape-openai-events.js` - Custom OpenAI scraper

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env

# Edit .env with your PocketBase credentials
nano .env

# Run the scraper
npm run scrape
```

### Environment Variables

Create a `.env` file:

```env
POCKETBASE_URL=https://your-pocketbase-instance.up.railway.app
POCKETBASE_ADMIN_EMAIL=your-email@example.com
POCKETBASE_ADMIN_PASSWORD=your-secure-password
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

## Usage

### Run All Organizations (Recommended)

```bash
npm run scrape
# or
node scrape-all-organizations.js
```

### Run Individual Scrapers (Legacy)

```bash
npm run scrape:cisa
npm run scrape:insa
npm run scrape:openai
```

## GitHub Actions Setup

The scraper runs automatically via GitHub Actions.

### Required Secrets

Add these in: **Settings → Secrets and variables → Actions**

- `POCKETBASE_URL`
- `POCKETBASE_ADMIN_EMAIL`
- `POCKETBASE_ADMIN_PASSWORD`
- `OPENAI_API_KEY`

### Schedule

- **Automatic**: Daily at 8:00 AM EST (13:00 UTC)
- **Manual**: Click "Actions" tab → "Scrape Events Daily" → "Run workflow"

## How Generic Scraping Works

The base scraper tries multiple common patterns to find events:

### Event Container Selectors
```javascript
'.event, .event-item, .event-card, .calendar-event'
'article[class*="event"]'
'div[class*="event"]'
'[itemtype*="Event"]'
```

### Data Extraction
- **Title**: Looks for `h1-h4`, `.title`, links, or first line of text
- **Date**: Searches for `.date`, `time` tags, `datetime` attributes
- **URL**: Finds links and converts relative URLs to absolute
- **Description**: Extracts from `.description` or paragraph tags

### Date Parsing
Handles multiple formats:
- ISO: `2024-11-15T10:00:00Z`
- US Format: `November 15, 2024` or `Nov 15 2024`
- Slash Format: `11/15/2024`
- Hyphen Format: `2024-11-15`

## Custom Scrapers

If an organization needs custom scraping logic:

1. Keep the generic scraper running (it won't break anything)
2. Create a custom scraper in a separate file
3. Add organization-specific selectors and parsing logic
4. Both can run - custom scraper will find more events

## Troubleshooting

### No Events Found

**Possible causes:**
- Website structure doesn't match common patterns
- Events page requires JavaScript to load
- Website blocking automated access

**Solutions:**
- Create a custom scraper for that organization
- Check if `events_url` is correctly set in PocketBase
- Inspect the website's HTML to find correct selectors

### Duplicate Events

The scraper checks for duplicates based on:
- Organization ID
- Event title
- Event date

If duplicates still appear, it may be due to:
- Slight differences in title text
- Date parsing variations

### Rate Limiting

The scraper includes:
- 2-second delay between organizations
- 15-second timeout per request
- Proper User-Agent header

If you encounter rate limiting, increase the delay in `scrape-all-organizations.js`.

## Adding New Organizations

Organizations are managed via the **Admin Interface**, not in code!

1. Open the admin interface
2. Go to "Add Organization" or "Bulk Upload" or "🔍 Discover Organizations"
3. Add organizations with their website and optional events URL
4. Next scraper run will automatically include them

## Monitoring

### Check GitHub Actions Logs

1. Go to repository → Actions tab
2. Click on latest "Scrape Events Daily" run
3. Click on "scrape" job
4. Expand "Run dynamic scraper" step
5. Review results for each organization

### Check PocketBase

1. Login to PocketBase admin panel
2. Go to Collections → events
3. Filter by `created` date to see new events
4. Check which organizations have events

## Performance

- **Average runtime**: 2-5 minutes for 15 organizations
- **Timeout per org**: 15 seconds
- **Delay between orgs**: 2 seconds
- **Success rate**: Varies by website structure

## Future Enhancements

- [ ] Machine learning to detect event patterns
- [ ] JavaScript rendering for dynamic websites (Puppeteer)
- [ ] Automatic selector learning
- [ ] Organization health monitoring
- [ ] Email notifications for scraping failures
- [ ] Custom scraper templates
- [ ] Event categorization/tagging

## Version History

### v3.0 - Dynamic Multi-Organization Scraper
- ✅ Generic event detection
- ✅ Scrapes all PocketBase organizations
- ✅ No hardcoded organization list
- ✅ Duplicate prevention
- ✅ Node.js 20 compatibility

### v2.0 - Automated Daily Scraping
- ✅ GitHub Actions workflow
- ✅ Individual CISA, INSA, OpenAI scrapers
- ✅ Scheduled runs

### v1.0 - Initial Implementation
- ✅ Basic scraping functionality
- ✅ PocketBase integration

## License

MIT

## Author

mtaylorUSA

---

**Need help?** Check the main project documentation or GitHub Issues.
