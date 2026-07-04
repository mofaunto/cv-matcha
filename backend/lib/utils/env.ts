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

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Missing env vars:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export default parsed.data;

export const dbEnv = DBEnvSchema.parse(process.env);
