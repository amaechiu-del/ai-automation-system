export type AutomationType =
  | 'email'
  | 'social_media'
  | 'web_scraping'
  | 'payment_reconciliation'
  | 'shopify_sync'
  | 'wordpress_publish'
  | 'sms_campaign'
  | 'data_pipeline'
  | 'webhook_trigger'
  | 'file_processing';

export type AutomationStatus = 'active' | 'paused' | 'draft' | 'archived';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
export type IntegrationType =
  | 'stripe'
  | 'paystack'
  | 'twilio'
  | 'sendgrid'
  | 'twitter'
  | 'linkedin'
  | 'shopify'
  | 'wordpress'
  | 'firebase'
  | 'supabase';

export interface Automation {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  status: AutomationStatus;
  schedule?: string; // cron expression
  triggerType: 'schedule' | 'webhook' | 'manual' | 'event';
  config: Record<string, unknown>;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount: number;
  successCount: number;
  failureCount: number;
}

export interface Task {
  id: string;
  automationId: string;
  automationName: string;
  status: TaskStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  retryCount: number;
  maxRetries: number;
  tenantId: string;
  logs: TaskLog[];
}

export interface TaskLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: Record<string, unknown>;
}

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>; // encrypted in production
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  lastTestedAt?: string;
}

export interface WebhookEvent {
  id: string;
  source: string;
  event: string;
  payload: Record<string, unknown>;
  headers: Record<string, string>;
  receivedAt: string;
  processedAt?: string;
  status: 'received' | 'processed' | 'failed';
  automationId?: string;
  tenantId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
