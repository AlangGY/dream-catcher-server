import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAiClientService } from 'src/openai/services/openai-client.service';

export interface IOpenAiService {
  generateInterviewQuestion(
    messages: { speaker: string; message: string }[],
  ): Promise<string>;

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
}

@Injectable()
export class OpenAiService implements IOpenAiService {
  constructor(private readonly openAiClient: OpenAiClientService) {}

  async generateInterviewQuestion(
    messages: { speaker: string; message: string }[],
  ): Promise<string> {
    const prompt = this.buildPrompt(messages);
    const res = await this.openAiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '너는 사용자의 꿈 이야기를 들어주는 상담가야. 사용자의 꿈 이야기를 들어주고 그에 대해 질문을 하는 것이 목표야.',
        },
        ...prompt,
      ],
      max_tokens: 100,
    });
    return (
      res.choices[0].message?.content?.trim() ?? '꿈에 대해 더 이야기해 주세요.'
    );
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
      instructions:
        '너는 사용자의 꿈 얘기를 들어주는 상담가의 역할을 해야해. 사용자의 꿈 얘기를 들어주고 그에 대해 질문을 하는 것이 목표야.',
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

  private buildPrompt(
    messages: { speaker: string; message: string }[],
  ): ChatCompletionMessageParam[] {
    return messages.map((m) => ({
      role: m.speaker === 'USER' ? 'user' : 'assistant',
      content: m.message,
    }));
  }
}
