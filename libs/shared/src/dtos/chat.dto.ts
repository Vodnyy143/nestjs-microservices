import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateChatSchema = z.object({
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

export const AddMemberSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  addedBy: z.string(),
});

export const LeaveChatSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
});

export const GetChatsSchema = z.object({
  chatId: z.string(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const GetMessagesSchema = z.object({
  chatId: z.string(),
  limit: z.coerce.number().optional().default(50),
  before: z.string().optional(),
});

export class CreateChatDto extends createZodDto(CreateChatSchema) {}
export class SendMessageDto extends createZodDto(SendMessageSchema) {}
export class AddMemberDto extends createZodDto(AddMemberSchema) {}
export class LeaveChatDto extends createZodDto(LeaveChatSchema) {}

export class GetChatsDto extends createZodDto(GetChatsSchema) {}
export class GetMessagesDto extends createZodDto(GetMessagesSchema) {}
