import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../common/guards/auth.guard';
import { CloudLoggerService } from '../common/logging/cloud-logger.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto/create-user-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthGuard, CloudLoggerService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate user creation to the service', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
      age: 28,
    };

    const createSpy = jest.spyOn(service, 'create');

    await expect(controller.create(createUserDto)).resolves.toEqual(createUserDto);
    expect(createSpy).toHaveBeenCalledWith(createUserDto);
  });
});
