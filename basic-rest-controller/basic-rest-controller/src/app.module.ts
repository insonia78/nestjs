import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersControllerController } from './users-controller/users-controller.controller';

import { CreateUserDtoModule } from './create-user-dto/create-user-dto.module';
import { UpdateModule } from './update/update.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './common/guards/auth.guard';
import { CloudLoggerService } from './common/logging/cloud-logger.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import helmet from 'helmet';
import cors from 'cors';

@Module({
  imports: [CreateUserDtoModule, UpdateModule, UsersModule],
  controllers: [AppController, UsersControllerController],
  providers: [AppService, CloudLoggerService, AuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cors(),helmet(),RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}


