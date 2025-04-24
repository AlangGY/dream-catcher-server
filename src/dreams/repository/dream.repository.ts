import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateDreamDto } from '../dto/request/create-dream.dto';
import { GetDreamsDto } from '../dto/request/get-dreams.dto';
import { UpdateDreamDto } from '../dto/request/update-dream.dto';
import { DreamAnalysisDto } from '../dto/response/dream-analysis.dto';
import { DreamDto } from '../dto/response/dream.dto';
import { Dream } from '../entities/dream.entity';

export interface IDreamRepository {
  createDream(
    createDreamDto: CreateDreamDto,
    entityManager?: EntityManager,
  ): Promise<DreamDto>;
  findDreamById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<DreamDto | null>;
  findDreams(
    getDreamsDto: GetDreamsDto,
    entityManager?: EntityManager,
  ): Promise<[DreamDto[], number]>;
  updateDream(
    id: string,
    updateDreamDto: UpdateDreamDto,
    entityManager?: EntityManager,
  ): Promise<void>;
  updateDreamAnalysis(
    id: string,
    analysis: DreamAnalysisDto,
    entityManager?: EntityManager,
  ): Promise<void>;
  deleteDream(dream: DreamDto, entityManager?: EntityManager): Promise<void>;
}

@Injectable()
export class DreamRepository implements IDreamRepository {
  constructor(private dataSource: DataSource) {}

  private getManager(entityManager?: EntityManager): EntityManager {
    return entityManager || this.dataSource.manager;
  }

  async createDream(
    createDreamDto: CreateDreamDto,
    entityManager?: EntityManager,
  ): Promise<DreamDto> {
    const manager = this.getManager(entityManager);
    const dream = manager.create(Dream, createDreamDto);
    const savedDream = await manager.save(Dream, dream);
    return this.toDreamDto(savedDream);
  }

  async findDreamById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<DreamDto | null> {
    const manager = this.getManager(entityManager);
    const dream = await manager.findOne(Dream, { where: { id } });
    return dream ? this.toDreamDto(dream) : null;
  }

  async findDreams(
    getDreamsDto: GetDreamsDto,
    entityManager?: EntityManager,
  ): Promise<[DreamDto[], number]> {
    const manager = this.getManager(entityManager);
    const { page = 1, limit = 10, userId } = getDreamsDto;
    const skip = (page - 1) * limit;

    const [dreams, total] = await manager.findAndCount(Dream, {
      where: { userId },
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return [dreams.map(this.toDreamDto), total];
  }

  async updateDream(
    id: string,
    updateDreamDto: UpdateDreamDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(entityManager);
    await manager.update(Dream, id, updateDreamDto);
  }

  async updateDreamAnalysis(
    id: string,
    analysis: DreamAnalysisDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(entityManager);
    await manager.update(Dream, id, { analysis });
  }

  async deleteDream(
    dream: DreamDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(entityManager);
    const dreamEntity = await manager.findOne(Dream, {
      where: { id: dream.id },
    });
    if (dreamEntity) {
      await manager.remove(Dream, dreamEntity);
    }
  }

  private toDreamDto(dream: Dream): DreamDto {
    const { ...dreamDto } = dream;
    return dreamDto;
  }
}
