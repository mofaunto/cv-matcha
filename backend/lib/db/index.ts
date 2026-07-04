import { drizzle } from 'drizzle-orm/libsql';
import { dbEnv } from '../utils/env';
import * as schema from './schema/index';

const db = drizzle({
  connection: {
    url: dbEnv.TURSO_DATABASE_URL,
    authToken: dbEnv.TURSO_AUTH_TOKEN,
  },
  casing: 'snake_case',
  schema,
});

export default db;
