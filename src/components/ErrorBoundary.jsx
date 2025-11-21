import React from 'react';

/**
 * ErrorBoundary - Composant pour capturer les erreurs React et afficher un message d'erreur
 * au lieu d'un écran blanc
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.state = {
      hasError: true,
      error,
      errorInfo
    };
  }

  handleReset = () => {
    // Effacer le localStorage pour redémarrer proprement
    try {
      localStorage.removeItem('voyage-du-heros');
      localStorage.removeItem('voyage-du-heros-profile');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }

    // Recharger la page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Oups ! Une erreur s'est produite
              </h1>
              <p className="text-white/70 mb-6">
                L'application a rencontré un problème inattendu.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-white/90 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                🔄 Réinitialiser l'application
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition"
              >
                ↻ Recharger la page
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                Si le problème persiste, essayez de vider le cache de votre navigateur.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
