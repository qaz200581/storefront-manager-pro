import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import StoreDashboard from '@/components/dashboard/store/StoreDashboard';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 根據 user 物件的 isSuperAdmin 屬性來判斷角色
  // 如果是超級管理員，顯示 AdminDashboard
  if (user.isSuperAdmin) {
    return <AdminDashboard />;
  }

  return <StoreDashboard />;
}