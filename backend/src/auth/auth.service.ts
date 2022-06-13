import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, User } from 'src/models/user/entities/user.entity';
import { UserService } from 'src/models/user/user.service';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

interface RegisterOptions {
  username: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ username, id }: { username: string; id: number }) {
    const payload = {
      username,
      sub: id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(opts: RegisterOptions): Promise<User> {
    opts.password = await bcrypt.hash(opts.password, 12);
    return this.usersService.create(opts);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
