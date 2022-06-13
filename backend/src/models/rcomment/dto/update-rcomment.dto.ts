import { PartialType } from '@nestjs/swagger';
import { CreateRcommentDto } from './create-rcomment.dto';

export class UpdateRcommentDto extends PartialType(CreateRcommentDto) {}
