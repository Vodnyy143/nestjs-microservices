import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenEntity } from './entities/auth.entity';
import { EnvService } from '../env/env.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ({
          secret: envService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: envService.get('JWT_ACCESS_EXP'),
          },
        }) as JwtModuleOptions,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        inject: [EnvService],
        useFactory: (envService: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [envService.get('RABBITMQ_URL')],
            queue: RMQ_QUEUES.USERS,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
