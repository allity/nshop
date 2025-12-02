import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 자동 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드 오면 에러
      transform: true, // payload를 DTO 타입으로 변환
    }),
  );

  await app.listen(8080);
}
bootstrap();
