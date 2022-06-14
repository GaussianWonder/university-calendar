import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import Delta from 'quill-delta';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    try {
      const description = new Delta(JSON.parse(createFacultyDto.description));
      return this.facultyRepository.save(
        this.facultyRepository.create({
          ...createFacultyDto,
          description,
        }),
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid quill-delta content');
    }
  }

  async findAll(): Promise<Faculty[]> {
    return this.facultyRepository.find();
  }

  async findOne(id: number): Promise<Faculty> {
    return this.facultyRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    const faculty = await this.findOne(id);

    if (updateFacultyDto.description) {
      try {
        faculty.description = new Delta(
          JSON.parse(updateFacultyDto.description),
        );
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid quill-delta content');
      }
    }

    if (updateFacultyDto.name) {
      faculty.name = updateFacultyDto.name;
    }

    if (updateFacultyDto.universityId) {
      faculty.universityId = updateFacultyDto.universityId;
    }

    return this.facultyRepository.save(faculty);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.facultyRepository.softDelete({ id });
  }
}
