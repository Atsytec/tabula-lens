export interface Logger {
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

export interface LogContext {
  component?: string;
  operation?: string;
  requestId?: string;
  userId?: string;
  table?: string;
  query?: Record<string, unknown>;
  error?: Error | string;
  stack?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'silent';

export interface LoggerOptions {
  level?: LogLevel;
  includeStack?: boolean;
  includeTimestamp?: boolean;
  colorize?: boolean;
  format?: 'json' | 'text' | 'pretty';
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function maskSensitiveData(data: string): string {
  // Mask database connection strings
  return data.replace(/:[^:@]+@/, ':****@');
}

class DefaultLogger implements Logger {
  private level: LogLevel;
  private includeStack: boolean;
  private includeTimestamp: boolean;
  private colorize: boolean;
  private format: 'json' | 'text' | 'pretty';

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || this.getDefaultLevel();
    this.includeStack = options.includeStack ?? false;
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.colorize = options.colorize ?? true;
    this.format = options.format || 'pretty';
  }

  private getDefaultLevel(): LogLevel {
    if (process.env.NODE_ENV === 'production') return 'error';
    if (process.env.NODE_ENV === 'test') return 'silent';
    return 'debug';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'silent'];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex && this.level !== 'silent';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = this.includeTimestamp ? new Date().toISOString() : undefined;
    const contextWithTimestamp = { ...context, timestamp };

    if (this.format === 'json') {
      return JSON.stringify({ level, message, context: contextWithTimestamp });
    }

    if (this.format === 'text') {
      const parts = [`[${level.toUpperCase()}]`, message];
      if (context) {
        parts.push(JSON.stringify(context));
      }
      return parts.join(' ');
    }

    // Pretty format
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      gray: '\x1b[90m',
    };

    const colorize = (str: string, color: keyof typeof colors) =>
      this.colorize ? `${colors[color]}${str}${colors.reset}` : str;

    const levelStr = colorize(
      level.toUpperCase().padEnd(5),
      level === 'error' ? 'red' : level === 'warn' ? 'yellow' : 'blue'
    );
    const timeStr = timestamp ? colorize(timestamp, 'gray') : '';
    const contextStr = context ? colorize(` ${JSON.stringify(context)}`, 'gray') : '';

    return `${timeStr} ${levelStr} ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
    }
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
}

class SilentLogger implements Logger {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
}

export function createLogger(options?: LoggerOptions): Logger {
  if (options?.level === 'silent') {
    return new SilentLogger();
  }
  return new DefaultLogger(options);
}

export { generateId, maskSensitiveData };
