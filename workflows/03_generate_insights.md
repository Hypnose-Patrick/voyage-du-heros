# Workflow 3: Generate Final Insights

## Description
Génère la synthèse professionnelle complète après les 12 stations.

## Trigger
- **Type**: Webhook
- **Method**: POST
- **Path**: `/webhook/hero-journey/insights`

## Nodes Configuration

### 1. Webhook (Trigger)
```
Name: Generate Insights Webhook
Path: /hero-journey/insights
Method: POST
Expected Body:
{
  "journey_id": "uuid"
}
```

### 2. Decode JWT
```
Type: Function
Code:
const jwt = $input.item.headers.authorization?.replace('Bearer ', '');
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
return {
  user_id: payload.sub,
  journey_id: $input.item.body.journey_id
};
```

### 3. Verify Journey Completed
```
Type: Supabase
Operation: Run SQL Query
Query:
SELECT 
  hj.id,
  hj.user_id,
  hj.status,
  COUNT(js.id) as stages_completed
FROM hero_journeys hj
LEFT JOIN journey_stages js ON hj.id = js.journey_id
WHERE hj.id = '{{$json.journey_id}}'
  AND hj.user_id = '{{$json.user_id}}'
GROUP BY hj.id, hj.user_id, hj.status;
```

### 4. IF - Journey Valid
```
Type: IF
Conditions:
- {{$json.user_id}} is not empty
- {{$json.stages_completed}} equals 12
```

#### Branch TRUE: Generate Insights

**5. Get All Journey Stages**
```
Type: Supabase
Operation: Select
Table: journey_stages
Filter:
  journey_id equals {{$node["Decode JWT"].json.journey_id}}
Sort:
  stage_number ASC
```

**6. Get ICARE Profile**
```
Type: Supabase
Operation: Select
Table: icare_profiles
Filter:
  journey_id equals {{$node["Decode JWT"].json.journey_id}}
```

**7. Check Credits**
```
Type: Supabase
Operation: Run SQL Query
Query:
SELECT check_and_consume_credit('{{$node["Decode JWT"].json.user_id}}') as result;
```

**8. IF - Has Credits**
```
Type: IF
Condition:
{{$json.result[0].result.success}} equals true
```

**9. Build Synthesis Prompt**
```
Type: Function
Name: Prepare Synthesis Request
Code:
const stages = $node["Get All Journey Stages"].json;
const icare = $node["Get ICARE Profile"].json[0];

// Construire le contexte des 12 stations
let stagesContext = '';
stages.forEach((stage, index) => {
  stagesContext += `\n\n### Station ${stage.stage_number}: ${stage.stage_title}\n`;
  stagesContext += `**Réponse utilisateur:**\n${stage.user_input}\n`;
  stagesContext += `**Feedback IA:**\n${stage.ai_narrative}\n`;
  stagesContext += `**Insight:**\n${stage.ai_insight}`;
});

const systemPrompt = `Tu es un expert RH et coach carrière. Voici les 12 réponses d'un candidat en transition professionnelle:

${stagesContext}

**Profil ICARE Final:**
- Identité: ${icare.identite}/100
- Capacités: ${icare.capacites}/100
- Appartenance: ${icare.appartenance}/100
- Risque: ${icare.risque}/100
- Estime: ${icare.estime}/100

**Mission:** Génère une synthèse stratégique pour recherche d'emploi qui contient:

1. **Pitch professionnel** (3-4 phrases impactantes qui résument la valeur unique du candidat)
2. **Tagline** (1 phrase signature mémorable qui capture l'essence professionnelle)
3. **4 soft skills clés** déduites du parcours (liste)
4. **2 accomplissements majeurs** formatés pour CV avec:
   - Un titre percutant
   - Un bullet point descriptif
5. **Environnement de travail idéal** (description du cadre où le candidat s'épanouira)

**Format JSON strict requis:**
{
  "pitch": "3-4 phrases décrivant la valeur unique du candidat...",
  "tagline": "Une phrase signature mémorable",
  "soft_skills": ["Leadership", "Adaptabilité", "Communication", "Résilience"],
  "accomplishments": [
    {
      "title": "Titre percutant de l'accomplissement 1",
      "narrative": "• Description en 1-2 phrases avec impact mesurable"
    },
    {
      "title": "Titre percutant de l'accomplissement 2",
      "narrative": "• Description en 1-2 phrases avec impact mesurable"
    }
  ],
  "environment": "Description de l'environnement idéal pour ce candidat..."
}

**Règles:**
- Sois concret et actionnable
- Utilise le vocabulaire professionnel adapté
- Mets en valeur les forces sans édulcorer les axes de progression
- Le pitch doit être mémorable et authentique
- Les accomplissements doivent être crédibles et impressionnants`;

return {
  system: systemPrompt,
  user: "Génère maintenant la synthèse professionnelle complète au format JSON."
};
```

**10. OpenRouter API Call**
```
Type: HTTP Request
Method: POST
URL: https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer {{$env.OPENROUTER_API_KEY}}
  Content-Type: application/json
