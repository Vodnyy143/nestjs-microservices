import { NestFactory } from '@nestjs/core';
import {ZodValidationPipe} from "nestjs-zod";

import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT, () => {
    console.info(`API Gateway running on port ${process.env.PORT}`);
  });
}
bootstrap();
