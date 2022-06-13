import { Test, TestingModule } from '@nestjs/testing';
import { RcommentService } from './rcomment.service';

describe('RcommentService', () => {
  let service: RcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RcommentService],
    }).compile();

    service = module.get<RcommentService>(RcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
