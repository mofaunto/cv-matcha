import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth';
import { attributes } from './attributes';

export const userProfileAttributes = sqliteTable(
  'user_profile_attributes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    attributeId: integer('attribute_id')
      .notNull()
      .references(() => attributes.id),
    version: integer('version').notNull().default(1),
    valueString: text('value_string'),
    valueText: text('value_text'),
    valueImageUrl: text('value_image_url'), // cloudinary url
    valueNumeric: real('value_numeric'),
    valueDate: integer('value_date', { mode: 'timestamp_ms' }),
    valueBoolean: integer('value_boolean', { mode: 'boolean' }),
    valueOption: text('value_option'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    uniqueUserAttribute: uniqueIndex('uix_user_attribute').on(
      table.userId,
      table.attributeId,
    ),
  }),
);
