import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'Password123!',
  })
  @IsString()
  password: string;
}
