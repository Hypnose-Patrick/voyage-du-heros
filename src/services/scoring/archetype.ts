/**
 * Système de calcul d'Archétype, Animal Totem et Élément
 * Basé sur les méta-programmes et le profil I.C.A.R.E.
 */

import type {
  MetaProgrammes,
  ICAREScores,
  Archetype,
  ArchetypeProfile,
  AnimalTotem,
  TotemProfile,
  Element,
  ElementProfile,
} from '../../types/profile';

// ==========================================
// ARCHÉTYPE
// ==========================================

/**
 * Calcule l'archétype dominant basé sur les méta-programmes
 */
export function calculateArchetype(mp: Partial<MetaProgrammes>): ArchetypeProfile {
  const scores: Record<Archetype, number> = {
    Explorateur: 0,
    Guerrier: 0,
    Sage: 0,
    Créateur: 0,
    Souverain: 0,
    Magicien: 0,
  };

  // EXPLORATEUR : Vers + Options + Futur + Externe
  if (mp.orientationMotivation && mp.orientationMotivation.vers > 60) {
    scores.Explorateur += 25;
  }
  if (mp.facteursDecision === 'options') {
    scores.Explorateur += 20;
  }
  if (mp.orientationTemps === 'futur') {
    scores.Explorateur += 20;
  }
  if (mp.reference && mp.reference.externe > 50) {
    scores.Explorateur += 15;
  }

  // GUERRIER : Vers + Interne + Proactif + Tâches
  if (mp.orientationMotivation && mp.orientationMotivation.vers > 60) {
    scores.Guerrier += 20;
  }
  if (mp.reference && mp.reference.interne > 60) {
    scores.Guerrier += 30;
  }
  if (mp.proactivite === 'proactif_fort' || mp.proactivite === 'proactif') {
    scores.Guerrier += 25;
  }
  if (mp.triPrimaire === 'taches') {
    scores.Guerrier += 15;
  }

  // SAGE : Informations + Spécifique + Réflexion + Passé
  if (mp.triPrimaire === 'informations') {
    scores.Sage += 30;
  }
  if (mp.tailleDecoupage === 'specifique') {
    scores.Sage += 20;
  }
  if (mp.styleAction === 'reflexion') {
    scores.Sage += 25;
  }
  if (mp.orientationTemps === 'passe') {
    scores.Sage += 15;
  }

  // CRÉATEUR : Options + Global + Abductif + Flexibilité
  if (mp.facteursDecision === 'options') {
    scores.Créateur += 25;
  }
  if (mp.tailleDecoupage === 'global') {
    scores.Créateur += 20;
  }
  if (mp.raisonnement === 'abductif') {
    scores.Créateur += 30;
  }
  if (mp.cadreTravail === 'flexibilite') {
    scores.Créateur += 15;
  }

  // SOUVERAIN : Tâches + Procédures + Structure + Externe
  if (mp.triPrimaire === 'taches') {
    scores.Souverain += 25;
  }
  if (mp.facteursDecision === 'procedures') {
    scores.Souverain += 30;
  }
  if (mp.cadreTravail === 'structure') {
    scores.Souverain += 25;
  }
  if (mp.reference && mp.reference.externe > 50) {
    scores.Souverain += 10;
  }

  // MAGICIEN : Interne + Futur + Abductif + Global
  if (mp.reference && mp.reference.interne > 70) {
    scores.Magicien += 30;
  }
  if (mp.orientationTemps === 'futur') {
    scores.Magicien += 20;
  }
  if (mp.raisonnement === 'abductif') {
    scores.Magicien += 25;
  }
  if (mp.tailleDecoupage === 'global') {
    scores.Magicien += 15;
  }

  // Déterminer le dominant
  const sorted = (Object.entries(scores) as [Archetype, number][]).sort((a, b) => b[1] - a[1]);
  const [dominant, score] = sorted[0];

  return {
    dominant,
    scores,
    traits: getArchetypeTraits(dominant),
    message: getArchetypeMessage(dominant),
  };
}

