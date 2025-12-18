# Workflow 2: Submit Stage

## Description
Traite la réponse utilisateur pour une station, génère le feedback IA, et met à jour le profil ICARE.

## Trigger
- **Type**: Webhook
- **Method**: POST
- **Path**: `/webhook/hero-journey/stage`

## Nodes Configuration

### 1. Webhook (Trigger)
```
Name: Submit Stage Webhook
Path: /hero-journey/stage
Method: POST
Expected Body:
{
  "journey_id": "uuid",
  "stage_number": 1,
  "user_input": "Ma réponse...",
  "icare_profile": {
    "identite": 50,
    "capacites": 50,
    "appartenance": 50,
    "risque": 50,
    "estime": 50
  }
}
```

### 2. Decode JWT
```
Type: Function
Name: Extract User ID
Code:
const jwt = $input.item.headers.authorization?.replace('Bearer ', '');
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
return {
  user_id: payload.sub,
  ...$ input.item.body
};
```

### 3. Verify Ownership & Credits
```
Type: Supabase
Operation: Run SQL Query
Query:
SELECT 
  hj.id,
  hj.user_id,
  hj.current_stage,
  (SELECT credits_remaining FROM user_subscriptions WHERE user_id = hj.user_id) as credits
FROM hero_journeys hj
WHERE hj.id = '{{$json.journey_id}}'
  AND hj.user_id = '{{$json.user_id}}';
```

### 4. IF - Valid & Has Credits
```
Type: IF
Conditions:
- {{$json.credits}} > 0
- {{$json.user_id}} is not empty
```

#### Branch TRUE: Process Stage

**5. Get Station Config**
```
Type: Supabase
Operation: Select
Table: stations_config
Filter:
stage_number equals {{$node["Webhook"].json.body.stage_number}}
```

**6. Build AI Prompt**
```
Type: Function
Name: Prepare AI Request
Code:
const station = $node["Get Station Config"].json[0];
const userInput = $node["Webhook"].json.body.user_input;
const icare = $node["Webhook"].json.body.icare_profile;

const systemPrompt = `Tu es un coach emploi spécialisé en reconversion professionnelle.

Station actuelle: ${station.title}
Objectif: ${station.objective}

Profil ICARE actuel:
- Identité: ${icare.identite}/100
- Capacités: ${icare.capacites}/100
- Appartenance: ${icare.appartenance}/100
- Risque: ${icare.risque}/100
- Estime: ${icare.estime}/100

Tâches:
1. Analyser la réponse du candidat
2. Générer un feedback concret et actionnable (3-4 phrases)
3. Proposer 1 insight stratégique pour la recherche d'emploi
4. Ajuster les scores ICARE selon la réponse (-10 à +10 par dimension)

Format de réponse JSON strict:
{
  "narrative": "Votre feedback en 3-4 phrases...",
  "insight": "Un insight actionnable...",
  "icare_impact": {
    "identite": 0,
    "capacites": 0,
    "appartenance": 0,
    "risque": 0,
    "estime": 0
  }
}

Règle: Reste factuel, bienveillant mais exigeant. Pas de langue de bois.`;

return {
  system: systemPrompt,
  user: `Réponse du candidat:\n"${userInput}"`
};
```

**7. OpenRouter API Call**
```
Type: HTTP Request
Method: POST
URL: https://openrouter.ai/api/v1/chat/completions
Authentication: Bearer Token
Headers:
  Authorization: Bearer {{$env.OPENROUTER_API_KEY}}
  Content-Type: application/json
  HTTP-Referer: https://jobseek.online
  X-Title: JobSeek Hero Journey
Body:
{
  "model": "{{$env.AI_MODEL}}",
  "messages": [
    {
      "role": "system",
      "content": "{{$node["Prepare AI Request"].json.system}}"
    },
    {
      "role": "user",
      "content": "{{$node["Prepare AI Request"].json.user}}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000,
  "response_format": { "type": "json_object" }
}
Timeout: 30000
```

**8. Parse AI Response**
```
Type: Function
Name: Extract AI Data
Code:
const aiResponse = JSON.parse($input.item.json.choices[0].message.content);
const currentIcare = $node["Webhook"].json.body.icare_profile;

// Calculer nouveaux scores ICARE (capping 0-100)
const newIcare = {
  identite: Math.max(0, Math.min(100, currentIcare.identite + aiResponse.icare_impact.identite)),
  capacites: Math.max(0, Math.min(100, currentIcare.capacites + aiResponse.icare_impact.capacites)),
  appartenance: Math.max(0, Math.min(100, currentIcare.appartenance + aiResponse.icare_impact.appartenance)),
  risque: Math.max(0, Math.min(100, currentIcare.risque + aiResponse.icare_impact.risque)),
  estime: Math.max(0, Math.min(100, currentIcare.estime + aiResponse.icare_impact.estime))
};

return {
  narrative: aiResponse.narrative,
  insight: aiResponse.insight,
  new_icare: newIcare
};
```

