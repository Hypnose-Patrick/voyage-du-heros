// =====================================================
// JobSeek Hero Journey - Configuration Template
// =====================================================
// IMPORTANT:
// 1. Copier ce fichier: cp config.example.js config.js
// 2. Remplir les valeurs avec vos propres clés
// 3. config.js est déjà dans .gitignore (ne sera pas commité)
// =====================================================

export const CONFIG = {
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
  // OPENROUTER (utilisé dans n8n, pas dans le frontend)
  // =====================================================
  OPENROUTER_API_KEY: 'sk-or-v1-[your-openrouter-key-here]',
  AI_MODEL: 'anthropic/claude-3.5-sonnet',

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
    ENABLE_DEBUG: true  // Désactiver en production
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

// Construire l'URL complète d'un endpoint
export function getApiUrl(endpoint) {
  const path = CONFIG.API_ENDPOINTS[endpoint];
  if (!path) {
    console.error(`Unknown endpoint: ${endpoint}`);
    return null;
  }
  return `${CONFIG.N8N_BASE_URL}${path}`;
}

// Vérifier si la config est complète
export function validateConfig() {
  const errors = [];

  if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('[your-project]')) {
    errors.push('SUPABASE_URL non configurée');
  }

  if (!CONFIG.SUPABASE_ANON_KEY || CONFIG.SUPABASE_ANON_KEY.includes('[your-')) {
    errors.push('SUPABASE_ANON_KEY non configurée');
  }

  if (!CONFIG.N8N_BASE_URL || CONFIG.N8N_BASE_URL.includes('[your-n8n]')) {
    errors.push('N8N_BASE_URL non configurée');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration incomplète:', errors);
    return false;
  }

  if (CONFIG.FEATURES.ENABLE_DEBUG) {
    console.log('✅ Configuration validée:', {
      supabaseUrl: CONFIG.SUPABASE_URL,
      n8nUrl: CONFIG.N8N_BASE_URL,
      aiModel: CONFIG.AI_MODEL
    });
  }

  return true;
}

// Auto-validation au chargement
if (typeof window !== 'undefined') {
  validateConfig();
}

// =====================================================
// INSTRUCTIONS DE CONFIGURATION
// =====================================================

/*
📋 ÉTAPES D'INSTALLATION:

1. COPIER CE FICHIER:
   cd src/
   cp config.example.js config.js

2. SUPABASE:
   - Aller sur: https://supabase.com/dashboard
   - Ouvrir votre projet
   - Settings > API
   - Copier "Project URL" → SUPABASE_URL
   - Copier "anon public" key → SUPABASE_ANON_KEY
   - Exécuter sql/01_schema.sql dans SQL Editor

3. N8N:
   - Déployer les workflows depuis workflows/
   - Noter l'URL de base (ex: https://votreinstance.n8n.cloud)
   - Configurer les credentials Supabase et OpenRouter dans n8n

4. OPENROUTER:
   - Créer compte: https://openrouter.ai
   - Générer API key: https://openrouter.ai/keys
   - Ajouter des crédits
   - Cette clé est utilisée DANS N8N, pas dans le frontend

5. VÉRIFIER:
   - Ouvrir http://localhost:8000/test_setup.html
   - Tous les tests doivent être verts

6. MIGRATION DATABASE (si nécessaire):
   - Suivre SUPABASE_MIGRATION_PLAN.md
   - Exécuter les scripts SQL fournis

📚 DOCUMENTATION:
- Installation complète: INSTALLATION_CHECKLIST.md
- Tests: TEST_RESULTS.md
- Déploiement: DEPLOY_BUNNY.md
- Troubleshooting: TROUBLESHOOTING_AUTH.md

⚠️ SÉCURITÉ:
- NE JAMAIS commiter config.js
- NE JAMAIS partager SUPABASE_ANON_KEY publiquement
- NE JAMAIS utiliser service_role key dans le frontend
*/
