import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/response/common-response.dto';
import { GetDreamsDto } from 'src/dreams/dto/request/get-dreams.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/request/create-dream.dto';
import { UpdateDreamDto } from './dto/request/update-dream.dto';
import {
  DreamListResponseDto,
  DreamResponseDto,
} from './dto/response/dream-response.dto';
import {
  CreateDreamWithUserId,
  GetDreamsWithUserId,
  UpdateDreamWithUserId,
} from './interfaces/interfaces';

@ApiTags('꿈')
@ApiBearerAuth('access-token')
@Controller('dreams')
@UseGuards(JwtAuthGuard)
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @ApiOperation({ summary: '꿈 기록 생성' })
  @ApiCreatedResponse({ type: DreamResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  async createDream(
    @Body() createDreamDto: CreateDreamDto,
    @CurrentUser() user: User,
  ): Promise<DreamResponseDto> {
    const dreamWithUserId: CreateDreamWithUserId = {
      ...createDreamDto,
      userId: user.id,
    };
    return this.dreamsService.createDream(dreamWithUserId);
  }

  @ApiOperation({ summary: '꿈 기록 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '꿈 기록 목록 조회 성공',
    type: DreamListResponseDto,
  })
  @Get()
  async getDreams(
    @CurrentUser() user: User,
    @Query() getDreamsDto: GetDreamsDto,
  ): Promise<DreamListResponseDto> {
    const dreamsWithUserId: GetDreamsWithUserId = {
      ...getDreamsDto,
      userId: user.id,
    };
    return this.dreamsService.getDreams(dreamsWithUserId);
  }

  @ApiOperation({ summary: '꿈 기록 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '꿈 기록 상세 조회 성공',
    type: DreamResponseDto,
  })
  @Get(':dreamId')
  async getDream(@Param('dreamId') dreamId: string): Promise<DreamResponseDto> {
    return this.dreamsService.getDream(dreamId);
  }

  @ApiOperation({ summary: '꿈 기록 수정' })
  @ApiResponse({
    status: 200,
    description: '꿈 기록 수정 성공',
    type: DreamResponseDto,
  })
  @Put(':dreamId')
  async updateDream(
    @Param('dreamId') dreamId: string,
    @Body() updateDreamDto: UpdateDreamDto,
    @CurrentUser() user: User,
  ): Promise<DreamResponseDto> {
    const dreamWithUserId: UpdateDreamWithUserId = {
      ...updateDreamDto,
      userId: user.id,
    };
    return this.dreamsService.updateDream(dreamId, dreamWithUserId);
  }

  @ApiOperation({ summary: '꿈 기록 삭제' })
  @ApiResponse({
    status: 200,
    description: '꿈 기록 삭제 성공',
    type: DreamResponseDto,
  })
  @Delete(':dreamId')
  async deleteDream(@Param('dreamId') dreamId: string) {
    return this.dreamsService.deleteDream(dreamId);
  }

  @ApiOperation({ summary: '꿈 분석' })
  @ApiResponse({
    status: 200,
    description: '꿈 분석 성공',
    type: DreamResponseDto,
  })
  @Post(':dreamId/analyze')
  async analyzeDream(
    @Param('dreamId') dreamId: string,
  ): Promise<DreamResponseDto> {
    return this.dreamsService.analyzeDream(dreamId);
  }
}
