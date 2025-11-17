-- ================================================
-- VOYAGE DU HÉROS - SUPABASE DATABASE SCHEMA
-- ================================================
-- Migration: Initial schema for Hero's Journey tracking
-- Created: 2025-01-17
-- Description: Tables for journeys and station responses

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLE: hero_journeys
-- ================================================
-- Tracks each user's journey through the Hero's Journey
CREATE TABLE IF NOT EXISTS hero_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT CHECK (tier IN ('STANDARD', 'PREMIUM', 'ELITE')) NOT NULL DEFAULT 'STANDARD',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_station INTEGER DEFAULT 1 CHECK (current_station >= 1 AND current_station <= 12),
  credits_deducted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_hero_journeys_user_id ON hero_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_hero_journeys_created_at ON hero_journeys(created_at DESC);

-- ================================================
-- TABLE: station_responses
-- ================================================
-- Stores user responses for each station
CREATE TABLE IF NOT EXISTS station_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES hero_journeys(id) ON DELETE CASCADE NOT NULL,
  station_number INTEGER NOT NULL CHECK (station_number >= 1 AND station_number <= 12),
  responses JSONB NOT NULL DEFAULT '{}',
  time_spent_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contrainte unique : une seule réponse par station par parcours
  UNIQUE(journey_id, station_number)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_station_responses_journey_id ON station_responses(journey_id);
CREATE INDEX IF NOT EXISTS idx_station_responses_station_number ON station_responses(station_number);
CREATE INDEX IF NOT EXISTS idx_station_responses_created_at ON station_responses(created_at DESC);

-- Index GIN pour les recherches dans le JSONB
CREATE INDEX IF NOT EXISTS idx_station_responses_responses_gin ON station_responses USING GIN (responses);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
-- Activer RLS sur les tables
ALTER TABLE hero_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_responses ENABLE ROW LEVEL SECURITY;

-- ================================================
-- POLICIES - hero_journeys
-- ================================================

-- Les utilisateurs peuvent voir leurs propres parcours
CREATE POLICY "Users can view own journeys"
  ON hero_journeys
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Les utilisateurs peuvent créer leurs propres parcours
CREATE POLICY "Users can create own journeys"
  ON hero_journeys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Les utilisateurs peuvent mettre à jour leurs propres parcours
CREATE POLICY "Users can update own journeys"
  ON hero_journeys
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Les utilisateurs peuvent supprimer leurs propres parcours
CREATE POLICY "Users can delete own journeys"
  ON hero_journeys
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ================================================
-- POLICIES - station_responses
-- ================================================

-- Les utilisateurs peuvent voir les réponses de leurs parcours
CREATE POLICY "Users can view own station responses"
  ON station_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent créer des réponses pour leurs parcours
CREATE POLICY "Users can create own station responses"
  ON station_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent mettre à jour les réponses de leurs parcours
CREATE POLICY "Users can update own station responses"
  ON station_responses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent supprimer les réponses de leurs parcours
CREATE POLICY "Users can delete own station responses"
  ON station_responses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- ================================================
-- FUNCTIONS
-- ================================================

-- Fonction pour obtenir le profil complet d'un parcours
CREATE OR REPLACE FUNCTION get_journey_profile(journey_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'journey', row_to_json(j.*),
    'stations', (
      SELECT json_agg(row_to_json(sr.*) ORDER BY sr.station_number)
      FROM station_responses sr
      WHERE sr.journey_id = journey_uuid
    )
  ) INTO result
  FROM hero_journeys j
  WHERE j.id = journey_uuid;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer la progression d'un parcours
CREATE OR REPLACE FUNCTION calculate_journey_progress(journey_uuid UUID)
RETURNS JSON AS $$
DECLARE
  completed_stations INTEGER;
  total_stations INTEGER := 12;
  progress_percentage NUMERIC;
BEGIN
  SELECT COUNT(*) INTO completed_stations
  FROM station_responses
  WHERE journey_id = journey_uuid;

  progress_percentage := (completed_stations::NUMERIC / total_stations::NUMERIC) * 100;

  RETURN json_build_object(
    'completed_stations', completed_stations,
    'total_stations', total_stations,
    'progress_percentage', ROUND(progress_percentage, 2)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- COMMENTAIRES
-- ================================================

COMMENT ON TABLE hero_journeys IS 'Tracks each user''s Hero''s Journey progress through the 12 stations';
COMMENT ON TABLE station_responses IS 'Stores user responses and reflections for each station';
COMMENT ON COLUMN hero_journeys.tier IS 'Subscription tier: STANDARD (free), PREMIUM, or ELITE';
COMMENT ON COLUMN hero_journeys.current_station IS 'The station the user is currently on (1-12)';
COMMENT ON COLUMN station_responses.responses IS 'JSONB object containing all user responses for the station';
COMMENT ON COLUMN station_responses.time_spent_seconds IS 'Time spent on the station in seconds';
