import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { RMQ_QUEUES } from '@app/shared';
import { ChatAppModule } from './chat-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: RMQ_QUEUES.CHAT,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  await app.listen().then(() => console.info('Chat Service is running'));
}
bootstrap();
