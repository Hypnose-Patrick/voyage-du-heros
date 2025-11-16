/**
 * Système de détection des 17 Méta-Programmes
 * Analyse les filtres perceptuels de l'utilisateur
 */

import type {
  MetaProgrammes,
  OrientationMotivation,
  Reference,
  Proactivite,
  StationAnswers,
} from '../../types/profile';

/**
 * Analyse complète des méta-programmes basée sur les réponses
 */
export function analyzeMetaProgrammes(
  allAnswers: Record<string, StationAnswers>
): Partial<MetaProgrammes> {
  return {
    orientationMotivation: analyzeOrientationMotivation(allAnswers),
    reference: analyzeReference(allAnswers),
    proactivite: analyzeProactivite(allAnswers),
    tailleDecoupage: analyzeTailleDecoupage(allAnswers),
    triPrimaire: analyzeTriPrimaire(allAnswers),
    orientationTemps: analyzeOrientationTemps(allAnswers),
    raisonnement: analyzeRaisonnement(allAnswers),
    facteursDecision: analyzeFacteursDecision(allAnswers),
    modeRelation: analyzeModeRelation(allAnswers),
    structureTemps: analyzeStructureTemps(allAnswers),
    positionPerception: analyzePositionPerception(allAnswers),
    canalConviction: analyzeCanalConviction(allAnswers),
    modeComparaison: analyzeModeComparaison(allAnswers),
    sourceMotivation: analyzeSourceMotivation(allAnswers),
    placementAttention: analyzePlacementAttention(allAnswers),
    styleAction: analyzeStyleAction(allAnswers),
    cadreTravail: analyzeCadreTravail(allAnswers),
  };
}

// ==========================================
// 1. ORIENTATION MOTIVATION (Vers / Évitement)
// Station 1 - Question fondamentale
// ==========================================

function analyzeOrientationMotivation(
  allAnswers: Record<string, StationAnswers>
): OrientationMotivation {
  let versScore = 50; // Commencer à l'équilibre

  // Station 1 : Analyse du langage
  if (allAnswers.station1) {
    const text = Object.values(allAnswers.station1).join(' ').toLowerCase();

    // Mots VERS
    const versKeywords = [
      'atteindre',
      'construire',
      'créer',
      'développer',
      'gagner',
      'réussir',
      'progresser',
      'grandir',
      'opportunité',
      'ambition',
      'objectif',
      'sommet',
    ];

    // Mots ÉVITEMENT
    const evitementKeywords = [
      'éviter',
      'sortir de',
      'échapper',
      'fuir',
      'problème',
      'difficulté',
      'danger',
      'peur',
      'menace',
      'protection',
      'sécurité',
      'danger',
    ];

    const versCount = versKeywords.filter((word) => text.includes(word)).length;
    const evitementCount = evitementKeywords.filter((word) => text.includes(word)).length;

    // Ajuster le score
    versScore += versCount * 10;
    versScore -= evitementCount * 10;
  }

  // Normaliser entre 0 et 100
  versScore = Math.max(0, Math.min(100, versScore));

  return {
    vers: versScore,
    evitement: 100 - versScore,
  };
}

// ==========================================
// 2. RÉFÉRENCE (Interne / Externe)
// Station 3 - D'où vient ta validation ?
// ==========================================

function analyzeReference(allAnswers: Record<string, StationAnswers>): Reference {
  let interneScore = 50;

  if (allAnswers.station3) {
    const text = Object.values(allAnswers.station3).join(' ').toLowerCase();

    // Mots INTERNE
    const interneKeywords = [
      'je sais',
      'je sens',
      'je crois',
      'mon intuition',
      'ma conviction',
      'pour moi',
      'je décide',
      'mon choix',
    ];

    // Mots EXTERNE
    const externeKeywords = [
      'les autres',
      'on dit',
      'les gens',
      'mon entourage',
      'validation',
      'reconnaissance',
      'regard',
      'jugement',
      'avis',
      'opinion',
    ];

    const interneCount = interneKeywords.filter((word) => text.includes(word)).length;
    const externeCount = externeKeywords.filter((word) => text.includes(word)).length;

    interneScore += interneCount * 10;
    interneScore -= externeCount * 10;
  }

  interneScore = Math.max(0, Math.min(100, interneScore));

  return {
    interne: interneScore,
    externe: 100 - interneScore,
  };
}

