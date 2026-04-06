import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/firestore';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const doc = await db.collection(Collections.AUTOMATIONS).doc(params.id).get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Automation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    logger.error('Failed to get automation', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to fetch automation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const db = getDb();
    const docRef = db.collection(Collections.AUTOMATIONS).doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Automation not found' }, { status: 404 });
    }

    const updates = { ...body, updatedAt: new Date().toISOString() };
    delete updates.id;
    await docRef.update(updates);

    logger.info('Automation updated', { id: params.id });
    return NextResponse.json({ success: true, data: { id: params.id, ...doc.data(), ...updates } });
  } catch (error) {
    logger.error('Failed to update automation', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to update automation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const docRef = db.collection(Collections.AUTOMATIONS).doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Automation not found' }, { status: 404 });
    }
    await docRef.delete();
    logger.info('Automation deleted', { id: params.id });
    return NextResponse.json({ success: true, message: 'Automation deleted' });
  } catch (error) {
    logger.error('Failed to delete automation', { id: params.id, error: String(error) });
    return NextResponse.json({ success: false, error: 'Failed to delete automation' }, { status: 500 });
  }
}
