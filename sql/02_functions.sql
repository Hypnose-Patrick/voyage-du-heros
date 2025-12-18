-- =====================================================
-- JobSeek Hero Journey - Fonctions & Procédures Stockées
-- =====================================================
-- Description: Fonctions utilitaires pour la logique métier
-- =====================================================

-- =====================================================
-- FONCTION: Vérifier si l'utilisateur a des crédits
-- =====================================================
CREATE OR REPLACE FUNCTION check_user_credits(p_user_id UUID)
RETURNS TABLE(
  has_credits BOOLEAN,
  credits_remaining INTEGER,
  plan_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (credits_remaining > 0) AS has_credits,
    credits_remaining,
    plan_type
  FROM user_subscriptions
  WHERE user_id = p_user_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_user_credits IS 'Vérifie si utilisateur a des crédits disponibles';

-- =====================================================
-- FONCTION: Décrémenter les crédits utilisateur
-- =====================================================
CREATE OR REPLACE FUNCTION decrement_user_credits(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS TABLE(
  success BOOLEAN,
  new_balance INTEGER,
  message TEXT
) AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- Récupérer crédits actuels
  SELECT credits_remaining INTO v_current_credits
  FROM user_subscriptions
  WHERE user_id = p_user_id
  FOR UPDATE; -- Lock la ligne

  -- Vérifier si suffisamment de crédits
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'Abonnement non trouvé'::TEXT;
    RETURN;
  END IF;

  IF v_current_credits < p_amount THEN
    RETURN QUERY SELECT FALSE, v_current_credits, 'Crédits insuffisants'::TEXT;
    RETURN;
  END IF;

  -- Décrémenter
  UPDATE user_subscriptions
  SET credits_remaining = credits_remaining - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Retourner nouveau solde
  RETURN QUERY 
  SELECT TRUE, (v_current_credits - p_amount), 'Crédits débités avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION decrement_user_credits IS 'Débite des crédits avec vérification atomique';

-- =====================================================
-- FONCTION: Récupérer l'état complet d'un parcours
-- =====================================================
CREATE OR REPLACE FUNCTION get_journey_state(p_journey_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'journey', json_build_object(
      'id', hj.id,
      'user_id', hj.user_id,
      'current_stage', hj.current_stage,
      'status', hj.status,
      'total_xp', hj.total_xp,
      'started_at', hj.started_at,
      'completed_at', hj.completed_at
    ),
    'stages', (
      SELECT json_agg(
        json_build_object(
          'stage_number', js.stage_number,
          'stage_title', js.stage_title,
          'user_input', js.user_input,
          'ai_narrative', js.ai_narrative,
          'ai_insight', js.ai_insight,
          'xp_gained', js.xp_gained,
          'completed_at', js.completed_at
        ) ORDER BY js.stage_number
      )
      FROM journey_stages js
      WHERE js.journey_id = hj.id
    ),
    'icare_profile', (
      SELECT json_build_object(
        'identite', ic.identite,
        'capacites', ic.capacites,
        'appartenance', ic.appartenance,
        'risque', ic.risque,
        'estime', ic.estime,
        'updated_at', ic.updated_at
      )
      FROM icare_profiles ic
      WHERE ic.journey_id = hj.id
    ),
    'insights', (
      SELECT json_build_object(
        'pitch', pi.pitch,
        'tagline', pi.tagline,
        'soft_skills', pi.soft_skills,
        'accomplishments', pi.accomplishments,
        'environment', pi.environment,
        'created_at', pi.created_at
      )
      FROM pro_insights pi
      WHERE pi.journey_id = hj.id
    )
  ) INTO v_result
  FROM hero_journeys hj
  WHERE hj.id = p_journey_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_journey_state IS 'Retourne l\'état complet d\'un parcours en JSON';

-- =====================================================
-- FONCTION: Calculer la progression en pourcentage
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_journey_progress(p_journey_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_stages_completed INTEGER;
  v_progress INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_stages_completed
  FROM journey_stages
  WHERE journey_id = p_journey_id;

  v_progress := ROUND((v_stages_completed::NUMERIC / 12) * 100);
  
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_journey_progress IS 'Calcule le % de progression (0-100)';

-- =====================================================
-- FONCTION: Valider qu'un utilisateur peut modifier un parcours
-- =====================================================
CREATE OR REPLACE FUNCTION user_owns_journey(p_user_id UUID, p_journey_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM hero_journeys 
    WHERE id = p_journey_id 
      AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_owns_journey IS 'Vérifie qu\'un utilisateur possède un parcours';

-- =====================================================
-- FONCTION: Initialiser un nouveau parcours
-- =====================================================
CREATE OR REPLACE FUNCTION initialize_journey(p_user_id UUID)
RETURNS TABLE(
  journey_id UUID,
  icare_profile_id UUID,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_journey_id UUID;
  v_icare_id UUID;
  v_has_credits BOOLEAN;
BEGIN
  -- Vérifier crédits
  SELECT has_credits INTO v_has_credits
  FROM check_user_credits(p_user_id);

  IF NOT v_has_credits THEN
    RETURN QUERY SELECT NULL::UUID, NULL::UUID, FALSE, 'Crédits insuffisants pour démarrer un parcours'::TEXT;
    RETURN;
  END IF;

  -- Créer le parcours
  INSERT INTO hero_journeys (user_id, current_stage, status, total_xp)
  VALUES (p_user_id, 1, 'in_progress', 0)
  RETURNING id INTO v_journey_id;

  -- Créer le profil ICARE initial
  INSERT INTO icare_profiles (journey_id, identite, capacites, appartenance, risque, estime)
  VALUES (v_journey_id, 50, 50, 50, 50, 50)
  RETURNING id INTO v_icare_id;

  -- Décrémenter 1 crédit
  PERFORM decrement_user_credits(p_user_id, 1);

  RETURN QUERY SELECT v_journey_id, v_icare_id, TRUE, 'Parcours initialisé avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION initialize_journey IS 'Initialise un nouveau parcours avec profil ICARE';

-- =====================================================
-- FONCTION: Mettre à jour le profil ICARE
-- =====================================================
CREATE OR REPLACE FUNCTION update_icare_scores(
  p_journey_id UUID,
  p_identite_delta INTEGER DEFAULT 0,
  p_capacites_delta INTEGER DEFAULT 0,
  p_appartenance_delta INTEGER DEFAULT 0,
  p_risque_delta INTEGER DEFAULT 0,
  p_estime_delta INTEGER DEFAULT 0
)
RETURNS TABLE(
  identite INTEGER,
  capacites INTEGER,
  appartenance INTEGER,
  risque INTEGER,
  estime INTEGER
) AS $$
BEGIN
  UPDATE icare_profiles
  SET 
    identite = GREATEST(0, LEAST(100, identite + p_identite_delta)),
    capacites = GREATEST(0, LEAST(100, capacites + p_capacites_delta)),
    appartenance = GREATEST(0, LEAST(100, appartenance + p_appartenance_delta)),
    risque = GREATEST(0, LEAST(100, risque + p_risque_delta)),
    estime = GREATEST(0, LEAST(100, estime + p_estime_delta)),
    updated_at = NOW()
  WHERE icare_profiles.journey_id = p_journey_id;

  RETURN QUERY
  SELECT 
    ic.identite,
    ic.capacites,
    ic.appartenance,
    ic.risque,
    ic.estime
  FROM icare_profiles ic
  WHERE ic.journey_id = p_journey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_icare_scores IS 'Met à jour les scores ICARE avec delta (-10 à +10)';

-- =====================================================
-- FONCTION: Compléter une station
-- =====================================================
CREATE OR REPLACE FUNCTION complete_stage(
  p_journey_id UUID,
  p_stage_number INTEGER,
  p_stage_title TEXT,
  p_user_input TEXT,
  p_ai_narrative TEXT,
  p_ai_insight TEXT,
  p_icare_deltas JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE(
  stage_id UUID,
  new_current_stage INTEGER,
  new_total_xp INTEGER,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_stage_id UUID;
  v_journey_user_id UUID;
  v_current_stage INTEGER;
  v_new_xp INTEGER;
  v_identite_delta INTEGER;
  v_capacites_delta INTEGER;
  v_appartenance_delta INTEGER;
  v_risque_delta INTEGER;
  v_estime_delta INTEGER;
BEGIN
  -- Vérifier que le parcours existe et récupérer l'user_id
  SELECT user_id, current_stage INTO v_journey_user_id, v_current_stage
  FROM hero_journeys
  WHERE id = p_journey_id;

  IF v_journey_user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 0, 0, FALSE, 'Parcours non trouvé'::TEXT;
    RETURN;
  END IF;

  -- Vérifier que c'est la bonne station
  IF p_stage_number != v_current_stage THEN
    RETURN QUERY SELECT NULL::UUID, v_current_stage, 0, FALSE, 
      'Station invalide: attendue ' || v_current_stage || ', reçue ' || p_stage_number::TEXT;
    RETURN;
  END IF;

  -- Décrémenter crédits
  PERFORM decrement_user_credits(v_journey_user_id, 1);

  -- Extraire deltas ICARE du JSON
  v_identite_delta := COALESCE((p_icare_deltas->>'identite')::INTEGER, 0);
  v_capacites_delta := COALESCE((p_icare_deltas->>'capacites')::INTEGER, 0);
  v_appartenance_delta := COALESCE((p_icare_deltas->>'appartenance')::INTEGER, 0);
  v_risque_delta := COALESCE((p_icare_deltas->>'risque')::INTEGER, 0);
  v_estime_delta := COALESCE((p_icare_deltas->>'estime')::INTEGER, 0);

  -- Insérer la réponse de la station
  INSERT INTO journey_stages (
    journey_id, stage_number, stage_title, user_input, 
    ai_narrative, ai_insight, xp_gained
  )
  VALUES (
    p_journey_id, p_stage_number, p_stage_title, p_user_input,
    p_ai_narrative, p_ai_insight, 125
  )
  RETURNING id INTO v_stage_id;

  -- Mettre à jour le profil ICARE
  PERFORM update_icare_scores(
    p_journey_id,
    v_identite_delta,
    v_capacites_delta,
    v_appartenance_delta,
    v_risque_delta,
    v_estime_delta
  );

  -- Mettre à jour le parcours
  UPDATE hero_journeys
  SET 
    current_stage = CASE 
      WHEN p_stage_number < 12 THEN p_stage_number + 1 
      ELSE 12 
    END,
    total_xp = total_xp + 125,
    status = CASE 
      WHEN p_stage_number = 12 THEN 'completed'::TEXT 
      ELSE status 
    END,
    completed_at = CASE 
      WHEN p_stage_number = 12 THEN NOW() 
      ELSE completed_at 
    END,
    updated_at = NOW()
  WHERE id = p_journey_id
  RETURNING current_stage, total_xp INTO v_current_stage, v_new_xp;

  RETURN QUERY SELECT 
    v_stage_id, 
    v_current_stage, 
    v_new_xp, 
    TRUE, 
    'Station complétée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION complete_stage IS 'Complète une station et met à jour le parcours';

-- =====================================================
-- FIN DES FONCTIONS
-- =====================================================
