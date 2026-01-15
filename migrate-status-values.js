/**
 * migrate-status-values.js
 * 
 * Migrates organization status values from old format to new format.
 * Also sets permission_type for organizations with granted permissions.
 * 
 * Run: node migrate-status-values.js
 * 
 * Created: 2026-01-04
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://event-discovery-backend-production.up.railway.app';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ════════════════════════════════════════════════════════════════════════════
// STATUS MAPPING: Old → New
// ════════════════════════════════════════════════════════════════════════════

const STATUS_MAP = {
    'Pending Mission Review': 'Nominated (Pending Mission Review)',
    'Mission Approved Pending Permission': 'Mission Approved (Request Not Sent)',
    'Permission Requested (Self)': 'Permission Requested (Pending Org Response)',
    'Permission Requested (Lawyer)': 'Permission Requested (Pending Org Response)',
    'Permission Granted': 'Permission Granted (Not Live)',
    'Mission Rejected': 'Rejected (By Mission or Org)',
    'Permission Rejected': 'Rejected (By Mission or Org)',
    'Scraping Active': 'Live (Scraping Active)'
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN MIGRATION FUNCTION
// ════════════════════════════════════════════════════════════════════════════

async function migrateStatusValues() {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔄 Organization Status Migration');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📡 PocketBase URL: ${POCKETBASE_URL}`);
    console.log('');

    // ─────────────────────────────────────────────────────────────────────────
    // Step 1: Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    console.log('🔐 Authenticating...');
    
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    if (!authResponse.ok) {
        console.log('❌ Authentication failed');
        console.log('   Check your POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD in .env');
        process.exit(1);
    }

    const authData = await authResponse.json();
    const authToken = authData.token;
    console.log('✅ Authenticated successfully');
    console.log('');

    // ─────────────────────────────────────────────────────────────────────────
    // Step 2: Fetch all organizations
    // ─────────────────────────────────────────────────────────────────────────
    console.log('📡 Fetching all organizations...');
    
    const orgsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records?perPage=500`,
        { headers: { 'Authorization': authToken } }
    );

    const orgsData = await orgsResponse.json();
    const organizations = orgsData.items || [];

    console.log(`✅ Found ${organizations.length} organizations`);
    console.log('');

    if (organizations.length === 0) {
        console.log('⚠️ No organizations to migrate');
        return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Step 3: Migrate each organization
    // ─────────────────────────────────────────────────────────────────────────
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔄 Migrating Status Values');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const org of organizations) {
        const oldStatus = org.status;
        const newStatus = STATUS_MAP[oldStatus];

        // Check if already migrated (status matches a new value)
        const isAlreadyNew = Object.values(STATUS_MAP).includes(oldStatus);
        
        if (isAlreadyNew) {
            console.log(`⏭️  ${org.name}`);
            console.log(`   Already migrated: "${oldStatus}"`);
            skipCount++;
            continue;
        }

        if (!newStatus) {
            console.log(`⚠️  ${org.name}`);
            console.log(`   Unknown status: "${oldStatus}" - skipping`);
            skipCount++;
            continue;
        }

        // Build update data
        const updateData = { status: newStatus };

        // Set permission_type for orgs that have/had permission granted
        if (oldStatus === 'Permission Granted' || oldStatus === 'Scraping Active') {
            updateData.permission_type = 'Explicit';
        }

        try {
            const updateResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records/${org.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify(updateData)
                }
            );

            if (updateResponse.ok) {
                console.log(`✅ ${org.name}`);
                console.log(`   "${oldStatus}" → "${newStatus}"`);
                if (updateData.permission_type) {
                    console.log(`   permission_type → "${updateData.permission_type}"`);
                }
                successCount++;
            } else {
                const errorData = await updateResponse.json();
                console.log(`❌ ${org.name}`);
                console.log(`   Failed: ${errorData.message || 'Unknown error'}`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ ${org.name}`);
            console.log(`   Error: ${error.message}`);
            errorCount++;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 Migration Summary');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped (already done or unknown): ${skipCount}`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount}`);
    }
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🎉 Migration complete!');
    console.log('════════════════════════════════════════════════════════════════');
}

// ════════════════════════════════════════════════════════════════════════════
// RUN MIGRATION
// ════════════════════════════════════════════════════════════════════════════

migrateStatusValues().catch(error => {
    console.error('');
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
});
