import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 모든 요청에 DTO 검증 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 제거
      transform: true, // 요청 body를 DTO 클래스 인스턴스로 변환
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
