# ⭐ Extraction STAR - Documentation

## Vue d'ensemble

L'application JobSeek Hero Journey intègre désormais l'extraction automatique d'expériences professionnelles selon la **méthode STAR** (Situation, Task, Action, Result). Cette fonctionnalité analyse les récits fournis par l'utilisateur durant son parcours et les structure automatiquement pour une utilisation dans les CV et entretiens.

## La Méthode STAR

### Qu'est-ce que STAR ?

**STAR** est une technique de narration d'expériences professionnelles utilisée en entretien et sur les CV :

- **S** (Situation) : Le contexte et la situation initiale
- **T** (Task) : La tâche ou le défi à relever
- **A** (Action) : Les actions entreprises pour résoudre le problème
- **R** (Result) : Les résultats obtenus et l'impact

### Pourquoi STAR ?

- ✅ **Structure claire** : Format reconnu par les recruteurs
- ✅ **Mesurable** : Met en avant les résultats concrets
- ✅ **Mémorable** : Raconte une histoire complète
- ✅ **Réutilisable** : Prêt pour CV et entretiens

## Fonctionnement

### 1. Extraction Automatique

Après chaque réponse à une station du parcours :

1. Le récit de l'utilisateur est envoyé au workflow n8n
2. L'IA (Claude Sonnet 4.5) analyse le texte
3. Les éléments STAR sont extraits et structurés
4. L'expérience est sauvegardée dans Supabase
5. Une notification subtile apparaît à l'écran

```javascript
// Flux d'extraction
User Input → n8n Webhook → Claude AI → Parse JSON → Save to DB → Notify User
```

### 2. Stockage des Données

Les expériences sont stockées dans la table `star_experiences` :

```sql
CREATE TABLE star_experiences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  journey_id UUID REFERENCES hero_journeys(id),
  stage_number INTEGER,

  source_type TEXT, -- 'journey' ou 'manual'
  narrative_original TEXT, -- Récit original

  title TEXT,        -- Titre de l'expérience
  situation TEXT,    -- Contexte (S)
  task TEXT,         -- Tâche (T)
  action TEXT,       -- Actions (A)
  result TEXT,       -- Résultats (R)

  competencies JSONB, -- ["compétence1", "compétence2"]
  is_featured BOOLEAN,
  display_order INTEGER,

  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### 3. Affichage des Expériences

Les expériences STAR sont affichées dans la section finale des insights avec :

- **Cartes interactives** : Hover pour effet visuel
- **Structure STAR complète** : Les 4 sections clairement identifiées
- **Compétences associées** : Badges des compétences démontrées
- **Design professionnel** : Prêt pour impression ou screenshot

## Architecture Technique

### Workflow n8n

Fichier: [workflows/n8n-05-extract-star.json](workflows/n8n-05-extract-star.json)

**Nodes :**

1. **Webhook** : Réception du récit utilisateur
2. **Claude AI** : Analyse et extraction STAR
3. **Parse Response** : Validation du JSON
4. **Success Check** : Vérification des champs requis
5. **Response** : Retour succès ou erreur

**Prompt IA :**

```
Tu es un expert en coaching de carrière.
Extrais les éléments STAR de ce récit :
{narrative}

