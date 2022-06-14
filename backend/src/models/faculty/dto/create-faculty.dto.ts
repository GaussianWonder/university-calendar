import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFacultyDto {
  @Matches(/[A-Za-z0-9.,&\s]+/)
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'Faculty name',
    default: 'General Services Faculty',
  })
  name: string;

  @MinLength(1)
  @ApiProperty({
    description: 'Quill-Delta content',
    default: JSON.stringify({
      ops: [{ insert: 'The General Services Faculty.\n' }],
    }),
  })
  description: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'Invalid university id' },
  )
  @IsPositive({ message: 'University id must be positive' })
  @ApiProperty({
    description: 'University id',
    default: 1,
  })
  universityId: number;
}
