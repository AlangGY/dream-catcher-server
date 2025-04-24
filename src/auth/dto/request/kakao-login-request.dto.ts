import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KakaoLoginRequestDto {
  @ApiProperty({
    description: '카카오 액세스 토큰',
    example: 'kakao_access_token',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
