/* eslint-disable prettier/prettier */
import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

export interface JwtRequest extends Request {
  user: UserPayload;
}
