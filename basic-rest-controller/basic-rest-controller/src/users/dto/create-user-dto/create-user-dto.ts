import { IsString, IsEmail, IsNotEmpty, MinLength, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string; // Must be a non-empty string

  @IsEmail()
  readonly email: string; // Must be a valid email format

  @IsString()
  @MinLength(8, { message: 'Password is too short' })
  readonly password: string; // Must be at least 8 characters

  @IsInt()
  @Min(18)
  @Max(99)
  readonly age: number; // Must be an integer between 18 and 99
}

export class CreateUserDtoResponse {
  @IsString()
  @IsNotEmpty()
  name: string; // Must be a non-empty string

  @IsEmail()
  email: string; // Must be a valid email format

  @IsString()
  @MinLength(8, { message: 'Password is too short' })
  password: string; // Must be at least 8 characters

  @IsInt()
  @Min(18)
  @Max(99)
  age: number; // Must be an integer between 18 and 99
}
