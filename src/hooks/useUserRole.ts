import { useAuth } from './useAuth';

export function useUserRole() {
  const { user } = useAuth();

  // Check if user is admin (from user_roles table via isSuperAdmin)
  const isAdmin = user?.isSuperAdmin === true;
  
  // Check if user is manager (from user_roles table)
  // This would require additional logic in useAuth, for now we use accessibleStores
  const isManager = user?.accessibleStores?.some(s => 
    s.role === 'store_manager' || s.role === 'manager'
  ) ?? false;
  
  // Check if user is store_manager in any store
  const isStoreManager = user?.accessibleStores?.some(s => 
    s.role === 'store_manager'
  ) ?? false;
  
  // Check if user is only an employee
  const isEmployee = !isAdmin && !isManager && !isStoreManager;

  // Get the highest role from store associations
  const getStoreRole = (storeId: string) => {
    return user?.accessibleStores?.find(s => s.store.id === storeId)?.role ?? null;
  };

  return {
    isAdmin,
    isManager,
    isStoreManager,
    isEmployee,
    getStoreRole,
    accessibleStores: user?.accessibleStores ?? [],
  };
}
