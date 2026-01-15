// =============================================================================
// OPENAIIMAGES.JS
// OpenAI DALL·E 3 API wrapper with network retry logic
// =============================================================================

function isDalleModel(model) {
  const m = String(model || "").toLowerCase();
  return m === "dall-e-3" || m === "dall-e-2";
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an error is a network/transient error that should be retried
 */
function isRetryableError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  
  // Network errors
  if (message.includes("fetch failed")) return true;
  if (message.includes("network")) return true;
  if (message.includes("econnreset")) return true;
  if (message.includes("econnrefused")) return true;
  if (message.includes("etimedout")) return true;
  if (message.includes("timeout")) return true;
  if (message.includes("socket hang up")) return true;
  
  // Server errors (5xx)
  if (message.includes("500")) return true;
  if (message.includes("502")) return true;
  if (message.includes("503")) return true;
  if (message.includes("504")) return true;
  
  // Rate limiting (can retry after delay)
  if (message.includes("429")) return true;
  if (message.includes("rate limit")) return true;
  
  return false;
}

/**
 * Generate an image and return base64 (b64_json).
 * Includes retry logic with exponential backoff for network failures.
 *
 * For `dall-e-3` / `dall-e-2`:
 * - Use `response_format: "b64_json"`
 * - `quality`: "standard" or "hd" (dall-e-3 only)
 * - `style`: "natural" or "vivid" (dall-e-3 only)
 *
 * For GPT image models (e.g., gpt-image-1):
 * - They return base64 by default and support `output_format`
 * 
 * Retry behavior:
 * - Up to 3 retries for network/transient errors
 * - Exponential backoff: 5s, 10s, 20s between retries
 * - Non-retryable errors (4xx client errors) fail immediately
 */
export async function generateImageB64({ apiKey, model, prompt, size = "1024x1024" }) {
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 5000; // 5 seconds
  
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

  let lastError = null;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Log retry attempts
      if (attempt > 0) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`    [API] ⏳ Retry ${attempt}/${MAX_RETRIES} after ${delayMs / 1000}s delay...`);
        await sleep(delayMs);
      }
      
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
        const errorMsg = `OpenAI Images API error: ${res.status} ${res.statusText} :: ${t}`;
        
        // Check if this is a retryable error
        if (isRetryableError(errorMsg) && attempt < MAX_RETRIES) {
          console.log(`    [API] ⚠️ Retryable error: ${res.status} ${res.statusText}`);
          lastError = new Error(errorMsg);
          continue; // Retry
        }
        
        // Non-retryable error, fail immediately
        throw new Error(errorMsg);
      }

      const json = await res.json();
      const b64 = json?.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error("OpenAI Images API: missing b64_json in response (for dall-e models ensure response_format=b64_json)");
      }
      
      // Success - log if this was a retry
      if (attempt > 0) {
        console.log(`    [API] ✅ Succeeded on retry ${attempt}`);
      }
      
      return b64;
      
    } catch (error) {
      lastError = error;
      
      // Check if this is a retryable error
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        console.log(`    [API] ⚠️ Network error: ${error.message}`);
        continue; // Retry
      }
      
      // Non-retryable or max retries exceeded
      throw error;
    }
  }
  
  // Should not reach here, but just in case
  throw lastError || new Error("generateImageB64 failed after all retries");
}
