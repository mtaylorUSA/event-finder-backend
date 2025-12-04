# National Security Events Aggregator - Complete Project Documentation

## Project Overview
An automated event discovery and aggregation system for national security, defense, intelligence, and cybersecurity organizations. The system scrapes events daily, uses AI to discover similar organizations, and provides a web-based admin interface for management.

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPLETE SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN MANAGES ORGANIZATIONS
   ├── Admin Interface (HTML/JS)
   │   ├── Manual entry (one-by-one)
   │   ├── Bulk CSV upload
   │   └── AI Discovery (OpenAI GPT-4o)
   │
   └── Saves to → PocketBase (Railway)

2. DAILY AUTOMATED SCRAPING
   ├── GitHub Actions (8 AM EST daily)
   │   └── Triggers → event-finder-backend repo
   │
   ├── Node.js Scrapers (cheerio)
   │   ├── Reads organizations from PocketBase
   │   ├── Scrapes each org's website/events page
   │   └── Extracts events using selectors
   │
   └── Saves events → PocketBase

3. DATA STORAGE
   └── PocketBase (Railway)
       ├── organizations collection
       ├── rejected_organizations collection
       └── events collection

4. AI EMBEDDINGS (Future/Optional)
   └── OpenAI embeddings for event similarity
```

---

## Tech Stack

### Backend
- **PocketBase**: Database and admin panel (deployed on Railway)
- **Node.js**: Scraping engine and automation
- **cheerio**: HTML parsing for event extraction
- **Railway**: Cloud hosting platform for PocketBase

### Frontend
- **HTML/CSS/JavaScript**: Single-file admin interface
- **Vanilla JS**: No frameworks, direct DOM manipulation

### AI/ML
- **OpenAI API**: GPT-4o for organization discovery
- **OpenAI Embeddings**: (Configured but not yet fully implemented for event similarity)

### Automation
- **GitHub Actions**: Scheduled daily scraping (cron: 8 AM EST)
- **Git**: Version control

### Local Development
- **http-server**: Serves admin interface locally (port 8000)
- **Node.js proxy server**: Handles OpenAI API calls to avoid CORS (port 3000)

---

## File Structure

```
Event Finder/
├── admin-interface.html          # Main admin web interface (single file)
├── proxy-server.js              # Local proxy for OpenAI API calls
├── .env                         # Environment variables (not in git)
│   ├── POCKETBASE_URL
│   ├── POCKETBASE_ADMIN_EMAIL
│   ├── POCKETBASE_ADMIN_PASSWORD
│   └── OPENAI_API_KEY
└── (other scraper files in GitHub repo)

