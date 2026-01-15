/**
 * Regenerate Permission Request Drafts
 * 
 * This script regenerates permission request drafts using the
 * correct owner info from the settings collection.
 * 
 * Run: node regenerate-drafts.js
 */

const PocketBase = require('pocketbase/cjs');

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ══════════════════════════════════════════════════════════════════════════════
// PERMISSION REQUEST EMAIL TEMPLATE
// ══════════════════════════════════════════════════════════════════════════════

function generatePermissionRequestDraft(orgName, contactName, ownerInfo) {
    return `Subject: Permission Request - Event Data Aggregation for Research Tool

Dear ${contactName || 'Events/Permissions Team'},

I am developing a personal research tool called "Event Finder" that aggregates publicly available event information from organizations in the national security, defense, and intelligence community. I am writing to formally request your permission to include ${orgName}'s public events in this aggregation.

PURPOSE AND SCOPE:
- This is a personal/small-group research tool, not a commercial product
- The tool collects only basic, publicly available event metadata:
  * Event title
  * Date and time
  * Location (if public)
  * Link back to your original event page
- No registration-required content, attendee information, or private data is collected

MY COMMITMENT TO YOU:
- All event listings will link directly to your original event pages
- Your organization will be clearly credited as the source
- I will respect any rate limits and access your site responsibly
- I will immediately cease collection if you request it
- I will honor any specific restrictions you may have

Rather than assuming public information is free to aggregate, I believe in obtaining explicit permission. I would greatly appreciate your approval to include ${orgName}'s public event listings.

Please let me know if you have any questions, require additional information, or have specific terms you'd like me to follow.

Thank you for your time and consideration.

Best regards,

${ownerInfo.my_name}
${ownerInfo.my_email}
${ownerInfo.my_mobile ? `Mobile: ${ownerInfo.my_mobile}` : ''}`;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SCRIPT
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('  REGENERATE PERMISSION REQUEST DRAFTS');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('❌ Error: Missing environment variables');
        process.exit(1);
    }

    const pb = new PocketBase(POCKETBASE_URL);

    try {
        // Authenticate
        console.log('🔐 Authenticating to PocketBase...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authentication successful');
        console.log('');

        // Fetch owner info with correct field names
        console.log('📋 Fetching owner info from settings...');
        let ownerInfo = {};
        
        try {
            const settings = await pb.collection('settings').getFirstListItem('setting_name="owner_info"');
            ownerInfo = {
                my_name: settings.my_name,
                my_email: settings.my_email,
                my_mobile: settings.my_mobile
            };
            console.log(`   ✅ Found: ${ownerInfo.my_name}`);
            console.log(`   ✅ Email: ${ownerInfo.my_email}`);
            console.log(`   ✅ Mobile: ${ownerInfo.my_mobile}`);
        } catch (e) {
            console.log('   ❌ Could not fetch owner info');
            console.log('   Error:', e.message);
            process.exit(1);
        }
        console.log('');

        // Get PATH A organizations (tou_flag = false)
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  REGENERATING DRAFTS FOR PATH A ORGANIZATIONS');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');

        const orgs = await pb.collection('organizations').getList(1, 50, {
            filter: 'tou_flag = false && status = "Mission Approved Pending Permission"'
        });

        console.log(`Found ${orgs.items.length} organizations to process`);
        console.log('');

        let generated = 0;
        let failed = 0;

        for (const org of orgs.items) {
            process.stdout.write(`📧 ${org.name}... `);

            try {
                // Find best contact for this org
                let contactName = 'Events/Permissions Team';
                try {
                    const contacts = await pb.collection('contacts').getList(1, 10, {
                        filter: `organization = "${org.id}"`
                    });

                    if (contacts.items.length > 0) {
                        const priorityOrder = ['Legal/Permissions', 'Events', 'Other', 'Media/PR', 'Leadership'];
                        for (const type of priorityOrder) {
                            const match = contacts.items.find(c => c.contact_type === type);
                            if (match) {
                                contactName = match.name || contactName;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // Use default
                }

                // Generate draft
                const draft = generatePermissionRequestDraft(org.name, contactName, ownerInfo);

                // Save draft
                await pb.collection('organizations').update(org.id, {
                    permission_request_draft: draft
                });

                console.log('✅ REGENERATED');
                generated++;

            } catch (error) {
                console.log(`❌ ERROR: ${error.message}`);
                failed++;
            }
        }

        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`Summary: ${generated} regenerated, ${failed} failed`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  ✅ COMPLETE - Drafts now include your contact info');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
