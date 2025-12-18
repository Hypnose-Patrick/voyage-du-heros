-- =====================================================
-- JobSeek Hero Journey - Données de Référence
-- =====================================================
-- Les 12 stations du parcours avec leurs métadonnées
-- =====================================================

-- =====================================================
-- TABLE: stations_config
-- Description: Configuration des 12 stations (référence)
-- =====================================================
CREATE TABLE IF NOT EXISTS stations_config (
  id SERIAL PRIMARY KEY,
  stage_number INTEGER UNIQUE NOT NULL CHECK (stage_number BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  prompt_user TEXT NOT NULL,
  focus_icare TEXT[] NOT NULL,
  objective TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 125,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);

COMMENT ON TABLE stations_config IS 'Configuration des 12 stations du parcours (référence métier)';

-- =====================================================
-- INSERT: Les 12 stations JobSeek
-- =====================================================
INSERT INTO stations_config (stage_number, title, prompt_user, focus_icare, objective, order_index) VALUES
(1, 
 'Votre situation professionnelle actuelle',
 'Décrivez votre poste actuel (ou dernier poste) et ce qui ne vous convient plus. Soyez concret : missions, environnement, ce qui vous frustre.',
 ARRAY['identite'],
 'Diagnostic de départ',
 1),

(2,
 'Pourquoi changer maintenant ?',
 'Qu''est-ce qui vous pousse à envisager une transition ? Quels sont vos déclencheurs (événement, ras-le-bol, aspiration nouvelle) ?',
 ARRAY['identite', 'estime'],
 'Valider l''intention',
 2),

(3,
 'Vos freins au changement',
 'Quelles peurs vous empêchent d''agir ? (peur financière, peur du jugement, peur de l''échec, besoin de sécurité...)',
 ARRAY['risque', 'estime'],
 'Identifier les blocages',
 3),

(4,
 'Vos ressources disponibles',
 'Qui peut vous aider ? Quelles compétences possédez-vous déjà ? Quelles formations, réseaux, ou outils avez-vous à disposition ?',
 ARRAY['capacites', 'appartenance'],
 'Inventaire des atouts',
 4),

(5,
 'Votre premier engagement',
 'Quel est le premier acte concret que vous allez poser cette semaine ? (mise à jour CV, appel réseau, formation, candidature test...)',
 ARRAY['identite', 'risque'],
 'Passage à l''action',
 5),

(6,
 'Votre écosystème professionnel',
 'Listez 3 personnes qui vous soutiennent vraiment ET 3 obstacles récurrents (procrastination, perfectionnisme, manque de réseau...)',
 ARRAY['capacites', 'appartenance', 'estime'],
 'Cartographie sociale',
 6),

(7,
 'Votre stratégie de recherche',
 'Quel type de poste visez-vous ? Dans quel secteur ? Avec quels critères non-négociables (salaire, lieu, horaires, missions) ?',
 ARRAY['identite', 'capacites'],
 'Définir la cible',
 7),

(8,
 'Votre plus grande peur professionnelle',
 'Quelle est LA peur qui vous paralyse le plus ? (syndrome de l''imposteur, peur du rejet, peur de la précarité...) Qu''est-ce qui serait le pire qui pourrait arriver ?',
 ARRAY['identite', 'risque', 'estime'],
 'Affronter le blocage principal',
 8),

(9,
 'Vos premiers résultats',
 'Depuis le début de ce parcours, quels résultats avez-vous obtenus ? (candidatures envoyées, entretiens, nouvelles compétences acquises, confiance retrouvée...)',
 ARRAY['identite', 'capacites', 'appartenance'],
 'Ancrer les gains',
 9),

(10,
 'Comment tenir sur la durée',
 'Comment allez-vous maintenir votre motivation si la recherche prend du temps ? Quelles routines mettre en place ?',
 ARRAY['risque', 'identite'],
 'Résilience',
 10),

(11,
 'Votre nouveau positionnement',
 'En une phrase, qui êtes-vous professionnellement maintenant ? Quel est votre pitch en 30 secondes ?',
 ARRAY['identite', 'appartenance'],
 'Affirmation identitaire',
 11),

(12,
 'Votre plan d''action 90 jours',
 'Listez 5 actions concrètes que vous allez mener dans les 90 prochains jours. Soyez précis et mesurable.',
 ARRAY['appartenance'],
 'Plan d''action structuré',
 12);

-- =====================================================
-- TABLE: plan_types
-- Description: Configuration des types d'abonnement
-- =====================================================
CREATE TABLE IF NOT EXISTS plan_types (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL CHECK (code IN ('free', 'pro', 'enterprise')),
  name TEXT NOT NULL,
  credits_included INTEGER NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL
);

COMMENT ON TABLE plan_types IS 'Configuration des plans d''abonnement';

-- =====================================================
-- INSERT: Plans d'abonnement
-- =====================================================
INSERT INTO plan_types (code, name, credits_included, price_monthly, price_yearly, features, display_order) VALUES
('free', 
 'Gratuit', 
 5, 
 0.00, 
 0.00,
 '["1 parcours complet", "Profil ICARE basique", "Export PDF synthèse"]'::jsonb,
 1),

('pro',
 'Pro',
 50,
 29.00,
 290.00,
 '["Parcours illimités", "Profil ICARE détaillé", "Export PDF + Word", "Support prioritaire", "Accès webinaires"]'::jsonb,
 2),

('enterprise',
 'Enterprise',
 999999,
 99.00,
 990.00,
 '["Tout illimité", "Coaching personnalisé", "API access", "Branding personnalisé", "Support dédié"]'::jsonb,
 3);

-- =====================================================
-- Vue pour récupérer une station complète
-- =====================================================
CREATE OR REPLACE VIEW stations_full AS
SELECT 
  stage_number,
  title,
  prompt_user,
  focus_icare,
  objective,
  xp_reward,
  order_index
FROM stations_config
WHERE is_active = true
ORDER BY order_index;

COMMENT ON VIEW stations_full IS 'Vue des stations actives ordonnées';

-- =====================================================
-- FIN DES DONNÉES DE RÉFÉRENCE
-- =====================================================
