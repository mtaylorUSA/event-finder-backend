/**
 * generate-permission-requests.js
 *
 * Generates permission request email drafts for organizations
 * - Pulls POC info from contacts collection
 * - Pulls owner info from settings collection
 * - Generates customized email draft for each organization
 * - Saves draft to permission_request_draft field in organizations
 *
 * Usage: node generate-permission-requests.js
 *
 * Last Updated: 2025-12-04
 */

// ============================================================================
// EMAIL TEMPLATE
// ============================================================================

const EMAIL_TEMPLATE = `Dear [POC_NAME],

I am developing a research tool to aggregate publicly available event information from national security and foreign policy organizations. I am writing to request permission to:
- Programmatically access your public events list page and/or individual events' pages;
- Extract basic event information (title, date, time, location, URL);
- Store this information in a personal database;
- Display event titles with links back to your original event pages.

I want to emphasize:
- This is currently a personal/research project, intended for me and a small number of users;
- All events would link back to your website for registration;
- No content beyond basic event metadata would be reproduced;
- I would respect any rate limits or technical restrictions;
- I would immediately cease if requested.

I have reviewed your website's terms of use and wanted to explicitly request permission rather than make assumptions.

Would you be willing to grant permission for this use?

Thank you for your consideration.

Regards,
[MY_NAME]
[MY_EMAIL]
[MY_MOBILE]`;

