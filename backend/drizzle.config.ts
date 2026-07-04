import { defineConfig } from 'drizzle-kit';
import { dbEnv } from './lib/utils/env';

export default defineConfig({
  out: './lib/db/migrations',
  schema: './lib/db/schema/index.ts',
  casing: 'snake_case',
  dialect: 'turso',
  dbCredentials: {
    url: dbEnv.TURSO_DATABASE_URL,
    authToken: dbEnv.TURSO_AUTH_TOKEN,
  },
});
