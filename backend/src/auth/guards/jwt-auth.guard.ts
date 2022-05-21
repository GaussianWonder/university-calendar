import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
    const parentCanActivate = !!(await super.canActivate(context)) as boolean;
    // custom logic can go here
    return parentCanActivate;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
