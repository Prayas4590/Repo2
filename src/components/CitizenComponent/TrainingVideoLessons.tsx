import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Play, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

 type Lesson = {
  id: number;
  title: string;
  duration: string;
  sizeMB: number;
};

const lessons: Lesson[] = [
  { id: 1, title: 'Safe Drinking Water Basics', duration: '8 min', sizeMB: 42 },
  { id: 2, title: 'Handwashing & Hygiene', duration: '6 min', sizeMB: 33 },
  { id: 3, title: 'Preventing Waterborne Diseases', duration: '10 min', sizeMB: 58 },
];

export default function TrainingVideoLessons() {
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [downloaded, setDownloaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('training_downloads');
      if (saved) setDownloaded(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('training_downloads', JSON.stringify(downloaded));
    } catch {}
  }, [downloaded]);

  const startDownload = (id: number) => {
    if (downloaded[id]) return;
    setProgress((p) => ({ ...p, [id]: 0 }));
    const step = () => {
      setProgress((p) => {
        const next = (p[id] ?? 0) + Math.random() * 25;
        if (next >= 100) {
          setDownloaded((d) => ({ ...d, [id]: true }));
          return { ...p, [id]: 100 };
        }
        setTimeout(step, 400);
        return { ...p, [id]: next };
      });
    };
    setTimeout(step, 300);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Short Video Lessons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lessons.map((l) => (
          <div key={l.id} className="p-4 rounded-lg border border-border flex items-center gap-4 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
              <Play className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="label-large text-text-primary truncate group-hover:whitespace-normal group-hover:overflow-visible" title={l.title}>{l.title}</h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="body-small">{l.title}</span>
                  </TooltipContent>
                </Tooltip>
                {downloaded[l.id] && (
                  <Badge className="bg-success text-success-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Offline
                  </Badge>
                )}
              </div>
              <p className="body-small text-text-secondary">{l.duration} • {l.sizeMB} MB</p>
              {progress[l.id] != null && !downloaded[l.id] && (
                <div className="mt-2">
                  <Progress value={Math.min(100, Math.round(progress[l.id]))} className="h-2" />
                </div>
              )}
            </div>
            <Button
              variant={downloaded[l.id] ? 'outline' : 'default'}
              onClick={() => startDownload(l.id)}
              className="material-button ripple"
              disabled={downloaded[l.id]}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloaded[l.id] ? 'Downloaded' : 'Download'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
