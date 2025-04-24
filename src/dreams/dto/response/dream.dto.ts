import { ApiProperty } from '@nestjs/swagger';

export class DreamAnalysisDto {
  @ApiProperty({ description: '꿈 해석' })
  interpretation: string;

  @ApiProperty({ description: '키워드 목록' })
  keywords: string[];

  @ApiProperty({ description: '감정 톤' })
  emotionalTone: string;

  @ApiProperty({ description: '제안 행동' })
  suggestedActions: string[];
}

export class DreamDto {
  @ApiProperty({ description: '꿈 ID' })
  id: string;

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

  @ApiProperty({ description: '꿈 분석 결과', required: false })
  analysis?: DreamAnalysisDto;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}
