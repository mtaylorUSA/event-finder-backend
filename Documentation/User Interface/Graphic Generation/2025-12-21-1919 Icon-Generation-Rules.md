# Icon Generation Rules for Event Finder

**Document Purpose:** Define rules for generating DALL-E icons for Event Finder events.  
**Audience:** ChatGPT / AI assistant working on icon generation code  
**Last Updated:** December 2024

---

## 🚫 CRITICAL RESTRICTIONS (Never Violate)

These rules are **absolute** and must be enforced in every DALL-E prompt:

| Rule | Prohibited Content |
|------|-------------------|
| **No Text** | ❌ No country names, labels, words, letters, numbers, watermarks, captions |
| **No US Politicians** | ❌ No US politicians (current or former presidents, congressmembers, cabinet officials, etc.) |
| **No US Political Parties** | ❌ No Republican elephant, Democratic donkey, or any political party imagery |
| **No Government Seals** | ❌ No official seals (FBI, CIA, NSA, DHS, DoD, etc.) |
| **No Realistic Faces** | ❌ No realistic human faces |
| **No Military Insignia** | ❌ No specific military unit patches, badges, or insignia |

**Every DALL-E prompt MUST include this block:**

```
CRITICAL REQUIREMENTS:
- Absolutely NO text, words, letters, numbers, labels, or watermarks of any kind
- Absolutely NO US politicians (current or former)
- Absolutely NO US political party symbols or imagery (no elephant, no donkey)
- No realistic human faces
- No official government seals (FBI, CIA, NSA, etc.)
- No specific military unit insignia or patches
```

---

## 📊 Database Fields Used for Icon Generation

### `topics` (Select, Multiple)
**Purpose:** Primary thematic content of the event  
**Icon Treatment:** ✅ Always include thematic imagery

**Valid Values:**
- AI & Emerging Tech
- Careers & Professional Development
- Climate & Security
- Counterterrorism
- Cybersecurity
- Defense Policy
- Diplomacy & Statecraft
- Economic Security
- Homeland Security
- Intelligence
- Military Operations
- Nuclear/WMD
- Space & Satellites

---

### `countries` (Select, Multiple)
**Purpose:** Specific countries mentioned in the event  
**Icon Treatment:** If populated → ✅ Country flag(s), country map(s), and/or regional map(s) are OK

**Valid Values:** 195 UN-recognized countries (Afghanistan through Zimbabwe)

**Key Countries for National Security Events:**
Afghanistan, Australia, Brazil, Canada, China, Egypt, France, Germany, India, Indonesia, Iran, Iraq, Israel, Italy, Japan, Kenya, Mexico, Nigeria, North Korea, Pakistan, Philippines, Poland, Russia, Saudi Arabia, South Africa, South Korea, Taiwan, Turkey, Ukraine, United Arab Emirates, United Kingdom, United States, Vietnam

---

### `regions` (Select, Multiple)
**Purpose:** Geographic region of focus  
**Icon Treatment:** 
- If country IS specified → ✅ Regional map OK (in addition to country imagery)
- If country is NOT specified → ✅ Regional map ONLY (no country flags or country maps)

**Valid Values (10 regions):**
- Africa
- Arctic
- Domestic US
- East and Southeast Asia *(China, Japan, Korea, Taiwan, ASEAN countries)*
- Europe/Eurasia *(includes Russia)*
- Global/Multilateral
- Latin America
- Middle East
- South Asia *(India, Pakistan, Afghanistan, etc.)*
- South Pacific and Oceania *(Australia, New Zealand, Pacific islands)*

---

### `transnational_org` (Select, Multiple)
**Purpose:** International organizations mentioned in the event  
**Icon Treatment:** If populated → ✅ Organization emblem/flag OK

