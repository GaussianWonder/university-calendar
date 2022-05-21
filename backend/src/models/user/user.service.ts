import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

interface FindByUsername {
  username: string;
}

interface FindById {
  id: number;
}

type FindOneUser = FindByUsername | FindById;
type FindOneUserOptions = FindOneUser & { relations?: string[] };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
