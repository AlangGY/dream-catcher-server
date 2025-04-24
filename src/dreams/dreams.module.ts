import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { DreamsController } from './dreams.controller';
import { DreamsService } from './dreams.service';
import { Dream } from './entities/dream.entity';
import { DreamRepository } from './repository/dream.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Dream]), CommonModule],
  controllers: [DreamsController],
  providers: [DreamsService, DreamRepository],
})
export class DreamsModule {}