GitHub Repo: mtaylorUSA/event-finder-backend (private)
├── .github/workflows/
│   └── scrape-events.yml       # GitHub Actions workflow
├── scrapers/
│   ├── base-scraper.js         # Centralized scraper logic
│   ├── cisa-scraper.js         # CISA events scraper
│   ├── insa-scraper.js         # INSA events scraper
│   └── openai-scraper.js       # OpenAI events scraper
├── config.js                    # Centralized configuration
└── package.json
```

---

## PocketBase Collections Schema

### Collection: `organizations`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | Text | Yes | Organization name |
| website | URL | Yes | Main website URL |
| events_url | URL | No | Events page URL (if different from website) |
| description | Text | No | Brief description |
| created | DateTime | Auto | Timestamp when added |

### Collection: `rejected_organizations`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | Text | Yes | Organization name |
| website | URL | Yes | Main website URL |
| description | Text | No | Brief description |
| created | DateTime | Auto | Timestamp when rejected |

### Collection: `events`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| organization | Relation | Yes | Links to organizations collection |
| title | Text | Yes | Event title/name |
| date | DateTime | Yes | Event date |
| url | URL | No | Event detail page URL |
| description | Text | No | Event description |
| created | DateTime | Auto | Timestamp when scraped |

---

## Admin Interface Features

### 1. Dashboard Tab
**Features:**
- Statistics cards (total organizations, total events)
- ✅ Approved Organizations list (alphabetically sorted)
- ❌ Rejected Organizations list (alphabetically sorted)
- Quick approve button on rejected orgs to move them to approved

**Workflow:**
- View all approved organizations
- View all rejected organizations
- One-click approve rejected orgs

### 2. Add Organization Tab
**Features:**
- Manual organization entry form
  - Organization name (required)
  - Website URL (required)
  - Events page URL (optional)
  - Description (optional)
- Manual event entry form
  - Select organization dropdown
  - Event title (required)
  - Event date (required)
  - Event URL (optional)
  - Event description (optional)

**Workflow:**
- Add organizations one at a time
- Add individual events to existing organizations

### 3. Bulk Upload Tab
**Features:**
- CSV drag-and-drop upload
- Progress indicator during upload
- Batch processing with success/error count

**CSV Format:**
```csv
name,website,events_url,description
Organization Name,https://example.com,https://example.com/events,Brief description
```

**Workflow:**
- Prepare CSV file with organizations
- Drag/drop or click to upload
- Watch progress bar
- See success/error summary

### 4. 🔍 Discover Organizations Tab
**Features:**
- AI-powered organization discovery using OpenAI GPT-4o
- Analyzes existing organizations to find 20 similar ones
- Shows for each suggestion:
  - Organization name
  - Website URL
  - Description
  - 2 sample events with dates
  - Approve/Reject buttons
- Smart filtering: rejected orgs never appear again
- Visual feedback: approved orgs show green checkmark, rejected show red X
- Auto-removal: cards disappear after 3 seconds

**Workflow:**
1. Click "Find Similar Organizations"
2. AI analyzes existing orgs and suggests 20 similar ones
3. Review each suggestion
4. Click "✅ Approve & Add" to add to database (will be scraped daily)
5. Click "❌ Reject" to permanently reject (won't appear again)
6. Approved orgs automatically scraped in next GitHub Actions run

---

## Key Workflows

### Adding Organizations
**Method 1: Manual Entry**
1. Go to "Add Organization" tab
2. Fill in form fields
3. Click "Add Organization"
4. Organization added to database immediately

**Method 2: Bulk CSV Upload**
1. Go to "Bulk Upload" tab
2. Prepare CSV with columns: name, website, events_url, description
3. Drag/drop CSV file
4. Watch progress indicator
5. All organizations added in batch

**Method 3: AI Discovery**
1. Go to "🔍 Discover Organizations" tab
2. Click "Find Similar Organizations"
3. Review 20 AI-generated suggestions
4. Approve/reject each one
5. Approved orgs added immediately
6. Rejected orgs saved to prevent re-suggestion

### Daily Event Scraping
**Automated Process (No Manual Intervention):**
1. GitHub Actions triggers at 8 AM EST daily
2. Fetches all organizations from PocketBase
3. For each organization:
   - Visits website/events page
   - Parses HTML using cheerio
   - Extracts event data (title, date, URL, description)
   - Saves events to PocketBase
4. Process completes automatically

### Managing Rejected Organizations
**Workflow:**
1. Go to Dashboard tab
2. Scroll to "❌ Rejected Organizations" section
3. Find organization you want to reconsider
4. Click "✅ Approve & Add" button
5. Organization moves to Approved list
6. Deleted from Rejected list
7. Will be scraped in next daily run

---

## Environment Variables (.env file)

```env
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=your-admin-email@example.com
POCKETBASE_ADMIN_PASSWORD=your-secure-password
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Security Notes:**
- Never commit .env file to git
- Store credentials in BitWarden
- Use strong passwords for PocketBase admin

---

## URLs and Access Points

### Production
- **PocketBase Database & API**: https://event-discovery-backend-production.up.railway.app
- **PocketBase Admin Panel**: https://event-discovery-backend-production.up.railway.app/_/

### Local Development
- **Admin Interface**: http://127.0.0.1:8000/admin-interface.html
- **Proxy Server**: http://localhost:3000 (internal only)

### GitHub
- **Private Repository**: https://github.com/mtaylorUSA/event-finder-backend
- **Actions Tab**: Where daily scraping runs are visible

---

## Local Development Setup

### Prerequisites
- Node.js installed
- Git installed
- .env file configured
- PocketBase collections created

### Starting Local Development

**Terminal/PowerShell Window 1: HTTP Server**
```bash
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
npx http-server -p 8000
```
Keep this running.

**Terminal/PowerShell Window 2: Proxy Server**
```bash
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
node proxy-server.js
```
Keep this running.

**Browser:**
```
http://127.0.0.1:8000/admin-interface.html
```

### Why Two Servers?
1. **http-server (port 8000)**: Serves the HTML file to your browser
2. **proxy-server (port 3000)**: Handles OpenAI API calls to avoid CORS errors

---

## Scraper Configuration

### Centralized Config (config.js)
```javascript
module.exports = {
  pocketbase: {
    url: process.env.POCKETBASE_URL,
    adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
    adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  organizations: [
    {
      name: 'CISA',
      website: 'https://www.cisa.gov',
      eventsUrl: 'https://www.cisa.gov/news-events/events',
      selectors: {
        eventItems: '.item',
        title: '.title',
        date: '.date',
        link: 'a',
        description: '.description'
      }
    },
    // ... more organizations
  ]
};
```

