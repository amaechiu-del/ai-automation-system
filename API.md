# DomisAuto API Documentation

Base URL: `https://your-domain.com/api`

## Authentication

All API routes support:
- **Bearer Token**: `Authorization: Bearer <firebase-id-token>`
- **API Key**: `X-API-Key: <your-api-key>`

## Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Automations

### List Automations
```http
GET /api/automations?tenantId=default&status=active&page=1&pageSize=20
```

### Create Automation
```http
POST /api/automations
Content-Type: application/json

{
  "name": "Daily Email Campaign",
  "description": "Send daily newsletter to subscribers",
  "type": "email",
  "triggerType": "schedule",
  "schedule": "0 9 * * *",
  "config": {
    "template": "newsletter",
    "recipients": "subscribers"
  },
  "tenantId": "default"
}
```

### Get Automation
```http
GET /api/automations/:id
```

### Update Automation
```http
PUT /api/automations/:id
Content-Type: application/json

{ "status": "active", "schedule": "0 10 * * *" }
```

### Delete Automation
```http
DELETE /api/automations/:id
```

### Run Automation
```http
POST /api/automations/:id/run
```

Response:
```json
{
  "success": true,
  "data": {
    "taskId": "abc123",
    "status": "pending",
    "message": "Automation queued for execution"
  }
}
```

## Tasks

### List Tasks
```http
GET /api/tasks?tenantId=default&status=completed&automationId=xyz&page=1
```

### Get Task
```http
GET /api/tasks/:id
```

### Update Task
```http
PATCH /api/tasks/:id
Content-Type: application/json

{ "status": "completed", "output": { "emailsSent": 150 } }
```

## Integrations

### List Integrations
```http
GET /api/integrations?tenantId=default
```

### Create Integration
```http
POST /api/integrations
Content-Type: application/json

{
  "type": "shopify",
  "name": "My Shopify Store",
  "config": {
    "storeUrl": "mystore.myshopify.com",
    "accessToken": "shpat_xxx"
  },
  "tenantId": "default"
}
```

## Webhooks

### Paystack Webhook
```http
POST /api/webhooks/paystack
X-Paystack-Signature: <hmac-sha512>
```

### Stripe Webhook
```http
POST /api/webhooks/stripe
Stripe-Signature: <stripe-sig>
```

### Generic Incoming Webhook
```http
POST /api/webhooks/incoming
X-Webhook-Source: my-service
X-Webhook-Signature: <hmac-sha256>
Content-Type: application/json

{ "event": "order.created", "data": { ... } }
```

## Analytics

```http
GET /api/analytics?tenantId=default
```

Response:
```json
{
  "success": true,
  "data": {
    "automations": { "total": 12, "active": 8, "paused": 2, "draft": 2 },
    "tasks": { "total": 1500, "completed": 1400, "failed": 50, "running": 50, "successRate": 93 },
    "webhooks": { "total": 350, "processed": 340 }
  }
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": {}
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — missing/invalid parameters |
| 401 | Unauthorized — invalid/missing auth |
| 404 | Not Found |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |
