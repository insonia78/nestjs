import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CloudLoggerService } from './common/logging/cloud-logger.service';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(CloudLoggerService);

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`, 'Bootstrap');
}
bootstrap();
