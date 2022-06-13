import { BaseEntity } from 'src/models/base.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import Delta from 'quill-delta';

@Entity()
export class University extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'json' })
  description: Delta;

  @OneToMany(() => Faculty, (faculty) => faculty.university)
  faculties: Faculty[];

  constructor(partial: Partial<University>) {
    super();
    Object.assign(this, partial);
  }
}
