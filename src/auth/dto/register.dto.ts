/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Username must at least 2 characters long' })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must at least 6 characters long' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  @IsOptional()
  role?: UserRole;
}
