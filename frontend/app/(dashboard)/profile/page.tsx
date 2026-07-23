import { Suspense } from 'react';
import ProfileContent from './ProfileContent';
import { Loader } from '@mantine/core';
import { AuthGuard } from '@/lib/auth/AuthGuard';

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={['admin', 'candidate']}>
      <Suspense fallback={<Loader color="teal" type="dots" />}>
        <ProfileContent />
      </Suspense>
    </AuthGuard>
  );
}