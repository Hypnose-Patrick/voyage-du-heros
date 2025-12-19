# ⚙️ Configuration Setup Guide

## 📋 Fichiers de Configuration

Votre projet utilise **2 types de fichiers de configuration** :

### 1. **config.js** (Développement Local)
```bash
# Copier le template
cd src/
cp config.example.js config.js

# Éditer et remplir vos vraies clés
nano config.js  # ou VS Code
```

**Utilisation :**
- Développement local avec `npm run dev`
- Supporte les modules ES6 (`export/import`)
- **Ignoré par Git** (dans `.gitignore`)

---

### 2. **config.bundle.js** (Déploiement CDN)
```bash
# Copier le template
cd src/
cp config.bundle.example.js config.bundle.js

# Éditer avec les MÊMES clés que config.js
nano config.bundle.js
```

**Utilisation :**
- Déploiement sur Bunny.net ou autre CDN
- Pas de modules ES6 (utilise `window.CONFIG`)
- **Ignoré par Git** (dans `.gitignore`)

---

## 🔐 Clés Requises

### Supabase
1. Aller sur : https://supabase.com/dashboard/project/swhuaseyxprztxehkzjx/settings/api
2. Copier :
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`

**Format attendu :**
```javascript
SUPABASE_URL: 'https://[project-ref].supabase.co'
SUPABASE_ANON_KEY: 'sb_publishable_...' // Commence par sb_publishable_
```

### n8n
1. Noter l'URL de votre instance : `https://n8n.srv824625.hstgr.cloud`
2. Pas besoin de clé API (les webhooks sont publics)

**Format attendu :**
```javascript
N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud'
```

### OpenRouter (Optionnel)
**Note :** Cette clé est utilisée UNIQUEMENT dans les workflows n8n, pas dans le frontend.

1. Aller sur : https://openrouter.ai/keys
2. Créer une API key
3. La mettre dans les **credentials n8n**, pas dans config.js

---

## ✅ Vérification

### Méthode 1 : Page de Test
```bash
npm run dev
```
Puis ouvrir : http://localhost:8000/test_setup.html

### Méthode 2 : Console Browser
1. Ouvrir http://localhost:8000/login-bundle.html
2. F12 → Console
3. Vérifier ces messages :
   - ✅ config.bundle.js chargé
   - ✅ Configuration validée
   - ✅ Supabase client créé

### Méthode 3 : Script Git Status
```bash
git status

# Vous NE devez PAS voir :
# - src/config.js
# - src/config.bundle.js

# Vous DEVEZ voir (si modifiés) :
# - src/config.example.js
# - src/config.bundle.example.js
```

---

## 🚨 Erreurs Courantes

### "Invalid API key"
→ Vérifiez que `SUPABASE_ANON_KEY` est correcte (commence par `sb_publishable_` ou `eyJ...`)

### "Module not found: config.js"
→ Vous n'avez pas copié `config.example.js` vers `config.js`

### "Cannot read property 'SUPABASE_URL' of undefined"
→ Sur CDN : utilisez `login-bundle.html` au lieu de `login.html`

### Fichiers config apparaissent dans git status
→ Vérifiez que `.gitignore` contient bien :
```
src/config.js
src/config.bundle.js
```

---

## 📦 Déploiement

### Local (Dev)
```bash
npm run dev
# Utilise config.js
```

### Bunny.net (Production)
```bash
# Uploader ces fichiers :
1. config.bundle.js → renommer en "config.js"
2. login-bundle.html → renommer en "login.html"
3. index.html, style.css, app.js → tel quel

# Purger le cache CDN
```

**Voir :** [DEPLOY_BUNNY.md](DEPLOY_BUNNY.md) pour détails complets

---

## 🔒 Sécurité

### ✅ OK de Partager (Publiques)
- `SUPABASE_ANON_KEY` → Clé publique, utilisée côté client
- URLs n8n → Webhooks publics avec validation

### ❌ NE JAMAIS Partager
- `SUPABASE_SERVICE_ROLE_KEY` → Accès total à la DB
- `OPENROUTER_API_KEY` → Facturation sur votre compte
- Credentials n8n

### 🛡️ Protection
- ✅ `config.js` et `config.bundle.js` dans `.gitignore`
- ✅ Seuls les templates (`.example.js`) sont commités
- ✅ RLS activé dans Supabase (protection database)

---

## 📚 Fichiers Concernés

```
src/
├── config.example.js           ✅ Commité (template)
├── config.bundle.example.js    ✅ Commité (template)
├── config.js                   ❌ Ignoré (vraies clés)
└── config.bundle.js            ❌ Ignoré (vraies clés)
```

---

## 🆘 Besoin d'Aide ?

- Installation complète : [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)
- Tests : [TEST_RESULTS.md](TEST_RESULTS.md)
- Troubleshooting : [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)
- Migration DB : [SUPABASE_MIGRATION_PLAN.md](SUPABASE_MIGRATION_PLAN.md)

---

**Dernière mise à jour :** 19 décembre 2025
