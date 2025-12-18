-- =====================================================
-- JobSeek Hero Journey - Fonctions Utilitaires
-- =====================================================
-- Fonctions PostgreSQL pour faciliter les opérations
-- =====================================================

-- =====================================================
-- FONCTION: Vérifier et décrémenter les crédits
-- =====================================================
CREATE OR REPLACE FUNCTION check_and_consume_credit(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_credits INTEGER;
  v_plan TEXT;
  v_result JSONB;
BEGIN
  -- Récupérer les crédits actuels
  SELECT credits_remaining, plan_type
  INTO v_credits, v_plan
  FROM user_subscriptions
  WHERE user_id = p_user_id
    AND (valid_until IS NULL OR valid_until > NOW());
  
  -- Si pas d'abonnement trouvé
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'NO_SUBSCRIPTION',
      'message', 'Aucun abonnement actif trouvé'
    );
  END IF;
  
  -- Si plus de crédits
  IF v_credits <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INSUFFICIENT_CREDITS',
      'message', 'Crédits insuffisants',
      'credits_remaining', 0
    );
  END IF;
  
  -- Décrémenter le crédit
  UPDATE user_subscriptions
  SET credits_remaining = credits_remaining - 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Retourner succès avec nouveau solde
  RETURN jsonb_build_object(
    'success', true,
    'credits_remaining', v_credits - 1,
    'plan_type', v_plan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_and_consume_credit IS 'Vérifie et consomme 1 crédit pour l''utilisateur';

-- =====================================================
-- FONCTION: Obtenir les statistiques d'un parcours
-- =====================================================
CREATE OR REPLACE FUNCTION get_journey_stats(p_journey_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'journey_id', hj.id,
    'status', hj.status,
    'current_stage', hj.current_stage,
    'total_xp', hj.total_xp,
    'stages_completed', COUNT(js.id),
    'completion_percentage', ROUND((COUNT(js.id)::NUMERIC / 12) * 100, 2),
    'started_at', hj.started_at,
    'completed_at', hj.completed_at,
    'icare_profile', jsonb_build_object(
      'identite', COALESCE(ic.identite, 50),
      'capacites', COALESCE(ic.capacites, 50),
      'appartenance', COALESCE(ic.appartenance, 50),
      'risque', COALESCE(ic.risque, 50),
      'estime', COALESCE(ic.estime, 50)
    )
  )
  INTO v_stats
  FROM hero_journeys hj
  LEFT JOIN journey_stages js ON hj.id = js.journey_id
  LEFT JOIN icare_profiles ic ON hj.id = ic.journey_id
  WHERE hj.id = p_journey_id
  GROUP BY hj.id, hj.status, hj.current_stage, hj.total_xp, hj.started_at, hj.completed_at,
           ic.identite, ic.capacites, ic.appartenance, ic.risque, ic.estime;
  
  RETURN COALESCE(v_stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_journey_stats IS 'Retourne les statistiques complètes d''un parcours';

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
RETURNS JSONB AS $$
DECLARE
  v_new_scores JSONB;
BEGIN
  -- Mettre à jour avec capping à 0-100
  UPDATE icare_profiles
  SET 
    identite = GREATEST(0, LEAST(100, identite + p_identite_delta)),
    capacites = GREATEST(0, LEAST(100, capacites + p_capacites_delta)),
    appartenance = GREATEST(0, LEAST(100, appartenance + p_appartenance_delta)),
    risque = GREATEST(0, LEAST(100, risque + p_risque_delta)),
    estime = GREATEST(0, LEAST(100, estime + p_estime_delta)),
    updated_at = NOW()
  WHERE journey_id = p_journey_id
  RETURNING jsonb_build_object(
    'identite', identite,
    'capacites', capacites,
    'appartenance', appartenance,
    'risque', risque,
    'estime', estime
  )
  INTO v_new_scores;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Journey not found: %', p_journey_id;
  END IF;
  
  RETURN v_new_scores;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_icare_scores IS 'Met à jour les scores ICARE avec deltas (-10 à +10) et capping 0-100';

-- =====================================================
-- FONCTION: Créer un nouveau parcours
-- =====================================================
CREATE OR REPLACE FUNCTION create_new_journey(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_journey_id UUID;
  v_credit_check JSONB;
  v_result JSONB;
BEGIN
  -- Vérifier et consommer 1 crédit
  v_credit_check := check_and_consume_credit(p_user_id);
  
  IF NOT (v_credit_check->>'success')::BOOLEAN THEN
    RETURN v_credit_check;
  END IF;
  
  -- Créer le parcours
  INSERT INTO hero_journeys (user_id, current_stage, status, total_xp)
  VALUES (p_user_id, 1, 'in_progress', 0)
  RETURNING id INTO v_journey_id;
  
  -- Créer le profil ICARE initial
  INSERT INTO icare_profiles (journey_id, identite, capacites, appartenance, risque, estime)
  VALUES (v_journey_id, 50, 50, 50, 50, 50);
  
  -- Retourner le résultat
  RETURN jsonb_build_object(
    'success', true,
    'journey_id', v_journey_id,
    'current_stage', 1,
    'credits_remaining', (v_credit_check->>'credits_remaining')::INTEGER,
    'icare_profile', jsonb_build_object(
      'identite', 50,
      'capacites', 50,
      'appartenance', 50,
      'risque', 50,
      'estime', 50
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_new_journey IS 'Crée un nouveau parcours après vérification des crédits';

-- =====================================================
-- FONCTION: Finaliser un parcours (station 12 complétée)
-- =====================================================
CREATE OR REPLACE FUNCTION complete_journey(p_journey_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_stages_count INTEGER;
BEGIN
  -- Vérifier que les 12 stations sont complètes
  SELECT COUNT(*) INTO v_stages_count
  FROM journey_stages
  WHERE journey_id = p_journey_id;
  
  IF v_stages_count < 12 THEN
    RAISE EXCEPTION 'Cannot complete journey: only % stages completed', v_stages_count;
  END IF;
  
  -- Mettre à jour le statut
  UPDATE hero_journeys
  SET 
    status = 'completed',
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_journey_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION complete_journey IS 'Marque un parcours comme complété (après station 12)';

-- =====================================================
-- FONCTION: Obtenir la station suivante
-- =====================================================
CREATE OR REPLACE FUNCTION get_next_station(p_journey_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_current_stage INTEGER;
  v_next_station JSONB;
BEGIN
  -- Récupérer la station actuelle
  SELECT current_stage INTO v_current_stage
  FROM hero_journeys
  WHERE id = p_journey_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Journey not found');
  END IF;
  
  -- Si parcours terminé
  IF v_current_stage > 12 THEN
    RETURN jsonb_build_object(
      'completed', true,
      'message', 'Parcours terminé'
    );
  END IF;
  
  -- Récupérer les données de la station
  SELECT jsonb_build_object(
    'stage_number', stage_number,
    'title', title,
    'prompt_user', prompt_user,
    'focus_icare', focus_icare,
    'objective', objective,
    'xp_reward', xp_reward
  )
  INTO v_next_station
  FROM stations_config
  WHERE stage_number = v_current_stage
    AND is_active = true;
  
  RETURN v_next_station;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_next_station IS 'Retourne les données de la station courante du parcours';

-- =====================================================
-- FONCTION: Obtenir historique complet d'un parcours
-- =====================================================
CREATE OR REPLACE FUNCTION get_journey_history(p_journey_id UUID, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Vérifier que l'utilisateur possède ce parcours
  IF NOT EXISTS (
    SELECT 1 FROM hero_journeys 
    WHERE id = p_journey_id AND user_id = p_user_id
  ) THEN
    RETURN jsonb_build_object('error', 'Unauthorized');
  END IF;
  
  -- Construire l'historique complet
  SELECT jsonb_build_object(
    'journey', jsonb_build_object(
      'id', hj.id,
      'status', hj.status,
      'current_stage', hj.current_stage,
      'total_xp', hj.total_xp,
      'started_at', hj.started_at,
      'completed_at', hj.completed_at
    ),
    'stages', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
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
      WHERE js.journey_id = p_journey_id),
      '[]'::jsonb
    ),
    'icare_profile', COALESCE(
      (SELECT jsonb_build_object(
        'identite', ic.identite,
        'capacites', ic.capacites,
        'appartenance', ic.appartenance,
        'risque', ic.risque,
        'estime', ic.estime
      )
      FROM icare_profiles ic
      WHERE ic.journey_id = p_journey_id),
      jsonb_build_object('identite', 50, 'capacites', 50, 'appartenance', 50, 'risque', 50, 'estime', 50)
    ),
    'pro_insights', COALESCE(
      (SELECT jsonb_build_object(
        'pitch', pi.pitch,
        'tagline', pi.tagline,
        'soft_skills', pi.soft_skills,
        'accomplishments', pi.accomplishments,
        'environment', pi.environment,
        'created_at', pi.created_at
      )
      FROM pro_insights pi
      WHERE pi.journey_id = p_journey_id),
      NULL
    )
  )
  INTO v_result
  FROM hero_journeys hj
  WHERE hj.id = p_journey_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_journey_history IS 'Retourne l''historique complet d''un parcours avec toutes les données';

-- =====================================================
-- FONCTION: Statistiques utilisateur globales
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_journeys', COUNT(*),
    'completed_journeys', COUNT(*) FILTER (WHERE status = 'completed'),
    'in_progress_journeys', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'total_xp', COALESCE(SUM(total_xp), 0),
    'subscription', (
      SELECT jsonb_build_object(
        'plan_type', us.plan_type,
        'credits_remaining', us.credits_remaining,
        'credits_total', us.credits_total,
        'valid_until', us.valid_until
      )
      FROM user_subscriptions us
      WHERE us.user_id = p_user_id
      LIMIT 1
    )
  )
  INTO v_stats
  FROM hero_journeys
  WHERE user_id = p_user_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_statistics IS 'Retourne les statistiques globales d''un utilisateur';

-- =====================================================
-- FIN DES FONCTIONS UTILITAIRES
-- =====================================================
