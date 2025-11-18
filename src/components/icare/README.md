# Composants I.C.A.R.E. Transformation

Ce dossier contient tous les composants pour afficher et exporter le profil de transformation I.C.A.R.E. de l'utilisateur.

## 📁 Structure

```
src/components/icare/
├── ICARETransformationPage.tsx    # Page principale d'affichage
├── ICARETransformationDemo.tsx    # Composant demo avec données
├── ICAREDimensionCard.tsx         # Carte pour une dimension
├── BeforeAfterComparison.tsx      # Comparaison AVANT/APRÈS
├── ICAREProgressBar.tsx           # Barre de progression visuelle
├── DownloadPDFButton.tsx          # Bouton export PDF
└── index.ts                       # Exports
```

## 🚀 Usage Rapide

### 1. Afficher la page I.C.A.R.E. avec données demo

```tsx
import { ICARETransformationDemo } from './components/icare';

function App() {
  return <ICARETransformationDemo />;
}
```

### 2. Afficher la page avec vos propres données

```tsx
import { ICARETransformationPage } from './components/icare';

function MyProfile() {
  const transformationData = {
    userName: 'Jean Dupont',
    journeyDuration: '3 mois',
    totalProgression: 115,
    dimensions: [
      {
        dimension: 'Identité',
        icon: '🎭',
        scoreBefore: 4,
        scoreAfter: 8,
        phraseBefore: 'Je suis défini par mon titre professionnel',
        phraseAfter: 'Je connais mes valeurs profondes et je les incarne',
        color: 'from-blue-500 to-indigo-500',
      },
      // ... autres dimensions
    ],
    insights: [
      'Ta plus grande évolution est sur la dimension Identité...',
    ],
    recommendations: [
      'Continue à explorer tes valeurs personnelles',
      'Pratique la méditation quotidienne',
    ],
  };

  return <ICARETransformationPage {...transformationData} />;
}
```

### 3. Utiliser le hook pour récupérer les données

```tsx
import { useICARETransformation } from '../../hooks/useICARETransformation';
import { ICARETransformationPage } from './components/icare';

function ProfilePage() {
  const data = useICARETransformation();

  if (!data) {
    return <div>Chargement...</div>;
  }

  return <ICARETransformationPage {...data} />;
}
```

### 4. Ajouter le bouton de téléchargement PDF

Le bouton est déjà intégré dans `ICARETransformationPage`. Pour l'utiliser séparément :

```tsx
import { DownloadPDFButton } from './components/icare';

function MyComponent() {
  return (
    <DownloadPDFButton
      userName="Jean Dupont"
      journeyDuration="3 mois"
      totalProgression={115}
      dimensions={[...]}
      insights={[...]}
      recommendations={[...]}
    />
  );
}
```

## 📊 Types de données

### DimensionData

```typescript
interface ICAREDimensionData {
  dimension: 'Identité' | 'Capacités' | 'Appartenance' | 'Risque' | 'Estime';
  icon: string; // Emoji
  scoreBefore: number; // 0-10
  scoreAfter: number; // 0-10
  phraseBefore: string;
  phraseAfter: string;
  color: string; // Tailwind gradient classes
}
```

### TransformationData

```typescript
interface ICARETransformationPageProps {
  userName: string;
  journeyDuration: string; // ex: "3 mois"
  totalProgression: number; // Pourcentage (ex: 115)
  dimensions: ICAREDimensionData[];
  insights?: string[];
  recommendations?: string[];
}
```

## 🎨 Personnalisation

### Couleurs des dimensions

Les couleurs sont définies dans `ICAREDimensionCard.tsx` :

```typescript
const colors = {
  Identité: 'from-blue-500 to-indigo-500',
  Capacités: 'from-orange-500 to-amber-500',
  Appartenance: 'from-green-500 to-emerald-500',
  Risque: 'from-red-500 to-rose-500',
  Estime: 'from-purple-500 to-violet-500',
};
```

### Icônes des dimensions

