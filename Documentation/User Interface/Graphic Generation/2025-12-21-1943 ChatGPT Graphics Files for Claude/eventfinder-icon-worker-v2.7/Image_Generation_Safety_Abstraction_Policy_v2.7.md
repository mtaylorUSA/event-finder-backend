# Image Generation Safety & Abstraction Policy
Version: 2.7
Status: Active
Applies to: EventFinder topic icons generated via OpenAI image generation (default model: DALL·E 3)

## 1) Purpose
Generate safe, professional topic icons for EventFinder event cards. Icons must be small-display legible, neutral, and compliant with strict safety restrictions.

## 2) Output Requirements (UI + Storage)
- Output format: PNG
- Generation size: 1024×1024 px (master)
- Must be usable as a CSS background-image (background-size: cover) within an 80×130 container
- Single cohesive icon only (never a collage, never multi-panel)

## 3) Critical Restrictions (Never Violate)
These are absolute and must be enforced in every prompt and validated by post-check:

### 3.1 No Text (Hard Rule)
Absolutely NO text, words, letters, numbers, labels, captions, watermarks, signatures, UI text, signage, or any readable glyphs.

### 3.2 US Politics Prohibition (Hard Rule)
- Absolutely NO US politicians (current or former)
- Absolutely NO US political party symbols or imagery (no elephant, no donkey)

### 3.3 Prohibited Official Marks (Hard Rule)
- No official government seals or agency insignia (FBI, CIA, NSA, DHS, DoD, etc.)
- No specific military unit patches, badges, or insignia

### 3.4 Faces & People (Hard Rule)
- No realistic human faces
- Human figures permitted only as abstract silhouettes with no identifiable features

## 4) Geography Rules (Countries / Regions)
- If COUNTRIES is populated: include country flag elements and/or country map silhouettes (text-free, neutral).
  - Prompts should use text-free flag pattern hints (colors/geometry) rather than words inside the image.
- If COUNTRIES is empty and REGIONS is populated: include regional map silhouette ONLY (no flags or country maps).
  - Prompts should use region motifs/colors from REGION_STYLE.

## 5) Post-Checks (Mandatory)
An image is compliant only if:
- OCR detects no letters/numbers
- Multi-panel divider detector does not flag collage/grid composition

## 6) Optional UI Downscale Audit (Recommended)
Simulate CSS background-size: cover for an 80×130 tile:
- Center-crop master image to match 80:130 aspect ratio
- Resize to 80×130
Reject any image that becomes illegible at 80×130.
