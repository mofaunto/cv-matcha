import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { positions } from './positions';

export const positionProjectTags = sqliteTable(
  'position_project_tags',
  {
    positionId: integer('position_id')
      .notNull()
      .references(() => positions.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.positionId, table.tag] }),
  }),
);
