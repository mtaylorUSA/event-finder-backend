import sharp from "sharp";
import { createWorker } from "tesseract.js";

async function ocrOnce(worker, buffer) {
  const { data } = await worker.recognize(buffer);
  const text = (data?.text || "").trim();
  const confidence = Number.isFinite(data?.confidence) ? data.confidence : 0;
  const hasText = /[A-Za-z0-9]/.test(text);
  return { hasText, text, confidence };
}

async function makeOcrVariants(imageBuffer) {
  const base = sharp(imageBuffer);
  const v1 = await base.clone().grayscale().normalize().threshold(140).toBuffer();
  const v2 = await base.clone().grayscale().normalize().threshold(180).toBuffer();
  const v3 = await base.clone().grayscale().normalize().sharpen().toBuffer();
  return [v1, v2, v3];
}

export async function ocrDetectAnyText(imageBuffer) {
  const worker = await createWorker("eng");
  try {
    const variants = await makeOcrVariants(imageBuffer);
    for (const v of variants) {
      const r = await ocrOnce(worker, v);
      if (r.hasText) {
        return {
          ok: false,
          reason: "text_detected",
          confidence: r.confidence,
          snippet: (r.text || "").slice(0, 120)
        };
      }
    }
    return { ok: true };
  } finally {
    await worker.terminate();
  }
}

export async function detectPanelDividers(imageBuffer) {
  const img = sharp(imageBuffer);
  const meta = await img.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;
  if (!width || !height) return { ok: true };

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

  const vHit = vScores.some((r) => r > 0.85);
  const hHit = hScores.some((r) => r > 0.85);

  if (vHit || hHit) return { ok: false, reason: "panel_divider_detected", vScores, hScores };
  return { ok: true };
}

export async function downscaleAuditCover80x130(imageBuffer, { minForegroundRatio = 0.03, minStddev = 18 } = {}) {
  const targetW = 80;
  const targetH = 130;
  const targetAspect = targetW / targetH;

  const img = sharp(imageBuffer);
  const meta = await img.metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) return { ok: false, reason: "downscale_audit_missing_metadata" };

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

  const left = Math.max(0, Math.floor((w - cropW) / 2));
  const top = Math.max(0, Math.floor((h - cropH) / 2));

  const tiny = await img
    .clone()
    .extract({ left, top, width: cropW, height: cropH })
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

  const ok = foregroundRatio >= minForegroundRatio && stddev >= minStddev;

  if (!ok) {
    return {
      ok: false,
      reason: "downscale_audit_failed",
      metrics: { foregroundRatio, stddev, minForegroundRatio, minStddev }
    };
  }

  return { ok: true, metrics: { foregroundRatio, stddev } };
}
