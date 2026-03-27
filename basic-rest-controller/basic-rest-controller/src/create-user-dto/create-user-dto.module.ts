import { Module } from '@nestjs/common';
import { CreateUserDtoService } from './create-user-dto.service';
import { CreateUserDtoController } from './create-user-dto.controller';

@Module({
  controllers: [CreateUserDtoController],
  providers: [CreateUserDtoService],
})
export class CreateUserDtoModule {}
