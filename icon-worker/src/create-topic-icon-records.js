import "dotenv/config";

// =============================================================================
// CREATE-TOPIC-ICON-RECORDS.JS
// Scans events collection and creates topic_icons records for unique combinations
// =============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing environment variables. Check your .env file.");
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

async function fetchAllEvents(token) {
  const allItems = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const url = `${POCKETBASE_URL}/api/collections/events/records?page=${page}&perPage=${perPage}`;
    const res = await fetch(url, { headers: { Authorization: token } });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Failed to fetch events: ${res.status} ${t}`);
    }

    const json = await res.json();
    allItems.push(...(json.items || []));

    if (json.items.length < perPage) break;
    page++;
  }

  return allItems;
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

async function createTopicIconRecord(token, data) {
  const res = await fetch(`${POCKETBASE_URL}/api/collections/topic_icons/records`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to create topic_icon: ${res.status} ${t}`);
  }

  return await res.json();
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

function normalizeArrayField(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).sort();
  return String(v).split(",").map((s) => s.trim()).filter(Boolean).sort();
}

function buildCombinationKey(topics, regions, countries, transnationalOrg) {
  // Format: "Topic1,Topic2|Region1,Region2|Country1,Country2|Org1,Org2"
  const t = topics.sort().join(",");
  const r = regions.sort().join(",");
  const c = countries.sort().join(",");
  const o = transnationalOrg.sort().join(",");
  
  // Build key with all parts, even if empty (for consistency)
  return `${t}|${r}|${c}|${o}`;
}

function buildLegacyCombinationKey(topics, regions) {
  // Legacy format: "Topic1,Topic2|Region1" (for backwards compatibility)
  const t = topics.sort().join(",");
  const r = regions.sort().join(",");
  return `${t}|${r}`;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("🔑 Logging in to PocketBase...");
  const token = await pbAdminLogin();
  console.log("✅ Logged in successfully.\n");

  // Fetch all events
  console.log("📡 Fetching all events...");
  const events = await fetchAllEvents(token);
  console.log(`✅ Found ${events.length} events.\n`);

  // Fetch existing topic_icons
  console.log("📡 Fetching existing topic_icons...");
  const existingIcons = await fetchAllTopicIcons(token);
  console.log(`✅ Found ${existingIcons.length} existing topic_icons.\n`);

  // Build set of existing combination keys (check both old and new format)
  const existingKeys = new Set();
  for (const icon of existingIcons) {
    // Add the topic_combination as-is
    if (icon.topic_combination) {
      existingKeys.add(icon.topic_combination);
    }
    // Also build key from individual fields if they exist
    const topics = normalizeArrayField(icon.topics);
    const regions = normalizeArrayField(icon.regions);
    const countries = normalizeArrayField(icon.countries);
    const orgs = normalizeArrayField(icon.transnational_org);
    if (topics.length || regions.length || countries.length || orgs.length) {
      existingKeys.add(buildCombinationKey(topics, regions, countries, orgs));
    }
  }

  // Extract unique combinations from events
  const uniqueCombos = new Map(); // key -> { topics, regions, countries, transnational_org }

  for (const event of events) {
    const topics = normalizeArrayField(event.topics);
    const regions = normalizeArrayField(event.regions);
    const countries = normalizeArrayField(event.countries);
    // FIX: events collection uses "transnational_orgs" (with 's')
    // topic_icons collection uses "transnational_org" (without 's')
    const transnationalOrg = normalizeArrayField(event.transnational_orgs);

    // Skip events with no topics
    if (!topics.length) continue;

    const key = buildCombinationKey(topics, regions, countries, transnationalOrg);
    const legacyKey = buildLegacyCombinationKey(topics, regions);

    // Skip if already exists (check both formats)
    if (existingKeys.has(key) || existingKeys.has(legacyKey)) continue;

    if (!uniqueCombos.has(key)) {
      uniqueCombos.set(key, { topics, regions, countries, transnationalOrg });
    }
  }

  console.log(`🆕 Found ${uniqueCombos.size} new unique combinations to create.\n`);

  if (uniqueCombos.size === 0) {
    console.log("✅ No new topic_icons records needed.");
    return;
  }

  // Create new topic_icons records
  let created = 0;
  for (const [key, combo] of uniqueCombos) {
    try {
      console.log(`📝 Creating: ${key}`);
      
      await createTopicIconRecord(token, {
        topic_combination: key,
        topics: combo.topics,
        regions: combo.regions,
        countries: combo.countries,
        transnational_org: combo.transnationalOrg
        // icon_file intentionally left empty - generate-topic-icons.js will fill it
      });

      created++;
      console.log(`   ✅ Created (${created}/${uniqueCombos.size})`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Created ${created} new topic_icons records.`);
  console.log(`\n👉 Now run: npm run generate`);
}

main().catch((err) => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
