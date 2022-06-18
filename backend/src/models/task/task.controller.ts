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
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { Action } from 'src/auth/ability/ability.factory';
import { Task } from './entities/task.entity';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RoleCategory, RoleTitle } from '../user/entities/role.entity';
import { CourseService } from '../course/course.service';

@Controller('task')
@ApiTags('4. Task')
export class TaskController {
  constructor(
    private readonly courseService: CourseService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a task.' })
  async create(@Body() createTaskDto: CreateTaskDto, @ReqUser() user: User) {
    this.userService.forbiddenUnlessCan(
      user,
      Action.Read,
      await this.courseService.findOne(createTaskDto.courseId),
    );
    const task = await this.taskService.create(createTaskDto, user);
    await this.userService.assignRole(user, {
      category: RoleCategory.Task,
      title: RoleTitle.Moderator,
      subject: { taskId: task.id },
    });

    return task;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tasks.' })
  async findAll(@ReqUser() user: User, @Query('courseId') courseId?: number) {
    const [tasks, abilityFilter] = await Promise.all([
      this.taskService.findAll(courseId ? { where: { courseId } } : undefined),
      this.userService.canUserFilter(user, Action.Read),
    ]);

    return tasks.filter(abilityFilter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a task.' })
  async findOne(@Param('id') id: string, @ReqUser() user: User) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid task id');

    const task = await this.taskService.findOne(nId);
    if (!task) throw new NotFoundException('Task not found');

    await this.userService.forbiddenUnlessCan(user, Action.Read, task);

    return task;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a task.' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @ReqUser() user: User,
  ) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid task id');

    await this.userService.forbiddenUnlessCan(
      user,
      Action.Update,
      await this.taskService.findOne(nId),
    );

    return await this.taskService.update(nId, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Delete,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a task.' })
  async remove(@Param('id') id: string) {
    const { affected } = await this.taskService.remove(+id);
    return {
      affected,
    };
  }
}
