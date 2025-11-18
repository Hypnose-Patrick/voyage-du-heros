-- ================================================
-- VOYAGE DU HÉROS - I.C.A.R.E. EVOLUTION TABLE
-- ================================================
-- Migration: I.C.A.R.E. Transformation tracking
-- Created: 2025-01-17
-- Description: Table for tracking I.C.A.R.E. dimension evolution

-- ================================================
-- TABLE: icare_evolution
-- ================================================
-- Tracks the evolution of each I.C.A.R.E. dimension before/after
CREATE TABLE IF NOT EXISTS icare_evolution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES hero_journeys(id) ON DELETE CASCADE NOT NULL,
  dimension TEXT CHECK (dimension IN ('Identité', 'Capacités', 'Appartenance', 'Risque', 'Estime')) NOT NULL,

  -- Scores (0-100, convertis en /10 pour affichage)
  score_before INTEGER CHECK (score_before >= 0 AND score_before <= 100) DEFAULT 0,
  score_after INTEGER CHECK (score_after >= 0 AND score_after <= 100) DEFAULT 0,

  -- Phrases descriptives
  phrase_before TEXT,
  phrase_after TEXT,

  -- Insights générés par IA (optionnel)
  insights JSONB DEFAULT '[]',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contrainte unique : une seule évolution par dimension par parcours
  UNIQUE(journey_id, dimension)
);

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_icare_evolution_journey_id ON icare_evolution(journey_id);
CREATE INDEX IF NOT EXISTS idx_icare_evolution_dimension ON icare_evolution(dimension);
CREATE INDEX IF NOT EXISTS idx_icare_evolution_created_at ON icare_evolution(created_at DESC);

-- Index GIN pour les recherches dans le JSONB insights
CREATE INDEX IF NOT EXISTS idx_icare_evolution_insights_gin ON icare_evolution USING GIN (insights);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE icare_evolution ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les évolutions de leurs parcours
CREATE POLICY "Users can view own icare evolution"
  ON icare_evolution
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_evolution.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent créer des évolutions pour leurs parcours
CREATE POLICY "Users can create own icare evolution"
  ON icare_evolution
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_evolution.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent mettre à jour les évolutions de leurs parcours
CREATE POLICY "Users can update own icare evolution"
  ON icare_evolution
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_evolution.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_evolution.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- Les utilisateurs peuvent supprimer les évolutions de leurs parcours
CREATE POLICY "Users can delete own icare evolution"
  ON icare_evolution
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_evolution.journey_id
      AND (hero_journeys.user_id = auth.uid() OR hero_journeys.user_id IS NULL)
    )
  );

-- ================================================
-- FUNCTIONS
-- ================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_icare_evolution_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_icare_evolution_updated_at
  BEFORE UPDATE ON icare_evolution
  FOR EACH ROW
  EXECUTE FUNCTION update_icare_evolution_updated_at();

-- Fonction pour obtenir l'évolution I.C.A.R.E. complète d'un parcours
CREATE OR REPLACE FUNCTION get_icare_evolution(journey_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  avg_before NUMERIC;
  avg_after NUMERIC;
  total_progression NUMERIC;
BEGIN
  -- Calculer les moyennes
  SELECT
    AVG(score_before),
    AVG(score_after)
  INTO avg_before, avg_after
  FROM icare_evolution
  WHERE journey_id = journey_uuid;

  -- Calculer la progression
  IF avg_before > 0 THEN
    total_progression := ((avg_after - avg_before) / avg_before) * 100;
  ELSE
    total_progression := 0;
  END IF;

  -- Construire le résultat
  SELECT json_build_object(
    'dimensions', (
      SELECT json_agg(
        json_build_object(
          'dimension', dimension,
          'score_before', score_before,
          'score_after', score_after,
          'phrase_before', phrase_before,
          'phrase_after', phrase_after,
          'progression', score_after - score_before,
          'progression_percent',
            CASE
              WHEN score_before > 0 THEN ROUND(((score_after - score_before)::NUMERIC / score_before::NUMERIC) * 100, 1)
              ELSE 0
            END
        )
        ORDER BY
          CASE dimension
            WHEN 'Identité' THEN 1
            WHEN 'Capacités' THEN 2
            WHEN 'Appartenance' THEN 3
            WHEN 'Risque' THEN 4
            WHEN 'Estime' THEN 5
          END
      )
      FROM icare_evolution
      WHERE journey_id = journey_uuid
    ),
    'summary', json_build_object(
      'avg_before', ROUND(avg_before, 1),
      'avg_after', ROUND(avg_after, 1),
      'total_progression', ROUND(total_progression, 1)
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour initialiser l'évolution I.C.A.R.E. avec des valeurs par défaut
CREATE OR REPLACE FUNCTION initialize_icare_evolution(
  journey_uuid UUID,
  dimension_name TEXT,
  initial_score INTEGER DEFAULT 40
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO icare_evolution (
    journey_id,
    dimension,
    score_before,
    score_after,
    phrase_before,
    phrase_after
  ) VALUES (
    journey_uuid,
    dimension_name,
    initial_score,
    initial_score,
    'Évaluation initiale en cours...',
    'Transformation en cours...'
  )
  ON CONFLICT (journey_id, dimension)
  DO UPDATE SET updated_at = NOW()
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- COMMENTAIRES
-- ================================================

COMMENT ON TABLE icare_evolution IS 'Tracks the evolution of I.C.A.R.E. dimensions before and after the journey';
COMMENT ON COLUMN icare_evolution.dimension IS 'I.C.A.R.E. dimension: Identité, Capacités, Appartenance, Risque, or Estime';
COMMENT ON COLUMN icare_evolution.score_before IS 'Score before transformation (0-100)';
COMMENT ON COLUMN icare_evolution.score_after IS 'Score after transformation (0-100)';
COMMENT ON COLUMN icare_evolution.phrase_before IS 'Descriptive phrase of the state before transformation';
COMMENT ON COLUMN icare_evolution.phrase_after IS 'Descriptive phrase of the state after transformation';
COMMENT ON COLUMN icare_evolution.insights IS 'AI-generated insights about the transformation (JSONB array)';
