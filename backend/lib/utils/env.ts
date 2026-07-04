import 'dotenv/config';
import { z } from 'zod';

const DBEnvSchema = z.object({
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string().optional(),
});

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  FRONTEND_URL: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export default EnvSchema.parse(process.env);

export const dbEnv = DBEnvSchema.parse(process.env);
