import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [RolesGuard],
})
export class UsersModule {}
