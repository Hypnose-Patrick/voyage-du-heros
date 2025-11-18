import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stations } from '../data/stationsData';
import Station from './Station';
import ProfileSummary from './ProfileSummary';
import { useProgression } from '../store/profileStore';
import Confetti from './shared/Confetti';
import AchievementBadge from './shared/AchievementBadge';
import { checkAchievements, getAchievementsStatus, getMotivationalMessage } from '../services/achievements';

/**
 * ParcoursHeros Enhanced - Version améliorée avec gamification
 * Gère le parcours complet de transformation en 12 stations avec achievements et effets
 */
const ParcoursHerosEnhanced = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [currentStationId, setCurrentStationId] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [hasViewedProfile, setHasViewedProfile] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState(null);

  // Accès à la progression depuis le store
  const { completedStations: storeCompletedStations, completion: storeCompletion } = useProgression();

  // Sauvegarde automatique dans le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('voyage-du-heros');
    if (savedData) {
      const { level, answers, step, prog, stationId, achievements, viewedProfile } = JSON.parse(savedData);
      setSelectedLevel(level);
      setUserAnswers(answers);
      setCurrentStep(step);
      setProgress(prog);
      setCurrentStationId(stationId || 1);
      setUnlockedAchievements(achievements || []);
      setHasViewedProfile(viewedProfile || false);
    }
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      localStorage.setItem('voyage-du-heros', JSON.stringify({
        level: selectedLevel,
        answers: userAnswers,
        step: currentStep,
        prog: progress,
        stationId: currentStationId,
        achievements: unlockedAchievements,
        viewedProfile: hasViewedProfile
      }));
    }
  }, [selectedLevel, userAnswers, currentStep, progress, currentStationId, unlockedAchievements, hasViewedProfile]);

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
    setCurrentStep('dashboard');
    setProgress(0);
  };

  const handleRestart = () => {
    if (window.confirm('Es-tu sûr(e) de vouloir recommencer ? Toute ta progression sera perdue.')) {
      localStorage.removeItem('voyage-du-heros');
      setCurrentStep('welcome');
      setSelectedLevel(null);
      setUserAnswers({});
      setProgress(0);
      setCurrentStationId(1);
      setUnlockedAchievements([]);
      setHasViewedProfile(false);
      setMotivationalMessage('');
    }
  };

  const handleStationComplete = (stationId, answers) => {
    // Sauvegarder les réponses de cette station
    const stationKey = `station${stationId}`;
    const newAnswers = {
      ...userAnswers,
      [stationKey]: answers
    };
    setUserAnswers(newAnswers);

    // Mettre à jour la progression
    const newProgress = Math.min(((Object.keys(newAnswers).filter(k => k.startsWith('station')).length) / 12) * 100, 100);
    setProgress(newProgress);

    // Afficher les confettis
    setShowConfetti(true);

    // Message motivationnel
    setMotivationalMessage(getMotivationalMessage());

    // Vérifier les nouveaux achievements
    const completedStationIds = Object.keys(newAnswers)
      .filter(key => key.startsWith('station'))
      .map(key => parseInt(key.replace('station', '')));

    const newAchievements = checkAchievements(
      completedStationIds,
      selectedLevel,
      hasViewedProfile,
      newAnswers
    );

    // Afficher les nouveaux achievements débloqués
    if (newAchievements.length > 0) {
      const newAchievementIds = newAchievements.map(a => a.id);
      const trulyNewAchievements = newAchievementIds.filter(id => !unlockedAchievements.includes(id));

      if (trulyNewAchievements.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...trulyNewAchievements]);
        setNewAchievementUnlocked(newAchievements[0]); // Montrer le premier achievement
        setTimeout(() => setNewAchievementUnlocked(null), 4000);
      }
    }

    // Retourner au dashboard après un délai
    setTimeout(() => {
      setCurrentStep('dashboard');
      setShowConfetti(false);
    }, 2000);
  };

  const handleStartStation = (stationId) => {
    setCurrentStationId(stationId);
    setCurrentStep('station');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleViewProfile = () => {
    setHasViewedProfile(true);
    setCurrentStep('profile');
  };

  const currentStation = stations.find(s => s.id === currentStationId);
  const completedStations = Object.keys(userAnswers).filter(key => key.startsWith('station')).length;
  const allAchievements = getAchievementsStatus(
    Object.keys(userAnswers)
      .filter(key => key.startsWith('station'))
      .map(key => parseInt(key.replace('station', ''))),
    selectedLevel || 'explorateur',
    hasViewedProfile,
    userAnswers,
    unlockedAchievements
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      {/* Confetti Effect */}
      <Confetti active={showConfetti} />

      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievementUnlocked && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-20 right-4 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 shadow-2xl border-2 border-yellow-300">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{newAchievementUnlocked.emoji}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-yellow-100 mb-1">🎉 Achievement Débloqué !</div>
                  <h4 className="text-xl font-bold text-white mb-1">{newAchievementUnlocked.title}</h4>
                  <p className="text-sm text-yellow-50">{newAchievementUnlocked.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Message */}
      <AnimatePresence>
        {motivationalMessage && currentStep === 'dashboard' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg">
              <p className="font-semibold">{motivationalMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                { icon: '🏆', text: 'Achievements' }
              ].map((feature, index) => (
                <div key={index} className="card p-4">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <div className="text-white/80 font-semibold">{feature.text}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl w-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-white">
                🗺️ Ton Parcours du Héros
              </h2>
              <p className="text-white/70 mb-2">
                Niveau : <span className="text-gradient font-bold">
                  {levels.find(l => l.id === selectedLevel)?.title}
                </span>
              </p>
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>{completedStations} / 12 stations complétées</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    {progress > 0 && (
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="flex gap-4 justify-center mt-4">
                <button onClick={handleRestart} className="text-white/60 hover:text-white transition">
                  ← Changer de niveau
                </button>
                {completedStations >= 3 && (
                  <button
                    onClick={handleViewProfile}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    🎭 Voir mon profil
                  </button>
                )}
                {unlockedAchievements.length > 0 && (
                  <button
                    onClick={() => setCurrentStep('achievements')}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    🏆 Achievements ({unlockedAchievements.length})
                  </button>
                )}
              </div>
            </div>

            {/* Phases */}
            {['depart', 'initiation', 'retour'].map((phase) => {
              const phaseStations = stations.filter(s => s.phase === phase);
              const phaseName = phase === 'depart' ? 'Phase 1 : Le Départ' :
                                phase === 'initiation' ? 'Phase 2 : L\'Initiation' :
                                'Phase 3 : Le Retour';
              const phaseColor = phase === 'depart' ? 'from-blue-500 to-cyan-500' :
                                 phase === 'initiation' ? 'from-orange-500 to-red-500' :
                                 'from-purple-500 to-pink-500';

              return (
                <div key={phase} className="mb-12">
                  <div className={`inline-block bg-gradient-to-r ${phaseColor} px-6 py-2 rounded-full mb-6`}>
                    <h3 className="text-xl font-bold text-white">{phaseName}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {phaseStations.map((station, index) => {
                      const isCompleted = userAnswers[`station${station.id}`];
                      const isLocked = station.id > 1 && !userAnswers[`station${station.id - 1}`];

                      return (
                        <motion.div
                          key={station.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                          className={`${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={() => !isLocked && handleStartStation(station.id)}
                        >
                          <div className={`card bg-gradient-to-br ${station.color} p-1 h-full relative overflow-hidden`}>
                            {isCompleted && (
                              <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                                <div className="absolute top-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                  ✓
                                </div>
                              </div>
                            )}
                            <div className="bg-slate-900/90 rounded-lg p-6 h-full flex flex-col">
                              <div className="flex items-start justify-between mb-3">
                                <div className="text-5xl">{station.emoji}</div>
                                {isLocked && (
                                  <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                                    🔒 Verrouillé
                                  </div>
                                )}
                              </div>

                              <h4 className="text-xl font-bold text-white mb-2">
                                Station {station.id}: {station.title}
                              </h4>
                              <p className="text-white/70 text-sm mb-4 flex-1">
                                {station.subtitle}
                              </p>

                              <div className="space-y-2">
                                <div className="text-white/60 text-sm">
                                  ⏱️ {station.duration}
                                </div>
                                {!isLocked && (
                                  <button
                                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-semibold"
                                  >
                                    {isCompleted ? '🔄 Refaire' : '▶️ Commencer'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {currentStep === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-6xl w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-white">
                🏆 Tes Achievements
              </h2>
              <p className="text-white/70">
                {unlockedAchievements.length} / {allAchievements.length} débloqués
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {allAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  showDetails={achievement.unlocked}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition"
              >
                Retour au parcours
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'station' && currentStation && (
          <Station
            key={currentStation.id}
            station={currentStation}
            level={selectedLevel}
            onComplete={(answers) => handleStationComplete(currentStation.id, answers)}
            onBack={handleBackToDashboard}
          />
        )}

        {currentStep === 'profile' && (
          <ProfileSummary
            key="profile"
            onClose={() => setCurrentStep('dashboard')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParcoursHerosEnhanced;
