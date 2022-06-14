import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Delta from 'quill-delta';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateRcommentDto } from './dto/create-rcomment.dto';
import { UpdateRcommentDto } from './dto/update-rcomment.dto';
import { Rcomment } from './entities/rcomment.entity';

@Injectable()
export class RcommentService {
  constructor(
    @InjectRepository(Rcomment)
    private readonly rcommentRepository: Repository<Rcomment>,
  ) {}

  async create(
    createCommentDto: CreateRcommentDto,
    user: User,
  ): Promise<Rcomment> {
    const userId = user.id;
    try {
      const content = new Delta(JSON.parse(createCommentDto.content));
      return this.rcommentRepository.save(
        this.rcommentRepository.create({
          ...createCommentDto,
          content,
          userId,
        }),
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid quill-delta content');
    }
  }

  async findAll(): Promise<Rcomment[]> {
    return this.rcommentRepository.find();
  }

  async findOne(id: number): Promise<Rcomment> {
    return this.rcommentRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCommentDto: UpdateRcommentDto,
  ): Promise<Rcomment> {
    const comment = await this.findOne(id);

    if (updateCommentDto.content) {
      try {
        comment.content = new Delta(JSON.parse(updateCommentDto.content));
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid quill-delta content');
      }
    }

    if (updateCommentDto.taskId) {
      comment.taskId = updateCommentDto.taskId;
    }

    return this.rcommentRepository.save(comment);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.rcommentRepository.softDelete({ id });
  }
}
