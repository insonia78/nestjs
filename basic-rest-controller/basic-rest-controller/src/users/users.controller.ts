import { Body, Controller, NotFoundException, Post, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoResponse } from './dto/create-user-dto/create-user-dto';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDtoResponse> {
    // If the data is invalid, the global pipe throws a 400 Bad Request
    // and this code never runs.
    console.log(`User ${createUserDto.name} created!`);
    throw new  NotFoundException(`User ${createUserDto.name} not found!`);
    return await createUserDto;
  }
}
