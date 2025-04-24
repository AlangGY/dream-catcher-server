import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DevAuthGuard } from 'src/auth/guards/dev-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());

  // 글로벌 가드 설정
  // DevAuthGuard가 먼저 실행되고, 그 다음에 JwtAuthGuard가 실행됨
  app.useGlobalGuards(
    new DevAuthGuard(
      app.get(Reflector),
      app.get(ConfigService),
      app.get(UserRepository),
    ),
    new JwtAuthGuard(app.get(Reflector), app.get(ConfigService)),
  );

  const config = new DocumentBuilder()
    .setTitle('Dream Catcher API')
    .setDescription('Dream Catcher 서비스의 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT 토큰을 입력해주세요',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
