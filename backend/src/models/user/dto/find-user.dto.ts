import { ValidateIf, IsInt, IsPositive, IsString } from 'class-validator';

export class FindUserDto {
  @ValidateIf((o) => !o.username)
  @IsInt()
  @IsPositive()
  id: number;

  @ValidateIf((o) => !o.id)
  @IsString()
  username: string;
}
