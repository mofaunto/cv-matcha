import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './auth';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp_ms' }), // nullable
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
