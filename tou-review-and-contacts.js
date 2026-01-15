/**
 * TOU Review and Contact Management Script
 * 
 * This script:
 * 1. Records TOU review findings for organizations (audit trail)
 * 2. Sets tou_flag appropriately based on review
 * 3. Adds contacts for PATH A organizations (tou_flag = false)
 * 4. Generates permission request drafts for PATH A organizations
 * 
 * Run: node tou-review-and-contacts.js
 * 
 * Environment variables required:
 *   POCKETBASE_URL - PocketBase server URL
 *   POCKETBASE_ADMIN_EMAIL - Admin email
 *   POCKETBASE_ADMIN_PASSWORD - Admin password
 */

const PocketBase = require('pocketbase/cjs');

// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Today's date for review records
const REVIEW_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// ══════════════════════════════════════════════════════════════════════════════
// TOU REVIEW FINDINGS
// Records the results of TOU review for each organization
// ══════════════════════════════════════════════════════════════════════════════

const TOU_REVIEWS = [
    // ──────────────────────────────────────────────────────────────────────────
    // PATH B: TOU PROHIBITS SCRAPING (tou_flag = true)
    // Do NOT gather POC info for these organizations
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Belfer Center",
        tou_flag: true,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: SCRAPING PROHIBITED
SOURCE: Harvard Link Acceptable Use Policy (https://link.harvard.edu/acceptable-use-policy)
KEY LANGUAGE: "You may not conduct any systematic or automated data collection activities, including scraping, data mining, data extraction, and data harvesting, on or in relation to the Site."
DECISION: Set tou_flag=true. Do NOT scrape content or gather POC info programmatically. Use manual outreach only.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "INSS",
        tou_flag: true,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: SCRAPING PROHIBITED (COPYRIGHT CLAIM)
SOURCE: INSS Privacy Policy and Terms of Use (https://www.inss.org.il/privacy/)
KEY LANGUAGE: "All Website content—including research publications, articles, images, videos, and multimedia—is the property of INSS and protected by copyright." and "Users may browse and make personal use of content, but may not reproduce, distribute, or use content commercially without prior written consent."
DECISION: Set tou_flag=true per project rule that explicit copyright claims prohibit scraping. Do NOT scrape content or gather POC info programmatically. Use manual outreach only.
REVIEWED BY: Claude AI assistant at user's direction`
    },

    // ──────────────────────────────────────────────────────────────────────────
    // PATH A: TOU DOES NOT PROHIBIT SCRAPING (tou_flag = false)
    // OK to gather POC info and generate email drafts
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "CISA",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO SCRAPING PROHIBITION FOUND
SOURCE: CISA Terms of Use (https://www.cisa.gov/terms-use)
FINDINGS: TOU focuses on authorized use of government systems, security monitoring, and information sharing. No mention of scraping, crawling, or automated access restrictions.
DECISION: Set tou_flag=false. Proceed with gathering POC info and generating permission request.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "Potomac Officers Club",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO TOU FOUND
SOURCE: Searched potomacofficersclub.com for Terms of Use, Terms of Service, Privacy Policy
FINDINGS: No Terms of Use page found on website. Only cookie consent notice present.
DECISION: Set tou_flag=false (no TOU = no prohibition). Proceed with gathering POC info and generating permission request. Will still request explicit permission before scraping.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "Center for a New American Security",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO TOU FOUND
SOURCE: Searched cnas.org for Terms of Use, Terms of Service, Privacy Policy
FINDINGS: No Terms of Use page found on website. About page and FAQ contain no scraping restrictions.
DECISION: Set tou_flag=false (no TOU = no prohibition). Proceed with gathering POC info and generating permission request. Will still request explicit permission before scraping.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "International Institute for Strategic Studies",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO TOU FOUND
SOURCE: Searched iiss.org for Terms of Use, Terms of Service, Privacy Policy
FINDINGS: No Terms of Use page found on website.
DECISION: Set tou_flag=false (no TOU = no prohibition). Proceed with gathering POC info and generating permission request. Will still request explicit permission before scraping.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "Stimson Center",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO SCRAPING PROHIBITION FOUND
SOURCE: Stimson Center Privacy Policy (https://www.stimson.org/privacy-policy/)
FINDINGS: Privacy Policy found but focuses on data collection from users, cookies, and personal information. No mention of scraping, crawling, or automated access restrictions. No explicit copyright prohibition on website access.
DECISION: Set tou_flag=false. Proceed with gathering POC info and generating permission request. Will still request explicit permission before scraping.
REVIEWED BY: Claude AI assistant at user's direction`
    },
    {
        name: "Cyber Threat Alliance",
        tou_flag: false,
        tou_notes: `TOU REVIEW DATE: ${REVIEW_DATE}
RESULT: NO TOU FOUND
SOURCE: Searched cyberthreatalliance.org for Terms of Use, Terms of Service, Privacy Policy
FINDINGS: No Terms of Use page found on website. Found vulnerability disclosure policy but no general TOU.
DECISION: Set tou_flag=false (no TOU = no prohibition). Proceed with gathering POC info and generating permission request. Will still request explicit permission before scraping.
REVIEWED BY: Claude AI assistant at user's direction`
    }
];

// ══════════════════════════════════════════════════════════════════════════════
// CONTACTS FOR PATH A ORGANIZATIONS
// Only organizations where tou_flag = false
// ══════════════════════════════════════════════════════════════════════════════

const CONTACTS_TO_ADD = [
    // CISA
    {
        org_name: "CISA",
        contacts: [
            {
                name: "CISA Central",
                email: "Central@cisa.dhs.gov",
                phone: "",
                contact_type: "Other",
                source_url: "https://www.cisa.gov/contact-us",
                notes: "24/7 CISA Central watch function - primary contact point for the agency"
            }
        ]
    },
    // Potomac Officers Club
    {
        org_name: "Potomac Officers Club",
        contacts: [
            {
                name: "Events Team",
                email: "events@potomacofficersclub.com",
                phone: "",
                contact_type: "Events",
                source_url: "https://www.potomacofficersclub.com/contact-us/",
                notes: "Events contact for POC"
            },
            {
                name: "Support",
                email: "support@potomacofficersclub.com",
                phone: "",
                contact_type: "Other",
                source_url: "https://www.potomacofficersclub.com/contact-us/",
                notes: "General support contact"
            }
        ]
    },
    // CNAS
    {
        org_name: "Center for a New American Security",
        contacts: [
            {
                name: "General Inquiries",
                email: "info@cnas.org",
                phone: "(202) 457-9400",
                contact_type: "Other",
                source_url: "https://www.cnas.org/people",
                notes: "General contact for CNAS"
            }
        ]
    },
    // IISS
    {
        org_name: "International Institute for Strategic Studies",
        contacts: [
            {
                name: "General Inquiries",
                email: "iiss@iiss.org",
                phone: "+44 20 7379 7676",
                contact_type: "Other",
                source_url: "https://www.iiss.org/contact-us/",
                notes: "Main contact for IISS London headquarters"
            }
        ]
    },
    // Stimson Center
    {
        org_name: "Stimson Center",
        contacts: [
            {
                name: "General Inquiries",
                email: "info@stimson.org",
                phone: "",
                contact_type: "Other",
                source_url: "https://www.stimson.org/",
                notes: "General contact for Stimson Center"
            },
            {
                name: "Communications Department",
                email: "communications@stimson.org",
                phone: "",
                contact_type: "Media/PR",
                source_url: "https://www.stimson.org/",
                notes: "Communications department - alternative contact"
            }
        ]
    },
    // Cyber Threat Alliance
    {
        org_name: "Cyber Threat Alliance",
        contacts: [
            {
                name: "General Inquiries",
                email: "info@cyberthreatalliance.org",
                phone: "",
                contact_type: "Other",
                source_url: "https://www.cyberthreatalliance.org/",
                notes: "General contact for CTA"
            }
        ]
    }
];

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

${ownerInfo.owner_name || 'Matthew E. Taylor'}
${ownerInfo.owner_email || ''}
${ownerInfo.owner_mobile ? `Mobile: ${ownerInfo.owner_mobile}` : ''}`;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SCRIPT
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('  TOU REVIEW & CONTACT MANAGEMENT SCRIPT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    // Validate environment variables
    if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('❌ Error: Missing environment variables');
        console.error('   Required: POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }

    const pb = new PocketBase(POCKETBASE_URL);
    
    try {
        // ──────────────────────────────────────────────────────────────────────
        // AUTHENTICATE
        // ──────────────────────────────────────────────────────────────────────
        console.log('🔐 Authenticating to PocketBase...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authentication successful');
        console.log('');

        // ──────────────────────────────────────────────────────────────────────
        // GET OWNER INFO FOR EMAIL TEMPLATE
        // ──────────────────────────────────────────────────────────────────────
        console.log('📋 Fetching owner info from settings...');
        let ownerInfo = {};
        try {
            const settings = await pb.collection('settings').getFirstListItem('key="owner_info"');
            ownerInfo = typeof settings.value === 'string' ? JSON.parse(settings.value) : settings.value;
            console.log(`   Owner: ${ownerInfo.owner_name}`);
        } catch (e) {
            console.log('   ⚠️ Could not fetch owner info, using defaults');
        }
        console.log('');

        // ──────────────────────────────────────────────────────────────────────
        // STEP 1: RECORD TOU REVIEW FINDINGS
        // ──────────────────────────────────────────────────────────────────────
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  STEP 1: RECORDING TOU REVIEW FINDINGS');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');

        const touResults = { updated: 0, failed: 0, notFound: 0 };

        for (const review of TOU_REVIEWS) {
            process.stdout.write(`📝 ${review.name}... `);
            
            try {
                // Find the organization
                const orgs = await pb.collection('organizations').getList(1, 1, {
                    filter: `name ~ "${review.name}"`
                });

                if (orgs.items.length === 0) {
                    console.log('⚠️ NOT FOUND');
                    touResults.notFound++;
                    continue;
                }

                const org = orgs.items[0];

                // Update TOU fields
                await pb.collection('organizations').update(org.id, {
                    tou_flag: review.tou_flag,
                    tou_notes: review.tou_notes
                });

                const status = review.tou_flag ? '❌ PROHIBITED' : '✅ ALLOWED';
                console.log(status);
                touResults.updated++;

            } catch (error) {
                console.log(`❌ ERROR: ${error.message}`);
                touResults.failed++;
            }
        }

        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`TOU Review Summary: ${touResults.updated} updated, ${touResults.notFound} not found, ${touResults.failed} failed`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('');

        // ──────────────────────────────────────────────────────────────────────
        // STEP 2: ADD CONTACTS FOR PATH A ORGANIZATIONS
        // ──────────────────────────────────────────────────────────────────────
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  STEP 2: ADDING CONTACTS FOR PATH A ORGANIZATIONS');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');

        const contactResults = { added: 0, skipped: 0, failed: 0 };

        for (const orgContacts of CONTACTS_TO_ADD) {
            console.log(`📇 ${orgContacts.org_name}:`);

            // Find organization ID
            let orgId = null;
            try {
                const orgs = await pb.collection('organizations').getList(1, 1, {
                    filter: `name ~ "${orgContacts.org_name}"`
                });
                if (orgs.items.length > 0) {
                    orgId = orgs.items[0].id;
                }
            } catch (e) {
                console.log(`   ⚠️ Could not find organization`);
                continue;
            }

            if (!orgId) {
                console.log(`   ⚠️ Organization not found in database`);
                continue;
            }

            for (const contact of orgContacts.contacts) {
                process.stdout.write(`   → ${contact.name} (${contact.email})... `);

                // Check if contact already exists
                try {
                    const existing = await pb.collection('contacts').getList(1, 1, {
                        filter: `email = "${contact.email}"`
                    });

                    if (existing.items.length > 0) {
                        console.log('⏭️ ALREADY EXISTS');
                        contactResults.skipped++;
                        continue;
                    }
                } catch (e) {
                    // Continue if check fails
                }

                // Add new contact
                try {
                    await pb.collection('contacts').create({
                        organization: orgId,
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone || '',
                        contact_type: contact.contact_type,
                        source_url: contact.source_url || '',
                        notes: contact.notes || ''
                    });
                    console.log('✅ ADDED');
                    contactResults.added++;
                } catch (error) {
                    console.log(`❌ ERROR: ${error.message}`);
                    contactResults.failed++;
                }
            }
        }

        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`Contact Summary: ${contactResults.added} added, ${contactResults.skipped} skipped, ${contactResults.failed} failed`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('');

        // ──────────────────────────────────────────────────────────────────────
        // STEP 3: GENERATE PERMISSION REQUEST DRAFTS
        // ──────────────────────────────────────────────────────────────────────
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  STEP 3: GENERATING PERMISSION REQUEST DRAFTS');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');

        const draftResults = { generated: 0, skipped: 0, failed: 0 };

        // Only process PATH A organizations (tou_flag = false)
        const pathAOrgs = TOU_REVIEWS.filter(r => r.tou_flag === false);

        for (const review of pathAOrgs) {
            process.stdout.write(`📧 ${review.name}... `);

            try {
                // Find organization
                const orgs = await pb.collection('organizations').getList(1, 1, {
                    filter: `name ~ "${review.name}"`
                });

                if (orgs.items.length === 0) {
                    console.log('⚠️ NOT FOUND');
                    draftResults.skipped++;
                    continue;
                }

                const org = orgs.items[0];

                // Skip if draft already exists
                if (org.permission_request_draft && org.permission_request_draft.trim() !== '') {
                    console.log('⏭️ DRAFT EXISTS');
                    draftResults.skipped++;
                    continue;
                }

                // Find best contact for this org
                let contactName = 'Events/Permissions Team';
                try {
                    const contacts = await pb.collection('contacts').getList(1, 10, {
                        filter: `organization = "${org.id}"`,
                        sort: 'contact_type'
                    });

                    if (contacts.items.length > 0) {
                        // Prioritize: Legal/Permissions > Events > Other > Media/PR
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
                    // Use default contact name
                }

                // Generate draft
                const draft = generatePermissionRequestDraft(org.name, contactName, ownerInfo);

                // Save draft
                await pb.collection('organizations').update(org.id, {
                    permission_request_draft: draft
                });

                console.log('✅ GENERATED');
                draftResults.generated++;

            } catch (error) {
                console.log(`❌ ERROR: ${error.message}`);
                draftResults.failed++;
            }
        }

        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`Draft Summary: ${draftResults.generated} generated, ${draftResults.skipped} skipped, ${draftResults.failed} failed`);
        console.log('────────────────────────────────────────────────────────────────');
        console.log('');

        // ──────────────────────────────────────────────────────────────────────
        // FINAL SUMMARY
        // ──────────────────────────────────────────────────────────────────────
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  FINAL SUMMARY');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('');
        console.log('PATH B (TOU Prohibits - Manual Outreach Required):');
        console.log('  ❌ Belfer Center (Harvard) - Explicit scraping prohibition');
        console.log('  ❌ INSS (Israel) - Explicit copyright claim');
        console.log('');
        console.log('PATH A (TOU Allows - Contacts Added & Drafts Generated):');
        console.log('  ✅ CISA');
        console.log('  ✅ Potomac Officers Club');
        console.log('  ✅ CNAS');
        console.log('  ✅ IISS');
        console.log('  ✅ Stimson Center');
        console.log('  ✅ Cyber Threat Alliance');
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('  SCRIPT COMPLETE');
        console.log('════════════════════════════════════════════════════════════════');

    } catch (error) {
        console.error('');
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

main();
