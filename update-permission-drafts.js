/**
 * update-permission-drafts.js
 * 
 * Updates all organizations with status "Mission Approved Pending Permission"
 * to use the new permission request email template.
 * 
 * Run: node update-permission-drafts.js
 */

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://event-discovery-backend-production.up.railway.app';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ════════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATE
// ════════════════════════════════════════════════════════════════════════════

const PROCEED_DATE = 'January 15, 2026';

function generatePermissionDraft(orgName) {
    return `Subject: Notice: Automated Event Collection from ${orgName}

Hello,

I am gathering publicly available information on events related to national security, defense, and intelligence events, and I would like to automate collection of events information from ${orgName}'s website.

The ${orgName} website's terms of use did not appear to put constraints on gathering this information. I believe this work will drive additional visitors to your site and events. Additionally, I will ensure that:
- All listings will link directly to your original event pages
- Your organization will be clearly credited as the source
- Rate limits will be respected 
- Gathering stops if you request it at any time

I wanted to notify you before I begin, so you have the opportunity to decline or set specific terms. I understand you may be busy, so I plan to proceed on ${PROCEED_DATE} unless I hear otherwise. A quick "okay" or "no thanks" would be appreciated, but no response is needed if you are fine with this.

Thank you for your time.

Regards,
Matt Taylor
matthew_e_taylor@hotmail.com
Mobile: 703-795-0217`;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN SCRIPT
// ════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📧 Permission Draft Updater');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📡 PocketBase URL: ${POCKETBASE_URL}`);
    console.log(`📅 Proceed Date: ${PROCEED_DATE}`);
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
        process.exit(1);
    }

    const authData = await authResponse.json();
    const authToken = authData.token;
    console.log('✅ Authenticated successfully');
    console.log('');

    // ─────────────────────────────────────────────────────────────────────────
    // Step 2: Fetch organizations needing drafts
    // ─────────────────────────────────────────────────────────────────────────
    console.log('📡 Fetching organizations with status "Mission Approved Pending Permission"...');
    
    const orgsResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records?filter=(status='Mission Approved Pending Permission')&perPage=500`,
        { headers: { 'Authorization': authToken } }
    );

    const orgsData = await orgsResponse.json();
    const organizations = orgsData.items || [];

    console.log(`✅ Found ${organizations.length} organizations`);
    console.log('');

    if (organizations.length === 0) {
        console.log('⚠️ No organizations to update');
        return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Step 3: Update each organization's draft
    // ─────────────────────────────────────────────────────────────────────────
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📝 Updating Permission Request Drafts');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (const org of organizations) {
        const draft = generatePermissionDraft(org.name);

        try {
            const updateResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records/${org.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({ permission_request_draft: draft })
                }
            );

            if (updateResponse.ok) {
                console.log(`✅ ${org.name}`);
                successCount++;
            } else {
                console.log(`❌ ${org.name} - Failed to update`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ ${org.name} - Error: ${error.message}`);
            errorCount++;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 Summary');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`✅ Successfully updated: ${successCount}`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount}`);
    }
    console.log('');
    console.log('🎉 Done! Refresh the Admin Interface to see updated drafts.');
}

main().catch(console.error);
