#!/bin/bash

# =====================================================
# JobSeek Hero Journey - Déploiement Bunny.net
# =====================================================
# Ce script upload les fichiers sur Bunny Storage CDN
# =====================================================

set -e  # Exit on error

# =====================================================
# CONFIGURATION
# =====================================================

# À configurer selon votre compte Bunny.net
BUNNY_STORAGE_ZONE="jobseek-assets"
BUNNY_STORAGE_API_KEY="your-storage-api-key-here"
BUNNY_HOSTNAME="storage.bunnycdn.com"
BUNNY_CDN_URL="https://jobseek-assets.b-cdn.net"

# Dossiers
SRC_DIR="./src"
DEPLOY_PATH="/hero-journey"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =====================================================
# FONCTIONS
# =====================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que les fichiers sources existent
check_files() {
    log_info "Vérification des fichiers sources..."
    
    local required_files=("login.html" "index.html" "style.css" "app.js" "config.js")

    for file in "${required_files[@]}"; do
        if [ ! -f "$SRC_DIR/$file" ]; then
            log_error "$file non trouvé dans $SRC_DIR"
            exit 1
        fi
    done
    
    log_info "✓ Tous les fichiers sources sont présents"
}

# Upload un fichier vers Bunny Storage
upload_file() {
    local file=$1
    local filename=$(basename "$file")
    local remote_path="${DEPLOY_PATH}/${filename}"
    
    log_info "Upload: $filename → ${BUNNY_CDN_URL}${remote_path}"
    
    # Déterminer le Content-Type
    local content_type="application/octet-stream"
    case "${filename##*.}" in
        html) content_type="text/html" ;;
        css)  content_type="text/css" ;;
        js)   content_type="application/javascript" ;;
        json) content_type="application/json" ;;
    esac
    
    # Upload via API Bunny
    response=$(curl -s -w "%{http_code}" \
        -X PUT \
        -H "AccessKey: $BUNNY_STORAGE_API_KEY" \
        -H "Content-Type: $content_type" \
        --data-binary "@$file" \
        "https://$BUNNY_HOSTNAME/$BUNNY_STORAGE_ZONE$remote_path")
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
        log_info "✓ $filename uploadé avec succès"
    else
        log_error "✗ Échec upload $filename (HTTP $http_code)"
        exit 1
    fi
}

# Purger le cache CDN
purge_cache() {
    log_info "Purge du cache CDN..."
    
    # Note: Bunny.net peut mettre jusqu'à 60s pour propager
    # Pour forcer un refresh immédiat, utiliser l'API Purge
    
    curl -s -X POST \
        -H "AccessKey: $BUNNY_STORAGE_API_KEY" \
        "https://api.bunny.net/purge?url=${BUNNY_CDN_URL}${DEPLOY_PATH}/*" > /dev/null
    
    log_info "✓ Cache purgé"
}

# Build / Optimisation (optionnel)
build_assets() {
    log_info "Préparation des assets..."
    
    # Ici vous pourriez ajouter:
    # - Minification JS/CSS
    # - Compression Gzip
    # - Versionning des fichiers
    
    # Exemple simple: copier les fichiers
    mkdir -p ./build
    cp -r $SRC_DIR/* ./build/
    
    log_info "✓ Assets prêts"
}

# =====================================================
# SCRIPT PRINCIPAL
# =====================================================

main() {
    log_info "==================================================="
    log_info "  JobSeek Hero Journey - Déploiement Bunny.net"
    log_info "==================================================="
    echo ""
    
    # Vérifier les prérequis
    if [ -z "$BUNNY_STORAGE_API_KEY" ] || [ "$BUNNY_STORAGE_API_KEY" = "your-storage-api-key-here" ]; then
        log_error "BUNNY_STORAGE_API_KEY non configurée"
        log_info "Éditez ce script et ajoutez votre API key Bunny.net"
        exit 1
    fi
    
    # Vérifier curl
    if ! command -v curl &> /dev/null; then
        log_error "curl n'est pas installé"
        exit 1
    fi
    
    # 1. Vérifier les fichiers
    check_files
    echo ""
    
    # 2. Build (optionnel)
    # build_assets
    # echo ""
    
    # 3. Upload des fichiers
    log_info "Upload des fichiers sur Bunny CDN..."
    echo ""

    upload_file "$SRC_DIR/login.html"
    upload_file "$SRC_DIR/index.html"
    upload_file "$SRC_DIR/style.css"
    upload_file "$SRC_DIR/app.js"
    upload_file "$SRC_DIR/config.js"
    
    echo ""
    
    # 4. Purger le cache
    purge_cache
    echo ""
    
    # 5. Succès
    log_info "==================================================="
    log_info "  ✓ Déploiement réussi !"
    log_info "==================================================="
    echo ""
    log_info "URL de l'application:"
    log_info "  ${BUNNY_CDN_URL}${DEPLOY_PATH}/index.html"
    echo ""
    log_info "Note: Le cache CDN peut prendre jusqu'à 60s pour se propager"
}

# Exécuter
main "$@"
