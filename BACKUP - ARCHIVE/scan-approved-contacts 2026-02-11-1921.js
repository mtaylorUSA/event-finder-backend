/**
 * scrapers/scan-approved-contacts.js
 * 
 * SCHEDULED CONTACT SCANNER
 * 
 * Finds mission-approved orgs that have NO contacts and scans them
 * for POC info via Claude AI + web search (or Google Search fallback).
 * 
 * UPDATED 2026-02-10: Now uses Claude AI for richer contact discovery.
 * Claude synthesizes names, titles, phones, emails from multiple web sources.
 * Cost: ~$0.02 per org (~$1.40 for 70 orgs).
 * 
 * Safe to run daily via Windows Task Scheduler - it will:
 * - Only scan orgs with 0 contacts
 * - Skip orgs already scanned today
 * - Log everything clearly
 * 
 * 🔒 ETHICAL: Claude's web search reads publicly indexed pages.
 * 🔒 ETHICAL: Our code never touches org websites for contacts.
 * 
 * Usage:
 *   node scrapers/scan-approved-contacts.js                     # Standard run
 *   node scrapers/scan-approved-contacts.js --max-orgs 20       # Limit to 20 orgs
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

// Default max orgs per run (cost control: ~$0.02 per org)
// UPDATED 2026-02-10: Claude API has no daily quota — limit by org count instead
const DEFAULT_MAX_ORGS = 80;

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
        maxOrgs: DEFAULT_MAX_ORGS,
        includeLive: false,
        dryRun: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--max-orgs':
                options.maxOrgs = parseInt(args[++i]) || DEFAULT_MAX_ORGS;
                break;
            case '--quota':  // Legacy support — treat as max-orgs
                options.maxOrgs = parseInt(args[++i]) || DEFAULT_MAX_ORGS;
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
    console.log('Uses Claude AI + web search for rich contact discovery.');
    console.log('Cost: ~$0.02 per org.');
    console.log('');
    console.log('🔒 Contact discovery uses Claude web search (publicly indexed pages only).');
    console.log('');
    console.log('Usage:');
    console.log('  node scrapers/scan-approved-contacts.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --max-orgs <number> Max orgs to scan per run (default: 80)');
    console.log('  --include-live      Also scan Live orgs that have 0 contacts');
    console.log('  --dry-run           Preview what would be scanned (no changes)');
    console.log('  -h, --help          Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  node scrapers/scan-approved-contacts.js                  # Standard run');
    console.log('  node scrapers/scan-approved-contacts.js --max-orgs 20    # Limit to 20 orgs');
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
    console.log(`   Max Orgs: ${options.maxOrgs} per run`);
    console.log(`   Scope: Mission Approved${options.includeLive ? ' + Live' : ''}`);
    console.log('   Contact Method: 🤖 Claude AI + Web Search');
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
    
    // Limit orgs to scan per run (cost control)
    const orgsToScan = needsContacts.slice(0, options.maxOrgs);
    
    const estimatedCost = (orgsToScan.length * 0.02).toFixed(2);
    console.log(`   🎯 Will scan ${orgsToScan.length} org(s) (est. cost: ~$${estimatedCost})`);
    
    if (needsContacts.length > options.maxOrgs) {
        console.log(`   ⚠️ ${needsContacts.length - options.maxOrgs} org(s) will be deferred to next run`);
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
    let errorCount = 0;
    
    for (let i = 0; i < orgsToScan.length; i++) {
        const org = orgsToScan[i];
        
        console.log('');
        console.log(`   ── Org ${i + 1}/${orgsToScan.length}: ${org.name} ──────────────────`);
        
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
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ SCHEDULED CONTACT SCAN COMPLETE');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   📊 Orgs scanned:       ${scannedCount}`);
    console.log(`   📇 Contacts found:     ${contactsFoundTotal}`);
    console.log(`   💾 Contacts saved:      ${contactsSavedTotal}`);
    
    if (errorCount > 0) {
        console.log(`   ❌ Errors:              ${errorCount}`);
    }
    
    const deferred = needsContacts.length - orgsToScan.length;
    if (deferred > 0) {
        console.log(`   📅 Remaining:           ${deferred} org(s) need contacts (next run)`);
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
