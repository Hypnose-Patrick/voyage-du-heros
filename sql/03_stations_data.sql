-- =====================================================
-- JobSeek Hero Journey - Données de référence
-- =====================================================
-- Description: Les 12 stations du parcours
-- =====================================================

-- =====================================================
-- TABLE: journey_stations_metadata
-- Description: Métadonnées des 12 stations (référence)
-- =====================================================
CREATE TABLE IF NOT EXISTS journey_stations_metadata (
  stage_number INTEGER PRIMARY KEY CHECK (stage_number BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  icare_focus TEXT[] NOT NULL,
  objective TEXT NOT NULL,
  icon TEXT DEFAULT '🎯'
);

COMMENT ON TABLE journey_stations_metadata IS 'Métadonnées des 12 stations (données de référence)';

-- =====================================================
-- Insertion des 12 stations
-- =====================================================

INSERT INTO journey_stations_metadata (stage_number, title, prompt, icare_focus, objective, icon) VALUES
(
  1,
  'Votre situation professionnelle actuelle',
  'Décrivez votre poste actuel (ou dernier poste) et ce qui ne vous convient plus. Soyez concret : missions, environnement, ce qui vous frustre.',
  ARRAY['identite'],
  'Diagnostic de départ',
  '🎯'
),
(
  2,
  'Pourquoi changer maintenant ?',
  'Qu''est-ce qui vous pousse à envisager une transition ? Quels sont vos déclencheurs (événement, ras-le-bol, aspiration nouvelle) ?',
  ARRAY['identite', 'estime'],
  'Valider l''intention',
  '💡'
),
(
  3,
  'Vos freins au changement',
  'Quelles peurs vous empêchent d''agir ? (peur financière, peur du jugement, peur de l''échec, besoin de sécurité...)',
  ARRAY['risque', 'estime'],
  'Identifier les blocages',
  '🚧'
),
(
  4,
  'Vos ressources disponibles',
  'Qui peut vous aider ? Quelles compétences possédez-vous déjà ? Quelles formations, réseaux, ou outils avez-vous à disposition ?',
  ARRAY['capacites', 'appartenance'],
  'Inventaire des atouts',
  '🎁'
),
(
  5,
  'Votre premier engagement',
  'Quel est le premier acte concret que vous allez poser cette semaine ? (mise à jour CV, appel réseau, formation, candidature test...)',
  ARRAY['identite', 'risque'],
  'Passage à l''action',
  '🚀'
),
(
  6,
  'Votre écosystème professionnel',
  'Listez 3 personnes qui vous soutiennent vraiment ET 3 obstacles récurrents (procrastination, perfectionnisme, manque de réseau...)',
  ARRAY['capacites', 'appartenance', 'estime'],
  'Cartographie sociale',
  '🌐'
),
(
  7,
  'Votre stratégie de recherche',
  'Quel type de poste visez-vous ? Dans quel secteur ? Avec quels critères non-négociables (salaire, lieu, horaires, missions) ?',
  ARRAY['identite', 'capacites'],
  'Définir la cible',
  '🎯'
),
(
  8,
  'Votre plus grande peur professionnelle',
  'Quelle est LA peur qui vous paralyse le plus ? (syndrome de l''imposteur, peur du rejet, peur de la précarité...) Qu''est-ce qui serait le pire qui pourrait arriver ?',
  ARRAY['identite', 'risque', 'estime'],
  'Affronter le blocage principal',
  '⚡'
),
(
  9,
  'Vos premiers résultats',
  'Depuis le début de ce parcours, quels résultats avez-vous obtenus ? (candidatures envoyées, entretiens, nouvelles compétences acquises, confiance retrouvée...)',
  ARRAY['identite', 'capacites', 'appartenance'],
  'Ancrer les gains',
  '🏆'
),
(
  10,
  'Comment tenir sur la durée',
  'Comment allez-vous maintenir votre motivation si la recherche prend du temps ? Quelles routines mettre en place ?',
  ARRAY['risque', 'identite'],
  'Résilience',
  '💪'
),
(
  11,
  'Votre nouveau positionnement',
  'En une phrase, qui êtes-vous professionnellement maintenant ? Quel est votre pitch en 30 secondes ?',
  ARRAY['identite', 'appartenance'],
  'Affirmation identitaire',
  '⭐'
),
(
  12,
  'Votre plan d''action 90 jours',
  'Listez 5 actions concrètes que vous allez mener dans les 90 prochains jours. Soyez précis et mesurable.',
  ARRAY['appartenance'],
  'Plan d''action structuré',
  '📋'
);

-- =====================================================
-- Vue: Récupérer toutes les stations avec métadonnées
-- =====================================================
CREATE OR REPLACE VIEW stations_reference AS
SELECT 
  stage_number,
  title,
  prompt,
  icare_focus,
  objective,
  icon
FROM journey_stations_metadata
ORDER BY stage_number;

COMMENT ON VIEW stations_reference IS 'Vue de référence des 12 stations';

-- =====================================================
-- FONCTION: Récupérer les métadonnées d'une station
-- =====================================================
CREATE OR REPLACE FUNCTION get_station_metadata(p_stage_number INTEGER)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'stage_number', stage_number,
      'title', title,
      'prompt', prompt,
      'icare_focus', icare_focus,
      'objective', objective,
      'icon', icon
    )
    FROM journey_stations_metadata
    WHERE stage_number = p_stage_number
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_station_metadata IS 'Retourne les métadonnées d''une station en JSON';

-- =====================================================
-- FIN DES DONNÉES DE RÉFÉRENCE
-- =====================================================
