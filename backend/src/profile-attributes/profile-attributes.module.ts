import { Module } from '@nestjs/common';
import { ProfileAttributesController } from './profile-attributes.controller';
import { ProfileAttributesService } from './profile-attributes.service';

@Module({
  controllers: [ProfileAttributesController],
  providers: [ProfileAttributesService],
})
export class ProfileAttributesModule {}
