import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateDreamWithUserId,
  GetDreamsWithUserId,
  UpdateDreamWithUserId,
} from 'src/dreams/interfaces/interfaces';
import { TransactionService } from '../common/services/transaction.service';
import {
  DreamListResponseData,
  DreamListResponseDto,
  DreamResponseDto,
} from './dto/response/dream-response.dto';
import { DreamRepository } from './repository/dream.repository';

export interface IDreamsService {
  createDream(
    createDreamWithUserId: CreateDreamWithUserId,
  ): Promise<DreamResponseDto>;
  getDreams(getDreamsDto: GetDreamsWithUserId): Promise<DreamListResponseDto>;
  getDream(id: string): Promise<DreamResponseDto>;
  updateDream(
    id: string,
    updateDreamDto: UpdateDreamWithUserId,
  ): Promise<DreamResponseDto>;
  deleteDream(id: string): Promise<DreamResponseDto>;
  analyzeDream(id: string): Promise<DreamResponseDto>;
}

@Injectable()
export class DreamsService implements IDreamsService {
  constructor(
    private readonly dreamRepository: DreamRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async createDream(
    createDreamDto: CreateDreamWithUserId,
  ): Promise<DreamResponseDto> {
    const dream = await this.transactionService.runInTransaction((manager) =>
      this.dreamRepository.createDream(createDreamDto, manager),
    );
    return DreamResponseDto.success(dream);
  }

  async getDreams(
    getDreamsDto: GetDreamsWithUserId,
  ): Promise<DreamListResponseDto> {
    const [dreams, total] = await this.dreamRepository.findDreams(getDreamsDto);
    const totalPages = Math.ceil(total / getDreamsDto.limit);

    const responseData: DreamListResponseData = {
      dreams,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: getDreamsDto.page,
      },
    };

    return DreamListResponseDto.success(responseData);
  }

  async getDream(id: string): Promise<DreamResponseDto> {
    const dream = await this.dreamRepository.findDreamById(id);
    if (!dream) {
      throw new NotFoundException('해당하는 꿈 기록을 찾을 수 없습니다.');
    }

    return DreamResponseDto.success(dream);
  }

  async updateDream(
    id: string,
    updateDreamDto: UpdateDreamWithUserId,
  ): Promise<DreamResponseDto> {
    return this.transactionService.runInTransaction(async (manager) => {
      const dream = await this.dreamRepository.findDreamById(id, manager);
      if (!dream) {
        throw new NotFoundException('해당하는 꿈 기록을 찾을 수 없습니다.');
      }

      await this.dreamRepository.updateDream(id, updateDreamDto, manager);
      const updatedDream = await this.dreamRepository.findDreamById(
        id,
        manager,
      );

      return DreamResponseDto.success(updatedDream);
    });
  }

  async deleteDream(id: string): Promise<DreamResponseDto> {
    return this.transactionService.runInTransaction(async (manager) => {
      const dream = await this.dreamRepository.findDreamById(id, manager);
      if (!dream) {
        throw new NotFoundException('해당하는 꿈 기록을 찾을 수 없습니다.');
      }

      await this.dreamRepository.deleteDream(dream, manager);

      return DreamResponseDto.success({
        message: '꿈 기록이 성공적으로 삭제되었습니다.',
      } as any);
    });
  }

  async analyzeDream(id: string): Promise<DreamResponseDto> {
    return this.transactionService.runInTransaction(async (manager) => {
      const dream = await this.dreamRepository.findDreamById(id, manager);
      if (!dream) {
        throw new NotFoundException('해당하는 꿈 기록을 찾을 수 없습니다.');
      }

      const analysis = {
        interpretation: '샘플 해석',
        keywords: ['샘플'],
        emotionalTone: '긍정적',
        suggestedActions: ['행복에 대해 생각해보기'],
        summary: '꿈 요약',
        sentiment: '긍정적',
      };

      await this.dreamRepository.updateDreamAnalysis(id, analysis, manager);
      const analyzedDream = await this.dreamRepository.findDreamById(
        id,
        manager,
      );

      return DreamResponseDto.success(analyzedDream);
    });
  }
}
