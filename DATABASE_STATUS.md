# 📊 État de la Base de Données - JobSeek Hero Journey

**Date:** 19 décembre 2025
**Project:** swhuaseyxprztxehkzjx.supabase.co

---

## ✅ Tables Actuellement Utilisées par l'Application

### 1. **Authentification (Supabase Auth)**
- ✅ `auth.users` - Utilisateurs
- ✅ Intégré dans `login.html` et `index.html`

### 2. **`user_subscriptions`** (Dans vos SQL schemas)
- ✅ Gestion des crédits (5 gratuits, possibilité d'en acheter)
- ✅ Trigger auto-création lors de l'inscription
- ✅ RLS activé par `user_id`

**Note:** Dans votre synthèse, cette table s'appelle `subscriptions`, mais dans vos fichiers SQL elle s'appelle `user_subscriptions`. **Vérifier la cohérence.**

### 3. **`hero_journeys`** (Dans vos SQL schemas)
- ✅ Parcours du héros (12 stations)
- ✅ Suivi de progression (`current_stage`, `status`)
- ✅ XP et gamification

**Note:** Dans votre synthèse, cette table s'appelle `journey`. **Vérifier si ce sont deux tables différentes ou un renommage.**

### 4. **`journey_stages`** (Dans vos SQL schemas)
- ✅ Réponses aux 12 stations
- ✅ Feedback IA (narrative + insight)
- ✅ XP gagné par station

### 5. **`icare_profiles`** (Dans vos SQL schemas)
- ✅ Profil psychologique (5 dimensions)
- ✅ Généré après complétion du parcours

### 6. **`pro_insights`** (Dans vos SQL schemas)
- ✅ Synthèse stratégique finale
- ✅ Pitch, tagline, soft skills, accomplissements

### 7. **`star_experiences`** (Nouveau - v2.0.0)
- ✅ Expériences STAR extraites automatiquement
- ✅ Structuration Situation/Task/Action/Result
- ✅ Identification des compétences
- ✅ Workflow n8n actif (v2)

---

## ⚠️ Tables Présentes dans Supabase mais NON Utilisées

Ces tables existent dans votre base de données mais **ne sont pas encore intégrées** dans l'application actuelle :

### Applications & Candidatures
- ❌ `applications` - Candidatures aux offres
- ❌ `job_offers` - Catalogue d'offres
- ❌ `documents` - CV, certificats, photos

### Préparation Entretiens
- ❌ `interview_prep` - Questions/réponses d'entretien
- ❌ `anneagram_results` - Résultats ennéagramme
- ❌ `ristec_results` - Analyse de risques

### Achats & E-commerce
- ❌ `purchases` - Historique achats de crédits
- ❌ `plan_types` - Types de plans/abonnements

### Stations (Version étendue ?)
- ❌ `station_definitions`
- ❌ `station_progress`
- ❌ `station_responses`
- ❌ `stations_config`
- ❌ `stations_full`
- ❌ `stations_reference`

**Note:** Ces tables semblent faire doublon avec `journey_stages`. **À clarifier.**

### Synthèses
- ❌ `journey_synthesis` - Synthèses additionnelles ?
- ❌ `profile_summary` - Résumé de profil étendu
- ❌ `user_star_summary` - Résumé STAR (vue ?)

### Système
- ❌ `webhook_queue` - File d'attente webhooks

---

## 🔍 Incohérences à Vérifier

### 1. Noms de Tables Différents

**Dans vos fichiers SQL (`sql/01_schema.sql`) :**
```sql
CREATE TABLE user_subscriptions ...
CREATE TABLE hero_journeys ...
CREATE TABLE journey_stages ...
CREATE TABLE icare_profiles ...
CREATE TABLE pro_insights ...
```

**Dans la synthèse Supabase fournie :**
```
subscriptions
journey
stations_*
profile_summary
```

**Action requise:** Vérifier si :
- Ce sont des tables différentes (anciennes vs nouvelles)
- Ou des renommages non synchronisés
- Ou deux schémas différents (dev vs prod)

### 2. Tables "stations" en Double ?

**Version 1 (dans vos SQL) :**
- `journey_stages` - Réponses aux 12 stations

**Version 2 (dans Supabase) :**
- `station_definitions`
- `station_progress`
- `station_responses`

**Question:** Pourquoi deux systèmes de stations ? Lequel est actif ?

---

## 🎯 Recommandations

### Priorité 1 : Clarifier la Structure

**Exécuter dans Supabase SQL Editor :**
```sql
-- Lister TOUTES les tables du schema public
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vérifier les relations
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Priorité 2 : Vérifier les Tables Utilisées

**Tester que l'application utilise les bonnes tables :**
```sql
-- Vérifier user_subscriptions (utilisé dans l'app)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'user_subscriptions';

-- Vérifier hero_journeys (utilisé dans l'app)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'hero_journeys';

-- Vérifier journey_stages (utilisé dans l'app)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'journey_stages';
```

**Si ces tables n'existent pas :**
→ Exécuter `sql/01_schema.sql` pour les créer

**Si elles existent déjà :**
→ Vérifier la cohérence des schémas

### Priorité 3 : Migrer vers le Webhook v2

**✅ Déjà fait dans le code :**
- `config.js` → `/webhook/jobseed-extract-star-v2`
- `config.bundle.js` → `/webhook/jobseed-extract-star-v2`

**À faire :**
- [ ] Tester le nouveau webhook
- [ ] Désactiver l'ancien workflow v1 dans n8n
- [ ] Vérifier que `star_experiences` table existe et fonctionne

---

## 📋 Checklist de Vérification

### Base de Données
- [ ] Exécuter la requête de listing des tables
- [ ] Vérifier que `user_subscriptions` existe
- [ ] Vérifier que `hero_journeys` existe
- [ ] Vérifier que `journey_stages` existe
- [ ] Vérifier que `star_experiences` existe
- [ ] Clarifier les tables `stations_*` vs `journey_stages`
- [ ] Clarifier `subscriptions` vs `user_subscriptions`

### Application
- [ ] Test d'inscription fonctionne
- [ ] Trigger auto-créé l'abonnement
- [ ] Parcours démarre correctement
- [ ] Soumission de stations fonctionne
- [ ] Extraction STAR fonctionne (webhook v2)
- [ ] Insights finaux s'affichent

### Webhooks n8n
- [ ] Workflow STAR v2 actif
- [ ] Ancien workflow v1 désactivé
- [ ] Test manuel du webhook v2
- [ ] Vérification des credentials Claude

---

## 🚀 Prochaines Étapes Suggérées

### Court Terme (Cette Semaine)
1. ✅ Webhook STAR v2 configuré
2. ⏳ Vérifier la cohérence des tables (SQL ci-dessus)
3. ⏳ Tester l'application end-to-end en local
4. ⏳ Déployer sur Bunny.net avec les versions bundle

### Moyen Terme (Prochaines Semaines)
1. Intégrer les tables `applications` et `job_offers`
2. Ajouter la fonctionnalité de candidature automatique
3. Intégrer `interview_prep` pour simulation d'entretien
4. Implémenter `purchases` pour achats de crédits

### Long Terme (Futur)
1. Migrer vers un schéma unifié (éviter les doublons)
2. Ajouter des vues matérialisées pour performance
3. Implémenter l'export PDF des STAR experiences
4. Créer un dashboard analytics complet

---

## 📞 Questions à Clarifier

1. **Pourquoi deux systèmes de tables pour les stations ?**
   - `journey_stages` (votre code)
   - `station_*` (Supabase)

2. **Quel est le schéma de référence ?**
   - Les fichiers SQL dans votre projet ?
   - Ou la base Supabase actuelle ?

3. **Les tables non utilisées sont-elles pour une future phase ?**
   - Applications/Job offers
   - Interview prep
   - Purchases

4. **Y a-t-il deux environnements ?**
   - Dev vs Production
   - Ancien vs Nouveau

---

**Recommandation Immédiate:**

Exécutez cette requête dans Supabase pour voir l'état réel :
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Puis comparez avec vos fichiers SQL pour identifier les différences.

---

**Dernière mise à jour:** 19 décembre 2025
**Version Application:** 2.0.1
**Status:** En attente de clarification schéma DB
