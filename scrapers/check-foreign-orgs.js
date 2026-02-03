/**
 * check-foreign-orgs.js
 * 
 * ONE-TIME SCRIPT: Foreign Organization Detection for Existing Orgs
 * 
 * This script scans all existing nominated/approved organizations to identify
 * foreign organizations that should be marked as "Rejected by Mission".
 * 
 * WHAT IT DOES:
 * 1. Fetches all organizations NOT already "Rejected by Mission"
 * 2. For each org, performs Google Search + AI analysis to determine location
 * 3. Updates database with:
 *    - foreign_org_flag (Bool)
 *    - headquarters_country (Plain Text)
 *    - location_check_notes (Plain Text)
 * 4. Auto-changes status to "Rejected by Mission" for confirmed foreign orgs
 * 5. Creates scan_log entries for audit trail
 * 
 * USAGE:
 *   node scrapers/check-foreign-orgs.js              # Process all eligible orgs
 *   node scrapers/check-foreign-orgs.js --dry-run    # Preview without changes
 *   node scrapers/check-foreign-orgs.js --limit 5    # Process only 5 orgs
 *   node scrapers/check-foreign-orgs.js --org "Name" # Check specific org
 * 
 * PREREQUISITES:
 *   - GOOGLE_SEARCH_API_KEY in .env
 *   - GOOGLE_SEARCH_ENGINE_ID in .env
 *   - OPENAI_API_KEY in .env
 *   - POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD in .env
 * 
 * Created: 2026-02-03
 * Author: Claude (AI Assistant)
 */

require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// Rate limiting
const DELAY_BETWEEN_ORGS_MS = 3000;  // 3 seconds between orgs
const DELAY_BETWEEN_SEARCHES_MS = 1500;  // 1.5 seconds between Google searches

