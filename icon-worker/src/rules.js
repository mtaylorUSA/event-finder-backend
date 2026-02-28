// =============================================================================
// RULES.JS - Icon Generation Rules for EventFinder
// Version: 4.0
// Last Updated: February 2026
// IMPROVEMENTS: Expanded motifs, composition templates, style variations
// =============================================================================

// =============================================================================
// TOPIC STYLES
// Maps each topic to colors and visual motifs for DALL-E prompts
// UPDATED: Each topic now has 4-6 motifs for rotation variety
// =============================================================================

export const TOPIC_STYLE = {
  "AI & Emerging Tech": {
    colors: ["teal", "cyan", "#14b8a6", "#06b6d4", "electric blue"],
    motifs: [
      "circuit board pattern with glowing nodes",
      "neural network constellation",
      "abstract microchip labyrinth",
      "flowing data streams",
      "crystalline tech formation",
      "digital aurora waves"
    ]
  },
  "AI & Emerging Technology": {
    colors: ["teal", "cyan", "#14b8a6", "#06b6d4", "electric blue"],
    motifs: [
      "circuit board pattern with glowing nodes",
      "neural network constellation",
      "abstract microchip labyrinth",
      "flowing data streams",
      "crystalline tech formation",
      "digital aurora waves"
    ]
  },
  "Careers & Professional Development": {
    colors: ["slate blue", "silver", "#64748b", "#94a3b8", "warm gray"],
    motifs: [
      "ascending geometric steps",
      "upward spiraling pathway",
      "interconnected growth rings",
      "abstract ladder of light",
      "rising sun rays pattern",
      "branching opportunity tree silhouette"
    ]
  },
  "Climate & Security": {
    colors: ["forest green", "emerald", "#059669", "#10b981", "ocean blue"],
    motifs: [
      "swirling weather patterns",
      "abstract leaf venation",
      "ocean current flows",
      "layered terrain contours",
      "sun and wind convergence",
      "melting ice formations"
    ]
  },
  "Environment & Climate": {
    colors: ["forest green", "emerald", "#059669", "#10b981", "ocean blue"],
    motifs: [
      "swirling weather patterns",
      "abstract leaf venation",
      "ocean current flows",
      "layered terrain contours",
      "sun and wind convergence",
      "organic growth spiral"
    ]
  },
  "Counterterrorism": {
    colors: ["deep crimson", "charcoal", "#dc2626", "#991b1b", "steel gray"],
    motifs: [
      "protective shield with radial lines",
      "interlocking security barriers",
      "vigilant eye abstract",
      "fortress wall pattern",
      "defensive perimeter rings",
      "sentinel tower silhouette"
    ]
  },
  "Terrorism & Counterterrorism": {
    colors: ["deep crimson", "charcoal", "#dc2626", "#991b1b", "steel gray"],
    motifs: [
      "protective shield with radial lines",
      "interlocking security barriers",
      "vigilant eye abstract",
      "fortress wall pattern",
      "defensive perimeter rings",
      "sentinel tower silhouette"
    ]
  },
  "Cybersecurity": {
    colors: ["electric purple", "neon violet", "#6366f1", "#8b5cf6", "dark indigo"],
    motifs: [
      "digital lock with radiating encryption",
      "firewall matrix pattern",
      "binary code waterfall",
      "shield with circuit overlay",
      "honeycomb security grid",
      "abstract keyhole vortex"
    ]
  },
  "Defense Policy": {
    colors: ["navy blue", "royal blue", "#3b82f6", "#1d4ed8", "steel"],
    motifs: [
      "strategic compass rose",
      "layered defense architecture",
      "abstract radar sweep",
      "fortified geometry",
      "command structure diagram",
      "tactical grid overlay"
    ]
  },
  "Defense Policy & Intelligence": {
    colors: ["navy blue", "midnight", "#3b82f6", "#1d4ed8", "silver"],
    motifs: [
      "strategic compass with shadow",
      "intelligence network web",
      "layered information streams",
      "abstract satellite view",
      "encrypted signal waves",
      "surveillance geometry"
    ]
  },
  "Diplomacy & Statecraft": {
    colors: ["royal purple", "gold", "#7c3aed", "#a855f7", "diplomatic blue"],
    motifs: [
      "intertwined olive branches",
      "bridge of connection arches",
      "converging pathways",
      "diplomatic table circular",
      "clasped geometric forms",
      "treaty scroll waves"
    ]
  },
  "Economic Security": {
    colors: ["gold", "amber", "#ca8a04", "#eab308", "bronze"],
    motifs: [
      "flowing trade route lines",
      "interconnected supply nodes",
      "abstract market waves",
      "economic growth curves",
      "resource flow diagram",
      "prosperity sunburst"
    ]
  },
  "Homeland Security": {
    colors: ["dark blue", "indigo", "#1e40af", "#3730a3", "patriot red"],
    motifs: [
      "protective dome silhouette",
      "guardian shield layers",
      "secure perimeter rings",
      "homeland map abstract",
      "border protection lines",
      "sentinel watchtower"
    ]
  },
  "Intelligence": {
    colors: ["charcoal", "slate gray", "#1e293b", "#475569", "shadow blue"],
    motifs: [
      "abstract eye with data streams",
      "satellite orbital paths",
      "information web network",
      "cryptic pattern layers",
      "signal interception waves",
      "covert geometry"
    ]
  },
  "Military Operations": {
    colors: ["military green", "olive", "#065f46", "#047857", "tactical tan"],
    motifs: [
      "tactical compass overlay",
      "terrain contour lines",
      "strategic movement arrows",
      "operational grid pattern",
      "mission planning geometry",
      "deployment formation abstract"
    ]
  },
  "Nuclear/WMD": {
    colors: ["warning orange", "hazard red", "#f59e0b", "#dc2626", "radiation yellow"],
    motifs: [
      "atom orbital paths",
      "nuclear core glow",
      "containment structure",
      "isotope decay pattern",
      "fission reaction abstract",
      "atomic lattice geometry"
    ]
  },
  "Nuclear & WMD": {
    colors: ["warning orange", "hazard red", "#f59e0b", "#dc2626", "radiation yellow"],
    motifs: [
      "atom orbital paths",
      "nuclear core glow",
      "containment structure",
      "isotope decay pattern",
      "fission reaction abstract",
      "atomic lattice geometry"
    ]
  },
  "Space & Satellites": {
    colors: ["deep space blue", "cosmic purple", "#0f172a", "#6366f1", "starlight white"],
    motifs: [
      "orbital ring system",
      "satellite constellation",
      "cosmic nebula swirl",
      "launch trajectory arc",
      "planetary alignment",
      "stellar navigation chart"
    ]
  }
};

