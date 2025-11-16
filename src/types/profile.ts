/**
 * Types pour le système de profil utilisateur
 * Basé sur la spécification complète du Parcours du Héros
 */

// ==========================================
// I.C.A.R.E. - 5 Dimensions de Blocage
// ==========================================

export type ICAREDimension = 'Identité' | 'Capacités' | 'Appartenance' | 'Risque' | 'Estime';

export interface ICAREScores {
  Identité: number;      // 0-100
  Capacités: number;     // 0-100
  Appartenance: number;  // 0-100
  Risque: number;        // 0-100
  Estime: number;        // 0-100
}

export interface ICAREProfile {
  type: 'dominant' | 'mixte';
  dimension?: ICAREDimension;      // Si type === 'dominant'
  dimensions?: ICAREDimension[];   // Si type === 'mixte' (2 dimensions)
  score: number;
  description: string;
}

// ==========================================
// Méta-Programmes - 17 Filtres Perceptuels
// ==========================================

export interface OrientationMotivation {
  vers: number;       // 0-100
  evitement: number;  // 0-100
}

export interface Reference {
  interne: number;    // 0-100
  externe: number;    // 0-100
}

export type Proactivite = 'proactif_fort' | 'proactif' | 'equilibre' | 'reactif' | 'reactif_fort';
export type TailleDecoupage = 'global' | 'equilibre' | 'specifique';
export type TriPrimaire = 'personnes' | 'taches' | 'informations' | 'lieux';
export type OrientationTemps = 'passe' | 'present' | 'futur';
export type Raisonnement = 'inductif' | 'deductif' | 'abductif';
export type FacteursDecision = 'options' | 'procedures';
export type ModeRelation = 'concordance' | 'difference';
export type StructureTemps = 'automatique' | 'coherent' | 'periodique';
export type PositionPerception = 'associe' | 'dissocie';
export type CanalConviction = 'voir' | 'entendre' | 'lire' | 'faire';
export type ModeComparaison = 'quantitatif' | 'qualitatif';
export type SourceMotivation = 'interne' | 'externe';
export type PlacementAttention = 'soi' | 'autres';
export type StyleAction = 'reflexion' | 'action';
export type CadreTravail = 'structure' | 'flexibilite';

export interface MetaProgrammes {
  orientationMotivation: OrientationMotivation;
  reference: Reference;
  proactivite: Proactivite;
  tailleDecoupage: TailleDecoupage;
  triPrimaire: TriPrimaire;
  orientationTemps: OrientationTemps;
  raisonnement: Raisonnement;
  facteursDecision: FacteursDecision;
  modeRelation: ModeRelation;
  structureTemps: StructureTemps;
  positionPerception: PositionPerception;
  canalConviction: CanalConviction[];  // Peut en avoir plusieurs
  modeComparaison: ModeComparaison;
  sourceMotivation: SourceMotivation;
  placementAttention: PlacementAttention;
  styleAction: StyleAction;
  cadreTravail: CadreTravail;
}

// ==========================================
// Archétypes
// ==========================================

export type Archetype = 'Explorateur' | 'Guerrier' | 'Sage' | 'Créateur' | 'Souverain' | 'Magicien';

export interface ArchetypeProfile {
  dominant: Archetype;
  scores: Record<Archetype, number>;
  traits: string[];
  message: string;
}

// ==========================================
// Animal Totem
// ==========================================

export type AnimalTotem =
  | '🦅 Aigle'
  | '🐺 Loup'
  | '🦉 Chouette'
  | '🦋 Papillon'
  | '🦁 Lion'
  | '🐉 Dragon';

export interface TotemProfile {
  totem: AnimalTotem;
  traits: string[];
  message: string;
}

// ==========================================
// Élément Dominant
// ==========================================

export type Element = 'Feu' | 'Eau' | 'Air' | 'Terre';

export interface ElementProfile {
  dominant: Element;
  scores: Record<Element, number>;
  description: string;
}

// ==========================================
// Désirs Universels
// ==========================================

export type DesirUniversel =
  | '💕 Aimer et être aimé'
  | '👁️ Être compris'
  | '⚡ Avoir du pouvoir'
  | '🎯 Recevoir de l\'attention'
  | '🦋 Être libre'
  | '🎨 Créer'
  | '🤝 Appartenir'
  | '🏆 Gagner'
  | '💫 Se connecter'
  | '🎛️ Contrôler';

export interface DesirsProfile {
  dominant1: DesirUniversel;
  dominant2: DesirUniversel;
  conflits: string[];
}

// ==========================================
// Niveaux Logiques
// ==========================================

export interface NiveauxLogiques {
  environnement: string[];
  comportements: string[];
  capacites: string[];
  croyances: string[];
  valeurs: string[];
  identite: string;
  transpersonnel: string;
}

// ==========================================
// Profil Complet
// ==========================================

export interface UserProfile {
  // Méta-données
  userId?: string;
  journeyId?: string;
  startedAt?: string;
  completedAt?: string;
  currentStation: number;
  completedStations: number[];

  // Profils calculés
  metaProgrammes: Partial<MetaProgrammes>;
  icare: ICAREScores;
  icareProfile?: ICAREProfile;
  archetype?: ArchetypeProfile;
  totem?: TotemProfile;
  element?: ElementProfile;
  desirs?: DesirsProfile;
  niveauxLogiques?: NiveauxLogiques;

  // Progression
  totalXP: number;
  level: number;
  completion: number;

  // Recommandations (à calculer plus tard)
  careerPaths?: Array<{
    title: string;
    match: number;
    reasoning: string;
  }>;
}

// ==========================================
// Réponses aux questions
// ==========================================

export interface QuestionResponse {
  stationId: number;
  questionId: string;
  value: any;
  timestamp: string;
}

export interface StationAnswers {
  [questionKey: string]: string | number | string[];
}
