import { Database } from '@/integrations/supabase/types';

export type StoreRole = Database['public']['Enums']['store_role'];
export type AppRole = Database['public']['Enums']['app_role'];

export type StoreStatus = 'active' | 'inactive';

export const STATUS_LABEL: Record<StoreStatus, string> = {
  active: '啟用',
  inactive: '停用',
};

// 角色優先級（數字越小優先級越高）
export const APP_ROLE_PRIORITY: Record<AppRole, number> = {
  admin: 1,
  manager: 2,
  store_manager: 3,
  store: 4,
};

// 角色標籤
export const APP_ROLE_LABEL: Record<AppRole, string> = {
  admin: '系統管理員',
  manager: '管理者',
  store_manager: '店長',
  store: '店員',
};

// Store role 標籤
export const STORE_ROLE_LABEL: Record<StoreRole, string> = {
  store_manager: '店長',
  manager: '經理', // 保留但不顯示
  employee: '店員',
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
  user_role: StoreRole | null;
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
    user_name: string | null;
  };
}

export interface StoreFormData {
  name: string;
  parent_store_id: string | null;
  address: string;
  phone: string;
  status: string;
}

export interface StoreUserFormData {
  email: string;
  user_name: string;
  role: StoreRole;
  status: string;
}
