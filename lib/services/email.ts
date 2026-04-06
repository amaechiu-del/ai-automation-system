import { logger } from '@/lib/logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, text, from, replyTo } = options;
  const fromAddress = from || process.env.EMAIL_FROM || 'noreply@domislink.com';

  // SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }] }],
          from: { email: fromAddress },
          reply_to: replyTo ? { email: replyTo } : undefined,
          subject,
          content: [
            { type: 'text/plain', value: text || html.replace(/<[^>]*>/g, '') },
            { type: 'text/html', value: html },
          ],
        }),
      });

      if (response.ok) {
        const messageId = response.headers.get('X-Message-Id') || 'unknown';
        logger.info('Email sent via SendGrid', { to, subject, messageId });
        return { success: true, messageId };
      }

      const error = await response.text();
      logger.error('SendGrid error', { error, status: response.status });
      return { success: false, error };
    } catch (err) {
      logger.error('Failed to send email via SendGrid', { error: String(err) });
      return { success: false, error: String(err) };
    }
  }

  logger.warn('No email provider configured', { to, subject });
  return { success: false, error: 'No email provider configured. Set SENDGRID_API_KEY or SMTP_* variables.' };
}

export async function sendBulkEmail(emails: EmailOptions[]): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const result = await sendEmail(email);
    if (result.success) {
      sent++;
    } else {
      failed++;
      logger.error('Bulk email failure', { to: email.to, error: result.error });
    }
    // Rate limiting: wait 100ms between emails
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  logger.info('Bulk email complete', { total: emails.length, sent, failed });
  return { sent, failed };
}
