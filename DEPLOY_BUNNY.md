# 🚀 Déploiement sur Bunny.net - Guide Complet

## 📦 Fichiers à Déployer

**Uniquement ces 5 fichiers du dossier `src/` :**

```
src/
├── login.html    ← Page d'authentification (POINT D'ENTRÉE)
├── index.html    ← Page principale du parcours
├── style.css     ← Tous les styles
├── app.js        ← Logique métier (vocal + STAR)
└── config.js     ← Configuration (Supabase + n8n)
```

**Taille totale:** ~200 KB

---

## ⚙️ Méthode 1: Upload Manuel (Recommandé pour débuter)

### Étape 1: Créer un Storage Zone

1. Aller sur: https://panel.bunny.net
2. Storage → **Create Storage Zone**
3. Nom: `jobseek-hero` (ou votre choix)
4. Région: **Europe** (ou proche de vos utilisateurs)
5. Cliquer **Create**

### Étape 2: Créer un Pull Zone (CDN)

1. CDN → **Add Pull Zone**
2. Nom: `jobseek-cdn` (ou votre choix)
3. Origin Type: **Bunny Storage Zone**
4. Storage Zone: Sélectionner `jobseek-hero`
5. Activer **Cache Everything**
6. Cliquer **Add Pull Zone**

**Notez l'URL:** `https://jobseek-cdn.b-cdn.net` (exemple)

### Étape 3: Uploader les Fichiers

1. Storage → Votre Storage Zone `jobseek-hero`
2. Créer un dossier `hero-journey/` (optionnel mais recommandé)
3. **Uploader les 5 fichiers** dans ce dossier:
   - `login.html`
   - `index.html`
   - `style.css`
   - `app.js`
   - `config.js`

### Étape 4: Configurer les CORS (Important !)

1. Storage → Votre zone → **Settings**
2. Activer **CORS**
3. Allowed Origins: `*` (ou votre domaine spécifique)
4. Allowed Headers: `*`
5. Sauvegarder

### Étape 5: Tester

Ouvrir dans le navigateur:
```
https://jobseek-cdn.b-cdn.net/hero-journey/login.html
```

✅ Vous devriez voir la page de connexion !

---

## 🤖 Méthode 2: Déploiement Automatique (Script)

### Prérequis

- Bash (Git Bash sur Windows)
- curl installé
- API Key Bunny.net

### Étape 1: Obtenir votre API Key

1. Panel Bunny.net → Account → **API**
2. Copier l'**Account API Key**
3. OU Storage → Votre zone → **FTP & API Access** → Copier le **Password**

### Étape 2: Configurer le Script

Éditer [deploy/deploy-bunny.sh](deploy/deploy-bunny.sh):

```bash
# Ligne 16-19: Remplacer par vos valeurs
BUNNY_STORAGE_ZONE="jobseek-hero"           # Nom de votre Storage Zone
BUNNY_STORAGE_API_KEY="votre-api-key-ici"   # Votre API Key
BUNNY_HOSTNAME="storage.bunnycdn.com"       # Ne pas changer
BUNNY_CDN_URL="https://jobseek-cdn.b-cdn.net"  # URL de votre Pull Zone
```

### Étape 3: Rendre le Script Exécutable

```bash
chmod +x deploy/deploy-bunny.sh
```

### Étape 4: Lancer le Déploiement

```bash
cd c:\Users\info\OneDrive\jobseek-hero-journey
./deploy/deploy-bunny.sh
```

**Le script va:**
1. ✅ Vérifier que les 5 fichiers existent
2. ✅ Uploader chaque fichier sur Bunny CDN
3. ✅ Purger le cache CDN
4. ✅ Afficher l'URL finale

---

## 🔐 Vérifier que `config.js` est Correct

Avant de déployer, vérifiez que [src/config.js](src/config.js) contient vos vraies URLs :

```javascript
export const CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://swhuaseyxprztxehkzjx.supabase.co',  // ✅ OK
  SUPABASE_ANON_KEY: 'sb_publishable_kuiqWMn5XTLDLEtbfPT-GA_ccpMijxt',  // ✅ OK

  // n8n
  N8N_BASE_URL: 'https://n8n.srv824625.hstgr.cloud',  // ✅ OK

  // Endpoints
  API_ENDPOINTS: {
    START_JOURNEY: '/webhook/hero-journey-start',
    SUBMIT_STAGE: '/webhook/hero-journey-stage',
    GENERATE_INSIGHTS: '/webhook/hero-journey-insights',
    GET_JOURNEY: '/webhook/hero-journey-get',
    EXTRACT_STAR: '/webhook/jobseed-extract-star'  // ✅ Nouveau
  }
};
```

