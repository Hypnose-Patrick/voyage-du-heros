/**
 * Carte pour afficher une dimension I.C.A.R.E. avec score et comparaison AVANT/APRÈS
 */

import { motion } from 'framer-motion';
import ICAREProgressBar from './ICAREProgressBar';
import BeforeAfterComparison from './BeforeAfterComparison';
import { ICAREDimension } from '../../types/profile';

interface ICAREDimensionCardProps {
  dimension: ICAREDimension;
  icon: string;
  scoreBefore: number; // 0-10
  scoreAfter: number; // 0-10
  phraseBefore: string;
  phraseAfter: string;
  color: string;
  index: number;
}

const dimensionDescriptions: Record<ICAREDimension, string> = {
  'Identité': 'Qui suis-je au-delà de mes rôles ?',
  'Capacités': 'Quelles sont mes vraies compétences ?',
  'Appartenance': 'Où est ma place dans le monde ?',
  'Risque': 'Qu\'ose-je entreprendre maintenant ?',
  'Estime': 'Quelle est ma valeur intrinsèque ?',
};

export default function ICAREDimensionCard({
  dimension,
  icon,
  scoreBefore,
  scoreAfter,
  phraseBefore,
  phraseAfter,
  color,
  index,
}: ICAREDimensionCardProps) {
  const progression = scoreAfter - scoreBefore;
  const progressionPercent = Math.round((progression / scoreBefore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-white">{dimension}</h3>
            <p className="text-white/60 text-sm">{dimensionDescriptions[dimension]}</p>
          </div>
        </div>

        {/* Indicateur de progression */}
        {progression > 0 && (
          <div className="bg-green-500/20 border border-green-500/40 px-3 py-1 rounded-full">
            <span className="text-green-400 font-semibold text-sm">
              +{progressionPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Scores AVANT/APRÈS */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm uppercase">Avant</span>
            <span className="text-white/80 font-bold">{scoreBefore}/10</span>
          </div>
          <ICAREProgressBar score={scoreBefore} color="from-gray-500 to-gray-600" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm uppercase">Après</span>
            <span className="text-white font-bold">{scoreAfter}/10</span>
          </div>
          <ICAREProgressBar score={scoreAfter} color={color} />
        </div>
      </div>

      {/* Comparaison détaillée */}
      <BeforeAfterComparison
        phraseBefore={phraseBefore}
        phraseAfter={phraseAfter}
      />
    </motion.div>
  );
}
