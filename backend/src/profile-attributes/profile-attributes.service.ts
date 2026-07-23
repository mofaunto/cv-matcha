import { Injectable, BadRequestException } from '@nestjs/common';
import db from '../../lib/db';
import { userProfileAttributes, attributes } from '../../lib/db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ProfileAttributesService {
  private async ensureBuiltInAttributes(userId: string) {
    const builtInAttrs = await db
      .select({ id: attributes.id })
      .from(attributes)
      .where(eq(attributes.isBuiltIn, true));

    if (builtInAttrs.length === 0) return;

    const existing = await db
      .select({ attributeId: userProfileAttributes.attributeId })
      .from(userProfileAttributes)
      .where(eq(userProfileAttributes.userId, userId));

    const existingIds = new Set(existing.map((e) => e.attributeId));
    const missingIds = builtInAttrs
      .map((a) => a.id)
      .filter((id) => !existingIds.has(id));

    if (missingIds.length === 0) return;

    const rows = missingIds.map((attributeId) => ({
      userId,
      attributeId,
      version: 1,
      updatedAt: new Date(),
    }));
    await db.insert(userProfileAttributes).values(rows);
  }

  async getUserAttributes(userId: string) {
    await this.ensureBuiltInAttributes(userId);

    return db
      .select({
        id: userProfileAttributes.id,
        attributeId: userProfileAttributes.attributeId,
        valueString: userProfileAttributes.valueString,
        valueText: userProfileAttributes.valueText,
        valueImageUrl: userProfileAttributes.valueImageUrl,
        valueNumeric: userProfileAttributes.valueNumeric,
        valueDate: userProfileAttributes.valueDate,
        valueBoolean: userProfileAttributes.valueBoolean,
        valueOption: userProfileAttributes.valueOption,
        version: userProfileAttributes.version,
        name: attributes.name,
        type: attributes.type,
        categoryId: attributes.categoryId,
        isBuiltIn: attributes.isBuiltIn,
      })
      .from(userProfileAttributes)
      .innerJoin(
        attributes,
        eq(userProfileAttributes.attributeId, attributes.id),
      )
      .where(eq(userProfileAttributes.userId, userId));
  }

  async addAttribute(userId: string, attributeId: number) {
    const [exists] = await db
      .select()
      .from(userProfileAttributes)
      .where(
        and(
          eq(userProfileAttributes.userId, userId),
          eq(userProfileAttributes.attributeId, attributeId),
        ),
      );
    if (exists) throw new BadRequestException('Attribute already added');

    const [profileAttr] = await db
      .insert(userProfileAttributes)
      .values({
        userId,
        attributeId,
        version: 1,
        updatedAt: new Date(),
      })
      .returning();
    return profileAttr;
  }

  async updateAttributeValue(
    profileAttrId: number,
    currentVersion: number,
    value: Record<string, any>,
  ) {
    if (value.valueDate && typeof value.valueDate === 'string') {
      value.valueDate = new Date(value.valueDate);
    }

    const [updated] = await db
      .update(userProfileAttributes)
      .set({ ...value, version: currentVersion + 1, updatedAt: new Date() })
      .where(
        and(
          eq(userProfileAttributes.id, profileAttrId),
          eq(userProfileAttributes.version, currentVersion),
        ),
      )
      .returning();

    if (!updated) {
      throw new BadRequestException(
        'Version conflict – please refresh and try again.',
      );
    }
    return updated;
  }

  async removeAttribute(profileAttrId: number) {
    const [row] = await db
      .select({ isBuiltIn: attributes.isBuiltIn })
      .from(userProfileAttributes)
      .innerJoin(
        attributes,
        eq(userProfileAttributes.attributeId, attributes.id),
      )
      .where(eq(userProfileAttributes.id, profileAttrId));

    if (!row) throw new BadRequestException('Not found');
    if (row.isBuiltIn)
      throw new BadRequestException('Cannot remove built‑in attribute');

    await db
      .delete(userProfileAttributes)
      .where(eq(userProfileAttributes.id, profileAttrId));
  }
}
