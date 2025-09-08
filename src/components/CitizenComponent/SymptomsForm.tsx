import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SymptomsMediaUpload, { MediaFile } from './SymptomsMediaUpload';
import SymptomsLocationInput, { LocationData } from './SymptomsLocationInput';

const COMMON_SYMPTOMS = ['Fever', 'Diarrhea', 'Vomiting', 'Headache', 'Dehydration', 'Nausea'];

type Props = { };

export default function SymptomsForm({}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [location, setLocation] = useState<LocationData>({ village: '', area: '', landmark: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleSymptom = (s: string) => setSelected((cur) => cur.includes(s) ? cur.filter(i => i !== s) : [...cur, s]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !severity || !location.village || !location.area) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const createdAt = new Date();
    const reportNo = `SR-${createdAt.getTime()}`;
    const summary = selected.length ? selected.join(', ') : description.slice(0, 40) + (description.length > 40 ? '…' : '');
    const item = {
      id: createdAt.getTime().toString(),
      reportNo,
      summary,
      description,
      selectedSymptoms: selected,
      severity: severity as 'low'|'medium'|'high',
      location: `${location.village}, ${location.area}${location.landmark ? ' • ' + location.landmark : ''}`,
      locationFields: location,
      media,
      time: createdAt.toLocaleString(),
      createdAt: createdAt.toISOString(),
      status: 'pending' as const,
    };
    try {
      const saved = localStorage.getItem('symptoms_reports');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(item);
      localStorage.setItem('symptoms_reports', JSON.stringify(list));
    } catch {}

    toast({ title: 'Report Submitted', description: 'Your symptom report was submitted.' });
    setSelected([]);
    setDescription('');
    setSeverity('');
    setMedia([]);
    setLocation({ village: '', area: '', landmark: '' });
    setLoading(false);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Report Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Symptoms Chips */}
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Select Symptoms</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(s => (
                <Button key={s} type="button" size="sm" variant={selected.includes(s) ? 'default' : 'outline'} className="rounded-full ripple" onClick={() => toggleSymptom(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Describe Symptoms</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., fever, vomiting, diarrhea…" className="min-h-[100px] border-input" required />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Severity Level</Label>
            <Select value={severity} onValueChange={setSeverity} required>
              <SelectTrigger className="border-input"><SelectValue placeholder="Select severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Mild - Can wait</SelectItem>
                <SelectItem value="medium">🟡 Moderate - Needs attention</SelectItem>
                <SelectItem value="high">🔴 Severe - Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Upload */}
          <SymptomsMediaUpload files={media} onChange={setMedia} />

          {/* Location */}
          <SymptomsLocationInput value={location} onChange={setLocation} />

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full material-button bg-primary text-primary-foreground hover:bg-primary/90 ripple">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Submitting Report…
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
