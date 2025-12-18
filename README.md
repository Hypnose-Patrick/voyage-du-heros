# 🎯 JobSeek Hero Journey

Application web standalone du **Parcours du Héros** pour JobSeek - 12 stations de transformation professionnelle avec coach IA intégré et diagnostic ICARE.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Déploiement](#déploiement)
- [Workflows n8n](#workflows-n8n)
- [Structure du Projet](#structure-du-projet)
- [API Reference](#api-reference)
- [Développement](#développement)
- [FAQ](#faq)

---

## 🎨 Vue d'ensemble

### Fonctionnalités

- ✅ **12 Stations Interactives** - Questions progressives orientées recherche d'emploi
- ✅ **Coach IA Personnalisé** - Feedback contextualisé via Claude 3.5 Sonnet
- ✅ **Profil ICARE 5D** - Diagnostic psychologique dynamique (Identité, Capacités, Appartenance, Risque, Estime)
- ✅ **Synthèse Stratégique** - Pitch, soft skills, accomplissements, environnement idéal
- ✅ **Système de Crédits** - Paywall intégré (1 crédit = 1 génération IA)
- ✅ **Persistence Cloud** - Données stockées dans Supabase
- ✅ **Responsive Design** - Interface dark mode optimisée mobile

### Stack Technique

**Frontend**
- HTML5 + CSS3 (Vanilla, pas de framework)
- JavaScript ES6+ (modules)
- Canvas API (graphique radar ICARE)

**Backend**
- **Supabase** : Auth + Database + Row Level Security
- **n8n** : Orchestration workflows + génération IA
- **OpenRouter** : API unifiée pour Claude 3.5 Sonnet

**Infrastructure**
- **Bunny.net CDN** : Hosting + délivrance assets

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
    ┌────▼─────┐   ┌───▼────────┐
    │ Supabase │   │    n8n     │
    │   Auth   │   │ Workflows  │
    │    DB    │   │            │
    └──────────┘   └─────┬──────┘
                         │
                   ┌─────▼──────┐
                   │ OpenRouter │
                   │  Claude AI │
                   └────────────┘
```

### Flux de Données

1. **Utilisateur** → Répond aux questions
2. **Frontend** → Envoie réponse + JWT à n8n
3. **n8n** → Vérifie auth, crédits, génère prompt
4. **OpenRouter** → Appelle Claude 3.5 Sonnet
5. **n8n** → Parse réponse, update Supabase
6. **Frontend** → Affiche feedback + nouveau profil ICARE

---

## 📦 Installation

### Prérequis

- Node.js 18+ (pour tester localement)
- Compte Supabase (gratuit)
- Compte n8n Cloud ou self-hosted
- Compte OpenRouter avec crédits
- Compte Bunny.net (optionnel pour CDN)

### Étape 1 : Cloner le Projet

```bash
git clone https://github.com/votre-compte/jobseek-hero-journey.git
cd jobseek-hero-journey
```

### Étape 2 : Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Exécuter le script `sql/01_schema.sql`
4. Récupérer les credentials :
   - Project URL : `https://xxxxx.supabase.co`
   - Anon/Public Key : Dans **Settings > API**

### Étape 3 : Configuration n8n

1. Créer un compte sur [n8n.cloud](https://n8n.cloud) ou self-host
2. Importer les 4 workflows depuis `workflows/*.json`
3. Configurer les credentials :
   - Supabase : URL + **Service Role Key** (pas anon key)
   - OpenRouter : API Key
4. Activer les webhooks en mode Production
5. Noter les URLs des webhooks

### Étape 4 : Configuration Frontend

```bash
cd src
cp config.example.js config.js
```

Éditer `config.js` avec vos valeurs :

```javascript
export const CONFIG = {
    SUPABASE_URL: 'https://xxxxx.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOi...',
    N8N_BASE_URL: 'https://votre-instance.app.n8n.cloud',
    // ...
};
```

### Étape 5 : Test Local

```bash
# Installer un serveur local
npm install -g http-server

# Lancer depuis /src
cd src
http-server -p 8080

# Ouvrir http://localhost:8080
```

---

## ⚙️ Configuration

### Variables d'Environnement (config.js)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SUPABASE_URL` | URL projet Supabase | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbGciOi...` |
| `N8N_BASE_URL` | Base URL workflows n8n | `https://n8n.example.com` |
| `OPENROUTER_API_KEY` | Clé API OpenRouter | `sk-or-v1-...` |
| `BUNNY_CDN_URL` | URL CDN Bunny (optionnel) | `https://cdn.example.com` |

### Crédits Utilisateur

Par défaut, chaque nouvel utilisateur reçoit **5 crédits gratuits**.

Modifier dans `sql/01_schema.sql` :

```sql
CREATE TRIGGER on_auth_user_created
VALUES (NEW.id, 'free', 5, 5, NOW() + INTERVAL '1 year');
--                      ↑↑
--                      Crédits gratuits
```

### Modèle IA

Par défaut : **Claude 3.5 Sonnet** (`anthropic/claude-3.5-sonnet`)

Alternatives dans n8n :
- GPT-4o : `openai/gpt-4o`
- GPT-4 Turbo : `openai/gpt-4-turbo`
- Claude Opus : `anthropic/claude-opus-4`

---

## 🚀 Déploiement

### Option 1 : Bunny.net CDN (Recommandé)

```bash
cd deploy

# Éditer deploy-bunny.sh avec vos credentials
nano deploy-bunny.sh

# Rendre exécutable
chmod +x deploy-bunny.sh

# Déployer
./deploy-bunny.sh
```

### Option 2 : Netlify / Vercel

1. Créer un compte sur [netlify.com](https://netlify.com)
2. Drag & drop le dossier `/src`
3. Configurer les variables d'environnement
4. Build settings : Aucun (HTML statique)

### Option 3 : GitHub Pages

```bash
# Dans /src
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/user/repo.git
git push -u origin main

# Activer GitHub Pages dans Settings > Pages
```

---

## 🔧 Workflows n8n

### Workflow 1 : Initialize Journey

**Endpoint** : `POST /api/journey/start`

**Description** : Crée un nouveau parcours + profil ICARE initial

**Requête** :
```bash
curl -X POST https://n8n.example.com/api/journey/start \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Réponse** :
```json
{
  "journeyId": "uuid",
  "currentStage": 1,
  "icareProfile": {
    "identite": 50,
    "capacites": 50,
    "appartenance": 50,
    "risque": 50,
    "estime": 50
  }
}
```

### Workflow 2 : Submit Stage Answer

**Endpoint** : `POST /api/journey/:journeyId/stage`

**Description** : Soumet réponse utilisateur + génère feedback IA

**Requête** :
```bash
curl -X POST https://n8n.example.com/api/journey/abc123/stage \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "stageNumber": 1,
    "userInput": "Je travaille comme développeur depuis 5 ans..."
  }'
```

**Réponse** :
```json
{
  "narrative": "Vous identifiez clairement...",
  "insight": "Votre principale force...",
  "newIcareProfile": { ... },
  "nextStage": 2,
  "xpGained": 125
}
```

### Workflow 3 : Generate Final Insights

**Endpoint** : `POST /api/journey/:journeyId/insights`

**Description** : Génère synthèse finale après les 12 stations

**Condition** : Toutes les stations doivent être complétées

**Réponse** :
```json
{
  "pitch": "Professionnel expérimenté...",
  "tagline": "Expert en transformation digitale",
  "softSkills": ["Leadership", "Adaptabilité", ...],
  "accomplishments": [
    {
      "title": "Transformation digitale",
      "narrative": "Dirigé migration cloud..."
    }
  ],
  "environment": "Startup innovante..."
}
```

### Workflow 4 : Get Journey State

**Endpoint** : `GET /api/journey/:journeyId`

**Description** : Récupère état complet d'un parcours

**Utilisation** : Chargement initial / Reprise parcours

---

## 📂 Structure du Projet

```
jobseek-hero-journey/
├── src/                      # Code source frontend
│   ├── index.html           # Page principale
│   ├── style.css            # Styles (dark mode, gradients)
│   ├── app.js               # Logique application
│   ├── config.example.js    # Template configuration
│   └── config.js            # Configuration (gitignored)
├── sql/                      # Scripts base de données
│   └── 01_schema.sql        # Schéma complet Supabase
├── workflows/                # Workflows n8n
│   ├── 01-initialize-journey.json
│   ├── 02-submit-stage-answer.json
│   ├── 03-generate-final-insights.json
│   └── 04-get-journey-state.json
├── deploy/                   # Scripts déploiement
│   └── deploy-bunny.sh      # Upload Bunny.net CDN
├── .gitignore
└── README.md                # Ce fichier
```

---

## 📡 API Reference

### Base URL

```
https://[votre-n8n-instance].app.n8n.cloud
```

### Authentification

Toutes les requêtes nécessitent un JWT Supabase :

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints

| Méthode | Endpoint | Description | Crédits |
|---------|----------|-------------|---------|
| POST | `/api/journey/start` | Initialiser parcours | 1 |
| POST | `/api/journey/:id/stage` | Soumettre réponse | 1 |
| POST | `/api/journey/:id/insights` | Synthèse finale | 1 |
| GET | `/api/journey/:id` | État du parcours | 0 |

### Codes Erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 402 | Crédits insuffisants |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## 💻 Développement

### Tests Locaux

```bash
# Test avec données mock
cd src
python3 -m http.server 8080
```

### Debugging n8n

1. Activer **Execution History** dans n8n
2. Tester workflows individuellement
3. Vérifier logs dans chaque node
4. Utiliser **Debug Mode** pour voir JSON

### Hot Reload

Utiliser **Live Server** (VS Code) :

```bash
# Extension VS Code
Live Server by Ritwick Dey
```

### Linting / Formatting

```bash
# ESLint (optionnel)
npm install -g eslint
eslint src/app.js

# Prettier
npm install -g prettier
prettier --write src/**/*.{js,css,html}
```

---

## ❓ FAQ

### Comment ajouter une 13ème station ?

1. Modifier `STAGES` dans `src/app.js`
2. Mettre à jour la condition "12 stations" dans workflow 3
3. Ajuster la barre de progression (12 → 13)

### Puis-je changer le modèle IA ?

Oui, dans n8n workflow 2, noeud "Call OpenRouter AI" :

```json
"model": "openai/gpt-4o"  // Au lieu de claude-3.5-sonnet
```

### Comment personnaliser le profil ICARE ?

Modifier les prompts dans workflow 2, section "Build AI Prompt" :

```javascript
"Ajuster les scores ICARE selon la réponse (-10 à +10 par dimension)"
```

### Les données sont-elles sécurisées ?

Oui :
- ✅ **RLS Supabase** : Chaque user voit uniquement ses données
- ✅ **JWT Auth** : Toutes les requêtes authentifiées
- ✅ **HTTPS** : Encryption en transit
- ✅ **Service Role** : Clé backend jamais exposée

### Coût estimé ?

- **Supabase** : Gratuit jusqu'à 500 MB / 50k auth users
- **n8n Cloud** : $20/mois (Starter) ou self-host gratuit
- **OpenRouter** : ~$0.003/requête (Claude Sonnet)
- **Bunny.net** : $1/mois pour 10 GB trafic

**Total** : ~$25/mois pour 1000 utilisateurs actifs

---

## 📄 Licence

MIT License - Libre d'utilisation commerciale

---

## 🤝 Support

- **Documentation** : Ce README
- **Issues** : [GitHub Issues](https://github.com/user/repo/issues)
- **Contact** : patrick@jobseek.online

---

## 🎯 Prochaines Étapes

Après installation réussie :

1. ✅ Tester le parcours complet
2. ✅ Ajuster les prompts IA
3. ✅ Personnaliser le design
4. ✅ Configurer analytics (Plausible, Fathom)
5. ✅ Intégrer paiement (Stripe)
6. ✅ Marketing & Growth

**Bon courage ! 🚀**
