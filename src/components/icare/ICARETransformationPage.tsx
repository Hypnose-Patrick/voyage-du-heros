/**
 * PAGE 3 - Synthèse Transformation I.C.A.R.E.
 * Affiche la transformation complète de l'utilisateur sur les 5 dimensions
 */

import { motion } from 'framer-motion';
import ICAREDimensionCard from './ICAREDimensionCard';
import DownloadPDFButton from './DownloadPDFButton';
import { ICAREDimension } from '../../types/profile';

interface ICAREDimensionData {
  dimension: ICAREDimension;
  icon: string;
  scoreBefore: number;
  scoreAfter: number;
  phraseBefore: string;
  phraseAfter: string;
  color: string;
}

interface ICARETransformationPageProps {
  userName: string;
  journeyDuration: string; // ex: "3 mois"
  totalProgression: number; // ex: 115 (%)
  dimensions: ICAREDimensionData[];
  insights?: string[];
  recommendations?: string[];
}

export default function ICARETransformationPage({
  userName,
  journeyDuration,
  totalProgression,
  dimensions,
  insights = [],
  recommendations = [],
}: ICARETransformationPageProps) {
  const averageScoreBefore =
    dimensions.reduce((sum, d) => sum + d.scoreBefore, 0) / dimensions.length;
  const averageScoreAfter =
    dimensions.reduce((sum, d) => sum + d.scoreAfter, 0) / dimensions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-purple-500/20 border border-purple-500/40 px-4 py-2 rounded-full mb-4">
            <span className="text-purple-300 text-sm font-semibold">PAGE 3/18</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Synthèse Transformation I.C.A.R.E.
          </h1>

          <p className="text-white/80 text-xl max-w-3xl mx-auto mb-6">
            Découvre comment tu as évolué sur les 5 dimensions fondamentales
            de ton développement professionnel
          </p>

          {/* Stats globales */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
              <div className="text-3xl font-bold text-white">+{totalProgression}%</div>
              <div className="text-white/60 text-sm">Progression globale</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
              <div className="text-3xl font-bold text-white">{journeyDuration}</div>
              <div className="text-white/60 text-sm">Durée du parcours</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
              <div className="text-3xl font-bold text-white">
                {averageScoreAfter.toFixed(1)}/10
              </div>
              <div className="text-white/60 text-sm">Score moyen actuel</div>
            </div>
          </div>
        </motion.div>

        {/* Citation inspirante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-l-4 border-indigo-500 rounded-lg p-6">
            <p className="text-white/90 text-lg italic text-center">
              "Le voyage du héros n'est pas de conquérir le monde extérieur,
              mais de transformer son monde intérieur."
            </p>
            <p className="text-white/60 text-sm text-center mt-2">- Voyage du Héros</p>
          </div>
        </motion.div>

        {/* Dimensions I.C.A.R.E. */}
        <div className="space-y-6 mb-12">
          {dimensions.map((dimensionData, index) => (
            <ICAREDimensionCard
              key={dimensionData.dimension}
              {...dimensionData}
              index={index}
            />
          ))}
        </div>

        {/* Insights personnalisés */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>💡</span>
              Insights Personnalisés
            </h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
                >
                  <span className="text-2xl font-bold text-purple-400">
                    {index + 1}.
                  </span>
                  <p className="text-white/80 flex-1 leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommandations 6 mois */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🎯</span>
              Recommandations pour les 6 prochains mois
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message final personnalisé */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-2xl p-8 text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Félicitations, {userName} ! 🎉
          </h3>
          <p className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
            En {journeyDuration}, tu as progressé de{' '}
            <span className="font-bold text-purple-300">+{totalProgression}%</span>.
            Cette transformation témoigne de ton engagement et de ta capacité à
            évoluer. Continue sur cette voie, chaque pas compte dans ton voyage
            héroïque.
          </p>
        </motion.div>

        {/* Bouton téléchargement PDF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <DownloadPDFButton
            userName={userName}
            journeyDuration={journeyDuration}
            totalProgression={totalProgression}
            dimensions={dimensions}
            insights={insights}
            recommendations={recommendations}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
