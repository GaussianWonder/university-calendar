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
import { ReqUser } from 'src/common/decorators/user.decorator';
import { FacultyService } from '../faculty/faculty.service';
import { RoleCategory, RoleTitle } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('course')
@ApiTags('4. Course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly facultyService: FacultyService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Course,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course.' })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @ReqUser() user: User,
  ) {
    this.userService.forbiddenUnlessCan(
      user,
      Action.Read,
      await this.facultyService.findOne(createCourseDto.facultyId),
    );
    const course = await this.courseService.create(createCourseDto);
    await this.userService.assignRole(user, {
      category: RoleCategory.Course,
      title: RoleTitle.Moderator,
      subject: { courseId: course.id },
    });

    return course;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all courses.' })
  async findAll(@ReqUser() user: User) {
    const [courses, abilityFilter] = await Promise.all([
      this.courseService.findAll(),
      this.userService.canUserFilter(user, Action.Read),
    ]);

    return courses.filter(abilityFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a course.' })
  async findOne(@Param('id') id: string, @ReqUser() user: User) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid course id');

    const course = await this.courseService.findOne(nId);
    if (!course) throw new NotFoundException('Course not found');

    await this.userService.forbiddenUnlessCan(user, Action.Read, course);

    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course.' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @ReqUser() user: User,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid course id');

    await this.userService.forbiddenUnlessCan(
      user,
      Action.Update,
      await this.courseService.findOne(nId),
    );

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
