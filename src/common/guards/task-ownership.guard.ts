/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/guards/task-ownership.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { JwtRequest } from 'src/types/jwt-request.interface';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor(private taskService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: JwtRequest = context.switchToHttp().getRequest();
    const { userId, role } = req.user;
    const taskId = req.params.id;

    const task = await this.taskService.findOne(taskId);
    if (!task) throw new ForbiddenException('Task not found');

    if (task.user.id !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not own this task');
    }

    return true;
  }
}
