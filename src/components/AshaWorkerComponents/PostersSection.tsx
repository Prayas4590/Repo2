import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';
import { downloadBlob, openPrintable } from './TrainingAwarenessUtils';

export default function PostersSection() {
  const posters = ['Handwashing Steps', 'Drink Safe Water', 'Clean Storage Containers'];
  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="title-medium">Hygiene Posters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posters.map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
            <div>
              <p className="label-large">{p}</p>
              <p className="body-small text-text-secondary">A4 printable poster</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${p.replace(/\s+/g, '_')}.txt`, `${p} poster content`)}>
                <MdIcon name="download" size={18} className="mr-2" /> Download
              </Button>
              <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<h1>${p}</h1><p>Display in schools and centers.</p>`, p)}>
                <MdIcon name="print" size={18} className="mr-2" /> Print
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