// ==========================================
// 3. PROACTIVITÉ (Action / Réaction)
// Station 2 et 5
// ==========================================

function analyzeProactivite(allAnswers: Record<string, StationAnswers>): Proactivite {
  let proactiviteScore = 50;

  // Station 2 : L'Appel à l'Aventure
  if (allAnswers.station2) {
    const text = Object.values(allAnswers.station2).join(' ').toLowerCase();

    const proactifKeywords = ['je vais', 'je fais', 'j\'agis', 'je décide', 'maintenant'];
    const reactifKeywords = ['j\'attends', 'on verra', 'peut-être', 'si', 'quand'];

    const proactifCount = proactifKeywords.filter((word) => text.includes(word)).length;
    const reactifCount = reactifKeywords.filter((word) => text.includes(word)).length;

    proactiviteScore += proactifCount * 15;
    proactiviteScore -= reactifCount * 15;
  }

  // Station 5 : Franchissement du Seuil
  if (allAnswers.station5) {
    const text = Object.values(allAnswers.station5).join(' ').toLowerCase();

    if (text.includes('maintenant') || text.includes('aujourd\'hui')) {
      proactiviteScore += 20;
    }
    if (text.includes('attends') || text.includes('pas encore')) {
      proactiviteScore -= 20;
    }
  }

  proactiviteScore = Math.max(0, Math.min(100, proactiviteScore));

  if (proactiviteScore >= 75) return 'proactif_fort';
  if (proactiviteScore >= 60) return 'proactif';
  if (proactiviteScore >= 40) return 'equilibre';
  if (proactiviteScore >= 25) return 'reactif';
  return 'reactif_fort';
}

// ==========================================
// 4. TAILLE DÉCOUPAGE (Global / Spécifique)
// Station 4
// ==========================================

function analyzeTailleDecoupage(allAnswers: Record<string, StationAnswers>) {
  if (!allAnswers.station4) return 'equilibre';

  const text = Object.values(allAnswers.station4).join(' ').toLowerCase();

  // Global : vue d'ensemble, concepts larges
  const globalKeywords = ['vision', 'ensemble', 'global', 'général', 'big picture', 'philosophie'];

  // Spécifique : détails, étapes, précision
  const specifiqueKeywords = ['détail', 'précis', 'étape', 'concret', 'spécifique', 'exact'];

  const globalCount = globalKeywords.filter((word) => text.includes(word)).length;
  const specifiqueCount = specifiqueKeywords.filter((word) => text.includes(word)).length;

  if (globalCount > specifiqueCount + 1) return 'global';
  if (specifiqueCount > globalCount + 1) return 'specifique';
  return 'equilibre';
}

// ==========================================
// 5. TRI PRIMAIRE (Personnes / Tâches / Informations / Lieux)
// Station 4 et 7
// ==========================================

function analyzeTriPrimaire(allAnswers: Record<string, StationAnswers>) {
  const scores = {
    personnes: 0,
    taches: 0,
    informations: 0,
    lieux: 0,
  };

  // Analyse du langage global
  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  // Personnes
  const personnesKeywords = ['équipe', 'gens', 'collègues', 'relations', 'réseau', 'rencontres'];
  scores.personnes = personnesKeywords.filter((word) => allText.includes(word)).length;

  // Tâches
  const tachesKeywords = ['projet', 'mission', 'objectif', 'résultat', 'accomplir', 'tâche'];
  scores.taches = tachesKeywords.filter((word) => allText.includes(word)).length;

  // Informations
  const informationsKeywords = [
    'apprendre',
    'savoir',
    'connaissance',
    'données',
    'information',
    'comprendre',
  ];
  scores.informations = informationsKeywords.filter((word) => allText.includes(word)).length;

  // Lieux
  const lieuxKeywords = ['lieu', 'endroit', 'bureau', 'environnement', 'espace', 'où'];
  scores.lieux = lieuxKeywords.filter((word) => allText.includes(word)).length;

  // Retourner le dominant
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0] as 'personnes' | 'taches' | 'informations' | 'lieux';
}

