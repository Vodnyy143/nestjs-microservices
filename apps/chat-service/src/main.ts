import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { RMQ_QUEUES } from '@app/shared';
import { ChatAppModule } from './chat-app.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatAppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: RMQ_QUEUES.CHAT,
      queueOptions: {
        durable: true,
      },
      noAck: true,
    },
  });
  await app.startAllMicroservices();

  const wsPort = process.env.WS_PORT;

  await app.listen(wsPort).then(() => {
    console.info('Chat Service RMQ is running');
    console.info(`Chat Service WebSocket is running on port ${wsPort}`);
  });
}
bootstrap();
