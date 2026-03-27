import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDtoController } from './create-user-dto.controller';
import { CreateUserDtoService } from './create-user-dto.service';

describe('CreateUserDtoController', () => {
  let controller: CreateUserDtoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserDtoController],
      providers: [CreateUserDtoService],
    }).compile();

    controller = module.get<CreateUserDtoController>(CreateUserDtoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
