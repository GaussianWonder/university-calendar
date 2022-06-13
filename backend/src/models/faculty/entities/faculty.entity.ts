import { BaseEntity } from 'src/models/base.entity';
import { Course } from 'src/models/course/entities/course.entity';
import { University } from 'src/models/university/entities/university.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import Delta from 'quill-delta';

@Entity()
export class Faculty extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'json' })
  description: Delta;

  @OneToMany(() => Course, (course) => course.faculty)
  courses: Course[];

  @ManyToOne(() => University, (university) => university.faculties)
  university: University;

  @Column({ nullable: true })
  @RelationId((faculty: Faculty) => faculty.university)
  universityId: number;

  constructor(partial: Partial<Faculty>) {
    super();
    Object.assign(this, partial);
  }
}
