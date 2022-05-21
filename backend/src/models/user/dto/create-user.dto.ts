import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @MinLength(3)
  // TODO @Unique([User])
  @ApiProperty({
    default: 'johndoe',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    default: 'password',
  })
  password: string;
}
