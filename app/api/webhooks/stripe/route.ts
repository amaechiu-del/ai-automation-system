import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

// Stripe v22 uses function-style constructor (not class-based)
const Stripe = require('stripe'); // eslint-disable-line

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

    let stripeEvent: Record<string, unknown>;
    try {
      stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as Record<string, unknown>;
    } catch (err) {
      logger.warn('Invalid Stripe webhook signature', { error: String(err) });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const eventType = stripeEvent.type as string;
    logger.info('Stripe webhook received', { type: eventType, id: stripeEvent.id });

    const db = getDb();
    await db.collection(Collections.WEBHOOKS).add({
      source: 'stripe',
      event: eventType,
      payload: { id: stripeEvent.id, type: eventType, data: stripeEvent.data },
      headers: { 'stripe-signature': '***' },
      receivedAt: new Date().toISOString(),
      status: 'received',
      tenantId: 'default',
    });

    const eventData = stripeEvent.data as Record<string, Record<string, string>>;
    switch (eventType) {
      case 'payment_intent.succeeded':
        logger.info('Stripe payment succeeded', { id: eventData?.object?.id });
        break;
      case 'payment_intent.payment_failed':
        logger.warn('Stripe payment failed', { id: eventData?.object?.id });
        break;
      case 'customer.subscription.created':
        logger.info('Stripe subscription created', { id: eventData?.object?.id });
        break;
      case 'invoice.paid':
        logger.info('Stripe invoice paid', { id: eventData?.object?.id });
        break;
      default:
        logger.debug('Unhandled Stripe event', { type: eventType });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
