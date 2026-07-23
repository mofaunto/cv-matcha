'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-user';
import { authClient } from './auth-client';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/feed',
}: AuthGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isPending || isLoading) return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
    }
  }, [session, user, isPending, isLoading, router, allowedRoles, redirectTo]);

  if (isPending || isLoading || !session) return null;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
