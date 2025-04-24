import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
export class CreateDreamDto {
  @ApiProperty({ description: '꿈을 꾼 날짜', example: '2024-01-01' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '꿈의 제목', example: '하늘을 날아다니는 꿈' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '꿈의 내용',
    example:
      '나는 하늘을 자유롭게 날아다녔다. 바람이 얼굴을 스치는 느낌이 좋았다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '감정 상태', example: '행복' })
  @IsString()
  @IsNotEmpty()
  mood: string;

  // TODO: 제거
  @ApiProperty({
    description: '사용자 ID',
    example: 'b17bcaa1-0a4d-4cff-99ad-c2b6663cfdb5',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
