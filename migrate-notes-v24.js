/**
 * migrate-notes-v24.js
 * 
 * ONE-TIME MIGRATION SCRIPT
 * Consolidates tou_notes + scrape_notes + notes → notes (single field)
 * 
 * Run ONCE before deploying Admin Interface v24
 * 
 * Usage:
 *   node migrate-notes-v24.js --dry-run    # Preview changes (recommended first)
 *   node migrate-notes-v24.js              # Execute migration
 * 
 * Created: 2026-01-25
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

let authToken = null;

async function authenticate() {
    console.log('🔐 Authenticating...');
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) throw new Error('Authentication failed');
    const data = await response.json();
    authToken = data.token;
    console.log('✅ Authenticated\n');
}

async function getAllOrganizations() {
    console.log('📡 Fetching all organizations...');
    let allOrgs = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?page=${page}&perPage=${perPage}`,
            { headers: { 'Authorization': authToken } }
        );
        const data = await response.json();
        allOrgs = allOrgs.concat(data.items);
        
        if (data.items.length < perPage) break;
        page++;
    }
    
    console.log(`✅ Found ${allOrgs.length} organizations\n`);
    return allOrgs;
}

async function updateOrganization(orgId, updates) {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(updates)
        }
    );
    return response.ok;
}

async function migrate(dryRun = false) {
    await authenticate();
    const orgs = await getAllOrganizations();
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log(dryRun ? '🔍 DRY RUN - No changes will be made' : '🚀 EXECUTING MIGRATION');
    console.log('════════════════════════════════════════════════════════════════\n');
    
    for (const org of orgs) {
        const touNotes = (org.tou_notes || '').trim();
        const scrapeNotes = (org.scrape_notes || '').trim();
        const existingNotes = (org.notes || '').trim();
        
        // Build consolidated notes
        const parts = [];
        
        if (touNotes) {
            parts.push(`[TOU Notes - Migrated]\n${touNotes}`);
        }
        
        if (scrapeNotes) {
            parts.push(`[Scrape Notes - Migrated]\n${scrapeNotes}`);
        }
        
        if (existingNotes) {
            parts.push(`[Original Notes]\n${existingNotes}`);
        }
        
        // Skip if nothing to migrate
        if (parts.length === 0 || (parts.length === 1 && existingNotes && !touNotes && !scrapeNotes)) {
            skipped++;
            continue;
        }
        
        const consolidatedNotes = parts.join('\n\n────────────────────────────────────\n\n');
        
        console.log(`📋 ${org.name}`);
        console.log(`   TOU Notes: ${touNotes ? touNotes.substring(0, 50) + '...' : '(empty)'}`);
        console.log(`   Scrape Notes: ${scrapeNotes ? scrapeNotes.substring(0, 50) + '...' : '(empty)'}`);
        console.log(`   Existing Notes: ${existingNotes ? existingNotes.substring(0, 50) + '...' : '(empty)'}`);
        
        if (!dryRun) {
            const success = await updateOrganization(org.id, {
                notes: consolidatedNotes,
                // Clear old fields (optional - comment out to preserve)
                // tou_notes: '',
                // scrape_notes: ''
            });
            
            if (success) {
                console.log(`   ✅ Migrated\n`);
                migrated++;
            } else {
                console.log(`   ❌ Error\n`);
                errors++;
            }
        } else {
            console.log(`   🔍 Would migrate\n`);
            migrated++;
        }
    }
    
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Total organizations: ${orgs.length}`);
    console.log(`   ${dryRun ? 'Would migrate' : 'Migrated'}: ${migrated}`);
    console.log(`   Skipped (no notes): ${skipped}`);
    if (!dryRun) console.log(`   Errors: ${errors}`);
    console.log('════════════════════════════════════════════════════════════════\n');
    
    if (dryRun) {
        console.log('💡 Run without --dry-run to execute the migration.\n');
    }
}

// Parse arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

migrate(dryRun).catch(console.error);
