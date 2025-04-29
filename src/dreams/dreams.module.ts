import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamInterviewController } from 'src/dreams/controllers/dream-interview.controller';
import { DreamInterviewMessageEntity } from 'src/dreams/entities/dream-interview-question.entity';
import { DreamInterviewEntity } from 'src/dreams/entities/dream-interview.entity';
import { DreamInterviewRepository } from 'src/dreams/repository/dream-interview.repository';
import { DreamInterviewService } from 'src/dreams/services/dream-interview.service';
import { DreamsService } from 'src/dreams/services/dreams.service';
import { OpenAiModule } from 'src/openai/openai.module';
import { CommonModule } from '../common/common.module';
import { DreamsController } from './controllers/dreams.controller';
import { Dream } from './entities/dream.entity';
import { DreamRepository } from './repository/dream.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dream,
      DreamInterviewEntity,
      DreamInterviewMessageEntity,
    ]),
    CommonModule,
    OpenAiModule,
  ],
  controllers: [DreamsController, DreamInterviewController],
  providers: [
    DreamsService,
    DreamRepository,
    DreamInterviewRepository,
    DreamInterviewService,
  ],
})
export class DreamsModule {}
