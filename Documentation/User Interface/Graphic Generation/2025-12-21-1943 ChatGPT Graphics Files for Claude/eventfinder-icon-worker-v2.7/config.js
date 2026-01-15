export function getConfig() {
  const required = [
    "POCKETBASE_URL",
    "POCKETBASE_ADMIN_EMAIL",
    "POCKETBASE_ADMIN_PASSWORD",
    "OPENAI_API_KEY",
    "OPENAI_IMAGE_MODEL"
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);

  const enableDownscaleAudit = String(process.env.ENABLE_DOWNSCALE_AUDIT || "true").toLowerCase() === "true";

  return {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_IMAGE_MODEL: process.env.OPENAI_IMAGE_MODEL || "dall-e-3",
    MAX_ITEMS: Number(process.env.MAX_ITEMS || 25),
    MAX_ATTEMPTS: Number(process.env.MAX_ATTEMPTS || 6),

    ENABLE_DOWNSCALE_AUDIT: enableDownscaleAudit,
    DOWNSCALE_MIN_FOREGROUND_RATIO: Number(process.env.DOWNSCALE_MIN_FOREGROUND_RATIO || 0.03),
    DOWNSCALE_MIN_STDDEV: Number(process.env.DOWNSCALE_MIN_STDDEV || 18)
  };
}