**IMPORTANT:** Ces URLs doivent être accessibles depuis internet (pas `localhost`) !

---

## 🌐 Configuration DNS (Optionnel - Domaine Custom)

### Si vous avez un domaine (ex: jobseek.votresite.com)

1. Bunny.net → CDN → Votre Pull Zone → **Hostnames**
2. Ajouter: `jobseek.votresite.com`
3. Copier le **CNAME** fourni (ex: `jobseek-cdn.b-cdn.net`)
4. Aller chez votre registrar DNS (Cloudflare, OVH, etc.)
5. Ajouter un enregistrement:
   ```
   Type: CNAME
   Name: jobseek
   Target: jobseek-cdn.b-cdn.net
   ```
6. Attendre 5-60 minutes pour la propagation

**URL finale:** `https://jobseek.votresite.com/hero-journey/login.html`

---

## 🔒 Activer HTTPS

**Par défaut, Bunny.net fournit HTTPS gratuitement !**

✅ Aucune configuration supplémentaire nécessaire.

Si domaine custom:
1. Bunny.net → CDN → Votre Pull Zone → **SSL**
2. **Free SSL Certificate** (Let's Encrypt) → Enable
3. Attendre 2-5 minutes

---

## ⚡ Optimisations Recommandées

### 1. Activer la Compression

Bunny.net → CDN → Votre Pull Zone → **Optimization**
- ✅ **Gzip Compression** → Enable
- ✅ **Minify CSS** → Enable (optionnel)
- ✅ **Minify JavaScript** → Enable (optionnel)

### 2. Configurer le Cache

Bunny.net → CDN → Votre Pull Zone → **Caching**
- Cache Expiration: **7 days** (pour JS/CSS)
- Browser Cache: **4 hours** (pour HTML)
- **Cache Everything** → Enable

### 3. Activer la Géo-Réplication

Bunny.net → Storage → Votre Zone → **Replication**
- Activer les régions proches de vos utilisateurs
- Europe: ✅ Recommandé
- USA: Si utilisateurs américains

---

## 🧪 Tests Après Déploiement

### Test 1: Page de Connexion

```
https://votre-cdn.b-cdn.net/hero-journey/login.html
```

✅ **Attendu:**
- Page s'affiche correctement
- Styles appliqués
- Boutons "Connexion" / "Inscription" fonctionnent

### Test 2: Inscription

1. Cliquer "Inscription"
2. Remplir le formulaire
3. Créer un compte

✅ **Attendu:**
- Message vert "Compte créé avec succès !"
- Pas d'erreur CORS dans la console (F12)

### Test 3: Connexion

1. Se connecter avec le compte créé
2. Vérifier la redirection vers `index.html`

✅ **Attendu:**
- Redirection vers la page principale
- Utilisateur authentifié

### Test 4: Console Navigateur (F12)

```javascript
// Vérifier le chargement des modules
console.log('CONFIG:', CONFIG);  // Doit afficher l'objet
console.log('Supabase URL:', CONFIG.SUPABASE_URL);  // Doit afficher l'URL
```

✅ **Attendu:** Pas d'erreurs de module ou CORS

---

## 🐛 Dépannage

### Problème 1: "Failed to load module script"

**Erreur:**
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"
```

**Solution:**
1. Bunny.net → Storage → Zone → **Settings**
2. Vérifier **Force MIME types** → Enable
3. Purger le cache CDN

### Problème 2: Erreurs CORS

**Erreur:**
```
Access to fetch at 'https://swhuaseyxprztxehkzjx.supabase.co' from origin 'https://votre-cdn.b-cdn.net' has been blocked by CORS policy
```

**Solution:**
1. Vérifier que **Supabase** autorise votre domaine:
   - Supabase Dashboard → Settings → API
   - Site URL: `https://votre-cdn.b-cdn.net`
   - Redirect URLs: Ajouter `https://votre-cdn.b-cdn.net/**`

2. Vérifier **Bunny.net CORS**:
   - Storage → Zone → Settings → CORS → Enable

### Problème 3: "config.js not found"

**Erreur:**
```
GET https://votre-cdn.b-cdn.net/hero-journey/config.js 404 Not Found
```

**Solution:**
- Vérifier que `config.js` est bien uploadé
- Vérifier le chemin (doit être au même niveau que `login.html`)
- Purger le cache CDN

### Problème 4: Page blanche

**Solution:**
1. Ouvrir la console (F12)
2. Identifier l'erreur exacte
3. Vérifier que tous les 5 fichiers sont uploadés
4. Vérifier les chemins relatifs dans `login.html`:
   ```html
   <link rel="stylesheet" href="style.css">  <!-- Pas /style.css -->
   <script type="module">
     import { CONFIG } from './config.js';  <!-- Pas /config.js -->
   ```

---

## 📊 Monitoring

### Vérifier les Statistiques

Bunny.net → CDN → Votre Pull Zone → **Statistics**

**Métriques à surveiller:**
- Bandwidth utilisé
- Nombre de requêtes
- Cache hit ratio (devrait être > 90%)
- Erreurs 4xx/5xx

### Logs

Bunny.net → CDN → Votre Pull Zone → **Logs**

Activer les logs pour déboguer :
- Real-time logs
- Error logs

---

## 💰 Coûts Estimés

**Bunny.net Pricing (très abordable):**

- Storage: **$0.01 / GB / mois** (~$0.01 pour ce projet)
- Bandwidth: **$0.01 / GB** en Europe (~$0.10 pour 100 utilisateurs/mois)
- **Total estimé:** **< $1 / mois** pour usage normal

**Comparaison:**
- Netlify: $19/mois (pour features équivalentes)
- Vercel: $20/mois
- Cloudflare Pages: Gratuit mais limitations

---

## ✅ Checklist de Déploiement

Avant de mettre en production:

- [ ] ✅ Les 5 fichiers sont uploadés sur Bunny CDN
- [ ] ✅ CORS activé sur Bunny Storage
- [ ] ✅ `config.js` contient les bonnes URLs (Supabase + n8n)
- [ ] ✅ URL de la Pull Zone notée
- [ ] ✅ HTTPS activé (automatique)
- [ ] ✅ Test d'inscription OK
- [ ] ✅ Test de connexion OK
- [ ] ✅ Console navigateur sans erreurs
- [ ] ✅ Supabase autorise l'origine Bunny CDN
- [ ] ✅ Workflows n8n actifs et accessibles
- [ ] ✅ Trigger SQL `on_auth_user_created` exécuté dans Supabase
- [ ] ✅ Table `star_experiences` créée (si STAR activé)
- [ ] ✅ Cache CDN configuré (7 days)
- [ ] ✅ Compression Gzip activée

---

## 🔄 Mise à Jour de l'Application

**Après avoir modifié un fichier:**

### Méthode Manuelle:
1. Uploader le nouveau fichier (écrase l'ancien)
2. Bunny.net → CDN → Pull Zone → **Purge**
3. Cliquer "Purge All"
4. Attendre 30-60 secondes

### Méthode Script:
```bash
./deploy/deploy-bunny.sh
```

Le script purge automatiquement le cache.

---

## 🎯 URLs Finales

Après déploiement, vos URLs seront:

**Page de connexion (ENTRÉE):**
```
https://votre-cdn.b-cdn.net/hero-journey/login.html
```

**Page principale:**
```
https://votre-cdn.b-cdn.net/hero-journey/index.html
```

**Assets:**
```
https://votre-cdn.b-cdn.net/hero-journey/style.css
https://votre-cdn.b-cdn.net/hero-journey/app.js
https://votre-cdn.b-cdn.net/hero-journey/config.js
```

---

## 📞 Support

**Bunny.net Support:**
- Email: support@bunny.net
- Discord: https://discord.gg/bunnynet
- Docs: https://docs.bunny.net

**Problèmes spécifiques au projet:**
- Consulter: [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)
- Tester: http://localhost:8000/test_setup.html (en local d'abord)

---

## 🚀 Résumé Rapide

```bash
# 1. Créer Storage Zone "jobseek-hero" sur Bunny.net
# 2. Créer Pull Zone "jobseek-cdn" liée à la Storage Zone
# 3. Uploader les 5 fichiers du dossier src/
# 4. Activer CORS sur la Storage Zone
# 5. Tester: https://jobseek-cdn.b-cdn.net/hero-journey/login.html
```

**C'est tout ! 🎉**

---

**Dernière mise à jour:** Décembre 2025
**Version:** 2.0.0
