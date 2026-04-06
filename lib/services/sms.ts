import { logger } from '@/lib/logger';

export interface SmsOptions {
  to: string;
  message: string;
  from?: string;
}

export interface SmsResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

export async function sendSms(options: SmsOptions): Promise<SmsResult> {
  const { to, message, from } = options;
  const fromNumber = from || process.env.TWILIO_PHONE_NUMBER;

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    logger.warn('Twilio not configured');
    return { success: false, error: 'Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.' };
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber || '',
          Body: message,
        }).toString(),
      }
    );

    const data = await response.json();

    if (response.ok && data.sid) {
      logger.info('SMS sent', { to, sid: data.sid });
      return { success: true, messageSid: data.sid };
    }

    logger.error('Twilio error', { error: data.message, code: data.code });
    return { success: false, error: data.message };
  } catch (err) {
    logger.error('Failed to send SMS', { error: String(err) });
    return { success: false, error: String(err) };
  }
}

export async function sendBulkSms(messages: SmsOptions[]): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const sms of messages) {
    const result = await sendSms(sms);
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  logger.info('Bulk SMS complete', { total: messages.length, sent, failed });
  return { sent, failed };
}
