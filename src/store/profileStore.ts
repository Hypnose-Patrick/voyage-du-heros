/**
 * Store Zustand pour la gestion du profil utilisateur
 * Orchestre tous les systèmes de scoring
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, StationAnswers } from '../types/profile';
import { calculateICARE, getICAREProfile, getICARERecommendations } from '../services/scoring/icare';
import { analyzeMetaProgrammes, getMetaProgrammesDescription } from '../services/scoring/metaProgrammes';
import { calculateSymbolicProfiles } from '../services/scoring/archetype';

interface ProfileState {
  // État du profil
  profile: UserProfile;

  // Réponses aux stations
  allAnswers: Record<string, StationAnswers>;

  // Actions
  updateStationAnswers: (stationId: number, answers: StationAnswers) => void;
  completeStation: (stationId: number) => void;
  recalculateProfile: () => void;
  resetProfile: () => void;

  // Getters
  getProfileSummary: () => string;
  getRecommendations: () => string[];
}

const initialProfile: UserProfile = {
  currentStation: 1,
  completedStations: [],
  metaProgrammes: {},
  icare: {
    Identité: 0,
    Capacités: 0,
    Appartenance: 0,
    Risque: 0,
    Estime: 0,
  },
  totalXP: 0,
  level: 1,
  completion: 0,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      allAnswers: {},

      /**
       * Met à jour les réponses d'une station et recalcule le profil
       */
      updateStationAnswers: (stationId: number, answers: StationAnswers) => {
        set((state) => ({
          allAnswers: {
            ...state.allAnswers,
            [`station${stationId}`]: answers,
          },
        }));

        // Recalculer automatiquement le profil
        get().recalculateProfile();
      },

      /**
       * Marque une station comme complétée
       */
      completeStation: (stationId: number) => {
        set((state) => {
          const completedStations = state.profile.completedStations.includes(stationId)
            ? state.profile.completedStations
            : [...state.profile.completedStations, stationId];

          const completion = (completedStations.length / 12) * 100;
          const xpGained = 100; // 100 XP par station
          const totalXP = state.profile.totalXP + xpGained;
          const level = Math.floor(totalXP / 150) + 1; // Nouveau niveau tous les 150 XP

          return {
            profile: {
              ...state.profile,
              completedStations,
              completion,
              totalXP,
              level,
              currentStation: Math.min(stationId + 1, 12),
            },
          };
        });
      },

      /**
       * Recalcule tout le profil basé sur les réponses actuelles
       */
      recalculateProfile: () => {
        const { allAnswers } = get();

        // 1. Calculer I.C.A.R.E.
        const icareScores = calculateICARE(allAnswers);
        const icareProfile = getICAREProfile(icareScores);

        // 2. Analyser les méta-programmes
        const metaProgrammes = analyzeMetaProgrammes(allAnswers);

        // 3. Calculer les profils symboliques (archétype, totem, élément)
        const { archetype, totem, element } = calculateSymbolicProfiles(metaProgrammes, icareScores);

        // 4. Mettre à jour le profil
        set((state) => ({
          profile: {
            ...state.profile,
            icare: icareScores,
            icareProfile,
            metaProgrammes,
            archetype,
            totem,
            element,
          },
        }));
      },

      /**
       * Reset complet du profil
       */
      resetProfile: () => {
        set({
          profile: initialProfile,
          allAnswers: {},
        });
      },

      /**
       * Obtenir un résumé textuel du profil
       */
      getProfileSummary: () => {
        const { profile } = get();

        if (!profile.archetype || !profile.totem || !profile.element) {
          return 'Profil en cours de construction... Complète plus de stations pour révéler ton identité.';
        }

        const summary = `
## 🎭 Ton Profil Héroïque

**Archétype** : ${profile.archetype.dominant}
${profile.archetype.message}

**Animal Totem** : ${profile.totem.totem}
${profile.totem.message}

**Élément Dominant** : ${profile.element.dominant}
${profile.element.description}

---

## 📊 Profil I.C.A.R.E.

${profile.icareProfile?.description || ''}

**Scores détaillés :**
- Identité : ${profile.icare.Identité}/100
- Capacités : ${profile.icare.Capacités}/100
- Appartenance : ${profile.icare.Appartenance}/100
- Risque : ${profile.icare.Risque}/100
- Estime : ${profile.icare.Estime}/100

---

## 🧠 Tes Méta-Programmes Dominants

${getMetaProgrammesDescription(profile.metaProgrammes)}

---

## 🎯 Niveau Héroïque

**Niveau** : ${profile.level}
**XP** : ${profile.totalXP}
**Progression** : ${Math.round(profile.completion)}% du parcours
        `.trim();

        return summary;
      },

      /**
       * Obtenir les recommandations basées sur le profil
       */
      getRecommendations: () => {
        const { profile } = get();

        if (!profile.icareProfile) {
          return ['Complète plus de stations pour recevoir des recommandations personnalisées.'];
        }

        return getICARERecommendations(profile.icareProfile);
      },
    }),
    {
      name: 'voyage-du-heros-profile', // Clé localStorage
      partialize: (state) => ({
        profile: state.profile,
        allAnswers: state.allAnswers,
      }), // Ne persister que ce qui est nécessaire
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating profile store:', error);
            // En cas d'erreur, effacer le localStorage corrompu
            try {
              localStorage.removeItem('voyage-du-heros-profile');
            } catch (e) {
              console.error('Failed to clear corrupted localStorage:', e);
            }
          }
        };
      },
    }
  )
);

/**
 * Hook pour obtenir uniquement le profil (sans les actions)
 */
export const useProfile = () => useProfileStore((state) => state.profile);

/**
 * Hook pour obtenir les méta-programmes
 */
export const useMetaProgrammes = () => useProfileStore((state) => state.profile.metaProgrammes);

/**
 * Hook pour obtenir le profil I.C.A.R.E.
 */
export const useICARE = () => useProfileStore((state) => ({
  scores: state.profile.icare,
  profile: state.profile.icareProfile,
}));

/**
 * Hook pour obtenir les profils symboliques
 */
export const useSymbolicProfiles = () => useProfileStore((state) => ({
  archetype: state.profile.archetype,
  totem: state.profile.totem,
  element: state.profile.element,
}));

/**
 * Hook pour obtenir la progression
 */
export const useProgression = () => useProfileStore((state) => ({
  currentStation: state.profile.currentStation,
  completedStations: state.profile.completedStations,
  completion: state.profile.completion,
  level: state.profile.level,
  totalXP: state.profile.totalXP,
}));
