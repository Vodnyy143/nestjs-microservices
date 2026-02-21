import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

import {
  AUTH_PATTERNS,
  LoginDto,
  LoginSchema,
  RefreshTokenDto,
  RefreshTokenSchema,
  RegisterDto,
  RegisterSchema,
} from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'username', 'password'],
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        username: { type: 'string', example: 'user' },
        password: { type: 'string', example: 'password' },
      },
    },
  })
  register(@Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto) {
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.REGISTER, dto));
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in to system' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        password: { type: 'string', example: 'password' },
      },
    },
  })
  login(@Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto) {
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.LOGIN, dto));
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out from system' })
  @ApiBearerAuth()
  logout(@Req() req: any) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGOUT, { userId: req.user.userId }),
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', example: 'uuid' },
      },
    },
  })
  refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) dto: RefreshTokenDto,
  ) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.REFRESH_TOKEN, dto),
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authorized user' })
  @ApiBearerAuth()
  me(@Req() req: any) {
    return req.user;
  }
}
