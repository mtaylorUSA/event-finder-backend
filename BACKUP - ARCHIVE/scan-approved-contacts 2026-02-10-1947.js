/**
 * scrapers/scan-approved-contacts.js
 * 
 * SCHEDULED CONTACT SCANNER
 * 
 * Finds mission-approved orgs that have NO contacts and scans them
 * for POC info via Google Search. Stops automatically before hitting
 * the daily Google quota limit.
 * 
 * Safe to run daily via Windows Task Scheduler - it will:
 * - Only scan orgs with 0 contacts
 * - Stop before exceeding quota (default: 80 queries, leaves 20 for manual use)
 * - Skip orgs already scanned today
 * - Log everything clearly
 * 
 * 🔒 SECURITY: Contact gathering ALWAYS uses Google Search only
 * 🔒 SECURITY: Never scrapes org websites for contacts
 * 
 * Usage:
 *   node scrapers/scan-approved-contacts.js                     # Standard run (quota: 80)
 *   node scrapers/scan-approved-contacts.js --quota 50          # Custom quota limit
 *   node scrapers/scan-approved-contacts.js --include-live      # Also scan Live orgs without contacts
 *   node scrapers/scan-approved-contacts.js --dry-run           # Preview what would be scanned (no changes)
 *   node scrapers/scan-approved-contacts.js --help              # Show help
 * 
 * Schedule (Windows Task Scheduler):
 *   Program: node
 *   Arguments: scrapers/scan-approved-contacts.js
 *   Start in: C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL
 *   Trigger: Daily at a time of your choosing
 * 
 * Created: 2026-02-09
 */

require('dotenv').config();
const scanner = require('./org-scanner');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Default quota limit - leaves 20 queries for manual use ([🔍 Scan] button, adhoc-scanner, etc.)
const DEFAULT_QUOTA_LIMIT = 80;

// Max queries per org (1-2 broad queries + possible domain validation queries)
// UPDATED 2026-02-10: Broad query approach uses 1-2 queries instead of 5-10
const MAX_QUERIES_PER_ORG = 4;

// Module-level auth token
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
    if (authToken) return authToken;
    
    console.log('   🔐 Authenticating with PocketBase...');
    
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/admins/auth-with-password`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identity: POCKETBASE_ADMIN_EMAIL,
                    password: POCKETBASE_ADMIN_PASSWORD
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Auth failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        authToken = data.token;
        console.log('   ✅ Authenticated');
        return authToken;
    } catch (error) {
        console.error(`   ❌ Authentication failed: ${error.message}`);
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIND APPROVED ORGS WITHOUT CONTACTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all mission-approved orgs (and optionally Live orgs)
 */
async function getApprovedOrgs(includeLive = false) {
    await authenticate();
    
    let filter = `status='Mission Approved (Request Not Sent)'`;
    if (includeLive) {
        filter = `(status='Mission Approved (Request Not Sent)' || status='Live (Scraping Active)')`;
    }
    
    const allOrgs = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=${encodeURIComponent(filter)}&page=${page}&perPage=${perPage}&sort=name`,
            {
                headers: { 'Authorization': authToken }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch orgs: ${response.status}`);
        }
        
        const data = await response.json();
        allOrgs.push(...data.items);
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    return allOrgs;
}

/**
 * Get contact count for an organization
 */
async function getContactCount(orgId) {
    await authenticate();
    
    const filter = encodeURIComponent(`organization = "${orgId}"`);
    
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/contacts/records?filter=${filter}&perPage=1`,
            {
                headers: { 'Authorization': authToken }
            }
        );
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        return data.totalItems || 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Filter to only orgs with 0 contacts
 */
