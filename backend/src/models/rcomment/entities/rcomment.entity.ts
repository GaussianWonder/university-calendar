import Delta from 'quill-delta';
import { BaseEntity } from 'src/models/base.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { User } from 'src/models/user/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Rcomment extends BaseEntity {
  @Column({ type: 'json' })
  content: Delta;

  @ManyToOne(() => User, (user) => user.rcomments, { eager: true })
  user: User;

  @Column()
  @RelationId((c: Rcomment) => c.user)
  userId: number;

  @ManyToOne(() => Task, (task) => task.rcomments)
  task: Task;

  @Column()
  @RelationId((c: Rcomment) => c.task)
  taskId: number;

  constructor(partial: Partial<Rcomment>) {
    super();
    Object.assign(this, partial);
  }
}
