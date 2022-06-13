import Delta from 'quill-delta';
import { BaseEntity } from 'src/models/base.entity';
import { Course } from 'src/models/course/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Course, (c) => c.tasks, { nullable: true })
  course: Course;

  @Column({ nullable: true })
  @RelationId((task: Task) => task.course)
  courseId: number;

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
