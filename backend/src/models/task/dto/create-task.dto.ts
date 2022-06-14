import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsPositive,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @Matches(/[A-Za-z0-9.,&\s]+/)
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'Task name',
    default: 'GSC Task',
  })
  name: string;

  @MinLength(1)
  @ApiProperty({
    description: 'Quill-Delta content',
    default: JSON.stringify({
      ops: [{ insert: 'The GSC Task.\n' }],
    }),
  })
  description: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'Invalid course id' },
  )
  @IsPositive({ message: 'Course id must be positive' })
  @ApiProperty({
    description: 'Course id',
    default: 1,
  })
  courseId: number;

  @Type(() => Date)
  @IsDate({ message: 'Invalid due date' })
  @ApiProperty({
    description: 'Due date',
    default: new Date(),
    type: Date,
  })
  dueDate: Date;
}