// Module-level auth token
let authToken = null;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const fetch = (await import('node-fetch')).default;
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🌍 FOREIGN ORGANIZATION DETECTION SCRIPT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Parse arguments
    // ─────────────────────────────────────────────────────────────────────────
    
    const args = parseArgs();
    
    if (args.help) {
        showHelp();
        return;
    }
    
    if (args.dryRun) {
        console.log('📋 DRY RUN MODE - No changes will be made');
        console.log('');
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Validate environment
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('🔐 Validating environment...');
    
    const missing = [];
    if (!POCKETBASE_URL) missing.push('POCKETBASE_URL');
    if (!POCKETBASE_ADMIN_EMAIL) missing.push('POCKETBASE_ADMIN_EMAIL');
    if (!POCKETBASE_ADMIN_PASSWORD) missing.push('POCKETBASE_ADMIN_PASSWORD');
    if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
    if (!GOOGLE_SEARCH_API_KEY) missing.push('GOOGLE_SEARCH_API_KEY');
    if (!GOOGLE_SEARCH_ENGINE_ID) missing.push('GOOGLE_SEARCH_ENGINE_ID');
    
    if (missing.length > 0) {
        console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
    console.log('   ✅ All environment variables present');
    
    // ─────────────────────────────────────────────────────────────────────────
    // Authenticate
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('🔐 Authenticating with PocketBase...');
    
    try {
        const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identity: POCKETBASE_ADMIN_EMAIL,
                password: POCKETBASE_ADMIN_PASSWORD
            })
        });
        
        if (!authResponse.ok) {
            throw new Error('Authentication failed');
        }
        
        const authData = await authResponse.json();
        authToken = authData.token;
        console.log('   ✅ Authenticated successfully');
    } catch (error) {
        console.error(`   ❌ Authentication failed: ${error.message}`);
        process.exit(1);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Fetch organizations to check
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📥 Fetching organizations to check...');
    console.log('────────────────────────────────────────────────────────────────');
    
    let organizations = [];
    
    if (args.org) {
        // Check specific org
        console.log(`   🔍 Looking for org: "${args.org}"`);
        const org = await fetchOrgByName(fetch, args.org);
        if (org) {
            organizations = [org];
            console.log(`   ✅ Found: ${org.name}`);
        } else {
            console.log(`   ❌ Organization not found: "${args.org}"`);
            process.exit(1);
        }
    } else {
        // Fetch all eligible orgs (not already rejected by mission, not already checked)
        const filter = 'status != "Rejected by Mission"';
        organizations = await fetchAllOrganizations(fetch, filter);
        
        // Filter out orgs that already have foreign_org_flag set (already checked)
        // Unless --force flag is used
        if (!args.force) {
            const beforeCount = organizations.length;
            organizations = organizations.filter(org => 
                org.foreign_org_flag === null || 
                org.foreign_org_flag === undefined ||
                org.foreign_org_flag === ''
            );
            const skipped = beforeCount - organizations.length;
            if (skipped > 0) {
                console.log(`   ⏭️ Skipping ${skipped} orgs already checked (use --force to re-check)`);
            }
        }
    }
    
    console.log(`   ✅ Found ${organizations.length} organizations to check`);
    
    if (organizations.length === 0) {
        console.log('');
        console.log('ℹ️ No organizations to check. Exiting.');
        return;
    }
    
    // Apply limit if specified
    if (args.limit && args.limit < organizations.length) {
        organizations = organizations.slice(0, args.limit);
        console.log(`   📊 Limited to ${args.limit} organizations`);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Process each organization
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 PROCESSING ORGANIZATIONS');
    console.log('════════════════════════════════════════════════════════════════');
    
    const stats = {
        total: organizations.length,
        usOrgs: 0,
        foreignOrgs: 0,
        needsReview: 0,
        errors: 0,
        statusChanges: 0
    };
    
    const foreignOrgsList = [];
    const needsReviewList = [];
    
    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];
        const progress = `[${i + 1}/${organizations.length}]`;
        
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log(`${progress} Checking: ${org.name}`);
        console.log(`    🌐 Website: ${org.website || 'N/A'}`);
        console.log(`    📋 Status: ${org.status}`);
        console.log('────────────────────────────────────────────────────────────────');
        
        try {
            const locationResult = await checkOrgLocation(fetch, org.name, org.website);
            
            // Log results
            if (locationResult.isForeign) {
                console.log(`   🌍 FOREIGN: ${locationResult.headquartersCountry}`);
                console.log(`   📊 Confidence: ${locationResult.confidence}`);
                console.log(`   📝 Reasoning: ${locationResult.notes}`);
                stats.foreignOrgs++;
                foreignOrgsList.push({
                    name: org.name,
                    country: locationResult.headquartersCountry,
                    confidence: locationResult.confidence
                });
                
                // Update database
                if (!args.dryRun) {
                    const updates = {
                        foreign_org_flag: true,
                        headquarters_country: locationResult.headquartersCountry,
                        location_check_notes: locationResult.notes
                    };
                    
                    // Auto-reject to "Rejected by Mission" if high/medium confidence
                    if (locationResult.confidence !== 'low' && !locationResult.needsHumanReview) {
                        updates.status = 'Rejected by Mission';
                        stats.statusChanges++;
                        console.log(`   🔄 Status changed to: Rejected by Mission`);
                    }
                    
                    await updateOrganization(fetch, org.id, updates);
                    await createScanLog(fetch, org.id, 'location-check', locationResult);
                    console.log(`   ✅ Database updated`);
                } else {
                    console.log(`   📋 [DRY RUN] Would update database and change status`);
                }
                
            } else if (locationResult.needsHumanReview) {
                console.log(`   ❓ UNCERTAIN - Needs human review`);
                console.log(`   📊 Country: ${locationResult.headquartersCountry || 'Unknown'}`);
                console.log(`   📝 Notes: ${locationResult.notes}`);
                stats.needsReview++;
                needsReviewList.push({
                    name: org.name,
                    country: locationResult.headquartersCountry,
                    notes: locationResult.notes
                });
                
                // Update database with flag for review (but don't change status)
                if (!args.dryRun) {
                    const updates = {
                        foreign_org_flag: false,  // Default to US (innocent until proven guilty)
                        headquarters_country: locationResult.headquartersCountry || 'Needs Review',
                        location_check_notes: `NEEDS HUMAN REVIEW: ${locationResult.notes}`
                    };
                    
                    await updateOrganization(fetch, org.id, updates);
                    await createScanLog(fetch, org.id, 'location-check', locationResult);
                    console.log(`   ✅ Database updated (flagged for review)`);
                }
                
            } else {
                console.log(`   🇺🇸 US-BASED: ${locationResult.headquartersCountry || 'United States'}`);
                console.log(`   📊 Confidence: ${locationResult.confidence}`);
                stats.usOrgs++;
                
                // Update database
                if (!args.dryRun) {
                    const updates = {
                        foreign_org_flag: false,
                        headquarters_country: locationResult.headquartersCountry || 'United States',
                        location_check_notes: locationResult.notes
                    };
                    
                    await updateOrganization(fetch, org.id, updates);
                    await createScanLog(fetch, org.id, 'location-check', locationResult);
                    console.log(`   ✅ Database updated`);
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            stats.errors++;
        }
        
        // Rate limiting between organizations
        if (i < organizations.length - 1) {
            console.log(`   ⏳ Waiting ${DELAY_BETWEEN_ORGS_MS / 1000}s before next org...`);
            await sleep(DELAY_BETWEEN_ORGS_MS);
        }
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Total checked: ${stats.total}`);
    console.log(`   🇺🇸 US-based: ${stats.usOrgs}`);
    console.log(`   🌍 Foreign: ${stats.foreignOrgs}`);
    console.log(`   ❓ Needs review: ${stats.needsReview}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    console.log(`   🔄 Status changes: ${stats.statusChanges}`);
    
    if (foreignOrgsList.length > 0) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('🌍 FOREIGN ORGANIZATIONS DETECTED:');
        console.log('────────────────────────────────────────────────────────────────');
        for (const org of foreignOrgsList) {
            console.log(`   • ${org.name} (${org.country}) [${org.confidence}]`);
        }
    }
    
    if (needsReviewList.length > 0) {
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('❓ ORGANIZATIONS NEEDING HUMAN REVIEW:');
        console.log('────────────────────────────────────────────────────────────────');
        for (const org of needsReviewList) {
            console.log(`   • ${org.name} - ${org.notes.substring(0, 80)}...`);
        }
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ Foreign organization check completed!');
    console.log('════════════════════════════════════════════════════════════════');
    
    if (args.dryRun) {
        console.log('');
        console.log('📋 This was a DRY RUN. No changes were made.');
        console.log('   Run without --dry-run to apply changes.');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION CHECK FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if an organization is US-based or foreign
 */
async function checkOrgLocation(fetch, orgName, website) {
    const result = {
        isForeign: false,
        confidence: 'unknown',
        headquartersCountry: '',
        notes: '',
        needsHumanReview: false
    };
    
    try {
        // Step 1: Google Search for location info
        console.log(`   🔍 Searching for location info...`);
        
        const searchQueries = [
            `"${orgName}" headquarters location country`,
            `"${orgName}" based in`
        ];
        
        let searchSnippets = [];
        
        for (const query of searchQueries) {
            try {
                const url = new URL('https://www.googleapis.com/customsearch/v1');
                url.searchParams.set('key', GOOGLE_SEARCH_API_KEY);
                url.searchParams.set('cx', GOOGLE_SEARCH_ENGINE_ID);
                url.searchParams.set('q', query);
                url.searchParams.set('num', '5');
                
                const response = await fetch(url.toString());
                
                if (response.ok) {
                    const data = await response.json();
                    const items = data.items || [];
                    
                    for (const item of items.slice(0, 3)) {
                        searchSnippets.push({
                            title: item.title || '',
                            snippet: item.snippet || '',
                            url: item.link || ''
                        });
                    }
                }
                
                await sleep(DELAY_BETWEEN_SEARCHES_MS);
                
            } catch (searchError) {
                console.log(`   ⚠️ Search error: ${searchError.message}`);
            }
        }
        
        if (searchSnippets.length === 0) {
            result.notes = 'No search results found for location verification';
            result.needsHumanReview = true;
            return result;
        }
        
        console.log(`   📄 Found ${searchSnippets.length} search results`);
        
        // Step 2: AI Analysis
        console.log(`   🤖 Analyzing with AI...`);
        
        const snippetText = searchSnippets.map((s, i) => 
            `[${i + 1}] ${s.title}\n${s.snippet}`
        ).join('\n\n');
        
        const prompt = `Analyze if this organization is US-based or foreign.

ORGANIZATION: ${orgName}
WEBSITE: ${website || 'N/A'}

SEARCH RESULTS:
${snippetText}

RULES:
- Foreign governments/agencies = FOREIGN
- Non-US headquartered organizations = FOREIGN
- US subsidiaries of foreign parent companies = FOREIGN
- International orgs (NATO, UN) headquartered outside US = FOREIGN
- If uncertain, default to US but flag for review

RESPOND IN THIS EXACT JSON FORMAT ONLY:
{
  "isForeign": true/false,
  "country": "Country name",
  "confidence": "high/medium/low",
  "reasoning": "Brief explanation",
  "needsHumanReview": true/false
}`;

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Respond only with valid JSON. No markdown.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 500
            })
        });
        
        if (!aiResponse.ok) {
            throw new Error(`AI API error: ${aiResponse.status}`);
        }
        
        const aiData = await aiResponse.json();
        let content = aiData.choices[0].message.content.trim();
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const aiResult = JSON.parse(content);
        
        result.isForeign = aiResult.isForeign === true;
        result.headquartersCountry = aiResult.country || 'Unknown';
        result.confidence = aiResult.confidence || 'low';
        result.notes = aiResult.reasoning || '';
        result.needsHumanReview = aiResult.needsHumanReview === true;
        
    } catch (error) {
        result.notes = `Location check error: ${error.message}`;
        result.needsHumanReview = true;
    }
    
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchAllOrganizations(fetch, filter) {
    const url = new URL(`${POCKETBASE_URL}/api/collections/organizations/records`);
    url.searchParams.set('perPage', '500');
    if (filter) {
        url.searchParams.set('filter', filter);
    }
    
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch organizations');
    }
    
    const data = await response.json();
    return data.items || [];
}

