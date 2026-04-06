# DomisAuto AI Automation System — Architecture

## Overview

DomisAuto is an enterprise-grade AI automation platform built on Next.js 14.2 with Firebase as the primary database. It provides a comprehensive suite of automation workflows for businesses operating on the domislink.com platform.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│   Next.js Dashboard │ REST API Clients │ Webhooks        │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                  │
│  /api/automations  /api/tasks  /api/integrations        │
│  /api/webhooks     /api/analytics  /api/health          │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│  EmailService │ PaymentService │ SMSService             │
│  ShopifyService │ WordPressService │ SocialMediaService  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  Firebase Firestore │ Redis (Queue/Cache) │ Supabase    │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### API Routes (`app/api/`)
- `GET/POST /api/automations` — List and create automations
- `GET/PUT/DELETE /api/automations/[id]` — Manage specific automation
- `POST /api/automations/[id]/run` — Trigger automation manually
- `GET/PATCH /api/tasks` — Task monitoring and management
- `GET/POST /api/integrations` — Integration management
- `POST /api/webhooks/paystack` — Paystack webhook handler
- `POST /api/webhooks/stripe` — Stripe webhook handler
- `POST /api/webhooks/incoming` — Generic webhook ingestion
- `GET /api/analytics` — System metrics
- `GET /api/health` — Health check endpoint

### Firestore Collections
| Collection | Purpose |
|-----------|---------|
| `automations` | Workflow definitions and configuration |
| `tasks` | Task execution history and status |
| `integrations` | Third-party API credentials (encrypted) |
| `webhooks` | Incoming/outgoing webhook event log |
| `logs` | Structured audit trail |
| `users` | Multi-tenant user management |

### Automation Types
| Type | Description |
|------|-------------|
| `email` | Email campaigns, newsletters, transactional |
| `social_media` | Twitter, LinkedIn post scheduling |
| `web_scraping` | Puppeteer/Playwright data extraction |
| `shopify_sync` | Inventory sync, order automation |
| `payment_reconciliation` | Stripe/Paystack transaction matching |
| `wordpress_publish` | Bulk CMS content management |
| `sms_campaign` | Twilio SMS/voice automation |
| `data_pipeline` | ETL, data transformation |
| `webhook_trigger` | Event-driven automation |
| `file_processing` | Image, PDF, document handling |

## Multi-Tenancy

The system supports multiple tenants via subdomain routing (middleware.ts):
- `agent1.domislink.com` → tenant: `agent1`
- `agent2.domislink.com` → tenant: `agent2`
- `domislink.com` → root tenant

Each tenant's data is isolated via `tenantId` in Firestore with security rules enforcing ownership.

## Security Model
- Firebase Authentication for user identity
- API key authentication for service-to-service calls
- Webhook signature verification (HMAC-SHA256/SHA512)
- Firestore security rules with tenant isolation
- Input validation on all API endpoints
- Secrets managed via environment variables

## Environment Variables

See `.env.example` for the complete list of required configuration.
