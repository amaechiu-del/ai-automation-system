import { logger } from '@/lib/logger';

export interface PaystackVerifyResult {
  success: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  reference?: string;
  customer?: { email: string; name: string };
  paidAt?: string;
  error?: string;
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResult> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return { success: false, error: 'Paystack not configured' };
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data?.status === 'success') {
      logger.info('Paystack transaction verified', { reference, amount: data.data.amount });
      return {
        success: true,
        status: data.data.status,
        amount: data.data.amount / 100, // Convert from kobo/pesewas
        currency: data.data.currency,
        reference: data.data.reference,
        customer: {
          email: data.data.customer?.email,
          name: data.data.customer?.first_name + ' ' + data.data.customer?.last_name,
        },
        paidAt: data.data.paid_at,
      };
    }

    return { success: false, status: data.data?.status, error: data.message };
  } catch (err) {
    logger.error('Paystack verification error', { reference, error: String(err) });
    return { success: false, error: String(err) };
  }
}

export async function initiatePaystackPayment(params: {
  email: string;
  amount: number; // in NGN/GHS (will be converted to kobo/pesewas)
  currency?: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack not configured');
  }

  const { email, amount, currency = 'NGN', reference, callbackUrl, metadata } = params;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo/pesewas
      currency,
      reference: reference || `REF-${Date.now()}`,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const data = await response.json();
  if (!data.status) throw new Error(data.message || 'Failed to initialize payment');

  logger.info('Paystack payment initiated', { email, amount, reference: data.data.reference });
  return data.data;
}
