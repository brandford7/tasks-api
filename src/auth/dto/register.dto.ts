/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Username must at least 2 characters long' })
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Password must at least 6 characters long' })
  password: string;

  @ApiProperty()
  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  @IsOptional()
  role?: UserRole;
}
