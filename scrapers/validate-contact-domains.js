/**
 * validate-contact-domains.js
 * 
 * PURPOSE: Scan all contacts and validate that email domains match their linked organization's website domain.
 * 
 * WHAT IT DOES:
 *   - Fetches all contacts with email addresses from PocketBase
 *   - For each contact, compares email domain to organization website domain
 *   - Reports mismatches (contacts where email domain ≠ org domain)
 *   - Identifies personal email addresses (Gmail, Outlook, etc.)
 *   - DRY RUN by default (no database changes)
 * 
 * USAGE:
 *   node scrapers/validate-contact-domains.js              # Report only (default)
 *   node scrapers/validate-contact-domains.js --dry-run    # Same as above
 *   node scrapers/validate-contact-domains.js --flag       # Flag mismatches in DB (sets domain_mismatch = true)
 * 
 * OUTPUT:
 *   - Summary of all contacts checked
 *   - List of domain mismatches
 *   - List of personal email addresses
 *   - Contacts with missing org website
 * 
 * SECURITY: This script is READ-ONLY by default. Does NOT scrape any websites.
 */

require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// Personal email domains to flag separately
const PERSONAL_EMAIL_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'protonmail.com',
    'proton.me',
    'live.com',
    'msn.com',
    'comcast.net',
    'verizon.net',
    'att.net'
];

// ════════════════════════════════════════════════════════════════════════════════
// DOMAIN EXTRACTION UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Extract domain from email address
 * @param {string} email - Email address (e.g., "john@csis.org")
 * @returns {string|null} - Domain (e.g., "csis.org") or null if invalid
 */
function extractDomainFromEmail(email) {
    if (!email || typeof email !== 'string') return null;
    
    const parts = email.toLowerCase().trim().split('@');
    if (parts.length !== 2) return null;
    
    return parts[1];
}

/**
 * Extract domain from website URL
 * @param {string} url - Website URL (e.g., "https://www.csis.org/events")
 * @returns {string|null} - Domain (e.g., "csis.org") or null if invalid
 */
function extractDomainFromUrl(url) {
    if (!url || typeof url !== 'string') return null;
    
    try {
        // Add protocol if missing
        let cleanUrl = url.toLowerCase().trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        
        const urlObj = new URL(cleanUrl);
        let hostname = urlObj.hostname;
        
        // Remove www. prefix
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }
        
        return hostname;
    } catch (e) {
        return null;
    }
}

/**
 * Normalize domain for comparison (handles subdomains)
 * @param {string} domain - Domain to normalize
 * @returns {string} - Base domain (e.g., "events.csis.org" → "csis.org")
 */
