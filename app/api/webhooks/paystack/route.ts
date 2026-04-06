import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

function verifyPaystackSignature(payload: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || '';
  const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature') || '';

    if (!verifyPaystackSignature(rawBody, signature)) {
      logger.warn('Invalid Paystack webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, data } = event;

    logger.info('Paystack webhook received', { event: eventType, reference: data?.reference });

    // Store webhook event
    const db = getDb();
    await db.collection(Collections.WEBHOOKS).add({
      source: 'paystack',
      event: eventType,
      payload: event,
      headers: { 'x-paystack-signature': '***' },
      receivedAt: new Date().toISOString(),
      status: 'received',
      tenantId: 'default',
    });

    // Handle specific events
    switch (eventType) {
      case 'charge.success':
        await handleChargeSuccess(data);
        break;
      case 'transfer.success':
        await handleTransferSuccess(data);
        break;
      case 'subscription.create':
        logger.info('Paystack subscription created', { code: data?.subscription_code });
        break;
      default:
        logger.info('Unhandled Paystack event', { event: eventType });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    logger.error('Paystack webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleChargeSuccess(data: Record<string, unknown>) {
  logger.info('Payment successful', {
    reference: data?.reference,
    amount: data?.amount,
    customer: (data?.customer as Record<string, unknown>)?.email,
  });
  // TODO: Update order status, send confirmation email, etc.
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  logger.info('Transfer successful', {
    reference: data?.reference,
    amount: data?.amount,
  });
}
