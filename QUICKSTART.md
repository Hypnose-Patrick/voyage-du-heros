# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de déployer l'application en **moins de 30 minutes**.

## ✅ Checklist Prérequis

- [ ] Compte Supabase (gratuit)
- [ ] Instance n8n accessible
- [ ] Clé API OpenRouter
- [ ] Compte Bunny.net (optionnel pour test local)

---

## 📝 Étape 1 : Configuration Supabase (10 min)

### 1.1 Créer le projet

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL du projet : `https://swhuaseyxprztxehkzjx.supabase.co`

### 1.2 Exécuter les scripts SQL

Dans **SQL Editor** de Supabase :

```sql
-- 1. Copier-coller le contenu de sql/01_schema.sql
-- Exécuter (Ctrl+Enter)

-- 2. Copier-coller le contenu de sql/02_functions.sql
-- Exécuter

-- 3. Copier-coller le contenu de sql/03_stations_data.sql
-- Exécuter
```

### 1.3 Récupérer les clés API

1. Settings > API
2. Noter :
   - `anon key` (public) → pour le frontend
   - `service_role key` (secret) → pour n8n

✅ **Supabase configuré !**

---

## 🔧 Étape 2 : Configuration n8n (10 min)

### 2.1 Ajouter les credentials

Dans n8n :

**Supabase Credential :**
1. Credentials > New Credential
2. Type : "HTTP Request"
3. Name : "Supabase Hero Journey"
4. Auth Type : "Header Auth"
5. Header :
   - Name : `Authorization`
   - Value : `Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`

**OpenRouter Credential :**
1. Credentials > New Credential
2. Type : "HTTP Request"
3. Name : "OpenRouter"
4. Auth Type : "Header Auth"
5. Header :
   - Name : `Authorization`
   - Value : `Bearer YOUR_OPENROUTER_KEY`

### 2.2 Variables d'environnement (optionnel)

Settings > Environment Variables :
```
SUPABASE_URL=https://swhuaseyxprztxehkzjx.supabase.co
OPENROUTER_API_KEY=your_key
```

### 2.3 Créer les workflows

**Important** : Pour ce guide rapide, on va créer UNE SEULE workflow simplifiée pour tester.

1. Workflows > New Workflow
2. Nom : "Hero Journey - Submit Stage (Simple)"

**Ajouter les nodes :**

```
1. Webhook (Trigger)
   - Path: /hero-journey-test
   - Method: POST
   
2. HTTP Request (OpenRouter)
   - Method: POST
   - URL: https://openrouter.ai/api/v1/chat/completions
   - Credential: OpenRouter
   - Body JSON:
   {
     "model": "anthropic/claude-3.5-sonnet",
     "messages": [
       {
         "role": "user",
         "content": "{{$json.body.user_input}}"
       }
     ]
   }
   
3. Respond to Webhook
   - Body JSON:
   {
     "success": true,
     "response": "{{$node['HTTP Request'].json.choices[0].message.content}}"
   }
```

3. **Save** et **Activate**
4. Noter l'URL du webhook : `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-test`

✅ **n8n configuré !**

---

## 💻 Étape 3 : Configuration Frontend (5 min)

### 3.1 Éditer config.js

Ouvrir `src/config.js` et remplacer :

```javascript
export const CONFIG = {
  SUPABASE_URL: 'https://swhuaseyxprztxehkzjx.supabase.co',
  SUPABASE_ANON_KEY: 'VOTRE_ANON_KEY_ICI',
  
  N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud',
  N8N_WEBHOOKS: {
    SUBMIT_STAGE: '/webhook/hero-journey-test',
    // ... autres webhooks commentés pour l'instant
  },
  
  DEBUG_MODE: true,
};
```

✅ **Frontend configuré !**

---

## 🧪 Étape 4 : Test en Local (5 min)

### 4.1 Créer un utilisateur test

Dans Supabase :
1. Authentication > Users > Add User
2. Email : `test@example.com`
3. Password : `Test123456!`
4. Create User

### 4.2 Ajouter des crédits

Dans SQL Editor :
```sql
INSERT INTO user_subscriptions (user_id, plan_type, credits_remaining, credits_total)
SELECT id, 'free', 100, 100
FROM auth.users
WHERE email = 'test@example.com';
```

### 4.3 Lancer le serveur local

**Windows (PowerShell) :**
```powershell
cd src
python -m http.server 8000
```

**Mac/Linux :**
```bash
cd src
python3 -m http.server 8000
```

Ou avec Node.js :
```bash
npx serve src
```

### 4.4 Tester l'application

1. Ouvrir : http://localhost:8000
2. Se connecter avec `test@example.com` / `Test123456!`
3. Cliquer "Démarrer le parcours"
4. Compléter la station 1

✅ **Application fonctionnelle en local !**

---

## 🌐 Étape 5 : Déploiement Production (optionnel)

### Option A : Bunny.net CDN

```powershell
# Windows
$env:BUNNY_STORAGE_PASSWORD = "your_password"
.\deploy\deploy-bunny.ps1
```

### Option B : Netlify / Vercel

1. Fork le repo sur GitHub
2. Connecter à Netlify/Vercel
3. Build settings :
   - Build command : (vide)
   - Publish directory : `src`
4. Environment variables :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - etc.

---

## 🐛 Dépannage Rapide

### Erreur "Session expirée"
→ Vérifier que `SUPABASE_ANON_KEY` est correct dans `config.js`

### Erreur "Crédits insuffisants"
→ Exécuter la requête SQL de l'étape 4.2

### IA ne répond pas
→ Vérifier que le webhook n8n est activé et accessible

### Erreur CORS
→ Dans Supabase : Settings > API > CORS > Ajouter `http://localhost:8000`

---

## 📚 Prochaines Étapes

Une fois que le test fonctionne :

1. **Créer les 4 workflows complets** (voir `workflows/README.md`)
2. **Configurer l'authentification** complète
3. **Implémenter le système de paiement** pour les crédits
4. **Déployer en production**

---

## 💡 Conseils

- Commencez simple : 1 workflow, 1 station
- Testez chaque étape individuellement
- Activez `DEBUG_MODE: true` dans config.js
- Utilisez la console du navigateur (F12) pour voir les erreurs
- Consultez les logs n8n pour débugger les workflows

---

## 🆘 Besoin d'aide ?

- Documentation complète : `README.md`
- Workflows n8n : `workflows/README.md`
- Email : patrick@ddc-coaching.ch

---

**Temps total estimé : 30 minutes** ⏱️

Bon déploiement ! 🚀
