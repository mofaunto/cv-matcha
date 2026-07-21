import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { PositionsService } from './positions.service';

interface CreatePositionBody {
  title: string;
  shortDescription: string;
  accessRules: any[];
  maxProjects: number;
  attributeIds: number[];
  projectTags: string[];
}

interface UpdatePositionBody {
  title?: string;
  shortDescription?: string;
  accessRules?: any[];
  maxProjects?: number;
  attributeIds?: number[];
  projectTags?: string[];
}

@Controller('api/positions')
@UseGuards(AuthGuard, RolesGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @Roles('candidate', 'recruiter', 'admin')
  async list() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @Roles('candidate', 'recruiter', 'admin')
  async get(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Post()
  @Roles('recruiter', 'admin')
  async create(@Body() body: CreatePositionBody) {
    return this.positionsService.create(body);
  }

  @Patch(':id')
  @Roles('recruiter', 'admin')
  async update(@Param('id') id: string, @Body() body: UpdatePositionBody) {
    await this.positionsService.update(+id, body);
    return { success: true };
  }

  @Delete(':id')
  @Roles('recruiter', 'admin')
  async remove(@Param('id') id: string) {
    await this.positionsService.delete(+id);
    return { success: true };
  }

  @Post(':id/duplicate')
  @Roles('recruiter', 'admin')
  async duplicate(@Param('id') id: string) {
    return this.positionsService.duplicate(+id);
  }
}
