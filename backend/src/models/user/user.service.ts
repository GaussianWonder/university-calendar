import { ForbiddenError } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbilityFactory,
  Action,
  AppAbility,
  Subjects,
} from 'src/auth/ability/ability.factory';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Role,
  RoleCategory,
  RoleSubjectId,
  RoleTitle,
} from './entities/role.entity';
import { User } from './entities/user.entity';

interface FindByUsername {
  username: string;
}

interface FindById {
  id: number;
}

type FindOneUser = FindByUsername | FindById;
type FindOneUserOptions = FindOneUser & { relations?: string[] };

export interface RoleOpts {
  category: RoleCategory;
  title: RoleTitle;
  subject: RoleSubjectId;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async abilityOf(user: User): Promise<AppAbility> {
    return this.abilityFactory.defineAbility(user);
  }

  async canUserDo(
    user: User,
    action: Action,
    subject: Subjects,
    field?: string,
  ) {
    const ability = await this.abilityOf(user);
    return ability.can(action, subject, field);
  }

  async canUserFilter(user: User, action: Action, field?: string) {
    const ability = await this.abilityOf(user);
    return (subject: Subjects) => ability.can(action, subject, field);
  }

  async forbiddenUnlessCan(
    user: User,
    action: Action,
    subject: Subjects,
    field?: string,
  ) {
    const ability = await this.abilityOf(user);
    ForbiddenError.from(ability).throwUnlessCan(action, subject, field);
  }

  async create(createDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createDto,
    });
    return this.userRepository.save(user);
  }

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async findSimilarUsernames(
    usernameAlike: string,
    limit = 50,
  ): Promise<User[]> {
    return this.findAll({
      where: {
        username: Like(`%${usernameAlike}%`),
      },
      order: {
        username: 'ASC',
      },
      take: limit,
    });
  }

  async findOne(opts: FindOneUserOptions) {
    const findType: 'username' | 'id' = 'username' in opts ? 'username' : 'id';
    const findBy: string | number = opts[findType];
    const relations = 'relations' in opts ? opts.relations : [];

    return this.userRepository.findOneOrFail({
      where: { [findType]: findBy },
      relations,
    });
  }

  async assignRole(user: User, roleOpts: RoleOpts): Promise<Role> {
    if (Object.keys(roleOpts.subject).length !== 1)
      throw new BadRequestException('Subject must be a single unique key');

    const role = this.roleRepository.create({
      userId: user.id,
      category: roleOpts.category,
      title: roleOpts.title,
      ...roleOpts.subject,
    });
    return this.roleRepository.save(role);
  }
}
