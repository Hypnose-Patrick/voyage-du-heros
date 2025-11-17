/**
 * ProgressBar Component - Visual progress indicator
 * Shows completion across all 12 stations
 */

import React from 'react';
import { useJourneyStore } from '../../store/journeyStore';

interface ProgressBarProps {
  className?: string;
  showLabel?: boolean;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className = '',
  showLabel = true,
  showPercentage = true,
}) => {
  const { completedStations, currentStation } = useJourneyStore();
  const completed = completedStations.length;
  const percentage = Math.round((completed / 12) * 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progression du Voyage
          </span>
          {showPercentage && (
            <span className="text-sm font-semibold text-blue-600">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>

      {/* Station count */}
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{completed} stations complétées</span>
          <span>Station {currentStation}/12</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
