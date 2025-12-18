# Workflows n8n - JobSeek Hero Journey

Ce dossier contient la documentation complète des 4 workflows n8n nécessaires pour l'application JobSeek Hero Journey.

## Structure des Workflows

1. **01_start_journey.json** - Initialiser un nouveau parcours
2. **02_submit_stage.json** - Traiter une réponse de station
3. **03_generate_insights.json** - Générer la synthèse finale
4. **04_get_journey.json** - Récupérer l'état d'un parcours

## Configuration Requise

### Variables d'Environnement n8n

Créez les variables suivantes dans votre instance n8n :

```
SUPABASE_URL=https://swhuaseyxprztxehkzjx.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key_ici
OPENROUTER_API_KEY=votre_openrouter_key_ici
AI_MODEL=anthropic/claude-3.5-sonnet
```

### Webhooks URLs

Chaque workflow expose un webhook. Notez les URLs après activation :

- **Start Journey**: `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start`
- **Submit Stage**: `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/stage`
- **Generate Insights**: `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/insights`
- **Get Journey**: `https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/get`

## Installation

1. Importez chaque fichier JSON dans n8n
2. Configurez les credentials Supabase (service_role key)
3. Configurez les credentials OpenRouter API
4. Activez tous les workflows
5. Notez les URLs des webhooks générés
6. Mettez à jour le fichier `config.js` du frontend avec les bonnes URLs

## Tests

### Test Workflow 1 - Start Journey

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "user_id": "uuid-de-votre-user"
  }'
```

### Test Workflow 2 - Submit Stage

```bash
curl -X POST https://n8n.srv824625.hstgr.cloud/webhook/hero-journey/stage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "journey_id": "uuid-du-journey",
    "stage_number": 1,
    "user_input": "Je suis développeur web depuis 5 ans...",
    "icare_profile": {
      "identite": 50,
      "capacites": 50,
      "appartenance": 50,
      "risque": 50,
      "estime": 50
    }
  }'
```

## Monitoring

- Vérifiez les logs n8n pour chaque exécution
- Surveillez les erreurs Supabase dans les logs
- Vérifiez la consommation de crédits OpenRouter

## Troubleshooting

### Erreur: Crédits insuffisants
- Vérifier la table `user_subscriptions`
- S'assurer que `credits_remaining > 0`

### Erreur: Journey not found
- Vérifier que le `journey_id` existe dans la table `hero_journeys`
- Vérifier que l'utilisateur est propriétaire du journey (RLS)

### Erreur: IA timeout
- Augmenter le timeout du node HTTP Request OpenRouter
- Vérifier que la clé API OpenRouter est valide
- Vérifier le quota OpenRouter

## Sécurité

- Les webhooks utilisent l'authentification JWT Supabase
- Le service_role key ne doit JAMAIS être exposé côté client
- Tous les accès sont filtrés par RLS Supabase
- Les données sensibles ne sont jamais loggées

## Performance

- Temps moyen par station : 5-8 secondes
- Cache des stations config dans n8n (optionnel)
- Utilisation de la fonction PostgreSQL pour vérifier crédits

## Support

Pour toute question sur les workflows :
- Consultez la documentation n8n : https://docs.n8n.io
- Vérifiez les logs dans l'interface n8n
- Testez les requêtes SQL directement dans Supabase