async function fetchOrgByName(fetch, name) {
    const url = new URL(`${POCKETBASE_URL}/api/collections/organizations/records`);
    url.searchParams.set('filter', `name ~ "${name}"`);
    
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
        return null;
    }
    
    const data = await response.json();
    return data.items && data.items.length > 0 ? data.items[0] : null;
}

async function updateOrganization(fetch, orgId, updates) {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records/${orgId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updates)
        }
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Update failed: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
}

async function createScanLog(fetch, orgId, scanType, result) {
    const logEntry = {
        organization: orgId,
        scan_type: scanType,
        scan_date: new Date().toISOString(),
        full_log: JSON.stringify({
            isForeign: result.isForeign,
            country: result.headquartersCountry,
            confidence: result.confidence,
            notes: result.notes,
            needsReview: result.needsHumanReview
        })
    };
    
    try {
        await fetch(
            `${POCKETBASE_URL}/api/collections/scan_logs/records`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(logEntry)
            }
        );
    } catch (error) {
        console.log(`   ⚠️ Failed to create scan log: ${error.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        dryRun: false,
        limit: null,
        org: null,
        force: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--limit':
                options.limit = parseInt(args[++i], 10);
                break;
            case '--org':
                options.org = args[++i];
                break;
            case '--force':
                options.force = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
════════════════════════════════════════════════════════════════
🌍 FOREIGN ORGANIZATION DETECTION SCRIPT
════════════════════════════════════════════════════════════════

USAGE:
  node scrapers/check-foreign-orgs.js [options]

OPTIONS:
  --dry-run       Preview changes without modifying database
  --limit N       Process only N organizations
  --org "Name"    Check a specific organization by name
  --force         Re-check orgs that were already checked
  --help, -h      Show this help

EXAMPLES:
  # Preview what would happen (no changes)
  node scrapers/check-foreign-orgs.js --dry-run

  # Check only 5 organizations
  node scrapers/check-foreign-orgs.js --limit 5

  # Check a specific organization
  node scrapers/check-foreign-orgs.js --org "NATO"

  # Re-check all orgs (including previously checked)
  node scrapers/check-foreign-orgs.js --force

WHAT IT CHECKS:
  - Searches Google for organization headquarters location
  - Uses AI to analyze search results
  - Identifies foreign organizations (non-US headquartered)
  - Auto-rejects foreign orgs to "Rejected by Mission" status

WHAT COUNTS AS FOREIGN:
  - Foreign governments and agencies
  - Organizations headquartered outside the US
  - US subsidiaries of foreign parent companies
  - International organizations (NATO, UN, etc.)

════════════════════════════════════════════════════════════════
`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
