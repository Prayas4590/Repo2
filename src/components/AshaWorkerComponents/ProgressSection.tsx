import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MdIcon from '@/components/ui/md3-icon';
import { Module } from './TrainingAwarenessUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function ProgressSection({ modules, progress, completionPercent, toggle, onCertificate }: { modules: Module[]; progress: Record<string, boolean>; completionPercent: number; toggle: (id: string) => void; onCertificate: () => void; }) {
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium flex items-center gap-2">
          <MdIcon name="check_circle" size={20} className="text-success" /> My Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="body-medium text-text-primary">Completion</span>
            <Badge>{completionPercent}%</Badge>
          </div>
          <Progress value={completionPercent} />
        </div>
        <div className="space-y-2">
          {modules.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
              <div>
                <p className="label-large">{m.title}</p>
                <p className="body-small text-text-secondary">{m.description}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant={progress[m.id] ? 'secondary' : 'default'} className="material-button ripple" onClick={() => toggle(m.id)} aria-label={progress[m.id] ? 'Completed' : 'Mark Complete'}>
                    <MdIcon name={progress[m.id] ? 'check_circle' : 'task_alt'} size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="body-small">{progress[m.id] ? 'Completed' : 'Mark Complete'}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="material-button ripple" onClick={onCertificate}>
            <MdIcon name="print" size={18} className="mr-2" /> View Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
