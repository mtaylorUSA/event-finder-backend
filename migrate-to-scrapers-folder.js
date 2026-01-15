/**
 * migrate-to-scrapers-folder.js
 * 
 * Migration script to consolidate all scraping/scanning files
 * into a single `scrapers/` folder.
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Creates scrapers/ and scrapers/custom/ folders (if needed)
 * 2. Moves files to scrapers/
 * 3. Updates require() paths in all files
 * 4. Marks tou-scanner.js as deprecated (merged into org-scanner.js)
 * 
 * USAGE:
 *   node migrate-to-scrapers-folder.js --dry-run    (preview changes)
 *   node migrate-to-scrapers-folder.js              (execute migration)
 * 
 * ROLLBACK:
 *   The script creates a backup log. To rollback manually:
 *   - Move files back based on migration-log.json
 * 
 * Last Updated: 2026-01-14
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DRY_RUN = process.argv.includes('--dry-run');

// Files to move INTO scrapers/ folder
const FILES_TO_MOVE = [
    // From scanners/ folder
    { from: 'scanners/org-scanner.js', to: 'scrapers/org-scanner.js' },
    
    // From root (if they exist there)
    { from: 'base-scraper.js', to: 'scrapers/base-scraper.js' },
    { from: 'scrape-all-organizations.js', to: 'scrapers/scrape-all-organizations.js' },
    { from: 'discover-orgs-by-events.js', to: 'scrapers/discover-orgs-by-events.js' },
    { from: 'suggest-organizations.js', to: 'scrapers/suggest-organizations.js' },
    { from: 'generate-embeddings.js', to: 'scrapers/generate-embeddings.js' },
    { from: 'enrich-events.js', to: 'scrapers/enrich-events.js' },
    
    // scan-organization.js CLI (to be created - placeholder)
    // { from: 'scan-organization.js', to: 'scrapers/scan-organization.js' },
];

// Files to mark as deprecated (not delete - safer)
const FILES_TO_DEPRECATE = [
    'tou-scanner.js'  // Merged into org-scanner.js
];

// Files that need require() path updates
const FILES_TO_UPDATE_IMPORTS = [
    'scrapers/base-scraper.js',
    'scrapers/index.js',
    'scrapers/scrape-all-organizations.js',
    'scrapers/discover-orgs-by-events.js',
    'scrapers/suggest-organizations.js',
    'scrapers/org-scanner.js',
    'scrapers/custom/insa.js',
    // Add any other custom scrapers here
];

// Import path replacements (old -> new)
const IMPORT_REPLACEMENTS = [
    // From root to scrapers/
    { pattern: /require\(['"]\.\/tou-scanner['"]\)/g, replacement: "require('./org-scanner')" },
    { pattern: /require\(['"]\.\/base-scraper['"]\)/g, replacement: "require('./base-scraper')" },
    { pattern: /require\(['"]\.\/scrapers['"]\)/g, replacement: "require('./index')" },
    { pattern: /require\(['"]\.\/scrapers\/index['"]\)/g, replacement: "require('./index')" },
    { pattern: /require\(['"]\.\/scanners\/org-scanner['"]\)/g, replacement: "require('./org-scanner')" },
    
    // From scrapers/ subfolder to scrapers/ root
    { pattern: /require\(['"]\.\.\/base-scraper['"]\)/g, replacement: "require('../base-scraper')" },
    { pattern: /require\(['"]\.\.\/org-scanner['"]\)/g, replacement: "require('../org-scanner')" },
    
    // Fix any double dots that shouldn't be there (custom/ -> parent)
    // These should stay as-is: require('../base-scraper') in custom/insa.js
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function log(emoji, message) {
    console.log(`${emoji} ${message}`);
}

function logSection(title) {
    console.log('');
    console.log('────────────────────────────────────────────────────────────');
    console.log(`📋 ${title}`);
    console.log('────────────────────────────────────────────────────────────');
}

function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function ensureDir(dirPath) {
    if (!fileExists(dirPath)) {
        if (DRY_RUN) {
            log('📁', `Would create directory: ${dirPath}`);
        } else {
            fs.mkdirSync(dirPath, { recursive: true });
            log('📁', `Created directory: ${dirPath}`);
        }
    }
}

function moveFile(from, to) {
    if (!fileExists(from)) {
        log('⏭️', `Skip (not found): ${from}`);
        return false;
    }
    
    if (fileExists(to)) {
        log('⚠️', `Skip (already exists): ${to}`);
        return false;
    }
    
    if (DRY_RUN) {
        log('📦', `Would move: ${from} → ${to}`);
    } else {
        // Ensure target directory exists
        ensureDir(path.dirname(to));
        
        // Copy then delete (safer than rename across drives)
        fs.copyFileSync(from, to);
        fs.unlinkSync(from);
        log('📦', `Moved: ${from} → ${to}`);
    }
    
    return true;
}

function deprecateFile(filePath) {
    if (!fileExists(filePath)) {
        log('⏭️', `Skip (not found): ${filePath}`);
        return false;
    }
    
    const deprecatedPath = filePath.replace('.js', '.deprecated.js');
    
    if (DRY_RUN) {
        log('🗑️', `Would deprecate: ${filePath} → ${deprecatedPath}`);
    } else {
        // Read file and add deprecation notice
        const content = fs.readFileSync(filePath, 'utf8');
        const notice = `/**
 * ⚠️ DEPRECATED - DO NOT USE
 * 
 * This file has been merged into scrapers/org-scanner.js
 * 
 * Migration date: ${new Date().toISOString().split('T')[0]}
 * 
 * To use scanning functionality, import from:
 *   const scanner = require('./scrapers/org-scanner');
 * 
 * This file is kept for reference only and will be deleted in a future update.
 */

