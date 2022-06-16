import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { Action } from 'src/auth/ability/ability.factory';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('6. Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: User,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users matching a given pattern.' })
  async findSimilar(@Query() findUsersDto: FindUsersDto) {
    const limit = Number(findUsersDto.limit);
    return await this.userService.findSimilarUsernames(
      findUsersDto.username,
      limit ? limit : 50,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: User,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one user.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid university id');

    const user = await this.userService.findOne({ id: nId });
    if (!user) throw new NotFoundException('University not found');

    return user;
  }
}
