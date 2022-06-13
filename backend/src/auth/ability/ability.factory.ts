import {
  Ability,
  AbilityBuilder,
  InferSubjects,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Course } from 'src/models/course/entities/course.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { University } from 'src/models/university/entities/university.entity';
import { User, UserRole } from 'src/models/user/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// TODO add other subjects as needed
type AppSubjects =
  | typeof User
  | typeof University
  | typeof Faculty
  | typeof Course
  | typeof Task
  | typeof Rcomment;

export type Subjects = InferSubjects<AppSubjects> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    // A user can request a read of other users
    can(Action.Read, User);

    // A user can only manage himself
    can(Action.Manage, User, { id: { $eq: user.id } });

    // Role dependent abilities
    switch (user.role) {
      case UserRole.Admin:
        can(Action.Manage, 'all');
        break;
      case UserRole.Teacher:
        can(Action.Read, 'all');
        can(Action.Manage, Course);
        can(Action.Manage, Task);
        can(Action.Manage, Rcomment);
        break;
      case UserRole.Staff:
        can(Action.Read, 'all');
        can(Action.Manage, Task);
        can(Action.Manage, Rcomment);
        break;
      case UserRole.Student:
        can(Action.Read, 'all');
        can(Action.Manage, Rcomment);
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
