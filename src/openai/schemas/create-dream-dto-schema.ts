import { z } from 'zod';

export const CreateDreamDtoSchema = z
  .object({
    title: z.string().describe('꿈의 제목'),
    content: z.string().describe('꿈 일기의 내용. 최소 100자, 최대 1000자'),
    mood: z.string().describe('감정 상태'),
    color: z.string().describe('꿈의 색상. hex 형식. e.g. #000000'),
  })
  .strict();
