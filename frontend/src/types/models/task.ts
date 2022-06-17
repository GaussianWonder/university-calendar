import { HasDeltaDescription } from "../utility/delta-content";
import { Course } from "./course";
import { Entity } from "./entity";
import { Rcomment } from "./rcomment";
import { User } from "./user";

export interface Task extends Entity, HasDeltaDescription {
  name: string;
  dueDate: Date;
  rcomments?: Rcomment[];

  course?: Course;
  courseId: number;

  user?: User;
  userId: number;
}