function getArchetypeTraits(archetype: Archetype): string[] {
  const traits: Record<Archetype, string[]> = {
    Explorateur: ['Curiosité insatiable', 'Amour de la découverte', 'Soif de nouveauté'],
    Guerrier: ['Détermination', 'Courage', 'Orientation résultats'],
    Sage: ['Sagesse', 'Réflexion profonde', 'Quête de connaissance'],
    Créateur: ['Imagination', 'Innovation', 'Expression unique'],
    Souverain: ['Leadership naturel', 'Sens des responsabilités', 'Organisation'],
    Magicien: ['Transformation', 'Vision', 'Intuition puissante'],
  };

  return traits[archetype];
}

function getArchetypeMessage(archetype: Archetype): string {
  const messages: Record<Archetype, string> = {
    Explorateur:
      "Tu es né(e) pour découvrir de nouveaux territoires. L'inconnu ne te fait pas peur, il t'excite.",
    Guerrier:
      "Tu es un(e) combattant(e) stratégique. Les obstacles ne t'arrêtent pas, ils te galvanisent.",
    Sage: "Tu cherches la compréhension profonde. Ta sagesse est ton plus grand trésor.",
    Créateur:
      "Tu vois le monde comme une toile vierge. Ta créativité transforme le banal en extraordinaire.",
    Souverain:
      "Tu es né(e) pour diriger avec noblesse. L'ordre et la responsabilité sont tes forces.",
    Magicien:
      "Tu maîtrises l'art de la transformation. Tu vois les possibles que les autres ne voient pas.",
  };

  return messages[archetype];
}

// ==========================================
// ANIMAL TOTEM
// ==========================================

/**
 * Détermine l'animal totem basé sur l'archétype
 */
export function calculateTotem(archetype: Archetype): TotemProfile {
  const totems: Record<Archetype, { totem: AnimalTotem; traits: string[]; message: string }> = {
    Explorateur: {
      totem: '🦅 Aigle',
      traits: ['Vision panoramique', 'Liberté absolue', 'Hauteur de vue'],
      message:
        "L'Aigle voit loin et plane au-dessus des obstacles. Tu as cette capacité à prendre de la hauteur.",
    },
    Guerrier: {
      totem: '🐺 Loup',
      traits: ['Stratégie de meute', 'Ténacité', 'Intelligence collective'],
      message:
        'Le Loup est un stratège tenace qui ne lâche jamais sa proie. Tu combines force et intelligence.',
    },
    Sage: {
      totem: '🦉 Chouette',
      traits: ['Sagesse nocturne', 'Vision dans l\'obscurité', 'Patience'],
      message: 'La Chouette voit ce que les autres ne voient pas. Ta sagesse illumine les zones d\'ombre.',
    },
    Créateur: {
      totem: '🦋 Papillon',
      traits: ['Métamorphose complète', 'Beauté émergente', 'Légèreté créative'],
      message:
        'Le Papillon incarne la transformation totale. Tu sais créer la beauté à partir du chaos.',
    },
    Souverain: {
      totem: '🦁 Lion',
      traits: ['Leadership naturel', 'Protection du groupe', 'Autorité respectée'],
      message: 'Le Lion règne avec noblesse et protège sa tribu. Tu as cette autorité naturelle.',
    },
    Magicien: {
      totem: '🐉 Dragon',
      traits: ['Puissance transformatrice', 'Gardien de trésor', 'Mystère ancien'],
      message:
        'Le Dragon maîtrise le feu de la transformation. Tu possèdes une puissance intérieure rare.',
    },
  };

  return totems[archetype];
}

// ==========================================
// ÉLÉMENT DOMINANT
// ==========================================

/**
 * Calcule l'élément dominant basé sur les méta-programmes
 */
