import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RcommentService } from './rcomment.service';
import { CreateRcommentDto } from './dto/create-rcomment.dto';
import { UpdateRcommentDto } from './dto/update-rcomment.dto';

@Controller('rcomment')
export class RcommentController {
  constructor(private readonly rcommentService: RcommentService) {}

  @Post()
  create(@Body() createRcommentDto: CreateRcommentDto) {
    return this.rcommentService.create(createRcommentDto);
  }

  @Get()
  findAll() {
    return this.rcommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rcommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRcommentDto: UpdateRcommentDto) {
    return this.rcommentService.update(+id, updateRcommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rcommentService.remove(+id);
  }
}
