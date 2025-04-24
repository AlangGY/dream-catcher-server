import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class DevAuthGuard implements CanActivate {
  private readonly logger = new Logger(DevAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 공개 엔드포인트인 경우 인증 생략
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 개발 환경에서만 동작
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (!isDev) {
      console.warn('DevAuthGuard는 개발 환경에서만 사용해야 합니다!');
      return false;
    }

    try {
      const user = await this.userRepository.findById(
        'b17bcaa1-0a4d-4cff-99ad-c2b6663cfdb5',
      );

      if (!user) {
        console.warn('DevAuthGuard: 유저를 찾을 수 없습니다.');
        return false;
      }

      // Request 객체에 사용자 정보 추가
      const request = context.switchToHttp().getRequest();
      request.user = user;

      return true;
    } catch (error) {
      console.error('DevAuthGuard 오류:', error);
      return false;
    }
  }
}
