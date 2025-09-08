import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PreventiveStepsCard() {
  const steps = [
    'Boil water for at least 1 minute before drinking',
    'Wash hands with soap before eating and after using the toilet',
    'Use ORS if diarrhea occurs and seek medical advice',
    'Keep food covered; avoid street-side cut fruits',
    'Use mosquito nets and remove stagnant water',
    'Ensure vaccinations are up to date',
  ];

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          Preventive Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 body-medium text-text-secondary">
          {steps.map((s, i) => (<li key={i}>{s}</li>))}
        </ul>
      </CardContent>
    </Card>
  );
}
