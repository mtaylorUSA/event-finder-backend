// =============================================================================
// RULES.JS - Icon Generation Rules for EventFinder
// Version: 3.0
// Last Updated: December 2024
// =============================================================================

// =============================================================================
// TOPIC STYLES
// Maps each topic to colors and visual motifs for DALL-E prompts
// =============================================================================

export const TOPIC_STYLE = {
  "AI & Emerging Tech": {
    colors: ["teal", "cyan", "#14b8a6", "#06b6d4"],
    motifs: ["circuit boards", "neural network nodes", "microchip patterns", "abstract data flow"]
  },
  "Careers & Professional Development": {
    colors: ["gray", "slate blue", "#64748b", "#94a3b8"],
    motifs: ["briefcase silhouette", "ascending steps", "upward arrow", "professional podium"]
  },
  "Climate & Security": {
    colors: ["green", "emerald", "#059669", "#10b981"],
    motifs: ["globe with leaves", "earth systems diagram", "weather patterns", "environmental shield"]
  },
  "Counterterrorism": {
    colors: ["deep red", "crimson", "#dc2626", "#991b1b"],
    motifs: ["protective shield", "defensive barrier", "security perimeter", "target-like geometry (non-weaponized)"]
  },
  "Cybersecurity": {
    colors: ["purple", "violet", "#6366f1", "#8b5cf6"],
    motifs: ["digital lock", "shield with circuitry", "secure network nodes", "encrypted data streams"]
  },
  "Defense Policy": {
    colors: ["navy blue", "royal blue", "#3b82f6", "#1d4ed8"],
    motifs: ["shield emblem", "generic stars", "abstract strategic map lines", "defense architecture"]
  },
  "Diplomacy & Statecraft": {
    colors: ["purple", "lavender", "#7c3aed", "#a855f7"],
    motifs: ["handshake silhouette", "olive branch", "dialogue arcs", "bridge connection"]
  },
  "Economic Security": {
    colors: ["gold", "amber", "#ca8a04", "#eab308"],
    motifs: ["trade route lines", "abstract supply chain", "stability pillars", "interconnected nodes"]
    // NOTE: No currency symbols ($, €, ¥, £) - these trigger text detection
  },
  "Homeland Security": {
    colors: ["dark blue", "indigo", "#1e40af", "#3730a3"],
    motifs: ["house with shield", "protective dome", "secure perimeter", "guardian silhouette"]
  },
  "Intelligence": {
    colors: ["charcoal", "slate gray", "#1e293b", "#475569"],
    motifs: ["abstract eye symbol", "satellite silhouette", "data streams", "surveillance grid"]
  },
  "Military Operations": {
    colors: ["military green", "forest green", "#065f46", "#047857"],
    motifs: ["generic star emblem", "compass rose", "tactical contour lines", "strategic grid"]
    // NOTE: No specific unit insignia or patches
  },
  "Nuclear/WMD": {
    colors: ["orange", "warning red", "#f59e0b", "#dc2626"],
    motifs: ["atom symbol (abstracted)", "radiation trefoil (stylized)", "containment geometry", "nuclear core"]
  },
  "Space & Satellites": {
    colors: ["deep space blue", "purple", "#0f172a", "#6366f1"],
    motifs: ["satellite silhouette", "orbit rings", "rocket outline", "star field", "planetary body"]
  }
};

// =============================================================================
// REGION STYLES
// Maps each region to visual elements for DALL-E prompts
// Used when countries field is empty but regions field is populated
// =============================================================================

