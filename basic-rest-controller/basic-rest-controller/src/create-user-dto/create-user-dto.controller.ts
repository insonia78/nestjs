import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDtoService } from './create-user-dto.service';
import { CreateUserDto } from './dto/create-user-dto/create-user-dto';

@Controller("users-controller")
export class CreateUserDtoController {
  constructor(private readonly createUserDtoService: CreateUserDtoService) {}
  @Post("/users")
    create(@Body() createUserDto: CreateUserDto) {
      console.log("Create user DTO controller");
      console.log(createUserDto);
            return createUserDto;
    }   
}
