import sharp from "sharp";
import { createWorker } from "tesseract.js";

// =============================================================================
// CONFIGURATION
// =============================================================================

// OCR Settings
const MIN_OCR_CONFIDENCE = 85;
const MIN_TEXT_LENGTH = 5;

// Panel Detection Settings
// Updated 2026-01-09: DISABLED - DALL·E 3 follows "no collage" prompts well,
// and this validator was causing too many false positives on dark-themed icons
const PANEL_DETECTION_ENABLED = false;

// Debug logging (set to false for production)
const DEBUG_OCR = true;
const DEBUG_PANELS = true;
const DEBUG_DOWNSCALE = true;

// =============================================================================
// OCR Detection
// =============================================================================

async function ocrOnce(worker, buffer) {
  try {
    const { data } = await worker.recognize(buffer);
    const text = (data?.text || "").trim();
    const confidence = Number.isFinite(data?.confidence) ? data.confidence : 0;
    
    const alphanumericOnly = text.replace(/[^A-Za-z0-9]/g, "");
    const hasText = alphanumericOnly.length >= MIN_TEXT_LENGTH;
    
    return { hasText, text, alphanumericOnly, confidence, error: null };
  } catch (err) {
    if (DEBUG_OCR) console.log(`    [OCR] recognize error: ${err.message}`);
    return { hasText: false, text: "", alphanumericOnly: "", confidence: 0, error: err.message };
  }
}

async function makeOcrVariants(imageBuffer) {
  try {
    const base = sharp(imageBuffer);
    const metadata = await base.metadata();
    
    if (DEBUG_OCR) console.log(`    [OCR] Image size: ${metadata.width}x${metadata.height}`);
    
    if (!metadata.width || !metadata.height || metadata.width < 100 || metadata.height < 100) {
      if (DEBUG_OCR) console.log("    [OCR] Image too small for variant generation, using original");
      return [imageBuffer];
    }
    
    const v1 = await base.clone().grayscale().normalize().threshold(140).toBuffer();
    const v2 = await base.clone().grayscale().normalize().threshold(180).toBuffer();
    const v3 = await base.clone().grayscale().normalize().sharpen().toBuffer();
    
    if (DEBUG_OCR) console.log("    [OCR] Created 3 variants");
    return [v1, v2, v3];
  } catch (err) {
    if (DEBUG_OCR) console.log(`    [OCR] Variant creation failed: ${err.message}`);
    return [imageBuffer];
  }
}

export async function ocrDetectAnyText(imageBuffer) {
  if (DEBUG_OCR) console.log("    [OCR] Starting text detection...");
  
  let worker = null;
  
  try {
    if (DEBUG_OCR) console.log("    [OCR] Creating Tesseract worker...");
    worker = await createWorker("eng");
    if (DEBUG_OCR) console.log("    [OCR] Worker created successfully");
    
    const variants = await makeOcrVariants(imageBuffer);
    
    for (let i = 0; i < variants.length; i++) {
      if (DEBUG_OCR) console.log(`    [OCR] Checking variant ${i + 1}/${variants.length}...`);
      
      const r = await ocrOnce(worker, variants[i]);
      
      if (r.error) {
        if (DEBUG_OCR) console.log(`    [OCR] Variant ${i + 1} skipped: ${r.error}`);
        continue;
      }
      
      if (DEBUG_OCR) {
        console.log(`    [OCR] Variant ${i + 1}: confidence=${r.confidence.toFixed(1)}, alphanumeric="${r.alphanumericOnly.slice(0, 20)}"`);
      }
      
      if (r.hasText && r.confidence >= MIN_OCR_CONFIDENCE) {
        if (DEBUG_OCR) console.log(`    [OCR] ❌ TEXT DETECTED: "${r.alphanumericOnly}" (conf=${r.confidence.toFixed(1)})`);
        try { await worker.terminate(); } catch (e) { /* ignore */ }
        return {
          ok: false,
          reason: "text_detected",
          confidence: r.confidence,
          snippet: (r.text || "").slice(0, 120),
          alphanumericDetected: r.alphanumericOnly
        };
      }
    }
    
    if (DEBUG_OCR) console.log("    [OCR] ✅ No text detected");
    try { await worker.terminate(); } catch (e) { /* ignore */ }
    return { ok: true };
    
  } catch (err) {
    console.log(`    [OCR] ⚠️ Error during OCR (passing image): ${err.message}`);
    if (worker) {
      try { await worker.terminate(); } catch (e) { /* ignore */ }
    }
    return { ok: true, warning: "ocr_error", errorMessage: err.message };
  }
}

