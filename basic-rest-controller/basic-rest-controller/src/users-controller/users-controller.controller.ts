import { Controller, Get, Param } from '@nestjs/common';

@Controller('users-controller')
export class UsersControllerController {

 @Get()
 getHello(): string {
   return 'Hello World!';
 }  
 @Get(':id') 
getUserById(@Param('id') id: string): string { 
        return `User with id ${id}`; 
    }


}
