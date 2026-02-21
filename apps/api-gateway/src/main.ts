import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .setDescription('Сайт платформа с чатом для друзей')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 5000, () => {
    console.info(`API Gateway running on port ${process.env.PORT || 5000}`);
    console.info(
      `API Docs running on url http://localhost:${process.env.PORT}/api/docs`,
    );
  });
}
bootstrap();
