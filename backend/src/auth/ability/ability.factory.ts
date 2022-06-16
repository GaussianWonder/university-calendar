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
import {
  CourseRole,
  FacultyRole,
  Role,
  RoleTitle,
  TaskRole,
  UniversityRole,
} from 'src/models/user/entities/role.entity';
import { User, UserRole } from 'src/models/user/entities/user.entity';
import { Repository } from 'typeorm';
import RoleIdentifier from './abilities.role.utils';

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
    @InjectRepository(UniversityRole)
    private readonly universityRoleRepository: Repository<UniversityRole>,
    @InjectRepository(FacultyRole)
    private readonly facultyRoleRepository: Repository<FacultyRole>,
    @InjectRepository(CourseRole)
    private readonly courseRoleRepository: Repository<CourseRole>,
    @InjectRepository(TaskRole)
    private readonly taskRoleRepository: Repository<TaskRole>,
  ) {}

  // Get all model roles of a user and return them as role identifiers
  async getRoles(user: User) {
    const roleQueryCondition = { userId: user.id };
    const roleQueryOpts = { where: roleQueryCondition };

    const [uRoles, fRoles, cRoles, tRoles] = await Promise.all([
      this.universityRoleRepository
        .find({
          ...roleQueryOpts,
          relations: ['university'],
        })
        .then((uRoles) =>
          new RoleIdentifier<University, UniversityRole, RoleTitle>((role) => ({
            subject: role.university,
            subjectId: role.universityId,
            title: role.title,
          })).from(uRoles),
        ),
      this.facultyRoleRepository
        .find({
          ...roleQueryOpts,
          relations: ['faculty'],
        })
        .then((fRoles) =>
          new RoleIdentifier<Faculty, FacultyRole, RoleTitle>((role) => ({
            subject: role.faculty,
            subjectId: role.facultyId,
            title: role.title,
          })).from(fRoles),
        ),
      this.courseRoleRepository
        .find({
          ...roleQueryOpts,
          relations: ['course'],
        })
        .then((cRoles) =>
          new RoleIdentifier<Course, CourseRole, RoleTitle>((role) => ({
            subject: role.course,
            subjectId: role.courseId,
            title: role.title,
          })).from(cRoles),
        ),
      this.taskRoleRepository
        .find({
          ...roleQueryOpts,
          relations: ['task'],
        })
        .then((tRoles) =>
          new RoleIdentifier<Task, TaskRole, RoleTitle>((role) => ({
            subject: role.task,
            subjectId: role.taskId,
            title: role.title,
          })).from(tRoles),
        ),
    ]);

    return [uRoles, fRoles, cRoles, tRoles] as const;
  }

  async defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.role === UserRole.Admin) {
      // Can manage all
      can(Action.Manage, 'all');
    } else {
      // A user can only manage himself, whoever he is
      can(Action.Manage, User, { id: { $eq: user.id } });

      // A user must be able to create and read Rcomments, whoever he is
      can(Action.Create, Rcomment);
      can(Action.Read, Rcomment);
      {
        // A user must manage his own Rcomments, whoever he is
        const rcomments = await this.rcommentRepository.find({
          where: { userId: user.id },
        });
        rcomments.forEach(({ id }) => {
          can(Action.Manage, Rcomment, { id: { $eq: id } });
        });
      }

      // TODO this can be shortened. repeated code...
      // Role dependent abilities:
      const [uRoles, fRoles, cRoles, tRoles] = await this.getRoles(user);

      tRoles.match([
        [
          RoleTitle.Moderator,
          ({
            subjectId: id,
            subject: {
              courseId,
              course: {
                facultyId,
                faculty: { universityId },
              },
            },
          }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: facultyId } });
            can(Action.Read, Course, { id: { $eq: courseId } });
            can(Action.Read, Task, { id: { $eq: id } });
            can(Action.Update, Task, { id: { $eq: id } });
          },
        ],
        [
          RoleTitle.Reader,
          ({
            subjectId: id,
            subject: {
              courseId,
              course: {
                facultyId,
                faculty: { universityId },
              },
            },
          }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: facultyId } });
            can(Action.Read, Course, { id: { $eq: courseId } });
            can(Action.Read, Task, { id: { $eq: id } });
          },
        ],
      ]);

      cRoles.match([
        [
          RoleTitle.Moderator,
          ({
            subjectId: id,
            subject: {
              faculty: { universityId },
              facultyId,
            },
          }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: facultyId } });
            can(Action.Read, Course, { id: { $eq: id } });
            can(Action.Update, Course, { id: { $eq: id } });
          },
        ],
        [
          RoleTitle.Reader,
          ({
            subjectId: id,
            subject: {
              faculty: { universityId },
              facultyId,
            },
          }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: facultyId } });
            can(Action.Read, Course, { id: { $eq: id } });
            can(Action.Read, Task, { courseId: { $eq: id } });
          },
        ],
      ]);

      fRoles.match([
        [
          RoleTitle.Moderator,
          ({ subjectId: id, subject: { universityId } }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: id } });
            can(Action.Update, Faculty, { id: { $eq: id } });
          },
        ],
        [
          RoleTitle.Reader,
          ({ subjectId: id, subject: { universityId } }) => {
            can(Action.Read, University, { id: { $eq: universityId } });
            can(Action.Read, Faculty, { id: { $eq: id } });
          },
        ],
      ]);

      uRoles.match([
        [
          RoleTitle.Moderator,
          ({ subjectId: id }) => {
            can(Action.Read, University, { id: { $eq: id } });
            can(Action.Manage, University, { id: { $eq: id } });
          },
        ],
        [
          RoleTitle.Reader,
          ({ subjectId: id }) => {
            can(Action.Read, University, { id: { $eq: id } });
          },
        ],
      ]);

      if (user.role === UserRole.Teacher) {
        can(Action.Create, Course);
        can(Action.Create, Task);
        can(Action.Read, User);

        cRoles.match([
          [
            RoleTitle.Moderator,
            ({ subjectId: id }) => {
              can(Action.Manage, Course, { id: { $eq: id } });
              can(Action.Manage, Task, { courseId: { $eq: id } });
            },
          ],
        ]);
      }

      if (user.role === UserRole.Staff) {
        can(Action.Create, Task);
        can(Action.Read, User);
      }

      // If student, no other special rules apply other than the ones above
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
