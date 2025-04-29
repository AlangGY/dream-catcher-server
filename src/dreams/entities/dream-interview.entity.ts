import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DreamInterviewMessageEntity } from './dream-interview-question.entity';

export enum DreamInterviewStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CONVERTING = 'CONVERTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('dream_interview')
export class DreamInterviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: DreamInterviewStatus,
    default: DreamInterviewStatus.IN_PROGRESS,
  })
  status: DreamInterviewStatus;

  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn({ nullable: true })
  endedAt?: Date;

  @OneToMany(
    () => DreamInterviewMessageEntity,
    (message) => message.interview,
    { cascade: true },
  )
  messages: DreamInterviewMessageEntity[];

  @Column({ nullable: true, type: 'text' })
  result?: string;

  @Column({ nullable: true })
  previousResponseId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
