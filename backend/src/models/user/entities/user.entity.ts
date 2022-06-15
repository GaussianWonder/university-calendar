import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/models/base.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';

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

  @OneToMany(() => Rcomment, (comment) => comment.user, {
    lazy: true,
  })
  rcomments: Rcomment[];

  @OneToMany(() => Task, (task) => task.user, {
    lazy: true,
  })
  tasks: Task[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
