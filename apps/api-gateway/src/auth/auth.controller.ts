import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  LoginDto,
  LoginSchema,
  RefreshTokenDto,
  RefreshTokenSchema,
  RegisterDto,
  RegisterSchema,
} from '@app/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { log } from 'node:util';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto) {
    console.log(dto);
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.REGISTER, dto));
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto) {
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.LOGIN, dto));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGOUT, { userId: req.user.userId }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) dto: RefreshTokenDto,
  ) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.REFRESH_TOKEN, dto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
