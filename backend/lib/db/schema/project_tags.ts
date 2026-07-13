import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { projects } from './projects';

export const projectTags = sqliteTable(
  'project_tags',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tag] }),
  }),
);
