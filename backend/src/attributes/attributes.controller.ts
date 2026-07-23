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
import { RolesGuard, Roles } from '../auth/roles.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { AttributesService } from './attributes.service';

type AttributeType =
  'string' | 'text' | 'image' | 'numeric' | 'date' | 'boolean' | 'one_of_many';

@Controller('api/attributes')
@UseGuards(AuthGuard, RolesGuard)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @Roles('candidate', 'recruiter', 'admin')
  async list(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.attributesService.findAll({
      categoryId: categoryId ? +categoryId : undefined,
      search,
    });
  }

  @Get('recent')
  @Roles('candidate', 'recruiter', 'admin')
  async recent(@Req() req: AuthenticatedRequest) {
    return this.attributesService.findRecent(req.user!.id);
  }

  @Post()
  @Roles('recruiter', 'admin')
  async create(
    @Body()
    body: {
      categoryId: number;
      name: string;
      type: string;
      options?: any;
    },
  ) {
    return this.attributesService.create({
      ...body,
      type: body.type as AttributeType,
    });
  }

  @Patch(':id')
  @Roles('recruiter', 'admin')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; type?: string; options?: any },
  ) {
    return this.attributesService.update(+id, {
      ...body,
      type: body.type as AttributeType | undefined,
    });
  }

  @Delete(':id')
  @Roles('recruiter', 'admin')
  async remove(@Param('id') id: string) {
    await this.attributesService.delete(+id);
    return { success: true };
  }
}
