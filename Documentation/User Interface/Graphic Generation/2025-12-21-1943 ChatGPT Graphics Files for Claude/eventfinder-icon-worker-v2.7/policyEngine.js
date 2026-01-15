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
    colors: uniq(styles.flatMap((s) => s.colors)).slice(0, 6),
    motifs: uniq(styles.flatMap((s) => s.motifs)).slice(0, 8)
  };
}

function buildRegionStyle(regions) {
  const styles = (regions || []).map((r) => REGION_STYLE?.[r]).filter(Boolean);
  return {
    colors: uniq(styles.flatMap((s) => s.colors)).slice(0, 6),
    motifs: uniq(styles.flatMap((s) => s.motifs)).slice(0, 8)
  };
}

function buildOrgMotifs(orgs) {
  const motifs = [];
  for (const o of orgs || []) {
    const m = ORG_MOTIFS?.[o];
    if (Array.isArray(m)) motifs.push(...m);
  }
  return uniq(motifs).slice(0, 8);
}

function buildCountryFlagHints(countries) {
  const lines = [];
  for (const c of countries || []) {
    const hint = COUNTRY_FLAG_HINTS?.[c];
    if (hint) lines.push(`${c}: ${hint}`);
    else lines.push(`${c}: simplified national-flag pattern using national colors and basic geometry (no text)`);
  }
  return lines;
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

  const palette = plan.geography.hasCountries
    ? topicStyle.colors
    : uniq([...topicStyle.colors, ...regionStyle.colors]).slice(0, 8);

  const retry = [];
  if (attemptIndex >= 1) {
    retry.push("Avoid any empty header space; keep texture/gradient continuous across edges.");
    retry.push("Avoid any layout that implies a title bar, caption band, or badge label.");
  }
  if (attemptIndex >= 2) {
    retry.push("Increase abstraction; simplify shapes; remove any elements that could resemble letters or numbers.");
  }
  if (attemptIndex >= 3) {
    retry.push("Maximum simplicity: single central emblem + minimal supporting geometry only.");
  }

  const geoRules = [];
  if (plan.geography.allowCountryFlags || plan.geography.allowCountryMaps) {
    geoRules.push(`Countries provided: ${countries.join(", ")}.`);
    geoRules.push("Include country flag element(s) and/or country map silhouette(s) (neutral, text-free).");
    geoRules.push("Flag elements must be implied by color + simple geometry only (no crests, no coats of arms, no text).");
    if (countryFlagHints.length) {
      geoRules.push("Use these flag-pattern hints (text-free; colors/geometry only):");
      for (const l of countryFlagHints) geoRules.push(`- ${l}`);
    }
    if (plan.geography.allowRegionalMap && regions.length) {
      geoRules.push(`Optional regional map silhouette: ${regions.join(", ")} (neutral, no text).`);
    }
  } else if (plan.geography.allowRegionalMap && regions.length) {
    geoRules.push(`Regions provided (no countries): ${regions.join(", ")}.`);
    geoRules.push("Geography allowed: regional map silhouette ONLY (no flags, no country maps).");
    geoRules.push("Also avoid flag-like patterns (tricolor banding, canton blocks, star/stripe arrangements).");
    const rm = sanitizeMotifs(regionStyle.motifs);
    if (rm.length) {
      geoRules.push("Region motifs (text-free):");
      for (const m of rm) geoRules.push(`- ${m}`);
    }
  } else {
    geoRules.push("No geography: do not include flags or maps.");
    geoRules.push("Also avoid flag-like patterns (tricolor banding, canton blocks, star/stripe arrangements).");
  }

  const topicMotifs = sanitizeMotifs(topicStyle.motifs);

  const styleLines = Array.isArray(STYLE_REQUIREMENTS) && STYLE_REQUIREMENTS.length
    ? STYLE_REQUIREMENTS
    : [
        "Clean isometric perspective with subtle depth and shadows",
        "Corporate and professional appearance",
        "Modern, polished look",
        "Single cohesive icon, not a collage",
        "Clean white background or subtle gradient",
        "Output: 1024x1024 PNG",
        "Must read clearly when small (80x130 UI tile after center crop)"
      ];

  const prompt = [
    "Create a professional isometric 3D-lite icon for a national security event.",
    "",
    `THEME (topics): ${topics.length ? topics.join(", ") : "General"}`,
    `COLOR PALETTE: ${palette.length ? palette.join(", ") : "muted professional neutrals"}`,
    "",
    "VISUAL ELEMENTS (topic motifs):",
    ...topicMotifs.map((m) => `- ${m}`),
    "",
    "GEOGRAPHIC CONTEXT:",
    ...geoRules.map((l) => `- ${l}`),
    ...(orgMotifs.length ? ["", "TRANSNATIONAL ORG MOTIFS (text-free):", ...orgMotifs.map((m) => `- ${m}`)] : []),
    "",
    "STYLE:",
    ...styleLines.map((l) => `- ${l}`),
    "",
    CRITICAL_REQUIREMENTS_BLOCK,
    "",
    ...retry
  ].join("\n");

  const preflight = preflightPromptChecks(prompt);
  if (!preflight.ok) throw new Error(`Preflight blocked prompt: ${preflight.reason}`);

  return prompt;
}
