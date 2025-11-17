/**
 * LogEntry Component - Captain's log journal entry
 * For users to write reflections and answers
 */

import React, { useState, useEffect } from 'react';

interface LogEntryProps {
  questionId: string;
  question: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  minHeight?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
}

export const LogEntry: React.FC<LogEntryProps> = ({
  questionId,
  question,
  placeholder = 'Commence à écrire...',
  value = '',
  onChange,
  onSave,
  minHeight = '120px',
  maxLength = 2000,
  showCharCount = true,
  autoSave = true,
  autoSaveDelay = 2000,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save timer
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [localValue, autoSave, autoSaveDelay, hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setHasUnsavedChanges(true);
    onChange?.(newValue);
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await onSave?.(localValue);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving log entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = localValue.length;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Question */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-gray-800 mb-1">
          📝 {question}
        </h3>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id={questionId}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="
            w-full px-4 py-3
            bg-white border-2 border-gray-200
            rounded-xl
            font-sans text-gray-800
            placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all
            resize-vertical
          "
          style={{ minHeight }}
        />

        {/* Saving indicator */}
        {isSaving && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sauvegarde...
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Character count */}
        {showCharCount && (
          <div className="flex items-center gap-2">
            <span>
              {charCount} / {maxLength} caractères
            </span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  charPercentage > 90
                    ? 'bg-red-500'
                    : charPercentage > 75
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${charPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Save status */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="text-orange-600 font-medium">
              • Modifications non sauvegardées
            </span>
          ) : lastSaved ? (
            <span className="text-green-600">
              ✓ Sauvegardé {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}

          {/* Manual save button */}
          {!autoSave && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="
                px-3 py-1.5 bg-blue-500 text-white rounded-lg
                hover:bg-blue-600
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
                font-medium
              "
            >
              💾 Sauvegarder
            </button>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-900">
          💡 <strong>Conseil:</strong> Sois honnête et authentique. Il n&apos;y a pas de
          &quot;bonne&quot; réponse - ce qui compte, c&apos;est ta réflexion personnelle.
        </p>
      </div>
    </div>
  );
};

export default LogEntry;
