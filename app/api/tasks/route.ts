import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';
import { TaskStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default';
    const status = searchParams.get('status') as TaskStatus | null;
    const automationId = searchParams.get('automationId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const db = getDb();
    let query = db.collection(Collections.TASKS)
      .where('tenantId', '==', tenantId)
      .orderBy('startedAt', 'desc');

    if (status) query = query.where('status', '==', status) as typeof query;
    if (automationId) query = query.where('automationId', '==', automationId) as typeof query;

    const snapshot = await query.get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const total = tasks.length;
    const start = (page - 1) * pageSize;
    const paginated = tasks.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    logger.error('Failed to list tasks', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
