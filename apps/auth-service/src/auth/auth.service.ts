import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/auth.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcryptjs from 'bcryptjs';

import {
  LoginDto,
  RegisterDto,
  TokenPayload,
  USERS_PATTERNS,
} from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = bcryptjs.hashSync(registerDto.password, 10);

    const user = await firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.CREATE_USER, {
        email: registerDto.email,
        username: registerDto.username,
        password: registerDto.password,
        hashedPassword,
      }),
    );

    return this.issueTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.GET_USER_BY_EMAIL, {
        email: loginDto.email,
        includePassword: true,
      }),
    ).catch(() => null);

    if (!user) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    const isValid = bcryptjs.compareSync(
      loginDto.password,
      user.hashedPassword,
    );
    if (!isValid) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
    return { success: true };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new RpcException({
        status: 401,
        message: 'Invalid or expired refresh token',
      });
    }

    const user = await firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.GET_USER, {
        id: tokenRecord.userId,
      }),
    );

    await this.refreshTokenRepository.delete({ id: tokenRecord.id });

    return this.issueTokens(user);
  }

  private async issueTokens(user: {
    id: string;
    email: string;
    username: string;
  }) {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.refreshTokenRepository.save({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
