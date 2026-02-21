import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// export const UserSchema = z.object({
//   id: z.string(),
//   email: z.string(),
//   username: z.string(),
//   avatar: z.string().nullable().optional(),
//   bio: z.string().max(500).nullable().optional(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// });

export const CreateUserSchema = z.object({
  email: z.string().includes('@'),
  username: z.string(),
  hashedPassword: z.string().min(6),
});

export const UpdateUserSchema = z.object({
  username: z.string(),
  avatar: z.string().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export const GetUserByEmailSchema = z.object({
  email: z.string(),
  includePassword: z.boolean().optional().default(false),
});

export const SearchUsersSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export class GetUserByEmailDto extends createZodDto(GetUserByEmailSchema) {}
export class SearchUsersDto extends createZodDto(SearchUsersSchema) {}
