import { Injectable, NotFoundException } from '@nestjs/common';
import db from '../../lib/db';
import {
  positions,
  positionAttributes,
  positionProjectTags,
} from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PositionsService {
  async findAll() {
    const allPositions = await db.select().from(positions);

    const result = await Promise.all(
      allPositions.map(async (position) => {
        const attrs = await db
          .select({ attributeId: positionAttributes.attributeId })
          .from(positionAttributes)
          .where(eq(positionAttributes.positionId, position.id));

        const tags = await db
          .select({ tag: positionProjectTags.tag })
          .from(positionProjectTags)
          .where(eq(positionProjectTags.positionId, position.id));

        return {
          ...position,
          attributeIds: attrs.map((a) => a.attributeId),
          projectTags: tags.map((t) => t.tag),
          accessRules: JSON.parse(position.accessRules || '[]'),
        };
      }),
    );

    return result;
  }

  async findOne(id: number) {
    const [position] = await db
      .select()
      .from(positions)
      .where(eq(positions.id, id));
    if (!position) throw new NotFoundException('Position not found');

    const attrs = await db
      .select({ attributeId: positionAttributes.attributeId })
      .from(positionAttributes)
      .where(eq(positionAttributes.positionId, id));

    const tags = await db
      .select({ tag: positionProjectTags.tag })
      .from(positionProjectTags)
      .where(eq(positionProjectTags.positionId, id));

    return {
      ...position,
      attributeIds: attrs.map((a) => a.attributeId),
      projectTags: tags.map((t) => t.tag),
      accessRules: JSON.parse(position.accessRules || '[]'),
    };
  }

  async create(data: {
    title: string;
    shortDescription: string;
    accessRules: any[];
    maxProjects: number;
    attributeIds: number[];
    projectTags: string[];
  }) {
    const [position] = await db
      .insert(positions)
      .values({
        title: data.title,
        shortDescription: data.shortDescription,
        accessRules: JSON.stringify(data.accessRules),
        maxProjects: data.maxProjects,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (data.attributeIds.length > 0) {
      await db.insert(positionAttributes).values(
        data.attributeIds.map((attrId, index) => ({
          positionId: position.id,
          attributeId: attrId,
          order: index,
        })),
      );
    }

    if (data.projectTags.length > 0) {
      await db.insert(positionProjectTags).values(
        data.projectTags.map((tag) => ({
          positionId: position.id,
          tag: tag.toLowerCase(),
        })),
      );
    }

    return position;
  }

  async update(
    id: number,
    data: Partial<{
      title: string;
      shortDescription: string;
      accessRules: any[];
      maxProjects: number;
      attributeIds: number[];
      projectTags: string[];
    }>,
  ) {
    const setData: Partial<typeof positions.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) setData.title = data.title;
    if (data.shortDescription !== undefined)
      setData.shortDescription = data.shortDescription;
    if (data.accessRules !== undefined)
      setData.accessRules = JSON.stringify(data.accessRules);
    if (data.maxProjects !== undefined) setData.maxProjects = data.maxProjects;

    await db.update(positions).set(setData).where(eq(positions.id, id));

    if (data.attributeIds !== undefined) {
      await db
        .delete(positionAttributes)
        .where(eq(positionAttributes.positionId, id));
      if (data.attributeIds.length > 0) {
        await db.insert(positionAttributes).values(
          data.attributeIds.map((attrId, index) => ({
            positionId: id,
            attributeId: attrId,
            order: index,
          })),
        );
      }
    }

    if (data.projectTags !== undefined) {
      await db
        .delete(positionProjectTags)
        .where(eq(positionProjectTags.positionId, id));
      if (data.projectTags.length > 0) {
        await db.insert(positionProjectTags).values(
          data.projectTags.map((tag) => ({
            positionId: id,
            tag: tag.toLowerCase(),
          })),
        );
      }
    }
  }

  async delete(id: number) {
    await db.delete(positions).where(eq(positions.id, id));
  }

  async duplicate(id: number) {
    const original = await this.findOne(id);
    if (!original) throw new NotFoundException('Original not found');

    return this.create({
      title: `${original.title} (copy)`,
      shortDescription: original.shortDescription,
      accessRules: original.accessRules,
      maxProjects: original.maxProjects,
      attributeIds: original.attributeIds,
      projectTags: original.projectTags,
    });
  }
}
