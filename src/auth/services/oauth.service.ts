import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from '../dto/response/auth-response.dto';
import { OAuthProviderType } from '../entities/oauth-provider.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OAuthService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 카카오 로그인 URL을 생성합니다.
   */
  getKakaoAuthUrl(platform: 'web' | 'app' = 'web'): { url: string } {
    const clientId = this.configService.get<string>('KAKAO_CLIENT_ID');
    const redirectUri =
      platform === 'app'
        ? this.configService.get<string>('KAKAO_APP_REDIRECT_URI')
        : this.configService.get<string>('KAKAO_WEB_REDIRECT_URI');

    const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
    kakaoAuthUrl.searchParams.append('client_id', clientId);
    kakaoAuthUrl.searchParams.append('redirect_uri', redirectUri);
    kakaoAuthUrl.searchParams.append('response_type', 'code');

    return { url: kakaoAuthUrl.toString() };
  }

  /**
   * 카카오 웹 로그인 콜백 처리를 위한 리다이렉트 URL을 생성합니다.
   */
  processKakaoWebCallback(user: User): string {
    const kakaoCredential = this.findKakaoCredential(user);

    const redirectUrl = new URL(this.configService.get<string>('FRONTEND_URL'));
    redirectUrl.searchParams.append(
      'access_token',
      kakaoCredential.accessToken,
    );
    redirectUrl.searchParams.append(
      'refresh_token',
      kakaoCredential.refreshToken,
    );

    return redirectUrl.toString();
  }

  /**
   * 카카오 앱 로그인 콜백 처리 결과를 반환합니다.
   */
  processKakaoAppCallback(user: User): AuthResponseDto {
    const kakaoCredential = this.findKakaoCredential(user);

    return AuthResponseDto.success({
      userId: user.id,
      accessToken: kakaoCredential.accessToken,
      refreshToken: kakaoCredential.refreshToken,
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
    });
  }

  /**
   * 사용자의 카카오 OAuth 자격 증명을 찾습니다.
   */
  private findKakaoCredential(user: User) {
    const kakaoCredential = user.oauthCredentials?.find(
      (credential) => credential.provider.name === OAuthProviderType.KAKAO,
    );

    if (!kakaoCredential) {
      throw new NotFoundException('카카오 로그인 정보를 찾을 수 없습니다.');
    }

    return kakaoCredential;
  }
}
