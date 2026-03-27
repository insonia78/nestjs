import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { CloudLoggerService } from '../logging/cloud-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CloudLoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = process.hrtime.bigint();
    const requestId = this.resolveRequestId(request);
    response.setHeader('x-request-id', requestId);

    let didLog = false;
    const logRequest = (): void => {
      if (didLog) {
        return;
      }

      didLog = true;
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

      this.logger.logHttpRequest({
        requestId,
        method: request.method,
        path: request.originalUrl || request.url,
        statusCode: response.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        ip: request.ip,
        userAgent: request.get('user-agent') ?? 'unknown',
        contentLength: response.getHeader('content-length') ?? null,
      });
    };

    response.on('finish', logRequest);
    response.on('close', logRequest);

    next();
  }

  private resolveRequestId(request: Request): string {
    const headerValue = request.headers['x-request-id'];

    if (typeof headerValue === 'string' && headerValue.trim().length > 0) {
      return headerValue;
    }

    if (Array.isArray(headerValue) && headerValue.length > 0) {
      return headerValue[0];
    }

    return randomUUID();
  }
}