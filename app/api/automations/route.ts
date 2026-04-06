import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';
import { Automation, AutomationType, AutomationStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default';
    const status = searchParams.get('status') as AutomationStatus | null;
    const type = searchParams.get('type') as AutomationType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const db = getDb();
    let query = db.collection(Collections.AUTOMATIONS)
      .where('tenantId', '==', tenantId)
      .orderBy('createdAt', 'desc');

    if (status) query = query.where('status', '==', status) as typeof query;
    if (type) query = query.where('type', '==', type) as typeof query;

    const snapshot = await query.get();
    const automations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Automation[];

    const total = automations.length;
    const start = (page - 1) * pageSize;
    const paginated = automations.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    logger.error('Failed to list automations', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch automations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      type,
      schedule,
      triggerType,
      config,
      tenantId = 'default',
      createdBy = 'system',
    } = body;

    if (!name || !type || !triggerType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, type, triggerType' },
        { status: 400 }
      );
    }

    const automation: Omit<Automation, 'id'> = {
      name,
      description: description || '',
      type,
      status: 'draft',
      schedule,
      triggerType,
      config: config || {},
      tenantId,
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
      successCount: 0,
      failureCount: 0,
    };

    const db = getDb();
    const docRef = await db.collection(Collections.AUTOMATIONS).add(automation);

    logger.info('Automation created', { id: docRef.id, name, type });
    return NextResponse.json({ success: true, data: { id: docRef.id, ...automation } }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create automation', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to create automation' }, { status: 500 });
  }
}
