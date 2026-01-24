# PocketBase Schema Changes - 2026-01-19

## Overview
These changes support the enhanced scanner features:
1. No Legal Pages Found flag
2. Microsite Suspect flag with auto-reject
3. Restriction Source URL and Context
4. Scan logging

────────────────────────────────────────────────────────────────

## Part 1: New Fields on `organizations` Collection

### 1.1 no_legal_pages_flag
```
Field Name: no_legal_pages_flag
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: on
Field Purpose/Notes: TRUE if scanner found zero legal pages on the website. Flagged for review since we cannot confirm whether scraping is permitted.
Added: 2026-01-19
```

### 1.2 microsite_suspect_flag
```
Field Name: microsite_suspect_flag
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: on
Field Purpose/Notes: TRUE if microsite detection may be a false positive (medium confidence or no parent org found). Auto-rejects to "Rejected by Org" for manual review.
Added: 2026-01-19
```

### 1.3 microsite_suspect_reason
```
Field Name: microsite_suspect_reason
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 500
Setting - Regex pattern: BLANK
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Explains why microsite_suspect_flag was set (e.g., "Medium confidence detection" or "No parent org found"). Helps with manual review.
Added: 2026-01-19
```

### 1.4 restriction_source_url
```
Field Name: restriction_source_url
Field Type: URL
Setting - Except domains: BLANK
Setting - Only domains: BLANK
Setting - Nonempty: off
Setting - Presentable: off
Field Purpose/Notes: URL of the specific page where a restriction was found. More specific than tou_url which may just be the first legal page.
Added: 2026-01-19
```

### 1.5 restriction_context
```
Field Name: restriction_context
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 2000
Setting - Regex pattern: BLANK
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Human-readable context showing 20 words before and after the trigger term, with trigger highlighted like "...words **scraping prohibited** words...". For Admin Interface display.
Added: 2026-01-19
```

────────────────────────────────────────────────────────────────

## Part 2: New `scan_logs` Collection

### Collection Settings
```
Collection Name: scan_logs
Collection Type: Base
API Rules:
  - List/Search: Admins only (leave blank)
  - View: Admins only (leave blank)
  - Create: Admins only (leave blank)
  - Update: Admins only (leave blank)
  - Delete: Admins only (leave blank)
```

### Fields

#### 2.1 organization
```
Field Name: organization
Field Type: Relation
Setting - Select Collection: organizations
Setting - Single/Multiple: Single
Setting - Cascade delete: off
Setting - Nonempty: on
Setting - Presentable: on
Field Purpose/Notes: Which organization was scanned
```

#### 2.2 scan_type
```
Field Name: scan_type
Field Type: Select
Setting - Choices: discovery, pre-scrape, manual, scheduled
Setting - Single/Multiple: Single
Setting - Nonempty: on
Setting - Presentable: on
Field Purpose/Notes: Type of scan that was performed
```

#### 2.3 scan_date
```
Field Name: scan_date
Field Type: DateTime
Setting - min date: BLANK
Setting - max date: BLANK
Setting - Nonempty: on
Setting - Presentable: on
Field Purpose/Notes: When the scan was performed
```

#### 2.4 legal_pages_found
```
Field Name: legal_pages_found
Field Type: Number
Setting - Min: 0
Setting - Max: BLANK
Setting - Nonzero: off
Setting - Presentable: off
Setting - No decimals: on
Field Purpose/Notes: Count of legal pages discovered
```

#### 2.5 legal_page_urls
```
Field Name: legal_page_urls
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 2000
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Newline-separated list of legal page URLs found
```

#### 2.6 no_legal_pages_flag
```
Field Name: no_legal_pages_flag
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if no legal pages were found
```

#### 2.7 restrictions_found
```
Field Name: restrictions_found
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: on
Field Purpose/Notes: TRUE if restrictions were detected
```

#### 2.8 restriction_terms
```
Field Name: restriction_terms
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 500
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Comma-separated list of restriction terms found
```

#### 2.9 restriction_source_url
```
Field Name: restriction_source_url
Field Type: URL
Setting - Nonempty: off
Setting - Presentable: off
Field Purpose/Notes: URL of page where restriction was found
```

#### 2.10 restriction_context
```
Field Name: restriction_context
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 2000
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: 20 words before/after the trigger term
```

#### 2.11 tech_block
```
Field Name: tech_block
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if 403/401 detected
```

#### 2.12 microsite_detected
```
Field Name: microsite_detected
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if microsite was detected
```

#### 2.13 microsite_suspect
```
Field Name: microsite_suspect
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if microsite detection is uncertain
```

#### 2.14 js_rendering
```
Field Name: js_rendering
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if JavaScript rendering detected
```

#### 2.15 poc_found
```
Field Name: poc_found
Field Type: Bool
Setting - Nonfalsey: off
Setting - Presentable: off
Field Purpose/Notes: TRUE if POC info was extracted
```

#### 2.16 poc_email
```
Field Name: poc_email
Field Type: Email
Setting - Except domains: BLANK
Setting - Only domains: BLANK
Setting - Nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Extracted POC email
```

#### 2.17 status_before
```
Field Name: status_before
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 100
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Organization status before scan
```

#### 2.18 status_after
```
Field Name: status_after
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 100
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Organization status after scan
```

#### 2.19 flags_set
```
Field Name: flags_set
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 500
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Comma-separated list of flags that were set (e.g., "tou_flag, tech_block_flag")
```

#### 2.20 duration_ms
```
Field Name: duration_ms
Field Type: Number
Setting - Min: 0
Setting - Max: BLANK
Setting - Nonzero: off
Setting - Presentable: off
Setting - No decimals: on
Field Purpose/Notes: Scan duration in milliseconds
```

#### 2.21 error
```
Field Name: error
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 500
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Any error that occurred during scan
```

#### 2.22 full_log
```
Field Name: full_log
Field Type: Plain Text
Setting - min length: BLANK
Setting - max length: 10000
Setting - nonempty: off
Setting - Presentable: off
Field Purpose/Notes: Complete JSON log of scan results for debugging
```

────────────────────────────────────────────────────────────────

## Summary of Changes

### New Fields on `organizations` (5 fields):
| Field | Type | Purpose |
|-------|------|---------|
| no_legal_pages_flag | Bool | No legal pages found |
| microsite_suspect_flag | Bool | Uncertain microsite detection |
| microsite_suspect_reason | Plain Text | Why suspect |
| restriction_source_url | URL | Where restriction found |
| restriction_context | Plain Text | 20 words before/after trigger |

### New Collection `scan_logs` (22 fields):
Complete audit trail of every scan performed.

────────────────────────────────────────────────────────────────

## Steps to Implement

1. **In PocketBase Admin UI:**
   - Go to Collections
   - Select `organizations`
   - Add the 5 new fields (Part 1)

2. **Create new collection:**
   - Click "New Collection"
   - Name: `scan_logs`
   - Type: Base
   - Add all 22 fields (Part 2)

3. **Test:**
   - Run scanner on a test org with `--update-db`
   - Verify new fields are populated
   - Check scan_logs for new entry

