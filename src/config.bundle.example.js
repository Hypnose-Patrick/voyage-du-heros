// =====================================================
// JobSeek Hero Journey - Configuration Bundle Template
// Version compatible CDN sans ES6 modules
// =====================================================

window.CONFIG = {
  // =====================================================
  // SUPABASE
  // =====================================================
  SUPABASE_URL: 'https://[your-project-ref].supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_[your-anon-key-here]',

  // =====================================================
  // N8N WEBHOOKS
  // =====================================================
  N8N_BASE_URL: 'https://[your-n8n-instance].n8n.cloud',

  // URLs des endpoints (correspondant aux webhooks n8n)
  API_ENDPOINTS: {
    START_JOURNEY: '/webhook/hero-journey-start',
    SUBMIT_STAGE: '/webhook/hero-journey-stage',
    GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
    GET_JOURNEY: '/webhook/hero-journey-get',
    EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'
  },

  // =====================================================
  // APPLICATION
  // =====================================================
  APP_SETTINGS: {
    MIN_INPUT_LENGTH: 50,
    XP_PER_STAGE: 125,
    TOTAL_STAGES: 12,
    ANIMATION_DURATION: 300
  },

  // =====================================================
  // FEATURES
  // =====================================================
  FEATURES: {
    ENABLE_AUDIO: false,
    ENABLE_IMAGES: false,
    ENABLE_PDF_EXPORT: true,
    ENABLE_ANALYTICS: false,
    ENABLE_DEBUG: false  // Désactivé en production
  },

  // =====================================================
  // UI
  // =====================================================
  UI: {
    APP_NAME: 'JobSeek Hero Journey',
    PRIMARY_COLOR: '#6366f1',
    ACCENT_COLOR: '#8b5cf6',
    LANGUAGE: 'fr'
  }
};

// =====================================================
// HELPERS
// =====================================================

window.getApiUrl = function(endpoint) {
  const path = window.CONFIG.API_ENDPOINTS[endpoint];
  if (!path) {
    console.error(`Unknown endpoint: ${endpoint}`);
    return null;
  }
  return `${window.CONFIG.N8N_BASE_URL}${path}`;
};

window.validateConfig = function() {
  const errors = [];

  if (!window.CONFIG.SUPABASE_URL || window.CONFIG.SUPABASE_URL.includes('[your-project]')) {
    errors.push('SUPABASE_URL non configurée');
  }

  if (!window.CONFIG.SUPABASE_ANON_KEY || window.CONFIG.SUPABASE_ANON_KEY.includes('[your-')) {
    errors.push('SUPABASE_ANON_KEY non configurée');
  }

  if (!window.CONFIG.N8N_BASE_URL || window.CONFIG.N8N_BASE_URL.includes('[your-n8n]')) {
    errors.push('N8N_BASE_URL non configurée');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration incomplète:', errors);
    return false;
  }

  if (window.CONFIG.FEATURES.ENABLE_DEBUG) {
    console.log('✅ Configuration validée:', {
      supabaseUrl: window.CONFIG.SUPABASE_URL,
      n8nUrl: window.CONFIG.N8N_BASE_URL
    });
  }

  return true;
};

// Auto-validation au chargement
if (typeof window !== 'undefined') {
  console.log('✅ config.bundle.js chargé - window.CONFIG disponible');
  window.validateConfig();
}

// =====================================================
// INSTRUCTIONS
// =====================================================

/*
📋 CE FICHIER EST POUR LE DÉPLOIEMENT CDN (BUNNY.NET)

1. COPIER CE FICHIER:
   cp config.bundle.example.js config.bundle.js

2. REMPLIR LES MÊMES VALEURS QUE config.js

3. UPLOADER SUR BUNNY.NET:
   - Uploader config.bundle.js → renommer en "config.js"
   - Uploader login-bundle.html → renommer en "login.html"
   - Uploader index.html, style.css, app.js tel quel

4. PURGER LE CACHE CDN APRÈS UPLOAD

⚠️ DIFFÉRENCE AVEC config.js:
- Utilise window.CONFIG au lieu de export
- Pas de modules ES6
- Compatible avec tous les CDN

📚 VOIR: DEPLOY_BUNNY.md pour instructions complètes
*/
