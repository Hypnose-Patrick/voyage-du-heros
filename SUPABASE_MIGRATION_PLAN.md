# 🔧 Plan de Migration Supabase - Alignement Tables

**Date:** 19 décembre 2025
**Objectif:** Aligner la base Supabase avec le code de l'application

---

## 📊 Résumé de la Situation

**Votre code utilise ces noms:**
- `user_subscriptions`
- `hero_journeys`
- `journey_stages`
- `icare_profiles`
- `pro_insights`

**Supabase contient:**
- `subscriptions` ✅
- `journey` ✅
- `station_responses` + système `stations_*` ✅
- `icare_results` ✅
- `profile_summary` ✅
- ❌ Pas de `pro_insights`

---

## 🎯 Décision à Prendre

Vous avez **DEUX OPTIONS** :

### **Option A: Renommer les Tables Supabase** (Recommandé si peu d'utilisateurs)
Renommer les tables dans Supabase pour correspondre au code.

**Avantages:**
- Pas besoin de modifier le code
- Application fonctionne immédiatement

**Inconvénients:**
- Peut casser d'autres applications si elles existent
- Nécessite de vérifier toutes les foreign keys

---

### **Option B: Adapter le Code** (Recommandé pour production)
Modifier le code pour utiliser les noms de tables existants dans Supabase.

**Avantages:**
- Pas de risque de casser la base de données
- Meilleure pratique

**Inconvénients:**
- Nécessite de modifier plusieurs fichiers JavaScript

---

## ✅ OPTION A : Renommer les Tables dans Supabase

### Étape 1: Ouvrir Supabase SQL Editor

1. Aller sur: https://supabase.com/dashboard/project/swhuaseyxprztxehkzjx
2. Menu → **SQL Editor**
3. Cliquer **New Query**

---

### Étape 2: Vérifier l'État Actuel

**Copier et exécuter cette requête :**

```sql
-- Lister toutes les tables existantes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Noter le résultat pour référence.**

---

### Étape 3: Renommer les Tables

**⚠️ ATTENTION: Cette opération est IRRÉVERSIBLE sans backup !**

**Copier et exécuter UN PAR UN :**

```sql
-- 1. Renommer subscriptions → user_subscriptions
ALTER TABLE IF EXISTS subscriptions
RENAME TO user_subscriptions;

-- Vérifier
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'user_subscriptions';
-- Devrait retourner 1 ligne


-- 2. Renommer journey → hero_journeys
ALTER TABLE IF EXISTS journey
RENAME TO hero_journeys;

-- Vérifier
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'hero_journeys';
-- Devrait retourner 1 ligne


-- 3. Renommer icare_results → icare_profiles
ALTER TABLE IF EXISTS icare_results
RENAME TO icare_profiles;

-- Vérifier
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'icare_profiles';
-- Devrait retourner 1 ligne


