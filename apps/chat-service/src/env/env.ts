import { z } from 'zod';

export const EnvSchema = z.object({
  RABBITMQ_URL: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  WS_PORT: z.coerce.number(),
});

export type Env = z.infer<typeof EnvSchema>;
