/**
 * scrapers/scan-organization.js
 * 
 * CLI WRAPPER FOR ORGANIZATION SCANNING
 * 
 * Manual tool to scan individual organizations for:
 * - TOU restrictions
 * - Technical blocks (403/401)
 * - Events URL discovery
 * - POC info gathering
 * - AI analysis
 * 
 * Usage:
 *   node scrapers/scan-organization.js --org "CNAS"
 *   node scrapers/scan-organization.js --domain "cnas.org"
 *   node scrapers/scan-organization.js --org "CNAS" --no-update
 *   node scrapers/scan-organization.js --help
 * 
 * Options:
 *   --org <name>       Organization name (searches database)
 *   --domain <domain>  Domain to scan (e.g., cnas.org)
 *   --no-update        Scan only, don't update database
 *   --skip-tou         Skip TOU scanning
 *   --skip-events      Skip events URL discovery
 *   --skip-ai          Skip AI analysis
 *   --help             Show this help message
 * 
 * Last Updated: 2026-01-14
 */

require('dotenv').config();
const scanner = require('./org-scanner');

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        orgName: null,
        domain: null,
        updateDb: true,
        skipTOU: false,
        skipEventsUrl: false,
        skipAI: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--org':
            case '-o':
                options.orgName = args[++i];
                break;
            case '--domain':
            case '-d':
                options.domain = args[++i];
                break;
            case '--no-update':
            case '-n':
                options.updateDb = false;
                break;
            case '--skip-tou':
                options.skipTOU = true;
                break;
            case '--skip-events':
                options.skipEventsUrl = true;
                break;
            case '--skip-ai':
                options.skipAI = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
            default:
                // If no flag prefix, treat as org name
                if (!arg.startsWith('-') && !options.orgName && !options.domain) {
                    options.orgName = arg;
                }
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
════════════════════════════════════════════════════════════════
🔍 ORGANIZATION SCANNER - CLI Tool
════════════════════════════════════════════════════════════════

DESCRIPTION:
  Scans an organization for TOU restrictions, technical blocks,
  events URL, POC info, and performs AI analysis.

USAGE:
  node scrapers/scan-organization.js --org "CNAS"
  node scrapers/scan-organization.js --domain "cnas.org"
  node scrapers/scan-organization.js --org "CNAS" --no-update

OPTIONS:
  --org, -o <name>     Organization name (searches PocketBase)
  --domain, -d <url>   Domain to scan directly (e.g., cnas.org)
  --no-update, -n      Scan only, don't update database
  --skip-tou           Skip TOU page scanning
  --skip-events        Skip events URL discovery
  --skip-ai            Skip AI analysis
  --help, -h           Show this help message

EXAMPLES:
  # Scan CNAS by name and update database
  node scrapers/scan-organization.js --org "CNAS"

  # Scan by domain without updating database
  node scrapers/scan-organization.js --domain "brookings.edu" --no-update

  # Quick scan (skip AI to save API calls)
  node scrapers/scan-organization.js --org "RAND" --skip-ai

  # Scan new domain not in database
  node scrapers/scan-organization.js --domain "neworg.org" --no-update

OUTPUT:
  The scanner will display:
  ✅ Homepage fetch status
  ⚠️ TOU restrictions found (if any)
  ⛔ Technical blocks (403/401 errors)
  📅 Events URL discovered
  👤 POC contact info
  🤖 AI-extracted org name and summary

