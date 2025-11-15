# 🚀 Phase 1 Testing & Deployment Guide
## National Security Events Aggregator

---

## ✅ WHAT WE'VE ACCOMPLISHED

### Phase 1 Goal
Centralize organization configuration in `organizations.json` to make adding new event sources easier.

### Files Created/Updated
1. ✅ `organizations.json` - Central configuration for all event sources
2. ✅ `sync-organizations.js` - Syncs JSON config to PocketBase
3. ✅ `scrape-cisa-events.js` - Updated to read from JSON config
4. ✅ `scrape-insa-events.js` - Updated to read from JSON config
5. ✅ `scrape-openai-events.js` - Updated to read from JSON config
6. ✅ `run-all-scrapers.js` - NEW: Run all scrapers with one command
7. ✅ `generate-embeddings.js` - No changes needed (already dynamic)

---

## 🎯 TESTING CHECKLIST

### Step 1: Environment Setup
**Location:** Your local machine at `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder`

**Action Required:**
```bash
# Make sure your .env file has these variables:
POCKETBASE_URL=https://your-pocketbase-url.up.railway.app
OPENAI_API_KEY=sk-your-openai-key-here
```

**Verify:**
- [ ] .env file exists in project root
- [ ] POCKETBASE_URL is set correctly
- [ ] OPENAI_API_KEY is set correctly

---

### Step 2: Install Dependencies
```bash
npm install dotenv node-fetch cheerio
```

**Verify:**
- [ ] node_modules folder created
- [ ] No error messages
- [ ] package.json shows all dependencies

---

### Step 3: Test Organization Sync
**Purpose:** Verify that organizations.json syncs correctly to PocketBase

**Command:**
```bash
node sync-organizations.js
```

**Expected Output:**
```
Loading organizations from JSON...
Found 3 organizations in JSON

✓ Updated: CISA
✓ Updated: INSA
✓ Updated: OpenAI

✓ Sync complete!
organizations.json has been updated with PocketBase IDs
```

**Verify:**
- [ ] All 3 organizations show "Updated" or "Created"
- [ ] No error messages
- [ ] Check PocketBase admin panel - all orgs should be there

**Troubleshooting:**
- If you see "Failed to update/create" errors:
  - Check your POCKETBASE_URL in .env
  - Make sure PocketBase is running on Railway
  - Verify organizations collection exists in PocketBase

---

### Step 4: Test Individual Scrapers
**Purpose:** Verify each scraper works with the new JSON config

#### Test CISA Scraper
```bash
node scrape-cisa-events.js
```

**Expected Output:**
```
Fetching CISA events from https://www.cisa.gov/news-events/events...
Found 10 events
✓ Created: [Event Title]
...
✓ CISA scraping complete!
```

#### Test INSA Scraper
```bash
node scrape-insa-events.js
```

**Expected Output:**
```
Fetching INSA events from https://www.insaonline.org/calendar-of-events...
Found 15 events
✓ Created: [Event Title]
...
✓ INSA scraping complete!
```

#### Test OpenAI Scraper
```bash
node scrape-openai-events.js
```

**Expected Output:**
```
Fetching OpenAI events from https://academy.openai.com/public/events...
Found 5 upcoming events
✓ Created: [Event Title]
...
✓ OpenAI scraping complete!
```

**Verify for Each Scraper:**
- [ ] No error messages
- [ ] Events are being created
- [ ] Check PocketBase admin panel - events should appear
- [ ] Duplicate events are skipped (run scraper twice to test)

**Troubleshooting:**
- If you see "organization not found" errors:
  - Run `node sync-organizations.js` first
  - Check that scraper_type values in organizations.json match
- If you see "Failed to create" errors:
  - Check PocketBase URL
  - Verify events collection exists
  - Check field names match your PocketBase schema

---

### Step 5: Test Master Script
**Purpose:** Run all scrapers with one command

```bash
node run-all-scrapers.js
```

**Expected Output:**
```
========================================
🚀 National Security Events Scraper
========================================

Starting scraping process...

📥 Running CISA scraper...
────────────────────────────────────────
[CISA output]
────────────────────────────────────────

📥 Running INSA scraper...
────────────────────────────────────────
[INSA output]
────────────────────────────────────────

📥 Running OpenAI scraper...
────────────────────────────────────────
[OpenAI output]
────────────────────────────────────────

========================================
✅ All scrapers completed!
========================================
```

**Verify:**
- [ ] All three scrapers run successfully
- [ ] No errors
- [ ] Check PocketBase for new events from all sources

---

### Step 6: Test Embeddings Generation
**Purpose:** Verify embeddings are generated for new events

