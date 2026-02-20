import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number(),

  RABBITMQ_URL: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
