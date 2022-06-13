import { Injectable } from '@nestjs/common';
import { CreateRcommentDto } from './dto/create-rcomment.dto';
import { UpdateRcommentDto } from './dto/update-rcomment.dto';

@Injectable()
export class RcommentService {
  create(createRcommentDto: CreateRcommentDto) {
    return 'This action adds a new rcomment';
  }

  findAll() {
    return `This action returns all rcomment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rcomment`;
  }

  update(id: number, updateRcommentDto: UpdateRcommentDto) {
    return `This action updates a #${id} rcomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} rcomment`;
  }
}
