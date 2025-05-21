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

  async findAll(
    userId: string,
    role: string,
    query: TaskQueryDto,
  ): Promise<Task[]> {
    const qb = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user');

    // Restrict to user's own tasks if not admin
    if (role !== 'admin') {
      qb.where('user.id = :userId', { userId });
    }

    // Search by title or description
    if (query.search) {
      qb.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Filter by status
    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    // Filter out completed tasks unless explicitly included
    if (!query.includeCompleted) {
      qb.andWhere('task.isCompleted = false');
    }

    // Sort by createdAt
    if (query.sortByCreatedAt) {
      qb.orderBy('task.createdAt', query.sortByCreatedAt);
    } else {
      qb.orderBy('task.createdAt', 'DESC'); // Default sorting
    }

    return qb.getMany();
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
