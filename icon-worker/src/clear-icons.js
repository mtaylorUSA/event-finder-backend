import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// =============================================================================
// CLEAR-ICONS.JS
// Clears icon_file from topic_icons records so they can be regenerated
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

async function clearIconFile(token, recordId) {
  const res = await fetch(`${POCKETBASE_URL}/api/collections/topic_icons/records/${recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      icon_file: null,
      prompt_used: null,
      compliance_notes: null
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to clear record: ${res.status} ${t}`);
  }

  return await res.json();
}

async function main() {
  console.log("🔑 Logging in to PocketBase...");
  const token = await pbAdminLogin();
  console.log("✅ Logged in successfully.\n");

  console.log("📡 Fetching all topic_icons...");
  const records = await fetchAllTopicIcons(token);
  console.log(`✅ Found ${records.length} records.\n`);

  // Filter to only records that have an icon_file
  const withIcons = records.filter(r => r.icon_file);
  console.log(`🖼️  ${withIcons.length} records have icons to clear.\n`);

  if (withIcons.length === 0) {
    console.log("✅ No icons to clear.");
    return;
  }

  let cleared = 0;
  for (const record of withIcons) {
    console.log(`🗑️  Clearing: ${record.topic_combination || record.id}`);
    await clearIconFile(token, record.id);
    cleared++;
  }

  console.log(`\n✅ Done! Cleared ${cleared} icons.`);
  console.log(`\n👉 Now run: npm run generate`);
}

main().catch((err) => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
