/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtRequest } from 'src/types/jwt-request.interface';
import { Task } from './entities/task.entity';
import { TaskQueryDto } from './dto/task-query.dto';


@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: JwtRequest): Promise<Task> {
    const { userId } = req.user;
    return this.tasksService.create(dto, userId);
  }

  @Get()
  async findAll(
    @Req() req: JwtRequest,
    @Query() query: TaskQueryDto,
  ): Promise<Task[]> {
    const { userId, role } = req.user;
    return this.tasksService.findAll(userId, role, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
