/**
 * Bouton pour télécharger le PDF du profil I.C.A.R.E.
 */

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ICAREDocument } from '../../pdf';
import { motion } from 'framer-motion';

interface DimensionData {
  dimension: string;
  icon: string;
  scoreBefore: number;
  scoreAfter: number;
  phraseBefore: string;
  phraseAfter: string;
  color: string;
}

interface DownloadPDFButtonProps {
  userName: string;
  journeyDuration: string;
  totalProgression: number;
  dimensions: DimensionData[];
  insights: string[];
  recommendations: string[];
  className?: string;
}

export default function DownloadPDFButton({
  userName,
  journeyDuration,
  totalProgression,
  dimensions,
  insights,
  recommendations,
  className = '',
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const fileName = `Profil-ICARE-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <ICAREDocument
          userName={userName}
          journeyDuration={journeyDuration}
          totalProgression={totalProgression}
          dimensions={dimensions}
          insights={insights}
          recommendations={recommendations}
        />
      }
      fileName={fileName}
      className={className}
    >
      {({ blob, url, loading, error }) => {
        if (error) {
          return (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg font-semibold transition-all flex items-center gap-2"
              disabled
            >
              <span>❌</span>
              <span>Erreur de génération</span>
            </motion.button>
          );
        }

        if (loading) {
          return (
            <motion.button
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-lg font-semibold transition-all flex items-center gap-2"
              disabled
            >
              <span className="animate-spin">⚙️</span>
              <span>Génération du PDF...</span>
            </motion.button>
          );
        }

        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>📄</span>
            <span>Télécharger mon Profil PDF</span>
            <span className="text-sm opacity-80">({Math.round((blob?.size || 0) / 1024)} KB)</span>
          </motion.button>
        );
      }}
    </PDFDownloadLink>
  );
}
