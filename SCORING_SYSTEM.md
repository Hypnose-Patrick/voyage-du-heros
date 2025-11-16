# 🧠 Système de Scoring Intelligent

## Vue d'ensemble

Le **Parcours du Héros** intègre un système de scoring avancé qui analyse les réponses de l'utilisateur pour créer un profil personnalisé basé sur :

1. **I.C.A.R.E.** - Les 5 dimensions de blocage professionnel
2. **Méta-Programmes** - Les 17 filtres perceptuels (PNL)
3. **Profils Symboliques** - Archétype, Animal Totem, Élément

---

## 📊 Architecture du Système

```
src/
├── types/
│   └── profile.ts              # Définitions TypeScript complètes
├── services/
│   └── scoring/
│       ├── icare.ts           # Calcul des 5 dimensions I.C.A.R.E.
│       ├── metaProgrammes.ts  # Détection des 17 méta-programmes
│       └── archetype.ts       # Calcul Archétype + Totem + Élément
└── store/
    └── profileStore.ts        # State management Zustand
```

---

## 🎯 I.C.A.R.E. - Les 5 Dimensions de Blocage

### Identité (I)
**"Qui suis-je vraiment ?"**

- **Symptômes** : Sur-identification au rôle, perte de repères, confusion existentielle
- **Stations clés** : 1, 2, 8, 9, 11
- **Détection** : Mots-clés comme "ne me reconnais plus", "perdu", "qui suis-je"

### Capacités (C)
**"Qu'est-ce que je sais faire ?"**

- **Symptômes** : Dévalorisation des compétences, syndrome de l'imposteur
- **Stations clés** : 4, 6, 8, 9
- **Détection** : "ne sais pas faire", "imposteur", "pas capable"

### Appartenance (A)
**"Où est ma place ?"**

- **Symptômes** : Isolement social, perte de tribu, sentiment de rejet
- **Stations clés** : 4, 6, 8, 10, 11
- **Détection** : "seul", "personne", "rejet", "isolé"

### Risque (R)
**"Qu'est-ce que j'ose ?"**

- **Symptômes** : Hypervigilance, paralysie décisionnelle, catastrophisme
- **Stations clés** : 3, 5, 7, 8, 10
- **Détection** : "échec", "tout perdre", "danger", "risque"

### Estime (E)
**"Quelle est ma valeur ?"**

- **Symptômes** : Estime conditionnelle, honte, auto-sabotage
- **Stations clés** : 2, 3, 6, 8, 9
- **Détection** : "honte", "mérite", "valeur", "nul", "pas assez"

---

## 🧩 Les 17 Méta-Programmes

### 1. Orientation Motivation (Vers / Évitement)
**Station détectrice** : Station 1

- **VERS** (>65) : Motivé par les objectifs et opportunités
- **ÉVITEMENT** (>65) : Motivé par résolution de problèmes et protection
- **Mots VERS** : "atteindre", "construire", "créer", "réussir"
- **Mots ÉVITEMENT** : "éviter", "problème", "danger", "sécurité"

### 2. Référence (Interne / Externe)
**Station détectrice** : Station 3

- **INTERNE** (>65) : Boussole intérieure, auto-validation
- **EXTERNE** (>65) : Validation extérieure, regard des autres
- **Mots INTERNE** : "je sais", "je sens", "ma conviction"
- **Mots EXTERNE** : "les autres", "on dit", "jugement", "avis"

### 3. Proactivité
**Stations détectrices** : Stations 2 et 5

- **Proactif Fort** : Action immédiate, leadership
- **Équilibre** : Mix action/réflexion
- **Réactif** : Attente des conditions optimales

### 4. Taille Découpage (Global / Spécifique)
**Station détectrice** : Station 4

- **GLOBAL** : Vue d'ensemble, big picture
- **SPÉCIFIQUE** : Détails, précision, étapes

### 5. Tri Primaire
**Stations détectrices** : Analyse globale

- **PERSONNES** : Relations humaines au cœur
- **TÂCHES** : Orienté résultats
- **INFORMATIONS** : Apprentissage et connaissance
- **LIEUX** : Environnement physique

### 6-17. Autres Méta-Programmes

- Orientation Temps (Passé / Présent / Futur)
- Raisonnement (Inductif / Déductif / Abductif)
- Facteurs Décision (Options / Procédures)
- Mode Relation (Concordance / Différence)
- Structure Temps, Position Perception, Canal Conviction, etc.

---

## 🎭 Profils Symboliques

### Les 6 Archétypes

**EXPLORATEUR** 🦅
- **Formule** : Vers + Options + Futur + Externe
- **Totem** : Aigle
- **Traits** : Curiosité, découverte, nouveauté
- **Message** : "Tu es né(e) pour explorer l'inconnu"

**GUERRIER** 🐺
- **Formule** : Vers + Interne + Proactif + Tâches
- **Totem** : Loup
- **Traits** : Détermination, courage, résultats
- **Message** : "Les obstacles te galvanisent"

**SAGE** 🦉
- **Formule** : Informations + Spécifique + Réflexion + Passé
- **Totem** : Chouette
- **Traits** : Sagesse, réflexion, connaissance
- **Message** : "Tu vois ce que les autres ne voient pas"

