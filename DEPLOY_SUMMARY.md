# 🚀 Résumé Déploiement - JobSeek Hero Journey

## 📦 Fichiers à Uploader sur Bunny.net

**UNIQUEMENT ces 5 fichiers:**

| Fichier | Taille | Obligatoire | Description |
|---------|--------|-------------|-------------|
| [src/login.html](src/login.html) | ~29 KB | ✅ OUI | Point d'entrée - Page d'authentification |
| [src/index.html](src/index.html) | ~45 KB | ✅ OUI | Application principale (parcours) |
| [src/style.css](src/style.css) | ~52 KB | ✅ OUI | Tous les styles |
| [src/app.js](src/app.js) | ~68 KB | ✅ OUI | Logique complète (vocal + STAR) |
| [src/config.js](src/config.js) | ~4 KB | ✅ OUI | Configuration API |

**Total:** ~198 KB

---

## ⚡ Déploiement en 3 Étapes

### 1️⃣ Créer sur Bunny.net

1. **Storage Zone:** https://panel.bunny.net/storage
   - Créer zone: `jobseek-hero`
   - Région: Europe

2. **Pull Zone:** https://panel.bunny.net/cdn
   - Créer: `jobseek-cdn`
   - Lier à: `jobseek-hero`

### 2️⃣ Uploader les Fichiers

**Méthode Manuel:**
- Storage → `jobseek-hero` → Créer dossier `hero-journey/`
- Drag & drop les 5 fichiers

**Méthode Script:**
```bash
# Éditer deploy/deploy-bunny.sh (lignes 16-19)
./deploy/deploy-bunny.sh
```

### 3️⃣ Configurer

**Bunny.net:**
- Storage → Settings → **CORS** → Enable

**Supabase:**
- Settings → API → **Site URL:** `https://votre-cdn.b-cdn.net`
- Settings → API → **Redirect URLs:** Ajouter `https://votre-cdn.b-cdn.net/**`

---

## 🔗 URLs Finales

**Page d'entrée (à partager):**
```
https://votre-cdn.b-cdn.net/hero-journey/login.html
```

**Application:**
```
https://votre-cdn.b-cdn.net/hero-journey/index.html
```

---

## ✅ Services Requis (Déjà Configurés)

| Service | URL | Status | Documentation |
|---------|-----|--------|---------------|
| **Supabase** | https://swhuaseyxprztxehkzjx.supabase.co | ✅ Configuré | [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) |
| **n8n** | https://n8n.srv824625.hstgr.cloud | ✅ Configuré | [workflows/README.md](workflows/README.md) |
| **Bunny.net** | Panel + Storage + CDN | ⏳ À créer | [DEPLOY_BUNNY.md](DEPLOY_BUNNY.md) |

---

## 🗄️ Base de Données (Supabase)

**À exécuter une seule fois:**

1. **Schéma principal:**
   - Copier [sql/01_schema.sql](sql/01_schema.sql)
   - Exécuter dans Supabase SQL Editor

2. **Table STAR (optionnel):**
   - Copier [sql/05_star_experiences.sql](sql/05_star_experiences.sql)
   - Exécuter dans Supabase SQL Editor

**Vérification:**
```sql
-- Vérifier que le trigger existe
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- Doit retourner 1 ligne
```

---

## 🔄 Workflows n8n

**À importer une seule fois:**

| Workflow | Fichier | Obligatoire |
|----------|---------|-------------|
| Hero Journey - Start | `workflows/n8n-01-start-journey.json` | ✅ OUI |
| Hero Journey - Stage | `workflows/n8n-02-submit-stage.json` | ✅ OUI |
| Hero Journey - Insights | `workflows/n8n-03-generate-insights.json` | ✅ OUI |
| Hero Journey - Get | `workflows/n8n-04-get-journey.json` | ✅ OUI |
| JobSeed - Extract STAR | `workflows/n8n-05-extract-star.json` | ⭐ Optionnel |

**Importer:**
1. https://n8n.srv824625.hstgr.cloud
2. Workflows → Import from file
3. Activer chaque workflow

---

## 🧪 Tests Avant Production

### Test Local (Avant de déployer)

```bash
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
```

**Ouvrir:**
- http://localhost:8000/test_setup.html (tests auto)
- http://localhost:8000/src/login.html (tester inscription)

**Tous les tests doivent être ✅**

### Test Production (Après déploiement)

**Ouvrir:**
- `https://votre-cdn.b-cdn.net/hero-journey/login.html`

**Vérifier:**
1. ✅ Page s'affiche (styles OK)
2. ✅ Inscription fonctionne
3. ✅ Connexion fonctionne
4. ✅ Pas d'erreurs dans la console (F12)
5. ✅ Parcours démarre correctement
6. ✅ Reconnaissance vocale fonctionne (Chrome/Edge)

---

## 🐛 Dépannage Rapide

### Problème: Page blanche

