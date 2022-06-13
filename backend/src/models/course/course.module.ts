import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Task } from '../task/entities/task.entity';
import { Faculty } from '../faculty/entities/faculty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Task, Faculty])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
