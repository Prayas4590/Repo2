import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Package, 
  AlertTriangle, 
  MessageCircle,
  Droplets,
  TrendingUp,
  MapPin,
  Plus
} from 'lucide-react';

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      title: 'Contaminated water reported',
      area: 'Block B',
      severity: 'high',
      time: '1 hour ago',
      status: 'open'
    },
    {
      id: 2,
      title: 'Spike in fever cases',
      area: 'Block A',
      severity: 'medium',
      time: '3 hours ago',
      status: 'investigating'
    },
    {
      id: 3,
      title: 'Inventory low - Paracetamol',
      area: 'Central Store',
      severity: 'low',
      time: '6 hours ago',
      status: 'acknowledged'
    }
  ];

  const getSeverityColor = (severity: string) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="headline-medium text-text-primary mb-1">Health Coordinator Alerts</h1>
          <p className="body-medium text-text-secondary">Recent alerts and incidents requiring coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/coordinator/dashboard">
            <Button variant="ghost" size="sm">Open Dashboard</Button>
          </Link>
          <Link to="/alerts">
            <Button size="sm">All Alerts</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="material-card">
            <CardHeader className="pb-3">
              <CardTitle className="title-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {alert.title}
                </span>
                <span className="flex items-center gap-3">
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <span className="body-small text-text-disabled">{alert.time}</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-medium text-text-primary">Area: {alert.area}</p>
                  <p className="body-small text-text-secondary">Status: <span className="capitalize">{alert.status}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={getStatusVariant(alert.status)} size="sm">Take Action</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <MessageCircle className="h-6 w-6 text-success" />
          <span className="label-small">Notify Team</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <Users className="h-6 w-6 text-coordinator" />
          <span className="label-small">Assign</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <Package className="h-6 w-6 text-coordinator" />
          <span className="label-small">Supply Request</span>
        </Button>
      </div>

      <Button className="fab bg-coordinator text-white hover:bg-coordinator/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Alerts;
