/**
 * MiniMap Component - Visual map of all 12 stations
 * Shows journey progress with clickable dots
 */

import React from 'react';
import { useJourneyStore } from '../../store/journeyStore';
import { stations } from '../../data/stationsData';

interface MiniMapProps {
  onStationClick?: (stationNumber: number) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const MiniMap: React.FC<MiniMapProps> = ({
  onStationClick,
  className = '',
  size = 'medium',
}) => {
  const { currentStation, completedStations, isStationCompleted } = useJourneyStore();

  const dotSize = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  }[size];

  const getDotColor = (stationNumber: number) => {
    if (isStationCompleted(stationNumber)) {
      return 'bg-green-500 border-green-600';
    }
    if (stationNumber === currentStation) {
      return 'bg-blue-500 border-blue-600 ring-2 ring-blue-300 animate-pulse';
    }
    if (stationNumber < currentStation) {
      return 'bg-gray-300 border-gray-400';
    }
    return 'bg-gray-200 border-gray-300';
  };

  const isClickable = (stationNumber: number) => {
    // Station is clickable if it's completed or current
    return stationNumber <= currentStation;
  };

  return (
    <div className={`${className}`}>
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
        Carte du Voyage
      </h3>

      {/* Map container */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
        {/* Phases */}
        {['depart', 'initiation', 'retour'].map((phase) => {
          const phaseStations = stations.filter((s) => s.phase === phase);
          const phaseName =
            phase === 'depart'
              ? 'Le Départ'
              : phase === 'initiation'
              ? "L'Initiation"
              : 'Le Retour';

          const phaseColor =
            phase === 'depart'
              ? 'text-blue-600'
              : phase === 'initiation'
              ? 'text-orange-600'
              : 'text-purple-600';

          return (
            <div key={phase} className="mb-4 last:mb-0">
              {/* Phase label */}
              <div className={`text-xs font-semibold ${phaseColor} mb-2`}>
                {phaseName}
              </div>

              {/* Stations in phase */}
              <div className="flex items-center justify-start gap-2 flex-wrap">
                {phaseStations.map((station) => {
                  const clickable = isClickable(station.id);

                  return (
                    <button
                      key={station.id}
                      onClick={() => clickable && onStationClick?.(station.id)}
                      disabled={!clickable}
                      className={`
                        relative group
                        ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                      `}
                      title={`Station ${station.id}: ${station.title}`}
                    >
                      {/* Dot */}
                      <div
                        className={`
                          ${dotSize}
                          rounded-full
                          border-2
                          ${getDotColor(station.id)}
                          transition-all
                          ${clickable ? 'hover:scale-125' : ''}
                        `}
                      />

                      {/* Tooltip on hover */}
                      <div
                        className="
                          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                          hidden group-hover:block
                          bg-gray-900 text-white text-xs
                          px-2 py-1 rounded
                          whitespace-nowrap
                          z-10
                        "
                      >
                        <div className="font-semibold">Station {station.id}</div>
                        <div className="text-gray-300">{station.emoji} {station.title}</div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className={`${dotSize} rounded-full bg-green-500 border-2 border-green-600`} />
          <span>Complété</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`${dotSize} rounded-full bg-blue-500 border-2 border-blue-600`} />
          <span>Actuel</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`${dotSize} rounded-full bg-gray-200 border-2 border-gray-300`} />
          <span>À venir</span>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
