import { Injectable } from '@nestjs/common';
import db from '../../lib/db';
import {
  positions,
  cvs,
  user as userTable,
  projectTags,
} from '../../lib/db/schema';
import { sql, eq, gte, count, desc } from 'drizzle-orm';

@Injectable()
export class DashboardService {
  // Latest 5 positions
  async getLatestPositions() {
    return db
      .select({
        id: positions.id,
        title: positions.title,
        shortDescription: positions.shortDescription,
        updatedAt: positions.updatedAt,
      })
      .from(positions)
      .orderBy(desc(positions.updatedAt))
      .limit(5);
  }

  // Top 5 positions by CV count
  async getPopularPositions() {
    const result = await db
      .select({
        id: positions.id,
        title: positions.title,
        shortDescription: positions.shortDescription,
        cvCount: count(cvs.id).as('cvCount'),
      })
      .from(positions)
      .leftJoin(cvs, eq(positions.id, cvs.positionId))
      .groupBy(positions.id)
      .orderBy(desc(sql`cvCount`))
      .limit(5);

    return result.map((r) => ({
      id: r.id,
      title: r.title,
      shortDescription: r.shortDescription,
      cvCount: Number(r.cvCount),
    }));
  }

  // Statistics (admin)
  async getStats() {
    const [totalPositions] = await db
      .select({ count: count() })
      .from(positions);
    const [totalCandidates] = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.role, 'candidate'));
    const [totalRecruiters] = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.role, 'recruiter'));
    const [totalCVs] = await db.select({ count: count() }).from(cvs);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [cvsLast24h] = await db
      .select({ count: count() })
      .from(cvs)
      .where(gte(cvs.createdAt, oneDayAgo));

    return {
      totalPositions: totalPositions?.count ?? 0,
      totalCandidates: totalCandidates?.count ?? 0,
      totalRecruiters: totalRecruiters?.count ?? 0,
      totalCVs: totalCVs?.count ?? 0,
      cvsLast24h: cvsLast24h?.count ?? 0,
    };
  }

  // Tag cloud
  async getTagCloud() {
    const tags = await db
      .select({
        tag: projectTags.tag,
        count: count(projectTags.projectId).as('count'),
      })
      .from(projectTags)
      .groupBy(projectTags.tag)
      .orderBy(desc(sql`count`))
      .limit(20);

    return tags.map((t) => ({ tag: t.tag, count: Number(t.count) }));
  }

  // Full dashboard (admin)
  async getDashboard() {
    const [latestPositions, popularPositions, stats, tagCloud] =
      await Promise.all([
        this.getLatestPositions(),
        this.getPopularPositions(),
        this.getStats(),
        this.getTagCloud(),
      ]);
    return { latestPositions, popularPositions, stats, tagCloud };
  }
}
