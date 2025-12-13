# Running Scripts - Event Finder

Last Updated: 2025-12-06

This document explains how to run Event Finder scripts manually.

---

## Overview

Scripts require 4 environment variables:
- `POCKETBASE_URL` - Your PocketBase server URL
- `POCKETBASE_ADMIN_EMAIL` - Admin login email
- `POCKETBASE_ADMIN_PASSWORD` - Admin login password
- `OPENAI_API_KEY` - OpenAI API key (for AI scripts only)

**⚠️ SECURITY:** Never store credentials in cloud-synced folders (OneDrive, Dropbox, etc.)

---

## Method A: From Your Main Computer (Local .env File)

Use this method when running scripts from the computer where your `.env` file is stored locally.

### File Locations

| Item | Location |
|------|----------|
| Code files | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| .env file | `C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env` |
| Public UI | `event-finder-ui-v7.html` (in Code files folder) |

### .env File Format
```
POCKETBASE_URL=https://your-pocketbase-url.up.railway.app
POCKETBASE_ADMIN_EMAIL=your-email@example.com
POCKETBASE_ADMIN_PASSWORD=your-password-here
OPENAI_API_KEY=sk-proj-your-key-here
```

### Step-by-Step Instructions

**Step 1:** Open PowerShell

**Step 2:** Load environment variables from .env file
```powershell
Get-Content "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env" | ForEach-Object { if ($_ -match "^([^=]+)=(.*)$") { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process") } }
```

**Step 3:** Verify variables loaded (should show your PocketBase URL)
```powershell
$env:POCKETBASE_URL
```

**Step 4:** Navigate to project folder
```powershell
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
```

**Step 5:** Run your script
```powershell
node script-name.js
```

**Step 6:** Verify results in Public UI
```
Open event-finder-ui-v7.html in browser and refresh to see changes
```

### Quick Reference (Copy/Paste Block)
```powershell
Get-Content "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env" | ForEach-Object { if ($_ -match "^([^=]+)=(.*)$") { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process") } }
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
```

---

## Method B: From Any Other Computer (Paste from Bitwarden)

Use this method when running scripts from a different computer that doesn't have your .env file.

### One-Time Setup

1. **Install Node.js** from https://nodejs.org (LTS version)

2. **Install Git** from https://git-scm.com

3. **Clone the repository:**
```powershell
cd ~\Desktop
git clone https://github.com/mtaylorUSA/event-finder-backend.git
cd event-finder-backend
```

4. **Install dependencies:**
```powershell
npm install
```

### Each Session: Set Environment Variables

**Step 1:** Open PowerShell

**Step 2:** Set each variable (paste values from Bitwarden)
```powershell
$env:POCKETBASE_URL = "https://your-pocketbase-url.up.railway.app"
```
```powershell
$env:POCKETBASE_ADMIN_EMAIL = "your-email@example.com"
```
```powershell
$env:POCKETBASE_ADMIN_PASSWORD = "your-password-here"
```
```powershell
$env:OPENAI_API_KEY = "sk-proj-your-key-here"
```

**Step 3:** Navigate to project folder
```powershell
cd ~\Desktop\event-finder-backend
```

**Step 4:** Run your script
```powershell
node script-name.js
```

**Step 5:** Verify results in Public UI
```
Open event-finder-ui-v7.html in browser and refresh to see changes
```

### ⚠️ Important Notes for Method B

- Variables are cleared when PowerShell closes
- Never save credentials in chat history or files on shared computers
- Always close PowerShell when done

---

## Available Scripts

| Script | Purpose | Requires OpenAI? | Verify in UI? |
|--------|---------|------------------|---------------|
| `generate-permission-requests.js` | Generate email drafts for permission requests | No | No |
| `add-contacts.js` | Add POC contacts to database | No | No |
| `suggest-organizations.js` | AI suggests new organizations | Yes | No |
| `scrape-all-organizations.js` | Scrape events from enabled orgs | No | ✅ Yes |
| `enrich-events.js` | AI-tag events with topics | Yes | ✅ Yes |
| `generate-embeddings.js` | Create embeddings for search | Yes | No |
| `cleanup-orphaned-events.js` | Remove events without valid org | No | ✅ Yes |
| `cleanup-bad-events.js` | Remove malformed events | No | ✅ Yes |

**"Verify in UI?"** - After running these scripts, open `event-finder-ui-v7.html` and refresh to confirm changes appear correctly.

---

## After Running Scripts: Verify in Public UI

Scripts that modify events should be verified in the public UI:

1. Open `event-finder-ui-v7.html` in your browser
2. Press F5 or Ctrl+R to refresh (loads fresh data from PocketBase)
3. Check that:
   - New events appear in the list
   - Dates display correctly
   - Descriptions show properly
   - Locations are accurate
   - "More details and registration" links work

---

## Troubleshooting

### "Missing environment variables" Error

Variables weren't loaded. Re-run the load command (Method A) or set commands (Method B).

### Verify Variables Are Set
```powershell
$env:POCKETBASE_URL
$env:POCKETBASE_ADMIN_EMAIL
$env:OPENAI_API_KEY
```

Each should display the value (not blank).

### "Cannot find module" Error

Dependencies not installed. Run:
```powershell
npm install
```

### Authentication Failed

- Check POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD are correct
- Verify you can log into PocketBase admin panel with same credentials

### Events Not Appearing in UI

After running scraper scripts:
1. Check PocketBase Admin → events collection to confirm events were saved
2. Refresh `event-finder-ui-v7.html` (F5)
3. Check date filter - start date defaults to today, so past events won't show
4. Check format filter - both Virtual and In-Person should be checked

---

## Updating Code from GitHub

If scripts have been updated:
```powershell
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
git pull
```

---

## Security Reminders

✅ **DO:**
- Store .env on local (non-synced) drive
- Store credentials in Bitwarden
- Close PowerShell when done on shared computers

❌ **DON'T:**
- Store .env in OneDrive/Dropbox/Google Drive
- Save credentials in chat history
- Leave PowerShell open with variables set on shared computers
