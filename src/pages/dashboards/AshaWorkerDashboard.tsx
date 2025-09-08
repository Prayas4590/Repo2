import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TestTube,
  Users,
  Package,
  AlertTriangle,
  BookOpen,
  Activity,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import AshaBottomNavbar, { AshaSectionKey } from '@/components/AshaWorkerComponents/AshaBottomNavbar';
import TrainingAwarenessSection from '@/components/AshaWorkerComponents/TrainingAwarenessSection';

const AshaWorkerDashboard = () => {
  const quickActions = [
    {
      title: 'Start Water Test',
      description: 'Begin water quality testing',
      icon: TestTube,
      color: 'bg-asha-light text-asha',
      count: '3 pending'
    },
    {
      title: 'Patient Alerts',
      description: 'Review flagged patients',
      icon: Users,
      color: 'bg-error/10 text-error',
      count: '7 alerts'
    },
    {
      title: 'Inventory Check',
      description: 'Medical supplies status',
      icon: Package,
      color: 'bg-warning/10 text-warning',
      count: '2 low stock'
    },
    {
      title: 'Training Modules',
      description: 'Continue education',
      icon: BookOpen,
      color: 'bg-info/10 text-info',
      count: '1 new'
    }
  ];

  const todayTasks = [
    { id: 1, task: 'Water quality test - Block A', status: 'pending', priority: 'high' },
    { id: 2, task: 'Patient follow-up - Mrs. Sharma', status: 'in-progress', priority: 'medium' },
    { id: 3, task: 'Inventory check - Medical supplies', status: 'completed', priority: 'low' },
    { id: 4, task: 'Community education session', status: 'pending', priority: 'medium' },
    { id: 5, task: 'Water test - Block C', status: 'completed', priority: 'high' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-error';
      case 'medium': return 'border-l-4 border-warning';
      case 'low': return 'border-l-4 border-success';
      default: return 'border-l-4 border-muted';
    }
  };

  const completedTasks = todayTasks.filter(t => t.status === 'completed').length;
  const progressPercentage = (completedTasks / todayTasks.length) * 100;

  const [active, setActive] = useState<AshaSectionKey>('alerts');

  const HomeContent = (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">ASHA Dashboard</h1>
        <p className="body-medium text-text-secondary">Community health monitoring and support</p>
      </div>

      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-asha" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="body-medium text-text-primary">Tasks Completed</span>
            <span className="label-large text-asha">{completedTasks}/{todayTasks.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="title-small text-success">{completedTasks}</p>
              <p className="body-small text-text-secondary">Completed</p>
            </div>
            <div>
              <p className="title-small text-warning">{todayTasks.filter(t => t.status === 'in-progress').length}</p>
              <p className="body-small text-text-secondary">In Progress</p>
            </div>
            <div>
              <p className="title-small text-text-secondary">{todayTasks.filter(t => t.status === 'pending').length}</p>
              <p className="body-small text-text-secondary">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="title-medium text-text-primary">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="material-card hover:shadow-lg transition-all ripple">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="label-large text-text-primary mb-1">{action.title}</h3>
                  <p className="body-small text-text-secondary mb-2">{action.description}</p>
                  <Badge variant="outline" className="text-xs">{action.count}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-asha" />
              Today's Tasks
            </span>
            <Button variant="ghost" size="sm" className="text-primary">
              Add Task
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.map((task) => (
            <div key={task.id} className={`flex items-center gap-3 p-3 bg-muted/30 rounded-lg ${getPriorityColor(task.priority)}`}>
              <div className="flex-shrink-0">
                {task.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : task.status === 'in-progress' ? (
                  <Clock className="h-5 w-5 text-warning" />
                ) : (
                  <div className="w-5 h-5 border-2 border-muted rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`label-medium ${task.status === 'completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                  {task.task}
                </p>
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="fab bg-asha text-white hover:bg-asha/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {active === 'training' ? (<TrainingAwarenessSection />) : HomeContent}
      <AshaBottomNavbar activeKey={active} onChange={setActive} />
    </div>
  );
};

export default AshaWorkerDashboard;
