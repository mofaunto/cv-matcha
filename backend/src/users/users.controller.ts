import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import db from '../../lib/db';
import { user as userTable } from '../../lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

@Controller('api/users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user!.id;
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      theme: user.theme,
      language: user.language,
      isBlocked: user.isBlocked,
      setupCompleted: user.setupCompleted,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: { theme?: 'light' | 'dark'; language?: string; name?: string },
  ) {
    const userId = req.user!.id;
    const updates: Record<string, unknown> = {};
    if (body.theme) updates.theme = body.theme;
    if (body.language) updates.language = body.language;
    if (body.name) updates.name = body.name;

    if (Object.keys(updates).length === 0) {
      return { success: false, message: 'No valid fields to update' };
    }

    await db.update(userTable).set(updates).where(eq(userTable.id, userId));
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Patch('me/role')
  async updateRole(
    @Req() req: AuthenticatedRequest,
    @Body() body: { role: 'candidate' | 'recruiter' | 'admin' },
  ) {
    const userId = req.user!.id;

    const [currentUser] = await db
      .select({ setupCompleted: userTable.setupCompleted })
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!currentUser) throw new BadRequestException('User not found');
    if (currentUser.setupCompleted) {
      throw new BadRequestException('Setup already completed');
    }

    const allowedRoles = ['candidate', 'recruiter', 'admin'] as const;
    if (!allowedRoles.includes(body.role)) {
      throw new BadRequestException('Invalid role');
    }

    if (body.role === 'admin') {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userTable)
        .where(
          and(
            eq(userTable.role, 'admin'),

            sql`${userTable.id} != ${userId}`,
          ),
        );
      const adminCount = row?.count ?? 0;
      if (adminCount >= 3) {
        throw new ForbiddenException('Maximum number of admins reached (3)');
      }
    }

    await db
      .update(userTable)
      .set({
        role: body.role,
        setupCompleted: true,
      })
      .where(eq(userTable.id, userId));

    return { success: true, role: body.role };
  }
}
