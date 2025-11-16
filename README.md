# 🌟 Voyage du Héros - Parcours de Transformation Professionnelle

> Une application interactive React basée sur le Voyage du Héros : un parcours de transformation professionnelle en 12 stations inspiré du monomythe de Joseph Campbell.

## 📖 Description

Le **Voyage du Héros** est une application web interactive qui guide les chercheurs d'emploi à travers un parcours de découverte personnelle et professionnelle inspiré du modèle du "Hero's Journey" de Joseph Campbell. Chaque utilisateur traverse 12 stations de transformation pour découvrir son identité professionnelle profonde.

### 🎯 Objectifs

- **Transformation profonde** : Découvrir son identité professionnelle à travers 12 stations de transformation
- **Monomythe de Campbell** : Suivre le parcours classique du héros adapté à la recherche d'emploi
- **Introspection guidée** : Des exercices pratiques adaptés à 3 niveaux de profondeur
- **Progression sauvegardée** : Reprendre son parcours à tout moment
- **Expérience immersive** : Une interface moderne et engageante

## 🗺️ Les 12 Stations du Parcours

### Phase 1 : Le Départ

1. **🚧 Le Monde Ordinaire** - Reconnaître ton point de départ et identifier ce qui ne fonctionne plus
2. **📯 L'Appel à l'Aventure** - Entendre le signal que quelque chose doit changer dans ta vie professionnelle
3. **🚫 Le Refus de l'Appel** - Comprendre tes résistances et les dépasser pour avancer
4. **🧙 La Rencontre avec le Mentor** - Trouver et utiliser les guides qui peuvent t'aider dans ta transformation
5. **🚪 Le Franchissement du Seuil** - Passer à l'action et quitter définitivement ton ancien monde

### Phase 2 : L'Initiation

6. **⚔️ Les Épreuves, Alliés et Ennemis** - Naviguer les premiers défis et identifier qui t'aide ou te freine
7. **🗻 L'Approche de la Caverne** - Te préparer mentalement et stratégiquement avant l'épreuve majeure
8. **🔥 L'Épreuve Suprême** - Affronter ta plus grande peur et traverser le moment décisif
9. **🏆 La Récompense** - Récolter les fruits de ta transformation et intégrer ton nouveau moi

### Phase 3 : Le Retour

10. **🚶 Le Chemin du Retour** - Revenir vers ton monde avec ta nouvelle identité et gérer les résistances
11. **🦋 La Résurrection** - Prouver publiquement ta transformation face aux témoins
12. **💎 Le Retour avec l'Élixir** - Partager ton parcours et devenir le guide pour les autres

## 🎨 Fonctionnalités

### ✅ Parcours Adaptatif
- **3 niveaux d'exploration** :
  - 🚀 **Explorateur Rapide** (5 min/station - 3 questions)
  - 🔍 **Chercheur Curieux** (15 min/station - 5 questions)
  - 🌊 **Plongeur Profond** (30 min/station - 7 questions)

### ✅ Interface Immersive
- **Animations fluides** avec Framer Motion
- **Design moderne** avec Tailwind CSS et dégradés personnalisés par phase
- **Dashboard interactif** affichant toutes les 12 stations
- **Système de verrouillage progressif** (une station à la fois)
- **Sauvegarde automatique** de la progression dans le localStorage
- **Barre de progression** visuelle

### ✅ Expérience Utilisateur
- **Écran d'accueil** avec présentation des 3 niveaux
- **Carte du parcours** organisée par phases (Départ, Initiation, Retour)
- **Interface de questions** avec zone de texte pour réflexions personnelles
- **Récapitulatif** des réponses avant validation
- **Navigation fluide** entre les stations et le dashboard
- **Indicateurs visuels** : stations complétées (✓), verrouillées (🔒)

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
│   │   ├── ParcoursHeros.jsx    # Composant principal avec dashboard et navigation
│   │   └── Station.tsx          # Composant pour afficher une station
│   ├── data/
│   │   └── stationsData.tsx     # Configuration complète des 12 stations
│   ├── App.jsx                  # Point d'entrée de l'application
│   ├── main.jsx                 # Rendu React
│   └── index.css                # Styles Tailwind personnalisés
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 📝 Contenu des Stations

Chaque station dans `stationsData.tsx` contient :

- **Métadonnées** : ID, emoji, titre, sous-titre, phase
- **Contenu pédagogique** : Description, objectifs
- **Exercices** : 3 niveaux de questions (Explorateur, Chercheur, Plongeur)
- **Durée estimée** : Temps moyen par niveau
- **Couleurs** : Dégradés personnalisés pour chaque station

## 🎓 Le Monomythe de Joseph Campbell

Le **Monomythe** (ou "Voyage du Héros") est un schéma narratif universel identifié par Joseph Campbell dans son livre "Le Héros aux mille visages" (1949). Ce modèle décrit un parcours en 3 phases :

### Les 3 Phases du Voyage

1. **Le Départ** : Le héros quitte son monde ordinaire
   - Prise de conscience du besoin de changement
   - Affrontement des peurs et résistances
   - Rencontre de guides et mentors
   - Franchissement du seuil vers l'inconnu

2. **L'Initiation** : Le héros traverse des épreuves transformatrices
   - Navigation des défis et obstacles
   - Préparation à l'épreuve suprême
   - Confrontation avec la peur profonde
   - Récompense et transformation

3. **Le Retour** : Le héros revient transformé
   - Intégration de la nouvelle identité
   - Affirmation publique de la transformation
   - Partage de la sagesse acquise
   - Devenir guide pour les autres

### Application à la Recherche d'Emploi

Cette structure narrative est parfaitement adaptée au parcours de transformation professionnelle, où chaque chercheur d'emploi est le héros de son propre voyage.

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

### ✅ Version 1.0 - Complétée
- [x] Créer la structure des 12 stations basée sur le monomythe de Campbell
- [x] Implémenter le système de navigation entre stations
- [x] Ajouter le dashboard avec visualisation des 3 phases
- [x] Créer les exercices pour les 3 niveaux (Explorateur, Chercheur, Plongeur)
- [x] Implémenter la sauvegarde automatique dans localStorage
- [x] Système de verrouillage progressif des stations
- [x] Interface de questions avec zone de réflexion

### 🚧 Version 1.1 - En cours
- [ ] Ajouter le contenu pédagogique 4MAT pour chaque station
- [ ] Intégrer les scripts audio TTS (15-20 min par station)
- [ ] Ajouter les scripts vidéo (6-8 min par station)
- [ ] Implémenter les quiz d'évaluation (20 questions par station)

### 🔮 Version 2.0 - À venir
- [ ] Système d'analyse des réponses et génération de profil
- [ ] Film de transformation récapitulatif
- [ ] Export PDF des résultats et réponses
- [ ] Partage sur réseaux sociaux
- [ ] Backend pour sauvegarde cloud des profils
- [ ] Tableau de bord des progrès avec statistiques

### 🌍 Version 3.0 - Futures améliorations
- [ ] Version mobile native (React Native)
- [ ] Tests unitaires et e2e
- [ ] Internationalisation (FR/EN/ES)
- [ ] Mode collaboratif avec coach
- [ ] Intégration d'IA pour feedback personnalisé

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
