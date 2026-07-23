import { Controller, Post, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { LikesService } from './likes.service';

@Controller('api/cvs')
@UseGuards(AuthGuard, RolesGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id/like')
  @Roles('recruiter', 'admin')
  async toggle(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.likesService.toggle(+id, req.user!.id);
  }

  @Get(':id/likes')
  @Roles('candidate', 'recruiter', 'admin')
  async count(@Param('id') id: string) {
    return this.likesService.getLikeCount(+id);
  }
}
