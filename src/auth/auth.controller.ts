import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { User } from './entities/user.entity';
import { AuthExceptionFilter } from './filters/auth-exception.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OAuthService } from './services/oauth.service';

@ApiTags('인증')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
  ) {}

  @Get('kakao/url')
  @ApiOperation({ summary: '카카오 로그인 URL 가져오기' })
  @ApiResponse({
    status: 200,
    description: '카카오 로그인 URL 반환 성공',
  })
  getKakaoAuthUrl(@Query('platform') platform: 'web' | 'app' = 'web') {
    return this.oauthService.getKakaoAuthUrl(platform);
  }

  @Get('kakao/callback/web')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 웹 로그인 콜백 처리' })
  async kakaoWebCallback(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const redirectUrl = this.oauthService.processKakaoWebCallback(req.user);
    return res.redirect(redirectUrl);
  }

  @Get('kakao/callback/app')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 앱 로그인 콜백 처리' })
  @ApiResponse({
    status: 200,
    description: '카카오 앱 로그인 성공',
    type: () => AuthResponseDto,
  })
  async kakaoAppCallback(@Req() req: AuthenticatedRequest) {
    return this.oauthService.processKakaoAppCallback(req.user);
  }

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
    return AuthResponseDto.success({
      userId: user.id,
      accessToken: '',
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
    });
  }
}
