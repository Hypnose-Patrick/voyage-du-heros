import React, { useState, useEffect } from 'react';

// Configuration des 12 stations du Parcours
const STATIONS = [
  {
    id: 1,
    title: "Le Monde Ordinaire",
    icon: "🌍",
    metaProgramme: "orientationMotivation",
    narration: "Tu te tiens au seuil de ta vie actuelle. Derrière toi, des habitudes rassurantes. Devant toi, l'inconnu qui t'appelle. Qu'est-ce qui te met en mouvement ?",
    color: "from-blue-900 to-indigo-900",
    questions: {
      niveau1: [
        {
          question: "Quand tu penses à ton futur professionnel, tu vois avant tout :",
          options: [
            { text: "Les opportunités à saisir", value: "vers", score: 90, insight: "Tu es un Grimpeur" },
            { text: "Les problèmes à éviter", value: "evitement", score: 90, insight: "Tu es un Protecteur" },
            { text: "Un mélange des deux", value: "mixte", score: 50, insight: "Tu es un Équilibriste" }
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: "L'Appel à l'Aventure",
    icon: "📯",
    metaProgramme: "proactivite",
    narration: "Un signal résonne dans ta vie. Peut-être un licenciement, une opportunité, ou simplement cette voix intérieure qui dit 'il est temps'. Entends-tu l'appel ?",
    color: "from-indigo-900 to-purple-900",
    questions: {
      niveau1: [
        {
          question: "Face à un objectif professionnel important, tu as tendance à :",
          options: [
            { text: "Passer à l'action rapidement", value: "proactif", score: 90, insight: "Tu es un Initiateur" },
            { text: "Attendre le bon moment ou un signal", value: "reactif", score: 90, insight: "Tu es un Stratège" },
            { text: "Alterner selon le contexte", value: "mixte", score: 50, insight: "Tu es un Adaptateur" }
          ]
        }
      ]
    }
  },
  {
    id: 3,
    title: "Le Refus de l'Appel",
    icon: "🚫",
    metaProgramme: "reference",
    narration: "Les doutes murmurent. Es-tu vraiment prêt ? Et si tu échouais ? Ces peurs sont normales. Tous les héros les traversent.",
    color: "from-purple-900 to-violet-900",
    questions: {
      niveau1: [
        {
          question: "Pour prendre une décision professionnelle importante, tu te fies surtout à :",
          options: [
            { text: "Mon ressenti et mes convictions", value: "interne", score: 90, insight: "Tu es une Boussole" },
            { text: "L'avis d'experts et de proches", value: "externe", score: 90, insight: "Tu es un Chercheur" },
            { text: "Un équilibre entre les deux", value: "mixte", score: 50, insight: "Tu es un Tisserand" }
          ]
        }
      ]
    }
  }
];

function LevelSelection({ onSelect }) {
  const levels = [
    { level: 1, title: "Explorateur Rapide", icon: "⚡", description: "1 question par station (10 min)", color: "from-green-500 to-emerald-600" },
    { level: 2, title: "Chercheur Curieux", icon: "🔍", description: "2-3 questions par station (20 min)", color: "from-blue-500 to-cyan-600" },
    { level: 3, title: "Plongeur Profond", icon: "🌊", description: "3-5 questions par station (40 min)", color: "from-purple-500 to-pink-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            Le Parcours du Héros
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Un voyage de transformation en 12 stations pour révéler ton profil professionnel profond
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {levels.map(lvl => (
            <button
              key={lvl.level}
              onClick={() => onSelect(lvl.level)}
              className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${lvl.color} opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl`}
            >
              <div className="text-5xl mb-3">{lvl.icon}</div>
              <h3 className="text-xl font-bold mb-2">{lvl.title}</h3>
              <p className="text-white/80 text-sm">{lvl.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-400">
          <p>🔒 Tes réponses sont sauvegardées automatiquement</p>
        </div>
      </div>
    </div>
  );
}

export default function ParcoursHeros() {
  const [currentStation, setCurrentStation] = useState(0);
  const [niveau, setNiveau] = useState(null);
  const [responses, setResponses] = useState({});
  const [showMap, setShowMap] = useState(false);

  const handleLevelSelect = (level) => {
    setNiveau(level);
  };

  const handleAnswer = (stationId, option) => {
    const station = STATIONS[currentStation];
    const newResponses = {
      ...responses,
      ["station" + stationId]: {
        stationId,
        metaProgramme: station.metaProgramme,
        score: { [option.value]: option.score },
        insight: option.insight,
        timestamp: new Date().toISOString()
      }
    };
    setResponses(newResponses);

    // Passer à la station suivante
    if (currentStation < STATIONS.length - 1) {
      setTimeout(() => {
        setCurrentStation(prev => prev + 1);
      }, 500);
    } else {
      alert("Parcours terminé! Profil: " + Object.values(newResponses).map(r => r.insight).join(" / "));
    }
  };

  if (niveau === null) {
    return <LevelSelection onSelect={handleLevelSelect} />;
  }

  const station = STATIONS[currentStation];
  const questions = station.questions["niveau" + niveau];
  const currentQuestion = questions[0];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${station.color} text-white p-6`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm"
          >
            🗺️ Carte
          </button>
          <div className="text-sm bg-white/10 px-4 py-2 rounded-lg">
            Station {currentStation + 1} / {STATIONS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500"
            style={{ width: `${((currentStation + 1) / STATIONS.length) * 100}%` }}
          />
        </div>

        {/* Map */}
        {showMap && (
          <div className="mb-8 p-4 bg-white/10 rounded-2xl">
            <div className="grid grid-cols-6 gap-2">
              {STATIONS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (idx <= currentStation) {
                      setCurrentStation(idx);
                      setShowMap(false);
                    }
                  }}
                  disabled={idx > currentStation}
                  className={`p-2 rounded-lg text-center transition ${
                    idx === currentStation
                      ? "bg-pink-500 scale-110"
                      : idx < currentStation
                      ? "bg-white/20 hover:bg-white/30"
                      : "bg-white/5 opacity-40"
                  }`}
                >
                  <div className="text-xl">{s.icon}</div>
                  <div className="text-xs mt-1">{idx + 1}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Station Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{station.icon}</div>
          <h1 className="text-3xl font-bold mb-3">{station.title}</h1>
          <p className="text-gray-300 max-w-lg mx-auto">{station.narration}</p>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="p-6 bg-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold mb-5 text-cyan-300">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(station.id, option)}
                  className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition hover:translate-x-2 hover:border-pink-500/50 border border-transparent"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
