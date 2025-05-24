/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task,} from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTaskRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let taskRepo: jest.Mocked<Repository<Task>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepo = module.get(getRepositoryToken(Task));
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        
        
      };
      const userId = 'user-123';

      const expectedTask = {
        id: 'task-uuid',
        ...dto,
        isCompleted: false,
        user: { id: userId },
      };

      taskRepo.create.mockReturnValue(expectedTask as any);
      taskRepo.save.mockResolvedValue(expectedTask as any);

      const result = await service.create(dto, userId);
      expect(taskRepo.create()).toHaveBeenCalledWith({
        ...dto,
        user: { id: userId },
      });
      expect(taskRepo.save(dto)).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    });
  });
});
