import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/models/base.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';
import {
  CourseRole,
  FacultyRole,
  Role,
  TaskRole,
  UniversityRole,
} from './role.entity';

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
  // Account role
  role: UserRole;

  @OneToMany(() => Rcomment, (comment) => comment.user, {
    lazy: true,
  })
  rcomments: Rcomment[];

  @OneToMany(() => Task, (task) => task.user, {
    lazy: true,
  })
  tasks: Task[];

  // Resource roles
  @OneToMany(() => Role, (role) => role.user)
  roles: Role;

  @OneToMany(() => UniversityRole, (role) => role.user)
  universityRoles: UniversityRole[];

  @OneToMany(() => FacultyRole, (role) => role.user)
  facultyRoles: FacultyRole[];

  @OneToMany(() => CourseRole, (role) => role.user)
  courseRoles: CourseRole[];

  @OneToMany(() => TaskRole, (role) => role.user)
  taskRoles: TaskRole[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
