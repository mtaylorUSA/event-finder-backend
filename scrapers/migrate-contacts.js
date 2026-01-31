/**
 * migrate-contacts.js
 * 
 * MIGRATION SCRIPT - Run once to populate new contact fields
 * 
 * This script migrates existing contacts to use the new schema:
 *   - Copies email → emails array (with metadata)
 *   - Copies phone → phones array (with metadata)
 *   - Sets email_normalized (lowercase for dedup)
 *   - Calculates data_completeness
 *   - Sets is_active = true for all existing contacts
 * 
 * Usage:
 *   node migrate-contacts.js           # Run migration
 *   node migrate-contacts.js --dry-run # Preview without saving
 * 
 * Prerequisites:
 *   - POCKETBASE_URL in .env
 *   - POCKETBASE_ADMIN_EMAIL in .env
 *   - POCKETBASE_ADMIN_PASSWORD in .env
 * 
 * Created: 2026-01-30
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

let fetchModule;
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    fetchModule = (await import('node-fetch')).default;
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📦 Contact Migration Script');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be saved');
        console.log('');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Validate environment
    // ─────────────────────────────────────────────────────────────────────────
    
    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.log('❌ Missing PocketBase credentials in .env');
        console.log('   Required: POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🔐 Authenticating with PocketBase...');
    authToken = await authenticate();
    console.log('   ✅ Authenticated');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Fetch all contacts
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('📡 Fetching all contacts...');
    const contacts = await fetchAllContacts();
    console.log(`   ✅ Found ${contacts.length} contacts`);
    console.log('');
    
    if (contacts.length === 0) {
        console.log('ℹ️ No contacts to migrate');
        return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Process each contact
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🔄 Processing Contacts');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('');
    
    const stats = {
        processed: 0,
        updated: 0,
        skipped: 0,
        errors: 0
    };
    
    for (const contact of contacts) {
        stats.processed++;
        
        console.log(`${stats.processed}/${contacts.length} - ${contact.name || contact.email || contact.id}`);
        
        // Build updates
        const updates = buildUpdates(contact);
        
        if (Object.keys(updates).length === 0) {
            console.log('   ⏭️ Already migrated, skipping');
            stats.skipped++;
            continue;
        }
        
        // Show what will be updated
        console.log('   📝 Updates:');
        if (updates.emails) {
            console.log(`      • emails: ${JSON.stringify(updates.emails)}`);
        }
        if (updates.phones) {
            console.log(`      • phones: ${JSON.stringify(updates.phones)}`);
        }
        if (updates.email_normalized) {
            console.log(`      • email_normalized: "${updates.email_normalized}"`);
        }
        if (updates.data_completeness) {
            console.log(`      • data_completeness: "${updates.data_completeness}"`);
        }
        if (updates.is_active !== undefined) {
            console.log(`      • is_active: ${updates.is_active}`);
        }
        
        // Save if not dry run
        if (!dryRun) {
            const success = await updateContact(contact.id, updates);
            if (success) {
                console.log('   ✅ Saved');
                stats.updated++;
            } else {
                console.log('   ❌ Failed to save');
                stats.errors++;
            }
        } else {
            console.log('   🔍 [Dry run - not saved]');
            stats.updated++;
        }
        
        console.log('');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   📋 Total contacts: ${stats.processed}`);
    console.log(`   ✅ Updated: ${stats.updated}`);
    console.log(`   ⏭️ Skipped (already migrated): ${stats.skipped}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    console.log('');
    
    if (dryRun) {
        console.log('💡 This was a dry run. Run without --dry-run to apply changes.');
        console.log('');
    }
    
    console.log('════════════════════════════════════════════════════════════════');
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD UPDATES FOR A CONTACT
// ═══════════════════════════════════════════════════════════════════════════════

function buildUpdates(contact) {
    const updates = {};
    
    // ─────────────────────────────────────────────────────────────────────────
    // emails array
    // ─────────────────────────────────────────────────────────────────────────
    
    // Only migrate if emails array is empty/null and email field has data
    if ((!contact.emails || contact.emails.length === 0) && contact.email) {
        const emailType = detectEmailType(contact.email, contact.contact_type);
        updates.emails = [
            {
                address: contact.email,
                type: emailType,
                primary: true
            }
        ];
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // phones array
    // ─────────────────────────────────────────────────────────────────────────
    
    // Only migrate if phones array is empty/null and phone field has data
    if ((!contact.phones || contact.phones.length === 0) && contact.phone) {
        updates.phones = [
            {
                number: contact.phone,
                type: 'Main',
                primary: true
            }
        ];
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // email_normalized
    // ─────────────────────────────────────────────────────────────────────────
    
    // Set normalized email if not already set
    if (!contact.email_normalized && contact.email) {
        updates.email_normalized = contact.email.toLowerCase().trim();
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // data_completeness
    // ─────────────────────────────────────────────────────────────────────────
    
    // Calculate if not already set
    if (!contact.data_completeness) {
        updates.data_completeness = calculateCompleteness(contact);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // is_active
    // ─────────────────────────────────────────────────────────────────────────
    
    // Set to true if not already set (null/undefined)
    if (contact.is_active === null || contact.is_active === undefined) {
        updates.is_active = true;
    }
    
    return updates;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect email type based on email prefix and contact_type
 */
function detectEmailType(email, contactType) {
    const lower = email.toLowerCase();
    
    // Check email prefix first
    if (lower.startsWith('legal') || lower.startsWith('permissions') || lower.startsWith('licensing')) {
        return 'Legal';
    }
    if (lower.startsWith('events') || lower.startsWith('programs') || lower.startsWith('conference')) {
        return 'Events';
    }
    if (lower.startsWith('media') || lower.startsWith('press') || lower.startsWith('pr@') || lower.startsWith('communications')) {
        return 'Media/PR';
    }
    if (lower.startsWith('info') || lower.startsWith('contact') || lower.startsWith('general')) {
        return 'General';
    }
    
    // Fall back to contact_type if set
    if (contactType && contactType !== 'Other') {
        return contactType;
    }
    
    return 'General';
}

/**
 * Calculate data completeness based on available fields
 */
function calculateCompleteness(contact) {
    const hasName = contact.name && contact.name.trim() !== '' && contact.name !== 'General Contact';
    const hasEmail = contact.email && contact.email.trim() !== '';
    const hasPhone = contact.phone && contact.phone.trim() !== '';
    
    if (hasName && hasEmail && hasPhone) {
        return 'complete';
    }
    if (hasEmail && !hasName) {
        return 'email_only';
    }
    if (hasName && !hasEmail) {
        return 'name_only';
    }
    return 'partial';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function authenticate() {
    const response = await fetchModule(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) {
        throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    return data.token;
}

async function fetchAllContacts() {
    const allContacts = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records?page=${page}&perPage=${perPage}&sort=created`,
            { headers: { 'Authorization': `Bearer ${authToken}` } }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        
        const data = await response.json();
        allContacts.push(...(data.items || []));
        
        // Check if we've fetched all pages
        if (data.items.length < perPage) {
            break;
        }
        
        page++;
    }
    
    return allContacts;
}

async function updateContact(contactId, updates) {
    try {
        const response = await fetchModule(
            `${POCKETBASE_URL}/api/collections/contacts/records/${contactId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updates)
            }
        );
        
        return response.ok;
    } catch (error) {
        console.log(`      ⚠️ Error: ${error.message}`);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════════

main().catch(error => {
    console.error('');
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
