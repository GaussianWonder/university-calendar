import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @ApiProperty({
    description: 'Username to search patterns with',
    default: 'john',
  })
  username: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Result limit',
    default: '50',
  })
  limit?: string;
}
