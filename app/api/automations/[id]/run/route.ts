import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';
import { Task, Automation } from '@/lib/types';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const automationDoc = await db.collection(Collections.AUTOMATIONS).doc(params.id).get();

    if (!automationDoc.exists) {
      return NextResponse.json({ success: false, error: 'Automation not found' }, { status: 404 });
    }

    const automation = { id: automationDoc.id, ...automationDoc.data() } as Automation;

    // Create task
    const task: Omit<Task, 'id'> = {
      automationId: params.id,
      automationName: automation.name,
      status: 'pending',
      startedAt: new Date().toISOString(),
      input: automation.config,
      retryCount: 0,
      maxRetries: 3,
      tenantId: automation.tenantId,
      logs: [{
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Task queued for automation: ${automation.name}`,
      }],
    };

    const taskRef = await db.collection(Collections.TASKS).add(task);

    // Update automation run stats
    await db.collection(Collections.AUTOMATIONS).doc(params.id).update({
      lastRunAt: new Date().toISOString(),
      runCount: (automation.runCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    logger.info('Automation triggered', { automationId: params.id, taskId: taskRef.id });

    return NextResponse.json({
      success: true,
      data: { taskId: taskRef.id, status: 'pending', message: 'Automation queued for execution' },
    }, { status: 202 });
  } catch (error) {
    logger.error('Failed to run automation', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to trigger automation' }, { status: 500 });
  }
}
