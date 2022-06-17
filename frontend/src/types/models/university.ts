import { HasDeltaDescription } from "../utility/delta-content";
import { Entity } from "./entity";
import { Faculty } from "./faculty";

export interface University extends Entity, HasDeltaDescription {
  name: string;
  faculties?: Faculty[];
}
