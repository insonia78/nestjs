import { ExecutionContext, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { CloudLoggerService } from '../logging/cloud-logger.service';

describe('AuthGuard', () => {
  const originalBearerToken = process.env.AUTH_BEARER_TOKEN;
  const originalApiKey = process.env.API_KEY;
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard(new CloudLoggerService());
  });

  afterEach(() => {
    process.env.AUTH_BEARER_TOKEN = originalBearerToken;
    process.env.API_KEY = originalApiKey;
  });

  it('allows requests with a valid bearer token', () => {
    process.env.AUTH_BEARER_TOKEN = 'secret-token';

    const context = createHttpContext({
      headers: { authorization: 'Bearer secret-token' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows requests with a valid api key', () => {
    process.env.API_KEY = 'cloud-api-key';

    const context = createHttpContext({
      headers: { 'x-api-key': 'cloud-api-key' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws unauthorized for invalid credentials', () => {
    process.env.AUTH_BEARER_TOKEN = 'secret-token';

    const context = createHttpContext({
      headers: { authorization: 'Bearer wrong-token' },
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws when auth is not configured', () => {
    delete process.env.AUTH_BEARER_TOKEN;
    delete process.env.API_KEY;

    const context = createHttpContext({ headers: {} });

    expect(() => guard.canActivate(context)).toThrow(InternalServerErrorException);
  });
});

function createHttpContext(request: Partial<Request>): ExecutionContext {
  return {
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}