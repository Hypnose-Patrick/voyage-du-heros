# 🗄️ Supabase Setup Guide

Guide complet pour configurer Supabase avec Voyage du Héros.

## 📋 Prérequis

- Un compte Supabase (gratuit) : [https://supabase.com](https://supabase.com)
- Node.js 18+ installé
- Accès à ce projet

## 🚀 Étape 1 : Créer un projet Supabase

1. **Connectez-vous** à [https://app.supabase.com](https://app.supabase.com)
2. **Créez un nouveau projet** :
   - Cliquez sur "New Project"
   - Nom du projet : `voyage-du-heros` (ou autre)
   - Choisissez un mot de passe pour la base de données
   - Sélectionnez une région (choisir la plus proche de vos utilisateurs)
   - Cliquez sur "Create new project"

3. **Attendez** que le projet soit créé (2-3 minutes)

## 🔑 Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** (icône d'engrenage) > **API**
2. Notez les valeurs suivantes :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key : `eyJhbG...` (clé longue)

## ⚙️ Étape 3 : Configurer les variables d'environnement

1. **Créez un fichier `.env`** à la racine du projet :

```bash
cp .env.example .env
```

2. **Modifiez `.env`** avec vos valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

⚠️ **Important** : Le fichier `.env` est dans `.gitignore` et ne sera pas commité.

## 📊 Étape 4 : Créer les tables

### Option A : Via l'interface Supabase (Recommandé)

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu du fichier `supabase/migrations/20250117_create_hero_journey_tables.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** (ou Ctrl+Enter)

✅ Vous devriez voir : "Success. No rows returned"

### Option B : Via Supabase CLI (Avancé)

Si vous utilisez la CLI Supabase :

```bash
# Installer la CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref votre-project-ref

# Appliquer la migration
supabase db push
```

## ✅ Étape 5 : Vérifier les tables

1. Allez dans **Table Editor** dans Supabase
2. Vous devriez voir 2 tables :
   - ✅ `hero_journeys`
   - ✅ `station_responses`

## 🧪 Étape 6 : Tester la connexion

1. **Démarrez l'application** :

```bash
npm run dev
```

2. **Ouvrez la console** du navigateur (F12)
3. Vous devriez voir des messages de connexion Supabase
4. Commencez un nouveau voyage - vos données seront sauvegardées dans Supabase !

## 🔒 Étape 7 : Configurer l'authentification (Optionnel)

Par défaut, l'application fonctionne en mode **anonyme** (sans compte utilisateur).

### Pour activer l'authentification par email :

1. Dans Supabase, allez dans **Authentication** > **Providers**
2. Activez **Email** provider
3. Configurez les templates d'emails si nécessaire

### Pour utiliser l'authentification :

```typescript
import { supabase } from './lib/supabase';

// S'inscrire
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Se connecter
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

## 📱 Fonctionnalités activées

Une fois Supabase configuré, vous bénéficiez de :

- ✅ **Sauvegarde automatique** des réponses dans le cloud
- ✅ **Synchronisation** entre appareils
- ✅ **Sécurité** via Row Level Security (RLS)
- ✅ **Historique** de tous les parcours
- ✅ **Fallback localStorage** si Supabase est indisponible

## 🔍 Structure des données

### Table `hero_journeys`

```sql
id                UUID PRIMARY KEY
user_id           UUID (référence auth.users)
tier              TEXT ('STANDARD', 'PREMIUM', 'ELITE')
started_at        TIMESTAMP
completed_at      TIMESTAMP (nullable)
current_station   INTEGER (1-12)
credits_deducted  INTEGER
created_at        TIMESTAMP
```

### Table `station_responses`

```sql
id                  UUID PRIMARY KEY
journey_id          UUID (référence hero_journeys)
station_number      INTEGER (1-12)
responses           JSONB (toutes les réponses)
time_spent_seconds  INTEGER
completed_at        TIMESTAMP
created_at          TIMESTAMP
```

## 🛡️ Sécurité (Row Level Security)

Toutes les tables ont RLS activé avec les politiques suivantes :

- ✅ Les utilisateurs peuvent **voir** leurs propres données
- ✅ Les utilisateurs peuvent **créer** leurs propres données
- ✅ Les utilisateurs peuvent **modifier** leurs propres données
- ✅ Les utilisateurs peuvent **supprimer** leurs propres données
- ❌ Les utilisateurs **ne peuvent pas** voir les données des autres

## 📊 Fonctions SQL disponibles

### `get_journey_profile(journey_uuid)`

Récupère le profil complet d'un parcours avec toutes les réponses aux stations.

```sql
SELECT get_journey_profile('uuid-du-parcours');
```

### `calculate_journey_progress(journey_uuid)`

Calcule la progression d'un parcours.

```sql
SELECT calculate_journey_progress('uuid-du-parcours');
```

Retourne :
```json
{
  "completed_stations": 5,
  "total_stations": 12,
  "progress_percentage": 41.67
}
```

## 🐛 Dépannage

### Erreur : "Invalid JWT"

- Vérifiez que `VITE_SUPABASE_ANON_KEY` est correct
- Assurez-vous de ne pas avoir copié d'espaces en trop

### Erreur : "relation does not exist"

- Les tables n'ont pas été créées correctement
- Retournez à l'Étape 4 et créez les tables

### Données non sauvegardées

- Vérifiez la console pour des erreurs
- Vérifiez que les variables d'environnement sont chargées
- Le fallback localStorage fonctionne si Supabase est indisponible

### L'application fonctionne sans Supabase

✅ C'est normal ! L'application a un **fallback localStorage** automatique.

Pour forcer l'utilisation de Supabase :
```typescript
if (!isSupabaseConfigured()) {
  console.error('Supabase n\'est pas configuré !');
}
```

## 📈 Monitoring

### Via Supabase Dashboard

1. **Table Editor** : Voir les données en temps réel
2. **Database** > **Logs** : Voir les requêtes SQL
3. **Authentication** : Voir les utilisateurs connectés

### Via l'application

Les stores Zustand exposent des informations de sync :

```typescript
const { isSyncing, lastSyncAt } = useJourneyStore();

console.log('Syncing:', isSyncing);
console.log('Last sync:', lastSyncAt);
```

## 🚀 Déploiement en production

1. **Ajoutez les variables d'environnement** sur votre plateforme :
   - Vercel : Settings > Environment Variables
   - Netlify : Site settings > Build & deploy > Environment

2. **CORS** : Ajoutez votre domaine dans Supabase
   - Settings > API > CORS Configuration

3. **RLS** : Les politiques de sécurité sont déjà configurées ✅

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Client JavaScript](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 💡 Prochaines étapes

Une fois Supabase configuré, vous pouvez :

1. ✅ Activer **Realtime** pour la synchronisation en temps réel
2. ✅ Ajouter **Storage** pour les fichiers uploadés
3. ✅ Configurer **Edge Functions** pour la logique serveur
4. ✅ Mettre en place **Analytics** via les extensions

---

**Besoin d'aide ?** Consultez la [documentation Supabase](https://supabase.com/docs) ou créez une issue sur GitHub.
