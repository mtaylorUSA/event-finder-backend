// =============================================================================
// POLICYENGINE.JS - Prompt Construction for DALL-E Icon Generation
// Version: 4.0
// Last Updated: February 2026
// IMPROVEMENTS: Motif rotation, composition templates, style variations
// =============================================================================

import {
  TOPIC_STYLE,
  REGION_STYLE,
  ORG_MOTIFS,
  COUNTRY_FLAG_HINTS,
  CRITICAL_REQUIREMENTS_BLOCK,
  COLLAGE_TRIGGER_WORDS,
  COMPOSITION_TEMPLATES,
  STYLE_VARIATIONS
} from "./rules.js";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Simple string hash function for deterministic but varied selection
 * Returns a number that can be used for modulo selection
 */
function hashString(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Select an item from array using hash-based rotation
 * Same input always produces same output, but different inputs vary
 */
function selectByHash(array, hashSeed, offset = 0) {
  if (!array || array.length === 0) return null;
  const hash = hashString(hashSeed);
  const index = (hash + offset) % array.length;
  return array[index];
}

/**
 * Select multiple items from array using hash-based rotation
 */
function selectMultipleByHash(array, hashSeed, count = 2) {
  if (!array || array.length === 0) return [];
  const results = [];
  const hash = hashString(hashSeed);
  for (let i = 0; i < Math.min(count, array.length); i++) {
    const index = (hash + i * 7) % array.length; // Use prime multiplier for spread
    if (!results.includes(array[index])) {
      results.push(array[index]);
    }
  }
  return results;
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function sanitizeMotifs(motifs) {
  return (motifs || []).filter((m) => !/currency|symbol|dollar|euro|yen|pound|£|\$|€|¥/i.test(m));
}

// =============================================================================
// PREFLIGHT CHECKS
// =============================================================================

export function preflightPromptChecks(prompt) {
  const lower = prompt.toLowerCase();
  const hit = (COLLAGE_TRIGGER_WORDS || []).find((w) => lower.includes(String(w).toLowerCase()));
  if (hit) return { ok: false, reason: `prompt_contains_collage_trigger_word:${hit}` };
  return { ok: true };
}

// =============================================================================
// ICON PLANNING
// =============================================================================

export function deriveIconPlan({ countries = [], regions = [], transnational_org = [] }) {
  const hasCountries = Array.isArray(countries) && countries.length > 0;
  const hasRegions = Array.isArray(regions) && regions.length > 0;
  const hasOrgs = Array.isArray(transnational_org) && transnational_org.length > 0;

  return {
    geography: {
      allowCountryFlags: hasCountries,
      allowCountryMaps: hasCountries,
      allowRegionalMap: hasCountries || (!hasCountries && hasRegions),
      allowOrgEmblems: hasOrgs,
      hasCountries,
      hasRegions
    }
  };
}

// =============================================================================
// STYLE BUILDERS WITH ROTATION
// =============================================================================

/**
 * Build topic style with ROTATED motif selection
 * Uses combination key as hash seed for consistent but varied results
 */
function buildTopicStyle(topics, hashSeed) {
  const styles = (topics || []).map((t) => TOPIC_STYLE?.[t]).filter(Boolean);
  const allColors = uniq(styles.flatMap((s) => s.colors));
  const allMotifs = sanitizeMotifs(uniq(styles.flatMap((s) => s.motifs)));
  
  // Select colors using hash (take 4-5 varied colors)
  const selectedColors = selectMultipleByHash(allColors, hashSeed, 5);
  
  // Select 2 motifs using hash - this is the KEY FIX for variety
  const selectedMotifs = selectMultipleByHash(allMotifs, hashSeed, 2);
  
  return {
    colors: selectedColors,
    motifs: selectedMotifs,
    allMotifs: allMotifs // Keep full list for fallback
  };
}

/**
 * Build region style with ROTATED motif selection
 */
function buildRegionStyle(regions, hashSeed) {
  const styles = (regions || []).map((r) => REGION_STYLE?.[r]).filter(Boolean);
  const allColors = uniq(styles.flatMap((s) => s.colors));
  const allMotifs = uniq(styles.flatMap((s) => s.motifs));
  
  return {
    colors: selectMultipleByHash(allColors, hashSeed + "_region", 3),
    motifs: selectMultipleByHash(allMotifs, hashSeed + "_region", 1)
  };
}

/**
 * Build org motifs with rotation
 */
function buildOrgMotifs(orgs, hashSeed) {
  for (const o of orgs || []) {
    const motifs = ORG_MOTIFS?.[o];
    if (Array.isArray(motifs) && motifs.length > 0) {
      return [selectByHash(motifs, hashSeed + "_org")];
    }
  }
  return [];
}

/**
 * Build country flag hints with rotation
 */
function buildCountryFlagHints(countries, hashSeed) {
  if (!countries || countries.length === 0) return [];
  
  // If multiple countries, select which one to feature based on hash
  const featuredCountry = selectByHash(countries, hashSeed + "_country");
  const hint = COUNTRY_FLAG_HINTS?.[featuredCountry];
  
  if (hint) return [`${featuredCountry}: ${hint}`];
  return [`${featuredCountry}: simplified national-flag colors (no text)`];
}

/**
 * Select composition template based on hash
 */
function selectComposition(hashSeed, attemptIndex = 0) {
  // Use attempt index to try different compositions on retry
  const adjustedSeed = hashSeed + "_comp_" + attemptIndex;
  return selectByHash(COMPOSITION_TEMPLATES, adjustedSeed);
}

/**
 * Select style variation based on hash
 */
function selectStyleVariation(hashSeed, attemptIndex = 0) {
  const adjustedSeed = hashSeed + "_style_" + attemptIndex;
  return selectByHash(STYLE_VARIATIONS, adjustedSeed);
}

// =============================================================================
// MAIN PROMPT BUILDER
// =============================================================================

export function buildDalleIconPrompt({
  topics = [],
  countries = [],
  regions = [],
  transnational_org = [],
  attemptIndex = 0,
  recordId = "" // Optional: adds extra uniqueness per record
}) {
  // Build unique hash seed from the combination
  // This ensures same combination = same visual style, but different combinations vary
  const hashSeed = [
    topics.sort().join(","),
    regions.sort().join(","),
    countries.sort().join(","),
    transnational_org.sort().join(","),
    recordId
  ].join("|");

  const plan = deriveIconPlan({ countries, regions, transnational_org });

  // Build styles with hash-based rotation
  const topicStyle = buildTopicStyle(topics, hashSeed);
  const regionStyle = buildRegionStyle(regions, hashSeed);
  const orgMotifs = buildOrgMotifs(transnational_org, hashSeed);
  const countryFlagHints = buildCountryFlagHints(countries, hashSeed);

  // Select composition and style variation
  const composition = selectComposition(hashSeed, attemptIndex);
  const styleVariation = selectStyleVariation(hashSeed, attemptIndex);

  // Combine colors with topic priority
  const palette = uniq([...topicStyle.colors, ...regionStyle.colors]).slice(0, 5);

  // Combine motifs - now we have VARIETY
  const allMotifs = sanitizeMotifs([
    ...topicStyle.motifs,
    ...regionStyle.motifs,
    ...orgMotifs
  ]);

  // Select primary and secondary motifs
  const primaryMotif = allMotifs[0] || "abstract flowing pattern";
  const secondaryMotif = allMotifs[1] || null;

  // Build visual elements description
  const visualElements = [primaryMotif];
  if (secondaryMotif && attemptIndex < 2) {
    visualElements.push(`with subtle ${secondaryMotif} integration`);
  }

  // Build geographic context
  const geoContext = [];
  if (plan.geography.allowCountryFlags && countryFlagHints.length) {
    geoContext.push(`Incorporate colors inspired by: ${countryFlagHints[0]}`);
  } else if (plan.geography.allowRegionalMap && regions.length) {
    const regionMotif = regionStyle.motifs[0];
    if (regionMotif) {
      geoContext.push(`Subtle geographic reference: ${regionMotif}`);
    }
  }

  // Build retry adjustments - SOFTER than before
  const retryAdjustments = [];
  if (attemptIndex === 1) {
    retryAdjustments.push("Simplify slightly: emphasize the primary visual element more boldly");
  } else if (attemptIndex === 2) {
    retryAdjustments.push("More abstract: interpret the theme through color and shape rather than literal imagery");
  } else if (attemptIndex === 3) {
    retryAdjustments.push("Highly stylized: use bold gradients and simplified geometric forms");
  } else if (attemptIndex >= 4) {
    retryAdjustments.push("Maximum simplicity: single bold shape with rich gradient, minimal detail");
  }

  // Construct the prompt
  const prompt = [
    `Create an abstract, full-bleed artwork for a national security event.`,
    ``,
    `THEME: ${topics.join(", ")}`,
    ``,
    `PRIMARY VISUAL: ${visualElements.join(" ")}`,
    `COLOR PALETTE: ${palette.join(", ")}`,
    `ARTISTIC STYLE: ${styleVariation}`,
    ``,
    `COMPOSITION: ${composition.instruction}`,
    ``,
    ...(geoContext.length ? [`GEOGRAPHIC CONTEXT:`, ...geoContext.map(g => `- ${g}`), ``] : []),
    `TECHNICAL REQUIREMENTS:`,
    `- Full-bleed 1024x1024 artwork extending to all edges`,
    `- NO white space, NO margins, NO padding`,
    `- NO button frame, NO badge border, NO rounded rectangle`,
    `- Rich gradients or textures filling entire canvas`,
    `- Must remain visually interesting at 80x130 pixel display size`,
    ``,
    CRITICAL_REQUIREMENTS_BLOCK,
    ``,
    ...(retryAdjustments.length ? [`ADDITIONAL GUIDANCE:`, ...retryAdjustments, ``] : [])
  ].join("\n");

  // Validate prompt
  const preflight = preflightPromptChecks(prompt);
  if (!preflight.ok) {
    // Log warning but don't throw - let caller handle gracefully
    console.warn(`    [POLICY] ⚠️ Preflight warning: ${preflight.reason}`);
    console.warn(`    [POLICY] ⚠️ Attempting to sanitize prompt...`);
    
    // Try to remove the offending trigger word context and rebuild
    // If we can't fix it, return null so caller can skip this record
    return null;
  }

  return prompt;
}

// =============================================================================
// EXPORTS FOR DEBUGGING/TESTING
// =============================================================================

export const _internal = {
  hashString,
  selectByHash,
  selectMultipleByHash,
  buildTopicStyle,
  buildRegionStyle,
  selectComposition,
  selectStyleVariation
};
