/**
 * add-contacts.js
 * 
 * Purpose: Add POC contacts to PocketBase contacts collection
 * 
 * Prerequisites:
 * - Node.js installed
 * - Environment variables set (POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD)
 * 
 * Usage:
 * 1. Set environment variables in PowerShell (see RunningScriptsFromAnyComputer.md)
 * 2. Run: node add-contacts.js
 */

// ============================================================================
// CONTACTS DATA
// ============================================================================

const contactsToAdd = [
    // Tier 1: Organizations with specific permissions contacts
    {
        orgName: "Council on Foreign Relations",
        name: "Permissions Team",
        email: "permissions@cfr.org",
        title: "",
        phone: "",
        contact_type: "Legal/Permissions",
        source_url: "https://www.cfr.org/contact-us",
        notes: ""
    },
    {
        orgName: "The RAND Corporation",
        name: "Permissions Team",
        email: "permissions@rand.org",
        title: "",
        phone: "310-393-0411 x7423",
        contact_type: "Legal/Permissions",
        source_url: "https://www.rand.org/about/contact.html",
        notes: ""
    },
    {
        orgName: "The Brookings Institution",
        name: "Permissions Team",
        email: "permissions@brookings.edu",
        title: "",
        phone: "",
        contact_type: "Legal/Permissions",
        source_url: "https://www.brookings.edu/contact-us/",
        notes: ""
    },
    {
        orgName: "The Brookings Institution",
        name: "Events Team",
        email: "events@brookings.edu",
        title: "",
        phone: "",
        contact_type: "Events",
        source_url: "https://www.brookings.edu/contact-us/",
        notes: ""
    },
    {
        orgName: "Center for Strategic and International Studies (CSIS)",
        name: "External Relations Team",
        email: "externalrelations@csis.org",
        title: "",
        phone: "",
        contact_type: "Events",
        source_url: "https://www.csis.org/contact",
        notes: "Handles 2,500+ events/year"
    },
    {
        orgName: "American Enterprise Institute (AEI)",
        name: "Jacqueline Derks",
        email: "",
        title: "Director of Events",
        phone: "202.862.5852",
        contact_type: "Events",
        source_url: "https://www.aei.org/contact/",
        notes: ""
    },

    // Tier 2: Organizations with general contacts
    {
        orgName: "Intelligence & National Security Alliance (INSA)",
        name: "General Contact",
        email: "info@insaonline.org",
        title: "",
        phone: "",
        contact_type: "Other",
        source_url: "https://www.insaonline.org/contact/",
        notes: ""
    },
    {
        orgName: "New America",
        name: "Media Team",
        email: "media@newamerica.org",
        title: "",
        phone: "",
        contact_type: "Media/PR",
        source_url: "https://www.newamerica.org/contact/",
        notes: ""
    },
    {
        orgName: "Atlantic Council",
        name: "Press Team",
        email: "press@atlanticcouncil.org",
        title: "",
        phone: "",
        contact_type: "Media/PR",
        source_url: "https://www.atlanticcouncil.org/contact/",
        notes: ""
    },
    {
        orgName: "The Hoover Institution",
        name: "Heather Campbell",
        email: "heather.campbell@stanford.edu",
        title: "",
        phone: "",
        contact_type: "Other",
        source_url: "https://www.hoover.org/about",
        notes: ""
    },
    {
        orgName: "Chatham House",
        name: "General Contact",
        email: "contact@chathamhouse.org",
        title: "",
        phone: "",
        contact_type: "Other",
        source_url: "https://www.chathamhouse.org/about-us/contact-us",
        notes: "UK-based organization"
    }
];

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
    console.log("════════════════════════════════════════════════════════════");
    console.log("📇 Add Contacts Script");
    console.log("════════════════════════════════════════════════════════════");

    // Check environment variables
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
        console.log("See RunningScriptsFromAnyComputer.md for instructions.");
        process.exit(1);
    }

    console.log("🔗 PocketBase URL: " + POCKETBASE_URL);
    console.log("");

    // Step 1: Authenticate
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

    // Step 2: Get all organizations (to look up IDs)
    console.log("📡 Fetching organizations...");
    let organizations;
    try {
        const orgsResponse = await fetch(`${POCKETBASE_URL}/api/collections/organizations/records?perPage=500`, {
            headers: { "Authorization": authToken }
        });

        if (!orgsResponse.ok) {
            throw new Error(`Failed to fetch orgs: ${orgsResponse.status}`);
        }

        const orgsData = await orgsResponse.json();
        organizations = orgsData.items;
        console.log(`✅ Found ${organizations.length} organizations`);
        console.log("");
    } catch (error) {
        console.log("❌ Failed to fetch organizations: " + error.message);
        process.exit(1);
    }

    // Step 3: Get existing contacts (to avoid duplicates)
    console.log("📡 Fetching existing contacts...");
    let existingContacts;
    try {
        const contactsResponse = await fetch(`${POCKETBASE_URL}/api/collections/contacts/records?perPage=500`, {
            headers: { "Authorization": authToken }
        });

        if (!contactsResponse.ok) {
            throw new Error(`Failed to fetch contacts: ${contactsResponse.status}`);
        }

        const contactsData = await contactsResponse.json();
        existingContacts = contactsData.items;
        console.log(`✅ Found ${existingContacts.length} existing contacts`);
        console.log("");
    } catch (error) {
        console.log("❌ Failed to fetch contacts: " + error.message);
        process.exit(1);
    }

    // Create a set of existing emails for duplicate checking
    const existingEmails = new Set(existingContacts.map(c => c.email?.toLowerCase()).filter(Boolean));

    // Step 4: Add each contact
    console.log("────────────────────────────────────────────────────────────");
    console.log("📇 Adding contacts...");
    console.log("────────────────────────────────────────────────────────────");

    let added = 0;
    let skipped = 0;
    let errors = 0;

    for (const contact of contactsToAdd) {
        // Find organization ID
        const org = organizations.find(o => o.name === contact.orgName);
        
        if (!org) {
            console.log(`⚠️  Skipped: ${contact.name} - Organization not found: "${contact.orgName}"`);
            skipped++;
            continue;
        }

        // Check for duplicate (by email)
        if (contact.email && existingEmails.has(contact.email.toLowerCase())) {
            console.log(`⏭️  Skipped: ${contact.name} (${contact.email}) - Already exists`);
            skipped++;
            continue;
        }

        // Create contact record
        try {
            const contactData = {
                name: contact.name,
                email: contact.email || "",
                title: contact.title || "",
                phone: contact.phone || "",
                organization: org.id,
                contact_type: contact.contact_type,
                source_url: contact.source_url || "",
                notes: contact.notes || ""
            };

            const createResponse = await fetch(`${POCKETBASE_URL}/api/collections/contacts/records`, {
                method: "POST",
                headers: {
                    "Authorization": authToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                throw new Error(`${createResponse.status} - ${errorText}`);
            }

            console.log(`✅ Added: ${contact.name} → ${contact.orgName}`);
            added++;

            // Add email to existing set to prevent duplicates within this run
            if (contact.email) {
                existingEmails.add(contact.email.toLowerCase());
            }

        } catch (error) {
            console.log(`❌ Error: ${contact.name} - ${error.message}`);
            errors++;
        }

        // Small delay to be polite to the server
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Summary
    console.log("");
    console.log("════════════════════════════════════════════════════════════");
    console.log("📊 Summary");
    console.log("════════════════════════════════════════════════════════════");
    console.log(`✅ Added:   ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors:  ${errors}`);
    console.log("");
    console.log("Done!");
}

// Run the script
main().catch(error => {
    console.log("❌ Unexpected error: " + error.message);
    process.exit(1);
});
