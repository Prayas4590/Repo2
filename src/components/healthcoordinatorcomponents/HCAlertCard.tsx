import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export interface AlertItem {
  id: number;
  title: string;
  area: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
  status: string;
  category: 'outbreak' | 'water' | 'emergency' | 'supply';
  // optional fields for richer mock data
  cases?: number;
  symptoms?: string;
  contaminant?: string;
  source?: string;
  assistanceType?: string;
  remaining?: number;
}

const getSeverityColor = (severity: AlertItem['severity']) => {
  switch (severity) {
    case 'high': return 'bg-error text-error-foreground';
    case 'medium': return 'bg-warning text-warning-foreground';
    case 'low': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'open': return 'outline';
    case 'investigating': return 'secondary';
    case 'acknowledged': return 'default';
    default: return 'outline';
  }
};

const HCAlertCard: React.FC<{ alert: AlertItem }> = ({ alert }) => {
  const iconColor = alert.severity === 'high' ? 'text-error' : alert.severity === 'medium' ? 'text-warning' : 'text-success';
  const iconBg = alert.severity === 'high' ? 'bg-error/10' : alert.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10';

  return (
    <Card className="material-card overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold leading-tight truncate">{alert.title}</h4>
              <div className="flex items-center gap-2">
                <Badge className={`${getSeverityColor(alert.severity)} text-[10px] px-2 py-0.5`}>{alert.severity.toUpperCase()}</Badge>
                <span className="text-xs text-text-disabled">{alert.time}</span>
              </div>
            </div>

            <p className="text-sm text-text-secondary mt-2 truncate">{alert.area}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-4">
        <div className="grid grid-cols-1 gap-1">
          {alert.category === 'outbreak' && (
            <>
              <p className="text-sm text-text-secondary">Cases: <span className="font-medium">{alert.cases ?? 0}</span></p>
              <p className="text-sm text-text-secondary">Symptoms: <span className="font-medium">{alert.symptoms ?? 'Fever, Vomiting'}</span></p>
            </>
          )}

          {alert.category === 'water' && (
            <>
              <p className="text-sm text-text-secondary">Contaminant: <span className="font-medium">{alert.contaminant ?? 'E. coli'}</span></p>
              <p className="text-sm text-text-secondary">Source: <span className="font-medium">{alert.source ?? 'Community well'}</span></p>
            </>
          )}

          {alert.category === 'emergency' && (
            <>
              <p className="text-sm text-text-secondary">Assistance: <span className="font-medium">{alert.assistanceType ?? 'Medical team'}</span></p>
              <p className="text-sm text-text-secondary">Priority: <span className="font-medium">{alert.status}</span></p>
            </>
          )}

          {alert.category === 'supply' && (
            <>
              <p className="text-sm text-text-secondary">Item: <span className="font-medium">{alert.title.split('-').slice(0,3).join('-')}</span></p>
              <p className="text-sm text-text-secondary">Remaining: <span className="font-medium">{typeof alert.remaining === 'number' ? alert.remaining : 'N/A'}</span></p>
            </>
          )}

          <p className="text-sm text-text-secondary mt-2">Status: <span className="capitalize font-medium">{alert.status}</span></p>
        </div>

        <div className="mt-3 flex items-center justify-end">
          <Button size="sm" variant="ghost" className="text-primary">View</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HCAlertCard;
