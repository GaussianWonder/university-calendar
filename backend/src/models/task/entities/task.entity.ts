import Delta from 'quill-delta';
import { BaseEntity } from 'src/models/base.entity';
import { Course } from 'src/models/course/entities/course.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { User } from 'src/models/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'json' })
  description: Delta;

  @CreateDateColumn({ type: 'timestamp' })
  dueDate: Date;

  @OneToMany(() => Rcomment, (rcomment) => rcomment.task)
  rcomments: Rcomment[];

  @ManyToOne(() => Course, (c) => c.tasks, {
    eager: true,
  })
  course: Course;

  @Column()
  @RelationId((task: Task) => task.course)
  courseId: number;

  @ManyToOne(() => User, (u) => u.tasks, {
    eager: true,
  })
  user: User;

  @Column()
  @RelationId((task: Task) => task.user)
  userId: number;

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
