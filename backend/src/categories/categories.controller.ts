import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import db from '../../lib/db';
import { categories } from '../../lib/db/schema';

@Controller('api/categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  @Get()
  async list() {
    return db.select().from(categories);
  }
}
