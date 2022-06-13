import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Faculty } from '../faculty/entities/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([University, Faculty])],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