const EMAIL_SUBJECT = "Permission Request - Event Data Aggregation";

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
    console.log("════════════════════════════════════════════════════════════");
    console.log("📧 Generate Permission Requests Script");
    console.log("════════════════════════════════════════════════════════════");

    const POCKETBASE_URL = process.env.POCKETBASE_URL;
    const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
    const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.log("❌ Missing environment variables!");
        console.log("");
        console.log("Required variables:");
        console.log("  - POCKETBASE_URL: " + (POCKETBASE_URL ? "✅ Set" : "❌ Missing"));
        console.log("  - POCKETBASE_ADMIN_EMAIL: " + (POCKETBASE_ADMIN_EMAIL ? "✅ Set" : "❌ Missing"));
        console.log("  - POCKETBASE_ADMIN_PASSWORD: " + (POCKETBASE_ADMIN_PASSWORD ? "✅ Set" : "❌ Missing"));
        console.log("");
        console.log("See RunningScriptsManually.md for instructions.");
        process.exit(1);
    }

    console.log("🔗 PocketBase URL: " + POCKETBASE_URL);
    console.log("");

    console.log("🔐 Authenticating...");
    let authToken;
    try {
        const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identity: POCKETBASE_ADMIN_EMAIL,
                password: POCKETBASE_ADMIN_PASSWORD
            })
        });

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            throw new Error(`Auth failed: ${authResponse.status} - ${errorText}`);
        }

        const authData = await authResponse.json();
        authToken = authData.token;
        console.log("✅ Authenticated successfully");
        console.log("");
    } catch (error) {
        console.log("❌ Authentication failed: " + error.message);
        process.exit(1);
    }

    console.log("📡 Fetching owner info from settings...");
    let ownerInfo;
    try {
        const settingsResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/settings/records?filter=(setting_name='owner_info')`,
            { headers: { "Authorization": authToken } }
        );

        if (!settingsResponse.ok) {
            throw new Error(`Failed to fetch settings: ${settingsResponse.status}`);
        }

        const settingsData = await settingsResponse.json();
        if (!settingsData.items || settingsData.items.length === 0) {
            throw new Error("No owner_info record found in settings collection");
        }

        ownerInfo = settingsData.items[0];
        console.log(`✅ Found owner info: ${ownerInfo.my_name}`);
        console.log("");
    } catch (error) {
        console.log("❌ Failed to fetch owner info: " + error.message);
        process.exit(1);
    }

    console.log("📡 Fetching organizations needing permission requests...");
    let organizations;
    try {
        const orgsResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records?filter=(status='Mission Approved Pending Permission')&perPage=500`,
            { headers: { "Authorization": authToken } }
        );

        if (!orgsResponse.ok) {
            throw new Error(`Failed to fetch orgs: ${orgsResponse.status}`);
        }

        const orgsData = await orgsResponse.json();
        organizations = orgsData.items;
        console.log(`✅ Found ${organizations.length} organizations needing permission requests`);
        console.log("");
    } catch (error) {
        console.log("❌ Failed to fetch organizations: " + error.message);
        process.exit(1);
    }

    if (organizations.length === 0) {
        console.log("ℹ️  No organizations with status 'Mission Approved Pending Permission'");
        console.log("   Nothing to do.");
        process.exit(0);
    }

    console.log("📡 Fetching contacts...");
    let contacts;
    try {
        const contactsResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/contacts/records?perPage=500`,
            { headers: { "Authorization": authToken } }
        );

        if (!contactsResponse.ok) {
            throw new Error(`Failed to fetch contacts: ${contactsResponse.status}`);
        }

        const contactsData = await contactsResponse.json();
        contacts = contactsData.items;
        console.log(`✅ Found ${contacts.length} contacts`);
        console.log("");
    } catch (error) {
        console.log("❌ Failed to fetch contacts: " + error.message);
        process.exit(1);
    }

    console.log("────────────────────────────────────────────────────────────");
    console.log("📧 Generating permission request drafts...");
    console.log("────────────────────────────────────────────────────────────");

    let generated = 0;
    let skipped = 0;
    let noContact = 0;
    let errors = 0;

    for (const org of organizations) {
        const orgContacts = contacts.filter(c => c.organization === org.id);
        
        let bestContact = null;
        if (orgContacts.length > 0) {
            bestContact = orgContacts.find(c => c.contact_type === 'Legal/Permissions') ||
                          orgContacts.find(c => c.contact_type === 'Events') ||
                          orgContacts[0];
        }

        if (!bestContact) {
            console.log(`⚠️  Skipped: ${org.name} - No contact found`);
            noContact++;
            continue;
        }

        if (org.permission_request_draft && org.permission_request_draft.trim().length > 0) {
            console.log(`⏭️  Skipped: ${org.name} - Already has draft`);
            skipped++;
            continue;
        }

        const pocName = bestContact.name || "Permissions Team";
        
        let emailDraft = EMAIL_TEMPLATE
            .replace("[POC_NAME]", pocName)
            .replace("[MY_NAME]", ownerInfo.my_name || "")
            .replace("[MY_EMAIL]", ownerInfo.my_email || "")
            .replace("[MY_MOBILE]", ownerInfo.my_mobile || "");

        const fullDraft = `SUBJECT: ${EMAIL_SUBJECT}\nTO: ${bestContact.email || "(no email)"}\n\n${emailDraft}`;

        try {
            const updateResponse = await fetch(
                `${POCKETBASE_URL}/api/collections/organizations/records/${org.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": authToken,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        permission_request_draft: fullDraft
                    })
                }
            );

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`${updateResponse.status} - ${errorText}`);
            }

            console.log(`✅ Generated: ${org.name} → ${bestContact.email || bestContact.name}`);
            generated++;

        } catch (error) {
            console.log(`❌ Error: ${org.name} - ${error.message}`);
            errors++;
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("");
    console.log("════════════════════════════════════════════════════════════");
    console.log("📊 Summary");
    console.log("════════════════════════════════════════════════════════════");
    console.log(`✅ Generated:   ${generated}`);
    console.log(`⏭️  Skipped:     ${skipped} (already had draft)`);
    console.log(`⚠️  No Contact:  ${noContact}`);
    console.log(`❌ Errors:      ${errors}`);
    console.log("");

    if (generated > 0) {
        console.log("📋 NEXT STEPS:");
        console.log("   1. Open PocketBase Admin or admin-interface.html");
        console.log("   2. Go to organizations collection");
        console.log("   3. Filter by status = 'Mission Approved Pending Permission'");
        console.log("   4. Open each org and review the permission_request_draft field");
        console.log("   5. Copy the draft, edit if needed, and send to the POC");
        console.log("   6. Update status to 'Permission Requested (Self)' or '(Lawyer)'");
        console.log("   7. Set permission_requested_date to today");
        console.log("");
    }

    console.log("Done!");
}

main().catch(error => {
    console.log("❌ Unexpected error: " + error.message);
    process.exit(1);
});