// ==========================================
// 6. ORIENTATION TEMPS (Passé / Présent / Futur)
// Station 6
// ==========================================

function analyzeOrientationTemps(allAnswers: Record<string, StationAnswers>) {
  const scores = {
    passe: 0,
    present: 0,
    futur: 0,
  };

  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  // Passé
  const passeKeywords = ['avant', 'anciennement', 'précédent', 'était', 'expérience'];
  scores.passe = passeKeywords.filter((word) => allText.includes(word)).length;

  // Présent
  const presentKeywords = ['maintenant', 'aujourd\'hui', 'actuellement', 'en ce moment'];
  scores.present = presentKeywords.filter((word) => allText.includes(word)).length;

  // Futur
  const futurKeywords = ['demain', 'futur', 'bientôt', 'prochain', 'vais', 'serai'];
  scores.futur = futurKeywords.filter((word) => allText.includes(word)).length;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0] as 'passe' | 'present' | 'futur';
}

// ==========================================
// 7. RAISONNEMENT (Inductif / Déductif / Abductif)
// Station 5
// ==========================================

function analyzeRaisonnement(allAnswers: Record<string, StationAnswers>) {
  if (!allAnswers.station5) return 'deductif';

  const text = Object.values(allAnswers.station5).join(' ').toLowerCase();

  // Inductif : du particulier au général
  if (text.includes('exemple') || text.includes('cas')) return 'inductif';

  // Abductif : intuition, hypothèses
  if (text.includes('intuition') || text.includes('sens')) return 'abductif';

  // Déductif par défaut : logique, principes
  return 'deductif';
}

// ==========================================
// 8. FACTEURS DÉCISION (Options / Procédures)
// Station 8
// ==========================================

function analyzeFacteursDecision(allAnswers: Record<string, StationAnswers>) {
  if (!allAnswers.station8) return 'options';

  const text = Object.values(allAnswers.station8).join(' ').toLowerCase();

  // Procédures : étapes, processus, méthode
  const proceduresKeywords = ['étapes', 'processus', 'méthode', 'suivre', 'plan'];
  const proceduresCount = proceduresKeywords.filter((word) => text.includes(word)).length;

  // Options : possibilités, alternatives, choix
  const optionsKeywords = ['possibilités', 'options', 'alternatives', 'choix', 'pourrait'];
  const optionsCount = optionsKeywords.filter((word) => text.includes(word)).length;

  return optionsCount > proceduresCount ? 'options' : 'procedures';
}

// ==========================================
// 9. MODE RELATION (Concordance / Différence)
// Station 6
// ==========================================

function analyzeModeRelation(allAnswers: Record<string, StationAnswers>) {
  if (!allAnswers.station6) return 'concordance';

  const text = Object.values(allAnswers.station6).join(' ').toLowerCase();

  // Concordance : similitudes, ressemblances
  const concordanceKeywords = ['comme', 'similaire', 'pareil', 'ressemble', 'même'];
  const concordanceCount = concordanceKeywords.filter((word) => text.includes(word)).length;

  // Différence : distinctions, différences
  const differenceKeywords = ['différent', 'unique', 'contrairement', 'mais', 'exception'];
  const differenceCount = differenceKeywords.filter((word) => text.includes(word)).length;

  return concordanceCount > differenceCount ? 'concordance' : 'difference';
}

// ==========================================
// 10-17. Autres méta-programmes (à affiner)
// ==========================================

function analyzeStructureTemps(allAnswers: Record<string, StationAnswers>) {
  return 'automatique'; // Par défaut, à affiner
}

function analyzePositionPerception(allAnswers: Record<string, StationAnswers>) {
  if (!allAnswers.station9) return 'associe';

  const text = Object.values(allAnswers.station9).join(' ').toLowerCase();

  // Dissocié : observe de l'extérieur
  if (text.includes('observe') || text.includes('vois')) return 'dissocie';

  // Associé : immergé dans l'expérience
  return 'associe';
}

