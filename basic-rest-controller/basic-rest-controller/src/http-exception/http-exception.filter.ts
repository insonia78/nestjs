import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse(); // Get the default exception response

    // Customize the response body
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
    console.error('Exception caught by filter:', errorResponse); // Log the error for debugging
    response.status(status).json(errorResponse);
  }
}
