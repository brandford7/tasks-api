/* eslint-disable prettier/prettier */
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { Module } from "@nestjs/common";
import { User } from "./entities/user.entity";

// src/users/users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    TypeOrmModule, // ✅ allows access to Repository<User> when UsersModule is imported
  ],
})
export class UsersModule {}