// =============================================================================
// Panel Divider Detection (DISABLED)
// =============================================================================

export async function detectPanelDividers(imageBuffer) {
  // Panel detection is disabled - DALL·E 3 follows "no collage" prompts well,
  // and this validator was causing too many false positives on dark-themed icons
  if (!PANEL_DETECTION_ENABLED) {
    if (DEBUG_PANELS) console.log("    [PANELS] ⏭️ Skipped (disabled)");
    return { ok: true, skipped: true };
  }
  
  // Original implementation kept for reference (unreachable when disabled)
  if (DEBUG_PANELS) console.log("    [PANELS] Starting panel detection...");
  
  let img;
  let meta;
  
  try {
    img = sharp(imageBuffer);
    meta = await img.metadata();
  } catch (err) {
    if (DEBUG_PANELS) console.log(`    [PANELS] ⚠️ Could not read metadata: ${err.message}`);
    return { ok: true };
  }
  
  const width = meta.width || 0;
  const height = meta.height || 0;
  
  if (DEBUG_PANELS) console.log(`    [PANELS] Image size: ${width}x${height}`);
  
  if (!width || !height) {
    if (DEBUG_PANELS) console.log("    [PANELS] ✅ Skipping (no dimensions)");
    return { ok: true };
  }

  try {
    const bw = await img.clone().grayscale().normalize().threshold(200).raw().toBuffer();
    const channels = 1;

    const xs = [Math.floor(width * 0.33), Math.floor(width * 0.5), Math.floor(width * 0.66)];
    const ys = [Math.floor(height * 0.33), Math.floor(height * 0.5), Math.floor(height * 0.66)];

    function columnInkRatio(x) {
      let ink = 0;
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * channels;
        if (bw[idx] < 40) ink++;
      }
      return ink / height;
    }

    function rowInkRatio(y) {
      let ink = 0;
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        if (bw[idx] < 40) ink++;
      }
      return ink / width;
    }

    const vScores = xs.map((x) => columnInkRatio(x));
    const hScores = ys.map((y) => rowInkRatio(y));

    if (DEBUG_PANELS) {
      console.log(`    [PANELS] Vertical scores: ${vScores.map(s => s.toFixed(2)).join(", ")}`);
      console.log(`    [PANELS] Horizontal scores: ${hScores.map(s => s.toFixed(2)).join(", ")}`);
    }

    const threshold = 0.95;
    const vHit = vScores.some((r) => r > threshold);
    const hHit = hScores.some((r) => r > threshold);

    if (vHit || hHit) {
      if (DEBUG_PANELS) console.log(`    [PANELS] ❌ Panel divider detected (vHit=${vHit}, hHit=${hHit})`);
      return { ok: false, reason: "panel_divider_detected", vScores, hScores };
    }
    
    if (DEBUG_PANELS) console.log("    [PANELS] ✅ No panels detected");
    return { ok: true };
  } catch (err) {
    if (DEBUG_PANELS) console.log(`    [PANELS] ⚠️ Error (passing image): ${err.message}`);
    return { ok: true, warning: "panel_detection_error" };
  }
}

// =============================================================================
// Downscale Audit (UI Legibility Check)
// =============================================================================

