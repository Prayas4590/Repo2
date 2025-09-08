import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

const tips = [
  { title: 'Recognize early signs', detail: 'Fever, vomiting, diarrhea, dehydration' },
  { title: 'Seek timely help', detail: 'Contact health worker if symptoms last > 24 hours' },
  { title: 'Safe drinking water', detail: 'Boiled or purified water only; avoid street ice' },
  { title: 'Keep ORS at home', detail: 'Start ORS at first signs of diarrhea' },
  { title: 'Hand hygiene', detail: 'Wash hands before eating and after toilet use' },
];

export default function TrainingSymptomTips() {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Symptom Recognition Tips</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {tips.map((t, i) => (
          <div key={i} className="p-3 rounded-xl border border-border bg-muted/50 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="label-medium text-text-primary">{t.title}</h3>
                <Badge variant="outline" className="text-xs">Tip</Badge>
              </div>
              <p className="body-medium text-text-secondary mt-1 leading-relaxed">{t.detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
