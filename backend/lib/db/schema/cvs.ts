import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth';
import { positions } from './positions';

export const cvs = sqliteTable(
  'cvs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    candidateId: text('candidate_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    positionId: integer('position_id')
      .notNull()
      .references(() => positions.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    published: integer('published', { mode: 'boolean' })
      .notNull()
      .default(false),
  },
  (table) => ({
    uniqueCandidatePosition: uniqueIndex('uix_candidate_position').on(
      table.candidateId,
      table.positionId,
    ),
  }),
);