`;
        fs.writeFileSync(filePath, notice + content);
        fs.renameSync(filePath, deprecatedPath);
        log('🗑️', `Deprecated: ${filePath} → ${deprecatedPath}`);
    }
    
    return true;
}

function updateImports(filePath) {
    if (!fileExists(filePath)) {
        log('⏭️', `Skip (not found): ${filePath}`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changesMade = [];
    
    for (const { pattern, replacement } of IMPORT_REPLACEMENTS) {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            changesMade.push(`${pattern} → ${replacement}`);
        }
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0;
    }
    
    if (changesMade.length > 0) {
        if (DRY_RUN) {
            log('🔧', `Would update imports in: ${filePath}`);
            changesMade.forEach(c => log('   ', c));
        } else {
            fs.writeFileSync(filePath, content);
            log('🔧', `Updated imports in: ${filePath}`);
            changesMade.forEach(c => log('   ', c));
        }
        return true;
    } else {
        log('✅', `No import changes needed: ${filePath}`);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MIGRATION
// ═══════════════════════════════════════════════════════════════════════════════

function main() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🚀 SCRAPER FILE MIGRATION SCRIPT');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes will be made)' : '⚡ LIVE (files will be moved)'}`);
    console.log(`   Date: ${new Date().toISOString()}`);
    console.log('');
    
    if (DRY_RUN) {
        console.log('💡 This is a preview. Run without --dry-run to execute.');
        console.log('');
    }
    
    const migrationLog = {
        timestamp: new Date().toISOString(),
        mode: DRY_RUN ? 'dry-run' : 'live',
        moved: [],
        deprecated: [],
        updated: [],
        skipped: []
    };
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 1: Create directories
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 1: Create Directories');
    
    ensureDir('scrapers');
    ensureDir('scrapers/custom');
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 2: Move files
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 2: Move Files to scrapers/');
    
    for (const { from, to } of FILES_TO_MOVE) {
        const moved = moveFile(from, to);
        if (moved) {
            migrationLog.moved.push({ from, to });
        } else {
            migrationLog.skipped.push({ file: from, reason: 'not found or already exists' });
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 3: Deprecate redundant files
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 3: Deprecate Redundant Files');
    
    for (const filePath of FILES_TO_DEPRECATE) {
        const deprecated = deprecateFile(filePath);
        if (deprecated) {
            migrationLog.deprecated.push(filePath);
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 4: Update import paths
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 4: Update Import Paths');
    
    for (const filePath of FILES_TO_UPDATE_IMPORTS) {
        const updated = updateImports(filePath);
        if (updated) {
            migrationLog.updated.push(filePath);
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 5: Clean up empty directories
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 5: Clean Up');
    
    // Remove empty scanners/ directory if it exists and is empty
    if (fileExists('scanners')) {
        try {
            const files = fs.readdirSync('scanners');
            if (files.length === 0) {
                if (DRY_RUN) {
                    log('🧹', 'Would remove empty directory: scanners/');
                } else {
                    fs.rmdirSync('scanners');
                    log('🧹', 'Removed empty directory: scanners/');
                }
            } else {
                log('⚠️', `Directory not empty, keeping: scanners/ (${files.length} files remain)`);
            }
        } catch (e) {
            log('⚠️', `Could not clean scanners/: ${e.message}`);
        }
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Step 6: Save migration log
    // ───────────────────────────────────────────────────────────────────────
    
    logSection('Step 6: Save Migration Log');
    
    if (!DRY_RUN) {
        const logPath = `migration-log-${Date.now()}.json`;
        fs.writeFileSync(logPath, JSON.stringify(migrationLog, null, 2));
        log('📝', `Migration log saved: ${logPath}`);
    }
    
    // ───────────────────────────────────────────────────────────────────────
    // Summary
    // ───────────────────────────────────────────────────────────────────────
    
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`   📦 Files moved: ${migrationLog.moved.length}`);
    console.log(`   🗑️  Files deprecated: ${migrationLog.deprecated.length}`);
    console.log(`   🔧 Files updated: ${migrationLog.updated.length}`);
    console.log(`   ⏭️  Files skipped: ${migrationLog.skipped.length}`);
    console.log('');
    
    if (DRY_RUN) {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('💡 This was a DRY RUN. No files were changed.');
        console.log('   To execute the migration, run:');
        console.log('');
        console.log('   node migrate-to-scrapers-folder.js');
        console.log('════════════════════════════════════════════════════════════════');
    } else {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('✅ MIGRATION COMPLETE!');
        console.log('');
        console.log('📋 New structure:');
        console.log('   scrapers/');
        console.log('   ├── org-scanner.js');
        console.log('   ├── base-scraper.js');
        console.log('   ├── index.js');
        console.log('   ├── scrape-all-organizations.js');
        console.log('   ├── discover-orgs-by-events.js');
        console.log('   ├── suggest-organizations.js');
        console.log('   ├── generate-embeddings.js');
        console.log('   ├── enrich-events.js');
        console.log('   └── custom/');
        console.log('       └── insa.js');
        console.log('');
        console.log('⚠️  NEXT STEPS:');
        console.log('   1. Test that scripts still work:');
        console.log('      node scrapers/scrape-all-organizations.js --help');
        console.log('');
        console.log('   2. Update any npm scripts in package.json');
        console.log('');
        console.log('   3. Update ConOp documentation with new paths');
        console.log('════════════════════════════════════════════════════════════════');
    }
    console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════════

main();
