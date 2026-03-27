import { Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserDtoResponse } from './dto/create-user-dto/create-user-dto';

@Injectable()
export class UsersService {
	create(createUserDto: CreateUserDto): CreateUserDtoResponse {
		return {
			...createUserDto,
		};
	}
}
