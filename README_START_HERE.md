# 🚀 JobSeek Hero Journey - DÉMARRAGE RAPIDE

> **Version 2.0.0** - Reconnaissance Vocale + Extraction STAR

---

## ⚡ Démarrage en 3 Minutes

### 1️⃣ Test Automatique

```bash
# Démarrer le serveur
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
```

Ouvrir dans le navigateur: **http://localhost:8000/test_setup.html**

✅ **Tous les tests doivent être verts**

---

### 2️⃣ Vérifier Supabase

Aller sur: https://supabase.com/dashboard → SQL Editor

```sql
-- Vérifier que le trigger existe
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Si 0 ligne retournée:**
1. Ouvrir `sql/01_schema.sql`
2. Copier TOUT le contenu
3. Coller dans SQL Editor
4. Cliquer "Run"

---

### 3️⃣ Tester l'Inscription

Ouvrir: **http://localhost:8000/src/login.html**

1. Cliquer "**Inscription**"
2. Email: `test@jobseek.local`
3. Password: `Test123456`
4. Confirmer password
5. Cliquer "**Créer mon compte**"

**Attendu:** Message vert "Compte créé avec succès !"

---

## 🆘 Si ça ne fonctionne pas

### Problème: "Il ne me reconnais pas"

**Solution rapide:** Créer manuellement l'abonnement

```sql
-- Trouver votre user_id
SELECT id, email FROM auth.users WHERE email = 'votre@email.com';

-- Créer l'abonnement (remplacer 'xxx' par votre user_id)
INSERT INTO user_subscriptions (user_id, plan_type, credits_total, credits_remaining)
VALUES ('xxx', 'free', 5, 5)
ON CONFLICT (user_id) DO NOTHING;
```

### Problème: "Email not confirmed"

**Solution:**

Supabase Dashboard → Authentication → Settings → Décocher "Enable email confirmations"

OU

```sql
UPDATE auth.users SET email_confirmed_at = NOW()
WHERE email = 'votre@email.com';
```

---

## 📚 Documentation Complète

### Pour Diagnostiquer les Problèmes:
1. 📋 [**QUICK_SETUP_CHECK.md**](QUICK_SETUP_CHECK.md) - Checklist complète étape par étape
2. 🔧 [**TROUBLESHOOTING_AUTH.md**](TROUBLESHOOTING_AUTH.md) - Dépannage authentification
3. 📊 [**STATUS_CURRENT.md**](STATUS_CURRENT.md) - État actuel du projet

### Pour Comprendre les Fonctionnalités:
4. 🎤 [**VOICE_RECOGNITION.md**](VOICE_RECOGNITION.md) - Guide reconnaissance vocale
5. ⭐ [**STAR_EXTRACTION.md**](STAR_EXTRACTION.md) - Documentation extraction STAR
6. 📝 [**CHANGELOG_STAR.md**](CHANGELOG_STAR.md) - Historique version 2.0.0

---

## ✨ Nouvelles Fonctionnalités (v2.0.0)

### 🎤 Reconnaissance Vocale
- Cliquer sur l'icône microphone dans la zone de texte
- Parler en français
- La transcription apparaît automatiquement
- **Support:** Chrome, Edge, Safari (pas Firefox)

### ⭐ Extraction STAR
- Extraction automatique après chaque station
- Structuration: Situation, Task, Action, Result
- Identification des compétences
- Affichage professionnel dans les insights finaux
- **Nécessite:** Import workflow n8n (voir ci-dessous)

---

## 🔧 Configuration Avancée

### Activer l'Extraction STAR

**1. Importer le workflow n8n:**
- Aller sur: https://n8n.srv824625.hstgr.cloud
- Workflows → Import from file
- Sélectionner: `workflows/n8n-05-extract-star.json`
- Activer le workflow

**2. Créer la table dans Supabase:**
```sql
-- Copier le contenu de sql/05_star_experiences.sql
-- Coller dans Supabase SQL Editor
-- Cliquer "Run"
```

---

## 🎯 Flux d'Utilisation

```
┌─────────────────────┐
│ 1. Inscription      │ → login.html
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Connexion        │ → login.html
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. Page d'accueil   │ → index.html
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. Commencer        │ → 12 stations
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 5. Insights finaux  │ → ICARE + STAR
└─────────────────────┘
```

---

## 📊 Structure du Projet

```
jobseek-hero-journey/
│
├── 📄 README_START_HERE.md      ← VOUS ÊTES ICI
├── 📄 STATUS_CURRENT.md         ← État actuel
├── 📄 QUICK_SETUP_CHECK.md      ← Checklist détaillée
├── 🔧 test_setup.html            ← Tests automatiques
│
├── src/                          ← Application frontend
│   ├── index.html               (Parcours principal)
│   ├── login.html               (Authentification)
│   ├── app.js                   (Logique métier)
│   ├── style.css                (Styles)
│   └── config.js                (Configuration)
│
├── sql/                          ← Scripts base de données
│   ├── 01_schema.sql            (Schéma principal)
│   └── 05_star_experiences.sql  (Table STAR)
│
└── workflows/                    ← Workflows n8n
    └── n8n-05-extract-star.json (Extraction STAR)
