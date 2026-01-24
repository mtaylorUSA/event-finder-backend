# get-tou-flagged-orgs.ps1
# Queries PocketBase for organizations with tou_flag=true but NOT tech_block_flag=true

# Load environment variables from .env file
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
        }
    }
}

$POCKETBASE_URL = $env:POCKETBASE_URL

if (-not $POCKETBASE_URL) {
    Write-Host "ERROR: POCKETBASE_URL not found in environment" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  TOU-Flagged Organizations Report" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Build the API URL with filter
# Filter: tou_flag = true AND (tech_block_flag = false OR tech_block_flag is not set)
$filter = [System.Uri]::EscapeDataString("tou_flag = true && tech_block_flag != true")
$fields = "id,name,source_id,status,org_type,tou_flag,tou_notes,website"
$url = "$POCKETBASE_URL/api/collections/organizations/records?filter=$filter&fields=$fields&perPage=200"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json"
    
    if ($response.items.Count -eq 0) {
        Write-Host "No organizations found with tou_flag=true (excluding tech blocks)" -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "Found $($response.items.Count) organization(s) with TOU flags:" -ForegroundColor Green
    Write-Host ""
    
    # Output as formatted table for readability
    Write-Host "--- SUMMARY TABLE ---" -ForegroundColor Yellow
    $response.items | Format-Table -Property name, org_type, status, source_id -AutoSize
    
    Write-Host ""
    Write-Host "--- DETAILED JSON (copy this for Claude) ---" -ForegroundColor Yellow
    Write-Host ""
    
    # Output clean JSON for Claude to analyze
    $output = $response.items | Select-Object name, org_type, status, source_id, website, tou_notes
    $output | ConvertTo-Json -Depth 3
    
} catch {
    Write-Host "ERROR: Failed to query PocketBase" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
