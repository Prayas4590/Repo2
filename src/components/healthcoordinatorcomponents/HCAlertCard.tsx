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
  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-error' : alert.severity === 'medium' ? 'text-warning' : 'text-success'}`} />
            <span className="truncate">{alert.title}</span>
          </span>
          <div className="flex items-center gap-3">
            <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
            <span className="body-small text-text-disabled">{alert.time}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="label-medium text-text-primary">Area: {alert.area}</p>

            {alert.category === 'outbreak' && (
              <>
                <p className="body-small text-text-secondary mt-1">Cases: <strong>{alert.cases ?? 0}</strong></p>
                <p className="body-small text-text-secondary mt-1">Symptoms: {alert.symptoms ?? 'Fever, Vomiting'}</p>
              </>
            )}

            {alert.category === 'water' && (
              <>
                <p className="body-small text-text-secondary mt-1">Contaminant: <strong>{alert.contaminant ?? 'E. coli'}</strong></p>
                <p className="body-small text-text-secondary mt-1">Source: {alert.source ?? 'Community well'}</p>
              </>
            )}

            {alert.category === 'emergency' && (
              <>
                <p className="body-small text-text-secondary mt-1">Assistance: <strong>{alert.assistanceType ?? 'Medical team'}</strong></p>
                <p className="body-small text-text-secondary mt-1">Priority: {alert.status}</p>
              </>
            )}

            {alert.category === 'supply' && (
              <>
                <p className="body-small text-text-secondary mt-1">Item: <strong>{alert.title.split('-').slice(0,3).join('-')}</strong></p>
                <p className="body-small text-text-secondary mt-1">Remaining: {typeof alert.remaining === 'number' ? alert.remaining : 'N/A'}</p>
              </>
            )}

            <p className="body-small text-text-secondary mt-2">Status: <span className="capitalize">{alert.status}</span></p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button size="sm" variant={getStatusVariant(alert.status)}>Take Action</Button>
            <Button size="sm" variant="ghost" className="hidden sm:inline-flex">View</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HCAlertCard;
