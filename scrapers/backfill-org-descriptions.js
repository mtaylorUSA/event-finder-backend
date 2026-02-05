/**
 * backfill-org-descriptions.js
 *
 * One-time backfill script to replace org descriptions with Google-sourced descriptions.
 * 
 * 🔒 ETHICAL: Uses Google Search snippets ONLY - never reads org website content.
 * Follows the same pattern as checkOrgLocation() and getOrgInfoViaGoogle() in org-scanner.js.
 *
 * What it does:
 *   - Fetches all organizations from PocketBase
 *   - For each org, searches Google for org info (snippets only)
 *   - Sends snippets to GPT to generate a quality description
 *   - Overwrites the description field with the Google-sourced description
 *   - Also fills org_type if empty
 *
 * Usage:
 *   node scrapers/backfill-org-descriptions.js                  (DRY RUN - preview only)
 *   node scrapers/backfill-org-descriptions.js --execute         (actually update DB)
 *   node scrapers/backfill-org-descriptions.js --org "CNAS"      (single org, dry run)
 *   node scrapers/backfill-org-descriptions.js --org "CNAS" --execute  (single org, update)
 *
 * Created: 2026-02-05
 */

require('dotenv').config();

const scanner = require('./org-scanner');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

async function main() {
  const fetch = (await import('node-fetch')).default;

  // Parse command line args
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  const orgNameArg = args.includes('--org') ? args[args.indexOf('--org') + 1] : null;

  console.log('════════════════════════════════════════════════════════════════');
  console.log('📝 Backfill Organization Descriptions via Google Search');
  console.log('   🔒 ETHICAL: Uses Google Search snippets ONLY');
  console.log(`   Mode: ${executeMode ? '🔴 EXECUTE (will update database)' : '🟡 DRY RUN (preview only)'}`);
  if (orgNameArg) console.log(`   Target: "${orgNameArg}"`);
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  // ───────────────────────────────────────────────────────────────────────
  // Step 1: Initialize scanner and authenticate
  // ───────────────────────────────────────────────────────────────────────

  console.log('🔧 Initializing...');
  await scanner.init();

  // Authenticate with PocketBase
  console.log('🔐 Authenticating with PocketBase...');
  const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: POCKETBASE_ADMIN_EMAIL,
      password: POCKETBASE_ADMIN_PASSWORD
    })
  });

  if (!authResponse.ok) {
    console.error('❌ Authentication failed');
    process.exit(1);
  }

  const authData = await authResponse.json();
  const token = authData.token;
  console.log('✅ Authenticated\n');

  // ───────────────────────────────────────────────────────────────────────
  // Step 2: Fetch organizations
  // ───────────────────────────────────────────────────────────────────────

  console.log('📥 Fetching organizations...');

  let allOrgs = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/organizations/records?perPage=200&page=${page}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
      console.error(`❌ Failed to fetch page ${page}`);
      break;
    }

    const data = await response.json();
    allOrgs = allOrgs.concat(data.items || []);
    totalPages = data.totalPages || 1;
    page++;
  }

  console.log(`   ✅ Found ${allOrgs.length} total organizations\n`);

  // Filter to target org if specified
  let orgsToProcess = allOrgs;
  if (orgNameArg) {
    orgsToProcess = allOrgs.filter(org =>
      org.name && org.name.toLowerCase().includes(orgNameArg.toLowerCase())
    );
    console.log(`   🎯 Filtered to ${orgsToProcess.length} matching "${orgNameArg}"\n`);
  }

  // Only process orgs in active workflow statuses (skip rejected AND nominated)
  const ACTIVE_STATUSES = [
    'Mission Approved (Request Not Sent)',
    'Permission Requested (Pending Org Response)',
    'Permission Granted (Not Live)',
    'Live (Scraping Active)'
  ];

  const activeOrgs = orgsToProcess.filter(org =>
    ACTIVE_STATUSES.includes(org.status)
  );
  console.log(`   📋 Processing ${activeOrgs.length} active organizations (Mission Approved through Live)\n`);

  // ───────────────────────────────────────────────────────────────────────
  // Step 3: Process each organization
  // ───────────────────────────────────────────────────────────────────────

  const stats = {
    processed: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    googleQueries: 0
  };

  for (let i = 0; i < activeOrgs.length; i++) {
    const org = activeOrgs[i];
    const progress = `[${i + 1}/${activeOrgs.length}]`;

    console.log('────────────────────────────────────────────────────────────');
    console.log(`${progress} 🔍 ${org.name || org.source_id || 'Unknown'}`);
    console.log(`   Current description: "${(org.description || '').substring(0, 60)}${(org.description || '').length > 60 ? '...' : ''}"` || '   Current description: (empty)');

    try {
      // Call getOrgInfoViaGoogle from org-scanner
      scanner.resetGoogleQueryCount();
      const info = await scanner.getOrgInfoViaGoogle(
        org.name,
        org.website,
        org.triggering_event_title || null
      );

      stats.googleQueries += scanner.getGoogleQueryCount();

      if (!info.description) {
        console.log(`   ⚠️ No description found via Google - skipping`);
        stats.skipped++;
        continue;
      }

      console.log(`   ✅ New description: "${info.description.substring(0, 80)}..."`);
      if (info.orgType) console.log(`   ✅ Org type: ${info.orgType}`);

      if (executeMode) {
        // Build update payload
        const updates = {};
        updates.description = info.description;
        if (info.orgType && !org.org_type) {
          updates.org_type = info.orgType;
        }

        const updateResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/organizations/records/${org.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          }
        );

        if (updateResponse.ok) {
          console.log(`   💾 Saved to database`);
          stats.updated++;
        } else {
          console.log(`   ❌ Database update failed: ${updateResponse.status}`);
          stats.errors++;
        }
      } else {
        console.log(`   🟡 DRY RUN - would update description`);
        stats.updated++;
      }

      stats.processed++;

      // Rate limiting - be respectful of Google API quotas
      await scanner.sleep(2000);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      stats.errors++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // Step 4: Summary
  // ───────────────────────────────────────────────────────────────────────

  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('📊 BACKFILL SUMMARY');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`   Mode: ${executeMode ? '🔴 EXECUTE' : '🟡 DRY RUN'}`);
  console.log(`   📋 Processed: ${stats.processed}`);
  console.log(`   💾 ${executeMode ? 'Updated' : 'Would update'}: ${stats.updated}`);
  console.log(`   ⏭️  Skipped (no Google results): ${stats.skipped}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  console.log(`   🔍 Google queries used: ${stats.googleQueries}`);
  console.log('');

  if (!executeMode && stats.updated > 0) {
    console.log('📋 NEXT STEP:');
    console.log('   Run again with --execute to apply changes:');
    console.log('   node scrapers/backfill-org-descriptions.js --execute');
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
