-- =====================================================
-- JobSeek Hero Journey - STAR Experiences Table
-- =====================================================
-- Table pour stocker les expériences professionnelles
-- extraites selon la méthode STAR depuis les récits
-- =====================================================

-- =====================================================
-- TABLE: star_experiences
-- Expériences professionnelles structurées (STAR)
-- =====================================================
CREATE TABLE IF NOT EXISTS star_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id UUID REFERENCES hero_journeys(id) ON DELETE CASCADE,
  stage_number INTEGER CHECK (stage_number BETWEEN 1 AND 12),

  -- Source de l'expérience
  source_type TEXT NOT NULL DEFAULT 'journey' CHECK (source_type IN ('journey', 'manual')),
  narrative_original TEXT NOT NULL, -- Le récit original de l'utilisateur

  -- Structure STAR
  title TEXT NOT NULL, -- Titre court de l'expérience (max 60 car)
  situation TEXT NOT NULL, -- Contexte et situation initiale
  task TEXT NOT NULL, -- Tâche ou défi à relever
  action TEXT NOT NULL, -- Actions entreprises
  result TEXT NOT NULL, -- Résultats obtenus

  -- Métadonnées
  competencies JSONB DEFAULT '[]'::jsonb, -- ["compétence1", "compétence2", ...]
  is_featured BOOLEAN DEFAULT FALSE, -- Si mise en avant par l'utilisateur
  display_order INTEGER, -- Ordre d'affichage personnalisé

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE star_experiences IS 'Expériences professionnelles structurées selon la méthode STAR';
COMMENT ON COLUMN star_experiences.source_type IS 'Source: journey (extrait du parcours) ou manual (ajouté manuellement)';
COMMENT ON COLUMN star_experiences.narrative_original IS 'Le récit original fourni par l''utilisateur';
COMMENT ON COLUMN star_experiences.competencies IS 'Array JSON des compétences démontrées';
COMMENT ON COLUMN star_experiences.is_featured IS 'Si cette expérience est mise en avant dans le CV/profil';

-- =====================================================
-- INDEX pour performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_star_experiences_user_id ON star_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_star_experiences_journey_id ON star_experiences(journey_id);
CREATE INDEX IF NOT EXISTS idx_star_experiences_user_featured ON star_experiences(user_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_star_experiences_competencies ON star_experiences USING GIN (competencies);

-- =====================================================
-- FUNCTION: Mise à jour automatique du timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_star_experience_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_star_experience_timestamp
  BEFORE UPDATE ON star_experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_star_experience_updated_at();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
ALTER TABLE star_experiences ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir uniquement leurs propres expériences
CREATE POLICY "Users can view their own star_experiences"
  ON star_experiences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent insérer leurs propres expériences
CREATE POLICY "Users can insert their own star_experiences"
  ON star_experiences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent modifier leurs propres expériences
CREATE POLICY "Users can update their own star_experiences"
  ON star_experiences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent supprimer leurs propres expériences
CREATE POLICY "Users can delete their own star_experiences"
  ON star_experiences
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Obtenir toutes les expériences STAR d'un utilisateur
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_star_experiences(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  situation TEXT,
  task TEXT,
  action TEXT,
  result TEXT,
  competencies JSONB,
  source_type TEXT,
  stage_number INTEGER,
  is_featured BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.id,
    se.title,
    se.situation,
    se.task,
    se.action,
    se.result,
    se.competencies,
    se.source_type,
    se.stage_number,
    se.is_featured,
    se.created_at
  FROM star_experiences se
  WHERE se.user_id = p_user_id
  ORDER BY
    se.is_featured DESC,
    COALESCE(se.display_order, 999),
    se.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Obtenir les compétences uniques d'un utilisateur
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_competencies(p_user_id UUID)
RETURNS TABLE (
  competency TEXT,
  count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    comp.value::TEXT as competency,
    COUNT(*)::INTEGER as count
  FROM star_experiences se
  CROSS JOIN LATERAL jsonb_array_elements_text(se.competencies) as comp(value)
  WHERE se.user_id = p_user_id
  GROUP BY comp.value
  ORDER BY count DESC, comp.value ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Vue: Résumé des expériences STAR par utilisateur
-- =====================================================
CREATE OR REPLACE VIEW user_star_summary AS
SELECT
  user_id,
  COUNT(*) as total_experiences,
  COUNT(*) FILTER (WHERE is_featured = TRUE) as featured_count,
  COUNT(*) FILTER (WHERE source_type = 'journey') as from_journey_count,
  COUNT(*) FILTER (WHERE source_type = 'manual') as manual_count,
  MAX(created_at) as last_experience_date
FROM star_experiences
GROUP BY user_id;

COMMENT ON VIEW user_star_summary IS 'Résumé statistique des expériences STAR par utilisateur';
