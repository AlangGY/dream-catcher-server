import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '비밀번호 (8-20자, 영문/숫자/특수문자)',
    example: 'Password123!',
  })
  @IsString()
  @Length(8, 20, { message: '비밀번호는 8-20자 사이여야 합니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '비밀번호는 영문, 숫자, 특수문자(@$!%*#?&)를 모두 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString()
  @Length(2, 20, { message: '이름은 2-20자 사이여야 합니다.' })
  name: string;
}
