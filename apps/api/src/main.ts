import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
