// =====================================================
// JobSeek Hero Journey - Configuration
// =====================================================

// IMPORTANT: Renommer ce fichier en "config.js" et remplir les valeurs
// NE PAS commiter config.js dans Git (ajouter à .gitignore)

export const CONFIG = {
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
    MIN_INPUT_LENGTH: 50, // Minimum caractères pour une réponse
    XP_PER_STAGE: 125,
    CREDITS_PER_GENERATION: 1,
    
    // Feature Flags
    ENABLE_DEBUG: false,
    ENABLE_ANALYTICS: true
};

// =====================================================
// EXEMPLE DE CONFIGURATION COMPLETE
// =====================================================

/*
export const CONFIG = {
    SUPABASE_URL: 'https://xyzabcdefg.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    N8N_BASE_URL: 'https://patrick-ddc.app.n8n.cloud',
    OPENROUTER_API_KEY: 'sk-or-v1-abc123...',
    BUNNY_CDN_URL: 'https://jobseek-assets.b-cdn.net',
    BUNNY_STORAGE_API_KEY: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    MIN_INPUT_LENGTH: 50,
    XP_PER_STAGE: 125,
    CREDITS_PER_GENERATION: 1,
    ENABLE_DEBUG: false,
    ENABLE_ANALYTICS: true
};
*/

// =====================================================
// INSTRUCTIONS DE CONFIGURATION
// =====================================================

/*
1. SUPABASE:
   - Créer un projet sur https://supabase.com
   - Copier l'URL du projet (Project Settings > API)
   - Copier la clé anon/public (Project Settings > API)
   - Exécuter le script SQL dans sql/01_schema.sql

2. N8N:
   - Déployer les workflows depuis workflows/
   - Configurer les webhooks
   - Noter l'URL de base de votre instance n8n

3. OPENROUTER:
   - Créer un compte sur https://openrouter.ai
   - Générer une API key
   - Ajouter des crédits

4. BUNNY.NET (optionnel):
   - Créer un compte sur https://bunny.net
   - Créer une Pull Zone
   - Créer un Storage Zone
   - Générer une API key

5. RENOMMER CE FICHIER:
   - Renommer config.example.js en config.js
   - Ajouter config.js à .gitignore
*/
