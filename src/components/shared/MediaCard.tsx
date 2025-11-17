/**
 * MediaCard Component - Card for displaying video/audio content
 * Design: Nautical "Stitch" theme with media preview
 */

import React, { useState } from 'react';

interface MediaCardProps {
  type: 'video' | 'audio' | 'document';
  title: string;
  description?: string;
  icon?: string;
  url?: string;
  duration?: string;
  className?: string;
  onPlay?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  type,
  title,
  description,
  icon,
  url,
  duration,
  className = '',
  onPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'video':
        return '📹';
      case 'audio':
        return '🎧';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'video':
        return 'Vidéo';
      case 'audio':
        return 'Audio';
      case 'document':
        return 'Document';
      default:
        return 'Média';
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.();
  };

  return (
    <div
      className={`
        bg-gradient-to-br from-blue-50 to-cyan-50
        rounded-xl p-4 border-2 border-blue-200
        hover:border-blue-300 transition-all
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {getTypeLabel()}
            </span>
            {duration && (
              <span className="text-xs text-gray-500">⏱️ {duration}</span>
            )}
          </div>
          <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {url && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handlePlay}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Lire
              </>
            )}
          </button>

          {type === 'document' && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Coming soon indicator */}
      {!url && (
        <div className="mt-3 text-center py-2 bg-gray-100 rounded-lg">
          <span className="text-xs text-gray-500 font-medium">
            📦 Bientôt disponible
          </span>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
