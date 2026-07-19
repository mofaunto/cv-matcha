import { Injectable } from '@nestjs/common';
import db from '../../lib/db';
import { attributes } from '../../lib/db/schema';
import { eq, and, like, sql, type SQL } from 'drizzle-orm';

type AttributeType =
  'string' | 'text' | 'image' | 'numeric' | 'date' | 'boolean' | 'one_of_many';

@Injectable()
export class AttributesService {
  async findAll(filters: { categoryId?: number; search?: string }) {
    const conditions: SQL[] = []; // ← typed as SQL array

    if (filters.categoryId) {
      conditions.push(eq(attributes.categoryId, filters.categoryId));
    }
    if (filters.search) {
      conditions.push(like(attributes.name, `${filters.search}%`));
    }

    return conditions.length
      ? db
          .select()
          .from(attributes)
          .where(and(...conditions))
      : db.select().from(attributes);
  }

  async findRecent(_userId: string, limit = 10) {
    return db
      .select()
      .from(attributes)
      .orderBy(sql`${attributes.updatedAt} desc`)
      .limit(limit);
  }

  async create(data: {
    categoryId: number;
    name: string;
    type: AttributeType;
    options?: any;
  }) {
    const [attr] = await db
      .insert(attributes)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        type: data.type,
        options: data.options,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return attr;
  }

  async update(
    id: number,
    data: Partial<{ name: string; type: AttributeType; options: any }>,
  ) {
    const [attr] = await db
      .update(attributes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(attributes.id, id))
      .returning();
    return attr;
  }

  async delete(id: number) {
    await db.delete(attributes).where(eq(attributes.id, id));
  }
}
