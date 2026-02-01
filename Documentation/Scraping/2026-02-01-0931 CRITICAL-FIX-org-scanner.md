# 🚨 CRITICAL FIX REQUIRED: org-scanner.js

## ⚠️ THE PROBLEM

The current `gatherPOC()` function in `org-scanner.js` has unsafe behavior:

```javascript
// CURRENT CODE (around line 2704-2726) - UNSAFE
if (hasRestrictions) {
    // Uses Google Search - SAFE ✅
    allContacts = await gatherPOCViaGoogleSearch(orgName || domain, domain, { skipCategories });
} else {
    // No restrictions - tries direct fetch - UNSAFE ❌
    console.log('      ℹ️ No restrictions - trying direct fetch first');
    const directPoc = await gatherPOCDirectFetch(html, baseUrl);
    // ...
}
```

**Problem:** When an org has NO flags, the scanner fetches their `/contact`, `/about`, `/team` pages directly. This could violate their Terms of Use if:
- We haven't scanned their TOU yet
- They have restrictions we missed
- They added restrictions after we last scanned

## ✅ THE FIX

Replace the entire contact gathering logic to **ALWAYS use Google Search**:

### Find this section (around line 2704):
```javascript
    // ─────────────────────────────────────────────────────────────────────────
    // Gather contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    let allContacts = [];
    
    if (hasRestrictions) {
```

### Replace with:
```javascript
    // ─────────────────────────────────────────────────────────────────────────
    // Gather contacts - ALWAYS via Google Search (never scrape org websites)
    // ─────────────────────────────────────────────────────────────────────────
    
    let allContacts = [];
    
    // SECURITY: Always use Google Search for contact gathering
    // We NEVER scrape org websites for contacts - this respects all TOU policies
    console.log('      🔒 Using Google Search for contacts (safe mode)');
    
    if (GOOGLE_SEARCH_API_KEY) {
        allContacts = await gatherPOCViaGoogleSearch(orgName || domain, domain, { skipCategories });
    } else {
        console.log('      ⚠️ Google Search API not configured - cannot gather contacts');
    }
```

### Also DELETE or comment out the gatherPOCDirectFetch function (around line 2518-2600)
The function `gatherPOCDirectFetch()` should no longer be used. Either:
- Delete it entirely, or
- Add a comment: `// DEPRECATED - Do not use. All contact gathering must use Google Search.`

## 📋 SUMMARY OF CHANGES

| File | Change |
|------|--------|
| `org-scanner.js` | gatherPOC() now ALWAYS uses Google Search |
| `org-scanner.js` | gatherPOCDirectFetch() deprecated/removed |
| `adhoc-scanner.js` | Removed `--contacts-only` option |
| `admin-interface-v22.html` | Removed "Contacts Only" checkbox, added safety guarantee |

## 🔒 NEW POLICY

| Action | Allowed? |
|--------|----------|
| Fetch homepage | ✅ Yes (detect tech blocks) |
| Fetch TOU/Privacy pages | ✅ Yes (detect restrictions) |
| Fetch /contact, /about, /team pages | ❌ **NEVER** |
| Google Search for contacts | ✅ Always safe |

## ⚡ AFTER APPLYING FIX

Test with:
```powershell
node scrapers/adhoc-scanner.js --org "CNAS"
```

You should see:
```
🔒 Using Google Search for contacts (safe mode)
```

NOT:
```
ℹ️ No restrictions - trying direct fetch first  ← OLD UNSAFE MESSAGE
```
