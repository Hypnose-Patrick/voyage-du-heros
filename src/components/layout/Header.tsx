/**
 * Header Component - Mobile-first header with navigation
 * Design: Nautical "Stitch" theme
 */

import React from 'react';
import { useJourneyStore } from '../../store/journeyStore';

interface HeaderProps {
  emoji?: string;
  title?: string;
  showProgress?: boolean;
  onBack?: () => void;
  onPause?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  emoji = '⚓',
  title = 'Voyage du Héros',
  showProgress = false,
  onBack,
  onPause,
}) => {
  const { currentStation, getProgress } = useJourneyStore();
  const progress = getProgress();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Retour"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Title */}
          <div className="flex-1 text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <h1 className="text-sm font-semibold text-gray-700">{title}</h1>
          </div>

          {/* Pause button */}
          {onPause && (
            <button
              onClick={onPause}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Pause"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Station {currentStation}/12</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
