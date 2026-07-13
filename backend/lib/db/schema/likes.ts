import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { cvs } from './cvs';
import { user } from './auth';

export const likes = sqliteTable(
  'likes',
  {
    cvId: integer('cv_id')
      .notNull()
      .references(() => cvs.id, { onDelete: 'cascade' }),
    recruiterId: text('recruiter_id')
      .notNull()
      .references(() => user.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cvId, table.recruiterId] }),
  }),
);
