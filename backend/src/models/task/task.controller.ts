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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/auth/ability/abilities.guard';
import { CheckAbilities } from 'src/auth/ability/abilities.decorator';
import { Action } from 'src/auth/ability/ability.factory';
import { Task } from './entities/task.entity';

@Controller('task')
@ApiTags('4. Task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Create,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a task.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tasks.' })
  async findAll() {
    return await this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Read,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a task.' })
  async findOne(@Param('id') id: string) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid task id');

    const task = await this.taskService.findOne(nId);
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbilities({
    action: Action.Update,
    subject: Task,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a task.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const nId = Number(id);
    if (!nId) throw new BadRequestException('Invalid task id');

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