// =============================================================================
// REGION STYLES
// Maps each region to visual elements for DALL-E prompts
// UPDATED: Each region now has multiple motifs for variety
// =============================================================================

export const REGION_STYLE = {
  "Africa": {
    colors: ["warm earth", "terracotta", "savanna gold", "sunset orange"],
    motifs: [
      "African continent silhouette",
      "savanna horizon line",
      "tribal pattern abstract",
      "baobab tree silhouette"
    ]
  },
  "Arctic": {
    colors: ["ice blue", "frost white", "pale cyan", "aurora green"],
    motifs: [
      "polar ice formation",
      "aurora borealis waves",
      "arctic landscape layers",
      "glacial geometry"
    ]
  },
  "Domestic US": {
    colors: ["patriot red", "white", "freedom blue", "navy"],
    motifs: [
      "US map silhouette",
      "capitol dome abstract",
      "eagle wing sweep",
      "amber waves pattern"
    ]
  },
  "East and Southeast Asia": {
    colors: ["jade green", "imperial red", "gold", "pacific blue"],
    motifs: [
      "Pacific Rim coastline",
      "mountain range silhouette",
      "cherry blossom scatter",
      "dragon scale pattern"
    ]
  },
  "Europe/Eurasia": {
    colors: ["EU blue", "continental gold", "heritage gray", "Baltic teal"],
    motifs: [
      "European continent outline",
      "classical column abstract",
      "Alpine mountain range",
      "river network pattern"
    ]
  },
  "Global/Multilateral": {
    colors: ["UN blue", "earth green", "ocean teal", "unity gold"],
    motifs: [
      "complete globe view",
      "world map projection",
      "interconnected continents",
      "global network sphere"
    ]
  },
  "Latin America": {
    colors: ["tropical green", "vibrant blue", "warm yellow", "Aztec red"],
    motifs: [
      "South American silhouette",
      "Andes mountain range",
      "Amazon river network",
      "Mayan geometric pattern"
    ]
  },
  "Middle East": {
    colors: ["desert gold", "sand beige", "oasis blue", "ancient bronze"],
    motifs: [
      "Arabian peninsula outline",
      "desert dune waves",
      "crescent moon arc",
      "ancient geometric tilework"
    ]
  },
  "South Asia": {
    colors: ["saffron", "peacock green", "white", "Himalayan blue"],
    motifs: [
      "Indian subcontinent shape",
      "Himalayan peak range",
      "lotus pattern abstract",
      "mandala geometry"
    ]
  },
  "South Pacific and Oceania": {
    colors: ["ocean blue", "coral pink", "island green", "pacific turquoise"],
    motifs: [
      "Pacific island chain",
      "Australian outline",
      "coral reef pattern",
      "wave pattern layers"
    ]
  }
};

// =============================================================================
// TRANSNATIONAL ORGANIZATION MOTIFS
// Visual elements for international organizations (all must be TEXT-FREE)
// UPDATED: Multiple motifs per organization
// =============================================================================

