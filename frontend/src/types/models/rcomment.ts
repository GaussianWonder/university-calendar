import { HasDeltaContent } from "../utility/delta-content";
import { Entity } from "./entity";
import { Task } from "./task";
import { User } from "./user";

export interface Rcomment extends Entity, HasDeltaContent {
  user?: User;
  userId: number;

  task?: Task;
  taskId: number;
}
