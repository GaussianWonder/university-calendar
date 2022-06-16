import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rcomment } from '../rcomment/entities/rcomment.entity';
import {
  CourseRole,
  FacultyRole,
  Role,
  TaskRole,
  UniversityRole,
} from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Rcomment,
      Role,
      UniversityRole,
      FacultyRole,
      CourseRole,
      TaskRole,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