**Valid Values:**
- African Union
- ANZUS
- APEC
- Arab League
- ASEAN
- AUKUS
- BRICS
- Caribbean Community
- Commonwealth of Nations
- European Union
- Five Eyes
- G7
- G20
- Gulf Cooperation Council
- International Atomic Energy Agency
- International Criminal Court
- Interpol
- NATO
- OECD
- OPEC
- Organization of American States
- Pacific Islands Forum
- Quad
- Shanghai Cooperation Organisation
- United Nations
- World Bank
- World Health Organization
- World Trade Organization

---

## ✅ Icon Generation Logic

### Decision Tree

```
1. TOPICS (Always)
   └── ✅ Include thematic imagery for all specified topics

2. COUNTRIES field populated?
   ├── YES → ✅ Include: country flag(s), country map(s), regional map(s)
   └── NO  → ❌ No country flags, no country maps

3. REGIONS field populated (and no countries)?
   ├── YES → ✅ Include: regional map only
   └── NO  → ❌ No geographic imagery

4. TRANSNATIONAL_ORG field populated?
   ├── YES → ✅ Include: organization emblem/flag
   └── NO  → ❌ No organization emblems
```

### Summary Table

| Scenario | Icon Can Include |
|----------|------------------|
| **Topics specified** | ✅ Thematic imagery (always) |
| **Countries specified** | ✅ Country flag(s) + country map(s) + regional map(s) |
| **Regions only (no countries)** | ✅ Regional map only, ❌ No flags, ❌ No country maps |
| **Transnational org specified** | ✅ Org emblem/flag |
| **No geographic data** | Topic imagery only |

---

## 📋 Example Scenarios

### Example 1: Full Context
**Event:** "NATO summit on Ukraine cybersecurity"  
**Fields:**
- topics: `Cybersecurity`
- countries: `Ukraine`
- transnational_org: `NATO`

**Icon Should Include:**
- 🔐 Cybersecurity imagery (locks, shields, circuits)
- 🇺🇦 Ukraine flag or map
- NATO emblem (star compass)

---

### Example 2: Region Only (No Country)
**Event:** "Middle East defense policy developments"  
**Fields:**
- topics: `Defense Policy`
- regions: `Middle East`
- countries: *(empty)*

**Icon Should Include:**
- 🛡️ Defense imagery (shields, military motifs)
- 🗺️ Middle East regional map silhouette

**Icon Should NOT Include:**
- ❌ Any country flags
- ❌ Any country-specific maps

---

### Example 3: Country Specified
**Event:** "China AI regulations impact on tech sector"  
**Fields:**
- topics: `AI & Emerging Tech`
- countries: `China`
- regions: `East and Southeast Asia`

**Icon Should Include:**
- 🤖 AI imagery (circuits, neural networks, chips)
- 🇨🇳 China flag or map
- 🗺️ East and Southeast Asia regional map (optional)

---

### Example 4: Multiple Countries
**Event:** "US-Pakistan counterterrorism cooperation"  
**Fields:**
- topics: `Counterterrorism`
- countries: `United States, Pakistan`

**Icon Should Include:**
- 🎯 Counterterrorism imagery (shields, protection motifs)
- 🇺🇸 US flag element
- 🇵🇰 Pakistan flag element

---

### Example 5: Global Scope (No Specific Geography)
**Event:** "Global climate security summit"  
**Fields:**
- topics: `Climate & Security`
- regions: `Global/Multilateral`
- countries: *(empty)*
- transnational_org: `United Nations`

**Icon Should Include:**
- 🌍 Climate imagery (earth, leaves, weather)
- 🗺️ Global map or globe
- 🇺🇳 UN emblem

---

### Example 6: Russia (Country + Region)
**Event:** "Russia cyber operations in Eastern Europe"  
**Fields:**
- topics: `Cybersecurity, Intelligence`
- countries: `Russia`
- regions: `Europe/Eurasia`

**Icon Should Include:**
- 🔐 Cybersecurity imagery
- 🕵️ Intelligence motifs
- 🇷🇺 Russia flag or map
- 🗺️ Europe/Eurasia regional map (optional)

