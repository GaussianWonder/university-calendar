import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { Rcomment } from '../rcomment/entities/rcomment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Course, Rcomment])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
