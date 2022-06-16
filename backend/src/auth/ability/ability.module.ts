import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/models/course/entities/course.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { University } from 'src/models/university/entities/university.entity';
import {
  CourseRole,
  FacultyRole,
  Role,
  TaskRole,
  UniversityRole,
} from 'src/models/user/entities/role.entity';
import { User } from 'src/models/user/entities/user.entity';
import { AbilityFactory } from './ability.factory';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      University,
      Faculty,
      Course,
      Task,
      Rcomment,
      Role,
      UniversityRole,
      FacultyRole,
      CourseRole,
      TaskRole,
    ]),
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
