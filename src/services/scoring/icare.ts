/**
 * Système de scoring I.C.A.R.E.
 * Analyse les 5 dimensions de blocage professionnel
 */

import type { ICAREScores, ICAREProfile, ICAREDimension, StationAnswers } from '../../types/profile';

/**
 * Calcule les scores I.C.A.R.E. basés sur les réponses aux stations
 */
export function calculateICARE(allAnswers: Record<string, StationAnswers>): ICAREScores {
  const scores: ICAREScores = {
    Identité: 0,
    Capacités: 0,
    Appartenance: 0,
    Risque: 0,
    Estime: 0,
  };

  // Station 1 : Le Monde Ordinaire
  // Teste principalement : Identité + Estime
  if (allAnswers.station1) {
    const s1 = allAnswers.station1;

    // Analyse des patterns de réponse pour détecter les blocages
    // Ces règles seront affinées quand tu auras le contenu complet

    // Détection Identité : sentiment de décalage
    if (String(s1.q0).toLowerCase().includes('ne reconnais plus') ||
        String(s1.q0).toLowerCase().includes('perdu') ||
        String(s1.q0).toLowerCase().includes('qui suis-je')) {
      scores.Identité += 30;
    }

    // Détection Estime : honte, dévalorisation
    if (String(s1.q1).toLowerCase().includes('honte') ||
        String(s1.q1).toLowerCase().includes('nul') ||
        String(s1.q1).toLowerCase().includes('pas assez')) {
      scores.Estime += 25;
    }
  }

  // Station 2 : L'Appel à l'Aventure
  // Teste : Identité + Estime
  if (allAnswers.station2) {
    const s2 = allAnswers.station2;

    // Détection Identité : confusion sur la direction
    if (String(s2.q0).toLowerCase().includes('ne sais pas') ||
        String(s2.q0).toLowerCase().includes('perdu')) {
      scores.Identité += 20;
    }

    // Détection Estime : doute sur sa légitimité
    if (String(s2.q1).toLowerCase().includes('mérite') ||
        String(s2.q1).toLowerCase().includes('digne')) {
      scores.Estime += 20;
    }
  }

  // Station 3 : Le Refus de l'Appel
  // Teste : Risque + Estime
  if (allAnswers.station3) {
    const s3 = allAnswers.station3;

    // Détection Risque : peur de l'échec, catastrophisme
    if (String(s3.q0).toLowerCase().includes('échec') ||
        String(s3.q0).toLowerCase().includes('tout perdre') ||
        String(s3.q0).toLowerCase().includes('danger')) {
      scores.Risque += 35;
    }

    // Détection Estime : peur du jugement
    if (String(s3.q1).toLowerCase().includes('jugement') ||
        String(s3.q1).toLowerCase().includes('regard des autres') ||
        String(s3.q1).toLowerCase().includes('ridicule')) {
      scores.Estime += 30;
    }
  }

  // Station 4 : La Rencontre avec le Mentor
  // Teste : Capacités + Appartenance
  if (allAnswers.station4) {
    const s4 = allAnswers.station4;

    // Détection Capacités : sentiment d'incompétence
    if (String(s4.q0).toLowerCase().includes('ne sais pas') ||
        String(s4.q0).toLowerCase().includes('manque')) {
      scores.Capacités += 25;
    }

    // Détection Appartenance : isolement
    if (String(s4.q1).toLowerCase().includes('seul') ||
        String(s4.q1).toLowerCase().includes('personne')) {
      scores.Appartenance += 30;
    }
  }

  // Station 5 : Le Franchissement du Seuil
  // Teste : Risque + Identité
  if (allAnswers.station5) {
    const s5 = allAnswers.station5;

    // Détection Risque : paralysie décisionnelle
    if (String(s5.q0).toLowerCase().includes('attends') ||
        String(s5.q0).toLowerCase().includes('pas encore') ||
        String(s5.q0).toLowerCase().includes('conditions')) {
      scores.Risque += 30;
    }
  }

  // Station 6 : Les Épreuves, Alliés et Ennemis
  // Teste les 3 types : Capacités, Identité+Estime, Appartenance+Risque
  if (allAnswers.station6) {
    const s6 = allAnswers.station6;

    // Détection Capacités : blocages techniques
    if (String(s6.q0).toLowerCase().includes('ne sais pas faire') ||
        String(s6.q0).toLowerCase().includes('compétences')) {
      scores.Capacités += 30;
    }

    // Détection Appartenance : qui sont les vrais alliés
    if (String(s6.q1).toLowerCase().includes('personne') ||
        String(s6.q1).toLowerCase().includes('seul')) {
      scores.Appartenance += 25;
    }
  }

  // Station 7 : L'Approche de la Caverne
  // Toutes les dimensions peuvent être testées
  if (allAnswers.station7) {
    const s7 = allAnswers.station7;

    // Analyse de la plus grande peur
    const peur = String(s7.q1).toLowerCase();

    if (peur.includes('imposteur') || peur.includes('identité')) {
      scores.Identité += 25;
    }
    if (peur.includes('compétence') || peur.includes('savoir')) {
      scores.Capacités += 25;
    }
    if (peur.includes('seul') || peur.includes('rejet')) {
      scores.Appartenance += 25;
    }
    if (peur.includes('perdre') || peur.includes('échec')) {
      scores.Risque += 25;
    }
    if (peur.includes('valeur') || peur.includes('mérite')) {
      scores.Estime += 25;
    }
  }

  // Station 8 : L'Épreuve Suprême - Le Dragon Principal
  // C'est LA station qui révèle le blocage dominant
  if (allAnswers.station8) {
    const s8 = allAnswers.station8;

    // Si l'utilisateur identifie explicitement son dragon
    const dragon = s8.dragon_principal as string;

    if (dragon === 'identite') {
      scores.Identité += 40;
    } else if (dragon === 'capacites') {
      scores.Capacités += 40;
    } else if (dragon === 'appartenance') {
      scores.Appartenance += 40;
    } else if (dragon === 'risque') {
      scores.Risque += 40;
    } else if (dragon === 'estime') {
      scores.Estime += 40;
    }
  }

  // Normaliser les scores sur 100
  Object.keys(scores).forEach((key) => {
    const dimension = key as ICAREDimension;
    scores[dimension] = Math.min(100, scores[dimension]);
  });

  return scores;
}