export function calculateElement(mp: Partial<MetaProgrammes>): ElementProfile {
  const scores: Record<Element, number> = {
    Feu: 0,
    Eau: 0,
    Air: 0,
    Terre: 0,
  };

  // FEU : Action, passion, transformation rapide
  // Vers + Proactif + Action
  if (mp.orientationMotivation && mp.orientationMotivation.vers > 70) {
    scores.Feu += 25;
  }
  if (mp.proactivite === 'proactif_fort') {
    scores.Feu += 30;
  }
  if (mp.styleAction === 'action') {
    scores.Feu += 20;
  }
  if (mp.facteursDecision === 'options') {
    scores.Feu += 15;
  }

  // EAU : Adaptation, émotion, flux relationnel
  // Personnes + Externe + Concordance
  if (mp.triPrimaire === 'personnes') {
    scores.Eau += 30;
  }
  if (mp.reference && mp.reference.externe > 60) {
    scores.Eau += 25;
  }
  if (mp.modeRelation === 'concordance') {
    scores.Eau += 20;
  }
  if (mp.cadreTravail === 'flexibilite') {
    scores.Eau += 15;
  }

  // AIR : Réflexion, communication, liberté intellectuelle
  // Informations + Options + Global
  if (mp.triPrimaire === 'informations') {
    scores.Air += 30;
  }
  if (mp.facteursDecision === 'options') {
    scores.Air += 25;
  }
  if (mp.tailleDecoupage === 'global') {
    scores.Air += 20;
  }
  if (mp.raisonnement === 'abductif') {
    scores.Air += 15;
  }

  // TERRE : Stabilité, concret, construction méthodique
  // Tâches + Procédures + Spécifique + Structure
  if (mp.triPrimaire === 'taches') {
    scores.Terre += 30;
  }
  if (mp.facteursDecision === 'procedures') {
    scores.Terre += 25;
  }
  if (mp.tailleDecoupage === 'specifique') {
    scores.Terre += 20;
  }
  if (mp.cadreTravail === 'structure') {
    scores.Terre += 15;
  }

  // Déterminer le dominant
  const sorted = (Object.entries(scores) as [Element, number][]).sort((a, b) => b[1] - a[1]);
  const [dominant] = sorted[0];

  return {
    dominant,
    scores,
    description: getElementDescription(dominant),
  };
}

function getElementDescription(element: Element): string {
  const descriptions: Record<Element, string> = {
    Feu: `**FEU 🔥** : Tu es l'énergie de la transformation rapide.
      Passionné, dynamique, tu allumes les étincelles du changement.
      Ta force : la capacité à passer à l'action rapidement.
      Attention : ne te consume pas dans ta propre flamme.`,

    Eau: `**EAU 🌊** : Tu es l'adaptation fluide et l'intelligence émotionnelle.
      Tu t'adaptes, tu circules, tu nourris les relations.
      Ta force : la capacité à épouser toutes les formes.
      Attention : ne te perds pas dans le courant des autres.`,

    Air: `**AIR 💨** : Tu es la légèreté intellectuelle et la liberté de pensée.
      Tu vois les connexions invisibles, tu explores les idées.
      Ta force : la capacité à prendre de la hauteur.
      Attention : ne te perds pas dans les nuages.`,

    Terre: `**TERRE 🌍** : Tu es la stabilité constructrice et le concret durable.
      Tu bâtis, tu structures, tu ancres les projets dans la réalité.
      Ta force : la capacité à concrétiser et persévérer.
      Attention : ne deviens pas rigide dans tes certitudes.`,
  };

  return descriptions[element];
}

// ==========================================
// FONCTION D'ORCHESTRATION
// ==========================================

/**
 * Calcule tous les profils symboliques en une fois
 */
export function calculateSymbolicProfiles(mp: Partial<MetaProgrammes>, icare: ICAREScores) {
  const archetypeProfile = calculateArchetype(mp);
  const totemProfile = calculateTotem(archetypeProfile.dominant);
  const elementProfile = calculateElement(mp);

  return {
    archetype: archetypeProfile,
    totem: totemProfile,
    element: elementProfile,
  };
}
