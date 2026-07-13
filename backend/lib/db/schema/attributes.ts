import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';

export const attributes = sqliteTable('attributes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  name: text('name').notNull().unique(),
  type: text('type', {
    enum: [
      'string',
      'text',
      'image',
      'numeric',
      'date',
      'boolean',
      'one_of_many',
    ],
  }).notNull(),
  options: text('options'),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' })
    .notNull()
    .default(false),
  maxLength: integer('max_length'),
  regex: text('regex'),
  min: real('min'),
  max: real('max'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
