import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
