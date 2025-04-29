import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiClientService extends OpenAI {
  constructor(private readonly configService: ConfigService) {
    super({
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    });
  }
}
