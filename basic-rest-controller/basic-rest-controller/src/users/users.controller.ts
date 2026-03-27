import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoResponse } from './dto/create-user-dto/create-user-dto';
import { HttpExceptionFilter } from '../http-exception/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDtoResponse> {
    return this.usersService.create(createUserDto);
  }
}
