// =============================================================================
// DELETE-ALL-TOPIC-ICONS.JS
// Deletes ALL topic_icons records so we can start fresh
// Run create-topic-icon-records.js after this to recreate only approved future events
// =============================================================================

import { getConfig } from "./config.js";

const cfg = getConfig();

async function pbAdminLogin() {
  const res = await fetch(`${cfg.POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: cfg.POCKETBASE_ADMIN_EMAIL, password: cfg.POCKETBASE_ADMIN_PASSWORD })
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const json = await res.json();
  return json.token;
}

async function fetchAllTopicIcons(token) {
  const allItems = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const url = `${cfg.POCKETBASE_URL}/api/collections/topic_icons/records?page=${page}&perPage=${perPage}`;
    const res = await fetch(url, { headers: { Authorization: token } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    allItems.push(...(json.items || []));
    if (json.items.length < perPage) break;
    page++;
  }
  return allItems;
}

async function deleteTopicIcon(token, recordId) {
  const res = await fetch(`${cfg.POCKETBASE_URL}/api/collections/topic_icons/records/${recordId}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Delete failed: ${res.status} ${t}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("════════════════════════════════════════════════════════════════");
  console.log("🗑️  DELETE ALL TOPIC_ICONS RECORDS");
  if (dryRun) console.log("   (DRY RUN - no changes will be made)");
  console.log("════════════════════════════════════════════════════════════════\n");

  const token = await pbAdminLogin();
  console.log("✅ Logged in.\n");

  console.log("📡 Fetching all topic_icons...\n");
  const records = await fetchAllTopicIcons(token);

  console.log(`Found ${records.length} records.\n`);

  if (records.length === 0) {
    console.log("✅ No records to delete.");
    return;
  }

  if (dryRun) {
    console.log(`Would delete ${records.length} records.`);
    console.log("\nRun without --dry-run to actually delete.");
    return;
  }

  let deleted = 0;
  for (const record of records) {
    try {
      await deleteTopicIcon(token, record.id);
      deleted++;
      console.log(`🗑️  Deleted ${deleted}/${records.length}: ${record.id}`);
    } catch (err) {
      console.log(`❌ Failed to delete ${record.id}: ${err.message}`);
    }
  }

  console.log("\n════════════════════════════════════════════════════════════════");
  console.log(`✅ Deleted ${deleted} records.`);
  console.log("════════════════════════════════════════════════════════════════");
  console.log("\n📌 NEXT STEPS:");
  console.log("   1. Run: node src/create-topic-icon-records.js");
  console.log("   2. Run: node src/generate-topic-icons.js");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
