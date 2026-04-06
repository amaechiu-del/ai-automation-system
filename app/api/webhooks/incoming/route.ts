import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-webhook-signature') || '';
    const source = request.headers.get('x-webhook-source') || 'unknown';

    // Verify signature if provided
    if (signature && process.env.WEBHOOK_SIGNING_SECRET) {
      const expectedSig = crypto
        .createHmac('sha256', process.env.WEBHOOK_SIGNING_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
      if (signature !== expectedSig) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const db = getDb();
    const webhookRef = await db.collection(Collections.WEBHOOKS).add({
      source,
      event: body.event || 'incoming',
      payload: body,
      headers: {
        'x-webhook-source': source,
        'content-type': request.headers.get('content-type') || '',
      },
      receivedAt: new Date().toISOString(),
      status: 'received',
      tenantId: body.tenantId || 'default',
    });

    logger.info('Incoming webhook received', { id: webhookRef.id, source, event: body.event });
    return NextResponse.json({ success: true, webhookId: webhookRef.id });
  } catch (error) {
    logger.error('Incoming webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
