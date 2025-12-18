# =====================================================
# JobSeek Hero Journey - Script de déploiement Bunny.net (PowerShell)
# =====================================================
# Usage: .\deploy-bunny.ps1 [-Version "v1.0.1"]
# =====================================================

param(
    [string]$Version = (Get-Date -Format "yyyyMMdd-HHmmss")
)

$ErrorActionPreference = "Stop"

# ===== CONFIGURATION =====
$BunnyStorageZone = "jobseek-assets"
$BunnyStoragePassword = $env:BUNNY_STORAGE_PASSWORD
$BunnyStorageHostname = "storage.bunnycdn.com"
$RemotePath = "/hero-journey"
$LocalPath = ".\src"

Write-Host "========================================" -ForegroundColor Green
Write-Host "  JobSeek Hero Journey - Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# ===== VÉRIFICATIONS =====
Write-Host "→ Vérification des prérequis..." -ForegroundColor Yellow

if ([string]::IsNullOrEmpty($BunnyStoragePassword)) {
    Write-Host "✗ BUNNY_STORAGE_PASSWORD non défini" -ForegroundColor Red
    Write-Host "  Définissez la variable d'environnement:"
    Write-Host '  $env:BUNNY_STORAGE_PASSWORD = "your_password"'
    exit 1
}

Write-Host "✓ Prérequis OK" -ForegroundColor Green
Write-Host ""

# ===== BUILD =====
Write-Host "→ Préparation des fichiers..." -ForegroundColor Yellow

$BuildDir = ".\build"
if (Test-Path $BuildDir) {
    Remove-Item $BuildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $BuildDir | Out-Null

# Copier les fichiers
Copy-Item "$LocalPath\index.html" $BuildDir
Copy-Item "$LocalPath\style.css" $BuildDir
Copy-Item "$LocalPath\app.js" $BuildDir
Copy-Item "$LocalPath\config.js" $BuildDir

# Versionner les assets
$CssVersioned = "style.$Version.css"
$JsVersioned = "app.$Version.js"
$ConfigVersioned = "config.$Version.js"

Rename-Item "$BuildDir\style.css" $CssVersioned
Rename-Item "$BuildDir\app.js" $JsVersioned
Rename-Item "$BuildDir\config.js" $ConfigVersioned

# Mettre à jour index.html
$indexContent = Get-Content "$BuildDir\index.html" -Raw
$indexContent = $indexContent -replace "style\.css", $CssVersioned
$indexContent = $indexContent -replace "app\.js", $JsVersioned
$indexContent = $indexContent -replace "config\.js", $ConfigVersioned
Set-Content "$BuildDir\index.html" $indexContent

Write-Host "✓ Fichiers préparés" -ForegroundColor Green
Write-Host "  - index.html"
Write-Host "  - $CssVersioned"
Write-Host "  - $JsVersioned"
Write-Host "  - $ConfigVersioned"
Write-Host ""

# ===== FONCTION UPLOAD =====
function Upload-File {
    param(
        [string]$LocalFile,
        [string]$RemoteFile
    )
    
    Write-Host "  → Upload de $LocalFile..." -ForegroundColor Yellow
    
    $uri = "https://$BunnyStorageHostname/$BunnyStorageZone$RemotePath/$RemoteFile"
    $headers = @{
        "AccessKey" = $BunnyStoragePassword
    }
    
    try {
        $fileContent = [System.IO.File]::ReadAllBytes("$BuildDir\$LocalFile")
        
        $response = Invoke-WebRequest `
            -Uri $uri `
            -Method Put `
            -Headers $headers `
            -Body $fileContent `
            -ContentType "application/octet-stream"
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "    ✓ $LocalFile uploadé" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "    ✗ Erreur upload $LocalFile" -ForegroundColor Red
        Write-Host "    Détails: $_" -ForegroundColor Red
        return $false
    }
}

# ===== UPLOAD =====
Write-Host "→ Upload vers Bunny CDN..." -ForegroundColor Yellow

Upload-File "index.html" "index.html"
Upload-File $CssVersioned $CssVersioned
Upload-File $JsVersioned $JsVersioned
Upload-File $ConfigVersioned $ConfigVersioned

Write-Host "✓ Tous les fichiers uploadés" -ForegroundColor Green
Write-Host ""

# ===== PURGE CACHE =====
Write-Host "→ Purge du cache CDN..." -ForegroundColor Yellow
Write-Host "  ⚠ Purge manuel requis" -ForegroundColor Yellow
Write-Host "  Allez sur: https://panel.bunny.net/cdn"
Write-Host ""

# ===== NETTOYAGE =====
Write-Host "→ Nettoyage..." -ForegroundColor Yellow
Remove-Item $BuildDir -Recurse -Force
Write-Host "✓ Build directory supprimé" -ForegroundColor Green
Write-Host ""

# ===== RÉSUMÉ =====
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Déploiement réussi !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Version déployée: $Version"
Write-Host "URL: https://hero.jobseek.online"
Write-Host ""
Write-Host "N'oubliez pas de:" -ForegroundColor Yellow
Write-Host "1. Purger le cache CDN manuellement"
Write-Host "2. Tester l'application sur hero.jobseek.online"
Write-Host "3. Vérifier les versions des assets (F12 > Network)"
Write-Host ""
