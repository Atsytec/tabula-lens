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

    // Pretty format (browser console with styling)
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const timeStr = timestamp ? `[${timestamp}] ` : '';

    return `${timeStr}[${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    // Apply console styling for pretty format in browser
    if (this.format === 'pretty' && this.colorize) {
      const styles: Record<LogLevel, string> = {
        error: 'color: #ef4444; font-weight: bold;',
        warn: 'color: #f59e0b; font-weight: bold;',
        info: 'color: #3b82f6; font-weight: bold;',
        debug: 'color: #6b7280; font-weight: bold;',
        silent: 'color: #6b7280; font-weight: bold;',
      };

      const timestampStyle = 'color: #9ca3af; font-style: italic;';

      const timestamp = this.includeTimestamp ? new Date().toISOString() : '';
      const timeStr = timestamp ? `%c[${timestamp}]` : '';
      const msgStyle = styles[level] || styles.debug;

      if (timestamp) {
        console.log(
          `${timeStr} %c[${level.toUpperCase()}] ${message}`,
          timestampStyle,
          msgStyle,
          context || ''
        );
      } else {
        console.log(`%c[${level.toUpperCase()}] ${message}`, msgStyle, context || '');
      }
    } else {
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

export { generateId };
