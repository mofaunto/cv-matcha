import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const positions = sqliteTable('positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  accessRules: text('access_rules').notNull().default('[]'), // JSON array
  maxProjects: integer('max_projects').notNull().default(3),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
