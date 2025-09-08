import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low' | string;
};

const defaultAlerts: AlertItem[] = [
  { id: 1, title: 'Dengue Prevention', message: 'Keep water storage containers covered', time: '2 hours ago', severity: 'high' },
  { id: 2, title: 'Water Quality Alert', message: 'Boil water before drinking in Block A', time: '6 hours ago', severity: 'medium' },
  { id: 3, title: 'Health Checkup', message: 'Free health screening this weekend', time: '1 day ago', severity: 'low' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-error text-error-foreground';
    case 'medium': return 'bg-warning text-warning-foreground';
    case 'low': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

type RecentAlertsCardProps = {
  alerts?: AlertItem[];
  onViewAll?: () => void;
};

export default function RecentAlertsCard({ alerts = defaultAlerts, onViewAll }: RecentAlertsCardProps) {
  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Recent Alerts
          </span>
          <Button variant="ghost" size="sm" className="text-primary" onClick={onViewAll}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="label-medium text-text-primary">{alert.title}</p>
              <p className="body-small text-text-secondary line-clamp-2">{alert.message}</p>
              <p className="body-small text-text-disabled mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
