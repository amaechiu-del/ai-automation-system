import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const doc = await db.collection(Collections.TASKS).doc(params.id).get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    logger.error('Failed to get task', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, output, error: taskError } = body;
    const db = getDb();
    const docRef = db.collection(Collections.TASKS).doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status) updates.status = status;
    if (output) updates.output = output;
    if (taskError) updates.error = taskError;
    if (status === 'completed' || status === 'failed') {
      updates.completedAt = new Date().toISOString();
      const startedAt = doc.data()?.startedAt;
      if (startedAt) {
        updates.duration = Date.now() - new Date(startedAt).getTime();
      }
    }

    await docRef.update(updates);
    return NextResponse.json({ success: true, data: { id: params.id, ...doc.data(), ...updates } });
  } catch (error) {
    logger.error('Failed to update task', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}
