/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtRefreshRequest } from 'src/types/jwt-refresh-request';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRequest } from 'src/types/jwt-request.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: JwtRequest) {
    return req.user; // userId, email, role
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  refreshToken(@Req() req: JwtRefreshRequest) {
    return this.authService.signTokens({
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });
  }
}
