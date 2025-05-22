/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshRequest } from 'src/types/jwt-refresh-request';
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

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: JwtRequest) {
    const { userId } = req.user;
    await this.authService.logout(userId);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: JwtRequest) {
    return req.user; // userId, email, role
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  refresh(@Req() req: JwtRefreshRequest) {
    return this.authService.signTokens({
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });
  }
}
