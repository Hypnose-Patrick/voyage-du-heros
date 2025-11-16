/**
 * Composant d'affichage du contenu pédagogique 4MAT
 * WHY > WHAT > HOW > WHAT IF
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PedagogicalContentProps {
  content: {
    why: string;
    what: string;
    how: string;
    whatIf: string;
  };
  onContinue: () => void;
}

export default function PedagogicalContent({ content, onContinue }: PedagogicalContentProps) {
  const [currentSection, setCurrentSection] = useState<'why' | 'what' | 'how' | 'whatIf'>('why');

  const sections = [
    {
      id: 'why' as const,
      emoji: '🔥',
      title: 'WHY - Pourquoi c\'est important',
      subtitle: 'La motivation',
      color: 'from-red-500 to-orange-500',
      duration: '5 min',
    },
    {
      id: 'what' as const,
      emoji: '📖',
      title: 'WHAT - Qu\'est-ce que c\'est',
      subtitle: 'Les concepts',
      color: 'from-blue-500 to-cyan-500',
      duration: '7 min',
    },
    {
      id: 'how' as const,
      emoji: '🛠️',
      title: 'HOW - Comment faire',
      subtitle: 'La pratique',
      color: 'from-green-500 to-emerald-500',
      duration: '6 min',
    },
    {
      id: 'whatIf' as const,
      emoji: '💡',
      title: 'WHAT IF - Et si...',
      subtitle: 'L\'application créative',
      color: 'from-purple-500 to-pink-500',
      duration: '2 min',
    },
  ];

  const currentSectionIndex = sections.findIndex((s) => s.id === currentSection);
  const currentSectionData = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      onContinue();
    } else {
      setCurrentSection(sections[currentSectionIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSection(sections[currentSectionIndex - 1].id);
    }
  };

  // Formater le texte markdown basique
  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Gras
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h3 key={index} className="text-xl font-bold mb-3 mt-6 text-white">
              {line.replace(/\*\*/g, '')}
            </h3>
          );
        }
        // Italique
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return (
            <p key={index} className="italic text-white/70 mb-2">
              {line.replace(/\*/g, '')}
            </p>
          );
        }
        // Liste
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 text-white/90 mb-1">
              {line.substring(2)}
            </li>
          );
        }
        // Paragraphe normal
        if (line.trim()) {
          return (
            <p key={index} className="text-white/90 mb-3 leading-relaxed">
              {line}
            </p>
          );
        }
        return <br key={index} />;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">📚 Contenu Pédagogique</h2>
            <span className="text-white/70">
              Section {currentSectionIndex + 1} / {sections.length}
            </span>
          </div>
          <div className="flex gap-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  index <= currentSectionIndex
                    ? `bg-gradient-to-r ${section.color}`
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Section Header */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${currentSectionData.color} rounded-2xl p-6 mb-6`}
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentSectionData.emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">
                {currentSectionData.title}
              </h1>
              <p className="text-white/90">{currentSectionData.subtitle}</p>
            </div>
            <div className="text-white/80 text-sm">
              ⏱️ {currentSectionData.duration}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={`content-${currentSection}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 max-h-[60vh] overflow-y-auto"
        >
          <div className="prose prose-invert max-w-none">
            {formatText(content[currentSection])}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Précédent
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            {isLastSection ? 'Passer aux exercices →' : 'Suivant →'}
          </button>
        </div>

        {/* Quick Nav */}
        <div className="mt-6 flex justify-center gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                section.id === currentSection
                  ? `bg-gradient-to-r ${section.color} text-white font-semibold`
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {section.emoji} {section.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
