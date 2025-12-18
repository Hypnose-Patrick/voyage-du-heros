# Workflows n8n - Hero Journey JobSeek

## Vue d'ensemble

4 workflows à configurer dans n8n pour gérer le backend du parcours du héros.

## URLs des Webhooks

```
https://your-n8n-instance.com/webhook/journey-start
https://your-n8n-instance.com/webhook/journey-stage
https://your-n8n-instance.com/webhook/journey-insights
https://your-n8n-instance.com/webhook/journey-get
```

---

## Workflow 1: Initialiser Parcours

**Webhook:** `POST /webhook/journey-start`

### Configuration

**Trigger:** Webhook
- Method: POST
- Authentication: Header Auth
- Header Name: `Authorization`
- Expected: `Bearer {supabase_jwt}`

### Nodes

```
1. Webhook Trigger (POST)
   ↓
2. Set Variables
   - Set journeyId = {{$json.body.journeyId || uuid()}}
   - Set userId = {{extract from JWT}}
   ↓
3. Supabase: Check Credits
   - Table: user_subscriptions
   - Action: GET
   - Filter: user_id = {{userId}}
   ↓
4. IF Credits > 0
   ↓ YES
   5. Supabase: Create Journey
      - Table: hero_journeys
      - Action: INSERT
      - Data: {
          user_id: {{userId}},
          current_stage: 1,
          status: 'in_progress',
          total_xp: 0
        }
   ↓
   6. Supabase: Create ICARE Profile
      - Table: icare_profiles
      - Action: INSERT
      - Data: {
          journey_id: {{journeyId}},
          identite: 50,
          capacites: 50,
          appartenance: 50,
          risque: 50,
          estime: 50
        }
   ↓
   7. Supabase: Decrement Credits
      - Table: user_subscriptions
      - Action: UPDATE
      - Data: {
          credits_remaining: {{credits - 1}}
        }
   ↓
   8. Respond: Success
      {
        "success": true,
        "journeyId": "{{journeyId}}",
        "currentStage": 1,
        "icareProfile": {...}
      }
   
   ↓ NO (Credits = 0)
   9. Respond: Error 402
      {
        "error": "Insufficient credits",
        "code": 402
      }
```

---

## Workflow 2: Soumettre Réponse Station

**Webhook:** `POST /webhook/journey-stage`

### Body Expected
```json
{
  "journeyId": "uuid",
  "stageNumber": 1-12,
  "userInput": "Réponse utilisateur..."
}
```

### Nodes

```
1. Webhook Trigger (POST)
   ↓
2. Extract JWT & Verify Ownership
   - Get userId from JWT
   - Check if journey belongs to user
   ↓
3. Supabase: Check Credits
   ↓
4. IF Credits > 0
   ↓
   5. Get Stage Config
      - Load stage title, prompt, ICARE focus
   ↓
   6. OpenRouter: Generate AI Response
      - Model: anthropic/claude-3.5-sonnet
      - System Prompt: "Tu es un coach emploi professionnel..."
      - User Prompt: 
        ```
        Station: {{stageTitle}}
        Objectif: {{stageGoal}}
        Réponse candidat: {{userInput}}
        
        Profil ICARE actuel:
        - Identité: {{icare.identite}}/100
        - Capacités: {{icare.capacites}}/100
        - Appartenance: {{icare.appartenance}}/100
        - Risque: {{icare.risque}}/100
        - Estime: {{icare.estime}}/100
        
        Génère:
        1. Feedback concret (3-4 phrases)
        2. Insight actionnable
        3. Ajustements ICARE (-10 à +10 par dimension)
        
        Format JSON strict:
        {
          "narrative": "...",
          "insight": "...",
          "icare_impact": {
            "identite": 0,
            "capacites": 5,
            "appartenance": -3,
            "risque": 8,
            "estime": 2
          }
        }
        ```
   ↓
   7. Parse AI Response (JSON)
   ↓
   8. Supabase: Insert Stage
      - Table: journey_stages
      - Data: {
          journey_id,
          stage_number,
          stage_title,
          user_input,
          ai_narrative,
          ai_insight,
          xp_gained: 125
        }
   ↓
   9. Supabase: Update ICARE Profile
      - Table: icare_profiles
      - Apply icare_impact adjustments
   ↓
   10. Supabase: Update Journey
       - current_stage += 1
       - total_xp += 125
   ↓
   11. Supabase: Decrement Credits
   ↓
   12. Respond: Success
       {
         "narrative": "...",
         "insight": "...",
         "newIcareProfile": {...},
         "nextStage": 2,
         "xpGained": 125
       }
```

