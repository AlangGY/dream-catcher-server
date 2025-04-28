import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DreamAnalysisDto } from '../dto/response/dream.dto';

@Entity()
export class Dream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  mood: string;

  @Column()
  color: string;

  @Column('json', { nullable: true })
  analysis?: DreamAnalysisDto;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
