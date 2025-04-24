import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'src/common/services/transaction.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthCredential } from './entities/oauth-credential.entity';
import { OAuthProvider } from './entities/oauth-provider.entity';
import { User } from './entities/user.entity';
import { OAuthCredentialRepository } from './repositories/oauth-credential.repository';
import { OAuthProviderRepository } from './repositories/oauth-provider.repository';
import { UserRepository } from './repositories/user.repository';
import { OAuthService } from './services/oauth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, OAuthProvider, OAuthCredential]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoStrategy,
    JwtStrategy,
    UserRepository,
    OAuthProviderRepository,
    OAuthCredentialRepository,
    TransactionService,
    OAuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
