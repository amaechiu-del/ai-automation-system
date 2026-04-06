import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export interface AuthContext {
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

export async function requireAuth(
  request: NextRequest
): Promise<{ context: AuthContext } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');

  // Support API key authentication
  if (apiKey) {
    if (apiKey === process.env.WEBHOOK_SIGNING_SECRET) {
      return {
        context: {
          userId: 'system',
          email: 'system@domislink.com',
          role: 'admin',
        },
      };
    }
    return {
      error: NextResponse.json({ error: 'Invalid API key' }, { status: 401 }),
    };
  }

  // Support Bearer token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // In production, verify Firebase ID token here
    // For now, validate token format
    if (!token || token.length < 10) {
      return {
        error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
      };
    }
    // TODO: Verify Firebase ID token with admin SDK
    return {
      context: {
        userId: 'authenticated-user',
        email: 'user@domislink.com',
        role: 'user',
      },
    };
  }

  logger.warn('Unauthorized request', { path: request.nextUrl.pathname });
  return {
    error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
  };
}

export function createSuccessResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function createErrorResponse(message: string, status = 500, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}
