// =============================================================================
// COUNT-APPROVED-FUTURE-EVENTS.JS
// Counts approved events with start_date >= today and their unique topic combos
// NO CHANGES MADE - just counting
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

async function fetchApprovedFutureEvents(token) {
  const allItems = [];
  let page = 1;
  const perPage = 200;
  const today = new Date().toISOString().split('T')[0];

  while (true) {
    const filter = encodeURIComponent(`event_status = "approved" && start_date >= "${today}"`);
    const url = `${cfg.POCKETBASE_URL}/api/collections/events/records?page=${page}&perPage=${perPage}&filter=${filter}`;
    const res = await fetch(url, { headers: { Authorization: token } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    allItems.push(...(json.items || []));
    if (json.items.length < perPage) break;
    page++;
  }
  return allItems;
}

function normalizeArrayField(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String).sort();
  return String(v).split(",").map((s) => s.trim()).filter(Boolean).sort();
}

function buildCombinationKey(topics, regions, countries, transnationalOrg) {
  const t = topics.sort().join(",");
  const r = regions.sort().join(",");
  const c = countries.sort().join(",");
  const o = transnationalOrg.sort().join(",");
  return `${t}|${r}|${c}|${o}`;
}

async function main() {
  console.log("════════════════════════════════════════════════════════════════");
  console.log("📊 COUNTING APPROVED FUTURE EVENTS");
  console.log("════════════════════════════════════════════════════════════════\n");

  const token = await pbAdminLogin();
  console.log("✅ Logged in.\n");

  const today = new Date().toISOString().split('T')[0];
  console.log(`📅 Today's date: ${today}\n`);

  console.log("📡 Fetching approved events where start_date >= today...\n");
  const events = await fetchApprovedFutureEvents(token);

  console.log(`✅ Found ${events.length} approved future events.\n`);

  // Count unique topic combinations
  const uniqueCombos = new Set();
  for (const event of events) {
    const topics = normalizeArrayField(event.topics);
    if (!topics.length) continue;
    
    const regions = normalizeArrayField(event.regions);
    const countries = normalizeArrayField(event.countries);
    const transnationalOrg = normalizeArrayField(event.transnational_orgs);
    
    const key = buildCombinationKey(topics, regions, countries, transnationalOrg);
    uniqueCombos.add(key);
  }

  console.log("════════════════════════════════════════════════════════════════");
  console.log("📋 SUMMARY");
  console.log("════════════════════════════════════════════════════════════════");
  console.log(`   📅 Approved future events: ${events.length}`);
  console.log(`   🎨 Unique topic combinations: ${uniqueCombos.size}`);
  console.log(`   💰 Estimated cost: ~$${(uniqueCombos.size * 0.04).toFixed(2)} (at $0.04/icon)`);
  console.log("════════════════════════════════════════════════════════════════\n");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
