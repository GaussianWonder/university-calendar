import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Action } from 'src/auth/ability/ability.factory';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { AddUserRoleDto } from './dto/add-user-role';
import { FindUsersDto } from './dto/find-users.dto';
import { RoleSubjectId } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('6. Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users matching a given pattern.' })
  async findSimilar(
    @Query() findUsersDto: FindUsersDto,
    @ReqUser() user: User,
  ) {
    const limit = Number(findUsersDto.limit);
    const [users, abilityFilter] = await Promise.all([
      this.userService.findSimilarUsernames(
        findUsersDto.username,
        limit ? limit : 50,
      ),
      this.userService.canUserFilter(user, Action.Read),
    ]);

    const filteredUsers = users.filter(abilityFilter);
    if (filteredUsers.length === 0)
      throw new NotFoundException('No users with permission to read found');

    return users.filter(abilityFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one user.' })
  async findOne(@Param('id') id: string, @ReqUser() currentUser: User) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid user id');

    const user = await this.userService.findOne({ id: nId });
    if (!user) throw new NotFoundException('User not found');

    await this.userService.forbiddenUnlessCan(currentUser, Action.Read, user);

    return user;
  }

  @Post('role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a role to a user.' })
  async addRole(
    @Body() addUserRoleDto: AddUserRoleDto,
    @ReqUser() currentUser: User,
  ) {
    const { category, title, subjectId, userId } = addUserRoleDto;

    const user = await this.findOne(userId.toString(), currentUser);

    const idField = `${category}Id`;
    const isIdFieldValid = [
      'universityId',
      'facultyId',
      'courseId',
      'taskId',
    ].includes(idField);
    if (!isIdFieldValid) throw new BadRequestException('Invalid category');

    const subject: Record<string, number> = {};
    subject[idField] = subjectId;

    return await this.userService.assignRole(user, {
      category,
      title,
      subject: subject as RoleSubjectId,
    });
  }
}
