/* eslint-disable prettier/prettier */
// task-query.dto.ts
import { IsOptional, IsBooleanString, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity'; // Assuming status is an enum

export class TaskQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsBooleanString()
  includeCompleted?: string; // must be 'true' or 'false' as string (because it's from query)

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: 'sortByCreatedAt must be either ASC or DESC',
  })
  sortByCreatedAt?: 'ASC' | 'DESC';
}