function getBaseDomain(domain) {
    if (!domain) return null;
    
    const parts = domain.split('.');
    
    // Handle special cases like .co.uk, .org.uk, etc.
    const specialTlds = ['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'org.au', 'edu.au'];
    for (const tld of specialTlds) {
        if (domain.endsWith('.' + tld)) {
            // Return last 3 parts (e.g., "example.co.uk")
            return parts.slice(-3).join('.');
        }
    }
    
    // Standard case: return last 2 parts (e.g., "csis.org")
    if (parts.length >= 2) {
        return parts.slice(-2).join('.');
    }
    
    return domain;
}

/**
 * Check if two domains match (handles subdomains)
 * @param {string} emailDomain - Domain from email
 * @param {string} orgDomain - Domain from org website
 * @returns {boolean} - True if domains match
 */
function doDomainsMatch(emailDomain, orgDomain) {
    if (!emailDomain || !orgDomain) return false;
    
    const baseEmailDomain = getBaseDomain(emailDomain);
    const baseOrgDomain = getBaseDomain(orgDomain);
    
    return baseEmailDomain === baseOrgDomain;
}

/**
 * Check if email domain is a personal email provider
 * @param {string} emailDomain - Domain from email
 * @returns {boolean} - True if personal email
 */
function isPersonalEmail(emailDomain) {
    if (!emailDomain) return false;
    return PERSONAL_EMAIL_DOMAINS.includes(emailDomain.toLowerCase());
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION LOGIC
// ════════════════════════════════════════════════════════════════════════════════

async function validateContactDomains(flagMismatches = false) {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 CONTACT DOMAIN VALIDATION');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`⚙️  Mode: ${flagMismatches ? '🔧 FLAG MISMATCHES (will update DB)' : '👁️  DRY RUN (report only)'}`);
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
        
        // Tracking arrays
        const results = {
            valid: [],           // Email domain matches org domain
            mismatched: [],      // Email domain ≠ org domain
            personalEmail: [],   // Gmail, Yahoo, etc.
            noEmail: [],         // Contact has no email
            noOrgWebsite: [],    // Org has no website to compare against
            noOrg: []            // Contact not linked to any org
        };
        
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🔍 ANALYZING CONTACTS...');
        console.log('────────────────────────────────────────────────────────────────');
        
        for (const contact of contacts) {
            const org = contact.expand?.organization;
            
            // Check for missing org
            if (!org) {
                results.noOrg.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    email: contact.email
                });
                continue;
            }
            
            // Check for missing email
            if (!contact.email) {
                results.noEmail.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    org_name: org.name
                });
                continue;
            }
            
            // Check for missing org website
            if (!org.website) {
                results.noOrgWebsite.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    email: contact.email,
                    org_id: org.id,
                    org_name: org.name
                });
                continue;
            }
            
            // Extract domains
            const emailDomain = extractDomainFromEmail(contact.email);
            const orgDomain = extractDomainFromUrl(org.website);
            
            // Check for personal email
            if (isPersonalEmail(emailDomain)) {
                results.personalEmail.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    email: contact.email,
                    email_domain: emailDomain,
                    org_id: org.id,
                    org_name: org.name,
                    org_website: org.website
                });
                continue;
            }
            
            // Compare domains
            if (doDomainsMatch(emailDomain, orgDomain)) {
                results.valid.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    email: contact.email,
                    org_name: org.name
                });
            } else {
                results.mismatched.push({
                    contact_id: contact.id,
                    contact_name: contact.name,
                    email: contact.email,
                    email_domain: emailDomain,
                    org_id: org.id,
                    org_name: org.name,
                    org_website: org.website,
                    org_domain: orgDomain
                });
            }
        }
        
        // ════════════════════════════════════════════════════════════════════════
        // REPORT RESULTS
        // ════════════════════════════════════════════════════════════════════════
        
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`✅ Valid (domain matches):      ${results.valid.length}`);
        console.log(`❌ Mismatched domains:          ${results.mismatched.length}`);
        console.log(`📧 Personal emails:             ${results.personalEmail.length}`);
        console.log(`⚠️  No email address:            ${results.noEmail.length}`);
        console.log(`⚠️  Org has no website:          ${results.noOrgWebsite.length}`);
        console.log(`⚠️  Contact has no linked org:   ${results.noOrg.length}`);
        console.log('');
        
        // Detail: Mismatched domains
        if (results.mismatched.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('❌ DOMAIN MISMATCHES (email domain ≠ org domain)');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.mismatched) {
                console.log(`   📌 ${item.contact_name}`);
                console.log(`      Email:      ${item.email} → domain: ${item.email_domain}`);
                console.log(`      Org:        ${item.org_name}`);
                console.log(`      Org Domain: ${item.org_domain} (from ${item.org_website})`);
                console.log(`      Contact ID: ${item.contact_id}`);
                console.log('');
            }
        }
        
        // Detail: Personal emails
        if (results.personalEmail.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('📧 PERSONAL EMAIL ADDRESSES (Gmail, Yahoo, etc.)');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.personalEmail) {
                console.log(`   📌 ${item.contact_name}`);
                console.log(`      Email: ${item.email} (${item.email_domain})`);
                console.log(`      Org:   ${item.org_name}`);
                console.log('');
            }
        }
        
        // Detail: No org website
        if (results.noOrgWebsite.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('⚠️  CANNOT VALIDATE - ORG HAS NO WEBSITE');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.noOrgWebsite) {
                console.log(`   📌 ${item.contact_name} (${item.email})`);
                console.log(`      Org: ${item.org_name} - NO WEBSITE SET`);
                console.log('');
            }
        }
        
        // Detail: No linked org
        if (results.noOrg.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('⚠️  ORPHAN CONTACTS - NO LINKED ORGANIZATION');
            console.log('────────────────────────────────────────────────────────────────');
            for (const item of results.noOrg) {
                console.log(`   📌 ${item.contact_name} (${item.email || 'no email'})`);
                console.log(`      Contact ID: ${item.contact_id}`);
                console.log('');
            }
        }
        
        // ════════════════════════════════════════════════════════════════════════
        // FLAG MISMATCHES (if --flag option used)
        // ════════════════════════════════════════════════════════════════════════
        
        if (flagMismatches && results.mismatched.length > 0) {
            console.log('────────────────────────────────────────────────────────────────');
            console.log('🔧 FLAGGING MISMATCHED CONTACTS IN DATABASE...');
            console.log('────────────────────────────────────────────────────────────────');
            
            let flaggedCount = 0;
            for (const item of results.mismatched) {
                try {
                    // Note: This requires a 'domain_mismatch' boolean field in contacts collection
                    // If field doesn't exist, this will fail - that's intentional (fail-safe)
                    await pb.collection('contacts').update(item.contact_id, {
                        notes: `[DOMAIN MISMATCH] Email domain (${item.email_domain}) does not match org domain (${item.org_domain}). ${contact.notes || ''}`
                    });
                    console.log(`   ✅ Flagged: ${item.contact_name} (${item.email})`);
                    flaggedCount++;
                } catch (err) {
                    console.log(`   ❌ Failed to flag: ${item.contact_name} - ${err.message}`);
                }
            }
            console.log('');
            console.log(`💾 Flagged ${flaggedCount} of ${results.mismatched.length} mismatched contacts`);
        }
        
        console.log('');
        console.log('════════════════════════════════════════════════════════════════');
        console.log('✅ VALIDATION COMPLETE');
        console.log('════════════════════════════════════════════════════════════════');
        
        if (!flagMismatches && results.mismatched.length > 0) {
            console.log('');
            console.log('💡 To flag mismatched contacts in the database, run:');
            console.log('   node scrapers/validate-contact-domains.js --flag');
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
const flagMismatches = args.includes('--flag');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
    console.log('');
    console.log('validate-contact-domains.js');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('Validate that contact email domains match their organization website domains.');
    console.log('');
    console.log('USAGE:');
    console.log('  node scrapers/validate-contact-domains.js              # Report only (default)');
    console.log('  node scrapers/validate-contact-domains.js --dry-run    # Same as above');
    console.log('  node scrapers/validate-contact-domains.js --flag       # Flag mismatches in DB');
    console.log('  node scrapers/validate-contact-domains.js --help       # Show this help');
    console.log('');
    console.log('🔒 SECURITY: This script does NOT scrape any websites.');
    console.log('');
    process.exit(0);
}

validateContactDomains(flagMismatches);