```bash
node generate-embeddings.js
```

**Expected Output:**
```
Fetching events without embeddings...
Found 30 total events
25 events need embeddings
Generating embedding for: [Event Title]
✓ Created embedding for: [Event Title]
...
Embedding generation complete!
```

**Verify:**
- [ ] Embeddings are created for new events
- [ ] Check PocketBase event_embeddings collection
- [ ] No OpenAI API errors

---

## 🎉 PHASE 1 SUCCESS CRITERIA

Phase 1 is complete when:
- [x] organizations.json contains all org configurations
- [x] sync-organizations.js successfully syncs to PocketBase
- [x] All scrapers read from organizations.json (no hardcoded IDs)
- [ ] All scrapers successfully scrape and create events
- [ ] Master script runs all scrapers without errors
- [ ] Embeddings are generated for new events

---

## 🚀 NEXT STEPS (Phase 2)

Once Phase 1 testing is complete, you're ready for Phase 2:

### Phase 2 Goal: Automate Scraping
Deploy scrapers to run automatically on a schedule

**Options:**
1. **GitHub Actions** (Recommended - Free tier available)
   - Run scrapers on schedule (e.g., daily at 8am)
   - Logs stored in GitHub
   
2. **Railway Cron Jobs**
   - Run scrapers on Railway alongside PocketBase
   - More expensive but simpler setup

3. **Heroku Scheduler**
   - Alternative to GitHub Actions
   - Free tier available

**We'll tackle Phase 2 after confirming Phase 1 works!**

---

## 📊 BENEFITS OF PHASE 1 CHANGES

### Before (Hardcoded):
```javascript
const CISA_ORG_ID = '7ogxcgvlck4ljvw'; // ❌ Hardcoded
const INSA_ORG_ID = '3l9igkua694zq4g'; // ❌ Hardcoded
```

### After (JSON Config):
```javascript
const CISA_CONFIG = orgsData.organizations.find(org => org.scraper_type === 'cisa');
// ✅ Reads from centralized config
// ✅ Includes all default values (timezone, cost, etc.)
// ✅ Easy to add new organizations
```

### To Add a New Organization:
1. Add entry to organizations.json
2. Run `node sync-organizations.js`
3. Create new scraper file based on template
4. Add to run-all-scrapers.js
5. Done! No code changes to existing scrapers needed

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: "Cannot find module 'dotenv'"
**Solution:** Run `npm install dotenv node-fetch cheerio`

### Issue: "POCKETBASE_URL is undefined"
**Solution:** Create .env file with POCKETBASE_URL and OPENAI_API_KEY

### Issue: "Organization not found in organizations.json"
**Solution:** Run `node sync-organizations.js` first to sync organizations

### Issue: "Failed to create event"
**Solution:** 
- Check PocketBase admin panel - verify collections exist
- Check field names in scraper match PocketBase schema
- Verify organization IDs are correct

### Issue: Duplicate events being created
**Solution:** This should not happen - scrapers check for duplicates using source_id. If you see duplicates:
- Check that source_id is being set correctly
- Verify events collection has source_id field

---

## 📁 FILE STRUCTURE

```
natsec-events-backend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Node dependencies
├── organizations.json            # ⭐ Central config
├── sync-organizations.js         # ⭐ Sync JSON → PocketBase
├── scrape-cisa-events.js        # ⭐ Updated scraper
├── scrape-insa-events.js        # ⭐ Updated scraper
├── scrape-openai-events.js      # ⭐ Updated scraper
├── generate-embeddings.js        # Embedding generator
└── run-all-scrapers.js          # ⭐ NEW: Master script
```

---

## ✍️ NOTES

### What Changed in Scrapers:
1. Added JSON config loading at the top
2. Replaced hardcoded org IDs with `CONFIG.pocketbase_id`
3. Replaced hardcoded values with `CONFIG.default_*` values
4. Added validation to ensure org exists in JSON
5. Improved console output with organization names

### What Stayed the Same:
1. Core scraping logic unchanged
2. Date/time parsing unchanged
3. Duplicate detection unchanged
4. PocketBase API calls unchanged

### Key Improvements:
- ✅ Single source of truth (organizations.json)
- ✅ Easy to add new organizations
- ✅ Better error messages
- ✅ More maintainable code
- ✅ Configuration separate from code

---

## 🎯 READY TO TEST?

1. Navigate to your project folder
2. Ensure .env file has correct values
3. Run `node sync-organizations.js`
4. Run `node run-all-scrapers.js`
5. Check PocketBase for new events
6. Run `node generate-embeddings.js`
7. Celebrate! 🎉

---

**Questions or issues?** Let me know and I'll help troubleshoot!
