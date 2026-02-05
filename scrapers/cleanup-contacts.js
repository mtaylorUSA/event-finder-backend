/**
 * cleanup-contacts.js
 * 
 * PURPOSE: Clean up contact data by fixing typos and removing vendor/junk contacts.
 * 
 * WHAT IT DOES:
 *   1. Fixes known email typos (e.g., spie.orgor → spie.org)
 *   2. Deletes contacts with blacklisted vendor/junk domains
 *   3. Deletes contacts with placeholder/test emails
 * 
 * USAGE:
 *   node scrapers/cleanup-contacts.js              # DRY RUN - shows what would happen
 *   node scrapers/cleanup-contacts.js --execute    # Actually performs the cleanup
 * 
 * SECURITY: 
 *   - DRY RUN by default (no changes without --execute flag)
 *   - Does NOT scrape any websites
 *   - Only modifies contacts collection
 */

require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ════════════════════════════════════════════════════════════════════════════════
// EMAIL TYPO FIXES
// Format: { wrong: 'correct' }
// ════════════════════════════════════════════════════════════════════════════════

const EMAIL_TYPO_FIXES = {
    'customerservice@spie.orgor': 'customerservice@spie.org'
};

// ════════════════════════════════════════════════════════════════════════════════
// BLACKLISTED DOMAINS (Event vendors, hotels, junk)
// Contacts with emails from these domains will be DELETED
// ════════════════════════════════════════════════════════════════════════════════

const BLACKLISTED_DOMAINS = [
    // Event vendors / third-party support
    'eventpowersupport.com',
    'eventbrite.com',
    'telestrategies.com',
    'saemediagroup.com',
    
    // Hotels (not actual org contacts)
    'sheratonsandkey.com',
    'marriott.com',
    'hilton.com',
    'hyatt.com',
    
    // Junk/placeholder domains
    'email.com',
    'example.com',
    'test.com'
];

// ════════════════════════════════════════════════════════════════════════════════
// SPECIFIC JUNK EMAILS (exact matches to delete)
// ════════════════════════════════════════════════════════════════════════════════

const JUNK_EMAILS = [
    'name@email.com'
];

// ════════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Extract domain from email address
 */
function extractDomainFromEmail(email) {
    if (!email || typeof email !== 'string') return null;
    const parts = email.toLowerCase().trim().split('@');
    if (parts.length !== 2) return null;
    return parts[1];
}

/**
 * Check if email domain is blacklisted
 */
function isBlacklistedDomain(email) {
    const domain = extractDomainFromEmail(email);
    if (!domain) return false;
    return BLACKLISTED_DOMAINS.includes(domain.toLowerCase());
}

/**
 * Check if email is a known junk email
 */
