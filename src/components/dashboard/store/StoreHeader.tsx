import { Button } from '@/components/ui/button';
import { Store, LogOut } from 'lucide-react';

interface StoreHeaderProps {
  storeName: string | null;
  onSignOut: () => void;
}

export default function StoreHeader({ storeName, onSignOut }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{storeName || '我的店家'}</h1>
            <p className="text-xs text-muted-foreground">店家訂購系統</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          登出
        </Button>
      </div>
    </header>
  );
}
