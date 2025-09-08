import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WaterMediaUpload, { WaterMediaFile } from './WaterMediaUpload';
import WaterLocationInput, { WaterLocationData } from './WaterLocationInput';

const ISSUE_TYPES = ['Color change', 'Smell', 'Turbidity', 'Oil/Grease', 'Foam', 'Taste', 'Other'];
const SOURCE_PLACES = ['Tap', 'Handpump', 'Home Storage', 'Community Tank', 'River', 'Pond', 'Well', 'Other'];

export type WaterReport = {
  id: string;
  issues: string[];
  sourcePlace: string;
  details: string;
  media: WaterMediaFile[];
  location: WaterLocationData;
  inspection: 'none' | 'asha' | 'health-team';
  time: string;
};

type Props = { onSubmitted?: (report: WaterReport) => void };

export default function WaterReportForm({ onSubmitted }: Props) {
  const [issues, setIssues] = useState<string[]>([]);
  const [sourcePlace, setSourcePlace] = useState('');
  const [details, setDetails] = useState('');
  const [media, setMedia] = useState<WaterMediaFile[]>([]);
  const [location, setLocation] = useState<WaterLocationData>({ village: '', area: '', landmark: '' });
  const [inspection, setInspection] = useState<'none'|'asha'|'health-team'>('none');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleIssue = (s: string) => setIssues((cur) => cur.includes(s) ? cur.filter(i => i !== s) : [...cur, s]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issues.length || !sourcePlace || !details || !location.village || !location.area) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const createdAt = new Date();
    const report: WaterReport = {
      id: `WR-${createdAt.getTime()}`,
      issues,
      sourcePlace,
      details,
      media,
      location,
      inspection,
      time: createdAt.toLocaleString(),
    };

    try {
      const saved = localStorage.getItem('water_reports');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(report);
      localStorage.setItem('water_reports', JSON.stringify(list));
    } catch {}

    toast({ title: 'Water Issue Reported', description: inspection !== 'none' ? 'Inspection requested. You will be notified.' : 'Your report has been submitted.' });
    setIssues([]);
    setSourcePlace('');
    setDetails('');
    setMedia([]);
    setLocation({ village: '', area: '', landmark: '' });
    setInspection('none');
    setLoading(false);
    onSubmitted?.(report);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <Droplets className="h-5 w-5 text-coordinator" />
          Report Water Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">What is the issue?</Label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map(s => (
                <Button key={s} type="button" size="sm" variant={issues.includes(s) ? 'default' : 'outline'} className="rounded-full ripple" onClick={() => toggleIssue(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Where is it observed?</Label>
            <Select value={sourcePlace} onValueChange={setSourcePlace} required>
              <SelectTrigger className="border-input"><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {SOURCE_PLACES.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Other details</Label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe color, smell, turbidity, etc." className="min-h-[100px] border-input" required />
          </div>

          <WaterMediaUpload files={media} onChange={setMedia} />

          <WaterLocationInput value={location} onChange={setLocation} />

          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Request inspection</Label>
            <Select value={inspection} onValueChange={(v: 'none'|'asha'|'health-team') => setInspection(v)}>
              <SelectTrigger className="border-input"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No inspection</SelectItem>
                <SelectItem value="asha">ASHA Worker</SelectItem>
                <SelectItem value="health-team">Health Team</SelectItem>
              </SelectContent>
            </Select>
            {inspection !== 'none' && (
              <Badge className="bg-info text-white mt-1">{inspection === 'asha' ? 'ASHA' : 'Health Team'} inspection requested</Badge>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full material-button bg-primary text-primary-foreground hover:bg-primary/90 ripple">
            {loading ? 'Submitting…' : 'Submit Water Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
