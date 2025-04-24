import { ApiProperty } from '@nestjs/swagger';

export class CreateDreamDto {
  @ApiProperty({ description: '꿈을 꾼 날짜' })
  date: string;

  @ApiProperty({ description: '꿈의 제목' })
  title: string;

  @ApiProperty({ description: '꿈의 내용' })
  content: string;

  @ApiProperty({ description: '감정 상태' })
  mood: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;
}
