import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Archive } from 'lucide-react';

export type ArchivedAlert = {
  id: string;
  title: string;
  severity: 'low'|'medium'|'high';
  type: 'outbreak'|'water'|'seasonal'|'info';
  time: string;
};

const sevColor = (s: string) => s === 'high' ? 'bg-error text-error-foreground' : s === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground';

export default function AlertsArchiveCard() {
  const [items, setItems] = useState<ArchivedAlert[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alerts_archive');
      const list: ArchivedAlert[] = saved ? JSON.parse(saved) : [
        { id: 'AR-1', title: 'Cholera alert - Ward 3', severity: 'high', type: 'outbreak', time: 'Aug 28, 2025' },
        { id: 'AR-2', title: 'Monsoon hygiene tips', severity: 'low', type: 'seasonal', time: 'Aug 20, 2025' },
      ];
      setItems(list);
    } catch {}
  }, []);

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <Archive className="h-5 w-5 text-text-secondary" />
          Alert Archive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="label-medium text-text-primary truncate">{it.title}</p>
                <p className="body-small text-text-disabled flex items-center gap-1"><Clock className="h-3 w-3" />{it.time}</p>
              </div>
              <Badge className={sevColor(it.severity)}>{it.severity}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
