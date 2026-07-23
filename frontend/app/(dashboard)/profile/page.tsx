import { Suspense } from 'react';
import ProfileContent from './ProfileContent';
import { Loader } from '@mantine/core';

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loader color="teal" type="dots" />}>
      <ProfileContent />
    </Suspense>
  );
}