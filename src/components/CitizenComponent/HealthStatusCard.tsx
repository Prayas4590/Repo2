import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export default function HealthStatusCard() {
  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-success" />
          Health Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
          <span className="body-medium text-text-primary">Overall Health</span>
          <Badge className="bg-success text-success-foreground">Good</Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="body-medium text-text-primary">Last Checkup</span>
          <span className="body-small text-text-secondary">2 weeks ago</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="body-medium text-text-primary">Vaccinations</span>
          <Badge variant="outline">Up to date</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
