/* eslint-disable prettier/prettier */
// src/types/jwt-refresh-request.interface.ts
import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

export interface JwtRefreshRequest extends Request {
  user: UserPayload & { refreshToken: string };
  body: {
    refreshToken: string;
  };
}
