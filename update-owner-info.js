/**
 * Update Owner Info Script
 * 
 * This script updates the owner_info in the settings collection
 * so permission request drafts include your correct contact details.
 * 
 * INSTRUCTIONS:
 * 1. Edit the OWNER_INFO section below with your details
 * 2. Save the file
 * 3. Run: node update-owner-info.js
 */

const PocketBase = require('pocketbase/cjs');

// ══════════════════════════════════════════════════════════════════════════════
// EDIT YOUR INFORMATION HERE
// ══════════════════════════════════════════════════════════════════════════════

const OWNER_INFO = {
    owner_name: "Matt Taylor",      // Your full name
    owner_email: "matthew_e_taylor@hotmail.com",       // Your email address
    owner_mobile: "703-795-0217"      // Your mobile number (optional)
};

// ══════════════════════════════════════════════════════════════════════════════
// DO NOT EDIT BELOW THIS LINE
// ══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

async function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('  UPDATE OWNER INFO SCRIPT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    // Validate environment variables
    if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('❌ Error: Missing environment variables');
        console.error('   Required: POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }

    // Validate owner info was edited
    if (OWNER_INFO.owner_email === "YOUR_EMAIL_HERE") {
        console.error('❌ Error: Please edit the OWNER_INFO section with your details');
        console.error('   Open this file and replace YOUR_EMAIL_HERE with your email');
        process.exit(1);
    }

    const pb = new PocketBase(POCKETBASE_URL);

    try {
        // Authenticate
        console.log('🔐 Authenticating to PocketBase...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authentication successful');
        console.log('');

        // Check if owner_info setting exists
        console.log('🔍 Checking for existing owner_info setting...');
        let existingRecord = null;
        
        try {
            existingRecord = await pb.collection('settings').getFirstListItem('key="owner_info"');
            console.log('   Found existing record');
        } catch (e) {
            console.log('   No existing record found');
        }

        // Update or create the setting
        if (existingRecord) {
            console.log('📝 Updating owner_info...');
            await pb.collection('settings').update(existingRecord.id, {
                key: 'owner_info',
                value: JSON.stringify(OWNER_INFO)
            });
        } else {
            console.log('📝 Creating owner_info...');
            await pb.collection('settings').create({
                key: 'owner_info',
                value: JSON.stringify(OWNER_INFO)
            });
        }

        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  ✅ SUCCESS! Owner info updated');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');
        console.log('📋 Your info:');
        console.log(`   Name:   ${OWNER_INFO.owner_name}`);
        console.log(`   Email:  ${OWNER_INFO.owner_email}`);
        console.log(`   Mobile: ${OWNER_INFO.owner_mobile || '(not provided)'}`);
        console.log('');
        console.log('Future permission request drafts will include these details.');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
