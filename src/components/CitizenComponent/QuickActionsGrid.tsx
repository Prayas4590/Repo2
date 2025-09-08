import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, FileText, MessageCircle, AlertTriangle, BookOpen, Droplets } from 'lucide-react';

export type QuickAction = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path: string;
};

const defaultActions: QuickAction[] = [
  { title: 'Training Modules', description: 'Health education & training', icon: GraduationCap, color: 'bg-citizen-light text-citizen', path: '/resources' },
  { title: 'Report Symptoms', description: 'Health symptom reporting', icon: FileText, color: 'bg-error/10 text-error', path: '/reports?type=symptoms' },
  { title: 'Communication', description: 'Chat with ASHA workers', icon: MessageCircle, color: 'bg-success/10 text-success', path: '/communication' },
  { title: 'Health Alerts', description: 'Important health updates', icon: AlertTriangle, color: 'bg-warning/10 text-warning', path: '/alerts' },
  { title: 'Resources', description: 'Health guides & materials', icon: BookOpen, color: 'bg-info/10 text-info', path: '/resources' },
  { title: 'Water Quality', description: 'Report water contamination', icon: Droplets, color: 'bg-coordinator-light text-coordinator', path: '/reports?type=water' },
];

type QuickActionsGridProps = {
  actions?: QuickAction[];
};

export default function QuickActionsGrid({ actions = defaultActions }: QuickActionsGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="title-medium text-text-primary">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="material-card hover:shadow-lg transition-all ripple">
              <CardContent className="p-4">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="label-large text-text-primary mb-1">{action.title}</h3>
                <p className="body-small text-text-secondary line-clamp-2">{action.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
