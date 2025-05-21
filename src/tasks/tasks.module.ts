/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
//import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

// src/tasks/tasks.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), // ✅ only Task
    UsersModule, // ✅ already exports UserRepository
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
