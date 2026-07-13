import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { positions } from './positions';
import { user } from './auth';

export const discussionPosts = sqliteTable('discussion_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  positionId: integer('position_id')
    .notNull()
    .references(() => positions.id, { onDelete: 'cascade' }),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});
