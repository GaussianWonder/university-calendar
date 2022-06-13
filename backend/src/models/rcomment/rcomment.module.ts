import { Module } from '@nestjs/common';
import { RcommentService } from './rcomment.service';
import { RcommentController } from './rcomment.controller';

@Module({
  controllers: [RcommentController],
  providers: [RcommentService]
})
export class RcommentModule {}
