import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AttributesModule } from './attributes/attributes.module';
import { ProfileAttributesModule } from './profile-attributes/profile-attributes.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    HealthModule,
    AuthModule.forRoot(),
    UsersModule,
    CategoriesModule,
    AttributesModule,
    ProfileAttributesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