### Base Scraper Pattern
All scrapers inherit from `base-scraper.js`:
- Authenticate with PocketBase
- Fetch organization data
- Parse HTML with cheerio
- Extract events using CSS selectors
- Save to PocketBase events collection
- Handle errors gracefully

---

## GitHub Actions Workflow

### Schedule
- **Trigger**: Daily at 8:00 AM EST
- **Cron**: `0 13 * * *` (UTC, which is 8 AM EST)

### Workflow Steps
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Load environment secrets
5. Run scrapers sequentially
6. Report success/failure

### Secrets Required (in GitHub repo settings)
- `POCKETBASE_URL`
- `POCKETBASE_ADMIN_EMAIL`
- `POCKETBASE_ADMIN_PASSWORD`
- `OPENAI_API_KEY`

---

## Current Organizations Being Scraped

### Phase 1 (Initial Setup)
1. **CISA** (Cybersecurity and Infrastructure Security Agency)
2. **INSA** (Intelligence and National Security Alliance)
3. **OpenAI** (AI research and deployment)

### Phase 2 (Added via Admin)
4. **Potomac Officers Club** (Defense industry events)

### Phase 3+ (Discovery Engine)
- Additional organizations added via AI discovery
- Organizations approved by admin
- Dynamically growing list

---

## AI Discovery Feature Details

### How It Works
1. **Fetch Context**: Retrieves all approved organizations from PocketBase
2. **Build Prompt**: Creates context about existing orgs for GPT-4o
3. **API Call**: Sends to OpenAI via local proxy server
4. **Parse Response**: Extracts 20 suggested organizations with sample events
5. **Filter**: Removes previously rejected organizations
6. **Display**: Shows suggestions with approve/reject options

### Prompt Structure
```
You are helping discover new national security and defense 
organizations similar to these existing ones:

- CISA (https://www.cisa.gov)
- INSA (https://www.insa.org)
- OpenAI (https://openai.com)
...

Please suggest 20 different organizations in the national security, 
defense, intelligence, or cybersecurity space that are similar to 
the ones listed above.

Format: JSON array with name, website, description, sample_events
```

### Smart Features
- **Deduplication**: Never suggests rejected orgs again
- **Persistent Storage**: Rejected orgs saved to database
- **One-Click Approval**: Approved orgs immediately added
- **Visual Feedback**: 3-second confirmation before removal
- **Free**: Uses existing OpenAI API key (no Claude API cost)

---

## Design Decisions & Rationale

### Why Single-File Admin Interface?
- Easy to deploy and update
- No build process required
- All code visible and editable
- Works with simple HTTP server

### Why Local Proxy Server?
- Browser CORS restrictions block direct OpenAI API calls from local files
- Proxy adds necessary headers
- Keeps API key secure (not exposed in browser)

### Why PocketBase?
- Lightweight, fast setup
- Built-in admin panel
- RESTful API
- Easy authentication
- Perfect for MVP/prototype

### Why OpenAI Instead of Claude for Discovery?
- User already has OpenAI API key
- Free within existing credits
- No additional cost or signup needed
- GPT-4o performs well for this task

### Why GitHub Actions for Scraping?
- Free for public/private repos
- Reliable scheduling
- Cloud-based (no local machine needed)
- Easy to monitor and debug

---

## Common Tasks

### Add a New Organization Manually
1. Open admin interface
2. Go to "Add Organization" tab
3. Fill in name, website, events_url (optional), description (optional)
4. Click "Add Organization"
5. Done! Will be scraped in next daily run

### Bulk Add Organizations from CSV
1. Create CSV with headers: name, website, events_url, description
2. Open admin interface
3. Go to "Bulk Upload" tab
4. Drag CSV file to upload area
5. Watch progress bar
6. Review success/error count

### Discover New Organizations with AI
1. Open admin interface
2. Go to "🔍 Discover Organizations" tab
3. Click "Find Similar Organizations"
4. Wait 10-30 seconds for AI to generate suggestions
5. Review each of 20 suggestions
6. Click "✅ Approve & Add" or "❌ Reject" for each
7. Approved orgs added immediately, rejected orgs never appear again

### View All Events
1. Go to PocketBase admin panel
2. Navigate to "events" collection
3. Filter by organization, date, or search

### Check Scraping Status
1. Go to GitHub repo: mtaylorUSA/event-finder-backend
2. Click "Actions" tab
3. View recent workflow runs
4. Click on run to see detailed logs

### Approve a Previously Rejected Organization
1. Open admin interface
2. Go to "Dashboard" tab
3. Scroll to "❌ Rejected Organizations"
4. Find organization
5. Click "✅ Approve & Add" button
6. Organization moves to Approved list

---

## Troubleshooting

