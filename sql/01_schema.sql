-- =====================================================
-- JobSeek Hero Journey - Schéma Principal
-- =====================================================
-- À exécuter EN PREMIER dans Supabase SQL Editor
-- =====================================================

-- =====================================================
-- EXTENSION UUID (si pas déjà activée)
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: user_subscriptions
-- Gestion des crédits et abonnements utilisateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  credits_total INTEGER NOT NULL DEFAULT 5,
  credits_remaining INTEGER NOT NULL DEFAULT 5,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_subscription UNIQUE (user_id),
  CONSTRAINT credits_non_negative CHECK (credits_remaining >= 0)
);

COMMENT ON TABLE user_subscriptions IS 'Abonnements et crédits des utilisateurs';

-- Index pour recherche rapide par user_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- =====================================================
-- TABLE: hero_journeys
-- Parcours du héros (1 par utilisateur actif)
-- =====================================================
CREATE TABLE IF NOT EXISTS hero_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 13),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  total_xp INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE hero_journeys IS 'Parcours du héros - un par session utilisateur';

-- Index pour recherche par user_id et status
CREATE INDEX IF NOT EXISTS idx_hero_journeys_user_id ON hero_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_hero_journeys_status ON hero_journeys(status);
CREATE INDEX IF NOT EXISTS idx_hero_journeys_user_status ON hero_journeys(user_id, status);

-- =====================================================
-- TABLE: journey_stages
-- Réponses aux 12 stations du parcours
-- =====================================================
CREATE TABLE IF NOT EXISTS journey_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES hero_journeys(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 12),
  stage_title TEXT NOT NULL,
  user_input TEXT NOT NULL,
  ai_narrative TEXT,
  ai_insight TEXT,
  xp_gained INTEGER DEFAULT 125,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_journey_stage UNIQUE (journey_id, stage_number)
);

COMMENT ON TABLE journey_stages IS 'Réponses utilisateur et feedback IA pour chaque station';

-- Index pour recherche par journey_id
CREATE INDEX IF NOT EXISTS idx_journey_stages_journey_id ON journey_stages(journey_id);

-- =====================================================
-- TABLE: icare_profiles
-- Profil psychologique ICARE (5 dimensions)
-- =====================================================
CREATE TABLE IF NOT EXISTS icare_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES hero_journeys(id) ON DELETE CASCADE,
  identite INTEGER NOT NULL DEFAULT 50 CHECK (identite BETWEEN 0 AND 100),
  capacites INTEGER NOT NULL DEFAULT 50 CHECK (capacites BETWEEN 0 AND 100),
  appartenance INTEGER NOT NULL DEFAULT 50 CHECK (appartenance BETWEEN 0 AND 100),
  risque INTEGER NOT NULL DEFAULT 50 CHECK (risque BETWEEN 0 AND 100),
  estime INTEGER NOT NULL DEFAULT 50 CHECK (estime BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_journey_icare UNIQUE (journey_id)
);

COMMENT ON TABLE icare_profiles IS 'Profil ICARE - 5 dimensions psychologiques (0-100)';

-- Index pour recherche par journey_id
CREATE INDEX IF NOT EXISTS idx_icare_profiles_journey_id ON icare_profiles(journey_id);

-- =====================================================
-- TABLE: pro_insights
-- Synthèse stratégique finale (après 12 stations)
-- =====================================================
CREATE TABLE IF NOT EXISTS pro_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES hero_journeys(id) ON DELETE CASCADE,
  pitch TEXT,
  tagline TEXT,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  accomplishments JSONB DEFAULT '[]'::jsonb,
  environment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_journey_insights UNIQUE (journey_id)
);

COMMENT ON TABLE pro_insights IS 'Synthèse stratégique générée après complétion du parcours';

-- Index pour recherche par journey_id
CREATE INDEX IF NOT EXISTS idx_pro_insights_journey_id ON pro_insights(journey_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE icare_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_insights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: user_subscriptions
-- =====================================================
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert via service role uniquement (ou trigger)
CREATE POLICY "Service role can insert subscriptions"
  ON user_subscriptions FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- POLICIES: hero_journeys
-- =====================================================
CREATE POLICY "Users can view their own journeys"
  ON hero_journeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journeys"
  ON hero_journeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journeys"
  ON hero_journeys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journeys"
  ON hero_journeys FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLICIES: journey_stages
-- =====================================================
CREATE POLICY "Users can view stages of their journeys"
  ON journey_stages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stages to their journeys"
  ON journey_stages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stages of their journeys"
  ON journey_stages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = journey_stages.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- =====================================================
-- POLICIES: icare_profiles
-- =====================================================
CREATE POLICY "Users can view ICARE profiles of their journeys"
  ON icare_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_profiles.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ICARE profiles for their journeys"
  ON icare_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_profiles.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ICARE profiles of their journeys"
  ON icare_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = icare_profiles.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- =====================================================
-- POLICIES: pro_insights
-- =====================================================
CREATE POLICY "Users can view insights of their journeys"
  ON pro_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = pro_insights.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert insights for their journeys"
  ON pro_insights FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hero_journeys
      WHERE hero_journeys.id = pro_insights.journey_id
      AND hero_journeys.user_id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGER: Auto-create subscription on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_type, credits_total, credits_remaining)
  VALUES (NEW.id, 'free', 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables concernées
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_journeys_updated_at ON hero_journeys;
CREATE TRIGGER update_hero_journeys_updated_at
  BEFORE UPDATE ON hero_journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_icare_profiles_updated_at ON icare_profiles;
CREATE TRIGGER update_icare_profiles_updated_at
  BEFORE UPDATE ON icare_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONNÉES INITIALES: Plan types (optionnel)
-- =====================================================
-- Ces données sont déjà dans 02_reference_data.sql
-- Mais si tu veux une table dédiée:

-- CREATE TABLE IF NOT EXISTS plan_types (
--   code TEXT PRIMARY KEY,
--   name TEXT NOT NULL,
--   credits_included INTEGER NOT NULL,
--   price_monthly DECIMAL(10,2),
--   features JSONB
-- );

-- =====================================================
-- FIN DU SCHÉMA PRINCIPAL
-- =====================================================

-- VÉRIFICATION: Lister les tables créées
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
