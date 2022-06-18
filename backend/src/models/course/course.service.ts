import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Delta from 'quill-delta';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const description = new Delta(JSON.parse(createCourseDto.description));
      return this.courseRepository.save(
        this.courseRepository.create({
          ...createCourseDto,
          description,
        }),
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid quill-delta content');
    }
  }

  async findAll(options?: FindManyOptions<Course>): Promise<Course[]> {
    return this.courseRepository.find(options);
  }

  async findOne(id: number): Promise<Course> {
    return this.courseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    if (updateCourseDto.description) {
      try {
        course.description = new Delta(JSON.parse(updateCourseDto.description));
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid quill-delta content');
      }
    }

    if (updateCourseDto.name) {
      course.name = updateCourseDto.name;
    }

    if (updateCourseDto.facultyId) {
      course.facultyId = updateCourseDto.facultyId;
    }

    return this.courseRepository.save(course);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.courseRepository.softDelete({ id });
  }
}