```typescript
const icons = {
  Identité: '🎭',
  Capacités: '🎯',
  Appartenance: '🤝',
  Risque: '🚀',
  Estime: '💎',
};
```

## 📄 Export PDF

Le système PDF utilise `@react-pdf/renderer` pour générer des documents professionnels.

### Fichiers PDF

```
src/pdf/
├── ICAREDocument.tsx    # Document PDF complet (4 pages)
├── Page3PDF.tsx         # Page 3 - Transformation I.C.A.R.E.
├── Page4PDF.tsx         # Page 4 - Suite + Recommandations
└── styles.ts            # Styles PDF réutilisables
```

### Structure du PDF généré

1. **Page 1** : Page de garde avec nom et date
2. **Page 2** : Introduction aux 5 dimensions I.C.A.R.E.
3. **Page 3** : Transformation détaillée (2 premières dimensions + insights)
4. **Page 4** : Suite dimensions + Recommandations + Message final

## 🗄️ Base de données

### Table Supabase

La table `icare_evolution` stocke les transformations :

```sql
CREATE TABLE icare_evolution (
  id UUID PRIMARY KEY,
  journey_id UUID REFERENCES hero_journeys(id),
  dimension TEXT,
  score_before INTEGER,
  score_after INTEGER,
  phrase_before TEXT,
  phrase_after TEXT,
  insights JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Service Supabase

```typescript
import { getICAREEvolutions, upsertICAREEvolution } from '@/services/supabase';

// Récupérer les évolutions
const evolutions = await getICAREEvolutions(journeyId);

// Créer/Mettre à jour une évolution
await upsertICAREEvolution({
  journey_id: journeyId,
  dimension: 'Identité',
  score_before: 40,
  score_after: 80,
  phrase_before: '...',
  phrase_after: '...',
});
```

## 🔧 Fonctions utilitaires

### Hook useICARETransformation

Récupère et formate les données de transformation depuis le profil store.

```typescript
const data = useICARETransformation();
// Retourne: TransformationData | null
```

### Génération des insights

Les insights sont générés automatiquement en fonction :
- De la dimension avec la plus grande progression
- Des dimensions fortes (score ≥ 7)
- Des dimensions à améliorer (score < 6)
- Du score moyen global

## 📱 Responsive Design

Tous les composants sont responsives avec Tailwind CSS :

- **Mobile** : Stack vertical, grilles 1 colonne
- **Tablet** : Grilles 2 colonnes pour les comparaisons
- **Desktop** : Layout optimisé avec max-width 7xl

## 🎯 Prochaines étapes

### Intégration OpenAI (Phase 3)

Pour générer des phrases et insights personnalisés :

```typescript
// TODO: Créer service OpenAI
const generatePhrase = async (dimension: string, score: number) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Tu es un coach professionnel spécialisé en développement personnel.',
      },
      {
        role: 'user',
        content: `Génère une phrase décrivant l'état d'une personne sur la dimension ${dimension} avec un score de ${score}/10.`,
      },
    ],
  });
  return response.choices[0].message.content;
};
```

### Analytics

Ajouter un tracking pour :
- Nombre de PDF téléchargés
- Temps passé sur la page
- Dimensions les plus consultées

## 🐛 Debug

### Le PDF ne se génère pas

1. Vérifier que `@react-pdf/renderer` est installé
2. Vérifier la console pour les erreurs
3. Tester avec des données minimales

### Les animations ne fonctionnent pas

1. Vérifier que `framer-motion` est installé
2. Désactiver temporairement pour isoler le problème

### Les données ne s'affichent pas

1. Vérifier le profileStore avec Redux DevTools
2. Vérifier les données Supabase directement
3. Utiliser le composant Demo pour tester avec données mock

## 📚 Ressources

- [Documentation @react-pdf/renderer](https://react-pdf.org/)
- [Documentation Framer Motion](https://www.framer.com/motion/)
- [Documentation Supabase](https://supabase.com/docs)
