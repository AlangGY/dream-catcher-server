import { ApiProperty } from '@nestjs/swagger';
import { DreamInterviewSpeaker } from '../../entities/dream-interview-question.entity';

export class AnswerDreamInterviewDto {
  @ApiProperty({
    description: '인터뷰 세션 ID',
    example: 'interview-uuid-1234',
  })
  interviewId: string;

  @ApiProperty({
    enum: DreamInterviewSpeaker,
    description: '화자',
    example: DreamInterviewSpeaker.USER,
  })
  speaker: DreamInterviewSpeaker;

  @ApiProperty({
    description: '메시지 내용',
    example: '나는 어젯밤에 높은 곳에서 떨어지는 꿈을 꿨어.',
  })
  message: string;
}
