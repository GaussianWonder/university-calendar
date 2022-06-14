import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { Action } from 'src/auth/ability/ability.factory';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('course')
@ApiTags('4. Course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course.' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all courses.' })
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a course.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid course id');

    const course = await this.courseService.findOne(nId);
    if (!course) throw new NotFoundException('Course not found');

    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Update,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course.' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid course id');

    return await this.courseService.update(nId, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Delete,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course.' })
  async remove(@Param('id') id: string) {
    const { affected } = await this.courseService.remove(+id);
    return {
      affected,
    };
  }
}
