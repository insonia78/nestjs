import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDtoService } from './create-user-dto.service';

describe('CreateUserDtoService', () => {
  let service: CreateUserDtoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserDtoService],
    }).compile();

    service = module.get<CreateUserDtoService>(CreateUserDtoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
