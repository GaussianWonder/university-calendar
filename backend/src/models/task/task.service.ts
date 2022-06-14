import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Delta from 'quill-delta';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const description = new Delta(JSON.parse(createTaskDto.description));
      return this.taskRepository.save(
        this.taskRepository.create({
          ...createTaskDto,
          description,
        }),
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid quill-delta content');
    }
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.description) {
      try {
        task.description = new Delta(JSON.parse(updateTaskDto.description));
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid quill-delta content');
      }
    }

    if (updateTaskDto.name) {
      task.name = updateTaskDto.name;
    }

    if (updateTaskDto.courseId) {
      task.courseId = updateTaskDto.courseId;
    }

    if (updateTaskDto.dueDate) {
      task.dueDate = updateTaskDto.dueDate;
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.taskRepository.softDelete({ id });
  }
}
