import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { AuthService } from '../auth.service';
import { OAuthProviderType } from '../entities/oauth-provider.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_WEB_REDIRECT_URI'),
      state: true, // CSRF 방지
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User> {
    const { id, kakao_account } = profile._json;

    const oauthLoginDto = {
      provider: OAuthProviderType.KAKAO,
      code: '', // Passport 전략에서는 code 대신 직접 토큰을 받음
      tokens: {
        accessToken,
        refreshToken,
      },
      profile: {
        id: String(id),
        email: kakao_account.email,
        nickname: kakao_account.profile.nickname,
        profileImage: kakao_account.profile.profile_image_url,
      },
    };

    const result = await this.authService.validateOAuthLogin(oauthLoginDto);

    const user = await this.userRepository.findById(result.user.id);

    return user;
  }
}
