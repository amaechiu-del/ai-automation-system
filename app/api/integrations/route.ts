import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';
import { Integration, IntegrationType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default';

    const db = getDb();
    const snapshot = await db.collection(Collections.INTEGRATIONS)
      .where('tenantId', '==', tenantId)
      .orderBy('createdAt', 'desc')
      .get();

    const integrations = snapshot.docs.map(doc => {
      const data = doc.data() as Integration;
      // Mask sensitive config values
      const safeConfig: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data.config || {})) {
        safeConfig[k] = typeof v === 'string' && v.length > 4 ? `***${v.slice(-4)}` : v;
      }
      return { id: doc.id, ...data, config: safeConfig };
    });

    return NextResponse.json({ success: true, data: integrations });
  } catch (error) {
    logger.error('Failed to list integrations', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, config, tenantId = 'default' } = body as {
      type: IntegrationType;
      name: string;
      config: Record<string, unknown>;
      tenantId?: string;
    };

    if (!type || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields: type, name' }, { status: 400 });
    }

    const integration: Omit<Integration, 'id'> = {
      type,
      name,
      status: 'disconnected',
      config: config || {},
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = getDb();
    const docRef = await db.collection(Collections.INTEGRATIONS).add(integration);

    logger.info('Integration created', { id: docRef.id, type, name });
    return NextResponse.json({ success: true, data: { id: docRef.id, ...integration } }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create integration', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to create integration' }, { status: 500 });
  }
}
