import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/models/course/entities/course.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { University } from 'src/models/university/entities/university.entity';
import { AbilityFactory } from './ability.factory';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([University, Faculty, Course, Task, Rcomment]),
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
