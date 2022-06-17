import { Entity } from "./entity";

export enum UserRole {
  Student = 'student',
  Staff = 'staff',
  Teacher = 'teacher',
  Admin = 'admin',
}

export interface User extends Entity {
  username: string;
  role: UserRole;
}

export enum RoleCategory {
  University = 'university',
  Faculty = 'faculty',
  Course = 'course',
  Task = 'task',
}

export enum RoleTitle {
  Moderator = 'moderator',
  Reader = 'reader',
}

export interface Role {
  id: number;

  user?: User;
  userId: number;

  category: RoleCategory;
  title: RoleTitle;

  // Maybe these will never be used
  universityId?: number;
  facultyId?: number;
  taskId?: number;
  courseId?: number;
}
