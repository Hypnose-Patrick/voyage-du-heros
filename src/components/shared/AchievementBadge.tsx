/**
 * Composant Badge d'Accomplissement
 * Affiche les badges gagnés lors de la progression
 */

import { motion, AnimatePresence } from 'framer-motion';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  showDetails?: boolean;
}

export default function AchievementBadge({ achievement, showDetails = false }: AchievementBadgeProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50',
  };

  return (
    <motion.div
      whileHover={achievement.unlocked ? { scale: 1.05, y: -5 } : {}}
      className={`relative ${achievement.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <div
        className={`
          relative rounded-xl p-4 border-2 transition-all duration-300
          ${achievement.unlocked
            ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} border-white/30 shadow-lg ${rarityGlow[achievement.rarity]}`
            : 'bg-gray-800/50 border-gray-700 opacity-40'
          }
        `}
      >
        {/* Badge Icon */}
        <div className="text-center">
          <div className={`text-5xl mb-2 ${!achievement.unlocked && 'grayscale'}`}>
            {achievement.emoji}
          </div>

          {achievement.unlocked && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
              ✓
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className={`text-sm font-bold text-center mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
          {achievement.unlocked ? achievement.title : '???'}
        </h4>

        {/* Description (if shown) */}
        <AnimatePresence>
          {showDetails && achievement.unlocked && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-white/80 text-center mt-2"
            >
              {achievement.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Locked overlay */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
            <div className="text-3xl">🔒</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
