import { OAuthProviderType } from 'src/auth/entities/oauth-provider.entity';

interface OAuthProfile {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
}
interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface ValidateOAuthLoginDto {
  provider: OAuthProviderType;
  code: string;
  tokens: OAuthTokens;
  profile: OAuthProfile;
}
