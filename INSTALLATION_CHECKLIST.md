# ✅ CHECKLIST INSTALLATION - JobSeek Hero Journey

## 📋 Avant de Commencer

- [ ] Compte Supabase actif (https://swhuaseyxprztxehkzjx.supabase.co)
- [ ] Instance n8n accessible (https://n8n.srv824625.hstgr.cloud)
- [ ] Compte OpenRouter avec crédits
- [ ] Compte Bunny.net (optionnel pour déploiement)
- [ ] 45 minutes de temps disponible

---

## 🗄️ ÉTAPE 1 : Configuration Supabase (15 min)

### 1.1 Récupérer les Clés API

- [ ] Aller sur https://swhuaseyxprztxehkzjx.supabase.co
- [ ] Settings > API
- [ ] Copier **anon public key** → Sauvegarder dans un fichier texte
- [ ] Copier **service_role key** (secret) → Sauvegarder SÉCURISÉ
- [ ] Ne JAMAIS exposer la service_role key publiquement

### 1.2 Exécuter les Scripts SQL

- [ ] Ouvrir SQL Editor dans Supabase
- [ ] Coller et exécuter `sql/01_schema.sql`
  - ✅ Devrait créer 5 tables
  - ✅ Devrait créer 1 trigger
  - ✅ Devrait activer RLS
- [ ] Coller et exécuter `sql/02_reference_data.sql`
  - ✅ Devrait insérer 12 stations
  - ✅ Devrait insérer 3 plans
- [ ] Coller et exécuter `sql/03_functions.sql`
  - ✅ Devrait créer 8 fonctions

### 1.3 Vérification Supabase

```sql
-- Exécuter dans SQL Editor pour vérifier
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Devrait retourner : hero_journeys, journey_stages, icare_profiles, 
--                     pro_insights, user_subscriptions, stations_config, plan_types

SELECT COUNT(*) FROM stations_config;
-- Devrait retourner : 12

SELECT COUNT(*) FROM plan_types;
-- Devrait retourner : 3
```

- [ ] **5 tables** créées ✅
- [ ] **12 stations** configurées ✅
- [ ] **3 plans** configurés ✅
- [ ] **Fonctions** créées ✅

---

## 🔄 ÉTAPE 2 : Configuration n8n (20 min)

### 2.1 Créer les Credentials

#### Credential 1 : Supabase

- [ ] Dans n8n : Credentials > New Credential
- [ ] Type : **HTTP Request**
- [ ] Nom : `Supabase Service Role`
- [ ] Authentication : `Generic Credential Type`
- [ ] Ajouter header :
  ```
  Name: apikey
  Value: [VOTRE_SERVICE_ROLE_KEY_ICI]
  ```
- [ ] Sauvegarder

#### Credential 2 : OpenRouter

- [ ] Aller sur https://openrouter.ai/keys
- [ ] Créer une nouvelle clé API
- [ ] Copier la clé
- [ ] Dans n8n : New Credential
- [ ] Type : **HTTP Request**
- [ ] Nom : `OpenRouter API`
- [ ] Authentication : `Header Auth`
- [ ] Header :
  ```
  Name: Authorization
  Value: Bearer [VOTRE_OPENROUTER_KEY_ICI]
  ```
- [ ] Sauvegarder

### 2.2 Configurer les Variables d'Environnement

- [ ] Dans n8n : Settings > Variables
- [ ] Ajouter les variables suivantes :

```
SUPABASE_URL = https://swhuaseyxprztxehkzjx.supabase.co
AI_MODEL = anthropic/claude-3.5-sonnet
```

### 2.3 Créer les 4 Workflows

**Pour chaque workflow** :

#### Workflow 1 : Start Journey
- [ ] Créer nouveau workflow
- [ ] Nom : `Hero Journey - Start`
- [ ] Suivre instructions dans `workflows/01_start_journey.md`
- [ ] Ajouter tous les nodes
- [ ] Configurer Webhook → Activer workflow
- [ ] **Noter l'URL webhook** : `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start`

#### Workflow 2 : Submit Stage
- [ ] Créer nouveau workflow
- [ ] Nom : `Hero Journey - Submit Stage`
- [ ] Suivre instructions dans `workflows/02_submit_stage.md`
- [ ] Configurer appel OpenRouter
- [ ] Activer workflow
- [ ] **Noter l'URL webhook** : `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/stage`

#### Workflow 3 : Generate Insights
- [ ] Créer nouveau workflow
- [ ] Nom : `Hero Journey - Generate Insights`
- [ ] Suivre instructions dans `workflows/03_generate_insights.md`
- [ ] Activer workflow
- [ ] **Noter l'URL webhook** : `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/insights`

#### Workflow 4 : Get Journey
- [ ] Créer nouveau workflow
- [ ] Nom : `Hero Journey - Get Journey`
- [ ] Suivre instructions dans `workflows/04_get_journey.md`
- [ ] Activer workflow
- [ ] **Noter l'URL webhook** : `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/get`

### 2.4 Vérification n8n

- [ ] Les 4 workflows sont **actifs** (switch vert)
- [ ] Les 4 webhooks sont **accessibles** (test curl)
- [ ] Les credentials sont **configurés correctement**

**Test rapide** :
```bash
curl https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start
# Devrait retourner une erreur JSON (normal sans auth)
```

---

## 💻 ÉTAPE 3 : Configuration Frontend (5 min)

### 3.1 Éditer config.js

- [ ] Ouvrir `src/config.js`
- [ ] Remplacer `VOTRE_SUPABASE_ANON_KEY_ICI` par votre anon key
- [ ] Remplacer `VOTRE_OPENROUTER_KEY_ICI` par votre OpenRouter key
- [ ] Vérifier que les URLs n8n sont correctes
- [ ] Sauvegarder le fichier

**Le fichier devrait ressembler à** :
```javascript
const CONFIG = {
  SUPABASE_URL: 'https://swhuaseyxprztxehkzjx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud',
  // ...
```

### 3.2 Test Local

- [ ] Ouvrir `src/index.html` dans Chrome/Firefox
- [ ] Ouvrir DevTools Console (F12)
- [ ] Vérifier qu'il n'y a **pas d'erreurs rouges**
- [ ] Le design devrait s'afficher (dark theme)

**Note** : L'authentification ne fonctionnera pas encore (normal)

---

## 🧪 ÉTAPE 4 : Tests (5 min)

### 4.1 Créer Utilisateur Test

Dans Supabase SQL Editor :

```sql
-- Créer un user test
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'test@jobseek.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Vérifier abonnement créé automatiquement
SELECT * FROM user_subscriptions 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Devrait retourner 1 ligne avec 5 crédits
```

- [ ] User test créé ✅
- [ ] Abonnement Free créé automatiquement ✅
- [ ] 5 crédits disponibles ✅

### 4.2 Test Workflow Start Journey

**Option 1 : Via curl (sans JWT)**

Temporairement, commentez la vérification JWT dans le workflow n8n, puis :

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000001"}'
```

**Réponse attendue** :
```json
{
  "success": true,
  "journey_id": "uuid-généré",
  "current_stage": 1,
  "credits_remaining": 4
}
```

- [ ] Workflow Start Journey fonctionne ✅
- [ ] Journey créé dans Supabase ✅
- [ ] Profil ICARE créé ✅
- [ ] Crédits décrementés (5 → 4) ✅

### 4.3 Test Workflow Submit Stage

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/stage \
  -H "Content-Type: application/json" \
  -d '{
    "journey_id": "uuid-du-journey-créé",
    "stage_number": 1,
    "user_input": "Je suis développeur web depuis 5 ans. J'\''aime coder mais je stagne professionnellement.",
    "icare_profile": {
      "identite": 50,
      "capacites": 50,
      "appartenance": 50,
      "risque": 50,
      "estime": 50
    }
  }'
```

**Réponse attendue** :
```json
{
  "success": true,
  "narrative": "Votre situation révèle...",
  "insight": "Focus sur...",
  "new_icare_profile": {...}
}
```

- [ ] Workflow Submit Stage fonctionne ✅
- [ ] IA génère feedback cohérent ✅
- [ ] Profil ICARE mis à jour ✅
- [ ] Stage sauvegardé dans DB ✅

---

## 🚀 ÉTAPE 5 : Déploiement (Optionnel)

### 5.1 Configuration Bunny.net

- [ ] Créer Storage Zone : `jobseek-assets`
- [ ] Créer Pull Zone : `jobseek-hero`
- [ ] Configurer Custom Hostname : `hero.jobseek.online`
- [ ] Récupérer Storage Password
- [ ] Récupérer Pull Zone ID
- [ ] Récupérer API Key

### 5.2 Éditer Script Déploiement

- [ ] Ouvrir `deploy/deploy-bunny.sh`
- [ ] Remplacer `YOUR_BUNNY_STORAGE_PASSWORD_HERE`
- [ ] Remplacer `YOUR_PULL_ZONE_ID_HERE`
- [ ] Remplacer `YOUR_BUNNY_API_KEY_HERE`
- [ ] Sauvegarder

### 5.3 Déployer

```bash
cd deploy
chmod +x deploy-bunny.sh
./deploy-bunny.sh
```

- [ ] Upload réussi ✅
- [ ] Cache purgé ✅
- [ ] Application accessible sur https://hero.jobseek.online ✅

### 5.4 Configurer DNS

- [ ] Ajouter CNAME dans votre DNS :
  ```
  hero.jobseek.online → jobseek-hero.b-cdn.net
  ```
- [ ] Attendre propagation (2-5 minutes)

---

## 📊 ÉTAPE 6 : Monitoring

### 6.1 Supabase

- [ ] Dashboard > Database : Vérifier les journeys créés
- [ ] Dashboard > Auth : Vérifier les utilisateurs
- [ ] Table Editor > user_subscriptions : Surveiller crédits

### 6.2 n8n

- [ ] Executions : Voir historique des workflows
- [ ] Vérifier qu'il n'y a pas d'erreurs

### 6.3 OpenRouter

- [ ] Dashboard : https://openrouter.ai/dashboard
- [ ] Vérifier consommation de crédits
- [ ] Recharger si nécessaire

---

## ✅ VALIDATION FINALE

### Fonctionnalités Testées

- [ ] Un utilisateur peut créer un compte
- [ ] Un utilisateur peut démarrer un nouveau parcours
- [ ] Les 12 stations s'affichent correctement
- [ ] L'utilisateur peut répondre à chaque station
- [ ] L'IA génère des feedbacks pertinents
- [ ] Le profil ICARE se met à jour visuellement
- [ ] La progression s'affiche correctement
- [ ] La synthèse finale est générée après station 12
- [ ] Les crédits sont correctement consommés
- [ ] L'application est responsive (mobile)

### Qualité Code

- [ ] Aucune erreur dans la console navigateur
- [ ] Aucune erreur dans les logs n8n
- [ ] Design cohérent et professionnel
- [ ] Temps de réponse acceptable (<10s par station)

---

## 🎉 INSTALLATION COMPLÈTE !

**Si toutes les cases sont cochées**, votre application JobSeek Hero Journey est **opérationnelle** et prête à accueillir vos premiers utilisateurs !

---

## 🆘 En Cas de Problème

### Support Disponible

- **Documentation** : Consultez `README.md` et `QUICK_START.md`
- **Workflows** : Détails dans `workflows/*.md`
- **Troubleshooting** : Section dédiée dans `README.md`

### Problèmes Fréquents

**"CORS error"** → Configurer headers CORS dans n8n
**"RLS policy violation"** → Vérifier que les policies sont créées
**"Crédits insuffisants"** → Recharger via SQL ou interface admin
**"OpenRouter timeout"** → Augmenter timeout dans workflow

---

## 📅 Prochaines Étapes

Après validation :

1. **Intégrer authentification** (Google, Magic Link)
2. **Ajouter analytics** (Plausible, Umami)
3. **Implémenter export PDF** (jsPDF)
4. **Créer dashboard admin**
5. **Optimiser coûts IA** (cache, Haiku pour certaines stations)

---

**Temps Total Estimé** : 45-60 minutes  
**Statut** : ✅ Prêt pour production

---

🚀 **Bonne chance avec le lancement de JobSeek Hero Journey !**
