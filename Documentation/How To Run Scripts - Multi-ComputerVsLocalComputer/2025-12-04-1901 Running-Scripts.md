\# Running Scripts - Event Finder



Last Updated: 2025-12-04



This document explains how to run Event Finder scripts manually.



---



\## Overview



Scripts require 4 environment variables:

\- `POCKETBASE\_URL` - Your PocketBase server URL

\- `POCKETBASE\_ADMIN\_EMAIL` - Admin login email

\- `POCKETBASE\_ADMIN\_PASSWORD` - Admin login password

\- `OPENAI\_API\_KEY` - OpenAI API key (for AI scripts only)



\*\*⚠️ SECURITY:\*\* Never store credentials in cloud-synced folders (OneDrive, Dropbox, etc.)



---



\## Method A: From Your Main Computer (Local .env File)



Use this method when running scripts from the computer where your `.env` file is stored locally.



\### File Locations



| Item | Location |

|------|----------|

| Code files | `C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder` |

| .env file | `C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL\\.env` |



\### .env File Format

```

POCKETBASE\_URL=https://your-pocketbase-url.up.railway.app

POCKETBASE\_ADMIN\_EMAIL=your-email@example.com

POCKETBASE\_ADMIN\_PASSWORD=your-password-here

OPENAI\_API\_KEY=sk-proj-your-key-here

```



\### Step-by-Step Instructions



\*\*Step 1:\*\* Open PowerShell



\*\*Step 2:\*\* Load environment variables from .env file

```powershell

Get-Content "C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL\\.env" | ForEach-Object { if ($\_ -match "^(\[^=]+)=(.\*)$") { \[System.Environment]::SetEnvironmentVariable($matches\[1], $matches\[2], "Process") } }

```



\*\*Step 3:\*\* Verify variables loaded (should show your PocketBase URL)

```powershell

$env:POCKETBASE\_URL

```



\*\*Step 4:\*\* Navigate to project folder

```powershell

cd "C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder"

```



\*\*Step 5:\*\* Run your script

```powershell

node script-name.js

```



\### Quick Reference (Copy/Paste Block)

```powershell

Get-Content "C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL\\.env" | ForEach-Object { if ($\_ -match "^(\[^=]+)=(.\*)$") { \[System.Environment]::SetEnvironmentVariable($matches\[1], $matches\[2], "Process") } }

cd "C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder"

```



---



\## Method B: From Any Other Computer (Paste from Bitwarden)



Use this method when running scripts from a different computer that doesn't have your .env file.



\### One-Time Setup



1\. \*\*Install Node.js\*\* from https://nodejs.org (LTS version)



2\. \*\*Install Git\*\* from https://git-scm.com



3\. \*\*Clone the repository:\*\*

```powershell

&nbsp;  cd ~\\Desktop

&nbsp;  git clone https://github.com/mtaylorUSA/event-finder-backend.git

&nbsp;  cd event-finder-backend

```



4\. \*\*Install dependencies:\*\*

```powershell

&nbsp;  npm install

```



\### Each Session: Set Environment Variables



\*\*Step 1:\*\* Open PowerShell



\*\*Step 2:\*\* Set each variable (paste values from Bitwarden)

```powershell

$env:POCKETBASE\_URL = "https://your-pocketbase-url.up.railway.app"

```

```powershell

$env:POCKETBASE\_ADMIN\_EMAIL = "your-email@example.com"

```

```powershell

$env:POCKETBASE\_ADMIN\_PASSWORD = "your-password-here"

```

```powershell

$env:OPENAI\_API\_KEY = "sk-proj-your-key-here"

```



\*\*Step 3:\*\* Navigate to project folder

```powershell

cd ~\\Desktop\\event-finder-backend

```



\*\*Step 4:\*\* Run your script

```powershell

node script-name.js

```



\### ⚠️ Important Notes for Method B



\- Variables are cleared when PowerShell closes

\- Never save credentials in chat history or files on shared computers

\- Always close PowerShell when done



---



\## Available Scripts



| Script | Purpose | Requires OpenAI? |

|--------|---------|------------------|

| `generate-permission-requests.js` | Generate email drafts for permission requests | No |

| `add-contacts.js` | Add POC contacts to database | No |

| `suggest-organizations.js` | AI suggests new organizations | Yes |

| `scrape-all-organizations.js` | Scrape events from enabled orgs | No |

| `enrich-events.js` | AI-tag events with topics | Yes |

| `generate-embeddings.js` | Create embeddings for search | Yes |

| `cleanup-orphaned-events.js` | Remove events without valid org | No |

| `cleanup-bad-events.js` | Remove malformed events | No |



---



\## Troubleshooting



\### "Missing environment variables" Error



Variables weren't loaded. Re-run the load command (Method A) or set commands (Method B).



\### Verify Variables Are Set

```powershell

$env:POCKETBASE\_URL

$env:POCKETBASE\_ADMIN\_EMAIL

$env:OPENAI\_API\_KEY

```



Each should display the value (not blank).



\### "Cannot find module" Error



Dependencies not installed. Run:

```powershell

npm install

```



\### Authentication Failed



\- Check POCKETBASE\_ADMIN\_EMAIL and POCKETBASE\_ADMIN\_PASSWORD are correct

\- Verify you can log into PocketBase admin panel with same credentials



---



\## Updating Code from GitHub



If scripts have been updated:

```powershell

cd "C:\\Users\\mtayl\\OneDrive\\AI Stuff-OneDrive\\Event Finder"

git pull

```



---



\## Security Reminders



✅ \*\*DO:\*\*

\- Store .env on local (non-synced) drive

\- Store credentials in Bitwarden

\- Close PowerShell when done on shared computers



❌ \*\*DON'T:\*\*

\- Store .env in OneDrive/Dropbox/Google Drive

\- Save credentials in chat history

\- Leave PowerShell open with variables set on shared computers

