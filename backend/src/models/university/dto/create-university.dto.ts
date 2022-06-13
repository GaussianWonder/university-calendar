import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUniversityDto {
  @Matches(/[A-Za-z0-9.,&\s]+/)
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'University name',
    default: 'Commercial University Ltd.',
  })
  name: string;

  @MinLength(1)
  @ApiProperty({
    description: 'Quill-Delta content',
    default: JSON.stringify({
      ops: [{ insert: 'The Commercial University Ltd.\n' }],
    }),
  })
  description: string;
}
