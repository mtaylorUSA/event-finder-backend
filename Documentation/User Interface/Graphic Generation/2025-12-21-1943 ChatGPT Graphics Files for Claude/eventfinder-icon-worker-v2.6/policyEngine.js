import { TOPIC_STYLE, ORG_MOTIFS, CRITICAL_REQUIREMENTS_BLOCK } from "./rules.js";

const COLLAGE_TRIGGER_WORDS = [
  "triptych", "grid", "collage", "collection", "series", "four panels", "multi-panel", "split screen"
];

export function preflightPromptChecks(prompt) {
  const lower = prompt.toLowerCase();
  const hit = COLLAGE_TRIGGER_WORDS.find((w) => lower.includes(w));
  if (hit) return { ok: false, reason: `prompt_contains_collage_trigger_word:${hit}` };
  return { ok: true };
}

export function deriveIconPlan({ topics = [], countries = [], regions = [], transnational_org = [] }) {
  const hasCountries = Array.isArray(countries) && countries.length > 0;
  const hasRegions = Array.isArray(regions) && regions.length > 0;
  const hasOrgs = Array.isArray(transnational_org) && transnational_org.length > 0;

  const geography = {
    allowCountryFlags: hasCountries,
    allowCountryMaps: hasCountries,
    allowRegionalMap: hasCountries || (!hasCountries && hasRegions),
    allowOrgEmblems: hasOrgs
  };

  return { geography };
}

function buildTopicStyle(topics) {
  const styles = topics.map((t) => TOPIC_STYLE[t]).filter(Boolean);
  const colors = [...new Set(styles.flatMap((s) => s.colors))].slice(0, 4);
  const motifs = [...new Set(styles.flatMap((s) => s.motifs))].slice(0, 6);
  return { colors, motifs };
}

function buildOrgMotifs(orgs) {
  const motifs = [];
  for (const o of orgs || []) {
    const m = ORG_MOTIFS[o];
    if (m) motifs.push(...m);
  }
  return [...new Set(motifs)].slice(0, 4);
}

export function buildDalleIconPrompt({
  topics = [],
  countries = [],
  regions = [],
  transnational_org = [],
  attemptIndex = 0
}) {
  const plan = deriveIconPlan({ topics, countries, regions, transnational_org });
  const { colors, motifs } = buildTopicStyle(topics);
  const orgMotifs = buildOrgMotifs(transnational_org);

  const retry = [];
  if (attemptIndex >= 1) {
    retry.push("Avoid any empty header space; keep texture/gradient continuous across edges.");
    retry.push("Avoid any layout that implies a title bar or caption band.");
  }
  if (attemptIndex >= 2) {
    retry.push("Increase abstraction; simplify shapes; remove any elements that could resemble letters.");
  }
  if (attemptIndex >= 3) {
    retry.push("Maximum simplicity: single central emblem + minimal supporting geometry only.");
  }

  const geoRules = [];
  if (plan.geography.allowCountryFlags || plan.geography.allowCountryMaps) {
    geoRules.push(`Countries provided: ${countries.join(", ")}.`);
    geoRules.push("Geography allowed: country flag elements and/or country map silhouettes (neutral, no text).");
    if (plan.geography.allowRegionalMap && regions.length) {
      geoRules.push(`Optional regional map silhouette: ${regions.join(", ")} (neutral, no text).`);
    }
  } else if (plan.geography.allowRegionalMap && regions.length) {
    geoRules.push(`Regions provided (no countries): ${regions.join(", ")}.`);
    geoRules.push("Geography allowed: regional map silhouette ONLY.");
    geoRules.push("Geography prohibited: NO country flags and NO country maps.");
    geoRules.push("Also avoid flag-like patterns (tricolor banding, canton blocks, star/stripe arrangements).");
  } else {
    geoRules.push("No geography: do not include flags or maps.");
    geoRules.push("Also avoid flag-like patterns (tricolor banding, canton blocks, star/stripe arrangements).");
  }

  if (plan.geography.allowOrgEmblems && transnational_org.length) {
    geoRules.push(`Transnational orgs: ${transnational_org.join(", ")}.`);
    geoRules.push("Organization emblem/flag allowed (must be text-free, neutral, non-official-seal look).");
  }

  const sanitizedMotifs = motifs.filter((m) => !/currency|symbol|dollar|euro|yen|£|\$|€|¥/i.test(m));

  const prompt = [
    "Create a professional isometric 3D-lite icon for a national security event.",
    "",
    `THEME (topics): ${topics.length ? topics.join(", ") : "General"}`,
    `COLOR PALETTE: ${colors.length ? colors.join(", ") : "muted professional neutrals"}`,
    "",
    "VISUAL ELEMENTS (topic motifs):",
    ...sanitizedMotifs.map((m) => `- ${m}`),
    "",
    "GEOGRAPHIC CONTEXT:",
    ...geoRules.map((l) => `- ${l}`),
    ...(orgMotifs.length ? ["", "ORG MOTIFS (text-free):", ...orgMotifs.map((m) => `- ${m}`)] : []),
    "",
    "STYLE:",
    "- Clean isometric perspective with subtle depth and shadows",
    "- Corporate and professional appearance",
    "- Modern, polished look",
    "- Single cohesive icon, not a collage",
    "- Clean white background or subtle gradient",
    "- Output: 1024x1024 PNG",
    "- Must read clearly when small (80x130 UI tile after center crop)",
    "",
    CRITICAL_REQUIREMENTS_BLOCK,
    "",
    ...retry
  ].join("\n");

  const preflight = preflightPromptChecks(prompt);
  if (!preflight.ok) throw new Error(`Preflight blocked prompt: ${preflight.reason}`);

  return prompt;
}
