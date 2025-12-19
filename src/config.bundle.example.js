// =====================================================
// JobSeek Hero Journey - Configuration (Bundle/CDN)
// =====================================================

// IMPORTANT: Pour le déploiement sur CDN (Bunny.net, etc.)
// Ce fichier doit être renommé en "config.bundle.js"
// NE PAS commiter config.bundle.js dans Git

// Version pour production CDN (fichier autonome, pas de module ES6)
window.CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://[your-project-ref].supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',

    // n8n Webhooks Base URL
    N8N_BASE_URL: 'https://[your-n8n-instance].app.n8n.cloud',

    // OpenRouter API (utilisé dans n8n)
    OPENROUTER_API_KEY: 'your-openrouter-api-key',

    // Bunny.net CDN (optionnel, pour assets)
    BUNNY_CDN_URL: 'https://[your-pull-zone].b-cdn.net',
    BUNNY_STORAGE_API_KEY: 'your-bunny-storage-api-key',

    // App Settings
    MIN_INPUT_LENGTH: 50,
    XP_PER_STAGE: 125,
    CREDITS_PER_GENERATION: 1,

    // API Endpoints (n8n webhooks)
    API_ENDPOINTS: {
        START_JOURNEY: '/webhook/hero-journey-start',
        SUBMIT_STAGE: '/webhook/hero-journey-stage',
        GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
        GET_JOURNEY: '/webhook/hero-journey-get',
        EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'
    },

    // Feature Flags
    ENABLE_DEBUG: false,
    ENABLE_ANALYTICS: true
};

// =====================================================
// EXEMPLE DE CONFIGURATION COMPLETE
// =====================================================

/*
window.CONFIG = {
    SUPABASE_URL: 'https://xyzabcdefg.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud',
    OPENROUTER_API_KEY: 'sk-or-v1-abc123...',
    BUNNY_CDN_URL: 'https://jobseek-assets.b-cdn.net',
    BUNNY_STORAGE_API_KEY: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    MIN_INPUT_LENGTH: 50,
    XP_PER_STAGE: 125,
    CREDITS_PER_GENERATION: 1,
    API_ENDPOINTS: {
        START_JOURNEY: '/webhook/hero-journey-start',
        SUBMIT_STAGE: '/webhook/hero-journey-stage',
        GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
        GET_JOURNEY: '/webhook/hero-journey-get',
        EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'
    },
    ENABLE_DEBUG: false,
    ENABLE_ANALYTICS: true
};
*/

// =====================================================
// UTILISATION DANS index.html
// =====================================================

/*
<!-- Charger la config AVANT les scripts de l'app -->
<script src="config.bundle.js"></script>
<script src="app.bundle.js"></script>

Dans app.bundle.js, utiliser window.CONFIG au lieu de import
*/

// =====================================================
// DIFFERENCES AVEC config.js
// =====================================================

/*
config.js (dev local):
- Format: ES6 Module (export const CONFIG)
- Usage: import { CONFIG } from './config.js'
- Environnement: Développement local avec serveur qui supporte ES6

config.bundle.js (production CDN):
- Format: Global variable (window.CONFIG)
- Usage: window.CONFIG accessible partout
- Environnement: Production avec CDN statique (Bunny.net, CloudFlare, etc.)
*/
