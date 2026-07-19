import { Injectable } from '@nestjs/common';
import db from '../../lib/db';
import { projects, projectTags } from '../../lib/db/schema';
import { eq, like, and, SQL } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  async findByUserId(userId: string) {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));
    // Fetch tags for each project
    const result = await Promise.all(
      userProjects.map(async (project) => {
        const tags = await db
          .select({ tag: projectTags.tag })
          .from(projectTags)
          .where(eq(projectTags.projectId, project.id));
        return { ...project, tags: tags.map((t) => t.tag) };
      }),
    );
    return result;
  }

  async create(data: {
    userId: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    tags: string[];
  }) {
    const [project] = await db
      .insert(projects)
      .values({
        userId: data.userId,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (data.tags.length > 0) {
      const tagValues = data.tags.map((tag) => ({
        projectId: project.id,
        tag: tag.toLowerCase(),
      }));
      await db.insert(projectTags).values(tagValues);
    }

    return project;
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date | null;
      tags?: string[];
    },
  ) {
    const setData: Partial<typeof projects.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (data.name !== undefined) setData.name = data.name;
    if (data.description !== undefined) setData.description = data.description;
    if (data.startDate !== undefined) setData.startDate = data.startDate;
    if (data.endDate !== undefined) setData.endDate = data.endDate;

    await db.update(projects).set(setData).where(eq(projects.id, id));

    if (data.tags !== undefined) {
      await db.delete(projectTags).where(eq(projectTags.projectId, id));
      if (data.tags.length > 0) {
        const tagValues = data.tags.map((tag) => ({
          projectId: id,
          tag: tag.toLowerCase(),
        }));
        await db.insert(projectTags).values(tagValues);
      }
    }
  }

  async delete(id: number) {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async suggestTags(userId?: string, search?: string) {
    const conditions: SQL[] = [];
    if (search) {
      conditions.push(like(projectTags.tag, `${search}%`));
    }
    const rows = await db
      .select({ tag: projectTags.tag })
      .from(projectTags)
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(projectTags.tag)
      .limit(20);
    return rows.map((r) => r.tag);
  }
}
