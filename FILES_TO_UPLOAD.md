# 📦 Fichiers à Uploader sur Bunny.net

## ✅ Fichiers Requis (5 fichiers uniquement)

```
📁 Uploader ces fichiers depuis le dossier src/ :

✅ login.html     (29 KB)  ← PAGE D'ENTRÉE - Commencer ici
✅ index.html     (45 KB)  ← Application principale
✅ style.css      (52 KB)  ← Tous les styles
✅ app.js         (68 KB)  ← Logique métier complète
✅ config.js      (4 KB)   ← Configuration API
```

**Total:** ~198 KB

---

## 🚫 Fichiers à NE PAS Uploader

```
❌ sql/*.sql              → Exécuter dans Supabase, pas sur CDN
❌ workflows/*.json       → Importer dans n8n, pas sur CDN
❌ *.md                   → Documentation locale uniquement
❌ test_setup.html        → Outil de test local uniquement
❌ package.json           → Pas de build nécessaire
❌ deploy/                → Scripts de déploiement locaux
```

---

## 📂 Structure sur Bunny.net

```
Storage Zone: jobseek-hero
└── hero-journey/
    ├── login.html       ← Point d'entrée
    ├── index.html
    ├── style.css
    ├── app.js
    └── config.js
```

**URL finale:** `https://votre-cdn.b-cdn.net/hero-journey/login.html`

---

## ⚡ Déploiement Rapide

### Option 1: Manuel (5 minutes)

1. **Créer Storage Zone**
   - Panel Bunny.net → Storage → Create
   - Nom: `jobseek-hero`

2. **Créer Pull Zone**
   - CDN → Add Pull Zone
   - Lier à `jobseek-hero`

3. **Upload Fichiers**
   - Storage → `jobseek-hero` → Créer dossier `hero-journey/`
   - Drag & drop les 5 fichiers

4. **Activer CORS**
   - Storage → Settings → CORS → Enable

5. **Tester**
   - Ouvrir: `https://votre-cdn.b-cdn.net/hero-journey/login.html`

---

### Option 2: Script (2 minutes)

```bash
# 1. Configurer le script
# Éditer deploy/deploy-bunny.sh:
BUNNY_STORAGE_ZONE="jobseek-hero"
BUNNY_STORAGE_API_KEY="votre-api-key"
BUNNY_CDN_URL="https://votre-cdn.b-cdn.net"

# 2. Lancer
chmod +x deploy/deploy-bunny.sh
./deploy/deploy-bunny.sh
```

**Le script uploade automatiquement les 5 fichiers.**

---

## 🔍 Vérification

Après upload, vérifier que ces URLs fonctionnent:

```
✅ https://votre-cdn.b-cdn.net/hero-journey/login.html
✅ https://votre-cdn.b-cdn.net/hero-journey/style.css
✅ https://votre-cdn.b-cdn.net/hero-journey/app.js
✅ https://votre-cdn.b-cdn.net/hero-journey/config.js
```

---

## ⚙️ Configuration Requise (Avant Upload)

### ✅ Vérifier config.js

Le fichier [src/config.js](src/config.js:8-26) doit contenir:

```javascript
export const CONFIG = {
  SUPABASE_URL: 'https://swhuaseyxprztxehkzjx.supabase.co',  // ✅
  SUPABASE_ANON_KEY: 'sb_publishable_...',  // ✅
  N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud',  // ✅

  API_ENDPOINTS: {
    START_JOURNEY: '/webhook/hero-journey-start',
    SUBMIT_STAGE: '/webhook/hero-journey-stage',
    GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
    GET_JOURNEY: '/webhook/hero-journey-get',
    EXTRACT_STAR: '/webhook/jobseed-extract-star'  // ✅ Nouveau
  }
};
```

**IMPORTANT:** Ces URLs doivent être accessibles depuis internet !

---

## 🔐 Sécurité

### ⚠️ Attention aux Clés API

Le fichier `config.js` contient:
- ✅ `SUPABASE_ANON_KEY` → **OK** de l'exposer (publique)
- ✅ URLs n8n → **OK** (protégées par validation)
- ❌ `OPENROUTER_API_KEY` → **N'est PAS utilisée côté frontend** (uniquement dans n8n)

**Règle:** Seules les clés publiques (anon) sont dans `config.js`.

---

## 🌐 Configuration Supabase (Importante !)

Après déploiement, autoriser l'origine Bunny CDN:

1. Supabase Dashboard → Settings → API
2. **Site URL:** `https://votre-cdn.b-cdn.net`
3. **Redirect URLs:** Ajouter:
   ```
   https://votre-cdn.b-cdn.net/**
   https://votre-cdn.b-cdn.net/hero-journey/login.html
   https://votre-cdn.b-cdn.net/hero-journey/index.html
   ```
4. Sauvegarder

**Sinon:** Erreurs CORS lors de l'authentification !

---

## 📋 Checklist Avant Upload

- [ ] ✅ Les 5 fichiers existent dans `src/`
- [ ] ✅ `config.js` contient les bonnes URLs
- [ ] ✅ Trigger SQL `on_auth_user_created` exécuté dans Supabase
- [ ] ✅ Workflows n8n actifs
- [ ] ✅ Test local OK (http://localhost:8000/src/login.html)
- [ ] ✅ Storage Zone créée sur Bunny.net
- [ ] ✅ Pull Zone créée et liée

---

## 🚀 URLs de Démarrage

**Local (tests):**
```
http://localhost:8000/src/login.html
http://localhost:8000/test_setup.html
```

**Production (après upload):**
```
https://votre-cdn.b-cdn.net/hero-journey/login.html
```

---

## 📞 Besoin d'Aide ?

**Documentation complète:**
- 📖 [DEPLOY_BUNNY.md](DEPLOY_BUNNY.md) - Guide détaillé
- ✅ [QUICK_SETUP_CHECK.md](QUICK_SETUP_CHECK.md) - Checklist
- 🔧 [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) - Dépannage

**Tests automatiques:**
- 🌐 [test_setup.html](test_setup.html) - Vérification config

---

**Récapitulatif:** Seulement 5 fichiers → Upload sur Bunny.net → Configurer CORS → Autoriser dans Supabase → Prêt ! 🎉
