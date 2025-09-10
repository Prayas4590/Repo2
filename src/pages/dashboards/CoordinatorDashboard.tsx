import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

import { Link } from 'react-router-dom';

const CoordinatorDashboard = () => {
  const statsCards = [
    {
      title: 'Active Cases',
      value: '24',
      change: '+3 today',
      icon: Users,
      color: 'text-coordinator'
    },
    {
      title: 'Water Quality',
      value: '87%',
      change: 'Safe areas',
      icon: Droplets,
      color: 'text-success'
    },
    {
      title: 'Inventory Level',
      value: '72%',
      change: '3 items low',
      icon: Package,
      color: 'text-warning'
    },
    {
      title: 'Alert Response',
      value: '95%',
      change: 'Avg response time',
      icon: TrendingUp,
      color: 'text-success'
    }
  ];

  const patientCases = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      condition: 'Fever, Headache',
      severity: 'medium',
      location: 'Block A',
      time: '2 hours ago',
      status: 'monitoring'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      condition: 'Stomach pain',
      severity: 'low',
      location: 'Block B',
      time: '4 hours ago',
      status: 'resolved'
    },
    {
      id: 3,
      name: 'Amit Singh',
      condition: 'Respiratory issues',
      severity: 'high',
      location: 'Block C',
      time: '6 hours ago',
      status: 'escalated'
    }
  ];

  const waterQualityAreas = [
    { area: 'Block A', status: 'safe', lastTested: '2 hours ago' },
    { area: 'Block B', status: 'contaminated', lastTested: '1 hour ago' },
    { area: 'Block C', status: 'safe', lastTested: '3 hours ago' },
    { area: 'Block D', status: 'pending', lastTested: '1 day ago' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error text-error-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-success text-success-foreground';
      case 'contaminated': return 'bg-error text-error-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="headline-medium text-text-primary mb-2">Coordinator Hub</h1>
          <p className="body-medium text-text-secondary">Health facility management and coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/coordinator" className="inline-flex">
            <Button variant="ghost" size="sm" className="ripple">Alerts</Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="material-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                  <span className="title-large text-text-primary">{stat.value}</span>
                </div>
                <h3 className="label-medium text-text-primary">{stat.title}</h3>
                <p className="body-small text-text-secondary">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Patient Cases */}
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-coordinator" />
              Recent Patient Cases
            </span>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patientCases.map((patient) => (
            <div key={patient.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="label-medium text-text-primary">{patient.name}</p>
                  <Badge className={getSeverityColor(patient.severity)}>
                    {patient.severity}
                  </Badge>
                </div>
                <p className="body-small text-text-secondary">{patient.condition}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-3 w-3 text-text-disabled" />
                  <span className="body-small text-text-disabled">{patient.location}</span>
                  <span className="body-small text-text-disabled">•</span>
                  <span className="body-small text-text-disabled">{patient.time}</span>
                </div>
              </div>
              <Badge variant="outline">{patient.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Water Quality Status */}
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-coordinator" />
              Water Quality Status
            </span>
            <Button variant="ghost" size="sm" className="text-primary">
              View Map
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {waterQualityAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="label-medium text-text-primary">{area.area}</p>
                  <p className="body-small text-text-secondary">Last tested: {area.lastTested}</p>
                </div>
              </div>
              <Badge className={getStatusColor(area.status)}>
                {area.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <span className="label-small">Create Alert</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <MessageCircle className="h-6 w-6 text-success" />
          <span className="label-small">Team Chat</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
          <Package className="h-6 w-6 text-coordinator" />
          <span className="label-small">Inventory</span>
        </Button>
      </div>

      {/* FAB for Quick Report */}
      <Button className="fab bg-coordinator text-white hover:bg-coordinator/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default CoordinatorDashboard;
