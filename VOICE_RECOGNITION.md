# 🎤 Reconnaissance Vocale - Guide d'Utilisation

## Vue d'ensemble

Le parcours du héros JobSeek intègre maintenant une fonctionnalité de reconnaissance vocale (Speech-to-Text) qui permet aux utilisateurs de dicter leurs réponses au lieu de les taper.

## Fonctionnalités

### ✨ Caractéristiques principales

- **Reconnaissance vocale en français** : Optimisée pour la langue française (`fr-FR`)
- **Transcription en temps réel** : Voir les mots apparaître au fur et à mesure que vous parlez
- **Interface intuitive** : Bouton microphone intégré directement dans la zone de texte
- **Indicateur visuel** : Animation rouge pulsante pendant l'enregistrement
- **Gestion d'erreurs** : Messages clairs en cas de problème (microphone non disponible, permissions refusées, etc.)

### 🎯 Comment utiliser

1. **Démarrer l'enregistrement** :
   - Cliquez sur le bouton microphone (🎤) dans le coin supérieur droit de la zone de texte
   - Le navigateur vous demandera l'autorisation d'accéder à votre microphone (acceptez)
   - Le bouton devient rouge et pulse pendant l'enregistrement
   - Un indicateur "En écoute..." apparaît sous la zone de texte

2. **Dicter votre réponse** :
   - Parlez clairement en français
   - La transcription s'ajoute automatiquement dans la zone de texte
   - Vous pouvez voir un aperçu en temps réel de ce que vous dites
   - La transcription finale est ajoutée au texte existant (vous pouvez combiner saisie clavier + voix)

3. **Arrêter l'enregistrement** :
   - Cliquez à nouveau sur le bouton microphone pour arrêter
   - Ou soumettez simplement votre réponse (l'enregistrement s'arrête automatiquement)

### 🔧 Compatibilité des navigateurs

La reconnaissance vocale est disponible sur :

| Navigateur | Compatibilité | Notes |
|------------|---------------|-------|
| **Google Chrome** | ✅ Recommandé | Meilleure précision |
| **Microsoft Edge** | ✅ Recommandé | Basé sur Chromium |
| **Safari** | ✅ Compatible | iOS 14.5+ / macOS 15+ |
| **Firefox** | ❌ Non supporté | API non disponible |

**Note** : Si votre navigateur ne supporte pas la reconnaissance vocale, le bouton microphone sera automatiquement masqué.

### ⚠️ Permissions requises

Pour utiliser la reconnaissance vocale, vous devez :

1. **Autoriser l'accès au microphone** : Le navigateur demandera la permission la première fois
2. **Connexion HTTPS** : La reconnaissance vocale nécessite une connexion sécurisée (HTTPS ou localhost)
3. **Microphone fonctionnel** : Assurez-vous que votre microphone est connecté et configuré

### 🐛 Résolution des problèmes

#### "Permission microphone refusée"
- Vérifiez les paramètres de votre navigateur
- Sur Chrome : Cliquez sur l'icône de cadenas dans la barre d'adresse → Paramètres du site → Microphone → Autoriser

#### "Microphone non disponible"
- Vérifiez que votre microphone est bien connecté
- Testez votre microphone dans les paramètres système
- Fermez les autres applications qui utilisent le microphone

#### "Aucune parole détectée"
- Parlez plus fort ou rapprochez-vous du microphone
- Vérifiez le niveau d'enregistrement dans les paramètres système
- Assurez-vous qu'il n'y a pas trop de bruit ambiant

#### "Erreur réseau"
- La reconnaissance vocale nécessite une connexion internet active
- Certaines fonctionnalités utilisent les serveurs de Google pour la transcription

### 💡 Conseils d'utilisation

1. **Parlez naturellement** : Pas besoin d'exagérer votre élocution
2. **Faites des pauses** : Marquez des pauses entre les phrases pour une meilleure ponctuation
3. **Environnement calme** : Un environnement silencieux améliore la précision
4. **Combinez avec le clavier** : N'hésitez pas à corriger ou compléter au clavier après la dictée
5. **Testez d'abord** : Essayez avec une phrase courte pour vous habituer

### 🔒 Confidentialité

- La reconnaissance vocale utilise l'API Web Speech du navigateur
- Sur Chrome/Edge, l'audio est envoyé aux serveurs de Google pour la transcription
- Aucun enregistrement audio n'est stocké sur nos serveurs
- Seul le texte transcrit est sauvegardé dans votre parcours

## Mise en œuvre technique

### Architecture

```
┌─────────────────┐
│   Interface UI  │
│  (index.html)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gestion Events │
│    (app.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Web Speech API │
│ (Browser Native)│
└─────────────────┘
```

### Composants ajoutés

1. **HTML** ([index.html](src/index.html:115-140)) :
   - Bouton microphone avec icône SVG
   - Indicateur de statut vocal
   - Wrapper pour positionner correctement les éléments

2. **JavaScript** ([app.js](src/app.js:546-760)) :
   - `initSpeechRecognition()` : Initialise l'API Web Speech
   - `toggleVoiceRecognition()` : Démarre/arrête l'enregistrement
   - `startVoiceRecognition()` : Démarre la reconnaissance
   - `stopVoiceRecognition()` : Arrête la reconnaissance
   - `updateVoiceUI()` : Met à jour l'interface utilisateur

3. **CSS** ([style.css](src/style.css:390-522)) :
   - Styles pour le bouton microphone
   - Animations de pulsation pendant l'enregistrement
   - Indicateur de statut avec point pulsant
   - Design responsive

### Configuration de l'API

```javascript
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';           // Langue française
recognition.continuous = true;         // Enregistrement continu
recognition.interimResults = true;     // Résultats intermédiaires
recognition.maxAlternatives = 1;       // Une seule transcription
```

## Tests

Pour tester la fonctionnalité :

1. **Démarrer le serveur local** :
   ```bash
   npm run dev
   # ou
   npx serve src
   ```

2. **Ouvrir dans Chrome/Edge** :
   ```
   http://localhost:8000
   ```

3. **Tester la reconnaissance** :
   - Accédez à une station du parcours
   - Cliquez sur le bouton microphone
   - Autorisez l'accès au microphone
   - Parlez et vérifiez que le texte apparaît

## Améliorations futures possibles

- [ ] Commandes vocales (ex: "soumettre", "effacer")
- [ ] Choix de la langue de reconnaissance
- [ ] Sauvegarde automatique pendant la dictée
- [ ] Support de la ponctuation vocale (ex: dire "point" pour ajouter ".")
- [ ] Correction orthographique post-transcription
- [ ] Mode hors-ligne (avec bibliothèques tierces)

## Support

Pour tout problème avec la reconnaissance vocale :

1. Vérifiez que vous utilisez Chrome ou Edge
2. Assurez-vous que le microphone est autorisé
3. Testez votre microphone avec un autre outil
4. Consultez la console du navigateur (F12) pour les erreurs détaillées

---

**Date de mise à jour** : Décembre 2025
**Version** : 1.0.0