---

## Workflow 3: Générer Synthèse Finale

**Webhook:** `POST /webhook/journey-insights`

### Body Expected
```json
{
  "journeyId": "uuid"
}
```

### Nodes

```
1. Webhook Trigger (POST)
   ↓
2. Verify Auth & Ownership
   ↓
3. Supabase: Get All Stages
   - Table: journey_stages
   - Filter: journey_id = {{journeyId}}
   - Check: 12 stages completed
   ↓
4. IF 12 stages completed
   ↓
   5. Supabase: Get ICARE Profile
   ↓
   6. OpenRouter: Generate Synthesis
      - Model: anthropic/claude-3.5-sonnet
      - System Prompt:
        ```
        Tu es un expert RH et coach carrière.
        
        Voici les 12 réponses d'un candidat en transition :
        
        Station 1 (Situation actuelle): {{stage1.userInput}}
        Feedback: {{stage1.aiNarrative}}
        
        Station 2 (Motivations): {{stage2.userInput}}
        ...
        Station 12 (Plan 90 jours): {{stage12.userInput}}
        
        Profil ICARE final:
        - Identité: {{icare.identite}}/100
        - Capacités: {{icare.capacites}}/100
        - Appartenance: {{icare.appartenance}}/100
        - Risque: {{icare.risque}}/100
        - Estime: {{icare.estime}}/100
        
        Génère une synthèse stratégique pour recherche d'emploi:
        - Pitch professionnel (3 phrases impactantes)
        - Tagline (1 phrase signature)
        - 4 soft skills clés déduites du parcours
        - 2 accomplissements majeurs formatés pour CV
        - Environnement de travail idéal
        
        Format JSON strict:
        {
          "pitch": "3 phrases...",
          "tagline": "1 phrase...",
          "softSkills": ["Skill1", "Skill2", "Skill3", "Skill4"],
          "accomplishments": [
            {"title": "...", "narrative": "..."},
            {"title": "...", "narrative": "..."}
          ],
          "environment": "Description..."
        }
        ```
   ↓
   7. Parse AI Response
   ↓
   8. Supabase: Insert Pro Insights
      - Table: pro_insights
   ↓
   9. Supabase: Update Journey
      - status = 'completed'
      - completed_at = NOW()
   ↓
   10. Supabase: Decrement Credits
   ↓
   11. Respond: Success
       {
         "pitch": "...",
         "tagline": "...",
         "softSkills": [...],
         "accomplishments": [...],
         "environment": "..."
       }
   
   ↓ NO (< 12 stages)
   12. Respond: Error 400
       {"error": "Journey not completed"}
```

---

## Workflow 4: Récupérer État Parcours

**Webhook:** `GET /webhook/journey-get/:journeyId`

### Nodes

```
1. Webhook Trigger (GET)
   ↓
2. Verify Auth & Ownership
   ↓
3. Supabase: Get Journey
   - Table: hero_journeys
   ↓
4. Supabase: Get All Stages
   - Table: journey_stages
   ↓
5. Supabase: Get ICARE Profile
   - Table: icare_profiles
   ↓
6. Supabase: Get Pro Insights (if completed)
   - Table: pro_insights
   ↓
7. Merge & Respond
   {
     "journey": {...},
     "stages": [...],
     "icareProfile": {...},
     "insights": {...} // null if not completed
   }
```

---

## Configuration Variables n8n

