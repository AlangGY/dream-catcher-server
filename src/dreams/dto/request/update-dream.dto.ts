import { ApiProperty } from '@nestjs/swagger';
import { CreateDreamDto } from './create-dream.dto';

export class UpdateDreamDto extends CreateDreamDto {
  @ApiProperty({ description: '꿈 분석 결과', required: false })
  analysis?: {
    interpretation: string;
    keywords: string[];
    emotionalTone: string;
    suggestedActions: string[];
  };
}