### Admin Interface Won't Load
**Problem**: Blank screen or errors
**Solution**:
1. Check that both servers are running (http-server and proxy-server)
2. Open browser console (F12) to see errors
3. Verify URL is exactly: http://127.0.0.1:8000/admin-interface.html
4. Try hard refresh: Ctrl+Shift+R

### Discovery Feature Not Working
**Problem**: "Error: Failed to get AI suggestions"
**Solutions**:
1. Check proxy-server.js is running: `node proxy-server.js`
2. Verify .env file has OPENAI_API_KEY
3. Check OpenAI API key is valid and has credits
4. Look at proxy server console for error messages

### Organizations Not Being Scraped
**Problem**: No new events appearing
**Solutions**:
1. Check GitHub Actions logs for errors
2. Verify organization has events_url or website
3. Check scraper selectors match website structure
4. Verify PocketBase credentials in GitHub Secrets

### Can't Login to Admin Interface
**Problem**: "Invalid credentials" error
**Solutions**:
1. Verify email/password in .env file
2. Try logging into PocketBase admin panel directly
3. Check credentials stored in BitWarden
4. Reset password in PocketBase admin panel if needed

---

## Future Enhancements / Roadmap

### Planned Features
- [ ] Event embeddings for similarity search
- [ ] Duplicate event detection
- [ ] Event categorization/tagging
- [ ] Email notifications for new events
- [ ] Public event calendar view
- [ ] Advanced search and filtering
- [ ] Export events to CSV/ICS
- [ ] Organization health monitoring (check if website is down)
- [ ] Scraper performance metrics

### Potential Improvements
- [ ] Add more scrapers for specific organizations
- [ ] Improve date parsing (handle more formats)
- [ ] Add event images/thumbnails
- [ ] Implement user roles (admin, viewer)
- [ ] Mobile-responsive admin interface
- [ ] Dark mode option

---

## User Preferences & Notes

### Development Preferences
- Always provide complete copy/paste code (no line-by-line edits)
- Step-by-step commands one at a time
- Always default to free options using existing subscriptions
- Start instructions with the app being used (e.g., "FIREFOX:", "FILE EXPLORER:")

### Design Preferences
- Approve organizations (not individual events)
- Events auto-scraped after org approval
- Show 20 org suggestions per discovery run
- Allow approving 1-n organizations at a time
- 3-second visual feedback before removing cards

---

## Important Notes

### Security
- Never commit .env file to git
- Keep API keys secure in BitWarden
- Use Railway environment variables for production secrets
- Admin interface has authentication required

### Data Management
- PocketBase auto-creates id, created, updated fields
- Relations use organization IDs
- Dates stored in ISO format
- All text fields support Unicode

### Limitations
- PocketBase free tier on Railway (check limits)
- OpenAI API costs (free tier: $5 credit)
- GitHub Actions minutes (2,000/month free for private repos)
- Local servers must run for admin interface to work

---

## Quick Reference Commands

### Start Development
```bash
# Terminal 1
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
npx http-server -p 8000

# Terminal 2 (new tab)
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
node proxy-server.js
```

### Stop Servers
- Press `Ctrl+C` in each terminal window

### Update Admin Interface
1. Download new admin-interface.html
2. Replace old file in Event Finder folder
3. Refresh browser (F5)

---

## Contact & Resources

### Key URLs
- PocketBase: https://event-discovery-backend-production.up.railway.app/_/
- GitHub Repo: https://github.com/mtaylorUSA/event-finder-backend
- Railway Dashboard: https://railway.app

### Documentation
- PocketBase Docs: https://pocketbase.io/docs/
- GitHub Actions Docs: https://docs.github.com/en/actions
- OpenAI API Docs: https://platform.openai.com/docs

---

## Version History

### v3.0 - AI Discovery Engine (Current)
- ✅ AI-powered organization discovery using OpenAI GPT-4o
- ✅ Smart rejection system with persistent storage
- ✅ Approve rejected orgs with one click
- ✅ Alphabetically sorted organization lists
- ✅ Visual feedback for approve/reject actions
- ✅ Automatic filtering of rejected orgs from suggestions

### v2.0 - Automated Daily Scraping
- ✅ GitHub Actions workflow for daily scraping
- ✅ Centralized configuration system
- ✅ Updated scrapers for CISA, INSA, OpenAI
- ✅ 8 AM EST daily schedule

### v1.0 - Initial Admin Interface
- ✅ Dashboard with statistics
- ✅ Manual organization entry
- ✅ Manual event entry
- ✅ Bulk CSV upload
- ✅ PocketBase integration
- ✅ Authentication

---

**Last Updated**: November 15, 2025
**Status**: Production Ready
**Maintainer**: mtaylorUSA