export const REGION_STYLE = {
  "Africa": {
    colors: ["warm earth tones", "terracotta", "savanna gold"],
    motifs: ["African continent silhouette", "abstract geographic outline", "savanna landscape elements"]
  },
  "Arctic": {
    colors: ["ice blue", "white", "pale cyan", "frost silver"],
    motifs: ["polar ice formations", "aurora borealis curves", "arctic landscape silhouette", "ice crystal patterns"]
  },
  "Domestic US": {
    colors: ["red", "white", "blue", "navy"],
    motifs: ["US map silhouette", "American geographic outline", "capitol dome silhouette", "eagle silhouette (generic)"]
    // NOTE: No specific government seals, no politicians
  },
  "East and Southeast Asia": {
    colors: ["jade green", "imperial red", "gold", "pacific blue"],
    motifs: ["East Asian coastline silhouette", "Pacific Rim outline", "pagoda silhouette", "cherry blossom motif"]
  },
  "Europe/Eurasia": {
    colors: ["EU blue", "gold", "continental gray"],
    motifs: ["European continent silhouette", "Eurasian landmass outline", "continental bridge imagery"]
    // NOTE: Includes Russia geographically
  },
  "Global/Multilateral": {
    colors: ["UN blue", "earth tones", "interconnected spectrum"],
    motifs: ["complete globe", "world map projection", "interconnected network spanning globe", "multilateral connection lines"]
  },
  "Latin America": {
    colors: ["vibrant green", "tropical blue", "warm yellow", "earth red"],
    motifs: ["South American continent silhouette", "Central American isthmus", "Latin American geographic outline"]
  },
  "Middle East": {
    colors: ["desert gold", "sand beige", "oasis blue", "ancient bronze"],
    motifs: ["Middle Eastern geographic outline", "Arabian peninsula silhouette", "crescent geographic shape", "desert landscape elements"]
  },
  "South Asia": {
    colors: ["saffron", "green", "white", "Himalayan blue"],
    motifs: ["Indian subcontinent silhouette", "Himalayan mountain range", "South Asian geographic outline"]
  },
  "South Pacific and Oceania": {
    colors: ["ocean blue", "coral pink", "island green", "pacific turquoise"],
    motifs: ["Pacific island chains", "Australian continent silhouette", "Oceania map outline", "coral reef patterns"]
  }
};

// =============================================================================
// TRANSNATIONAL ORGANIZATION MOTIFS
// Visual elements for international organizations (all must be TEXT-FREE)
// =============================================================================

