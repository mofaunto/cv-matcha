import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import db from '../../lib/db';
import { user as userTable } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

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
}
