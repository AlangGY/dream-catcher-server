import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AnswerDreamInterviewDto } from '../dto/request/answer-dream-interview.dto';
import {
  DreamInterviewListResponseDto,
  DreamInterviewResponseDto,
} from '../dto/response/dream-interview-response.dto';
import { DreamInterviewService } from '../services/dream-interview.service';

@ApiTags('꿈 인터뷰')
@Controller('dreams/interview')
export class DreamInterviewController {
  constructor(private readonly dreamInterviewService: DreamInterviewService) {}

  @Post('start')
  @ApiOperation({
    summary: '꿈 인터뷰 시작',
    description: '새로운 꿈 인터뷰 세션을 시작합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '인터뷰 세션 시작 성공',
    type: DreamInterviewResponseDto,
  })
  async startInterview(
    @CurrentUser() user: User,
  ): Promise<DreamInterviewResponseDto> {
    const data = await this.dreamInterviewService.startInterview(user.id);
    return { status: 'success', data };
  }

  @Post('answer')
  @ApiOperation({
    summary: '질문/답변 메시지 추가',
    description: '인터뷰 채팅 메시지를 추가합니다.',
  })
  @ApiBody({ type: AnswerDreamInterviewDto })
  @ApiResponse({
    status: 201,
    description: '메시지 저장 및 전체 메시지 반환',
    type: DreamInterviewResponseDto,
  })
  async answerInterview(
    @Body() dto: AnswerDreamInterviewDto,
  ): Promise<DreamInterviewResponseDto> {
    const data = await this.dreamInterviewService.answerInterview(dto);
    return { status: 'success', data };
  }

  @Post('end')
  @ApiOperation({
    summary: '인터뷰 종료',
    description: '인터뷰를 종료하고 결과를 반환합니다.',
  })
  @ApiBody({
    schema: {
      properties: {
        interviewId: { type: 'string', example: 'interview-uuid-1234' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '인터뷰 종료 및 결과 반환',
    type: DreamInterviewResponseDto,
  })
  async endInterview(
    @Body('interviewId') interviewId: string,
  ): Promise<DreamInterviewResponseDto> {
    const data = await this.dreamInterviewService.endInterview(interviewId);
    return { status: 'success', data };
  }

  @Get()
  @ApiOperation({
    summary: '인터뷰 세션 목록 조회',
    description: '사용자의 인터뷰 세션 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인터뷰 세션 목록 반환',
    type: DreamInterviewListResponseDto,
  })
  async getInterviewHistory(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<DreamInterviewListResponseDto> {
    return {
      status: 'success',
      data: await this.dreamInterviewService.getInterviewHistory(
        user.id,
        page,
        limit,
      ),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '인터뷰 세션 상세 조회',
    description: '인터뷰 세션의 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인터뷰 세션 상세 정보 반환',
    type: DreamInterviewResponseDto,
  })
  async getInterviewById(
    @CurrentUser() user: User,
    @Param('id') interviewId: string,
  ): Promise<DreamInterviewResponseDto> {
    return {
      status: 'success',
      data: await this.dreamInterviewService.getInterviewById(
        user.id,
        interviewId,
      ),
    };
  }
}
