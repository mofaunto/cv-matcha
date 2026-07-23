import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, RolesGuard],
})
export class PositionsModule {}
