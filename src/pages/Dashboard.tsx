import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import StoreDashboard from '@/components/dashboard/store/StoreDashboard';

export default function Dashboard() {
  const { user, role, loading } = useAuth();

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

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  return <StoreDashboard />;
}