import { BaseEntity } from 'src/models/base.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import Delta from 'quill-delta';
import { Task } from 'src/models/task/entities/task.entity';

@Entity()
export class Course extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'json' })
  description: Delta;

  @OneToMany(() => Task, (task) => task.course)
  tasks: Task[];

  @ManyToOne(() => Faculty, (faculty) => faculty.courses, {
    eager: true,
  })
  faculty: Faculty;

  @Column({ nullable: true })
  @RelationId((course: Course) => course.faculty)
  facultyId: number;

  constructor(partial: Partial<Course>) {
    super();
    Object.assign(this, partial);
  }
}
