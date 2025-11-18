/**
 * Composant de démonstration de la page I.C.A.R.E. Transformation
 * Utilise les données du hook useICARETransformation
 */

import { useICARETransformation } from '../../hooks/useICARETransformation';
import ICARETransformationPage from './ICARETransformationPage';

export default function ICARETransformationDemo() {
  const transformationData = useICARETransformation();

  if (!transformationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-2">Génération de ton profil...</h2>
          <p className="text-white/70">
            Complète au moins 3 stations pour voir ta transformation I.C.A.R.E.
          </p>
        </div>
      </div>
    );
  }

  return <ICARETransformationPage {...transformationData} />;
}
