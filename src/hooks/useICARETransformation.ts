/**
 * Hook pour récupérer les données de transformation I.C.A.R.E.
 * Génère les données AVANT/APRÈS pour afficher l'évolution
 */

import { useEffect, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { ICAREDimension } from '../types/profile';

interface DimensionTransformation {
  dimension: ICAREDimension;
  icon: string;
  scoreBefore: number;
  scoreAfter: number;
  phraseBefore: string;
  phraseAfter: string;
  color: string;
}

interface TransformationData {
  userName: string;
  journeyDuration: string;
  totalProgression: number;
  dimensions: DimensionTransformation[];
  insights: string[];
  recommendations: string[];
}

const dimensionConfig: Record<
  ICAREDimension,
  { icon: string; color: string; phrasesAvant: string[]; phrasesApres: string[] }
> = {
  Identité: {
    icon: '🎭',
    color: 'from-blue-500 to-indigo-500',
    phrasesAvant: [
      'Je suis défini par mon titre et mon statut professionnel',
      'Sans mon rôle, je ne sais pas qui je suis vraiment',
      'Je me sens perdu quand on me demande qui je suis au-delà de mon travail',
    ],
    phrasesApres: [
      'Je suis bien plus que mon métier, j\'ai une identité riche et multifacette',
      'Je connais mes valeurs profondes et je les incarne',
      'Je sais qui je suis, indépendamment de mon statut professionnel',
    ],
  },
  Capacités: {
    icon: '🎯',
    color: 'from-orange-500 to-amber-500',
    phrasesAvant: [
      'Je doute constamment de mes compétences malgré mes réussites',
      'J\'ai peur d\'être démasqué comme incompétent',
      'Je minimise mes réalisations et attribue mes succès à la chance',
    ],
    phrasesApres: [
      'Je reconnais mes compétences et mes forces uniques',
      'J\'assume pleinement mes réussites et mes talents',
      'Je sais ce que je peux apporter et j\'ai confiance en mes capacités',
    ],
  },
  Appartenance: {
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    phrasesAvant: [
      'Je me sens isolé et déconnecté de mon environnement professionnel',
      'J\'ai peur d\'être rejeté si je montre qui je suis vraiment',
      'Je ne trouve pas ma place dans les équipes',
    ],
    phrasesApres: [
      'Je trouve ma place naturellement dans les collectifs',
      'J\'ose être authentique et je crée des liens véritables',
      'Je me sens pleinement intégré tout en restant moi-même',
    ],
  },
  Risque: {
    icon: '🚀',
    color: 'from-red-500 to-rose-500',
    phrasesAvant: [
      'Je reste paralysé face aux décisions importantes',
      'La peur de l\'échec m\'empêche d\'avancer',
      'Je préfère la sécurité même si elle m\'étouffe',
    ],
    phrasesApres: [
      'J\'ose prendre des risques calculés pour progresser',
      'J\'accepte l\'incertitude comme partie du voyage',
      'Je transforme mes peurs en actions courageuses',
    ],
  },
  Estime: {
    icon: '💎',
    color: 'from-purple-500 to-violet-500',
    phrasesAvant: [
      'Ma valeur dépend de mes performances et de la reconnaissance externe',
      'Je ne me sens légitime que quand je réussis parfaitement',
      'Je cherche constamment l\'approbation des autres',
    ],
    phrasesApres: [
      'Je reconnais ma valeur intrinsèque, indépendamment de mes résultats',
      'Je m\'accepte avec mes forces et mes faiblesses',
      'Je suis mon propre validateur, je ne cherche plus l\'approbation constante',
    ],
  },
};

/**
 * Génère des données de transformation simulées
 * TODO: Remplacer par vraies données de Supabase quand table icare_evolution existe
 */
export const useICARETransformation = (): TransformationData | null => {
  const { scores } = useProfileStore((state) => ({
    scores: state.profile.icare,
  }));
  const { getRecommendations } = useProfileStore();

  const [data, setData] = useState<TransformationData | null>(null);

  useEffect(() => {
    // Pour l'instant, on génère des données de démo
    // Les scores "après" viennent du profil actuel
    // Les scores "avant" sont simulés (60% des scores actuels)

    const dimensions: DimensionTransformation[] = (
      Object.keys(dimensionConfig) as ICAREDimension[]
    ).map((dimension) => {
      const config = dimensionConfig[dimension];
      const scoreAfter = Math.round(scores[dimension] / 10); // Convertir 0-100 → 0-10
      const scoreBefore = Math.max(1, Math.round(scoreAfter * 0.6)); // 60% du score actuel

      // Sélectionner une phrase aléatoire
      const phraseBefore =
        config.phrasesAvant[Math.floor(Math.random() * config.phrasesAvant.length)];
      const phraseAfter =
        config.phrasesApres[Math.floor(Math.random() * config.phrasesApres.length)];

      return {
        dimension,
        icon: config.icon,
        scoreBefore,
        scoreAfter,
        phraseBefore,
        phraseAfter,
        color: config.color,
      };
    });

    // Calculer la progression globale
    const avgBefore = dimensions.reduce((sum, d) => sum + d.scoreBefore, 0) / 5;
    const avgAfter = dimensions.reduce((sum, d) => sum + d.scoreAfter, 0) / 5;
    const totalProgression = Math.round(((avgAfter - avgBefore) / avgBefore) * 100);

    // Insights personnalisés basés sur les dimensions
    const insights = generateInsights(dimensions);

    // Recommandations du store
    const recommendations = getRecommendations().slice(0, 6);

    setData({
      userName: 'Voyageur', // TODO: Récupérer le vrai nom de l'utilisateur
      journeyDuration: '3 mois', // TODO: Calculer depuis les timestamps
      totalProgression,
      dimensions,
      insights,
      recommendations,
    });
  }, [scores, getRecommendations]);

  return data;
};

/**
 * Génère des insights personnalisés basés sur les transformations
 */
function generateInsights(dimensions: DimensionTransformation[]): string[] {
  const insights: string[] = [];

  // Trouver la dimension avec la plus grande progression
  const bestProgress = dimensions.reduce((best, current) => {
    const currentProg = current.scoreAfter - current.scoreBefore;
    const bestProg = best.scoreAfter - best.scoreBefore;
    return currentProg > bestProg ? current : best;
  });

  insights.push(
    `Ta plus grande évolution est sur la dimension **${bestProgress.dimension}** avec une progression de ${bestProgress.scoreAfter - bestProgress.scoreBefore} points. Cela montre ta capacité à transformer cette zone de blocage en force.`
  );

  // Identifier les dimensions fortes
  const strongDimensions = dimensions.filter((d) => d.scoreAfter >= 7);
  if (strongDimensions.length > 0) {
    insights.push(
      `Tu as développé des forces solides en ${strongDimensions.map((d) => d.dimension).join(', ')}. Ces dimensions constituent maintenant des piliers de ton développement professionnel.`
    );
  }

  // Identifier les zones d'amélioration
  const weakDimensions = dimensions.filter((d) => d.scoreAfter < 6);
  if (weakDimensions.length > 0) {
    insights.push(
      `Les dimensions ${weakDimensions.map((d) => d.dimension).join(' et ')} peuvent encore progresser. Continue à les travailler dans les prochains mois pour renforcer ton équilibre global.`
    );
  }

  // Score moyen global
  const avgScore = dimensions.reduce((sum, d) => sum + d.scoreAfter, 0) / 5;
  if (avgScore >= 7) {
    insights.push(
      `Avec un score moyen de ${avgScore.toFixed(1)}/10, tu as atteint un niveau de maturité professionnelle remarquable. Continue sur cette trajectoire pour devenir une version encore plus accomplie de toi-même.`
    );
  } else if (avgScore >= 5) {
    insights.push(
      `Ton score moyen de ${avgScore.toFixed(1)}/10 montre une progression solide. Tu es sur le bon chemin pour transformer durablement ton développement professionnel.`
    );
  }

  return insights;
}
