import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CloudLoggerService } from '../logging/cloud-logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: CloudLoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    // console.log('AuthGuard#canActivate called',context);
    // if (context.getType() !== 'http') {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest<Request>();
    const bearerToken = this.extractBearerToken(request);
    const apiKey = this.extractApiKey(request);
    const expectedBearerToken = process.env.AUTH_BEARER_TOKEN;
    const expectedApiKey = process.env.API_KEY;

    if (!expectedBearerToken && !expectedApiKey) {
      this.logger.warn(
        'AuthGuard is enabled but neither AUTH_BEARER_TOKEN nor API_KEY is configured',
        'AuthGuard',
      );
      throw new InternalServerErrorException('Authentication is not configured');
    }

    if (expectedBearerToken && bearerToken === expectedBearerToken) {
      this.attachAuthContext(request, 'bearer');
      return true;
    }

    if (expectedApiKey && apiKey === expectedApiKey) {
      this.attachAuthContext(request, 'apiKey');
      return true;
    }

    this.logger.warn(
      {
        path: request.originalUrl || request.url,
        method: request.method,
        hasAuthorizationHeader: Boolean(request.headers.authorization),
        hasApiKeyHeader: Boolean(request.headers['x-api-key']),
      },
      'AuthGuard',
    );
    throw new UnauthorizedException('Invalid or missing credentials');
  }

  private extractBearerToken(request: Request): string | null {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private extractApiKey(request: Request): string | null {
    const apiKeyHeader = request.headers['x-api-key'];

    if (typeof apiKeyHeader === 'string' && apiKeyHeader.trim().length > 0) {
      return apiKeyHeader;
    }

    if (Array.isArray(apiKeyHeader) && apiKeyHeader.length > 0) {
      return apiKeyHeader[0];
    }

    return null;
  }

  private attachAuthContext(request: Request, authType: 'apiKey' | 'bearer'): void {
    Object.assign(request, {
      auth: {
        authenticated: true,
        type: authType,
      },
    });
  }
}