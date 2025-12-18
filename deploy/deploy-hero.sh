#!/bin/bash

# =====================================================
# Deploy Hero Journey to Bunny.net
# =====================================================
# Usage: ./deploy-hero.sh
# Nécessite: curl, FTP access configuré

set -e

# Configuration
BUNNY_STORAGE_ZONE="jobseek-assets"
BUNNY_STORAGE_PASSWORD="your-ftp-password-here"
BUNNY_HOSTNAME="storage.bunnycdn.com"
REMOTE_PATH="/hero-journey"
LOCAL_PATH="./src"

echo "🚀 Déploiement Hero Journey sur Bunny.net..."
echo "================================================"

# Vérifier que les fichiers existent
if [ ! -f "$LOCAL_PATH/index.html" ]; then
    echo "❌ Erreur: index.html non trouvé dans $LOCAL_PATH"
    exit 1
fi

# Créer version avec timestamp
VERSION=$(date +%Y%m%d%H%M%S)
echo "📦 Version: $VERSION"

# Upload via FTP
echo "📤 Upload des fichiers..."

# Option 1: Via CURL (FTP)
upload_file() {
    local file=$1
    local filename=$(basename $file)
    echo "  → Upload $filename..."
    
    curl -T "$file" \
         -u "$BUNNY_STORAGE_ZONE:$BUNNY_STORAGE_PASSWORD" \
         "ftp://$BUNNY_HOSTNAME$REMOTE_PATH/$filename"
}

# Upload tous les fichiers
upload_file "$LOCAL_PATH/index.html"
upload_file "$LOCAL_PATH/style.css"
upload_file "$LOCAL_PATH/app.js"
upload_file "$LOCAL_PATH/config.js"

echo ""
echo "✅ Déploiement terminé !"
echo "================================================"
echo "URL: https://hero.jobseek.online"
echo ""
echo "⚠️  N'oubliez pas de purger le cache Bunny si nécessaire:"
echo "   Dashboard → Pull Zone → Purge Cache"
echo ""

# Option 2: Si vous préférez via API Bunny
# curl -X DELETE "https://api.bunny.net/purge?url=https://hero.jobseek.online/index.html" \
#      -H "AccessKey: your-api-key"
