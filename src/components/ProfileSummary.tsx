/**
 * Composant d'affichage du profil utilisateur complet
 * Affiche l'archétype, le totem, l'élément et les scores I.C.A.R.E.
 */

import { motion } from 'framer-motion';
import { useProfileStore, useSymbolicProfiles, useICARE, useProgression } from '../store/profileStore';

interface ProfileSummaryProps {
  onClose?: () => void;
}

export default function ProfileSummary({ onClose }: ProfileSummaryProps) {
  const { archetype, totem, element } = useSymbolicProfiles();
  const { scores, profile: icareProfile } = useICARE();
  const { level, totalXP, completion } = useProgression();
  const { getProfileSummary, getRecommendations } = useProfileStore();

  const recommendations = getRecommendations();

  // Si le profil n'est pas encore assez complet
  if (!archetype || !totem || !element) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-3xl font-bold mb-4">Profil en Construction</h2>
            <p className="text-white/80 mb-6">
              Continue ton voyage pour révéler ton identité héroïque.
              Complète au moins 3 stations pour voir ton profil émerger.
            </p>
            <div className="w-full bg-white/20 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-white/60">{Math.round(completion)}% du parcours</p>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                Retour au parcours
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto py-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-8xl mb-4"
          >
            {totem.totem.split(' ')[0]}
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white">
            Ton Identité Héroïque
          </h1>
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 rounded-full">
            <p className="text-white font-bold">
              Niveau {level} - {totalXP} XP
            </p>
          </div>
        </div>

        {/* Profils Symboliques */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Archétype */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-2 text-gradient">🎭 Archétype</h3>
            <p className="text-3xl font-bold mb-3">{archetype.dominant}</p>
            <p className="text-white/80 text-sm mb-4">{archetype.message}</p>
            <div className="space-y-1">
              {archetype.traits.map((trait, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white/70">{trait}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Totem */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-2 text-gradient">🦅 Animal Totem</h3>
            <p className="text-3xl font-bold mb-3">{totem.totem}</p>
            <p className="text-white/80 text-sm mb-4">{totem.message}</p>
            <div className="space-y-1">
              {totem.traits.map((trait, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span className="text-white/70">{trait}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Élément */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-2 text-gradient">
              {element.dominant === 'Feu' && '🔥'}
              {element.dominant === 'Eau' && '🌊'}
              {element.dominant === 'Air' && '💨'}
              {element.dominant === 'Terre' && '🌍'}
              {' '}Élément
            </h3>
            <p className="text-3xl font-bold mb-3">{element.dominant}</p>
            <p className="text-white/80 text-sm whitespace-pre-line">
              {element.description}
            </p>
          </motion.div>
        </div>

        {/* Profil I.C.A.R.E. */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-6">📊 Ton Profil I.C.A.R.E.</h2>

          {icareProfile && (
            <div className="mb-6 p-4 bg-white/10 rounded-lg">
              <p className="text-white/90 whitespace-pre-line">{icareProfile.description}</p>
            </div>
          )}

          {/* Barres de scores */}
          <div className="space-y-4">
            {Object.entries(scores).map(([dimension, score]) => {
              const colors = {
                Identité: 'from-blue-500 to-indigo-500',
                Capacités: 'from-orange-500 to-amber-500',
                Appartenance: 'from-green-500 to-emerald-500',
                Risque: 'from-red-500 to-rose-500',
                Estime: 'from-purple-500 to-violet-500',
              };

              return (
                <div key={dimension}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{dimension}</span>
                    <span className="text-white/70">{score}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div
                      className={`bg-gradient-to-r ${colors[dimension as keyof typeof colors]} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommandations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">💡 Tes Prochaines Actions</h2>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start p-4 bg-white/10 rounded-lg">
                  <span className="text-2xl mr-3">{index + 1}.</span>
                  <p className="text-white/90 flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {onClose && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition"
            >
              Retour au parcours
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
