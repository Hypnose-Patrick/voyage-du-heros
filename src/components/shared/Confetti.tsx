/**
 * Composant Confetti pour célébrer les accomplissements
 * Affiche des confettis animés lors de la complétion de stations
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  delay: number;
}

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
      const newPieces: ConfettiPiece[] = [];

      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          delay: Math.random() * 0.3,
        });
      }

      setPieces(newPieces);

      // Clear après l'animation
      const timeout = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            top: '-20px',
          }}
          initial={{
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: 2.5,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
