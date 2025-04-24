import { ApiProperty } from '@nestjs/swagger';

export class GetDreamsDto {
  @ApiProperty({ description: '페이지 번호', default: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', default: 10 })
  limit: number;

  @ApiProperty({ description: '조회 시작 날짜', required: false })
  startDate?: string;

  @ApiProperty({ description: '조회 종료 날짜', required: false })
  endDate?: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;
}
