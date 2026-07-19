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
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { ProfileAttributesService } from './profile-attributes.service';

@Controller('api/profile/attributes')
@UseGuards(AuthGuard)
export class ProfileAttributesController {
  constructor(private readonly service: ProfileAttributesService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.service.getUserAttributes(req.user!.id);
  }

  @Post()
  async add(
    @Req() req: AuthenticatedRequest,
    @Body() body: { attributeId: number },
  ) {
    return this.service.addAttribute(req.user!.id, body.attributeId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { version: number; value: Record<string, any> },
  ) {
    return this.service.updateAttributeValue(+id, body.version, body.value);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.removeAttribute(+id);
    return { success: true };
  }
}
