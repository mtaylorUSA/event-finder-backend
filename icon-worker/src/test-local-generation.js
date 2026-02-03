// =============================================================================
// TEST-LOCAL-GENERATION.JS
// Generate test icons LOCALLY - does NOT upload to PocketBase
// Saves images to ./test-output/ folder for visual review
// =============================================================================

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import the NEW policyEngine (make sure you've copied the new files first)
import { buildDalleIconPrompt } from "./policyEngine.js";
import { generateImageB64 } from "./openaiImages.js";
import { getConfig } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// PocketBase - READ ONLY (just to get existing topic combinations)
// =============================================================================

async function pbAdminLogin(baseUrl, email, password) {
  const res = await fetch(`${baseUrl}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password: password })
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const json = await res.json();
  return json.token;
}

async function fetchTopicIconRecords(baseUrl, token, limit = 5) {
  // Fetch records that HAVE icons already (so we can compare old vs new)
  const filter = encodeURIComponent('icon_file != ""');
  const url = `${baseUrl}/api/collections/topic_icons/records?perPage=${limit}&filter=${filter}&sort=-created`;
  const res = await fetch(url, { headers: { Authorization: token } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const json = await res.json();
  return json.items || [];
}

// =============================================================================
// Utility
// =============================================================================

function normalizeArrayField(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
}

function parseTopicCombinationFallback(topicCombination) {
  const parts = String(topicCombination || "").split("|").map((s) => s.trim());
  return {
    topics: parts[0] ? parts[0].split(",").map((s) => s.trim()).filter(Boolean) : [],
    regions: parts[1] ? parts[1].split(",").map((s) => s.trim()).filter(Boolean) : [],
    countries: parts[2] ? parts[2].split(",").map((s) => s.trim()).filter(Boolean) : [],
    transnational_org: parts[3] ? parts[3].split(",").map((s) => s.trim()).filter(Boolean) : []
  };
}

function safeFilename(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1]) : 3;
  
  console.log("════════════════════════════════════════════════════════════════");
  console.log("🧪 LOCAL TEST GENERATION");
  console.log("════════════════════════════════════════════════════════════════");
  console.log(`📊 Will generate ${limit} test icons`);
  console.log(`💰 Estimated cost: ~$${(limit * 0.04).toFixed(2)} (DALL-E 3 standard)`);
  console.log(`💾 Output: ./test-output/ folder (NOT uploaded to PocketBase)`);
  console.log("════════════════════════════════════════════════════════════════\n");
  
  const cfg = getConfig();
  
  // Create output directory
  const outputDir = path.join(__dirname, "..", "test-output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`📁 Output directory: ${outputDir}\n`);
  
  // Get style settings
  const imageStyle = process.env.DALLE_STYLE || "vivid";
  const imageQuality = process.env.DALLE_QUALITY || "standard";
  console.log(`🎨 DALL-E Settings: style=${imageStyle}, quality=${imageQuality}\n`);
  
  // Login to PocketBase (read-only)
  console.log("🔑 Logging in to PocketBase (read-only)...");
  const token = await pbAdminLogin(
    cfg.POCKETBASE_URL,
    cfg.POCKETBASE_ADMIN_EMAIL,
    cfg.POCKETBASE_ADMIN_PASSWORD
  );
  console.log("✅ Logged in.\n");
  
  // Fetch existing topic_icon records
  console.log(`📡 Fetching ${limit} existing topic_icon records...\n`);
  const records = await fetchTopicIconRecords(cfg.POCKETBASE_URL, token, limit);
  
  if (!records.length) {
    console.log("⚠️ No topic_icons with existing icons found.");
    console.log("   Run create-topic-icon-records.js first, or use --limit with records that have icons.");
    return;
  }
  
  console.log(`✅ Found ${records.length} records to test.\n`);
  
  // Generate test icons
  let generated = 0;
  const results = [];
  
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    
    // Parse fields
    let topics = normalizeArrayField(r.topics);
    let regions = normalizeArrayField(r.regions);
    let countries = normalizeArrayField(r.countries);
    let transnational_org = normalizeArrayField(r.transnational_org);
    
    if (!topics.length && !regions.length && !countries.length && !transnational_org.length) {
      const fallback = parseTopicCombinationFallback(r.topic_combination);
      topics = fallback.topics;
      regions = fallback.regions;
      countries = fallback.countries;
      transnational_org = fallback.transnational_org;
    }
    
    if (!topics.length) {
      console.log(`⚠️ Skipping record ${r.id}: no topics\n`);
      continue;
    }
    
    console.log("────────────────────────────────────────────────────────────────");
    console.log(`📋 [${i + 1}/${records.length}] Record: ${r.id}`);
    console.log("────────────────────────────────────────────────────────────────");
    console.log(`   Topics:    ${topics.join(", ")}`);
    if (regions.length) console.log(`   Regions:   ${regions.join(", ")}`);
    if (countries.length) console.log(`   Countries: ${countries.join(", ")}`);
    if (transnational_org.length) console.log(`   Orgs:      ${transnational_org.join(", ")}`);
    
    // Build NEW prompt
    const prompt = buildDalleIconPrompt({
      topics,
      countries,
      regions,
      transnational_org,
      attemptIndex: 0,
      recordId: r.id
    });
    
    // Show key parts of prompt
    const primaryVisual = prompt.match(/PRIMARY VISUAL: (.+)/)?.[1] || "unknown";
    const composition = prompt.match(/COMPOSITION: (.+)/)?.[1]?.slice(0, 60) || "unknown";
    const style = prompt.match(/ARTISTIC STYLE: (.+)/)?.[1] || "unknown";
    
    console.log(`\n   🎨 Primary Visual: ${primaryVisual}`);
    console.log(`   📐 Composition: ${composition}...`);
    console.log(`   ✨ Style: ${style}`);
    
    // Call DALL-E
    console.log(`\n   🚀 Calling DALL-E 3...`);
    
    try {
      const b64 = await generateImageB64({
        apiKey: cfg.OPENAI_API_KEY,
        model: cfg.OPENAI_IMAGE_MODEL || "dall-e-3",
        prompt,
        size: "1024x1024",
        style: imageStyle,
        quality: imageQuality
      });
      
      // Save locally
      const pngBuffer = Buffer.from(b64, "base64");
      const normalized = await sharp(pngBuffer).png().toBuffer();
      
      const filename = `${safeFilename(topics.join("-"))}_${r.id.slice(0, 8)}_NEW.png`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, normalized);
      
      console.log(`   ✅ Saved: ${filename}`);
      
      // Also save the prompt for reference
      const promptFilename = `${safeFilename(topics.join("-"))}_${r.id.slice(0, 8)}_PROMPT.txt`;
      const promptFilepath = path.join(outputDir, promptFilename);
      fs.writeFileSync(promptFilepath, prompt);
      
      generated++;
      
      results.push({
        recordId: r.id,
        topics: topics.join(", "),
        newImage: filename,
        oldIconFile: r.icon_file || "(none)"
      });
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
    
    console.log("");
  }
  
  // Summary
  console.log("════════════════════════════════════════════════════════════════");
  console.log("✅ TEST COMPLETE");
  console.log("════════════════════════════════════════════════════════════════");
  console.log(`   💾 Generated: ${generated} test icons`);
  console.log(`   📁 Location: ${outputDir}`);
  console.log(`   💰 Cost: ~$${(generated * 0.04).toFixed(2)}`);
  console.log("");
  console.log("📋 RESULTS:");
  console.log("────────────────────────────────────────────────────────────────");
  
  for (const r of results) {
    console.log(`   ${r.topics}`);
    console.log(`      NEW: ${r.newImage}`);
    console.log(`      OLD: ${r.oldIconFile}`);
    console.log("");
  }
  
  console.log("════════════════════════════════════════════════════════════════");
  console.log("📌 NEXT STEPS:");
  console.log("════════════════════════════════════════════════════════════════");
  console.log("   1. Open the test-output folder and review the NEW images");
  console.log("   2. Compare with existing icons in your UI");
  console.log("   3. If satisfied, deploy the new files to production");
  console.log("   4. Run clear-icons.js to regenerate ALL icons with new prompts");
  console.log("");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
