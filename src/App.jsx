import React from 'react';
import ParcoursHeros from './components/ParcoursHeros';

/**
 * App - Composant racine de l'application Voyage du Héros
 * Fournit le conteneur principal avec le fond dégradé
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParcoursHeros />
    </div>
  );
}

export default App;
