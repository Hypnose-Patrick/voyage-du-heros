# 🌟 Voyage du Héros - Parcours de Transformation Professionnelle

> Une application interactive React basée sur le Voyage du Héros : un parcours de transformation professionnelle en 12 stations explorant les méta-programmes PNL.

## 📖 Description

Le **Voyage du Héros** est une application web interactive qui guide les utilisateurs à travers un parcours de découverte personnelle et professionnelle inspiré du modèle du "Hero's Journey" de Joseph Campbell, adapté avec les méta-programmes de la Programmation Neuro-Linguistique (PNL).

### 🎯 Objectifs

- **Exploration profonde** : Découvrir son profil professionnel à travers 12 stations thématiques
- **Méta-programmes PNL** : Identifier ses patterns de pensée et de comportement
- **Transformation** : Obtenir un profil complet avec archétype, forces et recommandations
- **Gamification** : Vivre une expérience engageante et immersive

## 🗺️ Les 12 Stations du Parcours

1. **🏠 Le Monde Ordinaire** - Orientation & Motivation (Vers/Évitement)
2. **🪞 Le Miroir des Actions** - Proactivité vs Réactivité
3. **🌲 La Forêt des Doutes** - Référence Interne/Externe
4. **🌉 Le Pont Impossible** - Découpage (Global/Spécifique)
5. **📚 La Bibliothèque des Convictions** - Raisonnement (Déductif/Inductif/Abductif)
6. **🔮 L'Oracle des Possibles** - Orientation Temps (Passé/Présent/Futur)
7. **⚖️ La Balance des Priorités** - Tri Primaire (Personnes/Tâches/Infos/Lieux)
8. **🌀 Le Labyrinthe des Décisions** - Options vs Procédures
9. **🦋 La Chrysalide** - Position de Perception (1ère/3ème/Méta)
10. **✨ Le Nom Secret** - Identité Professionnelle
11. **⛰️ La Montagne de la Vision** - Projection Future
12. **💎 Le Trésor Révélé** - Synthèse & Profil Complet

## 🎨 Fonctionnalités

### ✅ Parcours Adaptatif
- **3 niveaux d'exploration** :
  - 🚀 Explorateur Rapide (10 min - 1 question/station)
  - 🔍 Chercheur Curieux (20 min - 2-3 questions/station)
  - 🌊 Plongeur Profond (40 min - 5 questions/station)

### ✅ Interface Immersive
- **Animations fluides** avec Framer Motion
- **Design moderne** avec Tailwind CSS
- **Vidéos explicatives** intégrées à chaque station
- **Carte interactive** du parcours
- **Sauvegarde automatique** de la progression

### ✅ Résultats Personnalisés
- **Archétype professionnel** : Explorateur, Guerrier, Sage, Créateur, Souverain, Magicien
- **Totem animal** symbolique
- **Élément** associé (Air, Feu, Eau, Terre, Éther)
- **5 Super-Pouvoirs** identifiés
- **Film de transformation** récapitulatif
- **Plan d'action personnalisé**

## 🛠️ Technologies

- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Framer Motion** - Animations fluides
- **Tailwind CSS** - Styling moderne et responsive
- **LocalStorage** - Sauvegarde automatique

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/Hypnose-Patrick/voyage-du-heros.git

# Accéder au dossier
cd voyage-du-heros

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 🚀 Utilisation

1. **Choisir son niveau d'exploration**
2. **Traverser les 12 stations** en répondant aux questions
3. **Regarder les vidéos** explicatives (optionnel)
4. **Consulter la carte** du parcours à tout moment
5. **Recevoir son profil complet** à la fin
6. **Exporter ou partager** ses résultats

## 📂 Structure du Projet

```
voyage-du-heros/
├── src/
│   ├── components/
│   │   ├── ParcoursHeros.jsx    # Composant principal
│   │   ├── LevelSelection.jsx   # Sélection du niveau
│   │   ├── Station.jsx          # Composant station
│   │   ├── TransformationFilm.jsx # Résultats finaux
│   │   └── ...
│   ├── data/
│   │   └── stations.js          # Configuration des 12 stations
│   ├── utils/
│   │   └── profileAnalyzer.js   # Analyse du profil
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎓 Concepts PNL Utilisés

### Méta-Programmes

Les méta-programmes sont des filtres de perception qui influencent notre façon de penser et d'agir :

- **Orientation Motivation** : Vers les opportunités ou évitement des problèmes
- **Proactivité** : Initiateur vs Attentiste
- **Référence** : Interne (autonome) vs Externe (besoin de validation)
- **Découpage** : Vision globale vs Détails spécifiques
- **Raisonnement** : Déductif, Inductif ou Abductif
- **Orientation Temps** : Passé, Présent ou Futur
- **Tri Primaire** : Personnes, Tâches, Informations ou Lieux
- **Options/Procédures** : Innovation vs Conformité
- **Position Perceptuelle** : 1ère, 3ème personne ou Méta

## 🎯 Cas d'Usage

- **Coaching professionnel** : Outil pour les coachs et consultants
- **Recrutement** : Comprendre les profils des candidats
- **Team Building** : Activité d'équipe pour mieux se connaître
- **Développement personnel** : Auto-exploration guidée
- **Formation** : Support pédagogique pour les formateurs PNL

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [ ] Ajouter le composant complet ParcoursHeros.jsx avec toutes les 12 stations
- [ ] Intégrer les vidéos YouTube pour chaque station
- [ ] Implémenter l'export PDF des résultats
- [ ] Ajouter le partage sur réseaux sociaux
- [ ] Créer un backend pour sauvegarder les profils
- [ ] Développer une version mobile native
- [ ] Ajouter des tests unitaires et e2e
- [ ] Internationalisation (FR/EN/ES)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Patrick Beiner**
- 💼 Coach PNL & Spécialiste en réinsertion professionnelle
- 🌐 [PNL Formation](https://pnl-formation.com)
- 📧 Contact : [patrick@pnl-formation.com](mailto:patrick@pnl-formation.com)

## 🙏 Remerciements

- Joseph Campbell pour le modèle du Hero's Journey
- Richard Bandler et John Grinder pour la PNL
- La communauté React et Framer Motion

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !
