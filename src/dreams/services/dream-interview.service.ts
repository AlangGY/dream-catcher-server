import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from 'src/common/services/transaction.service';
import { DreamInterviewRepository } from 'src/dreams/repository/dream-interview.repository';
import { OpenAiService } from '../../openai/services/openai.service';
import { AnswerDreamInterviewDto } from '../dto/request/answer-dream-interview.dto';
import {
  DreamInterviewDataDto,
  DreamInterviewListDto,
} from '../dto/response/dream-interview-response.dto';
import { DreamInterviewSpeaker } from '../entities/dream-interview-question.entity';
import {
  DreamInterviewEntity,
  DreamInterviewStatus,
} from '../entities/dream-interview.entity';

@Injectable()
export class DreamInterviewService {
  constructor(
    private readonly interviewRepo: DreamInterviewRepository,
    private readonly openAiService: OpenAiService,
    private readonly transactionService: TransactionService,
  ) {}

  async startInterview(userId: string): Promise<DreamInterviewDataDto> {
    const interview = await this.transactionService.runInTransaction(
      async (manager) => {
        // 1. 인터뷰 세션 생성
        const interview = await this.interviewRepo.createInterview(
          userId,
          manager,
        );

        // 2. 첫 AI 메시지 생성 (Responses API 활용)
        const { output, responseId } =
          await this.openAiService.chatForDreamInterview({
            userInput: '꿈을 꿨어요.',
            model: 'gpt-4o-mini',
            store: true,
          });

        await Promise.all([
          this.interviewRepo.createMessage(
            interview.id,
            1,
            DreamInterviewSpeaker.AI,
            output,
            manager,
          ),
          this.interviewRepo.updateInterview(
            {
              id: interview.id,
              previousResponseId: responseId,
            },
            manager,
          ),
        ]);

        return interview;
        // 3. 전체 메시지 조회 및 반환
      },
    );
    return this._toDataDto(
      await this.interviewRepo.findInterviewById(interview.id),
    );
  }

  async answerInterview(
    dto: AnswerDreamInterviewDto,
  ): Promise<DreamInterviewDataDto> {
    const interview = await this.interviewRepo.findInterviewById(
      dto.interviewId,
    );

    if (!interview)
      throw new NotFoundException('인터뷰 세션을 찾을 수 없습니다.');

    if (interview.status !== DreamInterviewStatus.IN_PROGRESS)
      throw new Error('진행 중인 인터뷰가 아닙니다.');

    await this.transactionService.runInTransaction(async (manager) => {
      // 1. 사용자 메시지 추가
      await this.interviewRepo.createMessage(
        interview.id,
        interview.messages.length + 1,
        dto.speaker,
        dto.message,
        manager,
      );

      // 2. AI 메시지(질문) 생성 (Responses API 연동)
      const { output, responseId } =
        await this.openAiService.chatForDreamInterview({
          userInput: dto.message,
          previousResponseId: interview.previousResponseId,
          model: 'gpt-4o-mini',
          store: true,
        });

      await Promise.all([
        this.interviewRepo.createMessage(
          interview.id,
          interview.messages.length + 2,
          DreamInterviewSpeaker.AI,
          output,
          manager,
        ),
        this.interviewRepo.updateInterview(
          {
            id: interview.id,
            previousResponseId: responseId,
          },
          manager,
        ),
      ]);
    });

    // 3. 전체 메시지 조회 및 반환
    return this._toDataDto(
      await this.interviewRepo.findInterviewById(interview.id),
    );
  }

  async endInterview(interviewId: string): Promise<DreamInterviewDataDto> {
    // TODO: 분석 비동기 처리
    await this.interviewRepo.updateInterview({
      id: interviewId,
      status: DreamInterviewStatus.COMPLETED,
      endedAt: new Date(),
      result: '이 꿈은 불안감을 의미할 수 있습니다.',
    });

    return this._toDataDto(
      await this.interviewRepo.findInterviewById(interviewId),
    );
  }

  private _toDataDto(interview: DreamInterviewEntity): DreamInterviewDataDto {
    return {
      id: interview.id,
      userId: interview.userId,
      status: interview.status,
      startedAt: interview.startedAt,
      endedAt: interview.endedAt,
      result: interview.result,
      messages: (interview.messages || []).map((msg) => ({
        order: msg.order,
        speaker: msg.speaker,
        message: msg.message,
        sentAt: msg.sentAt,
      })),
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    };
  }

  async getInterviewHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<DreamInterviewListDto> {
    const [interviews, total] = await this.interviewRepo.findInterviewsAndCount(
      userId,
      page,
      limit,
    );

    return {
      items: interviews.map((interview) => ({
        id: interview.id,
        status: interview.status,
        lastMessage: interview.messages[interview.messages.length - 1],
        startedAt: interview.startedAt,
        endedAt: interview.endedAt,
        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }

  async getInterviewById(
    userId: string,
    interviewId: string,
  ): Promise<DreamInterviewDataDto> {
    const interview = await this.interviewRepo.findInterviewById(interviewId);

    if (interview.userId !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    if (!interview) {
      throw new NotFoundException('인터뷰 세션을 찾을 수 없습니다.');
    }

    return this._toDataDto(interview);
  }
}
