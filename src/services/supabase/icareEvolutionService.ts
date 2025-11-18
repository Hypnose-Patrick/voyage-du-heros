/**
 * I.C.A.R.E. Evolution Service - Supabase operations for icare_evolution table
 * Handles CRUD operations for I.C.A.R.E. transformation tracking
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { ICAREDimension } from '../../types/profile';

export interface ICAREEvolution {
  id: string;
  journey_id: string;
  dimension: ICAREDimension;
  score_before: number;
  score_after: number;
  phrase_before: string;
  phrase_after: string;
  insights?: any[];
  created_at: string;
  updated_at: string;
}

export interface ICAREEvolutionInsert {
  journey_id: string;
  dimension: ICAREDimension;
  score_before: number;
  score_after: number;
  phrase_before: string;
  phrase_after: string;
  insights?: any[];
}

export interface ICAREEvolutionUpdate {
  score_before?: number;
  score_after?: number;
  phrase_before?: string;
  phrase_after?: string;
  insights?: any[];
}

/**
 * Create or update an I.C.A.R.E. evolution entry
 */
export const upsertICAREEvolution = async (
  data: ICAREEvolutionInsert
): Promise<ICAREEvolution | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using localStorage fallback');
    return null;
  }

  try {
    const { data: result, error } = await supabase
      .from('icare_evolution')
      .upsert(
        {
          journey_id: data.journey_id,
          dimension: data.dimension,
          score_before: data.score_before,
          score_after: data.score_after,
          phrase_before: data.phrase_before,
          phrase_after: data.phrase_after,
          insights: data.insights || [],
        },
        {
          onConflict: 'journey_id,dimension',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting I.C.A.R.E. evolution:', error);
      return null;
    }

    return result;
  } catch (err) {
    console.error('Exception upserting I.C.A.R.E. evolution:', err);
    return null;
  }
};

/**
 * Get all I.C.A.R.E. evolutions for a journey
 */
export const getICAREEvolutions = async (
  journeyId: string
): Promise<ICAREEvolution[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('icare_evolution')
      .select('*')
      .eq('journey_id', journeyId)
      .order('dimension', { ascending: true });

    if (error) {
      console.error('Error getting I.C.A.R.E. evolutions:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception getting I.C.A.R.E. evolutions:', err);
    return [];
  }
};

/**
 * Get a specific I.C.A.R.E. evolution by dimension
 */
export const getICAREEvolution = async (
  journeyId: string,
  dimension: ICAREDimension
): Promise<ICAREEvolution | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('icare_evolution')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('dimension', dimension)
      .maybeSingle();

    if (error) {
      console.error('Error getting I.C.A.R.E. evolution:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception getting I.C.A.R.E. evolution:', err);
    return null;
  }
};

/**
 * Update an I.C.A.R.E. evolution
 */
export const updateICAREEvolution = async (
  id: string,
  updates: ICAREEvolutionUpdate
): Promise<ICAREEvolution | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('icare_evolution')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating I.C.A.R.E. evolution:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception updating I.C.A.R.E. evolution:', err);
    return null;
  }
};

/**
 * Delete an I.C.A.R.E. evolution
 */
export const deleteICAREEvolution = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase.from('icare_evolution').delete().eq('id', id);

    if (error) {
      console.error('Error deleting I.C.A.R.E. evolution:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting I.C.A.R.E. evolution:', err);
    return false;
  }
};

/**
 * Initialize I.C.A.R.E. evolution for all dimensions with default values
 */
export const initializeAllDimensions = async (
  journeyId: string,
  initialScore: number = 40
): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const dimensions: ICAREDimension[] = [
    'Identité',
    'Capacités',
    'Appartenance',
    'Risque',
    'Estime',
  ];

  try {
    const promises = dimensions.map((dimension) =>
      supabase.rpc('initialize_icare_evolution', {
        journey_uuid: journeyId,
        dimension_name: dimension,
        initial_score: initialScore,
      })
    );

    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error('Exception initializing I.C.A.R.E. dimensions:', err);
    return false;
  }
};

/**
 * Get complete I.C.A.R.E. evolution summary using stored function
 */
export const getICAREEvolutionSummary = async (journeyId: string): Promise<any> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase.rpc('get_icare_evolution', {
      journey_uuid: journeyId,
    });

    if (error) {
      console.error('Error getting I.C.A.R.E. evolution summary:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception getting I.C.A.R.E. evolution summary:', err);
    return null;
  }
};

/**
 * Calculate and save I.C.A.R.E. evolution based on journey responses
 * This should be called when a journey is completed or when generating the report
 */
export const calculateAndSaveEvolution = async (
  journeyId: string,
  icareScores: Record<ICAREDimension, number>
): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const dimensions: ICAREDimension[] = [
      'Identité',
      'Capacités',
      'Appartenance',
      'Risque',
      'Estime',
    ];

    // Pour chaque dimension, créer ou mettre à jour l'évolution
    const promises = dimensions.map(async (dimension) => {
      const scoreAfter = icareScores[dimension];
      const scoreBefore = Math.max(10, Math.round(scoreAfter * 0.6)); // 60% du score actuel

      // TODO: Générer les phrases avec OpenAI
      const phraseBefore = `Évaluation initiale pour ${dimension}`;
      const phraseAfter = `Transformation positive sur ${dimension}`;

      return upsertICAREEvolution({
        journey_id: journeyId,
        dimension,
        score_before: scoreBefore,
        score_after: scoreAfter,
        phrase_before: phraseBefore,
        phrase_after: phraseAfter,
      });
    });

    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error('Exception calculating and saving evolution:', err);
    return false;
  }
};
