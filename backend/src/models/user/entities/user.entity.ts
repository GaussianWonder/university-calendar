import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/models/base.entity';

export enum UserRole {
  Student = 'student',
  Staff = 'staff',
  Teacher = 'teacher',
  Admin = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Student,
  })
  role: UserRole;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
