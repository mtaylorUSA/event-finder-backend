// =============================================================================
// RULES.JS - Icon Generation Rules for EventFinder
// Version: 3.2
// Last Updated: December 2024
// Style: Minimal, edge-to-edge, no button frames
// =============================================================================

// =============================================================================
// TOPIC STYLES
// Maps each topic to colors and visual motifs for DALL-E prompts
// =============================================================================

export const TOPIC_STYLE = {
  "AI & Emerging Tech": {
    colors: ["teal", "cyan", "#14b8a6", "#06b6d4"],
    motifs: ["circuit board pattern", "neural network nodes", "microchip geometry"]
  },
  "AI & Emerging Technology": {
    colors: ["teal", "cyan", "#14b8a6", "#06b6d4"],
    motifs: ["circuit board pattern", "neural network nodes", "microchip geometry"]
  },
  "Careers & Professional Development": {
    colors: ["gray", "slate blue", "#64748b", "#94a3b8"],
    motifs: ["ascending steps", "upward arrow", "ladder silhouette"]
  },
  "Climate & Security": {
    colors: ["green", "emerald", "#059669", "#10b981"],
    motifs: ["globe with leaves", "weather patterns", "environmental motif"]
  },
  "Environment & Climate": {
    colors: ["green", "emerald", "#059669", "#10b981"],
    motifs: ["globe with leaves", "weather patterns", "environmental motif"]
  },
  "Counterterrorism": {
    colors: ["deep red", "crimson", "#dc2626", "#991b1b"],
    motifs: ["protective shield", "security perimeter", "defensive geometry"]
  },
  "Terrorism & Counterterrorism": {
    colors: ["deep red", "crimson", "#dc2626", "#991b1b"],
    motifs: ["protective shield", "security perimeter", "defensive geometry"]
  },
  "Cybersecurity": {
    colors: ["purple", "violet", "#6366f1", "#8b5cf6"],
    motifs: ["digital lock", "shield with circuitry", "encrypted pattern"]
  },
  "Defense Policy": {
    colors: ["navy blue", "royal blue", "#3b82f6", "#1d4ed8"],
    motifs: ["shield emblem", "strategic map lines", "defense architecture"]
  },
  "Defense Policy & Intelligence": {
    colors: ["navy blue", "royal blue", "#3b82f6", "#1d4ed8"],
    motifs: ["shield emblem", "strategic map lines", "abstract eye symbol"]
  },
  "Diplomacy & Statecraft": {
    colors: ["purple", "lavender", "#7c3aed", "#a855f7"],
    motifs: ["handshake silhouette", "olive branch", "bridge connection"]
  },
  "Economic Security": {
    colors: ["gold", "amber", "#ca8a04", "#eab308"],
    motifs: ["trade route lines", "supply chain pattern", "interconnected nodes"]
    // NOTE: No currency symbols ($, €, ¥, £) - these trigger text detection
  },
  "Homeland Security": {
    colors: ["dark blue", "indigo", "#1e40af", "#3730a3"],
    motifs: ["protective dome", "secure perimeter", "guardian silhouette"]
  },
  "Intelligence": {
    colors: ["charcoal", "slate gray", "#1e293b", "#475569"],
    motifs: ["abstract eye symbol", "satellite silhouette", "surveillance pattern"]
  },
  "Military Operations": {
    colors: ["military green", "forest green", "#065f46", "#047857"],
    motifs: ["compass rose", "tactical contour lines", "strategic grid"]
    // NOTE: No specific unit insignia or patches
  },
  "Nuclear/WMD": {
    colors: ["orange", "warning red", "#f59e0b", "#dc2626"],
    motifs: ["atom symbol", "radiation trefoil", "nuclear core geometry"]
  },
  "Nuclear & WMD": {
    colors: ["orange", "warning red", "#f59e0b", "#dc2626"],
    motifs: ["atom symbol", "radiation trefoil", "nuclear core geometry"]
  },
  "Space & Satellites": {
    colors: ["deep space blue", "purple", "#0f172a", "#6366f1"],
    motifs: ["satellite silhouette", "orbit rings", "star field"]
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
    motifs: ["African continent silhouette", "savanna landscape"]
  },
  "Arctic": {
    colors: ["ice blue", "white", "pale cyan", "frost silver"],
    motifs: ["polar ice formations", "aurora borealis curves", "arctic landscape"]
  },
  "Domestic US": {
    colors: ["red", "white", "blue", "navy"],
    motifs: ["US map silhouette", "capitol dome silhouette", "eagle silhouette"]
    // NOTE: No specific government seals, no politicians
  },
  "East and Southeast Asia": {
    colors: ["jade green", "imperial red", "gold", "pacific blue"],
    motifs: ["East Asian coastline silhouette", "Pacific Rim outline", "pagoda silhouette"]
  },
  "Europe/Eurasia": {
    colors: ["EU blue", "gold", "continental gray"],
    motifs: ["European continent silhouette", "Eurasian landmass outline"]
    // NOTE: Includes Russia geographically
  },
  "Global/Multilateral": {
    colors: ["UN blue", "earth tones", "interconnected spectrum"],
    motifs: ["complete globe", "world map projection", "global network lines"]
  },
  "Latin America": {
    colors: ["vibrant green", "tropical blue", "warm yellow", "earth red"],
    motifs: ["South American continent silhouette", "Central American isthmus"]
  },
  "Middle East": {
    colors: ["desert gold", "sand beige", "oasis blue", "ancient bronze"],
    motifs: ["Middle Eastern geographic outline", "Arabian peninsula silhouette", "desert landscape"]
  },
  "South Asia": {
    colors: ["saffron", "green", "white", "Himalayan blue"],
    motifs: ["Indian subcontinent silhouette", "Himalayan mountain range"]
  },
  "South Pacific and Oceania": {
    colors: ["ocean blue", "coral pink", "island green", "pacific turquoise"],
    motifs: ["Pacific island chains", "Australian continent silhouette", "coral reef pattern"]
  }
};

