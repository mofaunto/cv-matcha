import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import db from '../../lib/db';
import {
  cvs,
  positions,
  positionAttributes,
  positionProjectTags,
  projects as projectsTable,
  projectTags,
  userProfileAttributes,
  attributes as attributesTable,
} from '../../lib/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';

interface AccessRule {
  attributeId: number;
  operator: string;
  value: string;
}

type UserProfileAttrValue = Pick<
  typeof userProfileAttributes.$inferSelect,
  | 'valueString'
  | 'valueText'
  | 'valueImageUrl'
  | 'valueNumeric'
  | 'valueDate'
  | 'valueBoolean'
  | 'valueOption'
>;

@Injectable()
export class CvsService {
  async create(candidateId: string, positionId: number) {
    const [existing] = await db
      .select()
      .from(cvs)
      .where(
        and(eq(cvs.candidateId, candidateId), eq(cvs.positionId, positionId)),
      )
      .limit(1);
    if (existing) {
      throw new ForbiddenException('You already have a CV for this position');
    }

    const [position] = await db
      .select()
      .from(positions)
      .where(eq(positions.id, positionId));
    if (!position) throw new NotFoundException('Position not found');

    const accessRules: AccessRule[] = JSON.parse(position.accessRules || '[]');
    const hasAccess = await this.checkAccess(candidateId, accessRules);
    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not meet the access requirements for this position',
      );
    }

    const [cv] = await db
      .insert(cvs)
      .values({
        candidateId,
        positionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return cv;
  }

  async findByCandidate(candidateId: string) {
    const rows = await db
      .select({
        id: cvs.id,
        candidateId: cvs.candidateId,
        positionId: cvs.positionId,
        createdAt: cvs.createdAt,
        updatedAt: cvs.updatedAt,
        positionTitle: positions.title,
      })
      .from(cvs)
      .leftJoin(positions, eq(cvs.positionId, positions.id))
      .where(eq(cvs.candidateId, candidateId));

    return rows;
  }

  async findByPosition(positionId: number) {
    return db.select().from(cvs).where(eq(cvs.positionId, positionId));
  }

  async assembleCV(cvId: number) {
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, cvId));
    if (!cv) throw new NotFoundException('CV not found');

    const [position] = await db
      .select()
      .from(positions)
      .where(eq(positions.id, cv.positionId));
    if (!position) throw new NotFoundException('Position not found');

    const posAttrs = await db
      .select({
        attributeId: positionAttributes.attributeId,
        order: positionAttributes.order,
      })
      .from(positionAttributes)
      .where(eq(positionAttributes.positionId, cv.positionId))
      .orderBy(positionAttributes.order);

    const attributeIds = posAttrs.map((pa) => pa.attributeId);

    let userValues: (typeof userProfileAttributes.$inferSelect)[] = [];
    if (attributeIds.length > 0) {
      userValues = await db
        .select()
        .from(userProfileAttributes)
        .where(
          and(
            eq(userProfileAttributes.userId, cv.candidateId),
            inArray(userProfileAttributes.attributeId, attributeIds),
          ),
        );
    }

    const fullAttributes = await db
      .select()
      .from(attributesTable)
      .where(inArray(attributesTable.id, attributeIds));

    const posTags = await db
      .select({ tag: positionProjectTags.tag })
      .from(positionProjectTags)
      .where(eq(positionProjectTags.positionId, cv.positionId));

    let projectsList: (typeof projectsTable.$inferSelect)[] = [];
    if (posTags.length > 0) {
      const tagValues = posTags.map((t) => t.tag);
      const matchingProjects = await db
        .selectDistinct({ projectId: projectTags.projectId })
        .from(projectTags)
        .where(inArray(projectTags.tag, tagValues));

      const projectIds = matchingProjects.map((p) => p.projectId);
      if (projectIds.length > 0) {
        projectsList = await db
          .select()
          .from(projectsTable)
          .where(
            and(
              eq(projectsTable.userId, cv.candidateId),
              inArray(projectsTable.id, projectIds),
            ),
          )
          .orderBy(desc(projectsTable.startDate))
          .limit(position.maxProjects);
      }
    }

    return {
      cvId: cv.id,
      positionTitle: position.title,
      positionShortDescription: position.shortDescription,
      positionId: position.id,
      attributes: posAttrs.map((pa) => {
        const userValue = userValues.find(
          (v) => v.attributeId === pa.attributeId,
        );
        const definition = fullAttributes.find((a) => a.id === pa.attributeId);
        return {
          attributeId: pa.attributeId,
          name: definition?.name ?? '',
          type: definition?.type ?? '',
          value: userValue ?? null,
        };
      }),
      projects: projectsList,
    };
  }

  async delete(cvId: number, userId: string) {
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, cvId));
    if (!cv) throw new NotFoundException('CV not found');
    if (cv.candidateId !== userId) throw new ForbiddenException('Not your CV');
    await db.delete(cvs).where(eq(cvs.id, cvId));
  }

  private async checkAccess(
    candidateId: string,
    rules: AccessRule[],
  ): Promise<boolean> {
    if (!rules || rules.length === 0) return true;

    for (const rule of rules) {
      const [userAttr] = await db
        .select()
        .from(userProfileAttributes)
        .where(
          and(
            eq(userProfileAttributes.userId, candidateId),
            eq(userProfileAttributes.attributeId, rule.attributeId),
          ),
        )
        .limit(1);

      if (!userAttr) return false;

      const value = this.getAttrValue(userAttr);
      if (!this.evaluateRule(value, rule.operator, rule.value)) return false;
    }
    return true;
  }

  private getAttrValue(
    attr: UserProfileAttrValue,
  ): string | number | boolean | null {
    const raw =
      attr.valueString ??
      attr.valueText ??
      attr.valueImageUrl ??
      attr.valueNumeric ??
      attr.valueDate ??
      attr.valueBoolean ??
      attr.valueOption;

    if (raw instanceof Date) return raw.toISOString();
    return raw;
  }

  private evaluateRule(
    value: string | number | boolean | null,
    operator: string,
    expected: string,
  ): boolean {
    if (value === null || value === undefined) return false;

    switch (operator) {
      case '>':
        return Number(value) > Number(expected);
      case '<':
        return Number(value) < Number(expected);
      case '>=':
        return Number(value) >= Number(expected);
      case '<=':
        return Number(value) <= Number(expected);
      case '=':
        return Number(value) === Number(expected);
      case '!=':
        return Number(value) !== Number(expected);

      case 'equals':
        return String(value).toLowerCase() === String(expected).toLowerCase();
      case 'not_equals':
        return String(value).toLowerCase() !== String(expected).toLowerCase();

      case 'true':
        return value === true || value === 'true';
      case 'false':
        return value === false || value === 'false';

      case 'after':
      case 'before': {
        if (typeof value !== 'string' && typeof value !== 'number')
          return false;
        const valueTime = new Date(value).getTime();
        const expectedTime = new Date(expected).getTime();
        if (isNaN(valueTime) || isNaN(expectedTime)) return false;
        return operator === 'after'
          ? valueTime > expectedTime
          : valueTime < expectedTime;
      }

      default:
        return false;
    }
  }
}
