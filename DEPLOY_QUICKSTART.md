# 🚀 GUIDE DE DÉPLOIEMENT RAPIDE

## ✅ Ce qui a été corrigé

1. **`sql/01_schema.sql`** - Schéma de base créé avec toutes les tables + RLS
2. **`src/config.js`** - Export module corrigé + clés API ajoutées
3. **`src/app.js`** - URLs des endpoints corrigées
4. **4 nouveaux workflows n8n** importables directement :
   - `n8n-01-start-journey.json`
   - `n8n-02-submit-stage.json`
   - `n8n-03-generate-insights.json`
   - `n8n-04-get-journey.json`

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### ÉTAPE 1 : Supabase (10 min)

1. Ouvre Supabase : https://supabase.com/dashboard
2. Sélectionne ton projet `swhuaseyxprztxehkzjx`
3. Va dans **SQL Editor**
4. Copie-colle le contenu de `sql/01_schema.sql`
5. Clique **Run**
6. Vérifie que les tables sont créées : `user_subscriptions`, `hero_journeys`, `journey_stages`, `icare_profiles`, `pro_insights`

### ÉTAPE 2 : n8n (15 min)

1. Ouvre n8n : https://n8n.srv824625.hstgr.cloud
2. **Créer les credentials Supabase** :
   - Settings → Credentials → Add credential → Supabase
   - URL: `https://swhuaseyxprztxehkzjx.supabase.co`
   - Service Role Key: (va dans Supabase → Settings → API → service_role)
   - Nomme-la "Supabase account"

3. **Importer les 4 workflows** :
   - Pour chaque fichier `n8n-0X-*.json` :
     - Workflows → Import from file
     - Sélectionne le fichier
     - **Connecte les nodes Supabase** à tes credentials
     - Active le workflow (toggle ON)

4. **Noter les URLs des webhooks** :
   Après activation, chaque webhook aura une URL du type :
   ```
   https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-start
   https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-stage
   https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-insights
   https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-get
   ```

### ÉTAPE 3 : Test local (5 min)

1. Ouvre un terminal dans `jobseek-hero-journey/src/`
2. Lance un serveur local :
   ```bash
   npx serve .
   ```
   ou
   ```bash
   python -m http.server 8080
   ```
3. Ouvre http://localhost:8080 (ou :3000 si serve)
4. Ouvre la console (F12) pour voir les erreurs

### ÉTAPE 4 : Créer un utilisateur test

1. Dans Supabase → Authentication → Users → Invite user
2. Crée un utilisateur avec email/password
3. Le trigger auto-créera un abonnement avec 5 crédits

---

## ⚠️ POINTS D'ATTENTION

### Clé Supabase Service Role
Les workflows n8n ont besoin de la **service_role key** (pas la anon key) pour bypass le RLS.
→ Supabase → Settings → API → service_role (secret)

### CORS
Si tu as des erreurs CORS, ajoute dans Supabase → Settings → API :
```
Allowed origins: *
```

### Authentification
Le frontend redirige vers `/login` si pas connecté.
Tu dois avoir une page login.html fonctionnelle ou désactiver temporairement le check.

---

## 🧪 TEST RAPIDE SANS AUTH (dev only)

Pour tester sans authentification, modifie temporairement `app.js` :

```javascript
// Dans la fonction init(), commente :
// const isAuthenticated = await checkAuth();
// if (!isAuthenticated) return;

// Et ajoute un user mock :
state.user = { id: 'ton-user-id-de-test' };
state.session = { access_token: 'fake-token' };
```

---

## 📁 STRUCTURE FINALE

```
jobseek-hero-journey/
├── sql/
│   ├── 01_schema.sql          ✅ NOUVEAU - Tables principales
│   ├── 02_functions.sql       (optionnel)
│   ├── 02_reference_data.sql  (optionnel)
│   └── ...
├── src/
│   ├── index.html             ✅ OK
│   ├── style.css              ✅ OK
│   ├── app.js                 ✅ CORRIGÉ - URLs endpoints
│   ├── config.js              ✅ CORRIGÉ - Export + clés API
│   └── login.html             (à créer si besoin)
├── workflows/
│   ├── n8n-01-start-journey.json    ✅ NOUVEAU - Importable
│   ├── n8n-02-submit-stage.json     ✅ NOUVEAU - Importable
│   ├── n8n-03-generate-insights.json ✅ NOUVEAU - Importable
│   └── n8n-04-get-journey.json      ✅ NOUVEAU - Importable
└── DEPLOY_QUICKSTART.md       ✅ CE FICHIER
```

---

## 🔑 CREDENTIALS

**Supabase URL:** `https://swhuaseyxprztxehkzjx.supabase.co`
**Supabase Anon Key:** `sb_publishable_kuiqWMn5XTLDLEtbfPT-GA_ccpMijxt`
**OpenRouter API Key:** `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`
**n8n URL:** `https://n8n.srv824625.hstgr.cloud`

---

## ❓ BESOIN D'AIDE ?

Si quelque chose ne marche pas :
1. Vérifie la console du navigateur (F12)
2. Vérifie les logs d'exécution dans n8n
3. Vérifie que les tables Supabase existent bien
