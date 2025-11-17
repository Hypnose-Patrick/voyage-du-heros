/**
 * Journey Service - Supabase operations for hero_journeys table
 * Handles CRUD operations for user journeys
 */

import { supabase, isSupabaseConfigured, getCurrentUser } from '../../lib/supabase';
import type { Database } from '../../types/database';

type HeroJourney = Database['public']['Tables']['hero_journeys']['Row'];
type HeroJourneyInsert = Database['public']['Tables']['hero_journeys']['Insert'];
type HeroJourneyUpdate = Database['public']['Tables']['hero_journeys']['Update'];

/**
 * Create a new hero journey
 */
export const createJourney = async (
  tier: 'STANDARD' | 'PREMIUM' | 'ELITE' = 'STANDARD'
): Promise<HeroJourney | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using localStorage fallback');
    return null;
  }

  try {
    const user = await getCurrentUser();

    const newJourney: HeroJourneyInsert = {
      user_id: user?.id || null,
      tier,
      current_station: 1,
      credits_deducted: 0,
    };

    const { data, error } = await supabase
      .from('hero_journeys')
      .insert(newJourney)
      .select()
      .single();

    if (error) {
      console.error('Error creating journey:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception creating journey:', err);
    return null;
  }
};

/**
 * Get the current user's active journey
 */
export const getCurrentJourney = async (): Promise<HeroJourney | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('hero_journeys')
      .select('*')
      .eq('user_id', user?.id || null)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error getting current journey:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception getting current journey:', err);
    return null;
  }
};

/**
 * Get or create a journey for the current user
 */
export const getOrCreateJourney = async (
  tier: 'STANDARD' | 'PREMIUM' | 'ELITE' = 'STANDARD'
): Promise<HeroJourney | null> => {
  const existing = await getCurrentJourney();
  if (existing) {
    return existing;
  }

  return await createJourney(tier);
};

/**
 * Update journey progress
 */
export const updateJourneyProgress = async (
  journeyId: string,
  currentStation: number
): Promise<HeroJourney | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const update: HeroJourneyUpdate = {
      current_station: currentStation,
    };

    // If completing the last station, mark as completed
    if (currentStation > 12) {
      update.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('hero_journeys')
      .update(update)
      .eq('id', journeyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating journey progress:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception updating journey progress:', err);
    return null;
  }
};

/**
 * Complete a journey
 */
export const completeJourney = async (journeyId: string): Promise<HeroJourney | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('hero_journeys')
      .update({
        completed_at: new Date().toISOString(),
        current_station: 12,
      })
      .eq('id', journeyId)
      .select()
      .single();

    if (error) {
      console.error('Error completing journey:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception completing journey:', err);
    return null;
  }
};

/**
 * Get all journeys for the current user
 */
export const getAllJourneys = async (): Promise<HeroJourney[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('hero_journeys')
      .select('*')
      .eq('user_id', user?.id || null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all journeys:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception getting all journeys:', err);
    return [];
  }
};

/**
 * Delete a journey and all its responses
 */
export const deleteJourney = async (journeyId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('hero_journeys')
      .delete()
      .eq('id', journeyId);

    if (error) {
      console.error('Error deleting journey:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting journey:', err);
    return false;
  }
};
