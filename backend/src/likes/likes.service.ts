import { Injectable } from '@nestjs/common';
import db from '../../lib/db';
import { likes } from '../../lib/db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class LikesService {
  async toggle(cvId: number, recruiterId: string) {
    const [existing] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.cvId, cvId), eq(likes.recruiterId, recruiterId)))
      .limit(1);

    if (existing) {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.cvId, existing.cvId),
            eq(likes.recruiterId, existing.recruiterId),
          ),
        );
      return { liked: false };
    } else {
      await db.insert(likes).values({
        cvId,
        recruiterId,
        createdAt: new Date(),
      });
      return { liked: true };
    }
  }

  async getLikeCount(cvId: number) {
    const rows = await db.select().from(likes).where(eq(likes.cvId, cvId));
    return { count: rows.length };
  }
}
