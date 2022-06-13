import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { Course } from '../course/entities/course.entity';
import { University } from '../university/entities/university.entity';
import { Faculty } from './entities/faculty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, University, Course])],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
