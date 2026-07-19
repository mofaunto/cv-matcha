import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { ProjectsService } from './projects.service';

interface CreateProjectDto {
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  tags?: string[];
}

interface UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  tags?: string[];
}

@Controller('api/projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.projectsService.findByUserId(req.user!.id);
  }

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateProjectDto,
  ) {
    return this.projectsService.create({
      userId: req.user!.id,
      name: body.name,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      tags: body.tags ?? [],
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    const data: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date | null;
      tags?: string[];
    } = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
    if (body.endDate !== undefined)
      data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.tags !== undefined) data.tags = body.tags;

    await this.projectsService.update(+id, data);
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.delete(+id);
    return { success: true };
  }

  @Get('tags')
  async tags(@Query('search') search?: string) {
    return this.projectsService.suggestTags(undefined, search);
  }
}
