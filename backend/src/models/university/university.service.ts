import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Delta from 'quill-delta';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { University } from './entities/university.entity';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    try {
      const description = new Delta(
        JSON.parse(createUniversityDto.description),
      );
      return this.universityRepository.save(
        this.universityRepository.create({
          ...createUniversityDto,
          description,
        }),
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid quill-delta content');
    }
  }

  async findAll(): Promise<University[]> {
    return this.universityRepository.find();
  }

  async findOne(id: number): Promise<University> {
    return this.universityRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.findOne(id);

    if (updateUniversityDto.description) {
      try {
        university.description = new Delta(
          JSON.parse(updateUniversityDto.description),
        );
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid quill-delta content');
      }
    }

    if (updateUniversityDto.name) {
      university.name = updateUniversityDto.name;
    }

    return this.universityRepository.save(university);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.universityRepository.softDelete({ id });
  }
}
