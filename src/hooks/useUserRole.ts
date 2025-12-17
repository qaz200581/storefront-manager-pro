import { useAuth } from './useAuth';

export function useUserRole() {
  const { user } = useAuth();

  const roles = user?.user_metadata?.roles || [];

  const isAdmin = roles.includes('admin');
  const isManager = roles.includes('store');

  return {
    isAdmin,
    isManager,
    roles,
  };
}
