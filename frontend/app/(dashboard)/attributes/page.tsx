import { AuthGuard } from '@/lib/auth/AuthGuard';
import AttributesPageContent from './AttributesPageContent';

export default function AdminPageWrapper() {
  return (
    <AuthGuard allowedRoles={['admin', 'recruiter']}>
      <AttributesPageContent />
    </AuthGuard>
  );
}