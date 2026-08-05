import { apiClient } from './client';

export interface SalesforceDto {
  phone?: string;
  title?: string;
  company?: string;
  location?: string;
}

export const syncToSalesforce = (data: SalesforceDto) =>
  apiClient.post('/api/salesforce/sync', data).then(r => r.data);