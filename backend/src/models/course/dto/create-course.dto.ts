import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @Matches(/[A-Za-z0-9.,&\s]+/)
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'Course name',
    default: 'GS Course',
  })
  name: string;

  @MinLength(1)
  @ApiProperty({
    description: 'Quill-Delta content',
    default: JSON.stringify({
      ops: [{ insert: 'The GS Course.\n' }],
    }),
  })
  description: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'Invalid faculty id' },
  )
  @IsPositive({ message: 'Faculty id must be positive' })
  @ApiProperty({
    description: 'Faculty id',
    default: 1,
  })
  facultyId: number;
}
