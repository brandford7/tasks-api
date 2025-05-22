/* eslint-disable prettier/prettier */
import { UserRole } from "src/users/entities/user.entity";


export interface UserPayload {
  userId: string;
  email: string;
  role: UserRole;
}