export const ORG_MOTIFS = {
  // ─────────────────────────────────────────────────────────────────────────
  // MAJOR GLOBAL ORGANIZATIONS
  // ─────────────────────────────────────────────────────────────────────────
  "United Nations": [
    "UN-style laurel wreath (no text)",
    "globe grid emblem with olive branches",
    "world map in circular frame"
  ],
  "World Bank": [
    "globe with development arc",
    "building/infrastructure growth motif",
    "interconnected economic nodes"
  ],
  "World Health Organization": [
    "staff of Asclepius symbol",
    "globe with medical cross overlay",
    "health shield emblem"
  ],
  "World Trade Organization": [
    "trade flow arrows around globe",
    "interconnected trade routes",
    "balanced scale with globe"
  ],
  "International Atomic Energy Agency": [
    "atom symbol with olive branches",
    "peaceful nuclear emblem",
    "atomic orbital with globe"
  ],
  "International Criminal Court": [
    "scales of justice emblem",
    "gavel silhouette with globe",
    "judicial balance symbol"
  ],
  "Interpol": [
    "globe with interconnected nodes",
    "international cooperation symbol",
    "worldwide network pattern"
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // SECURITY ALLIANCES
  // ─────────────────────────────────────────────────────────────────────────
  "NATO": [
    "four-pointed compass star (no text)",
    "North Atlantic geographic arc",
    "alliance shield geometry"
  ],
  "AUKUS": [
    "trilateral triangle emblem",
    "three-nation connection symbol",
    "Pacific security arc"
  ],
  "ANZUS": [
    "Pacific alliance triangle",
    "Southern Hemisphere arc",
    "trilateral defense symbol"
  ],
  "Five Eyes": [
    "five-pointed connection star",
    "pentagonal alliance symbol",
    "five-node intelligence network"
  ],
  "Quad": [
    "four-point diamond formation",
    "Indo-Pacific quadrilateral",
    "four-nation connection symbol"
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // REGIONAL ORGANIZATIONS
  // ─────────────────────────────────────────────────────────────────────────
  "European Union": [
    "circle of twelve stars (no text)",
    "European unity ring",
    "EU star circle emblem"
  ],
  "ASEAN": [
    "ten-nation rice bundle motif",
    "Southeast Asian connection symbol",
    "regional unity sheaf"
  ],
  "African Union": [
    "African continent with unity symbol",
    "pan-African emblem silhouette",
    "continental unity ring"
  ],
  "Arab League": [
    "crescent with regional unity chain",
    "Arab world connection symbol",
    "Middle Eastern alliance arc"
  ],
  "Gulf Cooperation Council": [
    "hexagonal Gulf emblem",
    "six-nation connection symbol",
    "Arabian Gulf geographic arc"
  ],
  "Organization of American States": [
    "Americas hemisphere emblem",
    "North-South American connection",
    "Western Hemisphere unity symbol"
  ],
  "Caribbean Community": [
    "Caribbean island chain motif",
    "regional sea connection symbol",
    "island unity arc"
  ],
  "Pacific Islands Forum": [
    "Pacific island constellation",
    "oceanic connection pattern",
    "island chain unity symbol"
  ],
  "Commonwealth of Nations": [
    "globe with radiating connection lines",
    "multilateral unity symbol",
    "worldwide partnership emblem"
  ],
  "Shanghai Cooperation Organisation": [
    "Eurasian landmass connection",
    "multilateral cooperation symbol",
    "regional partnership emblem"
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // ECONOMIC GROUPS
  // ─────────────────────────────────────────────────────────────────────────
  "G7": [
    "seven-point star formation",
    "heptagonal alliance symbol",
    "seven-nation connection emblem"
  ],
  "G20": [
    "twenty-point circular arrangement",
    "global economic ring",
    "major economies connection symbol"
  ],
  "BRICS": [
    "five-nation emerging arc",
    "intercontinental bridge symbol",
    "developing powers connection"
  ],
  "APEC": [
    "Pacific Rim circular connection",
    "Asia-Pacific economic ring",
    "transpacific trade arc"
  ],
  "OECD": [
    "developed nations circle",
    "economic cooperation ring",
    "multilateral development symbol"
  ],
  "OPEC": [
    "oil/energy resource symbol",
    "producer nations arc",
    "energy cooperation emblem"
  ]
};

// =============================================================================
// COUNTRY FLAG DESCRIPTIONS
// Used when countries field is populated - provides flag visual guidance
// NOTE: These are for DALL-E prompt construction, not for displaying actual flags
// =============================================================================

export const COUNTRY_FLAG_HINTS = {
  // Major powers and frequently referenced countries
  "United States": "red, white, and blue with stars and stripes pattern",
  "China": "red field with yellow stars",
  "Russia": "white, blue, and red horizontal tricolor",
  "United Kingdom": "Union Jack red, white, blue cross pattern",
  "France": "blue, white, red vertical tricolor",
  "Germany": "black, red, gold horizontal tricolor",
  "Japan": "white with red circle",
  "India": "saffron, white, green horizontal with blue wheel",
  "Brazil": "green with yellow diamond and blue circle",
  "Australia": "blue with Union Jack canton and Southern Cross stars",
  
  // Middle East
  "Israel": "white with blue stripes and Star of David",
  "Iran": "green, white, red horizontal with emblem",
  "Saudi Arabia": "green with white Arabic script and sword",
  "Turkey": "red with white crescent and star",
  "Egypt": "red, white, black horizontal with golden eagle",
  "Iraq": "red, white, black horizontal with green script",
  "United Arab Emirates": "green, white, black horizontal with red vertical band",
  
  // Asia
  "South Korea": "white with red and blue yin-yang and black trigrams",
  "North Korea": "blue, red, blue horizontal with white stripes and red star",
  "Taiwan": "red with blue canton containing white sun",
  "Pakistan": "green with white vertical band and white crescent and star",
  "Indonesia": "red and white horizontal bicolor",
  "Philippines": "blue, red horizontal with white triangle and sun",
  "Vietnam": "red with yellow star",
  "Thailand": "red, white, blue, white, red horizontal stripes",
  "Singapore": "red and white horizontal with crescent and stars",
  "Malaysia": "red and white stripes with blue canton and yellow crescent and star",
  
  // Europe
  "Ukraine": "blue and yellow horizontal bicolor",
  "Poland": "white and red horizontal bicolor",
  "Italy": "green, white, red vertical tricolor",
  "Spain": "red, yellow, red horizontal with coat of arms",
  "Netherlands": "red, white, blue horizontal tricolor",
  "Sweden": "blue with yellow Nordic cross",
  "Norway": "red with blue-white Nordic cross",
  "Finland": "white with blue Nordic cross",
  "Greece": "blue and white stripes with blue canton and white cross",
  
  // Africa
  "South Africa": "multicolor Y-shape with green, black, gold, white, red, blue",
  "Nigeria": "green, white, green vertical tricolor",
  "Kenya": "black, red, green horizontal with white stripes and shield",
  "Ethiopia": "green, yellow, red horizontal with blue circle emblem",
  
  // Americas
  "Canada": "red, white, red vertical with red maple leaf",
  "Mexico": "green, white, red vertical with coat of arms",
  "Argentina": "light blue, white, light blue horizontal with sun",
  "Colombia": "yellow, blue, red horizontal tricolor"
};

// =============================================================================
// CRITICAL REQUIREMENTS BLOCK
// This MUST be included verbatim in every DALL-E prompt
// =============================================================================

export const CRITICAL_REQUIREMENTS_BLOCK = `CRITICAL REQUIREMENTS:
- Absolutely NO text, words, letters, numbers, labels, or watermarks of any kind
- Absolutely NO US politicians (current or former)
- Absolutely NO US political party symbols or imagery (no elephant, no donkey)
- No realistic human faces
- No official government seals (FBI, CIA, NSA, DHS, DoD, etc.)
- No specific military unit insignia or patches
- Single cohesive icon, not a collage
- No multi-panel layouts, grids, or triptychs`;

// =============================================================================
// ICON GENERATION LOGIC RULES
// Reference for prompt construction
// =============================================================================

export const ICON_LOGIC_RULES = {
  // Topics: ALWAYS include thematic imagery
  topics: {
    required: true,
    instruction: "Always include visual motifs for each topic from TOPIC_STYLE"
  },
  
  // Countries: If populated, flags and maps are allowed
  countries: {
    whenPopulated: {
      allowCountryFlags: true,
      allowCountryMaps: true,
      allowRegionalMaps: true,
      instruction: "Include country flag elements and/or map silhouettes (neutral, no text)"
    },
    whenEmpty: {
      allowCountryFlags: false,
      allowCountryMaps: false,
      instruction: "NO country flags, NO country maps, avoid flag-like patterns"
    }
  },
  
  // Regions: Behavior depends on countries field
  regions: {
    whenCountriesPopulated: {
      allowRegionalMaps: true,
      instruction: "Regional map silhouette is optional supplement to country imagery"
    },
    whenCountriesEmpty: {
      allowRegionalMaps: true,
      allowCountryFlags: false,
      allowCountryMaps: false,
      instruction: "Regional map silhouette ONLY. NO country flags, NO country maps"
    }
  },
  
  // Transnational Organizations: If populated, emblems allowed
  transnational_org: {
    whenPopulated: {
      allowOrgEmblems: true,
      instruction: "Include organization emblem/symbol (must be text-free, neutral)"
    },
    whenEmpty: {
      allowOrgEmblems: false,
      instruction: "No organization emblems"
    }
  }
};

// =============================================================================
// STYLE REQUIREMENTS
// Consistent visual style for all icons
// =============================================================================

export const STYLE_REQUIREMENTS = [
  "Clean isometric perspective with subtle depth and shadows",
  "Corporate and professional appearance",
  "Modern, polished look",
  "Single cohesive icon, not a collage",
  "Clean white background or subtle gradient",
  "Output: 1024x1024 PNG",
  "Must read clearly when small (80x130 UI tile after center crop)",
  "No photorealism",
  "No propaganda framing",
  "No poster layout or title bands"
];

// =============================================================================
// COLLAGE/MULTI-PANEL PREVENTION
// Words that trigger rejection during preflight check
// =============================================================================

export const COLLAGE_TRIGGER_WORDS = [
  "triptych",
  "grid",
  "collage",
  "collection",
  "series",
  "four panels",
  "multi-panel",
  "split screen",
  "side by side",
  "before and after",
  "comparison",
  "montage",
  "mosaic",
  "arrangement of",
  "set of",
  "multiple images",
  "several icons"
];
