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
import { RcommentService } from './rcomment.service';
import { CreateRcommentDto } from './dto/create-rcomment.dto';
import { UpdateRcommentDto } from './dto/update-rcomment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { Action } from 'src/auth/ability/ability.factory';
import { Rcomment } from './entities/rcomment.entity';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('rcomment')
@ApiTags('5. RComments')
export class RcommentController {
  constructor(private readonly rcommentService: RcommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Rcomment,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an RComment.' })
  async create(
    @Body() createCommentDto: CreateRcommentDto,
    @ReqUser() user: User,
  ) {
    return await this.rcommentService.create(createCommentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Rcomment,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all RComments.' })
  async findAll() {
    return await this.rcommentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Rcomment,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an RComment.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid rcomment id');

    const course = await this.rcommentService.findOne(nId);
    if (!course) throw new NotFoundException('RComment not found');

    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Update,
    subject: Rcomment,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an rcomment.' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateRcommentDto,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid rcomment id');

    return await this.rcommentService.update(nId, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Delete,
    subject: Rcomment,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an rcomment.' })
  async remove(@Param('id') id: string) {
    const { affected } = await this.rcommentService.remove(+id);
    return {
      affected,
    };
  }
}
