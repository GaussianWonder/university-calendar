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
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { Action } from 'src/auth/ability/ability.factory';
import { Faculty } from './entities/faculty.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { RoleCategory, RoleTitle } from '../user/entities/role.entity';
import { UniversityService } from '../university/university.service';

@Controller('faculty')
@ApiTags('3. Faculty')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly userService: UserService,
    private readonly universityService: UniversityService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a faculty.' })
  async create(
    @Body() createFacultyDto: CreateFacultyDto,
    @ReqUser() user: User,
  ) {
    this.userService.forbiddenUnlessCan(
      user,
      Action.Read,
      await this.universityService.findOne(createFacultyDto.universityId),
    );

    const faculty = await this.facultyService.create(createFacultyDto);
    await this.userService.assignRole(user, {
      category: RoleCategory.Faculty,
      title: RoleTitle.Moderator,
      subject: { facultyId: faculty.id },
    });

    return faculty;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all faculties.' })
  async findAll(@ReqUser() user: User) {
    const [faculties, abilityFilter] = await Promise.all([
      this.facultyService.findAll(),
      this.userService.canUserFilter(user, Action.Read),
    ]);

    return faculties.filter(abilityFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a faculty.' })
  async findOne(@Param('id') id: string, @ReqUser() user: User) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid faculty id');

    const faculty = await this.facultyService.findOne(nId);
    if (!faculty) throw new NotFoundException('Faculty not found');

    await this.userService.forbiddenUnlessCan(user, Action.Read, faculty);

    return faculty;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a faculty.' })
  async update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
    @ReqUser() user: User,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid faculty id');

    await this.userService.forbiddenUnlessCan(
      user,
      Action.Update,
      await this.facultyService.findOne(nId),
    );

    return await this.facultyService.update(nId, updateFacultyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Delete,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a faculty.' })
  async remove(@Param('id') id: string) {
    const { affected } = await this.facultyService.remove(+id);
    return {
      affected,
    };
  }
}