---

## 🎨 Topic Visual Styles

Each topic has associated colors and motifs for consistent branding:

| Topic | Colors | Motifs |
|-------|--------|--------|
| AI & Emerging Tech | Teal, cyan | Circuit boards, neural networks, microchips |
| Careers & Professional Development | Gray, slate blue | Briefcase, ascending steps |
| Climate & Security | Green, emerald | Globe with leaves, earth, weather |
| Counterterrorism | Deep red, crimson | Shield, crosshairs, protective barrier |
| Cybersecurity | Purple, violet | Digital lock, shield with circuitry |
| Defense Policy | Navy blue, royal blue | Shield, eagle silhouette, stars |
| Diplomacy & Statecraft | Purple, lavender | Handshake, olive branch |
| Economic Security | Gold, amber | Currency symbols, trade routes |
| Homeland Security | Dark blue, indigo | House with shield, protective dome |
| Intelligence | Charcoal, slate gray | Eye, satellite, data streams |
| Military Operations | Military green, forest green | Generic star, tactical map, compass |
| Nuclear/WMD | Orange, warning red | Atom symbol, radiation trefoil |
| Space & Satellites | Deep space blue, purple | Satellite, orbit rings, rocket |

---

## 🖼️ Image Specifications

| Property | Value |
|----------|-------|
| **Generation Size** | 1024 × 1024 pixels |
| **Display Size** | 80 × 80 pixels |
| **Format** | PNG |
| **Style** | Isometric 3D-lite, professional, clean |
| **Background** | Clean white or subtle gradient |

---

## ✅ DALL-E Prompt Template

```
Create a professional isometric 3D icon for a national security event.

THEME: [Insert topics]
GEOGRAPHIC CONTEXT: [Insert country/region/org imagery rules based on fields]

STYLE:
- Clean isometric perspective with subtle depth and shadows
- Corporate and professional appearance
- Modern, polished look
- Suitable for 80x80 pixel display

COLOR PALETTE: [Insert topic colors]

VISUAL ELEMENTS: [Insert topic motifs + geographic elements]

CRITICAL REQUIREMENTS:
- Absolutely NO text, words, letters, numbers, labels, or watermarks of any kind
- Absolutely NO US politicians (current or former)
- Absolutely NO US political party symbols or imagery (no elephant, no donkey)
- No realistic human faces
- No official government seals (FBI, CIA, NSA, etc.)
- No specific military unit insignia or patches
- Single cohesive icon, not a collage
```

---

## 📁 PocketBase Configuration

**Collection:** `topic_icons`  
**Collection ID:** `ht172mektpb5c44`

**Fields:**
- `topic_combination` (text): Sorted key for matching, e.g., `"Cybersecurity|East and Southeast Asia|China"`
- `icon_file` (file): Generated PNG image
- `prompt_used` (text): DALL-E prompt for reference
- `countries` (text): Countries included in this icon (optional)

**File URL Pattern:**
```
https://event-discovery-backend-production.up.railway.app/api/files/ht172mektpb5c44/{record_id}/{filename}
```

---

## 🔄 Workflow Integration

```
1. Scraper returns event data
   ↓
2. Enrichment script (enrich-events.js) analyzes content
   ↓
3. AI extracts: topics, countries, regions, transnational_org
   ↓
4. Icon generation script checks for existing icon with same combination
   ↓
5. If no icon exists:
   a. Build DALL-E prompt following rules above
   b. Generate image
   c. Upload to PocketBase topic_icons collection
   ↓
6. Link event to icon
   ↓
7. UI displays icon on event card
```

---

## ⚠️ Reminder: Critical Restrictions

Before generating ANY icon, verify the prompt does NOT include:

- [ ] Text of any kind
- [ ] US politicians
- [ ] Political party symbols
- [ ] Government seals
- [ ] Realistic human faces
- [ ] Military unit insignia

**When in doubt, leave it out.**
