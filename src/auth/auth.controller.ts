import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { KakaoLoginRequestDto } from './dto/request/kakao-login-request.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { AuthDataDto, AuthResponseDto } from './dto/response/auth-response.dto';
import { User } from './entities/user.entity';
import { AuthExceptionFilter } from './filters/auth-exception.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('인증')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: () => AuthResponseDto,
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: () => AuthResponseDto,
  })
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 200,
    description: '카카오 로그인 성공',
    type: () => AuthResponseDto,
  })
  @Post('kakao')
  async kakaoLogin(
    @Body() kakaoLoginDto: KakaoLoginRequestDto,
  ): Promise<AuthResponseDto> {
    return this.authService.kakaoLogin(kakaoLoginDto);
  }

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    type: () => AuthResponseDto,
  })
  @ApiBearerAuth('access-token')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User): AuthResponseDto {
    return AuthResponseDto.success<AuthDataDto>({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  }
}
