import { AuthGuard } from '@/lib/auth/AuthGuard';
import AdminPageContent from './AdminPageContent';

export default function AdminPageWrapper() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <AdminPageContent />
    </AuthGuard>
  );
}