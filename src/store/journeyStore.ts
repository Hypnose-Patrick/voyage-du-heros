/**
 * Journey Store - Enhanced Zustand store with Supabase integration
 * Manages journey state with automatic sync to Supabase
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  getOrCreateJourney,
  updateJourneyProgress,
  getAllJourneys,
} from '../services/supabase/journeyService';
import {
  saveStationResponse,
  getAllStationResponses,
  getJourneyProgress,
} from '../services/supabase/stationService';
import type { StationAnswers } from '../types/profile';

interface JourneyState {
  // Journey metadata
  journeyId: string | null;
  currentStation: number;
  completedStations: number[];
  tier: 'STANDARD' | 'PREMIUM' | 'ELITE';
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;

  // Station responses
  stationResponses: Record<string, StationAnswers>;

  // Actions
  initializeJourney: (tier?: 'STANDARD' | 'PREMIUM' | 'ELITE') => Promise<void>;
  saveStationAnswers: (stationNumber: number, answers: StationAnswers, timeSpent?: number) => Promise<void>;
  completeStation: (stationNumber: number) => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  resetJourney: () => void;

  // Getters
  getProgress: () => { completed: number; total: number; percentage: number };
  isStationCompleted: (stationNumber: number) => boolean;
  getStationAnswers: (stationNumber: number) => StationAnswers | null;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      // Initial state
      journeyId: null,
      currentStation: 1,
      completedStations: [],
      tier: 'STANDARD',
      isLoading: false,
      isSyncing: false,
      lastSyncAt: null,
      stationResponses: {},

      /**
       * Initialize or resume a journey
       */
      initializeJourney: async (tier = 'STANDARD') => {
        set({ isLoading: true });

        try {
          if (!isSupabaseConfigured()) {
            // Fallback to localStorage only
            console.log('Using localStorage fallback (Supabase not configured)');
            set({ isLoading: false, tier });
            return;
          }

          // Get or create journey in Supabase
          const journey = await getOrCreateJourney(tier);

          if (journey) {
            // Load all station responses
            const responses = await getAllStationResponses(journey.id);

            // Convert to our format
            const stationResponses: Record<string, StationAnswers> = {};
            const completedStations: number[] = [];

            responses.forEach((response) => {
              const key = `station${response.station_number}`;
              stationResponses[key] = response.responses as StationAnswers;
              completedStations.push(response.station_number);
            });

            set({
              journeyId: journey.id,
              currentStation: journey.current_station,
              completedStations,
              tier: journey.tier,
              stationResponses,
              lastSyncAt: new Date().toISOString(),
              isLoading: false,
            });
          } else {
            set({ isLoading: false, tier });
          }
        } catch (error) {
          console.error('Error initializing journey:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Save station answers (with Supabase sync)
       */
      saveStationAnswers: async (stationNumber, answers, timeSpent) => {
        const { journeyId, stationResponses } = get();

        // Save to local state immediately
        const key = `station${stationNumber}`;
        set({
          stationResponses: {
            ...stationResponses,
            [key]: answers,
          },
        });

        // Sync to Supabase if configured
        if (isSupabaseConfigured() && journeyId) {
          set({ isSyncing: true });
          try {
            await saveStationResponse(journeyId, stationNumber, answers, timeSpent);
            set({
              isSyncing: false,
              lastSyncAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Error syncing station answers:', error);
            set({ isSyncing: false });
          }
        }
      },

      /**
       * Mark a station as completed
       */
      completeStation: async (stationNumber) => {
        const { journeyId, completedStations, currentStation } = get();

        // Update local state
        const newCompletedStations = completedStations.includes(stationNumber)
          ? completedStations
          : [...completedStations, stationNumber].sort((a, b) => a - b);

        const nextStation = Math.min(currentStation + 1, 12);

        set({
          completedStations: newCompletedStations,
          currentStation: nextStation,
        });

        // Sync to Supabase
        if (isSupabaseConfigured() && journeyId) {
          try {
            await updateJourneyProgress(journeyId, nextStation);
          } catch (error) {
            console.error('Error updating journey progress:', error);
          }
        }
      },

      /**
       * Manually sync with Supabase
       */
      syncWithSupabase: async () => {
        const { journeyId, stationResponses } = get();

        if (!isSupabaseConfigured() || !journeyId) {
          console.warn('Cannot sync - Supabase not configured or no journey ID');
          return;
        }

        set({ isSyncing: true });

        try {
          // Sync all station responses
          const syncPromises = Object.entries(stationResponses).map(([key, answers]) => {
            const stationNumber = parseInt(key.replace('station', ''), 10);
            return saveStationResponse(journeyId, stationNumber, answers);
          });

          await Promise.all(syncPromises);

          set({
            isSyncing: false,
            lastSyncAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error syncing with Supabase:', error);
          set({ isSyncing: false });
        }
      },

      /**
       * Load journey data from Supabase
       */
      loadFromSupabase: async () => {
        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured');
          return;
        }

        set({ isLoading: true });

        try {
          await get().initializeJourney();
        } catch (error) {
          console.error('Error loading from Supabase:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Reset journey (clear all data)
       */
      resetJourney: () => {
        set({
          journeyId: null,
          currentStation: 1,
          completedStations: [],
          stationResponses: {},
          lastSyncAt: null,
        });
      },

      /**
       * Get progress statistics
       */
      getProgress: () => {
        const { completedStations } = get();
        const total = 12;
        const completed = completedStations.length;
        const percentage = Math.round((completed / total) * 100);

        return { completed, total, percentage };
      },

      /**
       * Check if a station is completed
       */
      isStationCompleted: (stationNumber) => {
        const { completedStations } = get();
        return completedStations.includes(stationNumber);
      },

      /**
       * Get answers for a specific station
       */
      getStationAnswers: (stationNumber) => {
        const { stationResponses } = get();
        const key = `station${stationNumber}`;
        return stationResponses[key] || null;
      },
    }),
    {
      name: 'voyage-du-heros-journey', // localStorage key
      partialize: (state) => ({
        journeyId: state.journeyId,
        currentStation: state.currentStation,
        completedStations: state.completedStations,
        tier: state.tier,
        stationResponses: state.stationResponses,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);

/**
 * Convenience hooks
 */

export const useCurrentStation = () => useJourneyStore((state) => state.currentStation);
export const useCompletedStations = () => useJourneyStore((state) => state.completedStations);
export const useJourneyProgress = () => useJourneyStore((state) => state.getProgress());
export const useIsSyncing = () => useJourneyStore((state) => state.isSyncing);
export const useIsLoading = () => useJourneyStore((state) => state.isLoading);
