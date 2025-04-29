import { Injectable } from '@nestjs/common';
import {
  DreamInterviewMessageEntity,
  DreamInterviewSpeaker,
} from 'src/dreams/entities/dream-interview-question.entity';
import { DreamInterviewEntity } from 'src/dreams/entities/dream-interview.entity';
import { DataSource, EntityManager, UpdateResult } from 'typeorm';

export interface IDreamInterviewRepository {
  createInterview(
    userId: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewEntity>;

  updateInterview(
    interview: Partial<DreamInterviewEntity> & Pick<DreamInterviewEntity, 'id'>,
    entityManager?: EntityManager,
  ): Promise<UpdateResult>;

  findInterviewById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewEntity>;

  findInterviewsAndCount(
    userId: string,
    page: number,
    limit: number,
    entityManager?: EntityManager,
  ): Promise<[DreamInterviewEntity[], number]>;

  createMessage(
    interviewId: string,
    order: number,
    speaker: DreamInterviewSpeaker,
    value: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewMessageEntity>;
}

@Injectable()
export class DreamInterviewRepository implements IDreamInterviewRepository {
  constructor(private dataSource: DataSource) {}

  private getManager(entityManager?: EntityManager): EntityManager {
    return entityManager || this.dataSource.manager;
  }

  async createInterview(
    userId: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewEntity> {
    const manager = this.getManager(entityManager);
    const interview = manager.create(DreamInterviewEntity, { userId });
    const savedInterview = await manager.save(DreamInterviewEntity, interview);
    return savedInterview;
  }

  async updateInterview(
    interview: Partial<DreamInterviewEntity> & Pick<DreamInterviewEntity, 'id'>,
    entityManager?: EntityManager,
  ): Promise<UpdateResult> {
    const manager = this.getManager(entityManager);
    const updatedInterview = await manager.update(
      DreamInterviewEntity,
      interview.id,
      interview,
    );
    return updatedInterview;
  }

  async findInterviewById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewEntity> {
    const manager = this.getManager(entityManager);
    const interview = await manager.findOne(DreamInterviewEntity, {
      where: { id },
      relations: ['messages'],
    });
    return interview;
  }

  async findInterviewsAndCount(
    userId: string,
    page: number,
    limit: number,
    entityManager?: EntityManager,
  ): Promise<[DreamInterviewEntity[], number]> {
    const manager = this.getManager(entityManager);
    const [interviews, total] = await manager.findAndCount(
      DreamInterviewEntity,
      {
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );
    return [interviews, total];
  }

  async createMessage(
    interviewId: string,
    order: number,
    speaker: DreamInterviewSpeaker,
    value: string,
    entityManager?: EntityManager,
  ): Promise<DreamInterviewMessageEntity> {
    const manager = this.getManager(entityManager);
    const message = manager.create(DreamInterviewMessageEntity, {
      interviewId,
      order,
      speaker,
      message: value,
    });
    const savedMessage = await manager.save(
      DreamInterviewMessageEntity,
      message,
    );
    return savedMessage;
  }
}
