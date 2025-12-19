# Configuration Setup Guide

Guide complet pour configurer le projet JobSeek Hero Journey.

## Table des Matières

1. [Fichiers de Configuration](#fichiers-de-configuration)
2. [Développement Local](#développement-local)
3. [Déploiement CDN](#déploiement-cdn)
4. [Configuration des Services](#configuration-des-services)
5. [Troubleshooting](#troubleshooting)

---

## Fichiers de Configuration

Le projet utilise deux types de fichiers de configuration :

| Fichier | Usage | Format | Environnement |
|---------|-------|--------|---------------|
| `src/config.js` | Développement local | ES6 Module | Dev local |
| `src/config.bundle.js` | Production CDN | Global variable | Production |
| `src/config.example.js` | Template dev | ES6 Module | Template |
| `src/config.bundle.example.js` | Template CDN | Global variable | Template |

**Important**: Les fichiers `config.js` et `config.bundle.js` sont dans `.gitignore` et ne doivent JAMAIS être committés.

---

## Développement Local

### 1. Créer le Fichier de Configuration

```bash
cd src/
cp config.example.js config.js
```

### 2. Éditer les Valeurs

Ouvrez `src/config.js` et remplissez les valeurs :

```javascript
export const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://votre-projet.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGc...',  // Clé publique Supabase

    // n8n Webhooks
    N8N_BASE_URL: 'https://votre-instance.app.n8n.cloud',

    // OpenRouter API
    OPENROUTER_API_KEY: 'sk-or-v1-...',

    // Bunny.net CDN (optionnel)
    BUNNY_CDN_URL: 'https://your-zone.b-cdn.net',
    BUNNY_STORAGE_API_KEY: 'votre-api-key',

    // App Settings
    MIN_INPUT_LENGTH: 50,
    XP_PER_STAGE: 125,
    CREDITS_PER_GENERATION: 1,

    // API Endpoints (ne pas modifier sauf si vous changez les webhooks)
    API_ENDPOINTS: {
        START_JOURNEY: '/webhook/hero-journey-start',
        SUBMIT_STAGE: '/webhook/hero-journey-stage',
        GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
        GET_JOURNEY: '/webhook/hero-journey-get',
        EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'
    },

    // Feature Flags
    ENABLE_DEBUG: true,  // Mettre à true en dev
    ENABLE_ANALYTICS: false
};
```

### 3. Vérifier la Configuration

Utilisez le fichier de test pour vérifier :

```bash
# Ouvrir dans un navigateur
open test_setup.html
```

Le test vérifiera :
- ✅ Fichier config.js existe
- ✅ Toutes les clés requises sont présentes
- ✅ API_ENDPOINTS contient tous les endpoints
- ✅ Connexion Supabase fonctionne

---

## Déploiement CDN

### 1. Créer le Fichier Bundle

```bash
cd src/
cp config.bundle.example.js config.bundle.js
```

### 2. Éditer les Valeurs

Ouvrez `src/config.bundle.js` et remplissez les mêmes valeurs que `config.js` :

```javascript
window.CONFIG = {
    SUPABASE_URL: 'https://votre-projet.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGc...',
    N8N_BASE_URL: 'https://votre-instance.app.n8n.cloud',
    // ... reste de la configuration
    ENABLE_DEBUG: false,  // Toujours false en production
    ENABLE_ANALYTICS: true
};
```

### 3. Upload sur CDN

**Bunny.net** :

```bash
# Utiliser le script de déploiement
./deploy/bunny_deploy.sh

# Ou manuellement via l'API
curl -X PUT \
  -H "AccessKey: votre-api-key" \
  --data-binary "@src/config.bundle.js" \
  "https://storage.bunnycdn.com/votre-zone/config.bundle.js"
```

**CloudFlare Pages / Vercel** :

```bash
# Build et deploy
npm run build
# Suivre les instructions de votre plateforme
```

### 4. Vérifier le Déploiement

```bash
# Tester l'URL du CDN
curl https://votre-zone.b-cdn.net/config.bundle.js
```

Vous devriez voir votre configuration.

---

## Configuration des Services

### 1. Supabase

**Étapes** :

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans `Project Settings > API`
4. Copier :
   - `URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
5. Exécuter le schema SQL :
   ```bash
   # Dans le SQL Editor de Supabase
   # Copier/coller le contenu de sql/01_schema.sql
   ```

**Vérification** :

```javascript
// Console navigateur
const { createClient } = supabase;
const client = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
const { data, error } = await client.auth.getSession();
console.log('Session:', data);
```

### 2. n8n

**Étapes** :

1. Créer un compte sur [n8n.io](https://n8n.io) ou héberger votre instance
2. Importer les workflows depuis `workflows/`
3. Pour chaque workflow :
   - Activer le workflow
   - Copier l'URL du webhook
4. Noter l'URL de base (ex: `https://votre-instance.app.n8n.cloud`)
5. Configurer `N8N_BASE_URL`

**Webhooks requis** :

- `/webhook/hero-journey-start` → Démarre un parcours
- `/webhook/hero-journey-stage` → Soumet une réponse de station
- `/webhook/hero-journey-insights` → Génère les insights finaux
- `/webhook/hero-journey-get` → Récupère un parcours existant
- `/webhook/jobseed-extract-star-v2` → Extrait expériences STAR

### 3. OpenRouter

**Étapes** :

1. Créer un compte sur [openrouter.ai](https://openrouter.ai)
2. Aller dans `Keys` → `Create New Key`
3. Ajouter des crédits (Settings > Credits)
4. Copier la clé → `OPENROUTER_API_KEY`

**Modèles recommandés** :

- `anthropic/claude-3.5-sonnet` - Insights et narratives
- `anthropic/claude-3-haiku` - Extraction STAR (plus rapide)

### 4. Bunny.net (Optionnel)

**Étapes** :

1. Créer un compte sur [bunny.net](https://bunny.net)
2. Créer une **Pull Zone** (CDN)
   - Nom : `jobseek-hero-journey`
   - Type : Standard
3. Créer un **Storage Zone**
   - Région : Choisir selon votre audience
4. Lier Storage Zone à Pull Zone
5. Générer une API Key (Account > API)

**Configuration** :

```javascript
BUNNY_CDN_URL: 'https://jobseek-hero.b-cdn.net',
BUNNY_STORAGE_API_KEY: 'votre-storage-api-key'
```

---

## Troubleshooting

### Erreur : "unexpected end of JSON input"

**Cause** : Configuration incomplète ou manquante

**Solutions** :

1. Vérifier que `config.js` existe :
   ```bash
   ls -la src/config.js
   ```

2. Vérifier que `API_ENDPOINTS` est défini :
   ```javascript
   console.log(CONFIG.API_ENDPOINTS);
   // Doit afficher un objet avec START_JOURNEY, etc.
   ```

3. Vérifier la structure :
   ```javascript
   // config.js doit exporter CONFIG avec API_ENDPOINTS
   export const CONFIG = {
       // ...
       API_ENDPOINTS: {
           START_JOURNEY: '/webhook/hero-journey-start',
           // ... tous les endpoints
       }
   };
   ```

### Erreur : "Configuration incomplète : API_ENDPOINTS manquant"

**Cause** : Le fichier `config.js` existe mais n'a pas la propriété `API_ENDPOINTS`

**Solution** :

1. Comparer votre `config.js` avec `config.example.js` :
   ```bash
   diff src/config.js src/config.example.js
   ```

2. Ajouter la section manquante :
   ```javascript
   API_ENDPOINTS: {
       START_JOURNEY: '/webhook/hero-journey-start',
       SUBMIT_STAGE: '/webhook/hero-journey-stage',
       GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
       GET_JOURNEY: '/webhook/hero-journey-get',
       EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'
   }
   ```

### Erreur : "Endpoint non défini"

**Cause** : Un endpoint spécifique manque dans `API_ENDPOINTS`

**Solution** :

Vérifier que tous les endpoints requis sont présents :

```javascript
const requiredEndpoints = [
    'START_JOURNEY',
    'SUBMIT_STAGE',
    'GENERATE_INSIGHTS',
    'EXTRACT_STAR'
];

requiredEndpoints.forEach(ep => {
    console.log(ep, ':', CONFIG.API_ENDPOINTS[ep]);
});
```

### Erreur de CORS

**Cause** : Requêtes bloquées par la politique CORS

**Solution** :

1. Vérifier que `N8N_BASE_URL` est accessible depuis le domaine
2. Configurer CORS dans n8n :
   - Aller dans Settings > Security
   - Ajouter votre domaine dans "Allowed Origins"

### Erreur Supabase Auth

**Cause** : Clés Supabase invalides ou RLS mal configuré

**Solutions** :

1. Vérifier les clés :
   ```javascript
   console.log('URL:', CONFIG.SUPABASE_URL);
   console.log('Key:', CONFIG.SUPABASE_ANON_KEY.substring(0, 20) + '...');
   ```

2. Vérifier RLS (Row Level Security) :
   - Aller dans Supabase > Authentication > Policies
   - Vérifier que les politiques permettent l'accès

---

## Sécurité

### Bonnes Pratiques

1. **Ne jamais committer** `config.js` ou `config.bundle.js`
2. **Utiliser des variables d'environnement** pour CI/CD
3. **Régénérer les clés** si exposées accidentellement
4. **Activer RLS** sur toutes les tables Supabase
5. **Limiter les webhooks n8n** par IP si possible

### Variables Sensibles

Les clés suivantes sont **publiques** (peuvent être exposées côté client) :
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY` (clé anon/public seulement)
- ✅ `N8N_BASE_URL`
- ✅ `BUNNY_CDN_URL`

Les clés suivantes sont **privées** (ne doivent JAMAIS être exposées) :
- ❌ `SUPABASE_SERVICE_ROLE_KEY` (si utilisée)
- ❌ `BUNNY_STORAGE_API_KEY`
- ❌ `OPENROUTER_API_KEY`

**Note** : `OPENROUTER_API_KEY` doit être utilisée **uniquement dans n8n** (backend), jamais dans le code frontend.

---

## Checklist de Configuration

Avant de lancer l'application :

- [ ] ✅ Fichier `config.js` créé et rempli
- [ ] ✅ Supabase configuré et schema SQL exécuté
- [ ] ✅ n8n workflows déployés et actifs
- [ ] ✅ OpenRouter API key configurée dans n8n
- [ ] ✅ Tous les webhooks n8n testés
- [ ] ✅ `test_setup.html` affiche tous les tests en vert
- [ ] ✅ Connexion Supabase fonctionne
- [ ] ✅ Premier test de parcours réussi

Pour la production :

- [ ] ✅ `config.bundle.js` créé avec `ENABLE_DEBUG: false`
- [ ] ✅ Fichiers uploadés sur CDN
- [ ] ✅ URLs CDN testées
- [ ] ✅ CORS configuré correctement
- [ ] ✅ RLS activé sur Supabase
- [ ] ✅ Monitoring configuré (optionnel)

---

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation n8n](https://docs.n8n.io)
- [Documentation OpenRouter](https://openrouter.ai/docs)
- [Documentation Bunny.net](https://docs.bunny.net)
- [Guide de déploiement](./DEPLOY_BUNNY.md)
- [Architecture du projet](./ARCHITECTURE.md)

---

**Dernière mise à jour** : 2024-12-19
