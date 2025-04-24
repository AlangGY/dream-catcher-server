import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Public 데코레이터가 적용된 경우 인증 생략
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 개발 환경이고 DevAuthGuard가 적용되어 있는지 확인
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (isDev) {
      const request = context.switchToHttp().getRequest();
      // DevAuthGuard에 의해 request.user가 이미 설정된 경우 JWT 인증 스킵
      if (request.user) {
        this.logger.debug('DevAuthGuard에 의해 인증되어 JWT 인증 스킵');
        return true;
      }
    }

    // 그 외 경우엔 기본 JWT 인증 진행
    return super.canActivate(context);
  }
}