**CRÉATEUR** 🦋
- **Formule** : Options + Global + Abductif + Flexibilité
- **Totem** : Papillon
- **Traits** : Imagination, innovation, expression
- **Message** : "Tu transformes le banal en extraordinaire"

**SOUVERAIN** 🦁
- **Formule** : Tâches + Procédures + Structure + Externe
- **Totem** : Lion
- **Traits** : Leadership, responsabilité, organisation
- **Message** : "Tu es né(e) pour diriger avec noblesse"

**MAGICIEN** 🐉
- **Formule** : Interne + Futur + Abductif + Global
- **Totem** : Dragon
- **Traits** : Transformation, vision, intuition
- **Message** : "Tu maîtrises l'art de la transformation"

### Les 4 Éléments

**FEU** 🔥
- **Formule** : Vers + Proactif + Action + Options
- **Nature** : Énergie de transformation rapide
- **Force** : Passage à l'action
- **Attention** : Ne pas se consumer

**EAU** 🌊
- **Formule** : Personnes + Externe + Concordance + Flexibilité
- **Nature** : Adaptation fluide
- **Force** : Intelligence émotionnelle
- **Attention** : Ne pas se perdre dans le courant

**AIR** 💨
- **Formule** : Informations + Options + Global + Abductif
- **Nature** : Légèreté intellectuelle
- **Force** : Prise de hauteur
- **Attention** : Ne pas se perdre dans les nuages

**TERRE** 🌍
- **Formule** : Tâches + Procédures + Spécifique + Structure
- **Nature** : Stabilité constructrice
- **Force** : Concrétisation et persévérance
- **Attention** : Ne pas devenir rigide

---

## 🔧 Utilisation Technique

### Store Zustand

```typescript
import { useProfileStore } from '../store/profileStore';

// Dans un composant
const { updateStationAnswers, completeStation } = useProfileStore();

// Sauvegarder des réponses
updateStationAnswers(1, { q0: "Ma réponse", q1: "Autre réponse" });

// Compléter une station
completeStation(1); // +100 XP automatique
```

### Hooks Personnalisés

```typescript
import {
  useProfile,
  useMetaProgrammes,
  useICARE,
  useSymbolicProfiles,
  useProgression
} from '../store/profileStore';

// Obtenir le profil complet
const profile = useProfile();

// Obtenir uniquement les méta-programmes
const metaProgrammes = useMetaProgrammes();

// Obtenir le profil I.C.A.R.E.
const { scores, profile: icareProfile } = useICARE();

// Obtenir archétype, totem, élément
const { archetype, totem, element } = useSymbolicProfiles();

// Obtenir la progression
const { level, totalXP, completion } = useProgression();
```

### Recalcul Automatique

Le profil est **recalculé automatiquement** à chaque fois qu'une station est complétée :

```typescript
handleFinish = () => {
  // 1. Sauvegarder les réponses
  updateStationAnswers(station.id, answers);

  // 2. Marquer comme complété (calcule les XP)
  completeStation(station.id);

  // 3. Le store recalcule automatiquement :
  //    - Scores I.C.A.R.E.
  //    - Méta-programmes
  //    - Archétype, Totem, Élément
};
```

---

## 📈 Système de Progression

### XP et Niveaux

- **100 XP** par station complétée
- **Niveau** = `Math.floor(totalXP / 150) + 1`
- **12 stations** = 1200 XP max = **Niveau 9 maximum**

### Badges et Achievements (à venir)

- 🦅 L'Explorateur
- 🗡️ Le Guerrier
- 📚 Le Sage
- 🎨 Le Créateur
- 👑 Le Souverain
- ✨ Le Magicien
- 🎯 Face aux Dragons (Station 8 complétée)
- 🔥 Flamme Intérieure (Score Interne >80)

---

## 🎨 Affichage du Profil

### Composant ProfileSummary

```typescript
<ProfileSummary onClose={() => setCurrentStep('dashboard')} />
```

Affiche :
- 🎭 Archétype + message personnalisé
- 🦅 Animal Totem + traits
- 🔥 Élément dominant + description
- 📊 Barres de scores I.C.A.R.E.
- 💡 Recommandations personnalisées

---

## 🚀 Prochaines Étapes

1. **Affiner les algorithmes** quand le contenu complet des stations sera intégré
2. **Ajouter des quiz de validation** pour confirmer les méta-programmes
3. **Implémenter le système de collectibles** (symboles, insights)
4. **Créer la génération PDF** de la "Carte du Héros"
5. **Ajouter les recommandations de carrière** basées sur le profil complet

---

## 📚 Références

- **I.C.A.R.E.** : Modèle de diagnostic des blocages professionnels
- **Méta-Programmes** : PNL (Programmation Neuro-Linguistique)
- **Archétypes** : Basés sur le monomythe de Joseph Campbell
- **4 Éléments** : Symbolisme classique adapté au profil professionnel

---

*Version : 1.0 - Phase 2 complétée*
*Auteur : Patrick Beiner - Implémenté par Claude Code*
