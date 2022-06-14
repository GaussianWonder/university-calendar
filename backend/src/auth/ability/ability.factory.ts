import {
  Ability,
  AbilityBuilder,
  InferSubjects,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/models/course/entities/course.entity';
import { Faculty } from 'src/models/faculty/entities/faculty.entity';
import { Rcomment } from 'src/models/rcomment/entities/rcomment.entity';
import { Task } from 'src/models/task/entities/task.entity';
import { University } from 'src/models/university/entities/university.entity';
import { User, UserRole } from 'src/models/user/entities/user.entity';
import { Repository } from 'typeorm';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

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
  constructor(
    @InjectRepository(Rcomment)
    private readonly rcommentRepository: Repository<Rcomment>,
  ) {}

  async defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    // A user can only manage himself
    can(Action.Manage, User, { id: { $eq: user.id } });

    // Abilities independent of roles
    {
      // Can manage his own rcomments
      const rcomments = await this.rcommentRepository.find({
        where: { userId: user.id },
      });
      rcomments.forEach(({ id }) => {
        can(Action.Manage, Rcomment, { id: { $eq: id } });
      });
    }

    // Role dependent abilities
    switch (user.role) {
      case UserRole.Admin:
        can(Action.Manage, 'all');
        break;
      case UserRole.Teacher:
        // Cannot directly manage university and faculty
        can(Action.Read, 'all');
        can(Action.Manage, Course);
        can(Action.Manage, Task);
        can(Action.Manage, Rcomment);
        break;
      case UserRole.Staff:
        // Cannot directly manage university, faculty and courses
        can(Action.Read, 'all');
        can(Action.Manage, Task);
        can(Action.Manage, Rcomment);
        break;
      case UserRole.Student:
        // Cannot manage anything except his own resources
        can(Action.Read, University);
        can(Action.Read, Faculty);
        can(Action.Read, Course);
        can(Action.Read, Task);
        can(Action.Read, Rcomment);
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
