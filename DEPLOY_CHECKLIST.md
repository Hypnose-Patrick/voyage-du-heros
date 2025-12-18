# ✅ Checklist de Déploiement - JobSeek Hero Journey

## Phase 1 : Préparation (15 min)

### Supabase
- [ ] Projet créé sur supabase.com
- [ ] URL du projet notée : `https://swhuaseyxprztxehkzjx.supabase.co`
- [ ] Script SQL `01_schema.sql` exécuté ✓
- [ ] Script SQL `02_functions.sql` exécuté ✓
- [ ] Script SQL `03_stations_data.sql` exécuté ✓
- [ ] `anon key` récupérée
- [ ] `service_role key` récupérée

### n8n
- [ ] Instance n8n accessible : `https://n8n.srv824625.hstgr.cloud`
- [ ] Credential Supabase créée (service_role key)
- [ ] Credential OpenRouter créée
- [ ] Variables d'environnement configurées

### OpenRouter
- [ ] Compte créé sur openrouter.ai
- [ ] Clé API générée
- [ ] Crédits ajoutés (minimum $5 recommandé)
- [ ] Modèle `anthropic/claude-3.5-sonnet` accessible

---

## Phase 2 : Configuration Backend (30 min)

### Workflows n8n

#### Workflow 1 : Initialize Journey
- [ ] Workflow créé
- [ ] Webhook configuré : `/webhook/hero-journey/initialize`
- [ ] Node "Check Credits" configuré
- [ ] Node "Create Journey" configuré
- [ ] Node "Create ICARE Profile" configuré
- [ ] Node "Decrement Credits" configuré
- [ ] Workflow activé ✓
- [ ] Test réussi avec curl/Postman

#### Workflow 2 : Submit Stage
- [ ] Workflow créé
- [ ] Webhook configuré : `/webhook/hero-journey/submit-stage`
- [ ] Node "Get Station Metadata" configuré
- [ ] Node "Prepare AI Prompt" configuré
- [ ] Node "Call OpenRouter" configuré
- [ ] Node "Parse AI Response" configuré
- [ ] Node "Calculate ICARE" configuré
- [ ] Node "Insert Stage" configuré
- [ ] Node "Update ICARE Profile" configuré
- [ ] Node "Update Journey" configuré
- [ ] Node "Decrement Credits" configuré
- [ ] Workflow activé ✓
- [ ] Test réussi avec vraie réponse

#### Workflow 3 : Generate Insights
- [ ] Workflow créé
- [ ] Webhook configuré : `/webhook/hero-journey/generate-insights`
- [ ] Node "Get All Stages" configuré
- [ ] Node "Get ICARE Profile" configuré
- [ ] Node "Prepare Synthesis Prompt" configuré
- [ ] Node "Call AI" configuré
- [ ] Node "Parse Insights" configuré
- [ ] Node "Insert Pro Insights" configuré
- [ ] Node "Update Journey Status" configuré
- [ ] Workflow activé ✓
- [ ] Test réussi après 12 stations

#### Workflow 4 : Get Journey State
- [ ] Workflow créé
- [ ] Webhook configuré : `/webhook/hero-journey/get-state`
- [ ] Node "Get Journey" configuré
- [ ] Node "Get Stages" configuré
- [ ] Node "Get ICARE" configuré
- [ ] Node "Get Insights" configuré
- [ ] Node "Merge Data" configuré
- [ ] Workflow activé ✓
- [ ] Test réussi

### URLs des Webhooks
Copier les URLs complètes ici pour référence :
```
Initialize: https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/initialize
Submit Stage: https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/submit-stage
Generate Insights: https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/generate-insights
Get State: https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/get-state
```

---

## Phase 3 : Configuration Frontend (15 min)

### Fichier config.js
- [ ] `SUPABASE_URL` mis à jour
- [ ] `SUPABASE_ANON_KEY` mis à jour
- [ ] `N8N_BASE_URL` mis à jour
- [ ] `N8N_WEBHOOKS` mis à jour avec les vraies URLs
- [ ] `OPENROUTER_API_KEY` ajouté (commenté, juste pour référence)
- [ ] `DEBUG_MODE` = `true` pour tests
- [ ] Fichier sauvegardé

### Pages HTML
- [ ] `index.html` vérifié (liens vers CSS/JS corrects)
- [ ] `login.html` vérifié
- [ ] `style.css` vérifié
- [ ] `app.js` vérifié

---

## Phase 4 : Tests Locaux (20 min)

### Créer Utilisateur Test
```sql
-- Dans Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@jobseek.com', crypt('Test123456!', gen_salt('bf')), NOW());

-- Ajouter 100 crédits
INSERT INTO user_subscriptions (user_id, plan_type, credits_remaining, credits_total)
SELECT id, 'free', 100, 100
FROM auth.users
WHERE email = 'test@jobseek.com';
```

- [ ] Utilisateur test créé
- [ ] Crédits ajoutés

### Lancer Serveur Local
```bash
cd src
python -m http.server 8000
# Ou : npx serve .
```

- [ ] Serveur lancé sur http://localhost:8000