// =============================================================================
// TRANSNATIONAL ORGANIZATION MOTIFS
// Visual elements for international organizations (all must be TEXT-FREE)
// =============================================================================

export const ORG_MOTIFS = {
  // MAJOR GLOBAL ORGANIZATIONS
  "United Nations": ["laurel wreath pattern", "globe with olive branches"],
  "World Bank": ["globe with development arc", "infrastructure growth motif"],
  "World Health Organization": ["staff of Asclepius symbol", "medical cross overlay"],
  "World Trade Organization": ["trade flow arrows", "interconnected routes"],
  "International Atomic Energy Agency": ["atom symbol with olive branches", "peaceful nuclear emblem"],
  "International Criminal Court": ["scales of justice", "judicial balance symbol"],
  "Interpol": ["globe with interconnected nodes", "worldwide network pattern"],

  // SECURITY ALLIANCES
  "NATO": ["four-pointed compass star", "North Atlantic arc"],
  "AUKUS": ["trilateral triangle emblem", "Pacific security arc"],
  "ANZUS": ["Pacific alliance triangle", "Southern Hemisphere arc"],
  "Five Eyes": ["five-pointed connection star", "pentagonal alliance symbol"],
  "Quad": ["four-point diamond formation", "Indo-Pacific quadrilateral"],

  // REGIONAL ORGANIZATIONS
  "European Union": ["circle of twelve stars", "European unity ring"],
  "ASEAN": ["rice bundle motif", "Southeast Asian connection"],
  "African Union": ["African continent unity symbol", "pan-African emblem"],
  "Arab League": ["crescent with unity chain", "Arab world connection"],
  "Gulf Cooperation Council": ["hexagonal Gulf emblem", "Arabian Gulf arc"],
  "Organization of American States": ["Americas hemisphere emblem", "Western Hemisphere unity"],
  "Caribbean Community": ["Caribbean island chain motif", "island unity arc"],
  "Pacific Islands Forum": ["Pacific island constellation", "oceanic connection pattern"],
  "Commonwealth of Nations": ["globe with radiating lines", "worldwide partnership emblem"],
  "Shanghai Cooperation Organisation": ["Eurasian landmass connection", "regional partnership emblem"],

  // ECONOMIC GROUPS
  "G7": ["seven-point star formation", "seven-nation emblem"],
  "G20": ["circular arrangement", "global economic ring"],
  "BRICS": ["five-nation arc", "intercontinental bridge"],
  "APEC": ["Pacific Rim circle", "Asia-Pacific ring"],
  "OECD": ["developed nations circle", "economic cooperation ring"],
  "OPEC": ["energy resource symbol", "producer nations arc"]
};

// =============================================================================
// COUNTRY FLAG DESCRIPTIONS
// Used when countries field is populated - provides flag visual guidance
// =============================================================================

export const COUNTRY_FLAG_HINTS = {
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
  "Israel": "white with blue stripes and Star of David",
  "Iran": "green, white, red horizontal with emblem",
  "Saudi Arabia": "green with white Arabic script and sword",
  "Turkey": "red with white crescent and star",
  "Egypt": "red, white, black horizontal with golden eagle",
  "Iraq": "red, white, black horizontal with green script",
  "United Arab Emirates": "green, white, black horizontal with red vertical band",
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
  "Ukraine": "blue and yellow horizontal bicolor",
  "Poland": "white and red horizontal bicolor",
  "Italy": "green, white, red vertical tricolor",
  "Spain": "red, yellow, red horizontal with coat of arms",
  "Netherlands": "red, white, blue horizontal tricolor",
  "Sweden": "blue with yellow Nordic cross",
  "Norway": "red with blue-white Nordic cross",
  "Finland": "white with blue Nordic cross",
  "Greece": "blue and white stripes with blue canton and white cross",
  "South Africa": "multicolor Y-shape with green, black, gold, white, red, blue",
  "Nigeria": "green, white, green vertical tricolor",
  "Kenya": "black, red, green horizontal with white stripes and shield",
  "Ethiopia": "green, yellow, red horizontal with blue circle emblem",
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
- Single cohesive unified image only
- No divided layouts or segmented frames`;

// =============================================================================
// ICON GENERATION LOGIC RULES
// Reference for prompt construction
// =============================================================================

export const ICON_LOGIC_RULES = {
  topics: {
    required: true,
    instruction: "Always include visual motifs for each topic from TOPIC_STYLE"
  },
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
// NEW: Minimal, edge-to-edge, no button/badge frames
// =============================================================================

export const STYLE_REQUIREMENTS = [
  "Full-bleed artwork that extends to all edges of the canvas",
  "NO white background, NO padding, NO margins",
  "NO button style, NO badge frame, NO rounded rectangle border",
  "NO floating island or centered object on empty background",
  "ONE primary visual element only - keep it simple and bold",
  "Abstract, artistic interpretation - not literal icons",
  "Gradient or textured background that fills entire canvas",
  "Professional and modern aesthetic",
  "Output: 1024x1024 PNG",
  "Must read clearly when small (80x130 UI tile after center crop)"
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