export const ORG_MOTIFS = {
  "United Nations": ["laurel wreath circle", "olive branch pattern", "global unity ring"],
  "World Bank": ["development arc globe", "infrastructure growth lines", "prosperity bridge"],
  "World Health Organization": ["staff of Asclepius", "medical cross pattern", "healing serpent"],
  "World Trade Organization": ["trade flow arrows", "commerce network", "exchange pathways"],
  "International Atomic Energy Agency": ["peaceful atom emblem", "nuclear olive branch", "containment ring"],
  "International Criminal Court": ["scales of justice", "judicial balance", "law pillar"],
  "Interpol": ["global network nodes", "worldwide web pattern", "international shield"],

  "NATO": ["four-point compass star", "Atlantic arc bridge", "alliance shield"],
  "AUKUS": ["trilateral triangle", "Pacific security arc", "three-nation bond"],
  "ANZUS": ["Pacific alliance triangle", "Southern Hemisphere arc", "oceanic partnership"],
  "Five Eyes": ["five-pointed star connection", "pentagonal network", "intelligence ring"],
  "Quad": ["four-point diamond", "Indo-Pacific square", "quadrilateral bond"],

  "European Union": ["twelve-star circle", "European unity ring", "continental bond"],
  "ASEAN": ["rice bundle motif", "Southeast Asian chain", "regional harmony"],
  "African Union": ["continental unity symbol", "pan-African emblem", "solidarity ring"],
  "Arab League": ["crescent unity arc", "Arab world connection", "regional bond"],
  "Gulf Cooperation Council": ["hexagonal Gulf emblem", "Arabian Gulf arc", "cooperation ring"],
  "Organization of American States": ["Americas hemisphere", "Western unity", "continental bridge"],
  "Caribbean Community": ["island chain motif", "Caribbean arc", "island unity"],
  "Pacific Islands Forum": ["Pacific constellation", "oceanic connection", "island network"],
  "Commonwealth of Nations": ["radiating globe lines", "worldwide partnership", "heritage bond"],
  "Shanghai Cooperation Organisation": ["Eurasian connection", "regional partnership", "eastern alliance"],

  "G7": ["seven-point formation", "seven-nation ring", "leadership circle"],
  "G20": ["twenty-nation arrangement", "global economic ring", "world leaders circle"],
  "BRICS": ["five-nation arc", "emerging powers bridge", "intercontinental bond"],
  "APEC": ["Pacific Rim circle", "Asia-Pacific ring", "trade arc"],
  "OECD": ["developed nations circle", "economic cooperation ring", "prosperity network"],
  "OPEC": ["energy resource symbol", "producer nations arc", "oil drop pattern"]
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
// COMPOSITION TEMPLATES
// NEW: Different layout approaches for visual variety
// =============================================================================

export const COMPOSITION_TEMPLATES = [
  {
    name: "diagonal-flow",
    description: "Dynamic diagonal movement from corner to corner",
    instruction: "Compose with strong diagonal flow from bottom-left to top-right, elements sweeping across the canvas"
  },
  {
    name: "radial-burst",
    description: "Elements radiating from a focal point",
    instruction: "Compose with elements radiating outward from an off-center focal point, creating dynamic energy"
  },
  {
    name: "layered-depth",
    description: "Multiple overlapping layers creating depth",
    instruction: "Compose with 3-4 overlapping translucent layers, creating sense of depth and dimension"
  },
  {
    name: "organic-flow",
    description: "Smooth, flowing organic shapes",
    instruction: "Compose with smooth, flowing organic curves that sweep across the canvas naturally"
  },
  {
    name: "geometric-anchor",
    description: "Bold geometric shape anchoring the composition",
    instruction: "Compose with one bold geometric shape anchored in corner, with complementary elements filling space"
  },
  {
    name: "horizon-split",
    description: "Horizontal division with contrasting zones",
    instruction: "Compose with subtle horizontal division creating two complementary zones that blend together"
  },
  {
    name: "vortex-spiral",
    description: "Spiraling movement drawing eye inward",
    instruction: "Compose with gentle spiral movement drawing the eye toward an off-center focal point"
  },
  {
    name: "scattered-elements",
    description: "Distributed elements across canvas",
    instruction: "Compose with primary motif elements distributed across canvas with varying sizes, unified by color"
  }
];

// =============================================================================
// STYLE VARIATIONS
// NEW: Different artistic approaches for the same content
// =============================================================================

export const STYLE_VARIATIONS = [
  "Bold and graphic with high contrast",
  "Soft gradients with subtle transitions",
  "Textured with organic grain",
  "Clean and minimal with precise edges",
  "Atmospheric with depth and glow",
  "Dynamic with implied movement"
];

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

// =============================================================================
// ICON GENERATION LOGIC RULES (Reference)
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
      instruction: "Include country flag elements and/or map silhouettes (text-free, neutral)"
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
// =============================================================================

export const STYLE_REQUIREMENTS = [
  "Full-bleed artwork that extends to all edges of the canvas",
  "NO white background, NO padding, NO margins",
  "NO button style, NO badge frame, NO rounded rectangle border",
  "NO floating island or centered object on empty background",
  "Abstract, artistic interpretation - not literal icons",
  "Gradient or textured background that fills entire canvas",
  "Professional and modern aesthetic",
  "Output: 1024x1024 PNG",
  "Must read clearly when small (80x130 UI tile after center crop)"
];
