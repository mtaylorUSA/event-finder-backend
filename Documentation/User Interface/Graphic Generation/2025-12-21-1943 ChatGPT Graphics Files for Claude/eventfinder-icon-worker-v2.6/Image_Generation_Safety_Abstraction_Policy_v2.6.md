# Image Generation Safety & Abstraction Policy
Version: 2.6
Status: Active
Applies to: EventFinder topic icons generated via OpenAI image generation

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

## 4) Icon Construction Logic
Use database fields to build the icon:

1) TOPICS (always included)
- Always include thematic imagery for each topic.

2) COUNTRIES populated?
- YES → flags and/or country map silhouettes allowed (neutral, no text)
- NO  → no flags, no country maps

3) REGIONS populated AND no countries?
- YES → regional map silhouette only (no flags/country maps)
- NO  → no geographic imagery

4) TRANSNATIONAL_ORG populated?
- YES → org emblem/flag allowed (neutral, no text)
- NO  → none

## 5) Style Requirements
- Clean professional icon
- Isometric “3D-lite” look with subtle depth/shadow
- No photorealism
- No propaganda framing
- No poster layout or title bands
- Clean white background or subtle gradient

## 6) Prompt Requirements
Every prompt MUST include the “CRITICAL REQUIREMENTS” block verbatim:

CRITICAL REQUIREMENTS:
- Absolutely NO text, words, letters, numbers, labels, or watermarks of any kind
- Absolutely NO US politicians (current or former)
- Absolutely NO US political party symbols or imagery (no elephant, no donkey)
- No realistic human faces
- No official government seals (FBI, CIA, NSA, etc.)
- No specific military unit insignia or patches
- Single cohesive icon, not a collage

## 7) Post-Checks (Mandatory)
An image is compliant only if:
- OCR detects no letters/numbers
- Multi-panel divider detector does not flag collage/grid composition
- Flag gating is satisfied (no flags when countries are empty)

## 8) Optional UI Downscale Audit (Recommended)
To prevent wasted spend and ensure UI legibility:
- Simulate CSS background-size: cover for an 80×130 container:
  - Center-crop master image to match 80:130 aspect ratio
  - Resize to 80×130
- Reject any image that becomes illegible at 80×130.

If enabled, images MUST pass the downscale audit to be accepted and uploaded.
