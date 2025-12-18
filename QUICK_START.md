# Guide de Démarrage Rapide - JobSeek Hero Journey

Ce guide vous permet de lancer l'application en moins de 30 minutes.

## ⚡ Checklist Installation Rapide

### 1. Supabase (10 min)

- [ ] Créer projet Supabase ou utiliser existant
- [ ] Copier l'URL du projet : `https://swhuaseyxprztxehkzjx.supabase.co`
- [ ] Récupérer les clés dans Settings > API :
  - `anon key` (public)
  - `service_role key` (secret)
- [ ] Dans SQL Editor, exécuter dans l'ordre :
  ```bash
  sql/01_schema.sql
  sql/02_reference_data.sql
  sql/03_functions.sql
  ```
- [ ] Vérifier que les tables sont créées : `hero_journeys`, `journey_stages`, etc.

### 2. n8n (10 min)

- [ ] Accéder à votre instance n8n : `https://n8n.srv824625.hstgr.cloud`
- [ ] Créer credentials Supabase :
  - Type : HTTP Header Auth
  - Header : `apikey`
  - Value : `<service_role_key>`
- [ ] Créer credentials OpenRouter :
  - Type : HTTP Header Auth
  - Header : `Authorization`
  - Value : `Bearer <openrouter_key>`
- [ ] Ajouter variables environnement (Settings > Variables) :
  ```
  SUPABASE_URL=https://swhuaseyxprztxehkzjx.supabase.co
  AI_MODEL=anthropic/claude-3.5-sonnet
  ```
- [ ] Recréer les 4 workflows depuis `workflows/*.md`
- [ ] Activer tous les workflows
- [ ] Noter les URLs webhook générées

### 3. Frontend (5 min)

- [ ] Aller dans `src/`
- [ ] Copier `config.example.js` → `config.js`
- [ ] Éditer `config.js` :
  ```javascript
  SUPABASE_URL: 'https://swhuaseyxprztxehkzjx.supabase.co',
  SUPABASE_ANON_KEY: '<anon_key_ici>',
  N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud'
  ```
- [ ] Ouvrir `index.html` dans un navigateur pour tester localement

### 4. Tests (5 min)

#### Test 1 : Créer un utilisateur test dans Supabase

```sql
-- Dans Supabase SQL Editor
-- Créer un user test (si pas déjà fait)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
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

-- Vérifier que l'abonnement a été créé automatiquement
SELECT * FROM user_subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000001';
```

#### Test 2 : Appeler le webhook Start Journey

```bash
# Récupérer un JWT token depuis Supabase (ou utiliser un vrai login)
# Pour test, vous pouvez temporairement désactiver auth dans app.js

curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000001"}'
```

**Réponse attendue** :
```json
{
  "success": true,
  "journey_id": "uuid-generated",
  "current_stage": 1,
  "credits_remaining": 4,
  "icare_profile": {...}
}
```

#### Test 3 : Soumettre une station

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/stage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "journey_id": "uuid-from-previous-response",
    "stage_number": 1,
    "user_input": "Je suis développeur web depuis 5 ans mais je me sens en stagnation professionnelle.",
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
  "new_icare_profile": {...},
  "next_stage": 2
}
```

## 🚦 Vérification Étape par Étape

### Supabase ✅

Vérifiez que :
- [ ] Les 5 tables principales existent
- [ ] La table `stations_config` contient 12 lignes
- [ ] Le trigger `on_auth_user_created` existe
- [ ] Les fonctions `check_and_consume_credit()` etc. existent

**Commande SQL pour vérifier** :
```sql
-- Vérifier tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Vérifier stations
SELECT stage_number, title FROM stations_config ORDER BY stage_number;

-- Vérifier fonctions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
```

### n8n ✅

Vérifiez que :
- [ ] Les 4 workflows sont visibles dans la liste
- [ ] Les workflows sont "Active" (switch vert)
- [ ] Les credentials Supabase et OpenRouter sont configurés
- [ ] Les URLs webhook sont accessibles (test avec curl)

**Test webhook** :
```bash
# Test simple de connexion
curl https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start
# Devrait retourner une erreur JSON (normal sans auth)
```

### Frontend ✅

Vérifiez que :
- [ ] `config.js` existe (pas `config.example.js`)
- [ ] Les URLs dans config.js sont correctes
- [ ] L'ouverture d'`index.html` ne montre pas d'erreur console
- [ ] Le design s'affiche correctement (dark theme)

## 🎯 Déploiement Production

Une fois les tests validés :

### 1. Préparer Bunny.net

```bash
cd deploy
nano deploy-bunny.sh  # Configurer vos credentials
chmod +x deploy-bunny.sh
./deploy-bunny.sh
```

### 2. Configurer DNS

Ajoutez un CNAME dans votre DNS :
```
hero.jobseek.online → jobseek-hero.b-cdn.net
```

### 3. Vérifier Déploiement

Après 2-5 minutes :
```bash
curl https://hero.jobseek.online
```

Devrait retourner le HTML de l'application.

## 📊 Monitoring

### Supabase

- Dashboard > Database > Tables : Voir les journeys créés
- Auth > Users : Voir les utilisateurs inscrits
- Logs : Surveiller les erreurs RLS

### n8n

- Executions : Voir l'historique de chaque workflow
- Logs : Identifier les erreurs API

### OpenRouter

- Dashboard : https://openrouter.ai/dashboard
- Usage : Voir consommation et coûts
- Credits : Recharger si nécessaire

## ⚠️ Problèmes Courants

### "CORS error" dans la console

**Cause** : n8n ne permet pas les requêtes depuis le domaine frontend

**Solution** : Ajouter CORS headers dans les nodes "Respond to Webhook" :
```
Access-Control-Allow-Origin: https://hero.jobseek.online
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

### "RLS policy violation"

**Cause** : Row Level Security bloque une requête

**Solution** : Vérifier que les policies sont créées :
```sql
SELECT * FROM pg_policies WHERE tablename = 'hero_journeys';
```

### "OpenRouter 429 Too Many Requests"

**Cause** : Rate limit dépassé

**Solution** : Attendre ou upgrader plan OpenRouter

## 📝 Prochaines Étapes

Après installation réussie :

1. **Intégrer Authentification**
   - Configurer Supabase Auth (Google, Magic Link, etc.)
   - Mettre à jour `app.js` pour gérer le login/logout

2. **Implémenter Export PDF**
   - Ajouter librairie jsPDF
   - Créer template PDF avec profil ICARE + insights

3. **Ajouter Analytics**
   - Tracker parcours complétés
   - Mesurer taux d'abandon par station
   - Analyser temps moyen par station

4. **Optimiser Coûts IA**
   - Implémenter cache pour réponses similaires
   - Passer à Claude Haiku pour certaines stations
   - Batch processing si volume élevé

## 🎓 Ressources

- **Documentation complète** : `README.md`
- **Workflows détaillés** : `workflows/*.md`
- **Schéma SQL** : `sql/*.sql`

## ✅ Validation Finale

L'installation est réussie si :

- [ ] Un utilisateur peut créer un nouveau parcours
- [ ] Les 12 stations s'affichent correctement
- [ ] L'IA génère des feedbacks cohérents
- [ ] Le profil ICARE se met à jour dynamiquement
- [ ] La synthèse finale est générée après station 12
- [ ] Les crédits sont correctement consommés

**Temps estimé total : 30-45 minutes**

---

Pour support : patrick@coaching-quantique.com
