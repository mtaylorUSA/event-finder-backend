function isDalleModel(model) {
  const m = String(model || "").toLowerCase();
  return m === "dall-e-3" || m === "dall-e-2";
}

/**
 * Generate an image and return base64 (b64_json).
 *
 * For `dall-e-3` / `dall-e-2`:
 * - Use `response_format: "b64_json"`
 * - `quality`: "standard" or "hd" (dall-e-3 only)
 * - `style`: "natural" or "vivid" (dall-e-3 only)
 *
 * For GPT image models (e.g., gpt-image-1):
 * - They return base64 by default and support `output_format`
 */
export async function generateImageB64({ apiKey, model, prompt, size = "1024x1024" }) {
  const payload = isDalleModel(model)
    ? {
        model,
        prompt,
        size,
        response_format: "b64_json",
        quality: "standard",
        style: "natural",
        n: 1
      }
    : {
        model,
        prompt,
        size,
        output_format: "png",
        quality: "auto",
        n: 1
      };

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI Images API error: ${res.status} ${res.statusText} :: ${t}`);
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI Images API: missing b64_json in response (for dall-e models ensure response_format=b64_json)");
  }
  return b64;
}
