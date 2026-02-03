# =============================================================================
# BACKUP-ORIGINALS.PS1
# Backs up original icon-worker files before testing v4.0 improvements
# =============================================================================

$backupDestination = "C:\LOCAL FILES\AI Stuff - LOCAL\AI Image Generation Backup 2026-02-02-17"

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📦 BACKING UP ORIGINAL ICON-WORKER FILES" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Destination: $backupDestination" -ForegroundColor Yellow
Write-Host ""

# Create destination folders
Write-Host "📂 Creating backup folders..." -ForegroundColor White
New-Item -ItemType Directory -Path "$backupDestination\src" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupDestination\workflows" -Force | Out-Null
Write-Host "   ✅ Folders created" -ForegroundColor Green
Write-Host ""

# Find the icon-worker folder
$iconWorkerPath = "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker"

# Check common locations if default doesn't exist
if (-not (Test-Path $iconWorkerPath)) {
    $possiblePaths = @(
        "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker",
        "C:\event-finder\icon-worker",
        "C:\Users\$env:USERNAME\event-finder\icon-worker"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $iconWorkerPath = $path
            break
        }
    }
}

Write-Host "🔍 Looking for icon-worker at: $iconWorkerPath" -ForegroundColor White

if (-not (Test-Path $iconWorkerPath)) {
    Write-Host ""
    Write-Host "⚠️  Could not find icon-worker folder automatically." -ForegroundColor Yellow
    Write-Host ""
    $iconWorkerPath = Read-Host "Please enter the full path to your icon-worker folder"
}

if (-not (Test-Path $iconWorkerPath)) {
    Write-Host "❌ Path not found: $iconWorkerPath" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Found: $iconWorkerPath" -ForegroundColor Green
Write-Host ""

# Define files to backup
$srcFiles = @(
    "rules.js",
    "policyEngine.js",
    "validators.js",
    "openaiImages.js",
    "config.js",
    "generate-topic-icons.js",
    "create-topic-icon-records.js",
    "pbClient.js"
)

# Backup src files
Write-Host "📄 Backing up src/ files..." -ForegroundColor White
foreach ($file in $srcFiles) {
    $sourcePath = Join-Path "$iconWorkerPath\src" $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination "$backupDestination\src\" -Force
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $file (not found, skipping)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Backup GitHub Action workflow
Write-Host "📄 Backing up GitHub Action workflow..." -ForegroundColor White
$workflowPath = Join-Path (Split-Path $iconWorkerPath -Parent) ".github\workflows\generate-topic-icons.yml"
if (Test-Path $workflowPath) {
    Copy-Item $workflowPath -Destination "$backupDestination\workflows\" -Force
    Write-Host "   ✅ generate-topic-icons.yml" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  generate-topic-icons.yml (not found at $workflowPath)" -ForegroundColor Yellow
}
Write-Host ""

# Create restore script
Write-Host "📝 Creating restore script..." -ForegroundColor White
$restoreScript = @"
# =============================================================================
# RESTORE-ORIGINALS.PS1
# Restores original icon-worker files from backup
# Run this if you want to revert the v4.0 changes
# =============================================================================

`$backupSource = "$backupDestination"
`$iconWorkerPath = "$iconWorkerPath"

Write-Host "🔄 RESTORING ORIGINAL FILES" -ForegroundColor Cyan
Write-Host ""

# Restore src files
Write-Host "📄 Restoring src/ files..." -ForegroundColor White
Copy-Item "`$backupSource\src\*" -Destination "`$iconWorkerPath\src\" -Force
Write-Host "   ✅ All src files restored" -ForegroundColor Green

# Restore workflow
`$workflowDest = Join-Path (Split-Path `$iconWorkerPath -Parent) ".github\workflows\"
if (Test-Path "`$backupSource\workflows\generate-topic-icons.yml") {
    Copy-Item "`$backupSource\workflows\generate-topic-icons.yml" -Destination `$workflowDest -Force
    Write-Host "   ✅ GitHub Action restored" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ RESTORE COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next: Commit and push if you want to revert on GitHub:" -ForegroundColor Yellow
Write-Host '   git add -A && git commit -m "Revert to original icon generation" && git push'
"@

$restoreScript | Out-File -FilePath "$backupDestination\RESTORE-ORIGINALS.ps1" -Encoding UTF8
Write-Host "   ✅ RESTORE-ORIGINALS.ps1 created" -ForegroundColor Green
Write-Host ""

# Create README
$readme = @"
# 🔄 ORIGINAL FILES BACKUP
Created: $(Get-Date -Format "yyyy-MM-dd HH:mm")

## 📁 Contents
- src/ - Original source files (rules.js, policyEngine.js, etc.)
- workflows/ - Original GitHub Action
- RESTORE-ORIGINALS.ps1 - Script to restore these files

## 🔙 How to Restore
Run this in PowerShell:
    .\RESTORE-ORIGINALS.ps1

## 📍 Original Location
$iconWorkerPath
"@

$readme | Out-File -FilePath "$backupDestination\README.md" -Encoding UTF8
Write-Host "   ✅ README.md created" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ BACKUP COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Backup location:" -ForegroundColor White
Write-Host "   $backupDestination" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 To restore later, run:" -ForegroundColor White
Write-Host "   cd '$backupDestination'" -ForegroundColor Yellow
Write-Host "   .\RESTORE-ORIGINALS.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "📌 Next step: Copy the NEW v4.0 files to icon-worker/src/ and test!" -ForegroundColor Cyan
