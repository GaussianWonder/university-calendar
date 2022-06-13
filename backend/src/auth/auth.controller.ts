import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/models/user/dto/create-user.dto';
import { LoginUserDto } from 'src/models/user/dto/login-user.dto';
import { User, UserRole } from 'src/models/user/entities/user.entity';
import { CheckAbilities } from './ability/abilities.decorator';
import { AbilitiesGuard } from './ability/abilities.guard';
import { Action } from './ability/ability.factory';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('1. Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiOperation({
    summary: 'Request an authorization JWT.',
  })
  async login(@Request() req, @Response() res) {
    const { access_token } = await this.authService.login(req.user);
    res.send({ access_token });
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a user.',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser({
      ...createUserDto,
      role: UserRole.Student,
    });
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @Get('me')
  @CheckAbilities({
    action: Action.Read,
    subject: User,
  })
  @ApiOperation({
    summary: 'Get currently authenticated user details.',
  })
  @ApiBearerAuth()
  me(@ReqUser() user: User) {
    return user;
  }
}
