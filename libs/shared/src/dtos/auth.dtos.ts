import { z } from 'zod';
import { CreateChatSchema } from '@app/shared/dtos/chat.dto';
import { createZodDto } from 'nestjs-zod';

export const RegisterSchema = z.object({
  email: z.string().includes('@'),
  username: z.string(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().includes('@'),
  password: z.string().min(6),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().includes('@'),
  username: z.string(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().includes('@'),
    username: z.string(),
  }),
});

export class RegisterDto extends createZodDto(CreateChatSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
