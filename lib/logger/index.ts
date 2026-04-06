type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service?: string;
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'ai-automation-system',
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    const entry = formatLog('info', message, meta);
    console.log(JSON.stringify(entry));
  },
  warn(message: string, meta?: Record<string, unknown>) {
    const entry = formatLog('warn', message, meta);
    console.warn(JSON.stringify(entry));
  },
  error(message: string, meta?: Record<string, unknown>) {
    const entry = formatLog('error', message, meta);
    console.error(JSON.stringify(entry));
  },
  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      const entry = formatLog('debug', message, meta);
      console.debug(JSON.stringify(entry));
    }
  },
};
