import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MdIcon from '@/components/ui/md3-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function VideoTutorials() {
  type Lesson = { id: number; title: string; duration: string; sizeMB: number; url: string };
  const lessons: Lesson[] = [
    { id: 1, title: 'Safe Drinking Water Basics', duration: '8 min', sizeMB: 42, url: 'https://www.youtube.com/watch?v=RmYw5X9bG0E' },
    { id: 2, title: 'Handwashing & Hygiene', duration: '6 min', sizeMB: 33, url: 'https://www.youtube.com/watch?v=n-8h3B2CqGk' },
    { id: 3, title: 'Preventing Waterborne Diseases', duration: '10 min', sizeMB: 58, url: 'https://www.youtube.com/watch?v=H6s7wq3Wcpc' },
    { id: 4, title: 'Household Water Treatment', duration: '7 min', sizeMB: 37, url: 'https://www.youtube.com/watch?v=0a4i8b9MZ0M' },
  ];

  const [progress, setProgress] = useState<Record<number, number>>({});
  const [downloaded, setDownloaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('asha_training_videos_dl');
      if (saved) setDownloaded(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('asha_training_videos_dl', JSON.stringify(downloaded));
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
        <CardTitle className="title-medium flex items-center gap-2">
          <MdIcon name="play_circle" size={20} className="text-info" /> Video Tutorials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lessons.map((l) => (
          <div key={l.id} className="p-4 rounded-lg border border-border flex items-center gap-4 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
              <MdIcon name="play_arrow" size={24} />
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
                    <MdIcon name="check_circle" size={16} /> Offline
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
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(l.url, '_blank')}
                    className="ripple"
                    aria-label="Watch"
                    title="Watch"
                  >
                    <MdIcon name="play_circle" size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="body-small">Watch</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={downloaded[l.id] ? 'secondary' : 'default'}
                    size="icon"
                    onClick={() => startDownload(l.id)}
                    className="ripple"
                    disabled={downloaded[l.id]}
                    aria-label={downloaded[l.id] ? 'Downloaded' : 'Download'}
                    title={downloaded[l.id] ? 'Downloaded' : 'Download'}
                  >
                    <MdIcon name="download" size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="body-small">{downloaded[l.id] ? 'Downloaded' : 'Download'}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
