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
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { Action } from 'src/auth/ability/ability.factory';
import { University } from './entities/university.entity';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RoleCategory, RoleTitle } from '../user/entities/role.entity';

@Controller('university')
@ApiTags('2. University')
export class UniversityController {
  constructor(
    private readonly universityService: UniversityService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an university.' })
  async create(
    @Body() createUniversityDto: CreateUniversityDto,
    @ReqUser() user: User,
  ) {
    const university = await this.universityService.create(createUniversityDto);
    await this.userService.assignRole(user, {
      category: RoleCategory.University,
      title: RoleTitle.Moderator,
      subject: { universityId: university.id },
    });

    return university;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all universities.' })
  async findAll(@ReqUser() user: User) {
    const [universities, abilityFilter] = await Promise.all([
      this.universityService.findAll(),
      this.userService.canUserFilter(user, Action.Read),
    ]);

    return universities.filter(abilityFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one university.' })
  async findOne(@Param('id') id: string, @ReqUser() user: User) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid university id');

    const university = await this.universityService.findOne(nId);
    if (!university) throw new NotFoundException('University not found');

    await this.userService.forbiddenUnlessCan(user, Action.Read, university);

    return university;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a university.' })
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
    @ReqUser() user: User,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid university id');

    await this.userService.forbiddenUnlessCan(
      user,
      Action.Update,
      await this.universityService.findOne(nId),
    );

    return await this.universityService.update(nId, updateUniversityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Delete,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a university.' })
  async remove(@Param('id') id: string) {
    const { affected } = await this.universityService.remove(+id);
    return {
      affected,
    };
  }
}