export async function downscaleAuditCover80x130(imageBuffer, { minForegroundRatio = 0.03, minStddev = 18 } = {}) {
  if (DEBUG_DOWNSCALE) console.log("    [DOWNSCALE] Starting legibility audit...");
  
  const targetW = 80;
  const targetH = 130;
  const targetAspect = targetW / targetH;

  let img;
  let meta;
  
  try {
    img = sharp(imageBuffer);
    meta = await img.metadata();
  } catch (err) {
    if (DEBUG_DOWNSCALE) console.log(`    [DOWNSCALE] ⚠️ Could not read metadata: ${err.message}`);
    return { ok: true, metrics: { skipped: true } };
  }
  
  const w = meta.width || 0;
  const h = meta.height || 0;
  
  if (DEBUG_DOWNSCALE) console.log(`    [DOWNSCALE] Image size: ${w}x${h}, target: ${targetW}x${targetH}`);
  
  if (!w || !h) {
    if (DEBUG_DOWNSCALE) console.log("    [DOWNSCALE] ❌ Missing metadata");
    return { ok: false, reason: "downscale_audit_missing_metadata" };
  }

  try {
    let cropW = w;
    let cropH = h;
    const currentAspect = w / h;

    if (currentAspect > targetAspect) {
      cropH = h;
      cropW = Math.floor(h * targetAspect);
    } else {
      cropW = w;
      cropH = Math.floor(w / targetAspect);
    }

    cropW = Math.max(cropW, 3);
    cropH = Math.max(cropH, 3);

    const left = Math.max(0, Math.floor((w - cropW) / 2));
    const top = Math.max(0, Math.floor((h - cropH) / 2));

    const extractWidth = Math.min(cropW, w - left);
    const extractHeight = Math.min(cropH, h - top);

    if (extractWidth < 3 || extractHeight < 3) {
      if (DEBUG_DOWNSCALE) console.log("    [DOWNSCALE] ⚠️ Image too small, skipping");
      return { ok: true, metrics: { skipped: true } };
    }

    const tiny = await img
      .clone()
      .extract({ left, top, width: extractWidth, height: extractHeight })
      .resize(targetW, targetH, { fit: "fill" })
      .grayscale()
      .raw()
      .toBuffer();

    const n = tiny.length;

    let sum = 0;
    for (let i = 0; i < n; i++) sum += tiny[i];
    const mean = sum / n;

    let varSum = 0;
    for (let i = 0; i < n; i++) {
      const d = tiny[i] - mean;
      varSum += d * d;
    }
    const variance = varSum / n;
    const stddev = Math.sqrt(variance);

    const diffThreshold = 18;
    let fg = 0;
    for (let i = 0; i < n; i++) {
      if (Math.abs(tiny[i] - mean) >= diffThreshold) fg++;
    }
    const foregroundRatio = fg / n;

    if (DEBUG_DOWNSCALE) {
      console.log(`    [DOWNSCALE] foregroundRatio=${foregroundRatio.toFixed(4)} (min: ${minForegroundRatio})`);
      console.log(`    [DOWNSCALE] stddev=${stddev.toFixed(2)} (min: ${minStddev})`);
    }

    const ok = foregroundRatio >= minForegroundRatio && stddev >= minStddev;

    if (!ok) {
      const failReason = [];
      if (foregroundRatio < minForegroundRatio) failReason.push(`foreground too low`);
      if (stddev < minStddev) failReason.push(`contrast too low`);
      if (DEBUG_DOWNSCALE) console.log(`    [DOWNSCALE] ❌ Failed: ${failReason.join(", ")}`);
      return {
        ok: false,
        reason: "downscale_audit_failed",
        metrics: { foregroundRatio, stddev, minForegroundRatio, minStddev }
      };
    }

    if (DEBUG_DOWNSCALE) console.log("    [DOWNSCALE] ✅ Passed legibility check");
    return { ok: true, metrics: { foregroundRatio, stddev } };
  } catch (err) {
    if (DEBUG_DOWNSCALE) console.log(`    [DOWNSCALE] ⚠️ Error (passing image): ${err.message}`);
    return { ok: true, metrics: { skipped: true, error: err.message } };
  }
}
