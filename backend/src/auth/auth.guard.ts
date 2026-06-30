import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { AUTH_TOKEN } from './auth.module';
import type { AuthInstance } from '../../lib/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_TOKEN) private auth: AuthInstance) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await this.auth.api.getSession({
      headers: request.headers,
    });
    if (session?.user) {
      request.user = session.user as unknown as AuthenticatedRequest['user'];
      return true;
    }
    return false;
  }
}
