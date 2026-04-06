import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default';

    const db = getDb();

    const [automationsSnap, tasksSnap, webhooksSnap] = await Promise.all([
      db.collection(Collections.AUTOMATIONS).where('tenantId', '==', tenantId).get(),
      db.collection(Collections.TASKS).where('tenantId', '==', tenantId).get(),
      db.collection(Collections.WEBHOOKS).where('tenantId', '==', tenantId).get(),
    ]);

    const automations = automationsSnap.docs.map(d => d.data());
    const tasks = tasksSnap.docs.map(d => d.data());

    const stats = {
      automations: {
        total: automations.length,
        active: automations.filter(a => a.status === 'active').length,
        paused: automations.filter(a => a.status === 'paused').length,
        draft: automations.filter(a => a.status === 'draft').length,
      },
      tasks: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        failed: tasks.filter(t => t.status === 'failed').length,
        running: tasks.filter(t => t.status === 'running').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        successRate: tasks.length > 0
          ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
          : 0,
      },
      webhooks: {
        total: webhooksSnap.size,
        processed: webhooksSnap.docs.filter(d => d.data().status === 'processed').length,
      },
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Failed to fetch analytics', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
