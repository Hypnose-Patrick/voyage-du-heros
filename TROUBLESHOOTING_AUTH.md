# 🔧 Dépannage Authentification

## Problème : "L'inscription ne me reconnaît pas"

### Diagnostic

L'inscription utilise **Supabase Auth directement** (pas de workflow n8n).

Quand vous vous inscrivez :
1. Supabase crée l'utilisateur dans `auth.users`
2. Un trigger SQL (`on_auth_user_created`) devrait automatiquement créer une entrée dans `user_subscriptions` avec 5 crédits
3. L'application vérifie ensuite l'authentification avec `auth.getSession()`

### Solutions

#### ✅ Solution 1 : Vérifier que le SQL a été exécuté dans Supabase

1. **Ouvrir Supabase Dashboard** : https://supabase.com/dashboard
2. **Sélectionner le projet** : `swhuaseyxprztxehkzjx`
3. **Aller dans SQL Editor**
4. **Exécuter cette requête pour vérifier** :

```sql
-- Vérifier que le trigger existe
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Vérifier que la fonction existe
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```

#### Si le trigger n'existe pas :

**Exécuter le script complet** : Copier tout le contenu de `sql/01_schema.sql` et l'exécuter dans Supabase SQL Editor.

---

#### ✅ Solution 2 : Créer manuellement votre abonnement

Si vous vous êtes déjà inscrit mais n'avez pas de crédits :

```sql
-- Remplacer 'VOTRE_USER_ID' par votre ID utilisateur
-- Vous pouvez le trouver dans : Supabase → Authentication → Users

INSERT INTO public.user_subscriptions (
    user_id,
    plan_type,
    credits_total,
    credits_remaining
) VALUES (
    'VOTRE_USER_ID',  -- ← À remplacer
    'free',
    5,
    5
) ON CONFLICT (user_id) DO NOTHING;
```

**Comment trouver votre USER_ID** :
1. Supabase Dashboard → Authentication → Users
2. Trouver votre email
3. Copier l'ID (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

#### ✅ Solution 3 : Activer les emails de confirmation Supabase

Par défaut, Supabase peut demander une **confirmation par email** avant de permettre la connexion.

**Option A : Désactiver la confirmation email (développement)**

1. Supabase Dashboard → Authentication → Settings
2. Scroll jusqu'à "Email Auth"
3. Décocher "Enable email confirmations"
4. Sauvegarder

**Option B : Confirmer manuellement un utilisateur**

1. Supabase Dashboard → Authentication → Users
2. Trouver votre utilisateur
3. Cliquer sur les "..." → "Confirm email"

---

#### ✅ Solution 4 : Vérifier les erreurs dans la console

1. Ouvrir `http://localhost:8000/login.html`
2. Ouvrir la console (F12)
3. Cliquer sur "Inscription"
4. Remplir le formulaire
5. Observer les erreurs dans la console

**Erreurs communes :**

| Erreur | Solution |
|--------|----------|
| `Email not confirmed` | Confirmer l'email (Solution 3) |
| `User already registered` | Utiliser "Connexion" au lieu d'"Inscription" |
| `Invalid API key` | Vérifier `SUPABASE_ANON_KEY` dans `config.js` |
| `Failed to fetch` | Vérifier `SUPABASE_URL` dans `config.js` |

---

## Test Complet

### 1. **Créer un nouvel utilisateur**

```bash
# Ouvrir dans le navigateur
http://localhost:8000/login.html

# Cliquer sur "Inscription"
# Email: test@example.com
# Password: Test123456
```

### 2. **Vérifier dans Supabase**

```sql
-- Vérifier que l'utilisateur existe
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@example.com';

-- Vérifier que l'abonnement a été créé
SELECT
    us.user_id,
    us.plan_type,
    us.credits_remaining,
    u.email
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
WHERE u.email = 'test@example.com';
```

### 3. **Se connecter**

```bash
# Sur http://localhost:8000/login.html
# Email: test@example.com
# Password: Test123456
# Cliquer "Se connecter"

# → Devrait rediriger vers http://localhost:8000/index.html
```

---

## Mode Debug

Pour activer plus de logs dans l'application :

### Dans `login.html`

Ajouter juste après `import { CONFIG } from './config.js';` :

```javascript
console.log('🔍 CONFIG:', {
    url: CONFIG.SUPABASE_URL,
    key: CONFIG.SUPABASE_ANON_KEY.substring(0, 20) + '...'
});
```

### Tester l'authentification manuellement

Dans la console du navigateur (`login.html`) :

```javascript
// Test de connexion
const { data, error } = await supabaseClient.auth.getSession();
console.log('Session:', data);
console.log('Error:', error);

// Vérifier les crédits
const { data: sub, error: subError } = await supabaseClient
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', data.session.user.id)
    .single();
console.log('Subscription:', sub);
console.log('Sub Error:', subError);
```

---

## Workflow d'Inscription Optimal

```
┌─────────────────────────────────────────┐
│ 1. Utilisateur remplit formulaire       │
│    Email + Password                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Supabase Auth crée utilisateur       │
│    → Table: auth.users                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Trigger SQL auto-exécuté             │
│    → Fonction: handle_new_user()         │
│    → Crée user_subscriptions (5 crédits)│
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Email de confirmation envoyé (opt.)   │
│    → Utilisateur clique sur lien         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Connexion possible                    │
│    → Redirection vers /index.html        │
└─────────────────────────────────────────┘
```

---

## Quick Fix : Script de Setup Complet

Créer un utilisateur de test avec tout configuré :

```sql
-- 1. Désactiver RLS temporairement pour setup
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;

-- 2. Créer utilisateur (via Supabase Dashboard → Auth → Users → Invite)
-- Email: test@jobseek.com
-- Password: TestJobSeek123!

-- 3. Récupérer l'ID utilisateur
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Trouver l'utilisateur
    SELECT id INTO test_user_id
    FROM auth.users
    WHERE email = 'test@jobseek.com';

    -- Si trouvé, créer l'abonnement
    IF test_user_id IS NOT NULL THEN
        INSERT INTO user_subscriptions (
            user_id,
            plan_type,
            credits_total,
            credits_remaining
        ) VALUES (
            test_user_id,
            'free',
            5,
            5
        ) ON CONFLICT (user_id) DO UPDATE
        SET credits_remaining = 5;

        RAISE NOTICE 'Subscription created for user %', test_user_id;
    ELSE
        RAISE NOTICE 'User not found!';
    END IF;
END $$;

-- 4. Réactiver RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 5. Vérifier
SELECT
    u.email,
    us.plan_type,
    us.credits_remaining
FROM auth.users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id
WHERE u.email = 'test@jobseek.com';
```

---

## Commandes Utiles

### Lister tous les utilisateurs avec leurs crédits

```sql
SELECT
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    COALESCE(us.credits_remaining, 0) as credits,
    us.plan_type
FROM auth.users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id
ORDER BY u.created_at DESC;
```

### Réinitialiser les crédits d'un utilisateur

```sql
UPDATE user_subscriptions
SET credits_remaining = 5
WHERE user_id = 'VOTRE_USER_ID';
```

### Supprimer un utilisateur de test

```sql
-- Attention : Supprime toutes les données associées (CASCADE)
DELETE FROM auth.users WHERE email = 'test@example.com';
```

---

## Support

Si le problème persiste :

1. **Copier les erreurs de la console** (F12 → Console)
2. **Vérifier les tables Supabase** (SQL Editor)
3. **Tester avec un email différent**
4. **Vérifier que `01_schema.sql` a bien été exécuté**

---

**Dernière mise à jour** : Décembre 2025