```

---

## 🔐 Sécurité

**Clés API dans config.js:**
- ⚠️ Ne JAMAIS commiter dans Git public
- ✅ Fichier déjà configuré avec vos credentials
- ✅ Supabase RLS activé sur toutes les tables

---

## ⚙️ Paramètres Actuels

**Supabase:**
- URL: `https://swhuaseyxprztxehkzjx.supabase.co`
- Projet ID: `swhuaseyxprztxehkzjx`

**n8n:**
- URL: `https://n8n.srv824625.hstgr.cloud`

**Application:**
- Port local: `8000`
- Langue: Français
- Crédits gratuits: 5 par utilisateur

---

## ✅ Checklist Rapide

Avant d'utiliser l'application:

- [ ] ✅ Tests passent sur http://localhost:8000/test_setup.html
- [ ] ✅ Trigger `on_auth_user_created` existe dans Supabase
- [ ] ✅ Email confirmations désactivé (pour dev)
- [ ] ✅ Inscription fonctionne
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Workflow STAR importé dans n8n (optionnel)
- [ ] ✅ Table `star_experiences` créée (optionnel)

---

## 🆘 Support

### En cas de problème:

1. **Ouvrir:** http://localhost:8000/test_setup.html
   - Identifier les tests qui échouent

2. **Consulter:** [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)
   - Solutions détaillées pour chaque problème

3. **Vérifier logs:**
   - Console navigateur (F12)
   - Supabase Dashboard → Logs
   - n8n Executions

---

## 📞 Réponses aux Questions Fréquentes

### Q: L'inscription est-elle reliée à n8n ?
**R:** Non, l'inscription utilise Supabase Auth directement. Un trigger SQL crée automatiquement l'abonnement avec 5 crédits.

### Q: Pourquoi "il ne me reconnais pas" ?
**R:** Le trigger SQL n'a probablement pas été exécuté. Vérifier avec la requête ci-dessus, ou créer manuellement l'abonnement.

### Q: Est-ce que Firefox supporte la reconnaissance vocale ?
**R:** Non, utilisez Chrome ou Edge pour la reconnaissance vocale.

### Q: STAR extraction est-elle obligatoire ?
**R:** Non, c'est optionnel. L'application fonctionne sans. Elle ajoute juste une valeur supplémentaire.

---

## 🎉 Prêt à Démarrer

```bash
# 1. Démarrer le serveur
python -m http.server 8000

# 2. Ouvrir dans le navigateur
http://localhost:8000/src/login.html

# 3. S'inscrire ou se connecter

# 4. Commencer le parcours du héros !
```

---

**Version:** 2.0.0
**Dernière mise à jour:** Décembre 2025
**Status:** ✅ Prêt pour utilisation

**Bon voyage dans votre parcours du héros ! 🚀**