════════════════════════════════════════════════════════════════
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();
    
    // Show help if requested
    if (options.help) {
        showHelp();
        process.exit(0);
    }
    
    // Validate input
    if (!options.orgName && !options.domain) {
        console.log('');
        console.log('❌ ERROR: You must specify either --org or --domain');
        console.log('');
        console.log('   Examples:');
        console.log('   node scrapers/scan-organization.js --org "CNAS"');
        console.log('   node scrapers/scan-organization.js --domain "cnas.org"');
        console.log('');
        console.log('   Run with --help for more options');
        console.log('');
        process.exit(1);
    }
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 ORGANIZATION SCANNER');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');
    
    // Initialize scanner
    console.log('⏳ Initializing scanner...');
    await scanner.init();
    console.log('   ✅ Scanner initialized');
    console.log('');
    
    let org = null;
    
    // ───────────────────────────────────────────────────────────────────────────
    // Find or create organization object
    // ───────────────────────────────────────────────────────────────────────────
    
    if (options.orgName) {
        // Search by name in database
        console.log(`📡 Searching for organization: "${options.orgName}"...`);
        
        org = await scanner.getOrganizationByName(options.orgName);
        
        if (org) {
            console.log(`   ✅ Found: ${org.name} (ID: ${org.id})`);
            console.log(`   📍 Website: ${org.website || 'N/A'}`);
            console.log(`   📍 Source ID: ${org.source_id || 'N/A'}`);
            console.log(`   📍 Status: ${org.status || 'N/A'}`);
        } else {
            console.log(`   ❌ Organization "${options.orgName}" not found in database`);
            console.log('');
            console.log('   💡 Tips:');
            console.log('      • Check spelling');
            console.log('      • Try partial name (e.g., "CNAS" instead of "Center for a New American Security")');
            console.log('      • Use --domain to scan by domain instead');
            console.log('');
            process.exit(1);
        }
    } else if (options.domain) {
        // Create temporary org object for domain scan
        const domain = options.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        
        console.log(`📡 Preparing to scan domain: ${domain}`);
        
        // Check if domain exists in database
        const existingOrg = await scanner.getOrganizationByName(domain);
        
        if (existingOrg) {
            console.log(`   ℹ️ Domain exists in database: ${existingOrg.name}`);
            org = existingOrg;
        } else {
            console.log(`   ℹ️ Domain not in database - creating temporary scan object`);
            org = {
                id: null,  // No ID = won't update database
                name: domain,
                website: `https://${domain}`,
                source_id: domain
            };
            
            // Force no-update for domains not in database
            if (options.updateDb) {
                console.log(`   ⚠️ Cannot update database for unknown domain`);
                console.log(`   ℹ️ Add organization to database first, or use --no-update`);
                options.updateDb = false;
            }
        }
    }
    
    console.log('');
    
    // ───────────────────────────────────────────────────────────────────────────
    // Display scan configuration
    // ───────────────────────────────────────────────────────────────────────────
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📋 SCAN CONFIGURATION');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`   Organization: ${org.name}`);
    console.log(`   Website: ${org.website || `https://${org.source_id}`}`);
    console.log(`   Update Database: ${options.updateDb ? '✅ Yes' : '❌ No (scan only)'}`);
    console.log(`   TOU Scan: ${options.skipTOU ? '⏭️ Skipped' : '✅ Enabled'}`);
    console.log(`   Events URL Discovery: ${options.skipEventsUrl ? '⏭️ Skipped' : '✅ Enabled'}`);
    console.log(`   AI Analysis: ${options.skipAI ? '⏭️ Skipped' : '✅ Enabled'}`);
    console.log('');
    
    // ───────────────────────────────────────────────────────────────────────────
    // Run the scan
    // ───────────────────────────────────────────────────────────────────────────
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('🚀 STARTING SCAN');
    console.log('────────────────────────────────────────────────────────────────');
    
    try {
        const result = await scanner.scanOrganization(org, {
            updateDb: options.updateDb && org.id,  // Only update if we have an ID
            skipTOU: options.skipTOU,
            skipEventsUrl: options.skipEventsUrl,
            skipAI: options.skipAI
        });
        
        // ───────────────────────────────────────────────────────────────────────
        // Display actionable next steps
        // ───────────────────────────────────────────────────────────────────────
        
        console.log('');
        console.log('────────────────────────────────────────────────────────────────');
        console.log('📋 NEXT STEPS');
        console.log('────────────────────────────────────────────────────────────────');
        
        if (result.techBlockFlag) {
            console.log('   ⛔ TECHNICAL BLOCK DETECTED');
            console.log('      • Site returned 403/401 error');
            console.log('      • Will need explicit permission to scrape');
            console.log('      • Consider reaching out via email/LinkedIn');
        }
        
        if (result.touFlag && !result.techBlockFlag) {
            console.log('   ⚠️ TOU RESTRICTIONS FOUND');
            console.log('      • Review restrictions in tou_notes field');
            console.log('      • May need explicit permission');
            console.log('      • Consider contacting their legal/permissions team');
        }
        
        if (!result.touFlag && !result.techBlockFlag) {
            console.log('   ✅ NO RESTRICTIONS DETECTED');
            console.log('      • Organization appears scrapeable');
            console.log('      • Still recommend sending permission request');
        }
        
        if (result.eventsUrl) {
            console.log(`   📅 EVENTS URL: ${result.eventsUrl}`);
            if (!result.eventsUrlValidated) {
                console.log('      ⚠️ URL not fully validated - verify manually');
            }
        } else {
            console.log('   📅 No events URL discovered');
            console.log('      • May need manual investigation');
        }
        
        if (result.fieldsUpdated && result.fieldsUpdated.length > 0) {
            console.log(`   💾 DATABASE UPDATED: ${result.fieldsUpdated.join(', ')}`);
        }
        
        console.log('');
        console.log('✅ Scan complete!');
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('❌ Scan failed:', error.message);
        console.error('');
        process.exit(1);
    }
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
