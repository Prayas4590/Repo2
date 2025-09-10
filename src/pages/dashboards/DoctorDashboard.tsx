import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertsSection } from '@/components/CitizenComponent';
import DoctorCommunicationHub from '@/components/doctorcomp/CommunicationHub';
import {
  Users,
  MessageCircle,
  FileText,
  Brain,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  ChevronRight
} from 'lucide-react';

const DoctorDashboard = () => {
  const todayStats = [
    {
      title: 'Patients Today',
      value: '18',
      change: '+6 from yesterday',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Consultations',
      value: '12',
      change: '3 pending',
      icon: Activity,
      trend: 'neutral'
    },
    {
      title: 'Critical Cases',
      value: '3',
      change: 'Requires attention',
      icon: AlertTriangle,
      trend: 'warning'
    }
  ];

  const recentPatients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      condition: 'Hypertension',
      severity: 'medium',
      time: '10:30 AM',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 32,
      condition: 'Fever, Headache',
      severity: 'low',
      time: '11:15 AM',
      status: 'in-progress'
    },
    {
      id: 3,
      name: 'Amit Singh',
      age: 28,
      condition: 'Respiratory distress',
      severity: 'high',
      time: '12:00 PM',
      status: 'pending'
    }
  ];

  const aiInsights = [
    {
      type: 'outbreak',
      title: 'Potential Dengue Outbreak',
      description: 'Increased fever cases in Block A suggest possible dengue outbreak',
      confidence: 'High',
      action: 'Recommend immediate vector control measures'
    },
    {
      type: 'trend',
      title: 'Respiratory Cases Rising',
      description: 'Air quality correlation detected with respiratory symptoms',
      confidence: 'Medium',
      action: 'Suggest air quality monitoring and masks'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Reports Section */}
      <section id="reports" className="space-y-6">
        <div className="text-center py-4">
          <h1 className="headline-medium text-text-primary mb-2">Doctor Dashboard</h1>
          <p className="body-medium text-text-secondary">
            Clinical insights and patient management
          </p>
        </div>

        <div className="space-y-3">
          {todayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="material-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${
                        stat.trend === 'up' ? 'bg-success/10' :
                        stat.trend === 'warning' ? 'bg-error/10' : 'bg-doctor-light'
                      } rounded-xl flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${
                          stat.trend === 'up' ? 'text-success' :
                          stat.trend === 'warning' ? 'text-error' : 'text-doctor'
                        }`} />
                      </div>
                      <div>
                        <p className="title-medium text-text-primary">{stat.value}</p>
                        <p className="label-medium text-text-primary">{stat.title}</p>
                        <p className="body-small text-text-secondary">{stat.change}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-secondary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="material-card">
          <CardHeader className="pb-3">
            <CardTitle className="title-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-doctor" />
                Recent Patients
              </span>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="label-medium text-text-primary">{patient.name}</p>
                    <span className="body-small text-text-secondary">({patient.age})</span>
                    <Badge className={getSeverityColor(patient.severity)}>
                      {patient.severity}
                    </Badge>
                  </div>
                  <p className="body-small text-text-secondary">{patient.condition}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-text-disabled" />
                    <span className="body-small text-text-disabled">{patient.time}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader className="pb-3">
            <CardTitle className="title-medium flex items-center gap-2">
              <Brain className="h-5 w-5 text-doctor" />
              AI Insights & Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="label-large text-text-primary">{insight.title}</h3>
                  <span className={`label-small font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence} confidence
                  </span>
                </div>
                <p className="body-medium text-text-secondary mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <p className="body-small text-text-primary font-medium">Recommended Action:</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Take Action
                  </Button>
                </div>
                <p className="body-small text-text-secondary mt-1">{insight.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
            <FileText className="h-6 w-6 text-doctor" />
            <span className="label-small">New Report</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
            <MessageCircle className="h-6 w-6 text-success" />
            <span className="label-small">Team Chat</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 ripple">
            <TrendingUp className="h-6 w-6 text-info" />
            <span className="label-small">Analytics</span>
          </Button>
        </div>

        <Button className="fab bg-doctor text-white hover:bg-doctor/90">
          <Plus className="h-6 w-6" />
        </Button>
      </section>

      {/* Alerts Section */}
      <section id="alerts" className="space-y-6">
        <AlertsSection />
      </section>

      {/* Communication Section */}
      <DoctorCommunicationHub />
    </div>
  );
};

export default DoctorDashboard;
