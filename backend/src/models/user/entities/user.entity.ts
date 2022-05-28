import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  Student = 'student',
  Staff = 'staff',
  Teacher = 'teacher',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // @Column()
  // email: string;

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
    Object.assign(this, partial);
  }
}
