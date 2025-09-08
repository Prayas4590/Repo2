import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';
import { downloadBlob, openPrintable } from './TrainingAwarenessUtils';

export default function CampaignsSection() {
  const campaigns = [
    { title: 'Village Sanitation Drive', desc: 'One-week cleanliness and safe water campaign.' },
    { title: 'Handwashing Awareness Week', desc: 'Demonstrations in schools and anganwadis.' },
    { title: 'Boil Water Advisory', desc: 'Outreach during monsoon and outbreak alerts.' },
    { title: 'Clean Storage Challenge', desc: 'Household visits checking water containers.' },
  ];
  return (
    <div className="grid gap-4">
      {campaigns.map((c, i) => (
        <Card key={i} className="material-card">
          <CardHeader>
            <CardTitle className="title-medium">{c.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body-medium text-text-secondary mb-3">{c.desc}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${c.title.replace(/\s+/g, '_')}_plan.txt`, `${c.title}\n\n${c.desc}`)}>
                <MdIcon name="download" size={18} className="mr-2" /> Download Plan
              </Button>
              <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<h1>${c.title}</h1><p>${c.desc}</p>`, 'Campaign Plan')}>
                <MdIcon name="print" size={18} className="mr-2" /> Print
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
