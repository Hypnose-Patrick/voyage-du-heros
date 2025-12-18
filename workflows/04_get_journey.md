# Workflow 4: Get Journey

## Description
Récupère l'état complet d'un parcours avec toutes ses données (stations, ICARE, insights).

## Trigger
- **Type**: Webhook
- **Method**: GET
- **Path**: `/webhook/hero-journey/get/:journeyId`

## Nodes Configuration

### 1. Webhook (Trigger)
```
Name: Get Journey Webhook
Path: /hero-journey/get/:journeyId
Method: GET
Response Mode: Last Node
```

### 2. Decode JWT & Extract Journey ID
```
Type: Function
Code:
const jwt = $input.item.headers.authorization?.replace('Bearer ', '');
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
const journeyId = $input.item.params.journeyId;

return {
  user_id: payload.sub,
  journey_id: journeyId
};
```

### 3. Get Journey Data
```
Type: Supabase
Operation: Run SQL Query
Query:
SELECT get_journey_history(
  '{{$json.journey_id}}',
  '{{$json.user_id}}'
) as data;
```

Note: Utilise la fonction PostgreSQL `get_journey_history()` créée dans le schéma SQL

### 4. Parse Result
```
Type: Function
Name: Format Response
Code:
const data = $input.item.json.data;

if (data.error) {
  return {
    success: false,
    error: data.error === 'Unauthorized' ? 'UNAUTHORIZED' : 'NOT_FOUND',
    message: 'Parcours non trouvé ou accès refusé'
  };
}

return {
  success: true,
  data: data
};
```

### 5. Respond to Webhook
```
Type: Respond to Webhook
Status Code: {{$json.success ? 200 : 403}}
Body: {{$json}}
```

## Alternative: Manual Query (sans fonction PostgreSQL)

Si vous n'utilisez pas la fonction `get_journey_history()`, voici une approche manuelle :

### 3. Get Journey Info
```
Type: Supabase
Operation: Select
Table: hero_journeys
Filter:
  id equals {{$json.journey_id}}
  user_id equals {{$json.user_id}}
```

### 4. Get Journey Stages
```
Type: Supabase
Operation: Select
Table: journey_stages
Filter:
  journey_id equals {{$json.journey_id}}
Sort:
  stage_number ASC
```

### 5. Get ICARE Profile
```
Type: Supabase
Operation: Select
Table: icare_profiles
Filter:
  journey_id equals {{$json.journey_id}}
```

### 6. Get Pro Insights (Optional)
```
Type: Supabase
Operation: Select
Table: pro_insights
Filter:
  journey_id equals {{$json.journey_id}}
Optional: true
```

### 7. Merge All Data
```
Type: Function
Code:
const journey = $node["Get Journey Info"].json[0];
const stages = $node["Get Journey Stages"].json;
const icare = $node["Get ICARE Profile"].json[0];
const insights = $node["Get Pro Insights"].json[0] || null;

if (!journey) {
  return {
    success: false,
    error: 'NOT_FOUND',
    message: 'Parcours non trouvé'
  };
}

return {
  success: true,
  data: {
    journey: {
      id: journey.id,
      status: journey.status,
      current_stage: journey.current_stage,
      total_xp: journey.total_xp,
      started_at: journey.started_at,
      completed_at: journey.completed_at
    },
    stages: stages.map(s => ({
      stage_number: s.stage_number,
      stage_title: s.stage_title,
      user_input: s.user_input,
      ai_narrative: s.ai_narrative,
      ai_insight: s.ai_insight,
      xp_gained: s.xp_gained,
      completed_at: s.completed_at
    })),
    icare_profile: {
      identite: icare.identite,
      capacites: icare.capacites,
      appartenance: icare.appartenance,
      risque: icare.risque,
      estime: icare.estime
    },
    pro_insights: insights ? {
      pitch: insights.pitch,
      tagline: insights.tagline,
      soft_skills: insights.soft_skills,
      accomplishments: insights.accomplishments,
      environment: insights.environment,
      created_at: insights.created_at
    } : null
  }
};
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

**Request:**
```bash
GET https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/get/uuid-du-journey

Headers:
Authorization: Bearer eyJhbGc...token-jwt
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "journey": {
      "id": "uuid-journey",
      "status": "in_progress",
      "current_stage": 5,
      "total_xp": 500,
      "started_at": "2025-12-15T10:00:00Z",
      "completed_at": null
    },
    "stages": [
      {
        "stage_number": 1,
        "stage_title": "Votre situation professionnelle actuelle",
        "user_input": "Je suis développeur...",
        "ai_narrative": "Votre situation révèle...",
        "ai_insight": "Focus sur...",
        "xp_gained": 125,
        "completed_at": "2025-12-15T10:15:00Z"
      }
      // ... autres stations
    ],
    "icare_profile": {
      "identite": 65,
      "capacites": 72,
      "appartenance": 48,
      "risque": 55,
      "estime": 60
    },
    "pro_insights": null
  }
}
```

**Response Error (403):**
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Parcours non trouvé ou accès refusé"
}
```

## Use Cases

1. **Reprendre un parcours**: Frontend charge l'état pour afficher la station actuelle
2. **Dashboard utilisateur**: Afficher progression et historique
3. **Export PDF**: Récupérer toutes les données pour génération PDF
4. **Debugging**: Vérifier l'état d'un parcours côté admin

## Notes

- **Performance**: Utiliser la fonction PostgreSQL est plus rapide
- **Cache**: Possibilité de mettre en cache côté frontend (court terme)
- **Sécurité**: RLS Supabase assure qu'un user ne voit que ses données
- **Pagination**: Non nécessaire (max 12 stations par journey)
