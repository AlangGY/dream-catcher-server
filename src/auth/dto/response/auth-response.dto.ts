import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../../../common/dto/response/common-response.dto';

export class AuthDataDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: 'JWT 토큰', required: false })
  token?: string;

  @ApiProperty({ description: '사용자 이름', required: false })
  name?: string;

  @ApiProperty({ description: '이메일 주소', required: false })
  email?: string;

  static _type = AuthDataDto;
}

export class AuthResponseDto extends CommonResponseDto<AuthDataDto> {}
