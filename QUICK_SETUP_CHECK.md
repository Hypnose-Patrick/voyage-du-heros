# ✅ Quick Setup Verification Checklist

## 1. Test Login/Signup Page (Local)

### A. Start the Server
```bash
cd c:\Users\info\OneDrive\jobseek-hero-journey
python -m http.server 8000
```

### B. Open in Browser
```
http://localhost:8000/src/login.html
```

### C. Test the Tabs
- Click "Connexion" tab → Should show login form
- Click "Inscription" tab → Should show signup form with 3 fields
- **If tabs don't switch**: Check console (F12) for errors

---

## 2. Verify Supabase Database Setup

### A. Check if Trigger Exists

1. Go to: https://supabase.com/dashboard
2. Select project: `swhuaseyxprztxehkzjx`
3. Go to: **SQL Editor**
4. Run this query:

```sql
-- Vérifier que le trigger existe
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Result:**
- ✅ 1 row returned with trigger_name = 'on_auth_user_created'
- ❌ 0 rows = **YOU NEED TO RUN THE SCHEMA**

### B. If Trigger Doesn't Exist

Execute the complete schema:

1. Open: `sql/01_schema.sql` in your project
2. Copy ALL content (lines 1-329)
3. Paste in Supabase SQL Editor
4. Click "Run"
5. Verify no errors

### C. Check Email Confirmation Settings

1. Supabase Dashboard → **Authentication** → **Settings**
2. Scroll to "**Email Auth**"
3. Find "**Enable email confirmations**"
4. **For Testing**: UNCHECK this option
5. Click "**Save**"

This allows immediate login without email confirmation (good for development).

---

## 3. Test Complete Signup Flow

### A. Create Test User

1. Go to: `http://localhost:8000/src/login.html`
2. Click "**Inscription**"
3. Fill in:
   - Email: `test@jobseek.local`
   - Password: `Test123456`
   - Confirm: `Test123456`
4. Click "**Créer mon compte**"

**Expected:**
- ✅ Green alert: "Compte créé avec succès !"
- ✅ Auto-switch to "Connexion" tab after 2 seconds

### B. Verify User in Supabase

In Supabase SQL Editor:

```sql
-- Vérifier que l'utilisateur existe
SELECT
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at
FROM auth.users u
WHERE u.email = 'test@jobseek.local';
```

**Expected:**
- ✅ 1 row with your email
- ✅ `email_confirmed_at` is NULL or has a date (depending on setting)

### C. Verify Subscription Was Created

```sql
-- Vérifier que l'abonnement a été créé automatiquement
SELECT
    us.user_id,
    us.plan_type,
    us.credits_total,
    us.credits_remaining,
    us.created_at,
    u.email
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
WHERE u.email = 'test@jobseek.local';
```

**Expected:**
- ✅ 1 row with:
  - `plan_type = 'free'`
  - `credits_total = 5`
  - `credits_remaining = 5`

**If subscription is missing:**
→ See Solution 2 in [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)

### D. Test Login

1. Go to "Connexion" tab
2. Email: `test@jobseek.local`
3. Password: `Test123456`
4. Click "**Se connecter**"

**Expected:**
- ✅ Green alert: "Connexion réussie !"
- ✅ Redirect to: `http://localhost:8000/src/index.html`
- ✅ See "Bienvenue" page with "Commencer le parcours" button

---

## 4. Verify n8n Workflows

### A. Check Workflow Status

1. Go to: https://n8n.srv824625.hstgr.cloud
2. Check these workflows are **ACTIVE**:
   - ✅ `Hero Journey - Start`
   - ✅ `Hero Journey - Stage`
   - ✅ `Hero Journey - Insights`
   - ✅ `JobSeed - Extract STAR` (NEW)

### B. Test Webhook URLs

In browser console or Postman:

```javascript
// Test START_JOURNEY endpoint
fetch('https://n8n.srv824625.hstgr.cloud/webhook/hero-journey-start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true })
})
  .then(r => r.json())
  .then(console.log);
```

**Expected:**
- ✅ Status 200 (or 400 with validation error)
- ❌ Status 404 = Workflow not active or wrong URL

---

## 5. Common Issues & Quick Fixes

### Issue 1: "Email not confirmed"

**Fix:**
```sql
-- Manually confirm user
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'test@jobseek.local';
```

### Issue 2: No subscription created

**Fix:**
```sql
-- Manually create subscription
INSERT INTO user_subscriptions (user_id, plan_type, credits_total, credits_remaining)
SELECT id, 'free', 5, 5
FROM auth.users
WHERE email = 'test@jobseek.local'
ON CONFLICT (user_id) DO NOTHING;
```

### Issue 3: Import error in login.html

**Check console (F12) for:**
```
Failed to load module script: Expected a JavaScript module script
```

**Fix:** Already applied in login.html:
```javascript
import { CONFIG } from './config.js';  // ✅ Correct
// NOT: import CONFIG from './config.js';  // ❌ Wrong
```

### Issue 4: Tabs don't work

**Check console for:**
```
Uncaught ReferenceError: switchTab is not defined
```

**Fix:** Already applied - `switchTab` is now defined as `window.switchTab`

---

## 6. Feature Testing (After Login Works)

### A. Test Voice Recognition

1. Login successfully
2. Click "Commencer le parcours"
3. See microphone button (🎤) in textarea
4. Click microphone → Should ask for permission
5. Speak in French → Should transcribe
6. Click again → Should stop

**Browser Support:**
- ✅ Chrome (Recommended)
- ✅ Edge (Recommended)
- ✅ Safari
- ❌ Firefox (Not supported)

### B. Test STAR Extraction

1. Complete station 1 (answer with 50+ characters)
2. Submit
3. Watch for notification top-right: "⭐ Expérience extraite..."
4. Complete all 12 stations
5. In final insights, see "Vos Expériences Professionnelles (Méthode STAR)"

**Note:** STAR extraction is async and non-blocking. If it fails, the journey continues normally.

---

## 7. Your Current Status

Based on your message: "l'inscription est-elle reliée à un workflow n8n ou pas ? pour le moment il ne me reconnais pas"

**Answer:**
- ❌ No, inscription does NOT use n8n
- ✅ Inscription uses **Supabase Auth directly**
- ✅ A **SQL trigger** should auto-create subscription with 5 credits
- ⚠️ If not recognized = trigger probably not executed

**Next Steps:**
1. ✅ Run Section 2.A to check if trigger exists
2. ✅ Run Section 2.B if trigger missing
3. ✅ Run Section 3 to test signup again
4. ✅ Run Section 5 Issue 2 if subscription still missing

---

## 8. Files to Review

If you encounter issues:

1. **Authentication**: [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)
2. **Voice Recognition**: [VOICE_RECOGNITION.md](VOICE_RECOGNITION.md)
3. **STAR Extraction**: [STAR_EXTRACTION.md](STAR_EXTRACTION.md)
4. **Full Changelog**: [CHANGELOG_STAR.md](CHANGELOG_STAR.md)

---

## 9. Contact & Support

**Console Logs to Check:**
```javascript
// In login.html (F12 console)
console.log('Supabase client:', supabaseClient);
console.log('Config:', CONFIG);
```

**Supabase Logs to Check:**
1. Supabase Dashboard → Logs → Auth Logs
2. Look for failed signup/login attempts

---

**Last Updated:** December 2025
**Status:** All fixes applied, ready for testing
