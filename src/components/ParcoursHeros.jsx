import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ParcoursHeros - Composant principal du Voyage du Héros
 * Gère le parcours complet de transformation en 12 stations
 */
const ParcoursHeros = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [progress, setProgress] = useState(0);

  // Sauvegarde automatique dans le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('voyage-du-heros');
    if (savedData) {
      const { level, answers, step, prog } = JSON.parse(savedData);
      setSelectedLevel(level);
      setUserAnswers(answers);
      setCurrentStep(step);
      setProgress(prog);
    }
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      localStorage.setItem('voyage-du-heros', JSON.stringify({
        level: selectedLevel,
        answers: userAnswers,
        step: currentStep,
        prog: progress
      }));
    }
  }, [selectedLevel, userAnswers, currentStep, progress]);

  const levels = [
    {
      id: 'explorateur',
      title: '🚀 Explorateur Rapide',
      duration: '10 min',
      questions: 1,
      description: 'Un aperçu rapide de ton profil professionnel',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'chercheur',
      title: '🔍 Chercheur Curieux',
      duration: '20 min',
      questions: 3,
      description: 'Une exploration approfondie de tes méta-programmes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'plongeur',
      title: '🌊 Plongeur Profond',
      duration: '40 min',
      questions: 5,
      description: 'Une transformation complète et détaillée',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const handleLevelSelection = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentStep('journey');
    setProgress(0);
  };

  const handleRestart = () => {
    localStorage.removeItem('voyage-du-heros');
    setCurrentStep('welcome');
    setSelectedLevel(null);
    setUserAnswers({});
    setProgress(0);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl w-full"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6 text-gradient"
              >
                🌟 Voyage du Héros
              </motion.h1>
              <motion.p
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl text-white/80 mb-4"
              >
                Découvre ton profil professionnel en 12 stations
              </motion.p>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/60 max-w-2xl mx-auto"
              >
                Un parcours de transformation basé sur les méta-programmes PNL
                et le modèle du Hero&apos;s Journey de Joseph Campbell
              </motion.p>
            </div>

            {/* Level Selection */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {levels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="cursor-pointer"
                  onClick={() => handleLevelSelection(level.id)}
                >
                  <div className={`card hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${level.color} p-1`}>
                    <div className="bg-slate-900/90 rounded-lg p-6 h-full">
                      <h3 className="text-2xl font-bold mb-3 text-white">
                        {level.title}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-white/70">
                          ⏱️ Durée : <span className="font-semibold">{level.duration}</span>
                        </p>
                        <p className="text-white/70">
                          📝 Questions : <span className="font-semibold">{level.questions}/station</span>
                        </p>
                      </div>
                      <p className="text-white/60 text-sm mb-4">
                        {level.description}
                      </p>
                      <button className="w-full btn-primary">
                        Commencer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-4 gap-4 text-center"
            >
              {[
                { icon: '🗺️', text: '12 Stations' },
                { icon: '🎯', text: 'Profil Personnalisé' },
                { icon: '💾', text: 'Sauvegarde Auto' },
                { icon: '🎬', text: 'Résultats Visuels' }
              ].map((feature, index) => (
                <div key={index} className="card p-4">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <div className="text-white/80 font-semibold">{feature.text}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'journey' && (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl w-full"
          >
            <div className="card p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                🚀 Ton Voyage Commence...
              </h2>
              <p className="text-white/70 mb-6">
                Tu as choisi le niveau : <span className="text-gradient font-bold">
                  {levels.find(l => l.id === selectedLevel)?.title}
                </span>
              </p>
              <div className="space-y-4">
                <p className="text-white/60">
                  Les 12 stations du parcours seront bientôt disponibles.
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleRestart} className="btn-secondary">
                    ← Retour au choix du niveau
                  </button>
                  <button className="btn-primary" disabled>
                    Continuer (Prochainement)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParcoursHeros;
