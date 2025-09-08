import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';
import { downloadBlob } from './TrainingAwarenessUtils';

export default function DownloadsSection() {
  const items = [
    { name: 'Field Checklist', content: 'Pre-visit checklist for ASHA workers.' },
    { name: 'Household Survey', content: 'Basic hygiene and water safety survey.' },
    { name: 'Session Attendance Sheet', content: 'Track participants for awareness sessions.' },
  ];
  return (
    <div className="grid gap-4">
      {items.map((d, i) => (
        <Card key={i} className="material-card">
          <CardHeader>
            <CardTitle className="title-medium">{d.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body-medium text-text-secondary mb-3">{d.content}</p>
            <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${d.name.replace(/\s+/g, '_')}.txt`, `${d.name}\n\n${d.content}`)}>
              <MdIcon name="download" size={18} className="mr-2" /> Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
