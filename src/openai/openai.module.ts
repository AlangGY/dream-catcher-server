import { Module } from '@nestjs/common';
import { OpenAiClientService } from 'src/openai/services/openai-client.service';
import { OpenAiService } from 'src/openai/services/openai.service';

@Module({
  providers: [OpenAiClientService, OpenAiService],
  exports: [OpenAiClientService, OpenAiService],
})
export class OpenAiModule {}
