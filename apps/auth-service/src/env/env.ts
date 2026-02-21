import { z } from 'zod';

export const EnvSchema = z.object({
  RABBITMQ_URL: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_EXP: z.string(),
  JWT_REFRESH_EXP: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASS: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
