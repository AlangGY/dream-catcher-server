import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DreamRepository } from 'src/dreams/repository/dream.repository';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/request/create-dream.dto';
import { GetDreamsDto } from './dto/request/get-dreams.dto';
import { UpdateDreamDto } from './dto/request/update-dream.dto';
import {
  DreamListResponseDto,
  DreamResponseDto,
} from './dto/response/dream-response.dto';
import { DreamAnalysisDto, DreamDto } from './dto/response/dream.dto';

describe('DreamsService', () => {
  let service: DreamsService;
  let mockDreamRepository: any;

  const mockDream: DreamDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Dream',
    content: 'Test Content',
    date: '2024-03-20',
    mood: 'HAPPY',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    analysis: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateDreamDto: CreateDreamDto = {
    title: mockDream.title,
    content: mockDream.content,
    date: mockDream.date,
    mood: mockDream.mood,
    userId: mockDream.userId,
  };

  const mockUpdateDreamDto: UpdateDreamDto = {
    title: 'Updated Dream',
    content: 'Updated Content',
    date: '2024-03-21',
    mood: 'SAD',
    userId: mockDream.userId,
  };

  const mockDreamAnalysis: DreamAnalysisDto = {
    interpretation: 'Test interpretation',
    keywords: ['keyword1', 'keyword2'],
    emotionalTone: 'positive',
    suggestedActions: ['action1', 'action2'],
  };

  beforeEach(async () => {
    mockDreamRepository = {
      createDream: jest.fn().mockResolvedValue(mockDream),
      findDreamById: jest.fn().mockResolvedValue(mockDream),
      findDreams: jest.fn().mockResolvedValue([[mockDream], 1]),
      updateDream: jest.fn().mockResolvedValue(undefined),
      updateDreamAnalysis: jest.fn().mockResolvedValue(undefined),
      deleteDream: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DreamsService,
        {
          provide: DreamRepository,
          useValue: mockDreamRepository,
        },
      ],
    }).compile();

    service = module.get<DreamsService>(DreamsService);
  });

  describe('createDream', () => {
    it('should create a dream', async () => {
      const result = await service.createDream(mockCreateDreamDto);
      expect(result).toBeInstanceOf(DreamResponseDto);
      expect(result.data).toEqual(mockDream);
      expect(mockDreamRepository.createDream).toHaveBeenCalledWith(
        mockCreateDreamDto,
      );
    });
  });

  describe('getDreams', () => {
    it('should return dreams with pagination', async () => {
      const getDreamsDto: GetDreamsDto = {
        page: 1,
        limit: 10,
        userId: mockDream.userId,
      };

      const result = await service.getDreams(getDreamsDto);
      expect(result).toBeInstanceOf(DreamListResponseDto);
      expect(result.data.dreams).toEqual([mockDream]);
      expect(result.data.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
      });
      expect(mockDreamRepository.findDreams).toHaveBeenCalledWith(getDreamsDto);
    });
  });

  describe('getDream', () => {
    it('should return a dream by id', async () => {
      const result = await service.getDream(mockDream.id);
      expect(result).toBeInstanceOf(DreamResponseDto);
      expect(result.data).toEqual(mockDream);
      expect(mockDreamRepository.findDreamById).toHaveBeenCalledWith(
        mockDream.id,
      );
    });

    it('should throw NotFoundException when dream is not found', async () => {
      mockDreamRepository.findDreamById.mockResolvedValueOnce(null);
      await expect(service.getDream(mockDream.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDream', () => {
    it('should update a dream', async () => {
      const updatedDream = { ...mockDream, ...mockUpdateDreamDto };
      mockDreamRepository.findDreamById.mockResolvedValueOnce(updatedDream);

      const result = await service.updateDream(
        mockDream.id,
        mockUpdateDreamDto,
      );
      expect(result).toBeInstanceOf(DreamResponseDto);
      expect(result.data).toEqual(updatedDream);
      expect(mockDreamRepository.updateDream).toHaveBeenCalledWith(
        mockDream.id,
        mockUpdateDreamDto,
      );
    });

    it('should throw NotFoundException when dream is not found', async () => {
      mockDreamRepository.findDreamById.mockResolvedValueOnce(null);
      await expect(
        service.updateDream(mockDream.id, mockUpdateDreamDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDream', () => {
    it('should delete a dream', async () => {
      const result = await service.deleteDream(mockDream.id);
      expect(result).toBeInstanceOf(DreamResponseDto);
      expect(result.data).toEqual(mockDream);
      expect(mockDreamRepository.deleteDream).toHaveBeenCalledWith(mockDream);
    });

    it('should throw NotFoundException when dream is not found', async () => {
      mockDreamRepository.findDreamById.mockResolvedValueOnce(null);
      await expect(service.deleteDream(mockDream.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('analyzeDream', () => {
    it('should analyze a dream', async () => {
      const analyzedDream = { ...mockDream, analysis: mockDreamAnalysis };
      mockDreamRepository.findDreamById
        .mockResolvedValueOnce(mockDream)
        .mockResolvedValueOnce(analyzedDream);

      const result = await service.analyzeDream(mockDream.id);
      expect(result).toBeInstanceOf(DreamResponseDto);
      expect(result.data).toEqual(analyzedDream);
      expect(mockDreamRepository.updateDreamAnalysis).toHaveBeenCalledWith(
        mockDream.id,
        expect.any(Object),
      );
    });

    it('should throw NotFoundException when dream is not found', async () => {
      mockDreamRepository.findDreamById.mockResolvedValueOnce(null);
      await expect(service.analyzeDream(mockDream.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