**Solution:**
- F12 → Console → Identifier l'erreur
- Vérifier que les 5 fichiers sont uploadés
- Vérifier CORS activé sur Bunny.net

### Problème: "Failed to load module script"

**Solution:**
- Bunny.net → Storage → Settings → Force MIME types → Enable
- Purger le cache CDN

### Problème: Erreur CORS

**Solution:**
- Supabase → Settings → API → Ajouter `https://votre-cdn.b-cdn.net` dans Redirect URLs
- Bunny.net → Storage → Settings → CORS → Enable

### Problème: "Il ne me reconnais pas"

**Solution:**
- Voir [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)
- Vérifier le trigger SQL dans Supabase
- Créer manuellement l'abonnement si nécessaire

---

## 📚 Documentation Complète

### 🎯 Pour Démarrer:
1. 📖 [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md) - **Liste des fichiers**
2. 🚀 [DEPLOY_BUNNY.md](DEPLOY_BUNNY.md) - **Guide complet Bunny.net**
3. ✅ [QUICK_SETUP_CHECK.md](QUICK_SETUP_CHECK.md) - Checklist

### 🔧 Pour Résoudre les Problèmes:
4. 🐛 [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) - Authentification
5. 🧪 [test_setup.html](test_setup.html) - Tests automatiques
6. 📊 [STATUS_CURRENT.md](STATUS_CURRENT.md) - État du projet

### 📖 Pour Comprendre:
7. 🎤 [VOICE_RECOGNITION.md](VOICE_RECOGNITION.md) - Reconnaissance vocale
8. ⭐ [STAR_EXTRACTION.md](STAR_EXTRACTION.md) - Extraction STAR
9. 📝 [CHANGELOG_STAR.md](CHANGELOG_STAR.md) - Version 2.0.0

---

## 🔐 Sécurité

### ✅ Clés Publiques (OK d'exposer)
- `SUPABASE_ANON_KEY` → Clé publique
- URLs n8n → Protégées par validation

### ⚠️ Clés Privées (NE PAS exposer)
- `OPENROUTER_API_KEY` → **Uniquement dans n8n** (pas dans config.js frontend)
- Service Role Key Supabase → **Jamais côté client**

**Le fichier config.js actuel est sécurisé ✅**

---

## 💰 Coûts

**Bunny.net:**
- Storage: $0.01/GB/mois (~$0.01)
- Bandwidth: $0.01/GB (~$0.10 pour 100 utilisateurs)
- **Total estimé: < $1/mois**

**Supabase:**
- Plan Free: 500 MB database + 50k MAU
- **$0 si < 500 utilisateurs**

**n8n:**
- Hébergé sur votre serveur (coût existant)

**TOTAL: < $1/mois** pour usage modéré

---

## ✅ Checklist Finale de Production

### Avant le Déploiement:
- [ ] Tests locaux OK (test_setup.html)
- [ ] Les 5 fichiers existent dans `src/`
- [ ] config.js contient les bonnes URLs
- [ ] Trigger SQL exécuté dans Supabase
- [ ] Workflows n8n importés et actifs

### Pendant le Déploiement:
- [ ] Storage Zone créée sur Bunny.net
- [ ] Pull Zone créée et liée
- [ ] 5 fichiers uploadés dans `hero-journey/`
- [ ] CORS activé sur Bunny Storage
- [ ] Cache configuré (7 days)
- [ ] Compression Gzip activée

### Après le Déploiement:
- [ ] URL finale notée
- [ ] Supabase autorise l'origine Bunny CDN
- [ ] Test d'inscription OK en production
- [ ] Test de connexion OK en production
- [ ] Console navigateur sans erreurs
- [ ] Reconnaissance vocale fonctionne
- [ ] Extraction STAR fonctionne (si activée)

---

## 🎯 Commandes Rapides

### Démarrer le serveur local:
```bash
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
```

### Déployer sur Bunny.net:
```bash
./deploy/deploy-bunny.sh
```

### Vérifier Supabase:
```sql
-- Trigger existe ?
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Utilisateurs avec crédits ?
SELECT u.email, us.credits_remaining
FROM auth.users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id;
```

---

## 📞 Support

**Bunny.net:**
- Panel: https://panel.bunny.net
- Docs: https://docs.bunny.net
- Support: support@bunny.net

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

**n8n:**
- Instance: https://n8n.srv824625.hstgr.cloud
- Docs: https://docs.n8n.io

---

## 🎉 Résumé Ultra-Rapide

```
1. Créer Storage Zone + Pull Zone sur Bunny.net
2. Uploader 5 fichiers (login.html, index.html, style.css, app.js, config.js)
3. Activer CORS sur Bunny
4. Autoriser URL dans Supabase
5. Tester: https://votre-cdn.b-cdn.net/hero-journey/login.html
```

**C'est tout ! 🚀**

---

**Dernière mise à jour:** Décembre 2025
**Version:** 2.0.0
**Fichiers requis:** 5 uniquement
**Services externes:** Supabase + n8n + Bunny.net