Body:
{
  "model": "{{$env.AI_MODEL}}",
  "messages": [
    {
      "role": "system",
      "content": "{{$node["Prepare Synthesis Request"].json.system}}"
    },
    {
      "role": "user",
      "content": "{{$node["Prepare Synthesis Request"].json.user}}"
    }
  ],
  "temperature": 0.8,
  "max_tokens": 2000,
  "response_format": { "type": "json_object" }
}
Timeout: 45000
```

**11. Parse AI Synthesis**
```
Type: Function
Name: Extract Insights
Code:
const aiResponse = JSON.parse($input.item.json.choices[0].message.content);

// Validation basique
if (!aiResponse.pitch || !aiResponse.tagline || !aiResponse.soft_skills) {
  throw new Error('Invalid AI response format');
}

return {
  pitch: aiResponse.pitch,
  tagline: aiResponse.tagline,
  soft_skills: aiResponse.soft_skills,
  accomplishments: aiResponse.accomplishments || [],
  environment: aiResponse.environment
};
```

**12. Insert Pro Insights**
```
Type: Supabase
Operation: Insert
Table: pro_insights
Data:
{
  "journey_id": "{{$node["Decode JWT"].json.journey_id}}",
  "pitch": "{{$node["Extract Insights"].json.pitch}}",
  "tagline": "{{$node["Extract Insights"].json.tagline}}",
  "soft_skills": {{$node["Extract Insights"].json.soft_skills}},
  "accomplishments": {{$node["Extract Insights"].json.accomplishments}},
  "environment": "{{$node["Extract Insights"].json.environment}}"
}
On Conflict: Do nothing (au cas où déjà généré)
```

**13. Format Success Response**
```
Type: Function
Code:
return {
  success: true,
  insights: {
    pitch: $node["Extract Insights"].json.pitch,
    tagline: $node["Extract Insights"].json.tagline,
    soft_skills: $node["Extract Insights"].json.soft_skills,
    accomplishments: $node["Extract Insights"].json.accomplishments,
    environment: $node["Extract Insights"].json.environment
  },
  credits_remaining: $node["Check Credits"].json.result[0].result.credits_remaining
};
```

**14. Respond to Webhook**
```
Type: Respond to Webhook
Status Code: 200
Body: {{$json}}
```

#### Branch FALSE (No Credits): Error Response

**15. Format Error**
```
Type: Function
Code:
return {
  success: false,
  error: 'INSUFFICIENT_CREDITS',
  message: 'Crédits insuffisants pour générer la synthèse'
};
```

**16. Respond Error**
```
Type: Respond to Webhook
Status Code: 402
Body: {{$json}}
```

#### Branch FALSE (Journey Invalid): Error Response

**17. Format Validation Error**
```
Type: Function
Code:
return {
  success: false,
  error: 'INVALID_JOURNEY',
  message: 'Parcours incomplet ou non trouvé. Toutes les 12 stations doivent être complétées.'
};
```

**18. Respond Validation Error**
```
Type: Respond to Webhook
Status Code: 400
Body: {{$json}}
```

## Error Handling

Error Trigger:
```
Type: Respond to Webhook
Status Code: 500
Body:
{
  "success": false,
  "error": "INTERNAL_ERROR",
  "message": "{{$json.message}}"
}
```

## Testing

```json
{
  "journey_id": "uuid-journey-completed"
}
```

Headers:
```
Authorization: Bearer eyJhbGc...token-jwt
Content-Type: application/json
```

## Notes Importantes

- **Timeout**: 45 secondes minimum (synthèse plus longue que feedback station)
- **Coût**: ~0.006$ par génération (2x station normale)
- **Idempotence**: Utiliser ON CONFLICT DO NOTHING pour éviter duplicatas
- **Validation**: Vérifier que les 12 stations sont bien complétées
- **Cache**: Optionnel - sauvegarder le résultat pour éviter régénération

## Exemple de Réponse Attendue

```json
{
  "success": true,
  "insights": {
    "pitch": "Développeur Full-Stack passionné avec 5 ans d'expérience, je transforme les défis techniques en solutions élégantes. Expert en React et Node.js, j'ai une approche collaborative du code et un désir profond d'apprendre en continu. Je recherche un environnement qui valorise l'innovation et l'autonomie.",
    "tagline": "Du code propre au service d'équipes engagées.",
    "soft_skills": [
      "Leadership technique",
      "Adaptabilité",
      "Communication transparente",
      "Résilience face au changement"
    ],
    "accomplishments": [
      {
        "title": "Refonte Architecture Microservices",
        "narrative": "• Migré application monolithique vers architecture microservices, réduisant les temps de déploiement de 60% et améliorant la scalabilité pour 100k+ utilisateurs"
      },
      {
        "title": "Mentorat Développeurs Junior",
        "narrative": "• Encadré 3 développeurs juniors vers l'autonomie complète en 6 mois, créant une culture d'apprentissage par le pair programming et code reviews constructives"
      }
    ],
    "environment": "Vous vous épanouissez dans une entreprise tech à taille humaine (20-100 personnes) où l'innovation est encouragée, la formation valorisée, et le management est collaboratif. Un environnement remote-friendly avec des rituels d'équipe réguliers vous permettra de combiner autonomie et appartenance."
  },
  "credits_remaining": 42
}
```
