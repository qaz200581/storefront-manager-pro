// TableSettings.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface TableSetting {
  id: string;
  table_title: string;
  table_row_title: string;
  table_col_title: string;
}

interface TableSettingsProps {
  tableSettings?: TableSetting[] | null;
  onUpdate: (settings: TableSetting[]) => void;
}

export default function TableSettings({ tableSettings, onUpdate }: TableSettingsProps) {
  // 確保 tableSettings 是陣列
  const settings = tableSettings || [];

  const handleDeleteSetting = (index: number) => {
    const updated = settings.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleUpdateSetting = (index: number, field: keyof TableSetting, value: string) => {
    const updated = [...settings];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const handleAddSetting = () => {
    onUpdate([
      ...settings,
      {
        id: crypto.randomUUID(),
        table_title: '',
        table_row_title: '',
        table_col_title: '',
      },
    ]);
  };

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3">表格式下單設定</h4>

      <div className="space-y-4">
        {settings.map((setting, index) => (
          <div
            key={setting.id}
            className="border p-4 rounded-md relative bg-muted/30 space-y-3"
          >
            <button
              className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
              onClick={() => handleDeleteSetting(index)}
            >
              刪除
            </button>

            <div className="space-y-2">
              <Label>表格標題 (Table Title)</Label>
              <Input
                value={setting.table_title}
                onChange={(e) => handleUpdateSetting(index, 'table_title', e.target.value)}
                placeholder="例：尺寸規格表"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>列標題 (Row Title)</Label>
                <Input
                  value={setting.table_row_title}
                  onChange={(e) => handleUpdateSetting(index, 'table_row_title', e.target.value)}
                  placeholder="例：顏色"
                />
              </div>

              <div className="space-y-2">
                <Label>欄標題 (Column Title)</Label>
                <Input
                  value={setting.table_col_title}
                  onChange={(e) => handleUpdateSetting(index, 'table_col_title', e.target.value)}
                  placeholder="例：尺寸"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={handleAddSetting}
        >
          <Plus className="w-4 h-4 mr-2" />
          新增一組表格設定
        </Button>
      </div>
    </div>
  );
}