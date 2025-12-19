# ✅ Mise à Jour Webhook STAR v2

## 🔄 Changement Effectué

Le webhook d'extraction STAR a été mis à jour vers la version v2 :

**Ancienne URL:**
```
https://n8n.srv824625.hstgr.cloud/webhook/jobseed-extract-star
```

**Nouvelle URL:**
```
https://n8n.srv824625.hstgr.cloud/webhook/jobseed-extract-star-v2
```

---

## 📝 Fichiers Modifiés

### 1. [src/config.js](src/config.js:26)
```javascript
API_ENDPOINTS: {
  // ...
  EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'  // ← Mis à jour
}
```

### 2. [src/config.bundle.js](src/config.bundle.js:25)
```javascript
API_ENDPOINTS: {
  // ...
  EXTRACT_STAR: '/webhook/jobseed-extract-star-v2'  // ← Mis à jour
}
```

---

## 🧪 Test de la Nouvelle URL

### Test Manuel (cURL)

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/jobseed-extract-star-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "narrative": "Dans mon poste de chef de projet, j'ai géré une équipe de 5 personnes pour livrer un projet critique en 3 mois. Résultat : livraison à temps avec 95% de satisfaction client.",
    "stationNum": 3
  }'
```

**Réponse Attendue:**
```json
{
  "success": true,
  "experience": {
    "title": "Gestion de projet avec succès",
    "situation": "...",
    "task": "...",
    "action": "...",
    "result": "...",
    "competencies": ["Leadership", "Gestion de projet", "..."]
  }
}
```

---

## ✅ Vérification dans l'Application

### Test en Local

1. **Démarrer le serveur:**
   ```bash
   cd c:\Users\info\OneDrive\jobseek-hero-journey
   npm run dev
   ```

2. **Ouvrir:** http://127.0.0.1:8000/login-bundle.html

3. **Se connecter et commencer un parcours**

4. **Compléter une station** (minimum 50 caractères)

5. **Vérifier dans la console (F12):**
   ```
   🌟 Extraction STAR en cours...
   ✅ Extraction STAR réussie !
   ```

6. **Observer la notification:** "⭐ Expérience extraite: [titre]"

---

## 📋 Workflow n8n Actif

Le workflow visible dans votre n8n utilise maintenant le path correct :
- **Name:** JobSeed - Extract STAR
- **Webhook Path:** `jobseed-extract-star-v2`
- **URL Complète:** `https://n8n.srv824625.hstgr.cloud/webhook/jobseed-extract-star-v2`
- **Status:** ✅ Active

---

## 🔍 Différences avec la Version Précédente

### Version v1 (ancienne)
- Prompt Claude moins détaillé
- Champ `competencias` (espagnol)

### Version v2 (nouvelle) ✅
- Prompt amélioré avec instructions plus précises
- Champ `competencies` (anglais, cohérent avec le code)
- Meilleure extraction des métriques dans "result"
- Gestion d'erreurs améliorée

---

## 🚀 Déploiement sur Bunny.net

Après cette mise à jour, **uploadez les nouveaux fichiers** :

**Fichiers à uploader:**
1. `src/config.bundle.js` → Upload comme `config.js`
2. `src/login-bundle.html` → Upload comme `login.html`
3. Les autres fichiers (index.html, style.css, app.js) → Tel quel

**Purger le cache CDN** après upload.

---

## 🔐 Sécurité

**Webhook n8n:**
- ✅ Accessible publiquement (POST uniquement)
- ✅ Validation des données côté n8n
- ✅ Pas de données sensibles exposées
- ✅ Rate limiting géré par n8n

**Pas de changement de sécurité**, juste un nouveau path.

---

## 📊 Structure de Réponse Attendue

### Input (Frontend → n8n)
```json
{
  "userId": "uuid",
  "narrative": "Texte de l'utilisateur...",
  "stationNum": 3
}
```

### Output (n8n → Frontend)
```json
{
  "success": true,
  "experience": {
    "userId": "uuid",
    "sourceType": "journey",
    "sourceStationNum": 3,
    "narrativeOriginal": "Texte original...",
    "title": "Titre de l'expérience",
    "situation": "Description du contexte...",
    "task": "Tâche à accomplir...",
    "action": "Actions entreprises...",
    "result": "Résultats obtenus...",
    "competencies": ["Compétence1", "Compétence2", "..."]
  },
  "message": "Expérience STAR extraite"
}
```

---

## ⚠️ Notes Importantes

1. **Non-bloquant:** L'extraction STAR ne bloque jamais l'utilisateur, même en cas d'erreur

2. **Async:** L'appel est fait en arrière-plan pendant que l'utilisateur continue

3. **Fail-safe:** Si le webhook échoue, le parcours continue normalement

4. **Logs:** Les erreurs sont loguées dans la console pour debug

---

## 🧪 Checklist de Test

Après déploiement, vérifier :

- [ ] Webhook v2 actif dans n8n
- [ ] Credentials Claude AI connectées
- [ ] Test manuel cURL fonctionne
- [ ] config.js contient `/webhook/jobseed-extract-star-v2`
- [ ] config.bundle.js contient `/webhook/jobseed-extract-star-v2`
- [ ] Test en local : extraction fonctionne
- [ ] Notification STAR apparaît après soumission
- [ ] Console montre "✅ Extraction STAR réussie !"
- [ ] Expériences STAR visibles dans insights finaux
- [ ] Upload sur Bunny.net effectué
- [ ] Cache CDN purgé
- [ ] Test production : extraction fonctionne

---

## 🔄 Rollback (si problème)

Si la v2 ne fonctionne pas, revenir à la v1 :

```javascript
// Dans config.js et config.bundle.js
EXTRACT_STAR: '/webhook/jobseed-extract-star'  // v1
```

Puis re-uploader sur Bunny.net.

---

**Dernière mise à jour:** Décembre 2025
**Version:** 2.0.1
**Status:** ✅ Prêt pour déploiement
