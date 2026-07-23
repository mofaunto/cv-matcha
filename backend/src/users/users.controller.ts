import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import db from '../../lib/db';
import { user as userTable } from '../../lib/db/schema';
import { eq, and, sql, ne } from 'drizzle-orm';

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async listAll() {
    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
        isBlocked: userTable.isBlocked,
      })
      .from(userTable)
      .orderBy(userTable.name);
    return users;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  async setUserRole(
    @Req() req: AuthenticatedRequest,
    @Param('id') userId: string,
    @Body() body: { role: 'candidate' | 'recruiter' | 'admin' },
  ) {
    const allowedRoles = ['candidate', 'recruiter', 'admin'];
    if (!allowedRoles.includes(body.role)) {
      throw new BadRequestException('Invalid role');
    }

    // prevent the last admin from removing their own admin role
    if (body.role !== 'admin' && userId === req.user!.id) {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userTable)
        .where(and(eq(userTable.role, 'admin'), ne(userTable.id, userId)));
      if (row?.count === 0) {
        throw new ForbiddenException(
          'You are the only admin – role change denied',
        );
      }
    }

    await db
      .update(userTable)
      .set({ role: body.role })
      .where(eq(userTable.id, userId));
    return { success: true, role: body.role };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/block')
  async toggleBlock(
    @Param('id') userId: string,
    @Body() body: { isBlocked: boolean },
  ) {
    await db
      .update(userTable)
      .set({ isBlocked: body.isBlocked })
      .where(eq(userTable.id, userId));
    return { success: true };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/delete')
  async deleteUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') userId: string,
  ) {
    if (req.user!.id === userId) {
      throw new ForbiddenException('You cannot delete yourself');
    }
    await db.delete(userTable).where(eq(userTable.id, userId));
    return { success: true };
  }
}
