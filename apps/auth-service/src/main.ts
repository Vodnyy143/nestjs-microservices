import { NestFactory } from '@nestjs/core';

import { AuthAppModule } from './auth-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  console.log(RMQ_QUEUES.AUTH);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: RMQ_QUEUES.AUTH,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  await app.listen().then(() => console.info('Auth Service is running'));
}
bootstrap();
