import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'DEBUG' | 'ERROR' | 'FATAL' | 'INFO' | 'WARN';

interface StructuredLogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  metadata?: Record<string, unknown>;
  service: string;
  environment: string;
}

@Injectable()
export class CloudLoggerService implements LoggerService {
  private readonly serviceName = process.env.APP_NAME ?? 'basic-rest-controller';
  private readonly environment = process.env.NODE_ENV ?? 'development';

  log(message: unknown, context?: string): void {
    this.write('INFO', message, context);
  }

  error(message: unknown, trace?: string, context?: string): void {
    const metadata = trace ? { trace } : undefined;
    this.write('ERROR', message, context, metadata);
  }

  warn(message: unknown, context?: string): void {
    this.write('WARN', message, context);
  }

  debug(message: unknown, context?: string): void {
    this.write('DEBUG', message, context);
  }

  verbose(message: unknown, context?: string): void {
    this.write('DEBUG', message, context);
  }

  fatal(message: unknown, context?: string): void {
    this.write('FATAL', message, context);
  }

  logHttpRequest(metadata: Record<string, unknown>): void {
    this.write('INFO', 'HTTP request completed', 'RequestLoggerMiddleware', metadata);
  }

  logHttpResponse(metadata: Record<string, unknown>): void {
    this.write('INFO', 'HTTP response sent', 'ResponseInterceptor', metadata);
  }

  logException(metadata: Record<string, unknown>): void {
    this.write('ERROR', 'Unhandled HTTP exception', 'HttpExceptionFilter', metadata);
  }

  private write(
    level: LogLevel,
    message: unknown,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    const payload: StructuredLogEntry = {
      level,
      message: this.normalizeMessage(message),
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      environment: this.environment,
    };

    if (context) {
      payload.context = context;
    }

    if (metadata && Object.keys(metadata).length > 0) {
      payload.metadata = metadata;
    }

    const serializedPayload = JSON.stringify(payload);

    if (level === 'ERROR' || level === 'FATAL') {
      process.stderr.write(`${serializedPayload}\n`);
      return;
    }

    process.stdout.write(`${serializedPayload}\n`);
  }

  private normalizeMessage(message: unknown): string {
    if (message instanceof Error) {
      return message.message;
    }

    if (typeof message === 'string') {
      return message;
    }

    return JSON.stringify(message);
  }
}