Retourne un JSON avec :
{
  "title": "...",
  "situation": "...",
  "task": "...",
  "action": "...",
  "result": "...",
  "competencies": ["...", "..."]
}
```

### Frontend (app.js)

**Fonctions principales :**

- `extractSTARExperience()` : Appel API extraction
- `saveSTARToSupabase()` : Sauvegarde en base
- `loadSTARExperiences()` : Chargement des expériences
- `displaySTARExperiences()` : Rendu HTML
- `showSTARNotification()` : Notification utilisateur

### Base de Données

Fichier SQL : [sql/05_star_experiences.sql](sql/05_star_experiences.sql)

**Features :**

- Row Level Security (RLS) activé
- Indexes optimisés pour les requêtes
- Fonctions helpers (get_user_star_experiences, get_user_competencies)
- Vue résumé (user_star_summary)
- Triggers pour updated_at

## Configuration

### 1. Importer le Workflow n8n

```bash
# Dans n8n :
1. Workflows → Import from file
2. Sélectionner workflows/n8n-05-extract-star.json
3. Connecter les credentials Claude AI
4. Activer le workflow
5. Noter l'URL du webhook
```

### 2. Créer la Table Supabase

```bash
# Dans Supabase SQL Editor :
1. Copier le contenu de sql/05_star_experiences.sql
2. Exécuter le script
3. Vérifier que la table est créée
```

### 3. Configurer l'Endpoint

Le fichier [src/config.js](src/config.js) contient déjà l'endpoint :

```javascript
API_ENDPOINTS: {
  ...
  EXTRACT_STAR: '/webhook/jobseed-extract-star'
}
```

## Utilisation

### Pour l'Utilisateur

1. **Durant le parcours** :
   - Répondre normalement aux stations
   - Une notification apparaît quand une expérience est extraite
   - Continuer le parcours normalement

2. **Dans les insights finaux** :
   - Voir toutes les expériences STAR collectées
   - Copier-coller dans CV ou lettre de motivation
   - Utiliser en préparation d'entretien

### Pour le Développeur

**Extraire manuellement une expérience :**

```javascript
await extractSTARExperience(
  "Mon récit d'expérience professionnelle...",
  null // ou numéro de station si applicable
);
```

**Charger les expériences :**

```javascript
const experiences = await loadSTARExperiences();
console.log(experiences);
```

**Afficher dans un conteneur personnalisé :**

```javascript
displaySTARExperiences(); // Utilise #star-experiences-container
```

## Exemple d'Expérience Extraite

**Input (récit utilisateur) :**

> "Dans mon dernier poste de chef de projet, j'ai dû gérer une équipe en crise après le départ du lead developer. J'ai organisé des daily meetings, redistribué les tâches et mis en place un système de pair programming. En 2 mois, on a réduit les bugs de 40% et livré le projet avec 2 semaines d'avance."

**Output STAR :**

```json
{
  "title": "Gestion d'équipe en crise et livraison anticipée",
  "situation": "Chef de projet confronté à une équipe déstabilisée suite au départ soudain du lead developer dans un contexte de deadline serrée.",
  "task": "Stabiliser l'équipe, maintenir la productivité et assurer la livraison du projet dans les délais malgré la perte d'une ressource clé.",
  "action": "J'ai mis en place des daily meetings pour maintenir la communication, redistribué les responsabilités selon les compétences de chacun, et instauré un système de pair programming pour accélérer la montée en compétences et réduire les erreurs.",
  "result": "Réduction des bugs de 40% en 2 mois, livraison du projet avec 2 semaines d'avance sur le planning initial, et amélioration de la cohésion d'équipe.",
  "competencies": [
    "Leadership",
    "Gestion de crise",
    "Communication",
    "Pair programming",
    "Gestion de projet"
  ]
}
```

## Interface Utilisateur

### Notification STAR

Quand une expérience est extraite :

```
┌─────────────────────────────────────┐
│ ⭐ Expérience extraite:             │
│    Gestion d'équipe en crise...    │
└─────────────────────────────────────┘
```

- Apparaît en haut à droite
- Animation d'entrée fluide
- Disparaît après 4 secondes
- Ne bloque pas l'utilisateur

### Carte d'Expérience

```
┌────────────────────────────────────────┐
│ Gestion d'équipe en crise...   [STAR] │
├────────────────────────────────────────┤
│ 📍 Situation:                          │
│    Chef de projet confronté...         │
│                                         │
│ 🎯 Tâche:                               │
│    Stabiliser l'équipe...               │
│                                         │
│ ⚡ Action:                              │
│    J'ai mis en place...                 │
│                                         │
│ 🏆 Résultat:                            │
│    Réduction des bugs de 40%...         │
│                                         │
│ [Leadership] [Gestion de crise] [...]   │
└────────────────────────────────────────┘
```

## Styles CSS

Les styles sont dans [src/style.css](src/style.css:738-878)

**Classes principales :**

- `.star-card` : Carte d'expérience
- `.star-badge` : Badge doré "STAR"
- `.star-section` : Section S/T/A/R
- `.competency-badge` : Badge de compétence
- `.star-notification` : Notification temporaire

**Animations :**

- Hover sur carte : Élévation + ombre
- Notification : Slide depuis la droite
- Icône étoile : Pulsation continue

## Sécurité et Performance

### Sécurité

- ✅ Row Level Security activé
- ✅ Policies par utilisateur
- ✅ Validation des inputs côté API
- ✅ Pas d'exécution de code utilisateur

### Performance

- ✅ Extraction async (non-bloquante)
- ✅ Indexes sur user_id et journey_id
- ✅ Fonction avec SECURITY DEFINER
- ✅ Cache local des expériences

### Gestion des Erreurs

```javascript
try {
  await extractSTARExperience(narrative);
} catch (error) {
  // Ne bloque PAS l'utilisateur
  console.warn('Extraction STAR échouée:', error);
}
```

L'extraction est **non-critique** : même si elle échoue, l'utilisateur peut continuer son parcours.

## Améliorations Futures

- [ ] **Édition manuelle** : Permettre à l'utilisateur de modifier les STAR
- [ ] **Ré-extraction** : Re-générer un STAR différent
- [ ] **Export PDF** : Télécharger toutes les expériences en PDF
- [ ] **Templates** : Modèles pour différents secteurs
- [ ] **Tri et filtre** : Organiser par compétence ou date
- [ ] **Favoris** : Marquer les meilleures expériences
- [ ] **Partage** : Générer un lien public de profil

## Dépannage

### L'extraction ne fonctionne pas

1. Vérifier que le workflow n8n est actif
2. Vérifier l'URL du webhook dans config.js
3. Vérifier les credentials Claude AI dans n8n
4. Consulter les logs n8n pour les erreurs

### Les expériences ne s'affichent pas

1. Vérifier que la table `star_experiences` existe
2. Vérifier les policies RLS
3. Ouvrir la console (F12) pour voir les erreurs
4. Vérifier que `loadSTARExperiences()` est appelée

### Erreur de parsing JSON

Le workflow inclut une gestion robuste des erreurs :
- Nettoie les backticks markdown
- Valide les champs requis
- Retourne les erreurs détaillées

## Support

Pour toute question ou problème :

1. Consulter les logs de la console navigateur (F12)
2. Vérifier les logs d'exécution dans n8n
3. Tester manuellement l'API avec Postman/curl
4. Vérifier les données dans Supabase

---

**Version** : 1.0.0
**Date** : Décembre 2025
**Auteur** : JobSeek Hero Journey Team
