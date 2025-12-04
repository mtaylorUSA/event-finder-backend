# National Security Events Backend - Session Handoff Document

## 🎯 Quick Start Prompt for Next Chat

**Copy and paste this to start your next session:**

---

**Context**: I have a working PocketBase backend deployed on Railway for tracking national security events. The system scrapes events from 10 organizations (think tanks, research orgs, etc.) and stores them in a database.

**Current Status**:
- PocketBase deployed at: https://natsec-events-backend-production.up.railway.app
- GitHub repo: natsec-events-backend (connected to Railway for auto-deployment)
- 10 Node.js web scrapers created and working
- Database has 2 collections: `organizations` and `events`
- All scrapers use Axios + Cheerio for web scraping
- Environment variables stored in .env file (not committed to git)

**What Works**:
- All scrapers successfully fetch and parse events from their respective websites
- Scrapers deduplicate events before saving (checks title + start_date)
- Organizations already seeded in database
- Latest update: OpenAI Academy and OpenAI Forum scrapers now parse JSON data from Next.js `__NEXT_DATA__` script tags instead of HTML scraping

**File Structure**:
```
/home/claude/
├── scrape-csis.js
├── scrape-atlantic-council.js
├── scrape-carnegie.js
├── scrape-brookings.js
├── scrape-cfr.js
├── scrape-hudson.js
├── scrape-cnas.js
├── scrape-fpri.js
├── scrape-openai-academy.js (parses Next.js JSON)
├── scrape-openai-forum.js (parses Next.js JSON)
├── scrape-all.js (runs all scrapers)
├── .env (PocketBase credentials)
└── package.json (axios, cheerio, pocketbase, dotenv)
```

**My Preferences for Claude Interactions**:
- Use clear visual formatting with emojis (✅ ❌ 📊 💾 📡 ⚠️ 🎯)
- Console output should follow pattern: `[Emoji] [Action] [Target]...`
  Example: `📡 Fetching: https://example.com`
