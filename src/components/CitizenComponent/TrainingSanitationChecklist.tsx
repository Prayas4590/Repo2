import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

 type Item = { id: string; label: string };

const items: Item[] = [
  { id: 'cover-water', label: 'Cover all water containers' },
  { id: 'clean-tanks', label: 'Clean water tanks monthly' },
  { id: 'no-stagnant', label: 'Remove stagnant water around home' },
  { id: 'handwashing', label: 'Handwashing station with soap' },
  { id: 'segregate-waste', label: 'Segregate and dispose waste properly' },
];

export default function TrainingSanitationChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanitation_checklist');
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sanitation_checklist', JSON.stringify(checked));
    } catch {}
  }, [checked]);

  const toggle = (id: string, value: boolean) => setChecked((c) => ({ ...c, [id]: value }));
  const reset = () => setChecked({});

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Home Sanitation Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <label key={it.id} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer">
            <Checkbox checked={!!checked[it.id]} onCheckedChange={(v) => toggle(it.id, Boolean(v))} />
            <span className="body-medium text-text-primary">{it.label}</span>
          </label>
        ))}
        <Button variant="outline" className="w-full ripple" onClick={reset}>Reset Checklist</Button>
      </CardContent>
    </Card>
  );
}
