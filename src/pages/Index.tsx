import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, ShoppingCart, Users, BarChart3 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary shadow-lg shadow-glow">
              <Package className="w-10 h-10 text-primary-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
                店家專屬
                <span className="text-primary block md:inline"> 訂購平台</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                簡單高效的產品訂購系統，讓您輕鬆管理訂單與產品庫存
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gradient"
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                開始使用
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                登入帳號
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">輕鬆訂購</h3>
            <p className="text-muted-foreground">
              瀏覽產品目錄，快速加入購物車，一鍵送出訂單
            </p>
          </div>

          <div className="text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto">
              <BarChart3 className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold">即時管理</h3>
            <p className="text-muted-foreground">
              管理員可即時查看訂單狀態，更新產品資訊
            </p>
          </div>

          <div className="text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-xl font-semibold">角色區分</h3>
            <p className="text-muted-foreground">
              管理員與店家專屬介面，功能清晰明確
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 訂購系統. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}