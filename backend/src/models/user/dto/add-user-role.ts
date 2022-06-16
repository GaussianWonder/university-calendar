import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { RoleCategory, RoleTitle } from '../entities/role.entity';

export class AddUserRoleDto {
  @IsEnum(RoleCategory)
  category: RoleCategory;

  @IsEnum(RoleTitle)
  title: RoleTitle;

  @IsNumber()
  @IsPositive()
  subjectId: number;

  @IsNumber()
  @IsPositive()
  userId: number;
}
