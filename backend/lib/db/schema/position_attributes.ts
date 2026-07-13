import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { positions } from './positions';
import { attributes } from './attributes';

export const positionAttributes = sqliteTable(
  'position_attributes',
  {
    positionId: integer('position_id')
      .notNull()
      .references(() => positions.id, { onDelete: 'cascade' }),
    attributeId: integer('attribute_id')
      .notNull()
      .references(() => attributes.id),
    order: integer('order').notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.positionId, table.attributeId] }),
  }),
);