function isJunkEmail(email) {
    if (!email) return false;
    return JUNK_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Check if email has a known typo that can be fixed
 */
function getTypoFix(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    return EMAIL_TYPO_FIXES[normalized] || null;
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN CLEANUP LOGIC
// ════════════════════════════════════════════════════════════════════════════════

async function cleanupContacts(executeChanges = false) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🧹 CONTACT CLEANUP');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`⚙️  Mode: ${executeChanges ? '🔧 EXECUTE (will modify database)' : '👁️  DRY RUN (preview only)'}`);
    console.log('');
    
    // Validate environment variables
    if (!POCKETBASE_URL || !POCKETBASE_EMAIL || !POCKETBASE_PASSWORD) {
        console.error('❌ Missing environment variables. Check your .env file:');
        console.error('   - POCKETBASE_URL');
        console.error('   - POCKETBASE_ADMIN_EMAIL');
        console.error('   - POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }
    
    // Connect to PocketBase
    const pb = new PocketBase(POCKETBASE_URL);
    
    try {
        console.log('📡 Connecting to PocketBase...');
        await pb.admins.authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD);
        console.log('✅ Connected to PocketBase');
        console.log('');
        
        // Fetch all contacts with expanded organization data
        console.log('📡 Fetching contacts...');
        const contacts = await pb.collection('contacts').getFullList({
            expand: 'organization',
            sort: 'created'
        });
        console.log(`📊 Found ${contacts.length} total contacts`);
        console.log('');
        
        // Track changes
        const results = {
            typosToFix: [],
            blacklistedToDelete: [],
            junkToDelete: [],
            unchanged: 0
        };
        
        // Analyze each contact
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🔍 ANALYZING CONTACTS...');
        console.log('────────────────────────────────────────────────────────────────');
        
        for (const contact of contacts) {
            const email = contact.email;
            const org = contact.expand?.organization;
            const orgName = org?.name || '(no org)';
            
            // Check for typo fix
            const typoFix = getTypoFix(email);
            if (typoFix) {
                results.typosToFix.push({
                    id: contact.id,
                    name: contact.name,
                    org: orgName,
                    oldEmail: email,
                    newEmail: typoFix
                });
                continue;
            }
            
            // Check for junk email
            if (isJunkEmail(email)) {
                results.junkToDelete.push({
                    id: contact.id,
                    name: contact.name,
                    org: orgName,
                    email: email,
                    reason: 'Junk/placeholder email'
                });
                continue;
            }
            
            // Check for blacklisted domain
            if (isBlacklistedDomain(email)) {
                const domain = extractDomainFromEmail(email);
                results.blacklistedToDelete.push({
                    id: contact.id,
                    name: contact.name,
                    org: orgName,
                    email: email,
                    domain: domain,
                    reason: 'Blacklisted vendor domain'
                });
                continue;
            }
            
            results.unchanged++;
        }
        
        // ════════════════════════════════════════════════════════════════════════
        // REPORT FINDINGS
        // ════════════════════════════════════════════════════════════════════════
        
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('📊 CLEANUP SUMMARY');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`🔧 Typos to fix:           ${results.typosToFix.length}`);
        console.log(`🗑️  Blacklisted to delete:  ${results.blacklistedToDelete.length}`);
        console.log(`🗑️  Junk to delete:         ${results.junkToDelete.length}`);
        console.log(`✅ Unchanged:              ${results.unchanged}`);
        console.log('');
        
        // Detail: Typos to fix
        if (results.typosToFix.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🔧 TYPOS TO FIX');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.typosToFix) {
                console.log(`   📌 ${item.name || '(no name)'}`);
                console.log(`      Org:    ${item.org}`);
                console.log(`      Before: ${item.oldEmail}`);
                console.log(`      After:  ${item.newEmail}`);
                console.log(`      ID:     ${item.id}`);
                console.log('');
            }
        }
        
        // Detail: Blacklisted to delete
        if (results.blacklistedToDelete.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🗑️  BLACKLISTED VENDOR CONTACTS TO DELETE');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.blacklistedToDelete) {
                console.log(`   📌 ${item.name || '(no name)'}`);
                console.log(`      Org:    ${item.org}`);
                console.log(`      Email:  ${item.email}`);
                console.log(`      Domain: ${item.domain} (blacklisted)`);
                console.log(`      ID:     ${item.id}`);
                console.log('');
            }
        }
        
        // Detail: Junk to delete
        if (results.junkToDelete.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🗑️  JUNK/PLACEHOLDER CONTACTS TO DELETE');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.junkToDelete) {
                console.log(`   📌 ${item.name || '(no name)'}`);
                console.log(`      Org:    ${item.org}`);
                console.log(`      Email:  ${item.email}`);
                console.log(`      ID:     ${item.id}`);
                console.log('');
            }
        }
        
        // ════════════════════════════════════════════════════════════════════════
        // EXECUTE CHANGES (if --execute flag)
        // ════════════════════════════════════════════════════════════════════════
        
        if (executeChanges) {
            console.log('════════════════════════════════════════════════════════════════');
            console.log('🔧 EXECUTING CHANGES...');
            console.log('════════════════════════════════════════════════════════════════');
            console.log('');
            
            let fixedCount = 0;
            let deletedCount = 0;
            
            // Fix typos
            if (results.typosToFix.length > 0) {
                console.log('────────────────────────────────────────────────────────────────');
                console.log('🔧 Fixing typos...');
                console.log('────────────────────────────────────────────────────────────────');
                for (const item of results.typosToFix) {
                    try {
                        await pb.collection('contacts').update(item.id, {
                            email: item.newEmail
                        });
                        console.log(`   ✅ Fixed: ${item.oldEmail} → ${item.newEmail}`);
                        fixedCount++;
                    } catch (err) {
                        console.log(`   ❌ Failed to fix ${item.id}: ${err.message}`);
                    }
                }
                console.log('');
            }
            
            // Delete blacklisted
            if (results.blacklistedToDelete.length > 0) {
                console.log('────────────────────────────────────────────────────────────────');
                console.log('🗑️  Deleting blacklisted contacts...');
                console.log('────────────────────────────────────────────────────────────────');
                for (const item of results.blacklistedToDelete) {
                    try {
                        await pb.collection('contacts').delete(item.id);
                        console.log(`   ✅ Deleted: ${item.email} (${item.name || 'no name'})`);
                        deletedCount++;
                    } catch (err) {
                        console.log(`   ❌ Failed to delete ${item.id}: ${err.message}`);
                    }
                }
                console.log('');
            }
            
            // Delete junk
            if (results.junkToDelete.length > 0) {
                console.log('────────────────────────────────────────────────────────────────');
                console.log('🗑️  Deleting junk contacts...');
                console.log('────────────────────────────────────────────────────────────────');
                for (const item of results.junkToDelete) {
                    try {
                        await pb.collection('contacts').delete(item.id);
                        console.log(`   ✅ Deleted: ${item.email} (${item.name || 'no name'})`);
                        deletedCount++;
                    } catch (err) {
                        console.log(`   ❌ Failed to delete ${item.id}: ${err.message}`);
                    }
                }
                console.log('');
            }
            
            console.log('════════════════════════════════════════════════════════════════');
            console.log('📊 EXECUTION COMPLETE');
            console.log('════════════════════════════════════════════════════════════════');
            console.log(`🔧 Typos fixed:      ${fixedCount}`);
            console.log(`🗑️  Contacts deleted: ${deletedCount}`);
            
        } else {
            // Dry run - show how to execute
            const totalChanges = results.typosToFix.length + 
                                results.blacklistedToDelete.length + 
                                results.junkToDelete.length;
            
            if (totalChanges > 0) {
                console.log('════════════════════════════════════════════════════════════════');
                console.log('💡 DRY RUN COMPLETE');
                console.log('════════════════════════════════════════════════════════════════');
                console.log('');
                console.log(`Found ${totalChanges} contacts to clean up.`);
                console.log('');
                console.log('To execute these changes, run:');
                console.log('   node scrapers/cleanup-contacts.js --execute');
                console.log('');
            } else {
                console.log('════════════════════════════════════════════════════════════════');
                console.log('✅ NO CLEANUP NEEDED');
                console.log('════════════════════════════════════════════════════════════════');
                console.log('All contacts are clean!');
            }
        }
        
        return results;
        
    } catch (error) {
        console.error('');
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// ════════════════════════════════════════════════════════════════════════════════
// CLI ENTRY POINT
// ════════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const executeChanges = args.includes('--execute');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
    console.log('');
    console.log('cleanup-contacts.js');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('Clean up contact data by fixing typos and removing vendor/junk contacts.');
    console.log('');
    console.log('USAGE:');
    console.log('  node scrapers/cleanup-contacts.js              # DRY RUN (preview)');
    console.log('  node scrapers/cleanup-contacts.js --execute    # Execute changes');
    console.log('  node scrapers/cleanup-contacts.js --help       # Show this help');
    console.log('');
    console.log('BLACKLISTED DOMAINS:');
    BLACKLISTED_DOMAINS.forEach(d => console.log(`  - ${d}`));
    console.log('');
    console.log('🔒 SECURITY: DRY RUN by default. Does NOT scrape any websites.');
    console.log('');
    process.exit(0);
}

cleanupContacts(executeChanges);
