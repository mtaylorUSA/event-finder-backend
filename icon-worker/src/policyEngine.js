import {
  TOPIC_STYLE,
  REGION_STYLE,
  ORG_MOTIFS,
  COUNTRY_FLAG_HINTS,
  CRITICAL_REQUIREMENTS_BLOCK,
  COLLAGE_TRIGGER_WORDS,
  STYLE_REQUIREMENTS
} from "./rules.js";

export function preflightPromptChecks(prompt) {
  const lower = prompt.toLowerCase();
  const hit = (COLLAGE_TRIGGER_WORDS || []).find((w) => lower.includes(String(w).toLowerCase()));
  if (hit) return { ok: false, reason: `prompt_contains_collage_trigger_word:${hit}` };
  return { ok: true };
}

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

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function buildTopicStyle(topics) {
  const styles = (topics || []).map((t) => TOPIC_STYLE?.[t]).filter(Boolean);
  return {
    colors: uniq(styles.flatMap((s) => s.colors)).slice(0, 4),
    // Only take the FIRST motif from each topic for simplicity
    motifs: uniq(styles.map((s) => s.motifs?.[0]).filter(Boolean)).slice(0, 2)
  };
}

function buildRegionStyle(regions) {
  const styles = (regions || []).map((r) => REGION_STYLE?.[r]).filter(Boolean);
  return {
    colors: uniq(styles.flatMap((s) => s.colors)).slice(0, 3),
    // Only take the FIRST motif
    motifs: uniq(styles.map((s) => s.motifs?.[0]).filter(Boolean)).slice(0, 1)
  };
}

function buildOrgMotifs(orgs) {
  // Only take ONE motif from the FIRST org
  for (const o of orgs || []) {
    const m = ORG_MOTIFS?.[o];
    if (Array.isArray(m) && m.length > 0) {
      return [m[0]];
    }
  }
  return [];
}

function buildCountryFlagHints(countries) {
  // Only include the FIRST country's flag hint
  for (const c of countries || []) {
    const hint = COUNTRY_FLAG_HINTS?.[c];
    if (hint) return [`${c}: ${hint}`];
  }
  if (countries.length > 0) {
    return [`${countries[0]}: simplified national-flag colors (no text)`];
  }
  return [];
}

function sanitizeMotifs(motifs) {
  return (motifs || []).filter((m) => !/currency|symbol|dollar|euro|yen|pound|£|\$|€|¥/i.test(m));
}

export function buildDalleIconPrompt({
  topics = [],
  countries = [],
  regions = [],
  transnational_org = [],
  attemptIndex = 0
}) {
  const plan = deriveIconPlan({ countries, regions, transnational_org });

  const topicStyle = buildTopicStyle(topics);
  const regionStyle = buildRegionStyle(regions);
  const orgMotifs = buildOrgMotifs(transnational_org);
  const countryFlagHints = buildCountryFlagHints(countries);

  // Combine colors, prioritizing topic colors
  const palette = uniq([...topicStyle.colors, ...regionStyle.colors]).slice(0, 4);

  // Pick ONE primary motif
  const allMotifs = sanitizeMotifs([...topicStyle.motifs, ...regionStyle.motifs, ...orgMotifs]);
  const primaryMotif = allMotifs[0] || "abstract geometric pattern";

  // Retry instructions for failed attempts
  const retry = [];
  if (attemptIndex >= 1) {
    retry.push("Even simpler: reduce to ONE bold shape filling the canvas.");
  }
  if (attemptIndex >= 2) {
    retry.push("Maximum abstraction: pure geometric forms, no recognizable objects.");
  }
  if (attemptIndex >= 3) {
    retry.push("Extremely minimal: single gradient with subtle texture only.");
  }

  // Build geographic context (simplified)
  const geoContext = [];
  if (plan.geography.allowCountryFlags && countryFlagHints.length) {
    geoContext.push(`Incorporate colors from: ${countryFlagHints[0]}`);
  } else if (plan.geography.allowRegionalMap && regions.length) {
    geoContext.push(`Subtle regional reference: ${regions[0]} geographic silhouette`);
  }

  // Build the prompt - SIMPLIFIED
  const prompt = [
    "Create an abstract, full-bleed artwork for a national security theme.",
    "",
    `PRIMARY VISUAL: ${primaryMotif}`,
    `COLOR PALETTE: ${palette.join(", ")}`,
    "",
    "COMPOSITION RULES:",
    "- ONE dominant visual element only",
    "- Artwork fills entire 1024x1024 canvas edge-to-edge",
    "- NO white space, NO margins, NO padding",
    "- NO button frame, NO badge border, NO rounded rectangle",
    "- NO centered icon floating on empty background",
    "- Use gradient or textured background that extends to all edges",
    ...(geoContext.length ? ["", "GEOGRAPHIC CONTEXT:", ...geoContext.map(g => `- ${g}`)] : []),
    "",
    "STYLE:",
    "- Abstract and artistic, not literal",
    "- Bold and simple - avoid clutter",
    "- Professional, modern aesthetic",
    "- Must be legible at small sizes (80x130 pixels)",
    "",
    CRITICAL_REQUIREMENTS_BLOCK,
    "",
    ...retry
  ].join("\n");

  const preflight = preflightPromptChecks(prompt);
  if (!preflight.ok) throw new Error(`Preflight blocked prompt: ${preflight.reason}`);

  return prompt;
}
