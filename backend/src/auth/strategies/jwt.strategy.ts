import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      /**
       * Search for the authorization header with priority
       *  1. Authorization: Bearer <token>
       *  2. Cookie: access_token
       *  3. Body: access_token
       *  4. Query Param: access_token
       */
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.fromCookie('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  static fromCookie(param_name: string) {
    return (req: Request) => {
      if (!req.cookies || !req.cookies[param_name]) return null;
      return req.cookies[param_name];
    };
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({
      id: payload.sub,
      relations: [],
    });

    return user;
  }
}
