import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { RMQ_QUEUES } from '@app/shared';
import { UsersAppModule } from './users-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: RMQ_QUEUES.USERS,
        queueOptions: {
          durable: true,
        },
        noAck: true,
      },
    },
  );

  await app.listen().then(() => console.info('Users App is running'));
}
bootstrap();
