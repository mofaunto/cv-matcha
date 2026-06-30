import { Module, Global, DynamicModule } from '@nestjs/common';
import { auth } from '../../lib/auth';
import { AuthController } from './auth.controller';

export const AUTH_TOKEN = 'BETTER_AUTH';

@Global()
@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AUTH_TOKEN,
          useValue: auth,
        },
      ],
      exports: [AUTH_TOKEN],
      controllers: [AuthController],
    };
  }
}
