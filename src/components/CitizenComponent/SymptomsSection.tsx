import SymptomsForm from './SymptomsForm';
import SymptomsHistory from './SymptomsHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

export default function SymptomsSection() {
  return (
    <section className="space-y-4">
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Symptoms Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Enable quick reporting of symptoms and review your previous reports.
        </CardContent>
      </Card>
      <SymptomsForm />
      <SymptomsHistory />
    </section>
  );
}
