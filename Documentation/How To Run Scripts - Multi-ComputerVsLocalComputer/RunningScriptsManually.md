# Running Event Finder Scripts Manually

**Last Updated:** 2025-12-04

---

## Overview

This guide explains how to run Event Finder scripts manually. There are two methods:

| Method | Use When | Secrets Location |
|--------|----------|------------------|
| **Method A: Local .env** | Running from your main computer | `.env` file on local drive |
| **Method B: Paste from Bitwarden** | Running from any other computer | Bitwarden only |

**Code files location:** OneDrive + GitHub
**Secrets location:** Local drive (Method A) or Bitwarden only (Method B)

---

## Method A: From Your Main Computer (Local .env File)

Use this method when running from your main computer where you have a `.env` file stored on your local drive.

### File Locations

| Item | Location |
|------|----------|
| Code files | `C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder` |
| .env file | `C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env` |

### Steps to Run a Script

**Step 1:** Open PowerShell

**Step 2:** Load environment variables from local .env file

```
Get-Content "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env" | ForEach-Object { if ($_ -match "^([^=]+)=(.*)$") { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process") } }
```

**What you should see:** Nothing (no output means success)

**Step 3:** Navigate to project folder

```
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
```

**Step 4:** Run the script

```
node script-name.js
```

**Step 5:** Close PowerShell when done (credentials disappear from memory)

---

### Quick Reference: Method A Commands

Copy and paste these in order:

```
Get-Content "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env" | ForEach-Object { if ($_ -match "^([^=]+)=(.*)$") { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process") } }
```

```
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
```

```
node script-name.js
```

---

## Method B: From Any Computer (Paste from Bitwarden)

Use this method when running from a different computer where you don't have a local `.env` file.

### One-Time Setup (Per Computer)

**Step 1:** Install Node.js

1. Go to https://nodejs.org
2. Download the LTS version
3. Run the installer
4. Accept default settings

**Verify installation:**
```
node --version
```

**Step 2:** Install Git

1. Go to https://git-scm.com
2. Download for Windows
3. Run the installer
4. Accept default settings

**Verify installation:**
```
git --version
```

**Step 3:** Clone your code from GitHub

```
cd ~\Desktop
```

```
git clone https://github.com/mtaylorUSA/event-finder-backend.git
```

**Step 4:** Install dependencies

```
cd event-finder-backend
```

```
npm install
```

---

### Steps to Run a Script

**Step 1:** Open PowerShell

**Step 2:** Navigate to project folder

```
cd ~\Desktop\event-finder-backend
```

**Step 3:** Open Bitwarden and copy your credentials

**Step 4:** Set environment variables (paste each value from Bitwarden)

```
$env:POCKETBASE_URL = "https://event-discovery-backend-production.up.railway.app"
```

```
$env:POCKETBASE_ADMIN_EMAIL = "your-email-from-bitwarden"
```

```
$env:POCKETBASE_ADMIN_PASSWORD = "your-password-from-bitwarden"
```

```
$env:OPENAI_API_KEY = "your-openai-key-from-bitwarden"
```

**Step 5:** Run the script

```
node script-name.js
```

**Step 6:** Close PowerShell when done (credentials disappear from memory)

---

### Quick Reference: Method B Commands

```
cd ~\Desktop\event-finder-backend
$env:POCKETBASE_URL = "https://event-discovery-backend-production.up.railway.app"
$env:POCKETBASE_ADMIN_EMAIL = "paste-from-bitwarden"
$env:POCKETBASE_ADMIN_PASSWORD = "paste-from-bitwarden"
$env:OPENAI_API_KEY = "paste-from-bitwarden"
node script-name.js
```

---

## Available Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `add-contacts.js` | Add POC contacts to PocketBase | `node add-contacts.js` |
| `enrich-events.js` | AI tagging for topics/regions | `node enrich-events.js` |
| `generate-embeddings.js` | Create AI embeddings | `node generate-embeddings.js` |
| `scrape-all-organizations.js` | Scrape events | ⛔ **DO NOT RUN** - awaiting permissions |

---

## Verifying Environment Variables

To check that variables are loaded correctly:

```
Get-ChildItem Env: | Where-Object { $_.Name -like "POCKETBASE*" }
```

**What you should see:** A list showing POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, and POCKETBASE_ADMIN_PASSWORD

---

## Updating Code (When Changes Are Made)

If the code on GitHub has been updated, pull the latest version:

**From OneDrive folder:**
```
cd "C:\Users\mtayl\OneDrive\AI Stuff-OneDrive\Event Finder"
git pull
```

**From cloned repo on another computer:**
```
cd ~\Desktop\event-finder-backend
git pull
```

---

## Troubleshooting

### "node is not recognized"
Node.js is not installed. Install from https://nodejs.org

### "git is not recognized"
Git is not installed. Install from https://git-scm.com

### "Cannot find module"
Dependencies not installed. Run:
```
npm install
```

### "Missing environment variables"
Variables not loaded. Re-run the appropriate command:
- Method A: The `Get-Content` command
- Method B: The `$env:` commands

### "Authentication failed" or "401 Unauthorized"
Check that credentials are correct. Verify in Bitwarden.

### Nothing happens after loading .env
This is normal — no output means success. Proceed to run the script.

---

## Security Reminders

| ✅ Do | ❌ Don't |
|-------|---------|
| Store secrets in Bitwarden | Store secrets in OneDrive |
| Keep .env on local drive only | Put .env in OneDrive or GitHub |
| Close PowerShell when done | Leave PowerShell open with credentials |
| Use GitHub Secrets for automation | Hardcode secrets in scripts |

---

## .env File Format

Your local `.env` file should contain:

```
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
OPENAI_API_KEY=sk-your-key-here
POCKETBASE_ADMIN_EMAIL=your-email-here
POCKETBASE_ADMIN_PASSWORD=your-password-here
```

**Location:** `C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\.env`

**Important:** No spaces around the `=` sign. Each variable on its own line.

