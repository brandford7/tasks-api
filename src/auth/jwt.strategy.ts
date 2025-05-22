/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import {  User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtRefreshRequest } from 'src/types/jwt-refresh-request';
import { UserPayload } from 'src/types/user-payload.interface';

// Strategy for Access Token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    });
  }

  validate(payload: UserPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}

// Strategy for Refresh Token
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), // Or fromCookie('refreshToken') if using cookies
      secretOrKey: process.env.JWT_REFRESH_SECRET as string,
      passReqToCallback: true,
    });
  }

  // jwt-refresh.strategy.ts
  async validate(req: JwtRefreshRequest, payload: UserPayload) {
    const refreshToken = req.body['refreshToken'];
    const user = await this.userRepo.findOne({ where: { id: payload.userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Access Denied');

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
