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

@Controller('university')
@ApiTags('2. University')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an university.' })
  async create(@Body() createUniversityDto: CreateUniversityDto) {
    return await this.universityService.create(createUniversityDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all universities.' })
  async findAll() {
    return await this.universityService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one university.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid university id');

    const university = await this.universityService.findOne(nId);
    if (!university) throw new NotFoundException('University not found');

    return university;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Update,
    subject: University,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a university.' })
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid university id');

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