Dans Settings > Environment Variables:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
OPENROUTER_API_KEY=sk-or-v1-...
JWT_SECRET=your-jwt-secret
```

---

## Import dans n8n

1. Copier les JSON des workflows (à créer manuellement dans n8n UI)
2. Dans n8n: Settings > Import from JSON
3. Configurer les credentials Supabase + OpenRouter
4. Activer les workflows
5. Tester avec Postman/curl

---

## Les 12 Stations - Configuration

### Configuration à injecter dans le workflow 2 (node "Get Stage Config")

```javascript
const STAGES = {
  1: {
    title: "Votre situation professionnelle actuelle",
    prompt: "Décrivez votre poste actuel (ou dernier poste) et ce qui ne vous convient plus. Soyez concret : missions, environnement, ce qui vous frustre.",
    icareFocus: ["identite"],
    goal: "Diagnostic de départ"
  },
  2: {
    title: "Pourquoi changer maintenant ?",
    prompt: "Qu'est-ce qui vous pousse à envisager une transition ? Quels sont vos déclencheurs (événement, ras-le-bol, aspiration nouvelle) ?",
    icareFocus: ["identite", "estime"],
    goal: "Valider l'intention"
  },
  3: {
    title: "Vos freins au changement",
    prompt: "Quelles peurs vous empêchent d'agir ? (peur financière, peur du jugement, peur de l'échec, besoin de sécurité...)",
    icareFocus: ["risque", "estime"],
    goal: "Identifier les blocages"
  },
  4: {
    title: "Vos ressources disponibles",
    prompt: "Qui peut vous aider ? Quelles compétences possédez-vous déjà ? Quelles formations, réseaux, ou outils avez-vous à disposition ?",
    icareFocus: ["capacites", "appartenance"],
    goal: "Inventaire des atouts"
  },
  5: {
    title: "Votre premier engagement",
    prompt: "Quel est le premier acte concret que vous allez poser cette semaine ? (mise à jour CV, appel réseau, formation, candidature test...)",
    icareFocus: ["identite", "risque"],
    goal: "Passage à l'action"
  },
  6: {
    title: "Votre écosystème professionnel",
    prompt: "Listez 3 personnes qui vous soutiennent vraiment ET 3 obstacles récurrents (procrastination, perfectionnisme, manque de réseau...)",
    icareFocus: ["capacites", "appartenance", "estime"],
    goal: "Cartographie sociale"
  },
  7: {
    title: "Votre stratégie de recherche",
    prompt: "Quel type de poste visez-vous ? Dans quel secteur ? Avec quels critères non-négociables (salaire, lieu, horaires, missions) ?",
    icareFocus: ["identite", "capacites"],
    goal: "Définir la cible"
  },
  8: {
    title: "Votre plus grande peur professionnelle",
    prompt: "Quelle est LA peur qui vous paralyse le plus ? (syndrome de l'imposteur, peur du rejet, peur de la précarité...) Qu'est-ce qui serait le pire qui pourrait arriver ?",
    icareFocus: ["identite", "risque", "estime"],
    goal: "Affronter le blocage principal"
  },
  9: {
    title: "Vos premiers résultats",
    prompt: "Depuis le début de ce parcours, quels résultats avez-vous obtenus ? (candidatures envoyées, entretiens, nouvelles compétences acquises, confiance retrouvée...)",
    icareFocus: ["identite", "capacites", "appartenance"],
    goal: "Ancrer les gains"
  },
  10: {
    title: "Comment tenir sur la durée",
    prompt: "Comment allez-vous maintenir votre motivation si la recherche prend du temps ? Quelles routines mettre en place ?",
    icareFocus: ["risque", "identite"],
    goal: "Résilience"
  },
  11: {
    title: "Votre nouveau positionnement",
    prompt: "En une phrase, qui êtes-vous professionnellement maintenant ? Quel est votre pitch en 30 secondes ?",
    icareFocus: ["identite", "appartenance"],
    goal: "Affirmation identitaire"
  },
  12: {
    title: "Votre plan d'action 90 jours",
    prompt: "Listez 5 actions concrètes que vous allez mener dans les 90 prochains jours. Soyez précis et mesurable.",
    icareFocus: ["appartenance"],
    goal: "Plan d'action structuré"
  }
};

// Dans le node, utiliser:
return STAGES[$json.body.stageNumber];
```

---

## Test des Workflows

### 1. Test Initialisation

```bash
curl -X POST https://your-n8n.com/webhook/journey-start \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json"
```

### 2. Test Station

```bash
curl -X POST https://your-n8n.com/webhook/journey-stage \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "journeyId": "uuid-here",
    "stageNumber": 1,
    "userInput": "Je suis développeur depuis 5 ans mais je m'\''ennuie..."
  }'
```

### 3. Test Synthèse

```bash
curl -X POST https://your-n8n.com/webhook/journey-insights \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"journeyId": "uuid-here"}'
```

### 4. Test Get Journey

```bash
curl -X GET https://your-n8n.com/webhook/journey-get/uuid-here \
  -H "Authorization: Bearer YOUR_JWT"
```
