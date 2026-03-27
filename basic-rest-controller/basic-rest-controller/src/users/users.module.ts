import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthGuard } from  './../common/guards/auth.guard';
import { CloudLoggerService } from './../common/logging/cloud-logger.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService,AuthGuard,CloudLoggerService],
})
export class UsersModule {}
