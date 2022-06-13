import { Test, TestingModule } from '@nestjs/testing';
import { RcommentController } from './rcomment.controller';
import { RcommentService } from './rcomment.service';

describe('RcommentController', () => {
  let controller: RcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RcommentController],
      providers: [RcommentService],
    }).compile();

    controller = module.get<RcommentController>(RcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
