# EventFinder Topic Icon Worker

Generates 1024x1024 PNG topic icons using OpenAI Images API, validates them (no text, no collage),
optionally validates UI legibility via downscale audit, and uploads to PocketBase `topic_icons.icon_file`.

## Setup
1) Copy `.env.example` to `.env` and fill values (keep private).
2) Install deps:
   npm install
3) Run:
   npm run generate

## What it does
- Finds topic_icons records missing icon_file
- Builds a policy-compliant prompt (topics + geo rules + org rules)
- Generates ONE image per record
- Runs post-checks:
  - OCR: rejects any detected letters/numbers
  - Divider detector: rejects obvious multi-panel grids
  - (Optional) Downscale audit:
    - simulates CSS cover crop into 80x130
    - rejects icons that become illegible

- Retries with stronger constraints if needed
- Uploads PNG to PocketBase + stores prompt_used

## Important
- This script never prints secrets.
- If generation fails after MAX_ATTEMPTS, it writes prompt_used as [FAILED] and skips upload.
