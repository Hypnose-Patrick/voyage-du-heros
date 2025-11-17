/**
 * Station Service - Supabase operations for station_responses table
 * Handles CRUD operations for station responses
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Database } from '../../types/database';
import type { StationAnswers } from '../../types/profile';

type StationResponse = Database['public']['Tables']['station_responses']['Row'];
type StationResponseInsert = Database['public']['Tables']['station_responses']['Insert'];
type StationResponseUpdate = Database['public']['Tables']['station_responses']['Update'];

/**
 * Save or update station responses
 */
export const saveStationResponse = async (
  journeyId: string,
  stationNumber: number,
  responses: StationAnswers,
  timeSpentSeconds?: number
): Promise<StationResponse | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using localStorage fallback');
    return null;
  }

  try {
    // Try to update first (upsert)
    const { data, error } = await supabase
      .from('station_responses')
      .upsert({
        journey_id: journeyId,
        station_number: stationNumber,
        responses: responses as any, // JSONB
        time_spent_seconds: timeSpentSeconds,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'journey_id,station_number',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving station response:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception saving station response:', err);
    return null;
  }
};

/**
 * Get a specific station response
 */
export const getStationResponse = async (
  journeyId: string,
  stationNumber: number
): Promise<StationResponse | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('station_responses')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('station_number', stationNumber)
      .maybeSingle();

    if (error) {
      console.error('Error getting station response:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception getting station response:', err);
    return null;
  }
};

/**
 * Get all station responses for a journey
 */
export const getAllStationResponses = async (
  journeyId: string
): Promise<StationResponse[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('station_responses')
      .select('*')
      .eq('journey_id', journeyId)
      .order('station_number', { ascending: true });

    if (error) {
      console.error('Error getting all station responses:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception getting all station responses:', err);
    return [];
  }
};

/**
 * Delete a station response
 */
export const deleteStationResponse = async (
  journeyId: string,
  stationNumber: number
): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('station_responses')
      .delete()
      .eq('journey_id', journeyId)
      .eq('station_number', stationNumber);

    if (error) {
      console.error('Error deleting station response:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting station response:', err);
    return false;
  }
};

/**
 * Get the number of completed stations for a journey
 */
export const getCompletedStationsCount = async (
  journeyId: string
): Promise<number> => {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    const { data, error, count } = await supabase
      .from('station_responses')
      .select('*', { count: 'exact', head: true })
      .eq('journey_id', journeyId);

    if (error) {
      console.error('Error getting completed stations count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Exception getting completed stations count:', err);
    return 0;
  }
};

/**
 * Check if a station is completed
 */
export const isStationCompleted = async (
  journeyId: string,
  stationNumber: number
): Promise<boolean> => {
  const response = await getStationResponse(journeyId, stationNumber);
  return response !== null;
};

/**
 * Get journey progress
 */
export const getJourneyProgress = async (
  journeyId: string
): Promise<{
  completed_stations: number;
  total_stations: number;
  progress_percentage: number;
}> => {
  const completedCount = await getCompletedStationsCount(journeyId);
  const totalStations = 12;
  const progressPercentage = (completedCount / totalStations) * 100;

  return {
    completed_stations: completedCount,
    total_stations: totalStations,
    progress_percentage: Math.round(progressPercentage * 100) / 100,
  };
};
