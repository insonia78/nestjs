import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersControllerController } from './users-controller/users-controller.controller';

import { CreateUserDtoModule } from './create-user-dto/create-user-dto.module';
import { UpdateModule } from './update/update.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CreateUserDtoModule, UpdateModule, UsersModule],
  controllers: [AppController, UsersControllerController],
  providers: [AppService],
})
export class AppModule {}
