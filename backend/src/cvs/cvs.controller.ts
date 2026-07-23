import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { CvsService } from './cvs.service';

@Controller('api/cvs')
@UseGuards(AuthGuard, RolesGuard)
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post()
  @Roles('candidate', 'admin')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: { positionId: number },
  ) {
    return this.cvsService.create(req.user!.id, body.positionId);
  }

  @Get('my')
  @Roles('candidate', 'admin')
  async myCVs(@Req() req: AuthenticatedRequest) {
    return this.cvsService.findByCandidate(req.user!.id);
  }

  @Get('position/:positionId')
  @Roles('recruiter', 'admin')
  async forPosition(@Param('positionId') positionId: string) {
    return this.cvsService.findByPosition(+positionId);
  }

  @Get(':id')
  @Roles('candidate', 'recruiter', 'admin')
  async assemble(@Param('id') id: string) {
    return this.cvsService.assembleCV(+id);
  }

  @Delete(':id')
  @Roles('candidate', 'admin')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.cvsService.delete(+id, req.user!.id);
    return { success: true };
  }
}