-- 4. Créer la table pro_insights (car elle n'existe pas)
CREATE TABLE IF NOT EXISTS pro_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES hero_journeys(id) ON DELETE CASCADE,
  pitch TEXT,
  tagline TEXT,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  accomplishments JSONB DEFAULT '[]'::jsonb,
  environment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_journey_insights UNIQUE (journey_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_pro_insights_journey_id
ON pro_insights(journey_id);

-- RLS
ALTER TABLE pro_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view insights of their journeys"
  ON pro_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = pro_insights.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert insights for their journeys"
  ON pro_insights FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = pro_insights.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- Vérifier
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'pro_insights';
-- Devrait retourner 1 ligne
```

---

### Étape 4: Gérer les Stations

**Vous avez un problème ici:** Votre code utilise `journey_stages` mais Supabase a un système `stations_*` différent.

**Solution recommandée:** Créer `journey_stages` en s'inspirant de `station_responses`.

```sql
-- Créer journey_stages si elle n'existe pas
CREATE TABLE IF NOT EXISTS journey_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES hero_journeys(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 12),
  stage_title TEXT NOT NULL,
  user_input TEXT NOT NULL,
  ai_narrative TEXT,
  ai_insight TEXT,
  xp_gained INTEGER DEFAULT 125,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_journey_stage UNIQUE (journey_id, stage_number)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_journey_stages_journey_id
ON journey_stages(journey_id);

-- RLS
ALTER TABLE journey_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stages of their journeys"
  ON journey_stages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stages to their journeys"
  ON journey_stages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stages of their journeys"
  ON journey_stages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- Vérifier
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'journey_stages';
```

---

### Étape 5: Vérifier le Trigger d'Inscription

**Le trigger doit pointer vers `user_subscriptions` :**

```sql
-- Vérifier le trigger existant
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Si le trigger pointe vers 'subscriptions', le recréer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_type, credits_total, credits_remaining)
  VALUES (NEW.id, 'free', 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vérifier
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

---

### Étape 6: Vérification Finale

```sql
-- Lister toutes les tables nécessaires pour l'application
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'user_subscriptions',
  'hero_journeys',
  'journey_stages',
  'icare_profiles',
  'pro_insights',
  'star_experiences'
)
ORDER BY table_name;

-- Devrait retourner 6 lignes
```

**Résultat attendu :**
```
hero_journeys
icare_profiles
journey_stages
pro_insights
star_experiences
user_subscriptions
```

---

## ✅ OPTION B : Adapter le Code (Alternative)

Si vous préférez **ne pas toucher à Supabase**, voici ce qu'il faut modifier dans le code :

### Fichiers à Modifier

#### 1. Créer un fichier de mapping

**Créer:** `src/db-tables.js`

```javascript
// Mapping des noms de tables
export const TABLE_NAMES = {
  user_subscriptions: 'subscriptions',
  hero_journeys: 'journey',
  journey_stages: 'station_responses',
  icare_profiles: 'icare_results',
  pro_insights: 'profile_summary',
  star_experiences: 'star_experiences'
};

export function getTableName(logicalName) {
  return TABLE_NAMES[logicalName] || logicalName;
}
```

#### 2. Modifier `app.js`

Rechercher **TOUS** les appels `.from()` et les remplacer :

```javascript
// AVANT
const { data } = await supabase
  .from('user_subscriptions')
  .select('*');

// APRÈS
import { getTableName } from './db-tables.js';

const { data } = await supabase
  .from(getTableName('user_subscriptions'))  // → 'subscriptions'
  .select('*');
```

---

## 🎯 Ma Recommandation

**Pour votre situation, je recommande OPTION A (Renommer dans Supabase)** car :

1. ✅ Votre code est déjà écrit avec ces noms
2. ✅ Moins de modifications à faire
3. ✅ Plus cohérent avec vos fichiers SQL
4. ✅ Les tables `stations_*` semblent être un ancien système non utilisé

**Mais SEULEMENT si :**
- ❗ Vous n'avez pas d'autres applications connectées à cette base
- ❗ Vous êtes en phase de développement (pas en production)

---

## ⚠️ Avant de Commencer

**CRÉER UN BACKUP :**

1. Supabase Dashboard → Database → **Backups**
2. Cliquer **Create backup** ou noter le dernier backup
3. Ou exporter les données :

```sql
-- Exporter les données existantes
COPY (SELECT * FROM subscriptions) TO '/tmp/subscriptions_backup.csv' CSV HEADER;
COPY (SELECT * FROM journey) TO '/tmp/journey_backup.csv' CSV HEADER;
COPY (SELECT * FROM icare_results) TO '/tmp/icare_results_backup.csv' CSV HEADER;
```

---

## 📋 Checklist d'Exécution

### OPTION A (Renommer Supabase)

- [ ] Créer un backup
- [ ] Étape 2 : Vérifier l'état actuel
- [ ] Étape 3 : Renommer `subscriptions` → `user_subscriptions`
- [ ] Étape 3 : Renommer `journey` → `hero_journeys`
- [ ] Étape 3 : Renommer `icare_results` → `icare_profiles`
- [ ] Étape 3 : Créer `pro_insights`
- [ ] Étape 4 : Créer `journey_stages`
- [ ] Étape 5 : Vérifier le trigger
- [ ] Étape 6 : Vérification finale
- [ ] Tester l'application en local
- [ ] Tester inscription → vérifier abonnement créé
- [ ] Tester parcours → vérifier stations enregistrées

### OPTION B (Adapter le Code)

- [ ] Créer `src/db-tables.js`
- [ ] Modifier tous les `.from()` dans `app.js`
- [ ] Modifier tous les `.from()` dans les autres fichiers JS
- [ ] Tester en local
- [ ] Vérifier toutes les fonctionnalités

---

## 🚀 Après Migration

Une fois la migration terminée, testez :

```bash
# En local
cd c:\Users\info\OneDrive\jobseek-hero-journey
npm run dev
```

**Ouvrir:** http://127.0.0.1:8000/login-bundle.html

**Tester:**
1. ✅ Inscription → Vérifier dans Supabase que `user_subscriptions` est créé
2. ✅ Connexion
3. ✅ Commencer parcours → Vérifier que `hero_journeys` est créé
4. ✅ Compléter une station → Vérifier que `journey_stages` est créé
5. ✅ Extraction STAR → Vérifier que `star_experiences` est créé
6. ✅ Insights finaux → Vérifier que `pro_insights` est créé

---

## 📞 Support

Si vous rencontrez des erreurs pendant la migration, notez :
- Le message d'erreur exact
- L'étape où ça a échoué
- Le résultat de la requête de vérification

---

**Prêt à commencer ?** Je recommande **OPTION A** avec un backup préalable.

**Quelle option choisissez-vous ?**
