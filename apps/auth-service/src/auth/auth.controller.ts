import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@app/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() dto: RegisterDto) {
    console.log(dto);
    return this.authService.register(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_TOKEN)
  validateToken(@Payload() payload: { token: string }) {
    return this.authService.validateToken(payload.token);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  refresh(@Payload() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  logout(@Payload() payload: { userId: string }) {
    return this.authService.logout(payload.userId);
  }
}
