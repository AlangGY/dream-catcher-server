import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/response/common-response.dto';
import { DreamInterviewSpeaker } from '../../entities/dream-interview-question.entity';
import { DreamInterviewStatus } from '../../entities/dream-interview.entity';

export class DreamInterviewMessageDto {
  @ApiProperty({ description: '메시지 ID', example: 'message-uuid-1234' })
  id: string;

  @ApiProperty({ description: '메시지 순서', example: 1 })
  order: number;

  @ApiProperty({
    enum: DreamInterviewSpeaker,
    description: '화자',
    example: DreamInterviewSpeaker.USER,
  })
  speaker: DreamInterviewSpeaker;

  @ApiProperty({
    description: '메시지 내용',
    example: '어젯밤에 꾼 꿈을 간단히 설명해 주세요.',
  })
  message: string;

  @ApiProperty({
    description: '메시지 전송 시각',
    example: '2024-05-01T12:00:00.000Z',
  })
  sentAt: Date;
}

export class DreamInterviewDataDto {
  @ApiProperty({
    description: '인터뷰 세션 ID',
    example: 'interview-uuid-1234',
  })
  id: string;

  @ApiProperty({ description: '사용자 ID', example: 'user-uuid-1234' })
  userId: string;

  @ApiProperty({ enum: DreamInterviewStatus, description: '인터뷰 상태' })
  status: DreamInterviewStatus;

  @ApiProperty({
    description: '인터뷰 시작 시각',
    example: '2024-05-01T12:00:00.000Z',
  })
  startedAt: Date;

  @ApiPropertyOptional({
    description: '인터뷰 종료 시각',
    example: '2024-05-01T12:10:00.000Z',
  })
  endedAt?: Date;

  @ApiProperty({
    type: [DreamInterviewMessageDto],
    description: '메시지(채팅) 목록',
  })
  messages: DreamInterviewMessageDto[];

  @ApiPropertyOptional({
    description: 'AI 분석 결과',
    example: '이 꿈은 불안감을 의미할 수 있습니다.',
  })
  result?: string;

  @ApiProperty({
    description: '인터뷰 생성 시각',
    example: '2024-05-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '인터뷰 업데이트 시각',
    example: '2024-05-01T12:00:00.000Z',
  })
  updatedAt: Date;
}

export class DreamInterviewListItemDto {
  @ApiProperty({
    description: '인터뷰 세션 ID',
    example: 'interview-uuid-1234',
  })
  id: string;

  @ApiProperty({ enum: DreamInterviewStatus, description: '인터뷰 상태' })
  status: DreamInterviewStatus;

  @ApiProperty({
    description: '인터뷰 시작 시각',
    example: '2024-05-01T12:00:00.000Z',
  })
  startedAt: Date;

  @ApiPropertyOptional({
    description: '인터뷰 종료 시각',
    example: '2024-05-01T12:10:00.000Z',
  })
  endedAt?: Date;

  @ApiPropertyOptional({
    description: '마지막 메시지',
  })
  lastMessage?: DreamInterviewMessageDto;
}

export class DreamInterviewListDto {
  @ApiProperty({
    type: [DreamInterviewListItemDto],
    description: '인터뷰 목록',
  })
  items: DreamInterviewListItemDto[];

  @ApiProperty({
    description: '총 인터뷰 수',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '페이지당 인터뷰 수',
    example: 10,
  })
  limit: number;
}

export class DreamInterviewResponseDto extends CommonResponseDto<DreamInterviewDataDto> {
  @ApiProperty({ type: DreamInterviewDataDto })
  data: DreamInterviewDataDto;
}

export class DreamInterviewListResponseDto extends CommonResponseDto<DreamInterviewListDto> {
  @ApiProperty({ type: DreamInterviewListDto })
  data: DreamInterviewListDto;
}
