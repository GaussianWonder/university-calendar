import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserModule } from '../user/user.module';
import { FacultyModule } from '../faculty/faculty.module';
import { UniversityModule } from '../university/university.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    UserModule,
    FacultyModule,
    UniversityModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
