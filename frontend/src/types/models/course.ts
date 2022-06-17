import { HasDeltaDescription } from "../utility/delta-content";
import { Entity } from "./entity";
import { Faculty } from "./faculty";
import { Task } from "./task";

export interface Course extends Entity, HasDeltaDescription {
  name: string;
  tasks?: Task[];
  faculty?: Faculty;
  facultyId: number;
}
