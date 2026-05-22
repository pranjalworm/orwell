import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 3000);

  await app.listen(port);
  Logger.log(`Big brother is watching on port: ${port}`, 'Bootstrap');
}
void bootstrap();