function analyzeCanalConviction(allAnswers: Record<string, StationAnswers>) {
  const canaux: Array<'voir' | 'entendre' | 'lire' | 'faire'> = [];

  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  if (allText.includes('voir') || allText.includes('visualiser')) canaux.push('voir');
  if (allText.includes('entendre') || allText.includes('écouter')) canaux.push('entendre');
  if (allText.includes('lire') || allText.includes('document')) canaux.push('lire');
  if (allText.includes('faire') || allText.includes('expérience')) canaux.push('faire');

  return canaux.length > 0 ? canaux : ['lire', 'faire'];
}

function analyzeModeComparaison(allAnswers: Record<string, StationAnswers>) {
  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  // Quantitatif : chiffres, mesures
  const quantitatifKeywords = ['nombre', 'chiffre', 'mesure', 'combien', '%'];
  const quantitatifCount = quantitatifKeywords.filter((word) => allText.includes(word)).length;

  return quantitatifCount > 2 ? 'quantitatif' : 'qualitatif';
}

function analyzeSourceMotivation(allAnswers: Record<string, StationAnswers>) {
  // Utilise la même logique que Reference
  const ref = analyzeReference(allAnswers);
  return ref.interne > ref.externe ? 'interne' : 'externe';
}

function analyzePlacementAttention(allAnswers: Record<string, StationAnswers>) {
  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  const soiKeywords = ['je', 'moi', 'mon', 'ma', 'mes'];
  const autresKeywords = ['tu', 'vous', 'ils', 'elles', 'autres', 'gens'];

  const soiCount = soiKeywords.filter((word) => allText.includes(word)).length;
  const autresCount = autresKeywords.filter((word) => allText.includes(word)).length;

  // Attention : "je" est naturel dans les réponses, donc seuil plus élevé
  return soiCount > autresCount * 3 ? 'soi' : 'autres';
}

function analyzeStyleAction(allAnswers: Record<string, StationAnswers>) {
  const proactivite = analyzeProactivite(allAnswers);

  return proactivite === 'proactif_fort' || proactivite === 'proactif' ? 'action' : 'reflexion';
}

function analyzeCadreTravail(allAnswers: Record<string, StationAnswers>) {
  const allText = Object.values(allAnswers)
    .flatMap((answers) => Object.values(answers))
    .join(' ')
    .toLowerCase();

  const structureKeywords = ['cadre', 'structure', 'règles', 'processus', 'organisation'];
  const flexibiliteKeywords = ['liberté', 'autonomie', 'flexible', 'adapte', 'créatif'];

  const structureCount = structureKeywords.filter((word) => allText.includes(word)).length;
  const flexibiliteCount = flexibiliteKeywords.filter((word) => allText.includes(word)).length;

  return flexibiliteCount > structureCount ? 'flexibilite' : 'structure';
}

/**
 * Obtenir une description textuelle du profil méta-programmes
 */
export function getMetaProgrammesDescription(mp: Partial<MetaProgrammes>): string {
  const descriptions: string[] = [];

  if (mp.orientationMotivation) {
    const { vers, evitement } = mp.orientationMotivation;
    if (vers > 65) {
      descriptions.push(
        '🎯 **VERS** : Tu es motivé par les objectifs et les opportunités à atteindre.'
      );
    } else if (evitement > 65) {
      descriptions.push(
        '🛡️ **ÉVITEMENT** : Tu es motivé par la résolution de problèmes et la protection.'
      );
    }
  }

  if (mp.reference) {
    const { interne, externe } = mp.reference;
    if (interne > 65) {
      descriptions.push('🧭 **INTERNE** : Tu portes ta boussole en toi. Ta validation vient de l\'intérieur.');
    } else if (externe > 65) {
      descriptions.push(
        '👥 **EXTERNE** : Les autres sont ton miroir. Tu apprécies la validation extérieure.'
      );
    }
  }

  if (mp.triPrimaire === 'personnes') {
    descriptions.push('🤝 **PERSONNES** : Les relations humaines sont au cœur de ta motivation.');
  } else if (mp.triPrimaire === 'taches') {
    descriptions.push('✅ **TÂCHES** : Tu es orienté résultats et accomplissements.');
  } else if (mp.triPrimaire === 'informations') {
    descriptions.push('📚 **INFORMATIONS** : L\'apprentissage et la connaissance te passionnent.');
  }

  return descriptions.join('\n\n');
}
