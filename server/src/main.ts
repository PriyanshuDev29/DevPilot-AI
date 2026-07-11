import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,                      // Fields not mentioned in DTO will automatically be removed
    forbidNonWhitelisted: true,           // Instead of silently removing the field, it throws a 400 Bad Request.
    transform: true,
  }));                  // Converts incoming data to the types defined in your DTO.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();