import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const guides = [
  { id: 1, title: 'Safe Water Storage', subtitle: 'How to store water safely at home', img: '/placeholder.svg' },
  { id: 2, title: 'Boiling & Purification', subtitle: 'Simple purification methods', img: '/placeholder.svg' },
  { id: 3, title: 'Cleaning Utensils', subtitle: 'Keep utensils germ-free', img: '/placeholder.svg' },
];

export default function TrainingGuides() {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Illustrated Guides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {guides.map((g) => (
          <div key={g.id} className="flex items-center gap-4 p-4 rounded-lg border border-border group">
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <ImageIcon className="h-6 w-6 text-text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="label-large text-text-primary truncate group-hover:whitespace-normal group-hover:overflow-visible" title={g.title}>{g.title}</h3>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="body-small">{g.title}</span>
                </TooltipContent>
              </Tooltip>
              <p className="body-small text-text-secondary truncate group-hover:whitespace-normal" title={g.subtitle}>{g.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="ripple">
                Open Guide
              </Button>
              <Button className="ripple">
                <FileText className="h-4 w-4 mr-2" /> PDF
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
