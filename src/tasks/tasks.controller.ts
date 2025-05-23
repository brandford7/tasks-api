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
import { JwtRequest } from 'src/types/jwt-request.interface';
import { Task } from './entities/task.entity';
import { TaskQueryDto } from './dto/task-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { TaskOwnershipGuard } from 'src/common/guards/task-ownership.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: JwtRequest): Promise<Task> {
    const { userId } = req.user;
    return this.tasksService.create(dto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Req() req: JwtRequest,
    @Query() query: TaskQueryDto,
  ): Promise<{
    data: Task[];
    meta: { total: number; limit: number; offset: number };
  }> {
    const { userId, role } = req.user;
    return this.tasksService.findAll({ userId, role }, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), TaskOwnershipGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), TaskOwnershipGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Delete(':id/soft')
  softDeleteTask(
    @Param('id') id: string,
    @Req() req: JwtRequest,
  ): Promise<void> {
    const { userId } = req.user;
    return this.tasksService.softDelete(id, userId);
  }

  @Patch(':id/restore')
  restoreTask(@Param('id') id: string, @Req() req: JwtRequest): Promise<void> {
    const { userId } = req.user;
    return this.tasksService.restore(id, userId);
  }
}  


