import "dotenv/config";
import sharp from "sharp";
import { getConfig } from "./config.js";
import {
  pbAdminLogin,
  pbListTopicIconsNeedingIcons,
  pbUploadTopicIconFile,
  pbUpdateTopicIconRecord
} from "./pbClient.js";
import { generateImageB64 } from "./openaiImages.js";
import { buildDalleIconPrompt } from "./policyEngine.js";
import {
  ocrDetectAnyText,
  detectPanelDividers,
  downscaleAuditCover80x130
} from "./validators.js";

function safeSlug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function normalizeArrayField(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
}

function parseTopicCombinationFallback(topicCombination) {
  const parts = String(topicCombination || "").split("|").map((s) => s.trim()).filter(Boolean);
  return {
    topics: parts[0] ? parts[0].split(",").map((s) => s.trim()).filter(Boolean) : [],
    regions: parts[1] ? [parts[1]] : [],
    countries: parts[2] ? parts[2].split(",").map((s) => s.trim()).filter(Boolean) : [],
    transnational_org: parts[3] ? parts[3].split(",").map((s) => s.trim()).filter(Boolean) : []
  };
}

async function generateValidatedIcon({
  apiKey,
  model,
  topics,
  countries,
  regions,
  transnational_org,
  maxAttempts,
  downscaleAuditEnabled,
  downscaleThresholds
}) {
  let lastFailure = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const prompt = buildDalleIconPrompt({
      topics,
      countries,
      regions,
      transnational_org,
      attemptIndex: attempt
    });

    const b64 = await generateImageB64({ apiKey, model, prompt, size: "1024x1024" });
    const pngBuffer = Buffer.from(b64, "base64");
    const normalized = await sharp(pngBuffer).png().toBuffer();

    const ocr = await ocrDetectAnyText(normalized);
    if (!ocr.ok) {
      lastFailure = { type: "ocr", ...ocr };
      continue;
    }

    const panels = await detectPanelDividers(normalized);
    if (!panels.ok) {
      lastFailure = { type: "panels", ...panels };
      continue;
    }

    if (downscaleAuditEnabled) {
      const audit = await downscaleAuditCover80x130(normalized, downscaleThresholds);
      if (!audit.ok) {
        lastFailure = { type: "downscale", ...audit };
        continue;
      }
      return {
        ok: true,
        pngBuffer: normalized,
        promptUsed: prompt,
        attempts: attempt + 1,
        downscaleMetrics: audit.metrics
      };
    }

    return { ok: true, pngBuffer: normalized, promptUsed: prompt, attempts: attempt + 1 };
  }

  return {
    ok: false,
    error: "Failed to generate a compliant icon within maxAttempts",
    lastFailure
  };
}

async function main() {
  const cfg = getConfig();

  const { token } = await pbAdminLogin({
    baseUrl: cfg.POCKETBASE_URL,
    email: cfg.POCKETBASE_ADMIN_EMAIL,
    password: cfg.POCKETBASE_ADMIN_PASSWORD
  });

  const records = await pbListTopicIconsNeedingIcons({
    baseUrl: cfg.POCKETBASE_URL,
    token,
    maxItems: cfg.MAX_ITEMS
  });

  if (!records.length) {
    console.log("✅ No topic_icons records need icons.");
    return;
  }

  let saved = 0;

  for (const r of records) {
    const topics = normalizeArrayField(r.topics);
    const countries = normalizeArrayField(r.countries);
    const regions = normalizeArrayField(r.regions);
    const transnational_org = normalizeArrayField(r.transnational_org);

    const fallback =
      (!topics.length && !countries.length && !regions.length && !transnational_org.length)
        ? parseTopicCombinationFallback(r.topic_combination)
        : null;

    const finalTopics = topics.length ? topics : (fallback?.topics || []);
    const finalCountries = countries.length ? countries : (fallback?.countries || []);
    const finalRegions = regions.length ? regions : (fallback?.regions || []);
    const finalOrgs = transnational_org.length ? transnational_org : (fallback?.transnational_org || []);

    if (!finalTopics.length) {
      console.log(`❌ Skipping record ${r.id}: no topics found`);
      continue;
    }

    console.log(`📡 Generating: record=${r.id} topics=${finalTopics.join(", ")}`);

    const result = await generateValidatedIcon({
      apiKey: cfg.OPENAI_API_KEY,
      model: cfg.OPENAI_IMAGE_MODEL,
      topics: finalTopics,
      countries: finalCountries,
      regions: finalRegions,
      transnational_org: finalOrgs,
      maxAttempts: cfg.MAX_ATTEMPTS,
      downscaleAuditEnabled: cfg.ENABLE_DOWNSCALE_AUDIT,
      downscaleThresholds: {
        minForegroundRatio: cfg.DOWNSCALE_MIN_FOREGROUND_RATIO,
        minStddev: cfg.DOWNSCALE_MIN_STDDEV
      }
    });

    if (!result.ok) {
      console.log(`❌ Failed record=${r.id}: ${result.error}`);
      await pbUpdateTopicIconRecord({
        baseUrl: cfg.POCKETBASE_URL,
        token,
        recordId: r.id,
        data: {
          prompt_used: `[FAILED]\n${String(result.error || "unknown")}\nlastFailure=${JSON.stringify(result.lastFailure || null)}`
        }
      });
      continue;
    }

    const filename = `${safeSlug(finalTopics.join("-"))}__${Date.now()}.png`;

    await pbUploadTopicIconFile({
      baseUrl: cfg.POCKETBASE_URL,
      token,
      recordId: r.id,
      filename,
      pngBuffer: result.pngBuffer
    });

    await pbUpdateTopicIconRecord({
      baseUrl: cfg.POCKETBASE_URL,
      token,
      recordId: r.id,
      data: {
        prompt_used: result.promptUsed,
        compliance_notes: JSON.stringify({
          policyVersion: "2.6",
          attempts: result.attempts,
          downscaleAudit: cfg.ENABLE_DOWNSCALE_AUDIT ? (result.downscaleMetrics || null) : null,
          topics: finalTopics,
          countries: finalCountries,
          regions: finalRegions,
          transnational_org: finalOrgs
        })
      }
    });

    saved++;
    console.log(`💾 Saved ${saved} icon(s): record=${r.id}`);
  }

  console.log(`✅ Done. 💾 Saved ${saved} new icons.`);
}

main().catch((err) => {
  console.error("❌ Worker failed:", err?.message || err);
  process.exit(1);
});
