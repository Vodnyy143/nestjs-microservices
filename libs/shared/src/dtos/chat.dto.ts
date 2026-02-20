import { z } from 'zod';

export const CreteChatSchema = z.object({
  name: z.string(),
  memberIds: z.array(z.string()),
  description: z.string().optional(),
  isGroup: z.boolean().optional().default(false),
});

export const SendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string(),
  senderId: z.string(),
});
