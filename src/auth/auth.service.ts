import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CommonResponseDto } from '../common/dto/response/common-response.dto';
import { AUTH_ERROR_MESSAGES } from './constants/auth.constant';
import { KakaoLoginRequestDto } from './dto/request/kakao-login-request.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { AuthDataDto, AuthResponseDto } from './dto/response/auth-response.dto';
import { User } from './entities/user.entity';

interface IAuthService {
  register(registerDto: RegisterRequestDto): Promise<AuthResponseDto>;
  login(loginDto: LoginRequestDto): Promise<AuthResponseDto>;
  kakaoLogin(kakaoLoginDto: KakaoLoginRequestDto): Promise<AuthResponseDto>;
  validateUser(userId: string): Promise<boolean>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    const token = this.generateToken(user.id);

    return CommonResponseDto.success<AuthDataDto>({
      userId: user.id,
      token,
      name: user.name,
      email: user.email,
    });
  }

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(user.id);
    return CommonResponseDto.success<AuthDataDto>({
      userId: user.id,
      token,
      name: user.name,
      email: user.email,
    });
  }

  async kakaoLogin(
    kakaoLoginDto: KakaoLoginRequestDto,
  ): Promise<AuthResponseDto> {
    // TODO: 카카오 토큰 검증 및 사용자 정보 조회 로직 구현
    const userId = `kakao-${kakaoLoginDto.accessToken.substring(0, 8)}`;
    const token = this.generateToken(userId);

    return CommonResponseDto.success<AuthDataDto>({
      userId,
      token,
      name: kakaoLoginDto.name || 'Kakao User',
    });
  }

  async validateUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return !!user;
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }
}
