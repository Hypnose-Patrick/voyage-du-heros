/**
 * Composant de comparaison AVANT/APRÈS pour une dimension I.C.A.R.E.
 */

import { motion } from 'framer-motion';

interface BeforeAfterComparisonProps {
  phraseBefore: string;
  phraseAfter: string;
  icon?: string;
}

export default function BeforeAfterComparison({
  phraseBefore,
  phraseAfter,
  icon = '→',
}: BeforeAfterComparisonProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* AVANT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-400 text-sm font-semibold uppercase">Avant</span>
          <span className="text-red-400">🔴</span>
        </div>
        <p className="text-white/80 italic text-sm leading-relaxed">
          "{phraseBefore}"
        </p>
      </motion.div>

      {/* APRÈS */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-400 text-sm font-semibold uppercase">Après</span>
          <span className="text-green-400">🟢</span>
        </div>
        <p className="text-white/80 italic text-sm leading-relaxed">
          "{phraseAfter}"
        </p>
      </motion.div>
    </div>
  );
}
