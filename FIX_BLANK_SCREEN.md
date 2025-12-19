# 🔧 Correction Écran Blanc sur Bunny.net

## 🔍 Diagnostic Rapide

### Étape 1: Ouvrir la Console (F12)

1. Ouvrir votre page sur Bunny.net
2. Appuyer sur **F12** (ou Clic droit → Inspecter)
3. Aller dans l'onglet **Console**

**Cherchez ces erreurs communes:**

---

## ❌ Erreur 1: "Failed to load module script"

```
Failed to load module script: Expected a JavaScript module script
but the server responded with a MIME type of "text/plain"
```

### Cause:

Bunny.net ne sert pas les fichiers `.js` avec le bon MIME type `application/javascript`, donc les modules ES6 échouent.

### Solution:

J'ai créé des versions **sans modules ES6** qui fonctionnent sur tous les CDN.

---

## ❌ Erreur 2: "Cannot find module './config.js'"

```
GET https://votre-cdn.b-cdn.net/hero-journey/config.js 404 Not Found
```

### Solution:

Le fichier n'est pas uploadé ou le chemin est incorrect.

**Vérifier:**
1. `config.js` est bien uploadé dans le même dossier que `login.html`
2. Le chemin dans l'import est relatif: `'./config.js'` (pas `'/config.js'`)

---

## ❌ Erreur 3: CORS Error

```
Access to fetch at 'https://swhuaseyxprztxehkzjx.supabase.co'
has been blocked by CORS policy
```

### Solution:

**Dans Supabase:**
1. Dashboard → Settings → API
2. **Site URL:** `https://votre-cdn.b-cdn.net`
3. **Redirect URLs:** Ajouter:
   ```
   https://votre-cdn.b-cdn.net/**
   https://votre-cdn.b-cdn.net/hero-journey/**
   ```
4. Sauvegarder

**Dans Bunny.net:**
1. Storage → Votre zone → Settings
2. **CORS:** Enable
3. **Allowed Origins:** `*`

---

## ✅ Solution Universelle: Versions Bundle (Sans Modules ES6)

### Fichiers Créés:

J'ai créé des versions compatibles CDN:

1. **[src/config.bundle.js](src/config.bundle.js)** - Configuration sans module ES6
2. **[src/login-bundle.html](src/login-bundle.html)** - Page de connexion compatible

Ces fichiers utilisent `window.CONFIG` au lieu de `import/export`, ce qui fonctionne partout.

---

## 🚀 Solution Rapide (3 minutes)

### Méthode Recommandée:

**Uploader ces fichiers sur Bunny.net:**

| Fichier Local | Uploader comme | Description |
|---------------|----------------|-------------|
| `src/login-bundle.html` | `login.html` | Page de connexion (compatible) |
| `src/config.bundle.js` | `config.js` | Configuration (compatible) |
| `src/index.html` | `index.html` | Page principale (OK tel quel) |
| `src/style.css` | `style.css` | Styles (OK tel quel) |
| `src/app.js` | `app.js` | Logique métier (OK tel quel) |

**Étapes:**

1. **Supprimer** l'ancien `login.html` et `config.js` de Bunny.net
2. **Uploader** `login-bundle.html` et le **renommer** en `login.html`
3. **Uploader** `config.bundle.js` et le **renommer** en `config.js`
4. **Purger le cache:** CDN → Pull Zone → Purge All
5. **Tester:** `https://votre-cdn.b-cdn.net/hero-journey/login.html`

---

## 🧪 Tester en Local d'Abord

Avant d'uploader, testez localement:

```bash
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
```

**Ouvrir:** http://localhost:8000/src/login-bundle.html

**Vérifier dans la console (F12):**
```
✅ config.bundle.js chargé - window.CONFIG disponible
✅ Configuration validée
✅ Supabase client créé
ℹ️ Pas de session active
✅ login-bundle.html initialisé
```

**Si ces messages apparaissent:** Ça fonctionne ! Vous pouvez uploader sur Bunny.net.

---

## 🔧 Fix Étape par Étape

### Fix 1: Utiliser les Versions Bundle

**Sur Bunny.net:**

1. Aller dans votre Storage Zone `hero-journey/`
2. **Supprimer** les anciens fichiers:
   - `login.html` (ancien)
   - `config.js` (ancien)

3. **Uploader les nouveaux:**
   - Upload `src/login-bundle.html` → Renommer en `login.html`
   - Upload `src/config.bundle.js` → Renommer en `config.js`

4. **Purger le cache:**
   - CDN → Votre Pull Zone → **Purge** → Purge All

5. **Attendre 30 secondes** (propagation CDN)

6. **Tester:** Ouvrir `https://votre-cdn.b-cdn.net/hero-journey/login.html`

---

### Fix 2: Configurer les MIME Types (Alternatif)

Si vous voulez garder les modules ES6:

1. Bunny.net → Storage → Votre zone → **Settings**
2. **Force MIME types:** Enable
3. Ajouter les règles:
   ```
   .js → application/javascript
   .mjs → application/javascript
   .css → text/css
   .html → text/html
   ```
4. **Purger le cache:** CDN → Pull Zone → Purge All

**Note:** Cette méthode est moins fiable que les versions bundle.

---

### Fix 3: Vérifier les Chemins Relatifs

Dans tous les fichiers HTML, vérifiez:

```html
<!-- ✅ BON (chemins relatifs) -->
<link rel="stylesheet" href="style.css">
<script src="config.js"></script>

<!-- ❌ MAUVAIS (chemins absolus) -->
<link rel="stylesheet" href="/style.css">
<script src="/config.js"></script>
```

