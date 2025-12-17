import { Database } from '@/integrations/supabase/types';

export type StoreRole = Database['public']['Enums']['store_role'];

export type StoreStatus = 'active' | 'inactive';

export const STATUS_LABEL: Record<StoreStatus, string> = {
  active: '啟用',
  inactive: '停用',
};
export interface Store {
  id: string;
  name: string;
  parent_store_id: string | null;
  address: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
export type StoreWithRole = Store & {
  user_role: 'owner' | 'manager' | 'employee' | null;
};
export interface StoreUser {
  id: string;
  user_id: string;
  store_id: string;
  role: StoreRole;
  status: string;
  created_at: string;
  profile?: {
    email: string;
    store_name: string | null;
  };
}

export interface StoreFormData {
  name: string;
  parent_store_id: string;
  address: string;
  phone: string;
  status: string;
}

export interface StoreUserFormData {
  email: string;
  role: StoreRole;
  status: string;
}
