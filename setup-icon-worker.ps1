# ============================================================
# Setup Script for EventFinder Icon Worker
# Run this in PowerShell from your Event Finder - LOCAL folder
# ============================================================

# Set the base path
$basePath = "C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\icon-worker"

# Create directories
Write-Host "📁 Creating folder structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$basePath\src" -Force | Out-Null

Write-Host "✅ Created: $basePath" -ForegroundColor Green
Write-Host "✅ Created: $basePath\src" -ForegroundColor Green

# Create .env file with placeholders
$envContent = @"
POCKETBASE_URL=https://event-discovery-backend-production.up.railway.app
POCKETBASE_ADMIN_EMAIL=YOUR_ADMIN_EMAIL_HERE
POCKETBASE_ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD_HERE

OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
OPENAI_IMAGE_MODEL=dall-e-3

MAX_ITEMS=25
MAX_ATTEMPTS=6

# Optional UI downscale audit
ENABLE_DOWNSCALE_AUDIT=true

# Audit thresholds (tune if needed)
DOWNSCALE_MIN_FOREGROUND_RATIO=0.03
DOWNSCALE_MIN_STDDEV=18
"@

$envPath = "$basePath\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "✅ Created: .env (UPDATE WITH YOUR CREDENTIALS!)" -ForegroundColor Yellow

# Instructions
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "📋 NOW COPY YOUR DOWNLOADED FILES TO THESE LOCATIONS:" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "To $basePath\" -ForegroundColor White
Write-Host "   • package.json" -ForegroundColor Gray
Write-Host "   • .env.example" -ForegroundColor Gray
Write-Host "   • README.md" -ForegroundColor Gray
Write-Host "   • Image_Generation_Safety_Abstraction_Policy_v2.7.md" -ForegroundColor Gray
Write-Host ""
Write-Host "To $basePath\src\" -ForegroundColor White
Write-Host "   • config.js" -ForegroundColor Gray
Write-Host "   • generate-topic-icons.js" -ForegroundColor Gray
Write-Host "   • openaiImages.js" -ForegroundColor Gray
Write-Host "   • pbClient.js" -ForegroundColor Gray
Write-Host "   • policyEngine.js" -ForegroundColor Gray
Write-Host "   • rules.js" -ForegroundColor Gray
Write-Host "   • validators.js" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "⚠️  IMPORTANT: Edit .env with your real credentials!" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "After copying files, run these commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   cd `"$basePath`"" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run generate" -ForegroundColor White
Write-Host ""
