import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ValidateOAuthLoginDto } from 'src/auth/interfaces/ValidateOAuthLoginDto';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommonResponseDto } from '../common/dto/response/common-response.dto';
import { AUTH_ERROR_MESSAGES } from './constants/auth.constant';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { AuthDataDto, AuthResponseDto } from './dto/response/auth-response.dto';
import { User } from './entities/user.entity';
import { OAuthCredentialRepository } from './repositories/oauth-credential.repository';
import { OAuthProviderRepository } from './repositories/oauth-provider.repository';
import { UserRepository } from './repositories/user.repository';

// 인터페이스 정의
interface IAuthService {
  register(registerDto: RegisterRequestDto): Promise<AuthResponseDto>;
  login(loginDto: LoginRequestDto): Promise<AuthResponseDto>;
  validateOAuthLogin(loginDto: ValidateOAuthLoginDto): Promise<any>;
  validateUser(userId: string): Promise<boolean>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly oauthProviderRepository: OAuthProviderRepository,
    private readonly oauthCredentialRepository: OAuthCredentialRepository,
    private readonly jwtService: JwtService,
    private readonly transactionService: TransactionService,
  ) {}

  // 회원가입
  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    let user: User;
    let tokens: { accessToken: string; refreshToken: string };

    await this.transactionService.runInTransaction(async (entityManager) => {
      user = await this.userRepository.create(
        registerDto,
        hashedPassword,
        entityManager,
      );

      tokens = await this.generateTokens(user, entityManager);
    });

    return CommonResponseDto.success<AuthDataDto>({
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
    });
  }

  // 이메일/패스워드 로그인
  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const tokens = await this.generateTokens(user);

    return CommonResponseDto.success<AuthDataDto>({
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
    });
  }
  async validateOAuthLogin(loginDto: ValidateOAuthLoginDto): Promise<any> {
    const provider = await this.oauthProviderRepository.findByName(
      loginDto.provider,
    );

    if (!provider) {
      throw new Error(`Unsupported OAuth provider: ${loginDto.provider}`);
    }

    let credential: any;
    let tokens: { accessToken: string; refreshToken: string };

    await this.transactionService.runInTransaction(async (entityManager) => {
      credential =
        await this.oauthCredentialRepository.findByProviderIdAndProviderId(
          loginDto.profile.id,
          provider,
          entityManager,
        );

      if (!credential) {
        const user = entityManager.create(User, {
          email: loginDto.profile.email,
          nickname: loginDto.profile.nickname,
          profileImage: loginDto.profile.profileImage,
        });

        await this.userRepository.save(user, entityManager);

        credential = await this.oauthCredentialRepository.create(
          loginDto.profile.id,
          user,
          provider,
          loginDto.tokens.accessToken,
          loginDto.tokens.refreshToken,
          entityManager,
        );
      } else {
        credential.user.nickname = loginDto.profile.nickname;
        credential.user.profileImage = loginDto.profile.profileImage;

        await this.userRepository.save(credential.user, entityManager);

        await this.oauthCredentialRepository.update(
          credential,
          loginDto.tokens.accessToken,
          loginDto.tokens.refreshToken,
          entityManager,
        );
      }

      tokens = await this.generateTokens(credential.user, entityManager);
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: credential.user.id,
        email: credential.user.email,
        nickname: credential.user.nickname,
        profileImage: credential.user.profileImage,
      },
    };
  }

  // 사용자 검증
  async validateUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return !!user;
  }

  // JWT 토큰 생성
  private async generateTokens(user: User, entityManager?: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { expiresIn: '1h' },
      ),
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { expiresIn: '7d' },
      ),
    ]);

    // 리프레시 토큰 저장
    await this.userRepository.updateRefreshToken(
      user.id,
      refreshToken,
      entityManager,
    );

    return { accessToken, refreshToken };
  }
}
