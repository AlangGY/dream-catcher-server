import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DreamInterviewEntity } from './dream-interview.entity';

export enum DreamInterviewSpeaker {
  USER = 'USER',
  AI = 'AI',
}

@Entity('dream_interview_message')
export class DreamInterviewMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DreamInterviewEntity, (interview) => interview.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'interviewId' })
  interview: DreamInterviewEntity;

  @Column()
  interviewId: string;

  @Column()
  order: number;

  @Column({ type: 'enum', enum: DreamInterviewSpeaker })
  speaker: DreamInterviewSpeaker;

  @Column('text')
  message: string;

  @CreateDateColumn()
  sentAt: Date;
}
