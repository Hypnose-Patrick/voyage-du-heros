# =====================================================
# Deploy Hero Journey to Bunny.net (PowerShell)
# =====================================================
# Usage: .\deploy-hero.ps1

param(
    [string]$StorageZone = "jobseek-assets",
    [string]$Password = "your-ftp-password-here",
    [string]$RemotePath = "/hero-journey"
)

Write-Host "🚀 Déploiement Hero Journey sur Bunny.net..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$LocalPath = ".\src"
$BunnyHostname = "storage.bunnycdn.com"

# Vérifier que les fichiers existent
if (-not (Test-Path "$LocalPath\index.html")) {
    Write-Host "❌ Erreur: index.html non trouvé dans $LocalPath" -ForegroundColor Red
    exit 1
}

# Version timestamp
$Version = Get-Date -Format "yyyyMMddHHmmss"
Write-Host "📦 Version: $Version" -ForegroundColor Yellow

# Fonction upload via FTP
function Upload-File {
    param(
        [string]$FilePath,
        [string]$RemoteFile
    )
    
    $FileName = Split-Path $FilePath -Leaf
    Write-Host "  → Upload $FileName..." -ForegroundColor Gray
    
    $FtpUri = "ftp://$BunnyHostname$RemotePath/$RemoteFile"
    $WebClient = New-Object System.Net.WebClient
    $WebClient.Credentials = New-Object System.Net.NetworkCredential($StorageZone, $Password)
    
    try {
        $WebClient.UploadFile($FtpUri, $FilePath)
        Write-Host "    ✓ $FileName uploadé" -ForegroundColor Green
    }
    catch {
        Write-Host "    ✗ Erreur: $_" -ForegroundColor Red
        throw
    }
    finally {
        $WebClient.Dispose()
    }
}

# Upload des fichiers
try {
    Upload-File "$LocalPath\index.html" "index.html"
    Upload-File "$LocalPath\style.css" "style.css"
    Upload-File "$LocalPath\app.js" "app.js"
    Upload-File "$LocalPath\config.js" "config.js"
    
    Write-Host ""
    Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "URL: https://hero.jobseek.online" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  N'oubliez pas de purger le cache Bunny si nécessaire:" -ForegroundColor Yellow
    Write-Host "   Dashboard → Pull Zone → Purge Cache" -ForegroundColor Yellow
}
catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du déploiement: $_" -ForegroundColor Red
    exit 1
}
