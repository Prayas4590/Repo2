import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';
import { downloadBlob, openPrintable } from './TrainingAwarenessUtils';

export default function InfographicsSection() {
  const svgPoster = (title: string, subtitle: string) => `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="800" height="1120"><rect width="100%" height="100%" fill="#E6F4EA"/><text x="50%" y="180" font-size="48" text-anchor="middle" fill="#0A7">${title}</text><text x="50%" y="260" font-size="28" text-anchor="middle" fill="#0A7">${subtitle}</text><circle cx="400" cy="560" r="160" fill="#0A7" opacity="0.1"/><text x="50%" y="560" font-size="36" text-anchor="middle" fill="#0A7">Wash Hands • Boil Water • Clean Storage</text></svg>`;
  const items: { title: string; sub: string }[] = [];
  return (
    <div className="grid gap-4">
      {items.map((info, i) => {
        const svg = svgPoster(info.title, info.sub);
        const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        return (
          <Card key={i} className="material-card">
            <CardHeader>
              <CardTitle className="title-medium">{info.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={src} alt={info.title} className="w-full rounded-md border" />
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="material-button ripple" onClick={() => downloadBlob(`${info.title.replace(/\s+/g, '_')}.svg`, svg, 'image/svg+xml')}>
                  <MdIcon name="download" size={18} className="mr-2" /> Download
                </Button>
                <Button variant="ghost" size="sm" className="material-button ripple" onClick={() => openPrintable(`<img src='${src}' style='width:100%'/>`, 'Infographic')}>
                  <MdIcon name="print" size={18} className="mr-2" /> Print
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
