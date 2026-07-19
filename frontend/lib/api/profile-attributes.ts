import { apiClient } from './client';
import type { Attribute } from './attributes';

export interface ProfileAttribute {
  id: number;
  attributeId: number;
  valueString: string | null;
  valueText: string | null;
  valueImageUrl: string | null;
  valueNumeric: number | null;
  valueDate: string | null;
  valueBoolean: boolean | null;
  valueOption: string | null;
  version: number;
  name: string;
  type: Attribute['type'];
  categoryId: number;
  isBuiltIn: boolean;
}

export const fetchProfileAttributes = () =>
  apiClient.get<ProfileAttribute[]>('/api/profile/attributes').then(res => res.data);

export const addProfileAttribute = (attributeId: number) =>
  apiClient.post<ProfileAttribute>('/api/profile/attributes', { attributeId }).then(res => res.data);

export const updateProfileAttributeValue = (id: number, version: number, value: Record<string, any>) =>
  apiClient.patch<ProfileAttribute>(`/api/profile/attributes/${id}`, { version, value }).then(res => res.data);

export const removeProfileAttribute = (id: number) =>
  apiClient.delete(`/api/profile/attributes/${id}`).then(res => res.data);