/**
 * Détermine le profil I.C.A.R.E. dominant ou mixte
 */
export function getICAREProfile(scores: ICAREScores): ICAREProfile {
  // Trier par score décroissant
  const sorted = (Object.entries(scores) as [ICAREDimension, number][])
    .sort((a, b) => b[1] - a[1]);

  const [primary, primaryScore] = sorted[0];
  const [secondary, secondaryScore] = sorted[1];

  // Si les 2 scores dominants sont proches (écart <15), profil mixte
  if (primaryScore - secondaryScore < 15 && secondaryScore >= 30) {
    return {
      type: 'mixte',
      dimensions: [primary, secondary],
      score: Math.round((primaryScore + secondaryScore) / 2),
      description: getProfileDescription(primary, secondary),
    };
  }

  // Sinon, profil dominant unique
  return {
    type: 'dominant',
    dimension: primary,
    score: Math.round(primaryScore),
    description: getProfileDescription(primary),
  };
}

/**
 * Descriptions des profils I.C.A.R.E.
 */
function getProfileDescription(
  primary: ICAREDimension,
  secondary?: ICAREDimension
): string {
  const descriptions: Record<ICAREDimension, string> = {
    Identité: `**Profil Identité** : Tu traverses une crise identitaire.
      "Qui suis-je vraiment ?" est ta question centrale.
      Tu as peut-être sur-identifié ton rôle professionnel avec ton identité personnelle.`,

    Capacités: `**Profil Capacités** : Le syndrome de l'imposteur te guette.
      Tu doutes de tes compétences et te demandes "Suis-je vraiment capable ?".
      Tu as tendance à dévaloriser ce que tu sais faire.`,

    Appartenance: `**Profil Appartenance** : Tu ressens un sentiment d'isolement.
      "Où est ma place ?" est ta question.
      Tu as l'impression d'être entre deux mondes, sans vraie tribu.`,

    Risque: `**Profil Risque** : La peur de l'échec te paralyse.
      Tu es en hypervigilance et catastrophisme.
      "Et si tout s'effondre ?" est ta pensée récurrente.`,

    Estime: `**Profil Estime** : Ta valeur personnelle est conditionnelle.
      "Est-ce que je mérite ?" est ta question douloureuse.
      L'auto-sabotage et la honte peuvent te freiner.`,
  };

  if (secondary) {
    return `**Profil Mixte ${primary} + ${secondary}** :
      Deux dimensions se combinent pour créer ton blocage unique.

      ${descriptions[primary]}

      ET

      ${descriptions[secondary]}`;
  }

  return descriptions[primary];
}

/**
 * Recommandations basées sur le profil I.C.A.R.E.
 */
export function getICARERecommendations(profile: ICAREProfile): string[] {
  const recommendations: Record<ICAREDimension, string[]> = {
    Identité: [
      'Travaille sur la séparation entre TOI et ton RÔLE professionnel',
      'Explore : "Qui serais-je si je n\'avais jamais eu ce job ?"',
      'Pratique : Écris ta biographie en dehors du travail',
      'Identifie tes valeurs profondes (au-delà du CV)',
    ],

    Capacités: [
      'Liste toutes tes micro-victoires professionnelles',
      'Demande du feedback factuel (pas émotionnel) sur tes compétences',
      'Fais un inventaire de compétences avec un coach',
      'Applique la règle : "Si je l\'ai fait 1x, je peux le refaire"',
    ],

    Appartenance: [
      'Rejoins une communauté de personnes en transition',
      'Identifie 3 personnes qui ont vécu le même parcours',
      'Participe à des événements de networking (même virtuels)',
      'Trouve ta "tribu" professionnelle (pas juste un job)',
    ],

    Risque: [
      'Pratique l\'exposition graduelle au risque (micro-paris)',
      'Pour chaque peur : Écris le "Pire scénario" vs "Scénario réaliste"',
      'Calcule le coût réel (pas fantasmé) de l\'échec',
      'Crée un filet de sécurité concret avant de sauter',
    ],

    Estime: [
      'Déconnecte ta valeur de tes résultats professionnels',
      'Pratique l\'auto-compassion (parle-toi comme à un ami)',
      'Identifie tes croyances limitantes sur toi-même',
      'Célèbre tes efforts, pas seulement tes réussites',
    ],
  };

  if (profile.type === 'mixte' && profile.dimensions) {
    return [
      ...recommendations[profile.dimensions[0]].slice(0, 2),
      ...recommendations[profile.dimensions[1]].slice(0, 2),
    ];
  }

  if (profile.dimension) {
    return recommendations[profile.dimension];
  }

  return [];
}
