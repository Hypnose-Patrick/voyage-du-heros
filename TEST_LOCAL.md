# 🧪 Test en Local - URLs Correctes

## ✅ Serveur Actif

Votre serveur est déjà lancé et sert le dossier `src/` sur le port 8000.

```
Serveur: http://127.0.0.1:8000
Dossier servi: src/
```

---

## 🔗 URLs Correctes à Utiliser

### Version Originale (Modules ES6)

**Page de connexion:**
```
http://127.0.0.1:8000/login.html
```

**Page principale:**
```
http://127.0.0.1:8000/index.html
```

### Version Bundle (Compatible CDN)

**Page de connexion:**
```
http://127.0.0.1:8000/login-bundle.html
```

---

## ❌ URLs Incorrectes (404)

Ces URLs ne fonctionnent PAS:
```
❌ http://127.0.0.1:8000/src/login-bundle.html  (404)
❌ http://127.0.0.1:8000/src/login.html         (404)
```

**Pourquoi ?** Le serveur sert déjà le contenu du dossier `src/`, donc:
- Le fichier `src/login-bundle.html` est accessible à `http://127.0.0.1:8000/login-bundle.html`
- Pas besoin de `/src/` dans l'URL

---

## 🔍 Fichiers Disponibles

D'après les logs du serveur, ces fichiers sont accessibles:

```
✅ http://127.0.0.1:8000/login.html          (Page de connexion originale)
✅ http://127.0.0.1:8000/login-bundle.html   (Page de connexion compatible CDN)
✅ http://127.0.0.1:8000/index.html          (Page principale)
✅ http://127.0.0.1:8000/style.css           (Styles)
✅ http://127.0.0.1:8000/app.js              (Logique métier)
✅ http://127.0.0.1:8000/config.js           (Configuration originale)
✅ http://127.0.0.1:8000/config.bundle.js    (Configuration bundle)
```

---

## 🧪 Test Rapide

### 1. Tester la Version Bundle

Ouvrir dans le navigateur:
```
http://127.0.0.1:8000/login-bundle.html
```

### 2. Ouvrir la Console (F12)

Vérifier que vous voyez:
```
✅ config.bundle.js chargé - window.CONFIG disponible
✅ Configuration validée: {supabaseUrl: "...", n8nUrl: "..."}
✅ Supabase client créé
ℹ️ Pas de session active
✅ login-bundle.html initialisé
```

### 3. Tester l'Inscription

1. Cliquer sur "Inscription"
2. Remplir le formulaire
3. Créer un compte

**Si ça fonctionne en local:** Vous pouvez uploader sur Bunny.net !

---

## 🔄 Si Vous Voulez Changer de Port

Arrêter le serveur actuel (Ctrl+C dans le terminal) puis:

```bash
# Option 1: Python simple (sert depuis le dossier courant)
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
# URL: http://localhost:8000/src/login-bundle.html

# Option 2: Python depuis src/ (recommandé)
cd c:\Users\info\OneDrive\jobseek-hero-journey\src
python -m http.server 8000
# URL: http://localhost:8000/login-bundle.html

# Option 3: npm (déjà lancé actuellement)
cd c:\Users\info\OneDrive\jobseek-hero-journey
npm run dev
# URL: http://127.0.0.1:8000/login-bundle.html
```

---

## 📋 Checklist Test Local

- [ ] Ouvrir http://127.0.0.1:8000/login-bundle.html
- [ ] F12 → Console → Voir les messages "✅"
- [ ] Aucune erreur dans la console
- [ ] Tester l'inscription
- [ ] Tester la connexion

**Si tout fonctionne:** Les fichiers sont prêts pour Bunny.net !

---

## 🚀 Prochaine Étape

Une fois que ça fonctionne en local:

1. **Uploader sur Bunny.net:**
   - `login-bundle.html` → Renommer en `login.html`
   - `config.bundle.js` → Renommer en `config.js`
   - Les autres fichiers tel quel

2. **Purger le cache CDN**

3. **Tester l'URL Bunny.net**

---

**URL correcte à utiliser MAINTENANT:**
```
http://127.0.0.1:8000/login-bundle.html
```

(Pas besoin de `/src/` car le serveur sert déjà depuis `src/`)
