import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Station as StationType, Exercise } from '../data/stationsData';
import { useProfileStore } from '../store/profileStore';
import PedagogicalContent from './PedagogicalContent';

interface StationProps {
  station: StationType;
  level: 'explorateur' | 'chercheur' | 'plongeur';
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export default function Station({ station, level, onComplete, onBack }: StationProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'pedagogical' | 'instructions' | 'exercise' | 'summary'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Accès au store de profil
  const { updateStationAnswers, completeStation } = useProfileStore();

  // Récupère l'exercice correspondant au niveau
  const exercise = station.exercises.find(ex => ex.level === level);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <p className="text-gray-800">Erreur: Exercice non trouvé pour ce niveau</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = exercise.questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  // Formater le texte markdown pour richContent
  const formatRichContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Titres niveau 2 (##)
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mb-4 mt-6 text-gray-800">
            {line.substring(3)}
          </h2>
        );
      }
      // Titres niveau 3 (###)
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mb-3 mt-5 text-gray-800">
            {line.substring(4)}
          </h3>
        );
      }
      // Gras (**text**)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2 text-gray-700">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
          </p>
        );
      }
      // Liste avec tirets (-)
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-1 text-gray-700">
            {line.trim().substring(2)}
          </li>
        );
      }
      // Checkbox (☐)
      if (line.includes('☐')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-gray-500">☐</span>
            <span className="text-gray-700">{line.replace('☐', '').trim()}</span>
          </div>
        );
      }
      // Checkmark (✅)
      if (line.includes('✅')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span>✅</span>
            <span className="text-gray-700">{line.replace('✅', '').trim()}</span>
          </div>
        );
      }
      // Séparateur (---)
      if (line.trim() === '---') {
        return <hr key={index} className="my-6 border-gray-300" />;
      }
      // Ligne de tableau
      if (line.includes('|')) {
        return (
          <div key={index} className="font-mono text-sm text-gray-600 mb-1">
            {line}
          </div>
        );
      }
      // Paragraphe normal
      if (line.trim()) {
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  const handleAnswer = (answer: string) => {
    const questionKey = `q${currentQuestionIndex}`;
    setAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep('summary');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    // Sauvegarder les réponses dans le store de profil
    updateStationAnswers(station.id, answers);

    // Marquer la station comme complétée
    completeStation(station.id);

    // Callback parent
    onComplete(answers);
  };

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const currentAnswer = answers[`q${currentQuestionIndex}`] || '';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${station.color} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              ← Retour
            </button>
            <span className="text-sm opacity-80">{station.phaseName}</span>
          </div>

          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{station.emoji}</div>
            <h1 className="text-3xl font-bold mb-2">Station {station.id}: {station.title}</h1>
            <p className="text-lg opacity-90">{station.subtitle}</p>
          </div>

          {currentStep === 'exercise' && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Introduction */}
            {currentStep === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenue à cette station</h2>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 text-lg mb-4">{station.description}</p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Objectifs de cette station :</h3>
                  <ul className="space-y-2">
                    {station.objectives.map((obj, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{obj}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {exercise.title} - Niveau {level.charAt(0).toUpperCase() + level.slice(1)}
                    </h4>
                    <p className="text-blue-800 mb-2">{exercise.description}</p>
                    <div className="flex items-center text-sm text-blue-700">
                      <span className="mr-4">⏱️ Durée estimée: {exercise.duration}</span>
                      <span>📝 {totalQuestions} questions</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (station.pedagogicalContent) {
                      setCurrentStep('pedagogical');
                    } else if (exercise.richContent) {
                      setCurrentStep('instructions');
                    } else {
                      setCurrentStep('exercise');
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition"
                >
                  {station.pedagogicalContent ? 'Découvrir le contenu pédagogique' : exercise.richContent ? 'Découvrir les instructions' : 'Commencer l\'exercice'}
                </button>
              </motion.div>
            )}

            {/* Pedagogical Content */}
            {currentStep === 'pedagogical' && station.pedagogicalContent && (
              <PedagogicalContent
                content={station.pedagogicalContent}
                onContinue={() => {
                  if (exercise.richContent) {
                    setCurrentStep('instructions');
                  } else {
                    setCurrentStep('exercise');
                  }
                }}
              />
            )}

            {/* Rich Content Instructions */}
            {currentStep === 'instructions' && exercise.richContent && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    📝 Instructions de l'exercice
                  </h2>
                  <p className="text-gray-600">
                    Prends le temps de lire attentivement ces instructions avant de commencer.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 max-h-[65vh] overflow-y-auto">
                  <div className="prose max-w-none">
                    {formatRichContent(exercise.richContent)}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-900">
                    💡 <strong>Conseil:</strong> Tu peux utiliser une feuille de papier ou un fichier texte pour répondre aux questions pendant l'exercice, puis reporter tes réponses dans l'application.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep('exercise')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition"
                >
                  Commencer l'exercice →
                </button>
              </motion.div>
            )}

            {/* Exercise - Questions */}
            {currentStep === 'exercise' && (
              <motion.div
                key={`question-${currentQuestionIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 min-h-[500px] flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQuestion}
                </h2>

                <div className="flex-1">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Prends le temps de réfléchir et d'écrire ta réponse ici..."
                    className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    💡 Conseil: Sois honnête et authentique. Il n'y a pas de "bonne" réponse.
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Précédent
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Suivant →' : 'Terminer'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Summary */}
            {currentStep === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Félicitations !
                  </h2>
                  <p className="text-lg text-gray-600">
                    Tu as complété la station {station.id}: {station.title}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tes réponses :</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {exercise.questions.map((question, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="font-semibold text-gray-700 mb-2">
                          Question {index + 1}: {question}
                        </p>
                        <p className="text-gray-600 italic">
                          {answers[`q${index}`] || 'Pas de réponse'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-900">
                    💡 <strong>Astuce:</strong> Prends un moment pour relire tes réponses.
                    Quelles prises de conscience as-tu eues ? Note-les quelque part !
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setCurrentStep('exercise');
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Revoir mes réponses
                  </button>

                  <button
                    onClick={handleFinish}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Valider et continuer →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
