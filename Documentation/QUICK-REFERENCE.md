# 🎯 Quick Reference Card
## National Security Events Scraper - Essential Commands

---

## 📦 SETUP (One Time)

```bash
# Install dependencies
npm install dotenv node-fetch cheerio

# Create .env file with:
# POCKETBASE_URL=https://your-url.up.railway.app
# OPENAI_API_KEY=sk-your-key-here
```

---

## 🔄 DAILY OPERATIONS

### Run Everything
```bash
# Best option: Run all scrapers + embeddings
node run-all-scrapers.js && node generate-embeddings.js
```

### Individual Commands
```bash
# Sync organizations to PocketBase
node sync-organizations.js

# Run all scrapers
node run-all-scrapers.js

# Run individual scrapers
node scrape-cisa-events.js
node scrape-insa-events.js
node scrape-openai-events.js

# Generate embeddings
node generate-embeddings.js
```

---

## 🆕 ADDING NEW ORGANIZATION

### Step 1: Add to organizations.json
```json
{
  "name": "NewOrg",
  "website": "https://neworg.gov",
  "description": "Description here",
  "events_url": "https://neworg.gov/events",
  "scraper_type": "neworg",
  "pocketbase_id": "",
  "default_timezone": "EST",
  "default_event_type": "Virtual",
  "default_cost": "Free",
  "default_target_audience": "Target audience",
  "registration_required": true
}
```

### Step 2: Sync to PocketBase
```bash
node sync-organizations.js
```

### Step 3: Create Scraper
```bash
# Copy existing scraper as template
cp scrape-cisa-events.js scrape-neworg-events.js

# Edit scrape-neworg-events.js:
# 1. Change 'cisa' to 'neworg' in find() method
# 2. Update scraping logic for new website
```

### Step 4: Add to Master Script
Edit `run-all-scrapers.js`:
```javascript
const scrapers = [
  { name: 'CISA', file: 'scrape-cisa-events.js' },
  { name: 'INSA', file: 'scrape-insa-events.js' },
  { name: 'OpenAI', file: 'scrape-openai-events.js' },
  { name: 'NewOrg', file: 'scrape-neworg-events.js' }  // Add this
];
```

### Step 5: Test
```bash
node scrape-neworg-events.js
```

---

## 🐛 TROUBLESHOOTING

### Environment Issues
```bash
# Check .env file exists
ls -la .env

# Check dependencies installed
npm list dotenv node-fetch cheerio
```

### PocketBase Connection
```bash
# Test connection (should show organizations)
curl https://your-url.up.railway.app/api/collections/organizations/records
```

### Clear Old Events (if needed)
```bash
# Use PocketBase admin panel to delete old events
# Navigate to: https://your-url.up.railway.app/_/
```

---

## 📊 CHECK STATUS

### View Events in PocketBase
```bash
# Open PocketBase admin panel
https://your-url.up.railway.app/_/

# Or use API:
curl https://your-url.up.railway.app/api/collections/events/records
```

### Check Logs
```bash
# Scraper logs show in terminal
# Look for:
# ✓ Created: [event name]
# Skipping duplicate: [event name]
# Found X events
```

---

## 🔍 TESTING CHECKLIST

### Before Running Scrapers
- [ ] PocketBase is running on Railway
- [ ] .env file has POCKETBASE_URL and OPENAI_API_KEY
- [ ] Dependencies installed (node_modules exists)
- [ ] organizations.json has all organizations

### After Running Scrapers
- [ ] No error messages in terminal
- [ ] PocketBase admin shows new events
- [ ] Duplicate events are skipped
- [ ] All 3 scrapers completed successfully

### After Generating Embeddings
- [ ] event_embeddings collection has new entries
- [ ] No OpenAI API errors
- [ ] Embeddings match event count

---

## 📁 FILE STRUCTURE

```
Event Finder/
├── .env                          # Secrets (don't commit!)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── organizations.json            # Config hub ⭐
├── sync-organizations.js         # Sync script
├── scrape-cisa-events.js        # CISA scraper
├── scrape-insa-events.js        # INSA scraper
├── scrape-openai-events.js      # OpenAI scraper
├── generate-embeddings.js        # Embeddings
├── run-all-scrapers.js          # Master script ⭐
├── PHASE1-TESTING-GUIDE.md      # Testing guide
├── BEFORE-AFTER-COMPARISON.md   # What changed
└── README-DEPLOYMENT.md         # Deployment info
```

---

## 🎯 WORKFLOW SUMMARY

```
┌─────────────────────────┐
│  organizations.json     │  ← Edit this to add/update orgs
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  sync-organizations.js  │  ← Run to sync JSON → PocketBase
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  run-all-scrapers.js    │  ← Run to scrape all events
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  generate-embeddings.js │  ← Run to create AI embeddings
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│     PocketBase DB       │  ← Events stored here
└─────────────────────────┘
```

---

## 🚀 AUTOMATION (Phase 2)

### GitHub Actions (Recommended)
```yaml
# .github/workflows/scrape.yml
name: Scrape Events
on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8am
  workflow_dispatch:      # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node run-all-scrapers.js
      - run: node generate-embeddings.js
```

---

## 💡 TIPS

### Efficient Scraping
```bash
# Run scrapers in background
node run-all-scrapers.js > scraper.log 2>&1 &

# Check log
tail -f scraper.log
```

### Batch Operations
```bash
# Create simple bash script (scrape-all.sh)
#!/bin/bash
node sync-organizations.js
node run-all-scrapers.js
node generate-embeddings.js

# Run it
chmod +x scrape-all.sh
./scrape-all.sh
```

### Schedule with Cron (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 8am)
0 8 * * * cd /path/to/project && node run-all-scrapers.js
```

---

## 🆘 COMMON ERRORS

### "Cannot find module 'dotenv'"
```bash
npm install dotenv node-fetch cheerio
```

### "Organization not found"
```bash
node sync-organizations.js
```

### "ECONNREFUSED"
Check PocketBase URL in .env

### "API error 401"
Check OPENAI_API_KEY in .env

### "Failed to create event"
Check PocketBase collections exist

---

## 📞 SUPPORT

### Documentation Files
- `PHASE1-TESTING-GUIDE.md` - Complete testing guide
- `BEFORE-AFTER-COMPARISON.md` - Code changes explained
- `README-DEPLOYMENT.md` - Deployment overview
- `ARCHITECTURE-OVERVIEW.html` - Visual architecture

### Quick Help
```bash
# Check Node version (should be 14+)
node --version

# Check npm version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ SUCCESS INDICATORS

### Healthy System
- ✅ All scrapers complete without errors
- ✅ New events appear in PocketBase
- ✅ Duplicates are skipped
- ✅ Embeddings are generated
- ✅ Logs show "✓ Created" messages

### Warning Signs
- ❌ "Failed to create" errors
- ❌ No events found
- ❌ Connection refused errors
- ❌ Missing dependencies

---

## 🎯 GOALS

**Phase 1 (Current):** Centralized configuration ✅
**Phase 2 (Next):** Automated scheduling 🔜
**Phase 3 (Future):** Frontend interface 🔮

---

**Print this card and keep it handy!** 🖨️
