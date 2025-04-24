import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../../../common/dto/response/common-response.dto';
import { DreamDto } from './dream.dto';

export class DreamListResponseData {
  @ApiProperty({ description: '꿈 목록', type: [DreamDto] })
  dreams: DreamDto[];

  @ApiProperty({ description: '페이지네이션 정보' })
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export class DreamResponseDto extends CommonResponseDto<DreamDto> {
  @ApiProperty({ type: DreamDto })
  data: DreamDto;
}
export class DreamListResponseDto extends CommonResponseDto<DreamListResponseData> {
  @ApiProperty({ type: DreamListResponseData })
  data: DreamListResponseData;
}
