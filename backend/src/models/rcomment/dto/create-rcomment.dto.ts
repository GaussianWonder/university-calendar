import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateRcommentDto {
  @MinLength(1)
  @ApiProperty({
    description: 'Quill-Delta content',
    default: JSON.stringify({
      ops: [{ insert: 'The GSCT Comment.\n' }],
    }),
  })
  content: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'Invalid task id' },
  )
  @IsPositive({ message: 'Task id must be positive' })
  @ApiProperty({
    description: 'Task id',
    default: 1,
  })
  taskId: number;
}
