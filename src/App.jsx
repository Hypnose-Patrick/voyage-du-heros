import React from 'react';
import ParcoursHerosEnhanced from './components/ParcoursHerosEnhanced';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * App - Composant racine de l'application Voyage du Héros
 * Fournit le conteneur principal avec le fond dégradé
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ParcoursHerosEnhanced />
      </div>
    </ErrorBoundary>
  );
}

export default App;