Les chemins **doivent être relatifs** (sans `/` au début).

---

## 🧪 Tests de Diagnostic

### Test 1: Vérifier l'Accessibilité des Fichiers

Dans la console (F12):

```javascript
// Tester que chaque fichier est accessible
fetch('https://votre-cdn.b-cdn.net/hero-journey/config.js')
  .then(r => {
    console.log('config.js:', r.status, r.headers.get('content-type'));
    return r.text();
  })
  .then(text => console.log('Contenu (100 premiers chars):', text.substring(0, 100)))
  .catch(e => console.error('Erreur:', e));
```

**Attendu:**
```
config.js: 200 "application/javascript" (ou "text/javascript")
Contenu (100 premiers chars): window.CONFIG = { SUPABASE_URL: 'https://...
```

---

### Test 2: Vérifier window.CONFIG

```javascript
// Dans la console
console.log('CONFIG disponible ?', typeof window.CONFIG);
console.log('CONFIG:', window.CONFIG);
console.log('Supabase URL:', window.CONFIG?.SUPABASE_URL);
```

**Attendu:**
```
CONFIG disponible ? object
CONFIG: {SUPABASE_URL: "https://...", SUPABASE_ANON_KEY: "...", ...}
Supabase URL: https://swhuaseyxprztxehkzjx.supabase.co
```

**Si `undefined`:** Le fichier `config.js` n'est pas chargé ou pas au bon format.

---

### Test 3: Onglet Network

1. F12 → Onglet **Network**
2. Rafraîchir la page (Ctrl+R)
3. Chercher dans la liste:
   - `login.html` → Status 200 ✅
   - `config.js` → Status 200 ✅
   - `style.css` → Status 200 ✅

**Si 404:** Le fichier n'est pas uploadé ou le chemin est incorrect.

**Si 200 mais Type wrong:** Problème de MIME type → Utiliser versions bundle.

---

## 📋 Checklist de Dépannage

Cochez chaque étape:

- [ ] F12 → Console ouverte
- [ ] Identifier l'erreur exacte dans la console
- [ ] Vérifier que les 5 fichiers sont uploadés sur Bunny
- [ ] Vérifier les chemins relatifs (pas de `/` au début)
- [ ] CORS activé sur Bunny Storage
- [ ] Supabase autorise l'origine Bunny CDN
- [ ] Utiliser `login-bundle.html` et `config.bundle.js`
- [ ] Cache CDN purgé (Purge All)
- [ ] Attendre 30-60 secondes après purge
- [ ] Tester: `https://votre-cdn.b-cdn.net/hero-journey/login.html`
- [ ] Console affiche: "✅ login-bundle.html initialisé"
- [ ] Pas d'erreur 404 dans Network

---

## 🎯 Différences entre Versions

### Version Originale (login.html)
```html
<script type="module">
  import { CONFIG } from './config.js';  // ← Module ES6
  // ...
</script>
```

**Problème:** Bunny.net peut ne pas servir le bon MIME type.

### Version Bundle (login-bundle.html)
```html
<script src="config.bundle.js"></script>  <!-- Chargement classique -->
<script>
  // CONFIG disponible via window.CONFIG  ← Pas de module
  const supabaseClient = createClient(
    window.CONFIG.SUPABASE_URL,
    window.CONFIG.SUPABASE_ANON_KEY
  );
</script>
```

**Avantage:** Fonctionne partout, même avec MIME types incorrects.

---

## 💡 Pourquoi Ça Fonctionne en Local Mais Pas sur Bunny ?

### En Local (python -m http.server)

- Python sert les `.js` avec le MIME type correct : `application/javascript`
- Les modules ES6 fonctionnent ✅

### Sur Bunny.net (sans config)

- Bunny peut servir les `.js` avec `text/plain` ou `application/octet-stream`
- Les modules ES6 échouent ❌
- Les navigateurs refusent d'exécuter les modules avec un mauvais MIME type (sécurité)

### Avec Versions Bundle

- Pas de modules ES6 = pas de vérification MIME type stricte
- Fonctionne avec n'importe quel MIME type ✅

---

## 📞 Besoin d'Aide Supplémentaire ?

### Si l'écran est toujours blanc:

1. **Copier toute la console (F12 → Console)**
   - Ctrl+A dans la console
   - Ctrl+C pour copier
   - Envoyer le contenu

2. **Vérifier l'onglet Network:**
   - F12 → Network
   - Rafraîchir la page
   - Chercher les fichiers en rouge (erreur 404 ou 500)
   - Noter lesquels échouent

3. **Tester l'URL directe des fichiers:**
   ```
   https://votre-cdn.b-cdn.net/hero-journey/config.js
   https://votre-cdn.b-cdn.net/hero-journey/style.css
   https://votre-cdn.b-cdn.net/hero-journey/login.html
   ```
   Si un fichier affiche "404 Not Found" → Il n'est pas uploadé.

---

## ✅ Résumé de la Solution

**Pour corriger l'écran blanc:**

```
1. Uploader login-bundle.html (renommer en login.html)
2. Uploader config.bundle.js (renommer en config.js)
3. Purger le cache CDN
4. Tester l'URL
```

**Ces fichiers sont prêts à l'emploi et fonctionnent sur tous les CDN ! 🚀**

---

**Dernière mise à jour:** Décembre 2025
**Fichiers créés:**
- [src/config.bundle.js](src/config.bundle.js)
- [src/login-bundle.html](src/login-bundle.html)