### Tests Fonctionnels
- [ ] Login avec test@jobseek.com fonctionne
- [ ] Écran de bienvenue s'affiche
- [ ] Bouton "Démarrer le parcours" fonctionne
- [ ] Station 1 s'affiche correctement
- [ ] Peut saisir une réponse (min 50 caractères)
- [ ] Bouton "Valider ma réponse" fonctionne
- [ ] Feedback IA s'affiche après ~10-30 secondes
- [ ] Profil ICARE se met à jour
- [ ] Barre de progression se met à jour
- [ ] Crédits diminuent correctement
- [ ] Bouton "Station suivante" fonctionne
- [ ] Station 2 s'affiche
- [ ] Peut compléter jusqu'à station 12
- [ ] Bouton "Générer ma synthèse" apparaît après station 12
- [ ] Synthèse finale s'affiche correctement
- [ ] Logout fonctionne

### Tests d'Erreur
- [ ] Message d'erreur si crédits insuffisants
- [ ] Message d'erreur si réponse trop courte
- [ ] Message d'erreur si session expirée
- [ ] Message d'erreur si problème réseau

---

## Phase 5 : Déploiement Production (30 min)

### Bunny.net Configuration

#### Pull Zone
- [ ] Pull Zone créée sur panel.bunny.net
- [ ] Nom : `jobseek-hero`
- [ ] Custom hostname configuré : `hero.jobseek.online`
- [ ] SSL/TLS activé
- [ ] DNS configuré (CNAME vers Bunny)

#### Storage Zone
- [ ] Storage Zone créée : `jobseek-assets`
- [ ] Dossier `/hero-journey/` créé
- [ ] Password noté : `BUNNY_STORAGE_PASSWORD`

### Déploiement Fichiers

**Windows :**
```powershell
$env:BUNNY_STORAGE_PASSWORD = "your_password"
.\deploy\deploy-bunny.ps1 -Version "v1.0.0"
```

**Linux/Mac :**
```bash
export BUNNY_STORAGE_PASSWORD="your_password"
./deploy/deploy-bunny.sh v1.0.0
```

- [ ] Script de déploiement exécuté
- [ ] Fichiers uploadés avec succès :
  - [ ] index.html
  - [ ] style.v1.0.0.css
  - [ ] app.v1.0.0.js
  - [ ] config.v1.0.0.js
  - [ ] login.html

### Cache CDN
- [ ] Cache purgé manuellement sur panel.bunny.net
- [ ] Test URL : https://hero.jobseek.online
- [ ] Page charge correctement
- [ ] Assets chargent (vérifier Network tab F12)
- [ ] Pas d'erreurs CORS
- [ ] Pas d'erreurs 404

---

## Phase 6 : Tests Production (15 min)

### Tests Fonctionnels Production
- [ ] Accès à https://hero.jobseek.online fonctionne
- [ ] Page de login s'affiche
- [ ] Inscription fonctionne
- [ ] Email de confirmation reçu
- [ ] Login fonctionne
- [ ] Parcours complet fonctionne
- [ ] Tous les appels API n8n réussissent
- [ ] Synthèse finale fonctionne

### Performance
- [ ] Temps de chargement < 2 secondes
- [ ] Pas de lag lors de la saisie
- [ ] Appels IA en < 30 secondes
- [ ] Pas d'erreurs dans la console (F12)

### Mobile
- [ ] Test sur smartphone
- [ ] Interface responsive
- [ ] Clavier mobile fonctionne bien
- [ ] Boutons cliquables facilement

---

## Phase 7 : Configuration Production (10 min)

### Sécurité
- [ ] `DEBUG_MODE` = `false` dans config.js
- [ ] Variables sensibles pas dans le code
- [ ] HTTPS activé partout
- [ ] CORS correctement configuré dans Supabase

### Supabase Production
- [ ] Row Level Security (RLS) activé sur toutes les tables
- [ ] Policies testées
- [ ] Backup automatique activé
- [ ] Email templates personnalisés (optionnel)

### Monitoring
- [ ] Supabase Dashboard consulté (usage, logs)
- [ ] n8n Executions surveillées
- [ ] OpenRouter usage surveillé

---

## Phase 8 : Documentation & Support (10 min)

### Documentation
- [ ] README.md à jour
- [ ] QUICKSTART.md à jour
- [ ] Screenshots de l'app ajoutés (optionnel)
- [ ] Vidéo démo enregistrée (optionnel)

### Support
- [ ] Email de support défini : patrick@ddc-coaching.ch
- [ ] Page d'aide créée (optionnel)
- [ ] FAQ préparée (optionnel)

---

## Phase 9 : Lancement (5 min)

### Annonce
- [ ] Email aux early adopters
- [ ] Post sur réseaux sociaux
- [ ] Annonce sur site web JobSeek

### Monitoring Jour 1
- [ ] Surveiller logs Supabase
- [ ] Surveiller exécutions n8n
- [ ] Surveiller consommation OpenRouter
- [ ] Répondre aux premiers feedbacks

---

## 🎉 Checklist Complète !

**Total estimé : ~2h30**

Une fois toutes ces cases cochées, l'application est **100% opérationnelle en production** ! 🚀

---

## 📞 Support

Problème lors du déploiement ?
- Email : patrick@ddc-coaching.ch
- Documentation : README.md
- Workflows : workflows/README.md
- Démarrage rapide : QUICKSTART.md

---

**Bon déploiement ! 💪**