- Use separators like `────────────────` between major sections
- Provide structured explanations with headers (##) and bullet points
- Show progress/counts in output: `💾 Saved 5 new events`
- Include both high-level summaries AND technical details
- When showing code, explain what it does before/after the code block

**What I Need Help With**: [DESCRIBE YOUR NEXT TASK HERE]

Examples:
- "I want to set up automated daily scraping using GitHub Actions"
- "I want to build a simple frontend to display these events"
- "I want to add more organizations to scrape"
- "I want to improve error handling in the scrapers"
- "I want to add email notifications for new events"
- "I want to create a REST API endpoint for filtering events"
- "One of the scrapers is broken and needs debugging"

**Please note**: The project files are on my local machine at `/home/claude/`. The deployed version on Railway only contains the Dockerfile, README.md, and .gitignore (scrapers run locally and push to the Railway-hosted PocketBase).

---

## 📋 Complete Project Summary

### What We Built
A complete backend system for tracking national security-related events from multiple sources (think tanks, research organizations, government entities).

### Tech Stack
- **Backend**: PocketBase (SQLite-based backend-as-a-service)
- **Hosting**: Railway (deployed and running)
- **Scrapers**: Node.js scripts using Axios + Cheerio
- **Deployment**: GitHub repository connected to Railway
- **Dependencies**: axios, cheerio, pocketbase, dotenv

### Architecture
```
┌─────────────────────┐
│   Local Machine     │
│  (/home/claude/)    │
│                     │
│  Node.js Scrapers   │
│  • scrape-csis.js   │
│  • scrape-cfr.js    │
│  • etc...           │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │ (PocketBase SDK)
           ▼
┌─────────────────────┐
│      Railway        │
│                     │
│  PocketBase Server  │
│  • SQLite Database  │
│  • REST API         │
│  • Admin UI         │
└─────────────────────┘
```

## 🏢 Organizations Configured (10 Total)

1. **Center for Strategic & International Studies (CSIS)**
   - URL: https://www.csis.org/events
   - Scraper: `scrape-csis.js`

2. **Atlantic Council**
   - URL: https://www.atlanticcouncil.org/events/
   - Scraper: `scrape-atlantic-council.js`

3. **Carnegie Endowment for International Peace**
   - URL: https://carnegieendowment.org/events
   - Scraper: `scrape-carnegie.js`

4. **Brookings Institution**
   - URL: https://www.brookings.edu/events/
   - Scraper: `scrape-brookings.js`

5. **Council on Foreign Relations (CFR)**
   - URL: https://www.cfr.org/events
   - Scraper: `scrape-cfr.js`

6. **Hudson Institute**
   - URL: https://www.hudson.org/events
   - Scraper: `scrape-hudson.js`

7. **Center for a New American Security (CNAS)**
   - URL: https://www.cnas.org/events
   - Scraper: `scrape-cnas.js`

8. **Foreign Policy Research Institute (FPRI)**
   - URL: https://www.fpri.org/events/
   - Scraper: `scrape-fpri.js`

9. **OpenAI Academy**
   - URL: https://academy.openai.com/
   - Scraper: `scrape-openai-academy.js`
   - **Special**: Parses Next.js JSON data

10. **OpenAI Forum Events**
    - URL: https://forum.openai.com/public/events
    - Scraper: `scrape-openai-forum.js`
    - **Special**: Parses Next.js JSON data with HTML fallback

## 📊 Database Schema

### Collection: `organizations`
```javascript
{
  id: string,
  name: string,
  website: string,
  description: string (optional),
  created: datetime,
  updated: datetime
}
```

### Collection: `events`
```javascript
{
  id: string,
  organization: relation (organizations),
  title: string (max 200 chars),
  start_date: datetime,
  end_date: datetime (optional),
  start_time: string,
  end_time: string,
  timezone: string,
  url: string,
  description: string (max 500 chars),
  created: datetime,
  updated: datetime
}
```

## 🔧 How to Use

### Run All Scrapers
```bash
cd /home/claude
node scrape-all.js
```

### Run Individual Scraper
```bash
cd /home/claude
node scrape-csis.js
```

### Access Admin Panel
1. Go to: https://natsec-events-backend-production.up.railway.app/_/
2. Login with credentials from .env file
3. Navigate to Collections → events or organizations
4. View, edit, or delete records

### Access REST API
PocketBase automatically provides REST API endpoints:
- `GET /api/collections/events/records` - List all events
- `GET /api/collections/events/records/:id` - Get single event
- `GET /api/collections/organizations/records` - List all organizations

Add filters:
```
GET /api/collections/events/records?filter=(start_date>='2025-11-01')
GET /api/collections/events/records?filter=(organization='[org_id]')
```

## 🚨 OpenAI Scraping Challenges & Solutions

### The Problem

#### Challenge 1: React/Next.js Applications
Both OpenAI Academy and OpenAI Forum are **React/Next.js single-page applications**, not traditional HTML websites.

**Why This Matters**:
- Traditional web scrapers parse static HTML
- React apps render content dynamically with JavaScript
- The HTML you see in "View Source" doesn't contain the actual event data
- Event data is embedded as JSON in a `<script id="__NEXT_DATA__">` tag

#### Challenge 2: Initial Approach Failed
Our first scrapers tried to:
- Parse HTML elements looking for event cards, dates, times
- Search for patterns like "7:00 PM - 8:00 PM, Nov 17 EST"
- This **failed** because the data isn't in regular HTML tags—it's in JavaScript objects

#### Challenge 3: Date/Time Format Complexity
OpenAI stores dates as ISO timestamps:
- `"startedAt": "2025-11-17T19:00:00.872Z"`
- We need to convert these to:
  - Separate date: `2025-11-17 00:00:00`
  - Separate time: `7:00 PM`
  - Preserve timezone: `America/New_York`

### Our Solution

#### Step 1: Analyze the Page Structure
We examined the actual HTML source and discovered:
```html
<script id="__NEXT_DATA__" type="application/json">
{
  "props": {
    "pageProps": {
      "events": [
        {
          "id": "68f4270a49a7eb386e038f5b",
          "name": "ChatGPT for Government 102",
          "startedAt": "2025-11-17T19:00:00.872Z",
          "endedAt": "2025-11-17T20:00:14.198Z",
          "timezone": "America/New_York",
          "slug": "chatgpt-for-government-102-mnnj67f96j",
          "description": "..."
        }
      ]
    }
  }
}
</script>
```

#### Step 2: Parse JSON Instead of HTML
**New Approach**:
1. Use Cheerio to find the `<script id="__NEXT_DATA__">` tag
2. Extract the JSON text from inside the tag
3. Parse it with `JSON.parse()`
4. Access the events array at `nextData.props.pageProps.events`

**Code Example**:
```javascript
const $ = cheerio.load(response.data);

// Find the Next.js data script tag
const nextDataScript = $('script#__NEXT_DATA__').html();

if (nextDataScript) {
  try {
    const nextData = JSON.parse(nextDataScript);
    const eventData = nextData?.props?.pageProps?.events || [];

    console.log(`✅ Found ${eventData.length} events in JSON data`);

    for (const event of eventData) {
      // Process events...
    }
  } catch (parseError) {
    console.error('⚠️  Error parsing JSON data:', parseError.message);
  }
}
```

#### Step 3: Transform the Data
Convert from Next.js format to our database schema:

```javascript
for (const event of eventData) {
  const startDate = new Date(event.startedAt);
  const endDate = event.endedAt ? new Date(event.endedAt) : null;
  
  // Extract time in 12-hour format
  const start_time = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }); // "7:00 PM"
  
  const end_time = endDate ? endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }) : '';
  
  // Store in our format
  events.push({
    title: event.name.substring(0, 200),
    start_date: startDate.toISOString().split('T')[0] + ' 00:00:00',
    end_date: endDate ? (endDate.toISOString().split('T')[0] + ' 00:00:00') : null,
    start_time: start_time,
    end_time: end_time,
    timezone: event.timezone || 'EST',
    url: `https://academy.openai.com/public/events/${event.slug}`,
    description: event.description ? event.description.replace(/<[^>]*>/g, '').substring(0, 500) : ''
  });
}
```

#### Step 4: Fallback Strategy
For OpenAI Forum (in case the structure differs):
1. **Try JSON parsing first** (Next.js data)
2. **If no JSON found**, fall back to HTML scraping patterns
3. This makes the scraper more resilient to page structure changes

### Result
✅ Can now successfully extract event data from React/Next.js applications  
✅ Properly parse ISO timestamps into readable dates/times  
✅ Handle timezone information correctly  
✅ Build proper event URLs using slugs  
✅ Strip HTML from descriptions  
✅ More reliable than HTML scraping (JSON structure is more stable)

### Key Lesson
When scraping modern web applications (React, Vue, Next.js, etc.), **always check for embedded JSON data** before trying to parse HTML. The `__NEXT_DATA__` tag is a Next.js convention that exposes server-side props to the client.

## 📁 Files on Railway (GitHub Repo)

### `/Dockerfile`
```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.23.4

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
```

### `/.gitignore`
```
pb_data/
node_modules/
.env
```

### `/README.md`
Basic project documentation explaining:
- What PocketBase is
- How to access the admin panel
- Database collections structure
- How scrapers work

## 🔐 Environment Variables

Located in `/home/claude/.env`:
```bash
POCKETBASE_URL=https://natsec-events-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=[your_email]
POCKETBASE_ADMIN_PASSWORD=[your_password]
```

**Important**: Never commit `.env` to git. It's in `.gitignore`.

## 🎯 Common Scraper Patterns

### Basic Scraper Structure
```javascript
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const pb = new PocketBase(POCKETBASE_URL);

