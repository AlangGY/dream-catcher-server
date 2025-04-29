import { z } from 'zod';

export const DreamAnalysisSchema = z.object({
  keywords: z.array(z.string()).describe('키워드 목록'),
  clarity: z.number().describe('꿈의 선명도. 5점 만점'),
  vividness: z.number().describe('꿈의 명료함. 5점 만점'),
  interpretation: z.string().describe('꿈 해석'),
});
