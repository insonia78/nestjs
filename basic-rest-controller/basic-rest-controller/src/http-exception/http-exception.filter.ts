import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CloudLoggerService } from '../common/logging/cloud-logger.service';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  constructor(
    private readonly logger: CloudLoggerService = new CloudLoggerService(),
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      isSuccess: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Something went wrong',
      error: typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).error || 'Error occurred'
        : 'Error occurred',
    };

    this.logger.logException({
      requestId: response.getHeader('x-request-id') ?? null,
      method: request.method,
      path: request.url,
      statusCode: status,
      error: errorResponse.error,
      message: errorResponse.message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
