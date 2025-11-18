-- ================================================
-- SECURITY FIX: Remove Anonymous Access
-- ================================================
-- Migration: Fix critical security vulnerabilities
-- Created: 2025-01-18
-- Description: Remove anonymous access and secure SECURITY DEFINER functions
-- Author: Security Audit

-- ================================================
-- FIX 1: Remove Anonymous Access from RLS Policies
-- ================================================

-- Drop and recreate all policies for hero_journeys without anonymous access
DROP POLICY IF EXISTS "Users can view own journeys" ON hero_journeys;
DROP POLICY IF EXISTS "Users can create own journeys" ON hero_journeys;
DROP POLICY IF EXISTS "Users can update own journeys" ON hero_journeys;
DROP POLICY IF EXISTS "Users can delete own journeys" ON hero_journeys;

-- Recreate policies WITHOUT "OR user_id IS NULL"
CREATE POLICY "Users can view own journeys"
  ON hero_journeys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journeys"
  ON hero_journeys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journeys"
  ON hero_journeys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journeys"
  ON hero_journeys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Drop and recreate all policies for station_responses
DROP POLICY IF EXISTS "Users can view own station responses" ON station_responses;
DROP POLICY IF EXISTS "Users can create own station responses" ON station_responses;
DROP POLICY IF EXISTS "Users can update own station responses" ON station_responses;
DROP POLICY IF EXISTS "Users can delete own station responses" ON station_responses;

-- Recreate policies WITHOUT "OR hero_journeys.user_id IS NULL"
CREATE POLICY "Users can view own station responses"
  ON station_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own station responses"
  ON station_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own station responses"
  ON station_responses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own station responses"
  ON station_responses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = station_responses.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- ================================================
-- FIX 2: Secure SECURITY DEFINER Functions
-- ================================================

-- Recreate get_journey_profile with access control
CREATE OR REPLACE FUNCTION get_journey_profile(journey_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- SECURITY CHECK: Verify user owns this journey
  IF NOT EXISTS (
    SELECT 1 FROM hero_journeys 
    WHERE id = journey_uuid 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You do not own this journey';
  END IF;

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

-- Recreate calculate_journey_progress with access control
CREATE OR REPLACE FUNCTION calculate_journey_progress(journey_uuid UUID)
RETURNS JSON AS $$
DECLARE
  completed_stations INTEGER;
  total_stations INTEGER := 12;
  progress_percentage NUMERIC;
BEGIN
  -- SECURITY CHECK: Verify user owns this journey
  IF NOT EXISTS (
    SELECT 1 FROM hero_journeys 
    WHERE id = journey_uuid 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You do not own this journey';
  END IF;

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
-- COMMENTS
-- ================================================

COMMENT ON POLICY "Users can view own journeys" ON hero_journeys IS 
  'SECURED: Users can only view their own authenticated journeys';
  
COMMENT ON POLICY "Users can view own station responses" ON station_responses IS 
  'SECURED: Users can only view responses from journeys they own';

COMMENT ON FUNCTION get_journey_profile(UUID) IS 
  'SECURED: Access control added - users can only access their own journey profiles';

COMMENT ON FUNCTION calculate_journey_progress(UUID) IS 
  'SECURED: Access control added - users can only calculate progress for their own journeys';
