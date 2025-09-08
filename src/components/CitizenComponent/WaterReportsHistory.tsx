import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Clock, CheckCircle2 } from 'lucide-react';

export type WaterReportHistoryItem = {
  id: string;
  title: string;
  time: string;
  status: 'submitted' | 'inspection requested' | 'verified' | 'resolved';
  feedback?: string;
  severity?: 'low' | 'medium' | 'high';
};

const statusColor = (s: WaterReportHistoryItem['status']) => {
  switch (s) {
    case 'verified':
    case 'resolved':
      return 'bg-success text-success-foreground';
    case 'inspection requested':
      return 'bg-info text-white';
    default:
      return 'bg-warning text-warning-foreground';
  }
};

const severityColor = (s?: 'low'|'medium'|'high') => s === 'high' ? 'bg-error text-error-foreground' : s === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground';

export default function WaterReportsHistory() {
  const items: WaterReportHistoryItem[] = [
    {
      id: 'WR-20250908-01',
      title: 'Color change and smell at Community Tank',
      time: 'Sep 8, 2025, 10:30 AM',
      status: 'verified',
      feedback: 'Issue verified. Chlorination scheduled today. Avoid drinking until notice.',
      severity: 'high',
    },
    {
      id: 'WR-20250907-02',
      title: 'Turbidity observed at Handpump 2',
      time: 'Sep 7, 2025, 4:10 PM',
      status: 'inspection requested',
      feedback: 'ASHA worker assigned for inspection.',
      severity: 'medium',
    },
  ];

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <Droplets className="h-5 w-5 text-coordinator" />
          Water Reports & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{it.id}</Badge>
                  <Badge className={statusColor(it.status)}>{it.status}</Badge>
                  <Badge className={severityColor(it.severity)}>{it.severity}</Badge>
                </div>
                <p className="label-medium text-text-primary truncate mt-1">{it.title}</p>
                <p className="body-small text-text-disabled flex items-center gap-1"><Clock className="h-3 w-3" />{it.time}</p>
                {it.feedback && (
                  <p className="body-small text-text-secondary mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {it.feedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
