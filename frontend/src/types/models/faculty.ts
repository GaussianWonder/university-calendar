import { HasDeltaDescription } from "../utility/delta-content";
import { Course } from "./course";
import { Entity } from "./entity";
import { University } from "./university";

export interface Faculty extends Entity, HasDeltaDescription {
  name: string;
  courses?: Course[];
  university?: University;
  universityId: number;
}
