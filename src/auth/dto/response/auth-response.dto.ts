import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../../../common/dto/response/common-response.dto';

export class AuthDataDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: 'JWT 액세스 토큰' })
  accessToken: string;

  @ApiProperty({ description: 'JWT 리프레시 토큰', required: false })
  refreshToken?: string;

  @ApiProperty({ description: '사용자 이름/닉네임' })
  nickname: string;

  @ApiProperty({ description: '이메일 주소' })
  email: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  profileImage?: string;
}

export class AuthResponseDto extends CommonResponseDto<AuthDataDto> {
  @ApiProperty({ type: AuthDataDto })
  data: AuthDataDto;
}
