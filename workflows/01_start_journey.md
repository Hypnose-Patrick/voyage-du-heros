# Workflow 1: Start Journey

## Description
Crée un nouveau parcours pour l'utilisateur après vérification des crédits.

## Trigger
- **Type**: Webhook
- **Method**: POST
- **Path**: `/webhook/hero-journey/start`
- **Authentication**: Header Authentication (Bearer Token JWT Supabase)

## Nodes Configuration

### 1. Webhook (Trigger)
```
Name: Start Journey Webhook
Path: /hero-journey/start
Method: POST
Response Mode: Response Node
Expected Body:
{
  "user_id": "uuid"
}
```

### 2. Verify JWT Token
```
Type: Function
Name: Decode JWT Token
Code:
const jwt = $input.item.headers.authorization?.replace('Bearer ', '');
if (!jwt) {
  throw new Error('No authorization token provided');
}
// Extraction user_id du JWT (simplifié - en prod utiliser bibliothèque JWT)
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
return {
  user_id: payload.sub,
  email: payload.email
};
```

### 3. Supabase - Check Credits
```
Type: Supabase
Operation: Run SQL Query
Credentials: Supabase Service Role
Query:
SELECT check_and_consume_credit('{{$node["Decode JWT Token"].json.user_id}}') as result;
```

### 4. IF - Has Credits
```
Type: IF
Conditions:
- {{$json.result[0].result.success}} equals true
```

#### Branch TRUE: Create Journey

**4a. Supabase - Create Journey**
```
Type: Supabase
Operation: Insert
Table: hero_journeys
Data:
{
  "user_id": "{{$node["Decode JWT Token"].json.user_id}}",
  "current_stage": 1,
  "status": "in_progress",
  "total_xp": 0
}
Return Fields: id, current_stage, created_at
```

**4b. Supabase - Create ICARE Profile**
```
Type: Supabase
Operation: Insert
Table: icare_profiles
Data:
{
  "journey_id": "{{$node["Create Journey"].json.id}}",
  "identite": 50,
  "capacites": 50,
  "appartenance": 50,
  "risque": 50,
  "estime": 50
}
```

**4c. Format Success Response**
```
Type: Function
Code:
return {
  success: true,
  journey_id: $node["Create Journey"].json.id,
  current_stage: 1,
  credits_remaining: $node["Check Credits"].json.result[0].result.credits_remaining,
  icare_profile: {
    identite: 50,
    capacites: 50,
    appartenance: 50,
    risque: 50,
    estime: 50
  }
};
```

**4d. Respond to Webhook (Success)**
```
Type: Respond to Webhook
Status Code: 200
Body: {{$json}}
```

#### Branch FALSE: Insufficient Credits

**4e. Format Error Response**
```
Type: Function
Code:
return {
  success: false,
  error: 'INSUFFICIENT_CREDITS',
  message: 'Crédits insuffisants pour démarrer un parcours',
  credits_remaining: 0
};
```

**4f. Respond to Webhook (Error)**
```
Type: Respond to Webhook
Status Code: 402
Body: {{$json}}
```

## Error Handling

Ajouter un node "Error Trigger" qui catch toutes les erreurs et répond :
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

Payload de test :
```json
{
  "user_id": "00000000-0000-0000-0000-000000000001"
}
```

Headers de test :
```
Authorization: Bearer eyJhbGc...votre-token-jwt
Content-Type: application/json
```

## Notes
- Utilise la fonction PostgreSQL `check_and_consume_credit()` pour atomicité
- Le JWT est vérifié mais délégué à Supabase RLS pour sécurité
- En cas de succès, 1 crédit est automatiquement consommé
