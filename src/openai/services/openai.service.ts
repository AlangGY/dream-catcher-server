import { Injectable } from '@nestjs/common';
import { zodTextFormat } from 'openai/helpers/zod';
import { CreateDreamDto } from 'src/dreams/dto/request/create-dream.dto';
import { DreamAnalysisDto } from 'src/dreams/dto/response/dream-analysis.dto';
import { DreamDto } from 'src/dreams/dto/response/dream.dto';

import { CreateDreamDtoSchema } from 'src/openai/schemas/create-dream-dto-schema';
import { DreamAnalysisSchema } from 'src/openai/schemas/dream-anaysis-schema';
import { OpenAiClientService } from 'src/openai/services/openai-client.service';

export interface IOpenAiService {
  generateInterviewQuestion(
    messages: { speaker: string; message: string }[],
  ): Promise<{ output: string; responseId: string }>;

  chatForDreamInterview({
    userInput,
    previousResponseId,
    model,
    store,
  }: {
    userInput: string;
    previousResponseId?: string;
    model?: string;
    store?: boolean;
  }): Promise<{ output: string; responseId: string }>;

  generateDreamEntity(responseId: string): Promise<CreateDreamDto>;

  analyzeDream(dream: DreamDto): Promise<DreamAnalysisDto>;
}

@Injectable()
export class OpenAiService implements IOpenAiService {
  constructor(private readonly openAiClient: OpenAiClientService) {}

  async generateInterviewQuestion(): Promise<{
    output: string;
    responseId: string;
  }> {
    const res = await this.openAiClient.responses.create({
      model: 'gpt-3.5-turbo',
      instructions: `너는 사용자의 꿈 얘기를 들어주는 상담가의 역할을 해야해. 사용자의 꿈 얘기를 들어주고 그에 대해 질문을 하는 것이 목표야.
        사용자는 꿈에서 깬 직후이기 때문에 굉장히 몽롱하고 정신이 없는 상태이기 때문에, 최대한 친군하면서도 간결하게 얘기해줘.
        `,
      input: [
        {
          role: 'developer',
          content: '사용자에게 첫 대화를 시작해줘',
        },
      ],
      store: true,
    });
    return {
      output: res.output_text,
      responseId: res.id,
    };
  }

  async chatForDreamInterview({
    userInput,
    previousResponseId,
    model = 'gpt-4o-mini',
    store = true,
  }: {
    userInput: string;
    previousResponseId?: string;
    model?: string;
    store?: boolean;
  }): Promise<{ output: string; responseId: string }> {
    const res = await this.openAiClient.responses.create({
      model,
      instructions: `너는 사용자의 꿈 얘기를 들어주는 상담가의 역할을 해야해. 사용자의 꿈 얘기를 들어주고 그에 대해 질문을 하는 것이 목표야.
        사용자는 꿈에서 깬 직후이기 때문에 굉장히 몽롱하고 정신이 없는 상태이기 때문에, 최대한 친군하면서도 간결하게 얘기해줘.
        `,
      input: userInput,
      ...(previousResponseId
        ? { previous_response_id: previousResponseId }
        : {}),
      store,
    });
    return {
      output: res.output_text,
      responseId: res.id,
    };
  }

  async generateDreamEntity(responseId: string): Promise<CreateDreamDto> {
    const res = await this.openAiClient.responses.parse({
      model: 'gpt-4o-mini',
      input: [
        { role: 'developer', content: '전체 메시지를 참고해서 꿈을 기록해줘' },
      ],
      previous_response_id: responseId,
      text: {
        format: zodTextFormat(CreateDreamDtoSchema, 'create_dream_dto'),
      },
    });
    const outputParsed = res.output_parsed;
    const createDreamDto: CreateDreamDto = {
      date: new Date().toISOString(),
      color: outputParsed.color ?? '#000000',
      title: outputParsed.title ?? '알 수 없는 꿈',
      content: outputParsed.content ?? '알 수 없는 꿈',
      mood: outputParsed.mood ?? '알 수 없는 감정',
    };
    return createDreamDto;
  }

  async analyzeDream(dream: DreamDto): Promise<DreamAnalysisDto> {
    const res = await this.openAiClient.responses.parse({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: '꿈에 대한 분석을 해줘' },
        { role: 'user', content: JSON.stringify(dream) },
      ],
      text: {
        format: zodTextFormat(DreamAnalysisSchema, 'dream_analysis_dto'),
      },
    });
    const outputParsed = res.output_parsed;
    const dreamAnalysisDto: DreamAnalysisDto = {
      keywords: outputParsed.keywords ?? [],
      clarity: outputParsed.clarity ?? 0,
      vividness: outputParsed.vividness ?? 0,
      interpretation: outputParsed.interpretation ?? '',
    };
    return dreamAnalysisDto;
  }
}
