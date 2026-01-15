export async function generateImageB64({ apiKey, model, prompt, size = "1024x1024" }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      output_format: "png",
      quality: "auto",
      n: 1
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI Images API error: ${res.status} ${res.statusText} :: ${t}`);
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI Images API: missing b64_json in response");
  return b64;
}
