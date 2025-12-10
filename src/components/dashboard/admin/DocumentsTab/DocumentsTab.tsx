import { useState, useEffect } from 'react';
import { X, ClipboardCheck, ShoppingCart, Package, CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import OrderForm from './OrderForm/OrderForm';

type DocumentType = 'sales' | 'purchase';

interface OpenDocument {
  id: string;
  type: DocumentType;
  title: string;
}

export default function DocumentsTab() {
  const [openDocs, setOpenDocs] = useState<OpenDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin-open-docs');
    if (saved) {
      const parsed = JSON.parse(saved);
      setOpenDocs(parsed);
      setActiveDocId(parsed[0]?.id || null);
      toast.info('已恢復上次未完成的單據');
    }
  }, []);

  useEffect(() => {
    if (openDocs.length > 0) {
      localStorage.setItem('admin-open-docs', JSON.stringify(openDocs));
    } else {
      localStorage.removeItem('admin-open-docs');
    }
  }, [openDocs]);

  const openNewDocument = (type: DocumentType) => {
    const titles: Record<DocumentType, string> = {
      sales: '新增銷售單',
      purchase: '新增訂單',
    };

    const newDoc: OpenDocument = {
      id: crypto.randomUUID(),
      type,
      title: titles[type],
    };

    setOpenDocs(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const closeDocument = (id: string) => {
    setOpenDocs(prev => prev.filter(doc => doc.id !== id));
    if (activeDocId === id) {
      const remaining = openDocs.filter(doc => doc.id !== id);
      setActiveDocId(remaining[remaining.length - 1]?.id || null);
    }
  };

  const getIcon = (type: DocumentType) => {
    const map = {
      sales: <ClipboardCheck className="w-4 h-4" />,
      purchase: <ShoppingCart className="w-4 h-4" />,
    };
    return map[type];
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => openNewDocument('sales')}>
            <ClipboardCheck className="w-4 h-4 mr-2" />
            新增銷售單
          </Button>
          <Button onClick={() => openNewDocument('purchase')} variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            新增訂單
          </Button>
        </div>
      </Card>

      {openDocs.length === 0 ? (
        <Card className="p-16 text-center text-muted-foreground">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <CirclePlus className="w-8 h-8" />
          </div>
          <p>點擊上方按鈕建立新單據</p>
          <p className="text-sm mt-2">未完成的單據會自動保存，重新整理也不會不見！</p>
        </Card>
      ) : (
        <Tabs value={activeDocId || undefined} onValueChange={setActiveDocId}>
          <TabsList className="flex flex-wrap h-auto bg-muted/50 p-1 gap-1">
            {openDocs.map(doc => (
              <TabsTrigger
                key={doc.id}
                value={doc.id}
                className="flex items-center gap-2 max-w-xs data-[state=active]:bg-background rounded-md"
              >
                {getIcon(doc.type)}
                <span className="truncate">{doc.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeDocument(doc.id);
                  }}
                  className="ml-2 hover:bg-muted rounded-sm p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </TabsTrigger>
            ))}
          </TabsList>

          {openDocs.map(doc => (
            <TabsContent key={doc.id} value={doc.id} className="mt-4">
              <Card className="p-6 min-h-[600px]">
                <OrderForm
                  docId={doc.id}
                  type={doc.type}
                  onClose={() => closeDocument(doc.id)}
                  onSubmitSuccess={() => {
                    toast.success(`${doc.type === 'sales' ? '銷售單' : '訂單'}已建立`);
                    closeDocument(doc.id);
                  }}
                />
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
