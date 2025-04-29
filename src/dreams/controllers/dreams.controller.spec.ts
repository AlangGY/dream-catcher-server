import { Test, TestingModule } from '@nestjs/testing';
import { DreamsService } from 'src/dreams/services/dreams.service';
import { User } from '../../auth/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDreamDto } from '../dto/request/create-dream.dto';
import { GetDreamsDto } from '../dto/request/get-dreams.dto';
import { UpdateDreamDto } from '../dto/request/update-dream.dto';
import { DreamResponseDto } from '../dto/response/dream-response.dto';
import { DreamsController } from './dreams.controller';

describe('DreamsController', () => {
  let controller: DreamsController;
  let service: DreamsService;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    nickname: '테스트 사용자',
    password: 'hashedPassword',
    oauthCredentials: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    dreams: [],
  };

  const mockDreamResponse: DreamResponseDto = {
    status: 'success',
    data: {
      id: 'test-dream-id',
      title: '테스트 꿈 제목',
      content: '테스트 꿈 내용',
      date: '2024-03-20',
      mood: 'HAPPY',
      color: '#000000',
      userId: mockUser.id,
      analysis: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockDreamsService = {
    createDream: jest.fn().mockResolvedValue(mockDreamResponse),
    getDreams: jest.fn().mockResolvedValue({
      dreams: [mockDreamResponse],
      total: 1,
      page: 1,
      limit: 10,
    }),
    getDream: jest.fn().mockResolvedValue(mockDreamResponse),
    updateDream: jest.fn().mockResolvedValue(mockDreamResponse),
    deleteDream: jest.fn().mockResolvedValue(mockDreamResponse),
    analyzeDream: jest.fn().mockResolvedValue({
      ...mockDreamResponse,
      analysis: '꿈 분석 내용입니다',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DreamsController],
    })
      .useMocker((token) => {
        if (token === DreamsService) {
          return mockDreamsService;
        }
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DreamsController>(DreamsController);
    service = module.get<DreamsService>(DreamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDream', () => {
    it('사용자 ID를 포함하여 꿈 기록을 생성해야 합니다', async () => {
      const createDreamDto: CreateDreamDto = {
        title: '테스트 꿈 제목',
        content: '테스트 꿈 내용',
        date: '2024-03-20',
        mood: 'HAPPY',
        color: '#000000',
      };

      const result = await controller.createDream(createDreamDto, mockUser);

      expect(service.createDream).toHaveBeenCalledWith({
        ...createDreamDto,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockDreamResponse);
    });
  });

  describe('getDreams', () => {
    it('사용자 ID를 포함하여 꿈 기록 목록을 조회해야 합니다', async () => {
      const getDreamsDto: GetDreamsDto = {
        page: 1,
        limit: 10,
      };

      const result = await controller.getDreams(mockUser, getDreamsDto);

      expect(service.getDreams).toHaveBeenCalledWith({
        ...getDreamsDto,
        userId: mockUser.id,
      });
      expect(result).toEqual({
        dreams: [mockDreamResponse],
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('getDream', () => {
    it('특정 꿈 기록을 상세 조회해야 합니다', async () => {
      const dreamId = 'test-dream-id';

      const result = await controller.getDream(dreamId);

      expect(service.getDream).toHaveBeenCalledWith(dreamId);
      expect(result).toEqual(mockDreamResponse);
    });
  });

  describe('updateDream', () => {
    it('사용자 ID를 포함하여 꿈 기록을 수정해야 합니다', async () => {
      const dreamId = 'test-dream-id';
      const updateDreamDto: UpdateDreamDto = {
        title: '수정된 꿈 제목',
        content: '수정된 꿈 내용',
        date: '2024-03-20',
        mood: 'HAPPY',
        color: '#000000',
      };

      const result = await controller.updateDream(
        dreamId,
        updateDreamDto,
        mockUser,
      );

      expect(service.updateDream).toHaveBeenCalledWith(dreamId, {
        ...updateDreamDto,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockDreamResponse);
    });
  });

  describe('deleteDream', () => {
    it('특정 꿈 기록을 삭제해야 합니다', async () => {
      const dreamId = 'test-dream-id';

      const result = await controller.deleteDream(dreamId);

      expect(service.deleteDream).toHaveBeenCalledWith(dreamId);
      expect(result).toEqual(mockDreamResponse);
    });
  });

  describe('analyzeDream', () => {
    it('특정 꿈을 분석해야 합니다', async () => {
      const dreamId = 'test-dream-id';

      const result = await controller.analyzeDream(dreamId);

      expect(service.analyzeDream).toHaveBeenCalledWith(dreamId);
      expect(result).toEqual({
        ...mockDreamResponse,
        analysis: '꿈 분석 내용입니다',
      });
    });
  });
});
