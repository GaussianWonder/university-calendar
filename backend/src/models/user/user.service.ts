import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createDto,
    });
    return this.userRepository.save(user);
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
    const role = this.roleRepository.create({
      userId: user.id,
      category: roleOpts.category,
      title: roleOpts.title,
      ...roleOpts.subject,
    });
    return this.roleRepository.save(role);
  }
}
