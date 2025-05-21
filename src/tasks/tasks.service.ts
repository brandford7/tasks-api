/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/entities/user.entity';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepo.create({ ...dto, user }); // user is now guaranteed to be valid
    return this.taskRepo.save(task);
  }

  // src/tasks/tasks.service.ts

  async findAll(
    user: { userId: string; role: string },
    query: TaskQueryDto,
  ): Promise<{
    data: Task[];
    meta: { total: number; limit: number; offset: number };
  }> {
    const {
      search,
      status,
      includeCompleted,
      sortByCreatedAt,
      limit = 10,
      offset = 0,
    } = query;

    const qb = this.taskRepo.createQueryBuilder('task');

    // Only admin can see all tasks
    if (user.role !== 'admin') {
      qb.andWhere('task.userId = :userId', { userId: user.userId });
    }

    if (search) {
      qb.andWhere('LOWER(task.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (includeCompleted === 'false') {
      qb.andWhere('task.isCompleted = false');
    } else if (includeCompleted === 'true') {
      // nothing to filter
    }

    if (sortByCreatedAt) {
      qb.orderBy('task.createdAt', sortByCreatedAt);
    } else {
      qb.orderBy('task.createdAt', 'DESC'); // default
    }

    const total = await qb.getCount();

    const data = await qb.skip(offset).take(limit).getMany();

    return {
      data,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }
}
