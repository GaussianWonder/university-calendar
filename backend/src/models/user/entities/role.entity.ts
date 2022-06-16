import { Course } from 'src/models/course/entities/course.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { University } from 'src/models/university/entities/university.entity';
import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  TableInheritance,
} from 'typeorm';
import { User } from './user.entity';

// Utility type for available subject ids for a given role
export type RoleSubjectId =
  | { universityId: number }
  | { facultyId: number }
  | { courseId: number }
  | { taskId: number };

// Utility type for available subjects for a given role
export type RoleSubject = University | Faculty | Course | Task;

// The role type (role of a user for a given model)
export enum RoleCategory {
  University = 'university',
  Faculty = 'faculty',
  Course = 'course',
  Task = 'task',
}

// The title of the role in question
export enum RoleTitle {
  Moderator = 'moderator',
  Reader = 'reader',
}

@Entity()
@TableInheritance({
  column: {
    name: 'category',
    type: 'enum',
    enum: RoleCategory,
  },
})
export abstract class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @Column()
  @RelationId((r: Role) => r.user)
  userId: number;

  @Column({
    type: 'enum',
    enum: RoleCategory,
  })
  category: RoleCategory;

  @Column({
    type: 'enum',
    enum: RoleTitle,
  })
  title: RoleTitle;
}

@ChildEntity(RoleCategory.University)
export class UniversityRole extends Role {
  @ManyToOne(() => University, { eager: true })
  @JoinColumn([
    {
      name: 'universityId',
      referencedColumnName: 'id',
    },
  ])
  university: University;

  @Column()
  @RelationId((u: UniversityRole) => u.university)
  universityId: number;
}

@ChildEntity(RoleCategory.Faculty)
export class FacultyRole extends Role {
  @ManyToOne(() => Faculty, { eager: true })
  @JoinColumn([
    {
      name: 'facultyId',
      referencedColumnName: 'id',
    },
  ])
  faculty: Faculty;

  @Column()
  @RelationId((f: FacultyRole) => f.faculty)
  facultyId: number;
}

@ChildEntity(RoleCategory.Course)
export class CourseRole extends Role {
  @ManyToOne(() => Course, { eager: true })
  @JoinColumn([
    {
      name: 'courseId',
      referencedColumnName: 'id',
    },
  ])
  course: Course;

  @Column()
  @RelationId((c: CourseRole) => c.course)
  courseId: number;
}

@ChildEntity(RoleCategory.Task)
export class TaskRole extends Role {
  @ManyToOne(() => Task, { eager: true })
  @JoinColumn([
    {
      name: 'taskId',
      referencedColumnName: 'id',
    },
  ])
  task: Task;

  @Column()
  @RelationId((tr: TaskRole) => tr.task)
  taskId: number;
}
