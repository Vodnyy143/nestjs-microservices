import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number(),

  RABBITMQ_URL: z.string(),

  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
