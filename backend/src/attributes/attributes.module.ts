import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService, RolesGuard],
  exports: [AttributesService],
})
export class AttributesModule {}
