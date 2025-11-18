/**
 * Barre de progression visuelle pour les scores I.C.A.R.E.
 * Affiche des barres avec des blocs carrés comme dans l'exemple
 */

import { motion } from 'framer-motion';

interface ICAREProgressBarProps {
  score: number; // 0-10
  maxScore?: number;
  color?: string;
  showBlocks?: boolean;
}

export default function ICAREProgressBar({
  score,
  maxScore = 10,
  color = 'from-blue-500 to-indigo-500',
  showBlocks = true,
}: ICAREProgressBarProps) {
  const filledBlocks = Math.round(score);
  const emptyBlocks = maxScore - filledBlocks;

  if (showBlocks) {
    return (
      <div className="flex gap-1 items-center">
        {/* Blocs remplis */}
        {Array.from({ length: filledBlocks }).map((_, i) => (
          <motion.div
            key={`filled-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-4 h-4 bg-gradient-to-br ${color} rounded-sm`}
          />
        ))}
        {/* Blocs vides */}
        {Array.from({ length: emptyBlocks }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-4 h-4 bg-white/20 rounded-sm"
          />
        ))}
      </div>
    );
  }

  // Version barre lisse pour PDF
  return (
    <div className="w-full bg-white/20 rounded-full h-3">
      <motion.div
        className={`bg-gradient-to-r ${color} h-full rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${(score / maxScore) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
