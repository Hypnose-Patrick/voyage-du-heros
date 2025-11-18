/**
 * Système d'Achievements / Badges
 * Gère le déblocage et le suivi des accomplissements
 */

import type { Achievement } from '../components/shared/AchievementBadge';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    emoji: '👣',
    title: 'Premiers Pas',
    description: 'Commence ton voyage héroïque',
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'explorer',
    emoji: '🗺️',
    title: 'Explorateur',
    description: 'Complete 3 stations',
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'adventurer',
    emoji: '⚔️',
    title: 'Aventurier',
    description: 'Complete 6 stations',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'hero',
    emoji: '🦸',
    title: 'Héros',
    description: 'Complete 9 stations',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'legend',
    emoji: '👑',
    title: 'Légende',
    description: 'Complete les 12 stations',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'departure-master',
    emoji: '🚀',
    title: 'Maître du Départ',
    description: 'Complete toute la Phase 1 (Départ)',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'initiation-master',
    emoji: '🔥',
    title: 'Maître de l\'Initiation',
    description: 'Complete toute la Phase 2 (Initiation)',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'return-master',
    emoji: '🌟',
    title: 'Maître du Retour',
    description: 'Complete toute la Phase 3 (Retour)',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'perfectionist',
    emoji: '💯',
    title: 'Perfectionniste',
    description: 'Refais une station pour améliorer tes réponses',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'deep-diver',
    emoji: '🌊',
    title: 'Plongeur Profond',
    description: 'Complete le parcours en mode Plongeur',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'self-aware',
    emoji: '🧠',
    title: 'Conscience de Soi',
    description: 'Consulte ton profil complet',
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'dragon-slayer',
    emoji: '🐉',
    title: 'Tueur de Dragons',
    description: 'Complète la Station 8 (Épreuve Suprême)',
    unlocked: false,
    rarity: 'epic',
  },
];

/**
 * Vérifie quels achievements doivent être débloqués
 */
export function checkAchievements(
  completedStations: number[],
  selectedLevel: string,
  hasViewedProfile: boolean,
  previousAnswers: Record<string, any>
): Achievement[] {
  const unlockedAchievements: Achievement[] = [];
  const totalCompleted = completedStations.length;

  // Achievement: Premiers Pas
  if (totalCompleted >= 1) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'first-steps');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Explorateur (3 stations)
  if (totalCompleted >= 3) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'explorer');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Aventurier (6 stations)
  if (totalCompleted >= 6) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'adventurer');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Héros (9 stations)
  if (totalCompleted >= 9) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'hero');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Légende (12 stations)
  if (totalCompleted >= 12) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'legend');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Maître du Départ (Stations 1-4)
  const departureStations = [1, 2, 3, 4];
  if (departureStations.every((s) => completedStations.includes(s))) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'departure-master');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Maître de l'Initiation (Stations 5-8)
  const initiationStations = [5, 6, 7, 8];
  if (initiationStations.every((s) => completedStations.includes(s))) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'initiation-master');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Maître du Retour (Stations 9-12)
  const returnStations = [9, 10, 11, 12];
  if (returnStations.every((s) => completedStations.includes(s))) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'return-master');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Dragon Slayer (Station 8)
  if (completedStations.includes(8)) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'dragon-slayer');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Plongeur Profond
  if (selectedLevel === 'plongeur' && totalCompleted >= 12) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'deep-diver');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Conscience de Soi
  if (hasViewedProfile) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'self-aware');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  // Achievement: Perfectionniste (refaire une station)
  const stationKeys = Object.keys(previousAnswers).filter((k) => k.startsWith('station'));
  const duplicateKeys = stationKeys.filter(
    (key, index, self) => self.indexOf(key) !== self.lastIndexOf(key)
  );
  if (duplicateKeys.length > 0) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'perfectionist');
    if (achievement && !achievement.unlocked) {
      unlockedAchievements.push({ ...achievement, unlocked: true });
    }
  }

  return unlockedAchievements;
}

/**
 * Obtient tous les achievements avec leur statut
 */
export function getAchievementsStatus(
  completedStations: number[],
  selectedLevel: string,
  hasViewedProfile: boolean,
  previousAnswers: Record<string, any>,
  unlockedIds: string[] = []
): Achievement[] {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));
}

/**
 * Messages motivationnels basés sur la progression
 */
export const MOTIVATIONAL_MESSAGES = [
  'Continue, tu progresses admirablement ! 🌟',
  'Chaque pas compte sur ce voyage ! 👣',
  'Ta transformation est en marche ! 🦋',
  'Tu es plus fort(e) que tu ne le penses ! 💪',
  'L\'aventure ne fait que commencer ! 🗺️',
  'Ton courage inspire ! ⚔️',
  'Tu découvres ta vraie nature ! 🌱',
  'Chaque station révèle une nouvelle facette de toi ! 💎',
  'Le héros en toi s\'éveille ! 🦸',
  'Tu traces ton propre chemin ! 🛤️',
];

export function getMotivationalMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
