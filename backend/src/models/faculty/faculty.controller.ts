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

@Controller('faculty')
@ApiTags('3. Faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a faculty.' })
  async create(@Body() createFacultyDto: CreateFacultyDto) {
    return await this.facultyService.create(createFacultyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all faculties.' })
  async findAll() {
    return await this.facultyService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a faculty.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid faculty id');

    const faculty = await this.facultyService.findOne(nId);
    if (!faculty) throw new NotFoundException('Faculty not found');

    return faculty;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Update,
    subject: Faculty,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a faculty.' })
  async update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid faculty id');

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
