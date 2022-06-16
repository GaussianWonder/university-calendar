import { Module } from '@nestjs/common';
import { RcommentService } from './rcomment.service';
import { RcommentController } from './rcomment.controller';
import { Rcomment } from './entities/rcomment.entity';
import { User } from '../user/entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rcomment, User, Task])],
  controllers: [RcommentController],
  providers: [RcommentService],
  exports: [RcommentService],
})
export class RcommentModule {}
