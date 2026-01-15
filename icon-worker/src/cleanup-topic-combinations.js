import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// =============================================================================
// CLEANUP-TOPIC-COMBINATIONS.JS
// Removes trailing pipe characters from topic_combination field
// Loads .env from PROJECT ROOT (not icon-worker folder)
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (two levels up from icon-worker/src/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing environment variables. Check your root .env file.");
  process.exit(1);
}

// -----------------------------------------------------------------------------
// PocketBase API Helpers
// -----------------------------------------------------------------------------

async function pbAdminLogin() {
  const res = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PocketBase login failed: ${res.status} ${t}`);
  }

  const json = await res.json();
  return json.token;
}

async function fetchAllTopicIcons(token) {
  const allItems = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const url = `${POCKETBASE_URL}/api/collections/topic_icons/records?page=${page}&perPage=${perPage}`;
    const res = await fetch(url, { headers: { Authorization: token } });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Failed to fetch topic_icons: ${res.status} ${t}`);
    }

    const json = await res.json();
    allItems.push(...(json.items || []));

    if (json.items.length < perPage) break;
    page++;
  }

  return allItems;
}

async function updateTopicIconRecord(token, recordId, data) {
  const res = await fetch(`${POCKETBASE_URL}/api/collections/topic_icons/records/${recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to update record: ${res.status} ${t}`);
  }

  return await res.json();
}

// -----------------------------------------------------------------------------
// Cleanup Function
// -----------------------------------------------------------------------------

function cleanTopicCombination(value) {
  if (!value) return value;
  
  // Remove trailing pipe characters
  // "Economic Security|||" → "Economic Security"
  // "AI & Emerging Technology|Global/Multilateral||" → "AI & Emerging Technology|Global/Multilateral"
  return value.replace(/\|+$/, "");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("🔑 Logging in to PocketBase...");
  const token = await pbAdminLogin();
  console.log("✅ Logged in successfully.\n");

  console.log("📡 Fetching all topic_icons...");
  const records = await fetchAllTopicIcons(token);
  console.log(`✅ Found ${records.length} records.\n`);

  let updated = 0;
  let skipped = 0;

  for (const record of records) {
    const original = record.topic_combination || "";
    const cleaned = cleanTopicCombination(original);

    if (original === cleaned) {
      skipped++;
      continue;
    }

    console.log(`🧹 Cleaning: "${original}" → "${cleaned}"`);
    
    await updateTopicIconRecord(token, record.id, {
      topic_combination: cleaned
    });

    updated++;
  }

  console.log(`\n✅ Done!`);
  console.log(`   🧹 Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped} (already clean)`);
}

main().catch((err) => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
