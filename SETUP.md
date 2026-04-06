# DomisAuto Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Firebase project
- (Optional) Redis for local task queue

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/amaechiu-del/ai-automation-system.git
cd ai-automation-system
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. At minimum, configure Firebase:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:9002 for the home page and http://localhost:9002/dashboard for the dashboard.

## Docker Setup

```bash
# Start all services (app + Redis)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Firebase Setup

### Deploy Firestore Rules

```bash
firebase login
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Firebase Hosting

Update `firebase.json` to point to your Next.js output directory, then:
```bash
npm run build
firebase deploy --only hosting
```

## CI/CD

The GitHub Actions workflows in `.github/workflows/` handle:
- `ci.yml` — Lint, type-check, build, security scan on every PR
- `deploy.yml` — Deploy to Firebase on merge to main/master

### Required GitHub Secrets

Add these in Settings → Secrets → Actions:
- `FIREBASE_TOKEN` — Firebase deploy token (`firebase login:ci`)
- `FIREBASE_PROJECT_ID` — Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` — Service account private key
- `FIREBASE_CLIENT_EMAIL` — Service account email
- `STRIPE_SECRET_KEY` — Stripe API secret
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `PAYSTACK_SECRET_KEY` — Paystack secret key
- `PAYSTACK_WEBHOOK_SECRET` — Paystack webhook secret
- `TWILIO_ACCOUNT_SID` — Twilio account SID
- `TWILIO_AUTH_TOKEN` — Twilio auth token
- `SENDGRID_API_KEY` — SendGrid API key

## Webhook Configuration

### Paystack
Set webhook URL in Paystack dashboard: `https://your-domain.com/api/webhooks/paystack`

### Stripe
Set webhook URL in Stripe dashboard: `https://your-domain.com/api/webhooks/stripe`
Events to listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.created`, `invoice.paid`

### Generic Webhooks
Send to: `POST https://your-domain.com/api/webhooks/incoming`
With header: `X-Webhook-Source: your-service-name`
