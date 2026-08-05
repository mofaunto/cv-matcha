import { useMutation } from '@tanstack/react-query';
import { syncToSalesforce } from '@/lib/api/salesforce';
import { toast } from 'sonner';

export const useSyncSalesforce = () =>
  useMutation({
    mutationFn: syncToSalesforce,
    onSuccess: () => toast.success('Synced to Salesforce!'),
    onError: () => toast.error('Sync failed'),
  });
  