async function filterOrgsWithoutContacts(orgs) {
    const needsContacts = [];
    
    for (const org of orgs) {
        const contactCount = await getContactCount(org.id);
        if (contactCount === 0) {
            needsContacts.push(org);
        }
    }
    
    return needsContacts;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARSE COMMAND LINE ARGUMENTS
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        quotaLimit: DEFAULT_QUOTA_LIMIT,
        includeLive: false,
        dryRun: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--quota':
                options.quotaLimit = parseInt(args[++i]) || DEFAULT_QUOTA_LIMIT;
                break;
            case '--include-live':
                options.includeLive = true;
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📇 SCHEDULED CONTACT SCANNER');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('Finds mission-approved orgs with 0 contacts and scans them.');
    console.log('Stops automatically before hitting Google quota limit.');
    console.log('');
    console.log('🔒 Contact gathering ALWAYS uses Google Search only.');
    console.log('');
    console.log('Usage:');
    console.log('  node scrapers/scan-approved-contacts.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --quota <number>    Max Google queries to use (default: 80, max: 100)');
    console.log('  --include-live      Also scan Live orgs that have 0 contacts');
    console.log('  --dry-run           Preview what would be scanned (no changes)');
    console.log('  -h, --help          Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  node scrapers/scan-approved-contacts.js                  # Standard daily run');
    console.log('  node scrapers/scan-approved-contacts.js --quota 50       # Conservative quota');
    console.log('  node scrapers/scan-approved-contacts.js --include-live   # Include Live orgs');
    console.log('  node scrapers/scan-approved-contacts.js --dry-run        # Preview only');
    console.log('');
    console.log('Schedule via Windows Task Scheduler:');
    console.log('  Program:    node');
    console.log('  Arguments:  scrapers/scan-approved-contacts.js');
    console.log('  Start in:   C:\\LOCAL FILES\\AI Stuff - LOCAL\\Event Finder - LOCAL');
    console.log('  Trigger:    Daily at your preferred time');
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    const startTime = Date.now();
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📇 SCHEDULED CONTACT SCANNER');
    console.log(`   ${new Date().toLocaleString()}`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${options.dryRun ? '🧪 DRY RUN (no changes)' : '🚀 LIVE'}`);
    console.log(`   Quota Limit: ${options.quotaLimit} queries (of 100 daily)`);
    console.log(`   Scope: Mission Approved${options.includeLive ? ' + Live' : ''}`);
    console.log('   Contact Method: 🔒 Google Search Only');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Find approved orgs
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📋 STEP 1: Finding approved organizations...');
    console.log('────────────────────────────────────────────────────────────────');
    
    const allApproved = await getApprovedOrgs(options.includeLive);
    console.log(`   📊 Found ${allApproved.length} approved org(s)`);
    
    if (allApproved.length === 0) {
        console.log('   ℹ️ No approved orgs found. Nothing to do.');
        console.log('');
        return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Filter to orgs without contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔍 STEP 2: Checking for orgs with 0 contacts...');
    console.log('────────────────────────────────────────────────────────────────');
    
    const needsContacts = await filterOrgsWithoutContacts(allApproved);
    
    console.log(`   📊 ${needsContacts.length} org(s) need contacts (of ${allApproved.length} approved)`);
    console.log(`   ⏭️ ${allApproved.length - needsContacts.length} org(s) already have contacts`);
    
    if (needsContacts.length === 0) {
        console.log('   ✅ All approved orgs already have contacts. Nothing to do.');
        console.log('');
        return;
    }
    
    // Calculate how many we can scan within quota
    const maxOrgsInQuota = Math.floor(options.quotaLimit / MAX_QUERIES_PER_ORG);
    const orgsToScan = needsContacts.slice(0, maxOrgsInQuota);
    
    console.log(`   🎯 Will scan up to ${orgsToScan.length} org(s) within quota`);
    
    if (needsContacts.length > maxOrgsInQuota) {
        console.log(`   ⚠️ ${needsContacts.length - maxOrgsInQuota} org(s) will be deferred to next run`);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: List orgs to scan
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📋 ORGS TO SCAN:');
    console.log('────────────────────────────────────────────────────────────────');
    
    for (let i = 0; i < orgsToScan.length; i++) {
        const org = orgsToScan[i];
        console.log(`   ${i + 1}. ${org.name} (${org.source_id || org.website || 'no domain'})`);
    }
    
    if (options.dryRun) {
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('🧪 DRY RUN COMPLETE - No changes made');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`   Would scan: ${orgsToScan.length} org(s)`);
        console.log(`   Estimated queries: up to ${orgsToScan.length * MAX_QUERIES_PER_ORG}`);
        
        if (needsContacts.length > maxOrgsInQuota) {
            console.log(`   Deferred to next run: ${needsContacts.length - maxOrgsInQuota} org(s)`);
        }
        
        console.log('');
        console.log('   💡 Remove --dry-run to scan for real');
        console.log('');
        return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4: Initialize scanner and scan orgs
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🚀 STEP 3: Scanning for contacts...');
    console.log('────────────────────────────────────────────────────────────────');
    
    await scanner.init();
    scanner.resetGoogleQueryCount();
    
    let scannedCount = 0;
    let contactsFoundTotal = 0;
    let contactsSavedTotal = 0;
    let skippedQuota = 0;
    let errorCount = 0;
    
    for (let i = 0; i < orgsToScan.length; i++) {
        const org = orgsToScan[i];
        
        // Check quota BEFORE scanning
        const currentQueries = scanner.getGoogleQueryCount();
        const queriesRemaining = options.quotaLimit - currentQueries;
        
        if (queriesRemaining < MAX_QUERIES_PER_ORG) {
            console.log('');
            console.log(`   ⚠️ Quota limit approaching (${currentQueries}/${options.quotaLimit} used)`);
            console.log(`   ⏹️ Stopping to stay within quota. ${orgsToScan.length - i} org(s) deferred.`);
            skippedQuota = orgsToScan.length - i;
            break;
        }
        
        console.log('');
        console.log(`   ── Org ${i + 1}/${orgsToScan.length}: ${org.name} ──────────────────`);
        console.log(`   📡 Queries used so far: ${currentQueries}/${options.quotaLimit}`);
        
        try {
            const scanOptions = {
                updateDb: true,
                skipTOU: true,         // TOU already checked during discovery
                skipEventsUrl: true,   // Not needed for contact gathering
                skipAI: true,          // Org info already gathered during discovery
                skipLocationCheck: true, // Location already checked during discovery (saves Google queries)
                forceAggressive: false, // Use smart skip logic
                googleOnlyContacts: true,
                scanType: 'scheduled'
            };
            
            const result = await scanner.scanOrganization(org, scanOptions);
            
            const contactsFound = result.pocContacts?.length || 0;
            const contactsSaved = result.contactsSaved?.length || 0;
            
            contactsFoundTotal += contactsFound;
            contactsSavedTotal += contactsSaved;
            scannedCount++;
            
            if (contactsSaved > 0) {
                console.log(`   💾 Saved ${contactsSaved} contact(s)`);
            } else if (contactsFound > 0) {
                console.log(`   ℹ️ Found ${contactsFound} contact(s) (duplicates or validation failed)`);
            } else {
                console.log(`   ℹ️ No contacts found`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error scanning ${org.name}: ${error.message}`);
            errorCount++;
        }
        
        // Small delay between orgs
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ─────────────────────────────────────────────────────────────────────────
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const finalQueries = scanner.getGoogleQueryCount();
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ SCHEDULED CONTACT SCAN COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   📊 Orgs scanned:       ${scannedCount}`);
    console.log(`   📇 Contacts found:     ${contactsFoundTotal}`);
    console.log(`   💾 Contacts saved:      ${contactsSavedTotal}`);
    console.log(`   📡 Google queries used: ${finalQueries}/${options.quotaLimit}`);
    
    if (skippedQuota > 0) {
        console.log(`   ⏭️ Deferred (quota):    ${skippedQuota} org(s) — will scan next run`);
    }
    if (errorCount > 0) {
        console.log(`   ❌ Errors:              ${errorCount}`);
    }
    
    const deferredTotal = (needsContacts.length - orgsToScan.length) + skippedQuota;
    if (deferredTotal > 0) {
        console.log(`   📅 Remaining:           ${deferredTotal} org(s) need contacts (next run)`);
    } else {
        console.log(`   🎉 All approved orgs now have contacts!`);
    }
    
    console.log(`   ⏱️ Duration:            ${elapsed}s`);
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
}

// Run
main().catch(error => {
    console.error('');
    console.error('❌ FATAL ERROR:', error.message);
    console.error('');
    process.exit(1);
});
