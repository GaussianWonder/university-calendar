import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
