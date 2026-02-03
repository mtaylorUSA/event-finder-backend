// =============================================================================
// GENERATE-TOPIC-ICONS.JS
// Main worker script for icon generation using DALL·E 3
// Version: 2.0
// IMPROVEMENTS: Passes recordId for uniqueness, configurable style/quality
// NOTE: .env is loaded by config.js from PROJECT ROOT (not icon-worker folder)
// =============================================================================

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
  recordId,           // NEW: Pass record ID for extra uniqueness
  maxAttempts,
  downscaleAuditEnabled,
  downscaleThresholds,
  imageStyle,         // NEW: Configurable style (vivid/natural)
  imageQuality        // NEW: Configurable quality (standard/hd)
}) {
  let lastFailure = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`    [GEN] 🔄 Attempt ${attempt + 1}/${maxAttempts}`);
    
    // Build prompt with recordId for extra uniqueness
    const prompt = buildDalleIconPrompt({
      topics,
      countries,
      regions,
      transnational_org,
      attemptIndex: attempt,
      recordId: recordId  // NEW: Adds per-record variation
    });

    // Log a snippet of the prompt for debugging
    const promptSnippet = prompt.split('\n').slice(0, 8).join(' | ').slice(0, 150);
    console.log(`    [GEN] 📝 Prompt: ${promptSnippet}...`);

    const b64 = await generateImageB64({ 
      apiKey, 
      model, 
      prompt, 
      size: "1024x1024",
      style: imageStyle,      // NEW: Pass through style
      quality: imageQuality   // NEW: Pass through quality
    });
    
    const pngBuffer = Buffer.from(b64, "base64");
    const normalized = await sharp(pngBuffer).png().toBuffer();

    // Validation: OCR text check
    const ocr = await ocrDetectAnyText(normalized);
    if (!ocr.ok) {
      console.log(`    [GEN] ❌ OCR failed: ${ocr.reason}`);
      lastFailure = { type: "ocr", ...ocr };
      continue;
    }

    // Validation: Panel divider check
    const panels = await detectPanelDividers(normalized);
    if (!panels.ok) {
      console.log(`    [GEN] ❌ Panel detection failed: ${panels.reason}`);
      lastFailure = { type: "panels", ...panels };
      continue;
    }

    // Validation: Downscale audit (optional)
    if (downscaleAuditEnabled) {
      const audit = await downscaleAuditCover80x130(normalized, downscaleThresholds);
      if (!audit.ok) {
        console.log(`    [GEN] ❌ Downscale audit failed: ${audit.reason}`);
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

    console.log(`    [GEN] ✅ All validations passed on attempt ${attempt + 1}`);
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

  console.log("🔑 Logging in to PocketBase...");
  const { token } = await pbAdminLogin({
    baseUrl: cfg.POCKETBASE_URL,
    email: cfg.POCKETBASE_ADMIN_EMAIL,
    password: cfg.POCKETBASE_ADMIN_PASSWORD
  });
  console.log("✅ Logged in successfully.\n");

  console.log("📡 Fetching topic_icons records needing icons...");
  const records = await pbListTopicIconsNeedingIcons({
    baseUrl: cfg.POCKETBASE_URL,
    token,
    maxItems: cfg.MAX_ITEMS
  });

  if (!records.length) {
    console.log("✅ No topic_icons records need icons.");
    return;
  }

  console.log(`📋 Found ${records.length} records to process.\n`);

  // Get style and quality from environment (with improved defaults)
  const imageStyle = process.env.DALLE_STYLE || "vivid";      // NEW: Default vivid
  const imageQuality = process.env.DALLE_QUALITY || "standard";
  
  console.log(`🎨 Image settings: style=${imageStyle}, quality=${imageQuality}\n`);

  let saved = 0;
  let failed = 0;

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
      console.log(`⚠️ Skipping record ${r.id}: no topics found`);
      continue;
    }

    console.log(`────────────────────────────────────────`);
    console.log(`📡 Processing: record=${r.id}`);
    console.log(`   Topics: ${finalTopics.join(", ")}`);
    if (finalRegions.length) console.log(`   Regions: ${finalRegions.join(", ")}`);
    if (finalCountries.length) console.log(`   Countries: ${finalCountries.join(", ")}`);
    if (finalOrgs.length) console.log(`   Orgs: ${finalOrgs.join(", ")}`);

    const result = await generateValidatedIcon({
      apiKey: cfg.OPENAI_API_KEY,
      model: cfg.OPENAI_IMAGE_MODEL,
      topics: finalTopics,
      countries: finalCountries,
      regions: finalRegions,
      transnational_org: finalOrgs,
      recordId: r.id,                    // NEW: Pass record ID
      maxAttempts: cfg.MAX_ATTEMPTS,
      downscaleAuditEnabled: cfg.ENABLE_DOWNSCALE_AUDIT,
      downscaleThresholds: {
        minForegroundRatio: cfg.DOWNSCALE_MIN_FOREGROUND_RATIO,
        minStddev: cfg.DOWNSCALE_MIN_STDDEV
      },
      imageStyle: imageStyle,            // NEW: Pass style
      imageQuality: imageQuality         // NEW: Pass quality
    });

    if (!result.ok) {
      console.log(`❌ Failed record=${r.id}: ${result.error}`);
      failed++;
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
          policyVersion: "4.0",          // UPDATED version
          attempts: result.attempts,
          style: imageStyle,             // NEW: Track style used
          quality: imageQuality,         // NEW: Track quality used
          downscaleAudit: cfg.ENABLE_DOWNSCALE_AUDIT ? (result.downscaleMetrics || null) : null,
          topics: finalTopics,
          countries: finalCountries,
          regions: finalRegions,
          transnational_org: finalOrgs
        })
      }
    });

    saved++;
    console.log(`💾 Saved icon ${saved}: record=${r.id} (${result.attempts} attempt(s))`);
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Done!`);
  console.log(`   💾 Saved: ${saved} new icons`);
  if (failed > 0) console.log(`   ❌ Failed: ${failed} icons`);
  console.log(`════════════════════════════════════════`);
}

main().catch((err) => {
  console.error("❌ Worker failed:", err?.message || err);
  process.exit(1);
});