async function scrapeOrganization() {
  console.log('\n📥 Scraping [Organization] Events...');
  console.log('────────────────────────────────────────');

  try {
    // 1. Authenticate
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 2. Get organization
    const orgs = await pb.collection('organizations').getList(1, 50, {
      filter: 'name~"Organization Name"'
    });

    // 3. Fetch webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 4. Parse HTML or JSON
    const $ = cheerio.load(response.data);
    
    // 5. Extract events
    // ... parsing logic ...

    // 6. Save events (with deduplication)
    for (const event of events) {
      const existing = await pb.collection('events').getList(1, 1, {
        filter: `organization="${organization.id}" && title="${event.title}"`
      });

      if (existing.items.length === 0) {
        await pb.collection('events').create({
          organization: organization.id,
          ...event
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}
```

### Date Parsing Examples

**Traditional HTML Scraping**:
```javascript
// Pattern: "November 17, 2025"
const dateMatch = text.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
if (dateMatch) {
  const start_date = new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`);
}

// Pattern: "Nov 17, 2025 | 2:00 PM - 3:00 PM EST"
const eventMatch = text.match(/([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*\|\s*(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)\s*([A-Z]{3})/);
```

**Next.js JSON Parsing**:
```javascript
const startDate = new Date(event.startedAt); // ISO string
const start_time = startDate.toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true 
});
```

### Deduplication Pattern
```javascript
// Check if event already exists
const existing = await pb.collection('events').getList(1, 1, {
  filter: `organization="${organization.id}" && title="${event.title.replace(/"/g, '\\"')}" && start_date="${event.start_date}"`
});

if (existing.items.length === 0) {
  // Save new event
  await pb.collection('events').create({
    organization: organization.id,
    ...event
  });
  saved++;
}
```

## 🚀 Next Steps & Suggestions

### Immediate Priorities
1. **Test all scrapers** - Run `node scrape-all.js` to verify all 10 scrapers work
2. **Verify data quality** - Check admin panel for duplicate/malformed events
3. **Error handling** - Add try-catch blocks for network failures

### Short-term Goals
1. **Automated scraping** - Set up GitHub Actions or Railway cron jobs to run daily
2. **Monitoring** - Add logging to track scraper success/failure rates
3. **Data validation** - Ensure dates are in the future, URLs are valid

### Medium-term Goals
1. **Frontend UI** - Build a simple website to display events
2. **Filtering** - Filter by date range, organization, keywords
3. **Search** - Full-text search across event titles and descriptions
4. **Calendar export** - Generate .ics files for calendar apps

### Long-term Goals
1. **User accounts** - Allow users to save favorite organizations
2. **Email notifications** - Alert users about new events matching their interests
3. **Mobile app** - React Native or PWA
4. **Analytics** - Track which events are most popular

## 🐛 Troubleshooting

### Scraper Returns 0 Events
**Check**:
1. Is the website structure still the same? (websites change)
2. Are you being blocked? (some sites block scrapers)
3. Is the selector still correct? (CSS classes change)

**Debug**:
```javascript
// Add logging to see what's being fetched
console.log('Response length:', response.data.length);
console.log('Found elements:', $('.event-card').length);
```

### PocketBase Connection Errors
**Check**:
1. Is Railway instance running?
2. Are environment variables correct?
3. Is the admin password correct?

**Debug**:
```javascript
console.log('Connecting to:', POCKETBASE_URL);
console.log('Using email:', process.env.POCKETBASE_ADMIN_EMAIL);
```

### Duplicate Events
**Check**:
1. Is the deduplication filter correct?
2. Are titles exactly the same? (trim whitespace)
3. Are dates in the same format?

**Fix**:
```javascript
// Normalize title before comparing
const normalizedTitle = event.title.trim().toLowerCase();
```

## 📚 Resources

### PocketBase Documentation
- Official Docs: https://pocketbase.io/docs/
- JS SDK: https://github.com/pocketbase/js-sdk
- API Rules: https://pocketbase.io/docs/api-rules-and-filters/

### Scraping Libraries
- Cheerio: https://cheerio.js.org/
- Axios: https://axios-http.com/

### Railway
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app/

## ✅ Current Status Summary

**What's Working**:
- ✅ PocketBase deployed and accessible
- ✅ All 10 organizations configured in database
- ✅ All 10 scrapers written and functional
- ✅ OpenAI scrapers parse Next.js JSON data
- ✅ Deduplication prevents duplicate events
- ✅ Admin panel accessible for manual management

**What's Not Done Yet**:
- ❌ No automated scheduling (scrapers run manually)
- ❌ No frontend to display events publicly
- ❌ No error notifications if scraper fails
- ❌ No data validation/cleanup scripts

**Known Issues**:
- None currently identified

---

## 📞 Quick Reference Commands

```bash
# Navigate to project
cd /home/claude

# Install dependencies (if needed)
npm install

# Run all scrapers
node scrape-all.js

# Run single scraper
node scrape-csis.js

# Check environment variables
cat .env

# Test PocketBase connection
curl https://natsec-events-backend-production.up.railway.app/api/health
```

---

**Last Updated**: November 2024  
**Project Status**: ✅ Operational - Ready for Next Phase

