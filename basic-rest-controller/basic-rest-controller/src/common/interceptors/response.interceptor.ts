import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CloudLoggerService } from '../logging/cloud-logger.service';

interface ApiSuccessResponse<T> {
  data: T;
  isSuccess: true;
  path: string;
  requestId: string | null;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  constructor(private readonly logger: CloudLoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<ApiSuccessResponse<T>>;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const payload: ApiSuccessResponse<T> = {
          data,
          isSuccess: true,
          path: request.originalUrl || request.url,
          requestId: this.getRequestId(response),
          timestamp: new Date().toISOString(),
        };

        this.logger.logHttpResponse({
          requestId: payload.requestId,
          method: request.method,
          path: payload.path,
          statusCode: response.statusCode,
          responseType: this.getResponseType(data),
        });

        return payload;
      }),
    );
  }

  private getRequestId(response: Response): string | null {
    const requestId = response.getHeader('x-request-id');
    return typeof requestId === 'string' ? requestId : null;
  }

  private getResponseType(body: T): string {
    if (Array.isArray(body)) {
      return 'array';
    }

    if (body === null) {
      return 'null';
    }

    return typeof body;
  }
}