**9. Insert Journey Stage**
```
Type: Supabase
Operation: Insert
Table: journey_stages
Data:
{
  "journey_id": "{{$node["Webhook"].json.body.journey_id}}",
  "stage_number": {{$node["Webhook"].json.body.stage_number}},
  "stage_title": "{{$node["Get Station Config"].json[0].title}}",
  "user_input": "{{$node["Webhook"].json.body.user_input}}",
  "ai_narrative": "{{$node["Extract AI Data"].json.narrative}}",
  "ai_insight": "{{$node["Extract AI Data"].json.insight}}",
  "xp_gained": 125
}
```

**10. Update ICARE Profile**
```
Type: Supabase
Operation: Update
Table: icare_profiles
Filter:
  journey_id equals {{$node["Webhook"].json.body.journey_id}}
Data:
{
  "identite": {{$node["Extract AI Data"].json.new_icare.identite}},
  "capacites": {{$node["Extract AI Data"].json.new_icare.capacites}},
  "appartenance": {{$node["Extract AI Data"].json.new_icare.appartenance}},
  "risque": {{$node["Extract AI Data"].json.new_icare.risque}},
  "estime": {{$node["Extract AI Data"].json.new_icare.estime}}
}
```

**11. Update Journey Progress**
```
Type: Supabase
Operation: Update
Table: hero_journeys
Filter:
  id equals {{$node["Webhook"].json.body.journey_id}}
Data:
{
  "current_stage": {{$node["Webhook"].json.body.stage_number}} + 1,
  "total_xp": "total_xp + 125"
}
```

**12. Consume Credit**
```
Type: Supabase
Operation: Update
Table: user_subscriptions
Filter:
  user_id equals {{$node["Extract User ID"].json.user_id}}
Data:
{
  "credits_remaining": "credits_remaining - 1"
}
Return: credits_remaining
```

**13. IF - Is Final Stage (Stage 12)**
```
Type: IF
Condition:
{{$node["Webhook"].json.body.stage_number}} equals 12
```

**Branch TRUE (Stage 12):**
```
Type: Supabase
Operation: Update
Table: hero_journeys
Filter: id equals {{$node["Webhook"].json.body.journey_id}}
Data:
{
  "status": "completed",
  "completed_at": "NOW()"
}
```

**14. Format Success Response**
```
Type: Function
Code:
return {
  success: true,
  narrative: $node["Extract AI Data"].json.narrative,
  insight: $node["Extract AI Data"].json.insight,
  new_icare_profile: $node["Extract AI Data"].json.new_icare,
  next_stage: $node["Webhook"].json.body.stage_number + 1,
  credits_remaining: $node["Consume Credit"].json.credits_remaining,
  is_completed: $node["Webhook"].json.body.stage_number >= 12
};
```

**15. Respond to Webhook**
```
Type: Respond to Webhook
Status Code: 200
Body: {{$json}}
```

#### Branch FALSE: Error

**16. Format Error Response**
```
Type: Function
Code:
return {
  success: false,
  error: $node["Verify Ownership & Credits"].json.credits ? 'INSUFFICIENT_CREDITS' : 'UNAUTHORIZED',
  message: $node["Verify Ownership & Credits"].json.credits ? 'Crédits insuffisants' : 'Parcours non trouvé ou accès refusé'
};
```

**17. Respond Error**
```
Type: Respond to Webhook
Status Code: 402
Body: {{$json}}
```

## Error Handling

Error Trigger node:
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
  "journey_id": "uuid-du-journey",
  "stage_number": 1,
  "user_input": "Je suis développeur web depuis 5 ans. J'aime créer des applications mais je me sens bloqué dans une routine. Mon entreprise n'investit plus dans la formation et je sens que je stagne. L'environnement est devenu toxique avec un management directif qui ne valorise pas le travail d'équipe.",
  "icare_profile": {
    "identite": 50,
    "capacites": 50,
    "appartenance": 50,
    "risque": 50,
    "estime": 50
  }
}
```

## Notes Importantes

- **Timeout OpenRouter**: 30 secondes minimum
- **JSON Response Format**: Assurez que OpenRouter retourne du JSON valide
- **ICARE Capping**: Toujours entre 0-100
- **Atomicité**: Utiliser des transactions si possible
- **Rate Limiting**: Implémenter côté application si nécessaire
- **Coût**: ~0.003$ par requête Claude Sonnet 3.5
